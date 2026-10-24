import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const film = path.join(root, "public", "reklam", "film.html");
const outDir = path.join(root, "public", "reklam");
const FPS = 24;
const DURATION = 40;
const WIDTH = 1920;
const HEIGHT = 1080;

const samplesOnly = process.argv.includes("--samples");
const sampleTimes = [1.2, 3.4, 8.2, 12.5, 19.4, 22.6, 26.2, 28.8, 32.4, 37.4];

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForJson(url, tries = 40) {
  for (let i = 0; i < tries; i += 1) {
    try {
      const res = await fetch(url);
      if (res.ok) return res.json();
    } catch {
      /* chrome still booting */
    }
    await sleep(250);
  }
  throw new Error(`Chrome debugging endpoint did not open: ${url}`);
}

function writeWav(file, samples, sampleRate) {
  const dataSize = samples.length * 2;
  const buffer = Buffer.alloc(44 + dataSize);
  buffer.write("RIFF", 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write("WAVE", 8);
  buffer.write("fmt ", 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(1, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(sampleRate * 2, 28);
  buffer.writeUInt16LE(2, 32);
  buffer.writeUInt16LE(16, 34);
  buffer.write("data", 36);
  buffer.writeUInt32LE(dataSize, 40);
  for (let i = 0; i < samples.length; i += 1) {
    const clamped = Math.max(-1, Math.min(1, samples[i]));
    buffer.writeInt16LE(Math.round(clamped * 32767), 44 + i * 2);
  }
  fs.writeFileSync(file, buffer);
}

function buildScore(file) {
  const sampleRate = 44100;
  const n = sampleRate * DURATION;
  const chords = [
    [0, 10, [220, 261.63, 329.63]],
    [10, 10, [174.61, 220, 261.63]],
    [20, 10, [130.81, 196, 261.63]],
    [30, 10, [98, 146.83, 196, 246.94]],
  ];
  const raw = new Float32Array(n);
  for (const [start, length, freqs] of chords) {
    const a0 = Math.floor(start * sampleRate);
    const a1 = Math.min(n, Math.floor((start + length) * sampleRate));
    for (let i = a0; i < a1; i += 1) {
      const x = i / sampleRate - start;
      const attack = Math.min(1, x / 1.1);
      const release = Math.min(1, (length - x) / 1.4);
      let y = 0;
      freqs.forEach((f, idx) => {
        const amp = idx === 0 ? 0.55 : 0.28;
        y += Math.sin(2 * Math.PI * f * x) * amp;
        y += Math.sin(2 * Math.PI * f * 1.004 * x) * 0.12;
      });
      raw[i] += y * attack * release * 0.09;
    }
  }
  for (let i = 0; i < n; i += 1) {
    const x = i / sampleRate;
    raw[i] += Math.sin(2 * Math.PI * 55 * x) * 0.018 * (0.7 + 0.3 * Math.sin(2 * Math.PI * 0.25 * x));
    const edge = Math.min(1, x / 0.8, (DURATION - x) / 1.2);
    raw[i] *= edge;
  }
  const out = new Float32Array(n);
  let acc = 0;
  for (let i = 0; i < n; i += 1) {
    acc += 0.22 * (raw[i] - acc);
    out[i] = acc;
  }
  writeWav(file, out, sampleRate);
}

function connect(wsUrl) {
  const ws = new WebSocket(wsUrl);
  let nextId = 0;
  const pending = new Map();
  const opened = new Promise((resolve, reject) => {
    ws.addEventListener("open", resolve);
    ws.addEventListener("error", () => reject(new Error("DevTools socket failed")));
  });
  ws.addEventListener("message", (event) => {
    const msg = JSON.parse(event.data);
    if (!msg.id || !pending.has(msg.id)) return;
    const { resolve, reject } = pending.get(msg.id);
    pending.delete(msg.id);
    if (msg.error) reject(new Error(JSON.stringify(msg.error)));
    else resolve(msg.result);
  });
  return {
    ready: opened,
    send(method, params = {}) {
      const id = ++nextId;
      return new Promise((resolve, reject) => {
        pending.set(id, { resolve, reject });
        ws.send(JSON.stringify({ id, method, params }));
      });
    },
    close() {
      ws.close();
    },
  };
}

async function main() {
  fs.mkdirSync(outDir, { recursive: true });
  const frameDir = samplesOnly
    ? path.join("/tmp", "reklam-samples")
    : path.join("/tmp", "reklam-frames");
  fs.rmSync(frameDir, { recursive: true, force: true });
  fs.mkdirSync(frameDir, { recursive: true });

  const audioPath = path.join("/tmp", "rentcar-score.wav");
  if (!samplesOnly) buildScore(audioPath);

  const profile = path.join("/tmp", "chrome-reklam-profile");
  fs.rmSync(profile, { recursive: true, force: true });
  const chrome = spawn(
    "google-chrome",
    [
      "--headless=new",
      "--no-sandbox",
      "--disable-gpu",
      "--hide-scrollbars",
      "--disable-dev-shm-usage",
      "--remote-debugging-port=9222",
      `--user-data-dir=${profile}`,
      `--window-size=${WIDTH},${HEIGHT}`,
      "--force-device-scale-factor=1",
      "about:blank",
    ],
    { stdio: "ignore" }
  );

  try {
    await waitForJson("http://127.0.0.1:9222/json/version");
    const created = await fetch("http://127.0.0.1:9222/json/new?about:blank", {
      method: "PUT",
    }).then(async (res) => {
      if (res.ok) return res.json();
      const fallback = await fetch("http://127.0.0.1:9222/json/new?about:blank");
      if (!fallback.ok) throw new Error(`json/new failed: ${res.status}`);
      return fallback.json();
    });
    const cdp = connect(created.webSocketDebuggerUrl);
    await cdp.ready;
    await cdp.send("Page.enable");
    await cdp.send("Runtime.enable");
    await cdp.send("Emulation.setDeviceMetricsOverride", {
      width: WIDTH,
      height: HEIGHT,
      deviceScaleFactor: 1,
      mobile: false,
    });
    await cdp.send("Page.navigate", { url: `file://${film}?capture=1` });
    for (let i = 0; i < 40; i += 1) {
      const result = await cdp.send("Runtime.evaluate", {
        expression: "typeof window.renderAt === 'function'",
        returnByValue: true,
      });
      if (result.result?.value === true) break;
      await sleep(100);
      if (i === 39) throw new Error("film.html did not expose renderAt");
    }

    const times = samplesOnly
      ? sampleTimes
      : Array.from({ length: FPS * DURATION }, (_, i) => i / FPS);

    for (let i = 0; i < times.length; i += 1) {
      await cdp.send("Runtime.evaluate", {
        expression: `window.renderAt(${times[i]})`,
      });
      const shot = await cdp.send("Page.captureScreenshot", {
        format: "jpeg",
        quality: samplesOnly ? 90 : 82,
        fromSurface: true,
        captureBeyondViewport: false,
      });
      const name = samplesOnly
        ? `t-${String(times[i]).replace(".", "_")}.jpg`
        : `frame-${String(i).padStart(4, "0")}.jpg`;
      fs.writeFileSync(path.join(frameDir, name), Buffer.from(shot.data, "base64"));
      if (!samplesOnly && i % 48 === 0) {
        console.log(`frame ${i + 1}/${times.length}`);
      }
    }
    cdp.close();

    if (samplesOnly) {
      console.log(frameDir);
      return;
    }

    const posterSrc = path.join(frameDir, "frame-0082.jpg");
    fs.copyFileSync(posterSrc, path.join(outDir, "poster.jpg"));
    await new Promise((resolve, reject) => {
      const ff = spawn(
        "ffmpeg",
        [
          "-y",
          "-framerate",
          String(FPS),
          "-i",
          path.join(frameDir, "frame-%04d.jpg"),
          "-i",
          audioPath,
          "-c:v",
          "libx264",
          "-pix_fmt",
          "yuv420p",
          "-crf",
          "20",
          "-preset",
          "medium",
          "-movflags",
          "+faststart",
          "-af",
          "volume=9dB",
          "-c:a",
          "aac",
          "-b:a",
          "160k",
          "-shortest",
          path.join(outDir, "rentcar-reklam.mp4"),
        ],
        { stdio: "inherit" }
      );
      ff.on("exit", (code) => (code === 0 ? resolve() : reject(new Error(`ffmpeg ${code}`))));
    });
    const stat = fs.statSync(path.join(outDir, "rentcar-reklam.mp4"));
    console.log(`wrote ${path.join(outDir, "rentcar-reklam.mp4")} (${stat.size} bytes)`);
  } finally {
    chrome.kill("SIGKILL");
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
