import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Sidebar from '@/components/sidebar'
import { createOperatorByAdmin } from '@/utils/db/firebaseService'
import { getSessionUser, getSessionUserName, getSessionUserRole, isAuthenticated, logoutUser } from '@/lib/auth'
import dashboardStyles from '@/views/dashboard/dashboard.module.scss'
import styles from '@/styles/settings.module.scss'

function MenuIcon() {
  return (
    <svg viewBox='0 0 24 24' aria-hidden='true'>
      <path d='M4 7h16' />
      <path d='M4 12h16' />
      <path d='M4 17h16' />
    </svg>
  )
}

export default function AdminOperatorsPage() {
  const router = useRouter()
  const [authChecked, setAuthChecked] = useState(false)
  const [userName, setUserName] = useState('')
  const [role, setRole] = useState('')

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace('/auth/login')
      return
    }

    const sessionRole = getSessionUserRole()
    if (sessionRole !== 'admin' && sessionRole !== 'superadmin') {
      router.replace('/dashboard')
      return
    }

    setRole(sessionRole || '')
    setUserName(getSessionUserName() || 'Admin')
    setAuthChecked(true)
  }, [router])

  const handleLogout = async () => {
    await logoutUser()
    router.replace('/auth/login')
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setMessage('')

    if (role !== 'admin' && role !== 'superadmin') {
      setMessage('Hanya admin yang bisa menambah operator.')
      return
    }

    if (password.length < 6) {
      setMessage('Password minimal 6 karakter.')
      return
    }

    setIsSubmitting(true)
    const sessionUser = getSessionUser()
    const result = await createOperatorByAdmin({
      name,
      email,
      password,
      createdBy: sessionUser?.email || userName
    })

    if (result.status) {
      setMessage('Operator berhasil ditambahkan.')
      setName('')
      setEmail('')
      setPassword('')
    } else {
      setMessage(String(result.message || 'Gagal menambah operator.'))
    }

    setIsSubmitting(false)
  }

  if (!authChecked) return null

  return (
    <div className={dashboardStyles.page}>
      <Head>
        <title>Admin Operator - NeoGate</title>
      </Head>

      {sidebarOpen && <div className={dashboardStyles.sidebarBackdrop} onClick={() => setSidebarOpen(false)} />}

      <Sidebar active='admin' isOpen={sidebarOpen} />

      <div className={dashboardStyles.mainContainer}>
        <header className={dashboardStyles.topBar}>
          <div className={dashboardStyles.brandRow}>
            <button
              className={dashboardStyles.menuButton}
              type='button'
              onClick={() => setSidebarOpen((prev) => !prev)}
              aria-label='Toggle sidebar'
            >
              <MenuIcon />
            </button>
            <div className={dashboardStyles.brandTop}>NeoGate Admin</div>
          </div>
          <div className={dashboardStyles.topActions}>
            <div className={dashboardStyles.profileCard}>
              <div className={dashboardStyles.profileInfo}>
                <span className={dashboardStyles.profileName}>{userName}</span>
                <span className={dashboardStyles.profileRole}>Administrator</span>
              </div>
              <div className={dashboardStyles.avatar}>{userName.charAt(0).toUpperCase()}</div>
            </div>
            <button className={dashboardStyles.logoutButton} type='button' onClick={handleLogout}>
              Logout
            </button>
          </div>
        </header>

        <main className={styles.settingsContent}>
          <section className={styles.settingsHero}>
            <p className={styles.kicker}>Admin Panel</p>
            <h1 className={styles.title}>Tambah Operator</h1>
            <p className={styles.subtitle}>Akun operator baru akan disimpan ke collection users di Firebase.</p>
          </section>

          <section className={styles.settingsGrid}>
            <article className={styles.panel}>
              <h2>Form Operator Baru</h2>
              <p className={styles.panelHint}>Role akan otomatis diset sebagai operator.</p>
              {message && <p className={styles.panelHint}>{message}</p>}

              <form className={styles.formGrid} onSubmit={handleSubmit}>
                <label className={styles.fieldLabel}>
                  Nama Operator
                  <input
                    className={styles.input}
                    type='text'
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder='Contoh: Operator Stasiun A'
                    required
                  />
                </label>

                <label className={styles.fieldLabel}>
                  Email Operator
                  <input
                    className={styles.input}
                    type='email'
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder='operator@email.com'
                    required
                  />
                </label>

                <label className={styles.fieldLabel}>
                  Password Operator
                  <input
                    className={styles.input}
                    type='password'
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder='Minimal 6 karakter'
                    required
                  />
                </label>

                <div className={styles.actions}>
                  <button className={styles.buttonPrimary} type='submit' disabled={isSubmitting}>
                    {isSubmitting ? 'Menyimpan...' : 'Simpan Operator'}
                  </button>
                </div>
              </form>
            </article>
          </section>
        </main>
      </div>
    </div>
  )
}
