import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import ActivityTable from '@/components/activityTable'
import Card from '@/components/card'
import Chart from '@/components/chart'
import Sidebar from '@/components/sidebar'
import { getSessionUser, isAuthenticated, logoutUser } from '@/lib/auth'
import styles from './dashboard.module.scss'

type Activity = { time: string; name: string; status: string; direction: string }
type ActivityResponse = { status: boolean; data: Activity[] }
type GateStatus = 'terbuka' | 'tertutup'
type TrainStatus = 'mendekat' | 'lewat' | 'aman'
type ControlMode = 'otomatis' | 'manual'
type SensorStatus = 'aktif' | 'nonaktif'
type TrainDirection = 'kanan' | 'kiri'

const chartSeries = {
  daily: { labels: ['00:00', '08:00', '12:00', '16:00', '20:00'], values: [3, 7, 10, 9, 6] },
  weekly: { labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], values: [7, 8, 9, 11, 6] },
} as const

export default function ViewDashboard() {
  const router = useRouter()
  const [activities, setActivities] = useState<Activity[]>([])
  const [userName, setUserName] = useState('Fandy')
  const [authChecked, setAuthChecked] = useState(false)
  
  // Real-time States
  const [gateStatus, setGateStatus] = useState<GateStatus>('terbuka')
  const [trainStatus, setTrainStatus] = useState<TrainStatus>('aman')
  const [controlMode, setControlMode] = useState<ControlMode>('otomatis')
  const [sensorStatus, setSensorStatus] = useState<SensorStatus>('aktif')
  const [trainDirection, setTrainDirection] = useState<TrainDirection>('kanan')
  const [systemAlert, setSystemAlert] = useState<string | null>(null)

  // 1. Auth Guard
  useEffect(() => {
    if (!isAuthenticated()) { router.replace('/auth/login'); return; }
    const sessionUser = getSessionUser()
    if (sessionUser?.name) setUserName(sessionUser.name)
    setAuthChecked(true)
  }, [router])

  // 2. Real-time Polling (Narik data dari API Firebase tiap 3 detik)
  useEffect(() => {
    if (!authChecked) return

    const fetchData = async () => {
      try {
        const res = await fetch('/api/aktivitas')
        const json: ActivityResponse = await res.json()

        if (json.status && json.data.length > 0) {
          setActivities(json.data)
          const latest = json.data[0]
          
          // Mapping Status dari Database ke UI
          const isPassing = latest.status === 'UNPASSED' || latest.status === 'APPROACHING'
          setTrainStatus(isPassing ? 'mendekat' : 'aman')
          setGateStatus(isPassing ? 'tertutup' : 'terbuka')
          setTrainDirection(latest.direction === 'Malang' ? 'kanan' : 'kiri')
        }
      } catch (err) { console.error("Fetch error:", err) }
    }

    fetchData()
    const interval = setInterval(fetchData, 3000)
    return () => clearInterval(interval)
  }, [authChecked])

  // 3. Alert Logic
  useEffect(() => {
    if (sensorStatus === 'nonaktif') setSystemAlert('Sensor nonaktif!')
    else if (trainStatus !== 'aman') setSystemAlert(`Kereta ${trainStatus}!`)
    else setSystemAlert(null)
  }, [trainStatus, sensorStatus])

  const handleLogout = () => { logoutUser(); router.replace('/auth/login'); }
  
  if (!authChecked) return null

  const directionLabel = trainDirection === 'kanan' ? 'kanan ke kiri' : 'kiri ke kanan'
  const directionClass = trainStatus === 'aman' ? '' : trainDirection === 'kanan' ? styles.trainApproachingFromRight : styles.trainApproachingFromLeft

  return (
    <div className={styles.page}>
      <Head><title>Dashboard — NeoGate</title></Head>
      <Sidebar active="dashboard" />
      <div className={styles.mainContainer}>
        {/* Topbar */}
        <div className={styles.topBar}>
          <div className={styles.brandTop}>NeoGate</div>
          <div className={styles.topActions}>
            <div className={styles.profileCard}>
              <div className={styles.avatar}>{userName[0]}</div>
              <div><div className={styles.profileName}>{userName}</div><div className={styles.profileRole}>QA/Dev</div></div>
            </div>
            <button className={styles.logoutButton} onClick={handleLogout}>Logout</button>
          </div>
        </div>

        <main className={styles.main}>
          <section className={styles.controlSection}>
            <div className={styles.statusPanel}>
              <h2>System Monitor</h2>
              {systemAlert && <div className={styles.systemAlert}>{systemAlert}</div>}
              <div className={styles.statusPillsWrap}>
                <div className={styles.statusItem}>Palang: <span className={gateStatus === 'terbuka' ? styles.stateSafe : styles.stateDanger}>{gateStatus}</span></div>
                <div className={styles.statusItem}>Kereta: <span className={trainStatus === 'aman' ? styles.stateSafe : styles.stateDanger}>{trainStatus}</span></div>
                <div className={styles.statusItem}>Mode: <span className={styles.stateInfo}>{controlMode}</span></div>
              </div>
              <div className={styles.controls}>
                <button className={styles.controlButton} onClick={() => setControlMode(prev => prev === 'otomatis' ? 'manual' : 'otomatis')}>Toggle Mode</button>
                <button className={styles.controlButton} onClick={() => setSensorStatus(prev => prev === 'aktif' ? 'nonaktif' : 'aktif')}>Toggle Sensor</button>
              </div>
            </div>

            <div className={`${styles.visualPanel} ${trainStatus !== 'aman' ? styles.visualAlert : ''}`}>
              <div className={styles.directionSign}>Arah: {directionLabel}</div>
              <div className={styles.barrierUnit}>
                <span className={`${styles.barrierArm} ${gateStatus === 'tertutup' ? styles.barrierArmDown : styles.barrierArmUp}`} />
              </div>
              <div className={styles.railLine} />
              <div className={`${styles.trainVisual} ${directionClass}`}>
                <span className={styles.trainCabin} />
              </div>
            </div>
          </section>

          <section className={styles.activitySection}>
            <h2>Recent Activity Log</h2>
            <ActivityTable rows={activities} />
          </section>
        </main>
      </div>
    </div>
  )
}