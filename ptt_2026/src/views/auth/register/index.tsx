import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { isAuthenticated, registerUser } from '@/lib/auth'
import styles from '@/views/auth/auth.module.css'

export default function ViewRegisterPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (isAuthenticated()) {
      router.replace('/auth/dashboard')
    }
  }, [router])

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!name.trim() || !email.trim()) {
      setMessage('Nama dan email harus diisi.')
      return
    }

    registerUser({ name: name.trim(), email: email.trim() })
    router.replace('/dashboard')
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
                <div>
                  <div className={styles.eyebrow}>NeoGate</div>
                  <h1 className={styles.title}>Buat akun</h1>
                </div>
              </div>
              <p className={styles.description}>
                Registrasi dipakai sebagai gerbang awal sebelum masuk ke dashboard dan settings aplikasi monitoring
                palang kereta.
              </p>
            </div>
          </div>

          <div className={styles.formPanel}>
            <div className={styles.formCard}>
              <div>
                <h2 className={styles.formTitle}>Register</h2>
                <p className={styles.formSubtitle}>Isi nama dan email untuk membuat akun lokal.</p>
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
                    placeholder="Contoh: John Doe"
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

                <button className={styles.buttonPrimary} type="submit">
                  Buat Akun
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