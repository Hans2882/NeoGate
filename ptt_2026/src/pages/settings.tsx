import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Sidebar from '../components/sidebar'
import { getSessionUser, getSessionUserName, getSessionUserRole, isAuthenticated, logoutUser } from '../lib/auth'
import { createOperatorByAdmin } from '../utils/db/firebaseService'
import dashboardStyles from '../views/dashboard/dashboard.module.scss'
import styles from '../styles/settings.module.scss'

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="11" cy="11" r="6.5" />
      <path d="M16 16L21 21" />
    </svg>
  )
}

function BellIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 4a4 4 0 0 0-4 4v2.9c0 .8-.3 1.5-.8 2.1L5.7 14.7c-.5.6-.1 1.5.7 1.5h11.2c.8 0 1.2-.9.7-1.5L16.8 13c-.5-.6-.8-1.3-.8-2.1V8a4 4 0 0 0-4-4Z" />
      <path d="M9.5 19a2.5 2.5 0 0 0 5 0" />
    </svg>
  )
}

function SettingsIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 3.5 13.4 5l2-.3.9 1.7 1.9.5.1 2 1.4 1.3-1 1.8 1 1.8-1.4 1.3-.1 2-1.9.5-.9 1.7-2-.3L12 20.5l-1.4-1.4-2 .3-.9-1.7-1.9-.5-.1-2-1.4-1.3 1-1.8-1-1.8 1.4-1.3.1-2 1.9-.5.9-1.7 2 .3L12 3.5Z" />
      <circle cx="12" cy="12" r="3.2" />
    </svg>
  )
}

