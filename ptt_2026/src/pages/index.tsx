import Head from "next/head";
import Link from "next/link";
import { useEffect } from "react";
import styles from "@/styles/landingpage.module.css";
import compStyles from "@/styles/components/components.module.scss";
import IoTAnimation from "@/components/IoTAnimation";

export default function Home() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add(styles.show);
        });
      },
      { threshold: 0.12 },
    );
    document
      .querySelectorAll(`.${styles.reveal}`)
      .forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <>
      <Head>
        <title>
          NeoGate — Sistem Monitoring Palang Pintu Kereta Api Berbasis IoT
        </title>
        <meta
          name="description"
          content="Platform monitoring dan pengendalian palang pintu kereta api secara real-time."
        />
      </Head>

      <div className={styles.page}>
        <a className={styles.skipLink} href="#main">
          Lewati ke konten
        </a>
        <div className={styles.container}>
          <header className={styles.navbar}>
            <div className={styles.brand}>
              <span className={compStyles.brandTop}>NeoGate</span>
            </div>

            <nav>
              <ul className={styles.navlist}>
                <li>
                  <a href="#beranda">Beranda</a>
                </li>
                <li>
                  <a href="#tentang">Tentang</a>
                </li>
                <li>
                  <a href="#fitur">Fitur</a>
                </li>
                <li>
                  <a href="#arsitektur">Arsitektur</a>
                </li>
                <li>
                  <a href="#teknologi">Teknologi</a>
                </li>
                <li>
                  <a href="/auth/login" className={styles.ctaButton}>
                    Login Dashboard
                  </a>
                </li>
              </ul>
            </nav>
          </header>

          <main id="main">
            <section id="beranda" className={styles.hero}>
              <div>
                <div className={compStyles.kicker}>Sistem Monitoring</div>
                <h1 className={compStyles.pageTitle}>
                  Sistem Monitoring
                  <br />
                  Palang Pintu Kereta Api
                  <br />
                  Berbasis IoT
                </h1>

                <p className={styles.heroDesc}>
                  Platform monitoring dan pengendalian palang pintu kereta api
                  secara real-time yang membantu meningkatkan keselamatan,
                  efisiensi operasional, dan kecepatan pengambilan keputusan.
                </p>

                <div className={`${styles.statRow} ${styles.reveal}`}>
                  <div className={styles.statCard}>
                    <div>24/7 Monitoring</div>
                    <strong>Real-Time Data</strong>
                    <div
                      style={{ marginTop: 6, color: "rgba(230,238,252,0.7)" }}
                    >
                      Aktivitas & status perangkat
                    </div>
                  </div>
                  <div className={styles.statCard}>
                    <div>Perangkat Online</div>
                    <strong>24</strong>
                    <div
                      style={{ marginTop: 6, color: "rgba(230,238,252,0.7)" }}
                    >
                      Sensor terhubung
                    </div>
                  </div>
                  <div className={styles.statCard}>
                    <div>Uptime Sistem</div>
                    <strong>99.9%</strong>
                    <div
                      style={{ marginTop: 6, color: "rgba(230,238,252,0.7)" }}
                    >
                      Terakhir diperbarui 2 menit lalu
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    marginTop: 12,
                    display: "flex",
                    gap: 8,
                    alignItems: "center",
                  }}
                  className={styles.reveal}
                >
                  <div className={styles.indicator}>
                    <span
                      className={`${styles.dot} ${styles["dot--green"]}`}
                    ></span>{" "}
                    System Online
                  </div>
                  <div className={styles.indicator}>
                    <span
                      className={`${styles.dot} ${styles["dot--green"]}`}
                    ></span>{" "}
                    Firebase Connected
                  </div>
                  <div className={styles.indicator}>
                    <span
                      className={`${styles.dot} ${styles["dot--green"]}`}
                    ></span>{" "}
                    Sensors Active
                  </div>
                </div>

                <div className={styles.heroActions}>
                  <a href="#tentang" className={styles.secondary}>
                    Pelajari Sistem
                  </a>
                </div>
              </div>
              <div className={styles.heroVisual}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 12,
                  }}
                >
                  <IoTAnimation />
                  <div
                    style={{
                      display: "flex",
                      gap: 10,
                      alignItems: "center",
                      color: "rgba(230,238,252,0.9)",
                    }}
                    className={styles.reveal}
                  >
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 8 }}
                    >
                      <span>🚆</span>
                      <span>Kereta</span>
                    </div>
                    <span>→</span>
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 8 }}
                    >
                      <span>📡</span>
                      <span>Sensor</span>
                    </div>
                    <span>→</span>
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 8 }}
                    >
                      <span>⚙️</span>
                      <span>ESP32</span>
                    </div>
                    <span>→</span>
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 8 }}
                    >
                      <span>☁️</span>
                      <span>Firebase</span>
                    </div>
                    <span>→</span>
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 8 }}
                    >
                      <span>💻</span>
                      <span>Dashboard</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section id="tentang" className={styles.section}>
              <div className={styles.container}>
                <h2>Mengapa Sistem Ini Dibutuhkan?</h2>
                <p>
                  Risiko kecelakaan di perlintasan kereta dan keterlambatan
                  informasi kepada petugas membuat kebutuhan monitoring otomatis
                  menjadi krusial. Sistem ini memanfaatkan teknologi IoT untuk
                  mendeteksi kereta, mengontrol palang, dan menyampaikan
                  informasi secara real-time.
                </p>
              </div>
            </section>

            <section id="fitur" className={styles.section}>
              <div className={styles.container}>
                <h2>Fitur Utama</h2>
                <div className={styles.features}>
                  <div
                    className={`${styles.featureCard} ${styles.glowHover} ${styles.reveal}`}
                  >
                    <h3>Monitoring Real-Time</h3>
                    <p>
                      Memantau kondisi perangkat dan status palang secara
                      langsung.
                    </p>
                  </div>
                  <div className={styles.featureCard}>
                    <h3>Kontrol Otomatis</h3>
                    <p>Pengoperasian palang berdasarkan data sensor.</p>
                  </div>
                  <div className={styles.featureCard}>
                    <h3>Notifikasi Peringatan</h3>
                    <p>
                      Memberikan peringatan saat kereta terdeteksi atau terjadi
                      gangguan.
                    </p>
                  </div>
                  <div className={styles.featureCard}>
                    <h3>Penyimpanan Data</h3>
                    <p>
                      Menyimpan histori aktivitas untuk analisis dan pelaporan.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section id="cara-kerja" className={styles.section}>
              <div className={styles.container}>
                <h2>Cara Kerja Sistem</h2>

                <div className={styles.workflowCards}>
                  <div className={styles.workflowCard}>
                    <span>01</span>
                    <h3>Deteksi Kereta</h3>
                    <p>
                      Sensor mendeteksi keberadaan kereta yang mendekati area
                      perlintasan.
                    </p>
                  </div>

                  <div className={styles.workflowCard}>
                    <span>02</span>
                    <h3>Pemrosesan Data</h3>
                    <p>
                      ESP32 menerima dan memproses data dari sensor untuk
                      menentukan kondisi sistem.
                    </p>
                  </div>

                  <div className={styles.workflowCard}>
                    <span>03</span>
                    <h3>Sinkronisasi Cloud</h3>
                    <p>
                      Data dikirim ke Firebase atau API sehingga dapat diakses
                      secara real-time.
                    </p>
                  </div>

                  <div className={styles.workflowCard}>
                    <span>04</span>
                    <h3>Monitoring Dashboard</h3>
                    <p>
                      Dashboard diperbarui secara otomatis sehingga petugas
                      dapat memantau kondisi perlintasan kapan saja.
                    </p>
                  </div>
                </div>

                <div className={styles.architectureCard}>
                  <svg
                    width="100%"
                    height="280"
                    viewBox="0 0 900 280"
                    fill="none"
                  >
                    {/* Kereta */}
                    <rect
                      x="40"
                      y="80"
                      width="140"
                      height="70"
                      rx="16"
                      stroke="#6dd6ff"
                      strokeWidth="2"
                    />
                    <text x="110" y="120" fill="#6dd6ff" textAnchor="middle">
                      🚆 Kereta
                    </text>

                    {/* Sensor */}
                    <rect
                      x="260"
                      y="80"
                      width="140"
                      height="70"
                      rx="16"
                      stroke="#79dfff"
                      strokeWidth="2"
                    />
                    <text x="330" y="120" fill="#79dfff" textAnchor="middle">
                      📡 Sensor
                    </text>

                    {/* ESP32 */}
                    <rect
                      x="480"
                      y="80"
                      width="140"
                      height="70"
                      rx="16"
                      stroke="#ffd36f"
                      strokeWidth="2"
                    />
                    <text x="550" y="120" fill="#ffd36f" textAnchor="middle">
                      ⚙️ ESP32
                    </text>

                    {/* Firebase */}
                    <rect
                      x="700"
                      y="80"
                      width="140"
                      height="70"
                      rx="16"
                      stroke="#65f5d6"
                      strokeWidth="2"
                    />
                    <text x="770" y="120" fill="#65f5d6" textAnchor="middle">
                      ☁ Firebase
                    </text>

                    {/* Dashboard */}
                    <rect
                      x="360"
                      y="200"
                      width="180"
                      height="60"
                      rx="16"
                      stroke="#cfd6ff"
                      strokeWidth="2"
                    />
                    <text x="450" y="236" fill="#cfd6ff" textAnchor="middle">
                      💻 Dashboard Web
                    </text>

                    {/* Arrows */}
                    <path d="M180 115 H260" stroke="#6dd6ff" strokeWidth="3" />

                    <path d="M400 115 H480" stroke="#6dd6ff" strokeWidth="3" />

                    <path d="M620 115 H700" stroke="#6dd6ff" strokeWidth="3" />

                    <path
                      d="M770 150 L450 200"
                      stroke="#cfd6ff"
                      strokeWidth="3"
                    />
                  </svg>

                  <p className={styles.archDesc}>
                    Data dari sensor dikirim ke ESP32, kemudian diteruskan ke
                    Firebase atau API. Dashboard monitoring menerima pembaruan
                    data secara real-time sehingga petugas dapat memantau
                    kondisi perlintasan dan mengambil tindakan dengan cepat.
                  </p>
                </div>
              </div>
            </section>

            <section className={`${styles.ctaBlock} ${styles.reveal}`}>
              <div
                className={styles.container}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 16,
                }}
              >
                <div>
                  <strong>Siap menggunakan sistem monitoring?</strong>
                  <div style={{ color: "rgba(230,238,252,0.8)" }}>
                    Masuk ke dashboard untuk melihat demo atau integrasi.
                  </div>
                </div>
                <div style={{ display: "flex", gap: 12 }}>
                  <Link href="/auth/login" className={styles.ctaButton}>
                    Login Dashboard
                  </Link>
                  <a href="#kontak" className={styles.secondary}>
                    Hubungi Kami
                  </a>
                </div>
              </div>
            </section>

            <section id="teknologi" className={styles.section}>
              <div className={styles.container}>
                <h2>Teknologi yang Digunakan</h2>
                <div className={styles.techGrid}>
                  <div className={styles.techRowTop}>
                    <div className={styles.techCard}>
                      <div className={styles.techIcon} aria-hidden>
                        <svg
                          viewBox="0 0 24 24"
                          width="28"
                          height="28"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <rect
                            x="3"
                            y="3"
                            width="18"
                            height="18"
                            rx="3"
                            stroke="#6dd6ff"
                            strokeWidth="1.5"
                          />
                          <path
                            d="M8 8h8M8 12h8M8 16h8"
                            stroke="#7fdcff"
                            strokeWidth="1.2"
                            strokeLinecap="round"
                          />
                        </svg>
                      </div>
                      <div className={styles.techInfo}>
                        <strong>ESP32</strong>
                        <div>
                          Mikrokontroler untuk membaca sensor, mengolah sinyal,
                          dan mengirim data via Wi‑Fi.
                        </div>
                      </div>
                    </div>

                    <div className={styles.techCard}>
                      <div className={styles.techIcon} aria-hidden>
                        <svg
                          viewBox="0 0 24 24"
                          width="28"
                          height="28"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <circle
                            cx="12"
                            cy="12"
                            r="5"
                            stroke="#6fe8c9"
                            strokeWidth="1.5"
                          />
                          <path
                            d="M12 3v3M12 18v3M3 12h3M18 12h3"
                            stroke="#7fdcff"
                            strokeWidth="1.2"
                            strokeLinecap="round"
                          />
                        </svg>
                      </div>
                      <div className={styles.techInfo}>
                        <strong>Sensor Deteksi</strong>
                        <div>Mendeteksi keberadaan kereta api.</div>
                      </div>
                    </div>

                    <div className={styles.techCard}>
                      <div className={styles.techIcon} aria-hidden>
                        <svg
                          viewBox="0 0 24 24"
                          width="28"
                          height="28"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <rect
                            x="4"
                            y="6"
                            width="16"
                            height="12"
                            rx="2"
                            stroke="#ffd36f"
                            strokeWidth="1.5"
                          />
                          <path
                            d="M8 10h8M8 14h8"
                            stroke="#ffebaf"
                            strokeWidth="1"
                            strokeLinecap="round"
                          />
                        </svg>
                      </div>
                      <div className={styles.techInfo}>
                        <strong>Firebase / MySQL</strong>
                        <div>
                          Sinkronisasi data real-time, autentikasi, dan
                          penyimpanan histori aktivitas.
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={styles.techRowBottom}>
                    <div className={styles.techCard}>
                      <div className={styles.techIcon} aria-hidden>
                        <svg
                          viewBox="0 0 24 24"
                          width="28"
                          height="28"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M3 7h18v10H3z"
                            stroke="#ff9fb8"
                            strokeWidth="1.5"
                            fill="none"
                          />
                          <path
                            d="M7 11h10"
                            stroke="#ffd6e6"
                            strokeWidth="1.2"
                            strokeLinecap="round"
                          />
                        </svg>
                      </div>
                      <div className={styles.techInfo}>
                        <strong>Laravel</strong>
                        <div>Backend dan API sistem.</div>
                      </div>
                    </div>

                    <div className={styles.techCard}>
                      <div className={styles.techIcon} aria-hidden>
                        <svg
                          viewBox="0 0 24 24"
                          width="28"
                          height="28"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M4 4h16v16H4z"
                            stroke="#cdd6ff"
                            strokeWidth="1.5"
                          />
                          <path d="M8 8h8v8H8z" fill="#6dd6ff" opacity="0.12" />
                        </svg>
                      </div>
                      <div className={styles.techInfo}>
                        <strong>Next.js</strong>
                        <div>
                          Frontend dashboard yang cepat, SSR/ISR, dan integrasi
                          WebSocket untuk live updates.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section id="keunggulan" className={styles.section}>
              <div className={styles.container}>
                <h2>Keunggulan Sistem</h2>
                <div className={styles.advantages}>
                  <div className={styles.advItem}>
                    <strong>Monitoring Cepat</strong>
                    <div>Informasi diperoleh secara real-time.</div>
                  </div>
                  <div className={styles.advItem}>
                    <strong>Meningkatkan Keselamatan</strong>
                    <div>Mengurangi risiko kecelakaan di perlintasan.</div>
                  </div>
                  <div className={styles.advItem}>
                    <strong>Efisiensi Operasional</strong>
                    <div>Mengurangi kebutuhan pemantauan manual.</div>
                  </div>
                  <div className={styles.advItem}>
                    <strong>Terintegrasi</strong>
                    <div>
                      Semua data tersimpan dan dapat diakses melalui dashboard.
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <footer className={styles.footer}>
              <div className={styles.container}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 16,
                    flexWrap: "wrap",
                  }}
                >
                  <div
                    style={{ display: "flex", flexDirection: "column", gap: 6 }}
                  >
                    <strong>NeoGate</strong>
                    <div>
                      Sistem Monitoring Palang Pintu Kereta Api Berbasis IoT
                    </div>
                    <div style={{ marginTop: 8 }}>
                      © 2026 NeoGate. All rights reserved.
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
                    <div>
                      <strong>Navigasi</strong>
                      <div>
                        <a href="#beranda">Beranda</a>
                      </div>
                      <div>
                        <a href="#fitur">Fitur</a>
                      </div>
                      <div>
                        <a href="#arsitektur">Arsitektur</a>
                      </div>
                    </div>
                    <div>
                      <strong>Sistem</strong>
                      <div>
                        <a href="/auth/login">Login</a>
                      </div>
                      <div>
                        <a href="/dashboard">Dashboard</a>
                      </div>
                    </div>
                    <div>
                      <strong>Teknologi</strong>
                      <div>ESP32</div>
                      <div>Firebase</div>
                      <div>Next.js</div>
                    </div>
                  </div>
                </div>
              </div>
            </footer>
          </main>
        </div>
      </div>
    </>
  );
}
