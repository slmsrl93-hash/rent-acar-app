# Sabit PC ↔ Cloud Agent kalıcı bağlantı

Bu Linux sohbet **kendini Windows’a taşıyamaz**. Kalıcı çözüm: sabit PC’de My Machines worker’ının sürekli ayakta olması + yeni ajanı **My Machines → sabit-pc** ile açmak.

## Neden şimdi olmuyor?

| Kontrol | Durum |
|--------|--------|
| Worker süreci (`sabit-pc`) | Bağlı görünebilir |
| `repos` listesi | Boşsa (`[]`) Vite kökünden başlatılmamış demektir |
| Bu sohbet | `usePrivateWorker: false` → Linux bulut VM |
| Canlı kod | Private Onurcar Vite; public `rent-acar-app` stub değil |

## Tek seferlik kurulum (sabit PC, PowerShell)

1. Canlı **Onurcar Vite** klasörünü bilinen bir yola koyun (mümkünse ASCII yol: `C:\projeler\onurcar`).
2. Bu repodaki scripti o makineye alın: `scripts/kur-sabit-pc-worker.ps1`
3. PowerShell’de:

```powershell
# Gerekirse:
# $env:ONURCAR_ROOT = "C:\projeler\onurcar"
Set-ExecutionPolicy -Scope Process Bypass
cd C:\yol\scriptlerin-oldugu-yer
.\kur-sabit-pc-worker.ps1
```

Script: CLI kurar, Git Bash kontrol eder, Startup’a ekler, `agent worker start --name sabit-pc --worker-dir <vite-kökü>` çalıştırır.

4. Deploy için aynı PC’de bir kez:

```powershell
npm i -g vercel
vercel login
# Vite kökünde onurcar projesine link
```

## Her ajan için (kalıcı kullanım)

1. Worker penceresi / Startup açık olsun (`agent worker` çalışıyor).
2. https://cursor.com/agents → **Where it runs / My Machines → sabit-pc**
3. Repo olarak mümkünse canlı Vite’nin git remote’u; yoksa **no-repo / any path** ile makineyi seçip görev verin.
4. Bu eski Linux sohbete yazmak worker’ı sürmez — yeni sohbet şart.

## Slack / GitHub tetik (isteğe bağlı)

Worker adı `sabit-pc` iken:

- Slack: `@Cursor worker=sabit-pc …`
- GitHub: `@cursoragent worker=sabit-pc …`

Hedef repo, worker’ın `--worker-dir` git remote’u ile aynı olmalı.

## Bakım yaması (kod)

Worker üzerinde ajan açıldıktan sonra veya elle:

```powershell
node fix-onurcar-bakim.mjs "C:\yol\onurcar-vite"
# sonra sadece onurcar production deploy
```

`calistir-onurcar-yama.ps1` aynı işi kök arayarak yapar.

## Doğrulama

Sabit PC’de:

```powershell
agent worker debug
agent --version
where.exe bash
vercel whoami
```

Cursor tarafında yeni ajanın run bilgisinde `usePrivateWorker: true` ve `privateWorkerId` dolu olmalı.
