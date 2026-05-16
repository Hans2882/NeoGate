import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import ActivityTable from '@/components/activityTable'
import Sidebar from '@/components/sidebar'
import styles from './dashboard.module.scss'
import { listenSystemStatus, listenActivities, updateControlMode } from '@/utils/db/firebaseService'
import { getSessionUserGate, getSessionUserName, isAuthenticated, logoutUser } from '@/lib/auth'

type Activity = {
  id?: string
  time: string
  gate: string
  sessionId: string
  name: string
  status: string
  direction: string
  icon?: 'train' | 'cargo'
}

type GateStatus = 'terbuka' | 'tertutup'
type TrainStatus = 'mendekat' | 'lewat' | 'aman'
type ControlMode = 'otomatis' | 'manual'
type SensorStatus = 'aktif' | 'nonaktif'
type TrainDirection = 'kanan' | 'kiri'

function MenuIcon() {
  return (
    <svg viewBox='0 0 24 24' aria-hidden='true'>
      <path d='M4 7h16' />
      <path d='M4 12h16' />
      <path d='M4 17h16' />
    </svg>
  )
}

export default function ViewDashboard() {
  const router = useRouter()
  const [activities, setActivities] = useState<Activity[]>([])
  const [userName, setUserName] = useState('')
  const [userGate, setUserGate] = useState<string | null>(null)
  const [authChecked, setAuthChecked] = useState(false)
  const [gateStatus, setGateStatus] = useState<GateStatus>('terbuka')
  const [trainStatus, setTrainStatus] = useState<TrainStatus>('aman')
  const [controlMode, setControlMode] = useState<ControlMode>('otomatis')
  const [sensorStatus, setSensorStatus] = useState<SensorStatus>('aktif')
  const [trainDirection, setTrainDirection] = useState<TrainDirection>('kanan')
  const [systemAlert, setSystemAlert] = useState<string | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace('/auth/login')
      return
    }

    setUserName(getSessionUserName() || 'Operator')
    setUserGate(getSessionUserGate())
    setAuthChecked(true)
  }, [router])

  useEffect(() => {
    const unsubscribeStatus = listenSystemStatus((data) => {
      if (data) {
        setGateStatus(data.gateStatus || 'terbuka')
        setTrainStatus(data.trainStatus || 'aman')
        setControlMode(data.controlMode || 'otomatis')
        setSensorStatus(data.sensorStatus || 'aktif')
        setTrainDirection(data.direction === 'Malang' ? 'kanan' : 'kiri')
      }
    })

    const unsubscribeActivities = listenActivities((data) => {
      setActivities(data)
    })

    return () => {
      unsubscribeStatus()
      unsubscribeActivities()
    }
  }, [])

  useEffect(() => {
    if (sensorStatus === 'nonaktif') {
      setSystemAlert('SISTEM SENSOR MATI')
    } else if (trainStatus === 'mendekat') {
      setSystemAlert('KERETA MENDEKAT')
    } else {
      setSystemAlert(null)
    }
  }, [trainStatus, sensorStatus])

  const handleToggleMode = () => {
    const newMode = controlMode === 'otomatis' ? 'manual' : 'otomatis'
    updateControlMode(newMode)
  }

  const handleLogout = async () => {
    try {
      await logoutUser()
      router.replace('/auth/login')
    } catch (error) {
      console.error('Logout gagal:', error)
    }
  }

  const visibleActivities = activities.filter((activity) => {
    if (userGate === 'gate1') return activity.gate === 'GATE1'
    if (userGate === 'gate2') return activity.gate === 'GATE2'
    return true
  })

  const gateLabel = userGate === 'gate1' ? 'Gate 1' : userGate === 'gate2' ? 'Gate 2' : 'Semua Gate'
  const directionLabel = trainDirection === 'kanan' ? 'Malang → Surabaya' : 'Surabaya → Malang'

  if (!authChecked) {
    return null
  }

  return (
    <div className={styles.page}>
      <Head>
        <title>Dashboard - NeoGate</title>
      </Head>

      {sidebarOpen && <div className={styles.sidebarBackdrop} onClick={() => setSidebarOpen(false)} />}

      <Sidebar active='dashboard' isOpen={sidebarOpen} />

      <div className={styles.mainContainer}>
        <header className={styles.topBar}>
          <div className={styles.brandRow}>
            <button
              className={styles.menuButton}
              type='button'
              onClick={() => setSidebarOpen((prev) => !prev)}
              aria-label='Toggle sidebar'
            >
              <MenuIcon />
            </button>
            <div className={styles.brandTop}>
              NeoGate <span className={styles.debugBadge}>LIVE</span>
            </div>
          </div>

          <div className={styles.topActions}>
            <div className={styles.profileCard}>
              <div className={styles.profileInfo}>
                <span className={styles.profileName}>{userName}</span>
                <span className={styles.profileRole}>Operator</span>
                <span className={styles.profileGate}>{gateLabel}</span>
              </div>
              <div className={styles.avatar}>{userName[0]}</div>
            </div>
            <button className={styles.logoutButton} onClick={handleLogout}>
              Logout
            </button>
          </div>
        </header>

        <main className={styles.mainContent}>
          <div className={styles.dashboardGrid}>
            <section className={styles.statusPanel}>
              <h2>System Monitor</h2>

              {systemAlert && (
                <div
                  style={{
                    color: '#ff8e8f',
                    backgroundColor: 'rgba(255, 142, 143, 0.1)',
                    padding: '10px',
                    borderRadius: '5px',
                    marginBottom: '15px',
                    fontWeight: 'bold',
                    textAlign: 'center',
                    border: '1px solid #ff8e8f'
                  }}
                >
                  {systemAlert}
                </div>
              )}

              <div className={styles.statusPillsWrap}>
                <div className={styles.statusItem}>
                  <span>Palang</span>
                  <span className={gateStatus === 'terbuka' ? styles.stateSafe : styles.stateDanger}>
                    {gateStatus.toUpperCase()}
                  </span>
                </div>
                <div className={styles.statusItem}>
                  <span>Kereta</span>
                  <span className={trainStatus === 'aman' ? styles.stateSafe : styles.stateDanger}>
                    {trainStatus.toUpperCase()}
                  </span>
                </div>
                <div className={styles.statusItem}>
                  <span>Mode</span>
                  <span style={{ color: '#66a1ff' }}>{controlMode.toUpperCase()}</span>
                </div>
                <button className={styles.controlButton} onClick={handleToggleMode}>
                Ubah ke {controlMode === 'otomatis' ? 'Manual' : 'Otomatis'}
              </button>

              <button className={styles.controlButton} style={{ opacity: 0.7 }}>
                {sensorStatus === 'aktif' ? 'Matikan Sensor' : 'Aktifkan Sensor'}
              </button>
              </div>

              
            </section>

            <section className={styles.visualPanel}>
              <article className={styles.routeCard}>
                <h3 className={styles.routeTitle}>Rute</h3>

                <div className={styles.routeBody}>
                  <div className={styles.routeSide}>
                    <p className={styles.routeTime}>11.00</p>
                    <p className={styles.routeCode}>MLG</p>
                    <p className={styles.routeCity}>Malang</p>
                  </div>

                  <div className={styles.routeArrowWrap} aria-hidden='true'>
                    <span className={styles.routeArrowLine} />
                    <span className={styles.routeArrowHead} />
                  </div>

                  <div className={styles.routeSide}>
                    <p className={styles.routeTime}>12.30</p>
                    <p className={styles.routeCode}>SBY</p>
                    <p className={styles.routeCity}>Surabaya</p>
                  </div>
                </div>

                <div className={styles.routeHint}>
                  <div className={styles.routeHintContent}>
                    <span className={styles.routeHintIcon}>i</span>
                    <div className={styles.routeHintText}>
                      <p>
                        Ini adalah prediksi keberangkatan dan kedatangan, jadwal bisa saja berubah tergantung kondisi.
                      </p>
                    </div>
                  </div>
                </div>

                <p className={styles.routeDirection}>Arah aktif: {directionLabel}</p>
              </article>
            </section>
          </div>

          <section>
            <h2 style={{ marginBottom: '20px' }}>Log Aktivitas Terbaru - {gateLabel}</h2>
            <ActivityTable rows={visibleActivities} />
          </section>
        </main>
      </div>
    </div>
  )
}
