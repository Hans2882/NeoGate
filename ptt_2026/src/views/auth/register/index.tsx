import Head from 'next/head'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { auth } from '@/utils/db/firebase'
import styles from '@/views/auth/auth.module.css'

export default function ViewRegisterPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('') // <--- Tambah state password
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // Note: Middleware withAuth.ts lu udah jagain rute, 
  // jadi useEffect isAuthenticated di sini opsional.

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsLoading(true)
    setMessage('')

    if (!name.trim() || !email.trim() || !password.trim()) {
      setMessage('Semua data harus diisi, Cik!')
      setIsLoading(false)
      return
    }

    if (password.length < 6) {
      setMessage('Password minimal 6 karakter sesuai aturan Firebase.')
      setIsLoading(false)
      return
    }

    try {
      // 1. Daftarin ke Firebase Auth
      await createUserWithEmailAndPassword(auth, email, password)
      
      // 2. Kalau sukses, arahin ke login biar user masuk pake kredensial baru
      // Nama petugas bisa lu simpen di profile Firebase nanti kalau perlu
      router.replace('/auth/login')
    } catch (error: any) {
      setIsLoading(false)
      if (error.code === 'auth/email-already-in-use') {
        setMessage('Email udah kepake. Pake email lain dah.')
      } else if (error.code === 'auth/invalid-email') {
        setMessage('Format email lu salah, Cik.')
      } else {
        setMessage('Gagal daftar: ' + error.message)
      }
    }
  }

  return (
    <>
      <Head>
        <title>Register - NeoGate</title>
      </Head>

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

              {message ? <div className={styles.alert}>{message}</div> : null}

              <form className={styles.form} onSubmit={handleSubmit}>
                <label className={styles.field}>
                  Nama Lengkap
                  <input
                    className={styles.input}
                    type="text"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Contoh: Fandy Wahyu"
                    required
                  />
                </label>

                <label className={styles.field}>
                  Email
                  <input
                    className={styles.input}
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="nama@email.com"
                    required
                  />
                </label>

                <label className={styles.field}>
                  Password
                  <input
                    className={styles.input}
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
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
                <a className={styles.switchLink} href="/auth/login">
                  Login di sini
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}