import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import ActivityTable from '@/components/activityTable'
import Sidebar from '@/components/sidebar'
import { getSessionUser, logoutUser } from '@/lib/auth'
import styles from './dashboard.module.scss'

type Activity = { 
  id?: string;
  time: string; 
  name: string; 
  status: string; 
  direction: string 
}

type ActivityResponse = { status: boolean; data: Activity[] }
type GateStatus = 'terbuka' | 'tertutup'
type TrainStatus = 'mendekat' | 'lewat' | 'aman'
type ControlMode = 'otomatis' | 'manual'
type SensorStatus = 'aktif' | 'nonaktif'
type TrainDirection = 'kanan' | 'kiri'

export default function ViewDashboard() {
  const router = useRouter()
  const [activities, setActivities] = useState<Activity[]>([])
  const [userName, setUserName] = useState('Operator')
  const [gateStatus, setGateStatus] = useState<GateStatus>('terbuka')
  const [trainStatus, setTrainStatus] = useState<TrainStatus>('aman')
  const [controlMode, setControlMode] = useState<ControlMode>('otomatis')
  const [sensorStatus, setSensorStatus] = useState<SensorStatus>('aktif')
  const [trainDirection, setTrainDirection] = useState<TrainDirection>('kanan')
  const [systemAlert, setSystemAlert] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/aktivitas')
        const json: ActivityResponse = await res.json()

        if (json.status && json.data.length > 0) {
          setActivities(json.data)
          const latest = json.data[0]
          const isTrainComing = latest.status === 'APPROACHING' || latest.status === 'UNPASSED'
          
          setTrainStatus(isTrainComing ? 'mendekat' : 'aman')
          if (controlMode === 'otomatis') {
            setGateStatus(isTrainComing ? 'tertutup' : 'terbuka')
          }
          setTrainDirection(latest.direction === 'Malang' ? 'kanan' : 'kiri')
        }
      } catch (err) {
        console.error(err)
      }
    }

    fetchData()
    const interval = setInterval(fetchData, 3000)
    return () => clearInterval(interval)
  }, [controlMode])

  useEffect(() => {
    const sessionUser = getSessionUser()
    if (sessionUser?.name) {
      setUserName(sessionUser.name)
    } else if (sessionUser?.email) {
      setUserName(sessionUser.email)
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

  const handleLogout = () => {
    logoutUser()
    router.replace('/auth/login')
  }
  const handleOpenGateManual = () => setGateStatus('terbuka')
  const handleCloseGateManual = () => {
    const shouldClose = window.confirm('Palang akan ditutup. Lanjutkan?')
    if (!shouldClose) return

    setGateStatus('tertutup')
  }
  const directionLabel = trainDirection === 'kanan' ? 'Malang → Surabaya' : 'Surabaya → Malang'
  const trainAnimClass = trainStatus === 'aman' ? '' : (trainDirection === 'kanan' ? styles.trainApproachingFromRight : styles.trainApproachingFromLeft)

  return (
    <div className={styles.page}>
      <Head><title>Dashboard — NeoGate</title></Head>
      
      <Sidebar active="dashboard" />

      <div className={styles.mainContainer}>
        <header className={styles.topBar}>
          <div className={styles.brandTop}>
            NeoGate <span className={styles.debugBadge}>LIVE</span>
          </div>

          <div className={styles.topActions}>
            <div className={styles.profileCard}>
              <div className={styles.profileInfo}>
                <span className={styles.profileName}>{userName}</span>
                <span className={styles.profileRole}>System Operator</span>
              </div>
              <div className={styles.avatar}>{userName.charAt(0).toUpperCase()}</div>
            </div>
            <button className={styles.logoutButton} onClick={handleLogout}>Logout</button>
          </div>
        </header>

        <main className={styles.mainContent}>
          <div className={styles.dashboardGrid}>
            
            <section className={styles.statusPanel}>
              <h2>System Monitor</h2>
              
              {systemAlert && (
                <div style={{color: '#ff8e8f', marginBottom: '15px', fontWeight: 'bold'}}>
                  {systemAlert}
                </div>
              )}

              <div className={styles.statusPillsWrap}>
                <div className={styles.statusItem}>
                  <span>Palang</span>
                  <span className={gateStatus === 'terbuka' ? styles.stateSafe : styles.stateDanger}>{gateStatus}</span>
                </div>
                <div className={styles.statusItem}>
                  <span>Kereta</span>
                  <span className={trainStatus === 'aman' ? styles.stateSafe : styles.stateDanger}>{trainStatus}</span>
                </div>
                <div className={styles.statusItem}>
                  <span>Mode</span>
                  <span style={{color: '#66a1ff'}}>{controlMode}</span>
                </div>
              </div>

              <button className={styles.controlButton} onClick={() => setControlMode(m => m === 'otomatis' ? 'manual' : 'otomatis')}>
                Ubah ke {controlMode === 'otomatis' ? 'Manual' : 'Otomatis'}
              </button>
              <button className={styles.controlButton} onClick={() => setSensorStatus(s => s === 'aktif' ? 'nonaktif' : 'aktif')}>
                {sensorStatus === 'aktif' ? 'Matikan Sensor' : 'Aktifkan Sensor'}
              </button>

              <div className={styles.manualControls}>
                <button
                  className={`${styles.controlButton} ${styles.manualOpenButton} ${gateStatus === 'terbuka' ? styles.manualOpenActive : ''}`}
                  onClick={handleOpenGateManual}
                  disabled={controlMode !== 'manual'}
                >
                  Buka Palang (Manual)
                </button>
                <button
                  className={`${styles.controlButton} ${styles.manualCloseButton} ${gateStatus === 'tertutup' ? styles.manualCloseActive : ''}`}
                  onClick={handleCloseGateManual}
                  disabled={controlMode !== 'manual'}
                >
                  Tutup Palang (Manual)
                </button>
              </div>
            </section>

            <section className={styles.visualPanel}>
              <div style={{marginBottom: '20px'}}>Arah: <strong>{directionLabel}</strong></div>
              <div className={styles.barrierUnit}>
                <div className={`${styles.barrierArm} ${gateStatus === 'tertutup' ? styles.barrierArmDown : styles.barrierArmUp}`} />
              </div>
              <div className={styles.railLine} />
            </section>

          </div>

          <section>
            <h2 style={{marginBottom: '20px'}}>Log Aktivitas Terbaru</h2>
            <ActivityTable rows={activities} />
          </section>
        </main>
      </div>
    </div>
  )
}