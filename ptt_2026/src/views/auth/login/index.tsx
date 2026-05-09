import Head from 'next/head'
import { useRouter } from 'next/router'
import { useState } from 'react'
import styles from '@/views/auth/auth.module.css'
import { signIn } from '@/utils/db/firebaseService'

export default function ViewLoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async () => {
    setIsLoading(true)
    setMessage('')

    const result = await signIn(email, password)

    if (!result.status) {
      setMessage(String(result.message || 'Login gagal'))
      setIsLoading(false)
      return
    }

    const role = result.data?.role || 'operator'
    localStorage.setItem('isLogin', 'true')
    localStorage.setItem('user', JSON.stringify(result.data))
    document.cookie = 'isLogin=true; path=/'

    setIsLoading(false)
    if (role === 'admin' || role === 'superadmin') {
      router.push('/admin/operators')
      return
    }

    router.push('/dashboard')
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    await handleLogin()
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
                <h2 className={styles.formTitle}>Login</h2>
                <p className={styles.formSubtitle}>Sistem Keamanan Perlintasan Kereta Api</p>
              </div>

              {message && <div className={styles.alert}>{message}</div>}

              <form className={styles.form} onSubmit={handleSubmit}>
                <label className={styles.field}>
                  Email
                  <input
                    name='email'
                    className={styles.input}
                    type='email'
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder='nama@email.com'
                    required
                  />
                </label>

                <label className={styles.field}>
                  Password
                  <input
                    name='password'
                    className={styles.input}
                    type='password'
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder='********'
                    required
                  />
                </label>

                <button className={styles.buttonPrimary} type='submit' disabled={isLoading}>
                  {isLoading ? 'Lagi loading...' : 'Login'}
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
