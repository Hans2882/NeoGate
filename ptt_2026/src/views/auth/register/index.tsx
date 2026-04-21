import Head from 'next/head'
import { useRouter } from 'next/router'
import { useState } from 'react'
// import { createUserWithEmailAndPassword } from 'firebase/auth'
// import { auth } from '@/utils/db/firebase'
import styles from '@/views/auth/auth.module.css'
import { signUp } from "@/utils/db/firebaseService";
export default function ViewRegisterPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true); // Aktifin loading biar user tau sistem lagi kerja

    // Pake State yang udah lu bikin (name, email, password)
    // Gak perlu event.target.name.value lagi
    const data = {
      name: name,
      email: email,
      password: password,
    };

    const result = await signUp(data);
    
    if (result.status) {
      alert("Akun berhasil dibuat!");
      router.push("/auth/login");
    } else {
      setIsLoading(false);
      alert("Gagal daftar, coba cek koneksi atau database lu Cik.");
    }
  };

  return (
    <>
      <Head><title>Register - NeoGate</title></Head>
      <main className={styles.page}>
        <section className={styles.shell}>
          <div className={styles.hero}>
            <div>
              <div className={styles.brandRow}>
                <div className={styles.eyebrow}>NeoGate</div>
                <h1 className={styles.title}>Buat akun</h1>
              </div>
              <p className={styles.description}>
                Registrasi dipakai sebagai gerbang awal untuk mendapatkan akses kontrol penuh
                ke sistem monitoring palang kereta NeoGate.
              </p>
            </div>
          </div>

          <div className={styles.formPanel}>
            <div className={styles.formCard}>
              <div>
                <h2 className={styles.formTitle}>Register Petugas</h2>
                <p className={styles.formSubtitle}>Gunakan email aktif untuk mendaftarkan akun baru.</p>
              </div>

              {message && <div className={styles.alert}>{message}</div>}

              <form className={styles.form} onSubmit={handleSubmit}>
                <label className={styles.field}>
                  Nama Lengkap
                  <input
                    className={styles.input}
                    type="text"
                    value={name} // State name
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Contoh: Fandy Wahyu"
                    required
                  />
                </label>

                <label className={styles.field}>
                  Email
                  <input
                    className={styles.input}
                    type="email"
                    value={email} // State email
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nama@email.com"
                    required
                  />
                </label>

                <label className={styles.field}>
                  Password
                  <input
                    className={styles.input}
                    type="password"
                    value={password} // State password
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimal 6 karakter"
                    required
                  />
                </label>

                <button
                  className={styles.buttonPrimary}
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? 'Mendaftarkan...' : 'Buat Akun'}
                </button>
              </form>
              <div className={styles.linkRow}>
                <span>Sudah punya akun?</span>
                <a className={styles.switchLink} href="/auth/login">Login di sini</a>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}