export default function SettingsPage() {
  const router = useRouter()
  const [userName, setUserName] = useState('')
  const [authChecked, setAuthChecked] = useState(false)
  const [defaultMode, setDefaultMode] = useState<'otomatis' | 'manual'>('otomatis')
  const [gateDelay, setGateDelay] = useState(12)
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [role, setRole] = useState('')
  const [newOperatorName, setNewOperatorName] = useState('')
  const [newOperatorEmail, setNewOperatorEmail] = useState('')
  const [newOperatorPassword, setNewOperatorPassword] = useState('')
  const [createOperatorLoading, setCreateOperatorLoading] = useState(false)
  const [createOperatorMessage, setCreateOperatorMessage] = useState('')

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

    setRole(sessionRole)
    setUserName(getSessionUserName() || 'Operator')
    setAuthChecked(true)
  }, [router])

  const handleCreateOperator = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setCreateOperatorMessage('')

    if (role !== 'admin' && role !== 'superadmin') {
      setCreateOperatorMessage('Hanya admin yang bisa menambah operator.')
      return
    }

    if (newOperatorPassword.length < 6) {
      setCreateOperatorMessage('Password minimal 6 karakter.')
      return
    }

    setCreateOperatorLoading(true)
    const sessionUser = getSessionUser()
    const result = await createOperatorByAdmin({
      name: newOperatorName,
      email: newOperatorEmail,
      password: newOperatorPassword,
      createdBy: sessionUser?.email || userName
    })

    if (result.status) {
      setCreateOperatorMessage('Operator berhasil ditambahkan.')
      setNewOperatorName('')
      setNewOperatorEmail('')
      setNewOperatorPassword('')
    } else {
      setCreateOperatorMessage(String(result.message || 'Gagal menambah operator.'))
    }

    setCreateOperatorLoading(false)
  }

  const handleLogout = () => {
    logoutUser()
    router.replace('/auth/login')
  }

  if (!authChecked) {
    return null
  }

  return (
    <div className={dashboardStyles.page}>
      <Head>
        <title>Settings - NeoGate</title>
      </Head>

      <Sidebar active="settings" />

      <div className={dashboardStyles.mainContainer}>
        <div className={dashboardStyles.topBar}>
          <div className={dashboardStyles.brandTop}>NeoGate</div>

          <label className={styles.search}>
            <span className={styles.searchIcon}>
              <SearchIcon />
            </span>
            <input className={styles.searchInput} type="text" placeholder="Search setting options..." />
          </label>

          <div className={`${dashboardStyles.topActions} ${styles.settingsTopActions}`}>
            <button className={styles.iconButton} type="button" aria-label="Notifications">
              <BellIcon />
            </button>
            <button className={styles.iconButton} type="button" aria-label="Settings">
              <SettingsIcon />
            </button>
            <div className={`${dashboardStyles.profileCard} ${styles.settingsProfileCard}`}>
              <div className={dashboardStyles.avatar}>{userName.charAt(0).toUpperCase()}</div>
              <div>
                <div className={dashboardStyles.profileName}>{userName}</div>
                <div className={dashboardStyles.profileRole}>Operational Tier 1</div>
              </div>
            </div>
            <button className={dashboardStyles.logoutButton} type="button" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>

        <main className={styles.settingsContent}>
          <section className={styles.settingsHero}>
            <p className={styles.kicker}>System Configuration</p>
            <h1 className={styles.title}>Settings</h1>
            <p className={styles.subtitle}>
              Kelola preferensi notifikasi, jadwal sinkronisasi, dan parameter monitoring untuk dashboard palang
              kereta.
            </p>
          </section>

          <section className={styles.settingsGrid}>
            <article className={styles.panel}>
              <h2>Kontrol Dasar Palang</h2>
              <p className={styles.panelHint}>Atur mode default, delay palang, dan notifikasi utama.</p>

              <div className={styles.settingList}>
                <div className={styles.settingRow}>
                  <span className={styles.settingText}>Mode default</span>
                  <span className={styles.settingStatus}>{defaultMode}</span>
                </div>
                <div className={styles.settingRow}>
                  <span className={styles.settingText}>Delay palang turun</span>
                  <span className={styles.settingStatus}>{gateDelay}m</span>
                </div>
                <div className={styles.settingRow}>
                  <span className={styles.settingText}>Notifikasi</span>
                  <span className={styles.settingStatus}>{notificationsEnabled ? 'aktif' : 'nonaktif'}</span>
                </div>
              </div>
            </article>

            <article className={styles.panel}>
              <h2>Pengaturan Operasional</h2>
              <p className={styles.panelHint}>Konfigurasi utama untuk perilaku palang kereta.</p>

              <form className={styles.formGrid}>
                <label className={styles.fieldLabel}>
                  Mode Default Sistem
                  <select
                    className={styles.select}
                    value={defaultMode}
                    onChange={(event) => setDefaultMode(event.target.value as 'otomatis' | 'manual')}
                  >
                    <option value="otomatis">Otomatis</option>
                    <option value="manual">Manual</option>
                  </select>
                </label>

                <label className={styles.fieldLabel}>
                  Delay Waktu Palang Turun (menit)
                  <input
                    className={styles.input}
                    type="number"
                    min={1}
                    max={60}
                    value={gateDelay}
                    onChange={(event) => setGateDelay(Number(event.target.value))}
                  />
                </label>

                <label className={styles.fieldLabel}>
                  Notifikasi Sistem
                  <select
                    className={styles.select}
                    value={notificationsEnabled ? 'aktif' : 'nonaktif'}
                    onChange={(event) => setNotificationsEnabled(event.target.value === 'aktif')}
                  >
                    <option value="aktif">Aktif</option>
                    <option value="nonaktif">Nonaktif</option>
                  </select>
                </label>
              </form>

              <div className={styles.actions}>
                <button type="button" className={styles.buttonPrimary}>
                  Simpan Pengaturan
                </button>
                <button type="button" className={styles.buttonGhost}>
                  Reset
                </button>
              </div>
            </article>

            <article className={styles.panel}>
              <h2>Konfigurasi Sensor</h2>
              <p className={styles.panelHint}>Atur parameter sensor untuk deteksi mendekat/lewat secara akurat.</p>

              <form className={styles.formGrid}>
                <label className={styles.fieldLabel}>
                  Sensor Utama
                  <select className={styles.select} defaultValue="infrared">
                    <option value="infrared">Infrared</option>
                    <option value="ultrasonic">Ultrasonic</option>
                    <option value="magnetic">Magnetic</option>
                  </select>
                </label>

                <label className={styles.fieldLabel}>
                  Ambang Jarak Deteksi (meter)
                  <input className={styles.input} type="number" min={1} defaultValue={45} />
                </label>

                <label className={styles.fieldLabel}>
                  Sensitivitas Sensor
                  <select className={styles.select} defaultValue="medium">
                    <option value="low">Rendah</option>
                    <option value="medium">Sedang</option>
                    <option value="high">Tinggi</option>
                  </select>
                </label>
              </form>
            </article>

            <article className={styles.panel}>
              <h2>Manajemen Operator</h2>
              <p className={styles.panelHint}>Tambahkan akun operator baru yang bisa login ke dashboard.</p>

              {createOperatorMessage && <div className={styles.panelHint}>{createOperatorMessage}</div>}

              <form className={styles.formGrid} onSubmit={handleCreateOperator}>
                <label className={styles.fieldLabel}>
                  Nama Operator
                  <input
                    className={styles.input}
                    type="text"
                    placeholder="Contoh: Operator Stasiun A"
                    value={newOperatorName}
                    onChange={(event) => setNewOperatorName(event.target.value)}
                    required
                  />
                </label>

                <label className={styles.fieldLabel}>
                  Email Operator
                  <input
                    className={styles.input}
                    type="email"
                    placeholder="operator@email.com"
                    value={newOperatorEmail}
                    onChange={(event) => setNewOperatorEmail(event.target.value)}
                    required
                  />
                </label>

                <label className={styles.fieldLabel}>
                  Password Operator
                  <input
                    className={styles.input}
                    type="password"
                    placeholder="Minimal 6 karakter"
                    value={newOperatorPassword}
                    onChange={(event) => setNewOperatorPassword(event.target.value)}
                    required
                  />
                </label>

                <div className={styles.actions}>
                  <button type="submit" className={styles.buttonPrimary} disabled={createOperatorLoading}>
                    {createOperatorLoading ? 'Menyimpan...' : 'Tambah Operator'}
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
