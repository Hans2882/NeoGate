import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { getRegisteredUser, isAuthenticated, loginUser } from '../lib/auth'
import styles from '../styles/auth.module.css'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (isAuthenticated()) {
      router.replace('/dashboard')
    }
  }, [router])

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const registeredUser = getRegisteredUser()

    if (!registeredUser) {
      setMessage('Belum ada akun. Silakan register dulu.')
      return
    }

    if (registeredUser.email.toLowerCase() !== email.trim().toLowerCase()) {
      setMessage('Email belum terdaftar. Coba register atau cek input Anda.')
      return
    }

    loginUser(email.trim(), name.trim() || registeredUser.name)
    router.replace('/dashboard')
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
                <div>
                  <div className={styles.eyebrow}>NeoGate</div>
                  <h1 className={styles.title}>Masuk</h1>
                </div>
              </div>
              <p className={styles.description}>
                Gunakan akun yang sudah didaftarkan untuk membuka dashboard palang kereta, melihat grafik trafik,
                dan mengatur sistem.
              </p>
            </div>

          </div>

          <div className={styles.formPanel}>
            <div className={styles.formCard}>
              <div>
                <h2 className={styles.formTitle}>Login</h2>
                <p className={styles.formSubtitle}>Masukkan email akun yang sudah Anda buat.</p>
              </div>

              {message ? <div className={styles.alert}>{message}</div> : null}

              <form className={styles.form} onSubmit={handleSubmit}>
                <label className={styles.field}>
                  Nama
                  <input
                    className={styles.input}
                    type="text"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Masukkan nama"
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

                <button className={styles.buttonPrimary} type="submit">
                  Masuk ke Dashboard
                </button>
              </form>

              <div className={styles.linkRow}>
                <span>Belum punya akun?</span>
                <a className={styles.switchLink} href="/register">
                  Register di sini
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
