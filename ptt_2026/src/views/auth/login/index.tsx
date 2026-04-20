import Head from 'next/head'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { signInWithEmailAndPassword } from 'firebase/auth' // Pakai SDK Firebase langsung
import { auth } from '@/utils/db/firebase' // Import config firebase lu
import styles from '@/views/auth/auth.module.css'

export default function ViewLoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsLoading(true)
    setMessage('')

    // Ambil data dari form
    const formData = new FormData(event.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      // Jalur Jobsheet: Langsung tembak Firebase Client SDK
      await signInWithEmailAndPassword(auth, email, password)
      
      // Simpan status login di localStorage biar simpel kayak di JS kampus
      localStorage.setItem('isLogin', 'true')
      
      // Berhasil? Gass ke dashboard
      router.push('/dashboard')
    } catch (error: any) {
      setIsLoading(false)
      // Cek error buat QA
      if (error.code === 'auth/configuration-not-found') {
        setMessage('Cik, lu belum klik ENABLE Email/Password di Firebase Console!')
      } else if (error.code === 'auth/invalid-credential') {
        setMessage('Email atau Password salah, cek lagi dah.')
      } else {
        setMessage('Gagal login: ' + error.message)
      }
    }
  }

  return (
    <>
      <Head>
        <title>Login - NeoGate</title>
      </Head>

      <main className={styles.page}>
        <section className={styles.shell}>
          <div className={styles.hero}>
            <div>
              <div className={styles.brandRow}>
                <div className={styles.eyebrow}>NeoGate</div>
                <h1 className={styles.title}>Masuk</h1>
              </div>
              <p className={styles.description}>
                Gunakan akun Firebase Anda untuk mengakses kendali palang kereta NeoGate secara real-time.
              </p>
            </div>
          </div>

          <div className={styles.formPanel}>
            <div className={styles.formCard}>
              <div>
                <h2 className={styles.formTitle}>Login Petugas</h2>
                <p className={styles.formSubtitle}>Masuk dengan Email & Password yang sudah didaftarkan.</p>
              </div>

              {message && <div className={styles.alert}>{message}</div>}

              <form className={styles.form} onSubmit={handleSubmit}>
                <label className={styles.field}>
                  Email
                  <input
                    name="email"
                    className={styles.input}
                    type="email"
                    placeholder="nama@email.com"
                    required
                  />
                </label>

                <label className={styles.field}>
                  Password
                  <input
                    name="password"
                    className={styles.input}
                    type="password"
                    placeholder="••••••••"
                    required
                  />
                </label>

                <button 
                  className={styles.buttonPrimary} 
                  type="submit" 
                  disabled={isLoading}
                >
                  {isLoading ? 'Lagi ngecek database...' : 'Masuk ke Dashboard'}
                </button>
              </form>

              <div className={styles.linkRow}>
                <span>Belum punya akun?</span>
                <a className={styles.switchLink} href="/auth/register">
                  Daftar Petugas Baru
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}