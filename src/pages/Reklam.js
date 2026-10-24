import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import './Reklam.css';

const CHAPTERS = [
  { time: 0, label: 'Açılış' },
  { time: 6.4, label: 'Filo' },
  { time: 18.2, label: 'Teslimat' },
  { time: 30.6, label: 'Donanım' },
  { time: 35.6, label: 'Hemen kirala' },
];

const STEPS = [
  {
    n: '1',
    title: 'Seç',
    text: 'Araç kontrolde tip, yakıt, vites ve fiyat aralığına göre listeyi daralt.',
  },
  {
    n: '2',
    title: 'İncele',
    text: 'Yıl, vites, yakıt, donanım ve günlük bedeli gör. Ardından Hemen Kirala.',
  },
  {
    n: '3',
    title: 'Rezerve et',
    text: 'Ad, soyad, e-posta, telefon, T.C. kimlik, ehliyet, başlangıç ve bitiş tarihi.',
  },
  {
    n: '4',
    title: 'Teslim al',
    text: '“Rezervasyon başarıyla oluşturuldu.” Araç teslimat için hazırdır.',
  },
];

const FLEET = [
  ['BMW 3 Serisi', '2022 · Otomatik · Dizel', '₺1,200/gün'],
  ['Mercedes C Class', '2023 · Otomatik · Benzinli', '₺1,500/gün'],
  ['Audi A4', '2022 · Otomatik · Dizel', '₺1,300/gün'],
  ['Volkswagen Golf', '2021 · Manuel · Benzinli', '₺900/gün'],
  ['Toyota Corolla', '2023 · Otomatik · Hibrit', '₺1,100/gün'],
  ['Ford Focus', '2022 · Manuel · Dizel', '₺1,000/gün'],
];

const Reklam = () => {
  const videoRef = useRef(null);

  const seek = (time) => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = time;
    video.play();
  };

  return (
    <div className="reklam-page">
      <div className="reklam-wrap">
        <p className="reklam-kicker">RentCar · İstanbul</p>
        <h1>Teslimat ve filo filmi</h1>
        <p className="reklam-lede">
          Kırk saniyelik film, sistemdeki altı aracın günlük bedellerini ve
          rezervasyondan teslimata giden dört adımı anlatır.
        </p>

        <video
          ref={videoRef}
          className="reklam-video"
          src="/reklam/rentcar-reklam.mp4"
          poster="/reklam/poster.jpg"
          controls
          playsInline
          preload="metadata"
        />

        <div className="reklam-chapters">
          {CHAPTERS.map((chapter) => (
            <button key={chapter.label} type="button" onClick={() => seek(chapter.time)}>
              {chapter.label}
            </button>
          ))}
        </div>

        <section>
          <h2>Teslimat sırası</h2>
          <div className="reklam-steps">
            {STEPS.map((step) => (
              <article key={step.n}>
                <span>{step.n}</span>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section>
          <h2>Filodaki araçlar</h2>
          <div className="reklam-fleet">
            {FLEET.map(([name, meta, price]) => (
              <article key={name}>
                <h3>{name}</h3>
                <p>{meta}</p>
                <strong>{price}</strong>
              </article>
            ))}
          </div>
        </section>

        <Link className="reklam-cta" to="/arac-kontrol">
          Araçları gör
        </Link>
      </div>
    </div>
  );
};

export default Reklam;
