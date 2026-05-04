import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import ActivityTable from '@/components/activityTable'
import Sidebar from '@/components/sidebar'
import styles from './dashboard.module.scss'
import { listenSystemStatus, listenActivities, updateControlMode } from '@/utils/db/firebaseService'
import { logoutUser } from '@/lib/auth'

type Activity = { 
  id?: string;
  time: string; 
  name: string; 
  status: string; 
  direction: string 
}

type GateStatus = 'terbuka' | 'tertutup'
type TrainStatus = 'mendekat' | 'lewat' | 'aman'
type ControlMode = 'otomatis' | 'manual'
type SensorStatus = 'aktif' | 'nonaktif'
type TrainDirection = 'kanan' | 'kiri'

export default function ViewDashboard() {
  const router = useRouter()
  const [activities, setActivities] = useState<Activity[]>([])
  const [userName] = useState('Fandy Wahyu')
  const [gateStatus, setGateStatus] = useState<GateStatus>('terbuka')
  const [trainStatus, setTrainStatus] = useState<TrainStatus>('aman')
  const [controlMode, setControlMode] = useState<ControlMode>('otomatis')
  const [sensorStatus, setSensorStatus] = useState<SensorStatus>('aktif')
  const [trainDirection, setTrainDirection] = useState<TrainDirection>('kanan')
  const [systemAlert, setSystemAlert] = useState<string | null>(null)

  // 1. Integrasi Listener Real-time Firebase
  useEffect(() => {
    const unsubscribeStatus = listenSystemStatus((data) => {
      if (data) {
        setGateStatus(data.gateStatus || 'terbuka');
        setTrainStatus(data.trainStatus || 'aman');
        setControlMode(data.controlMode || 'otomatis');
        setSensorStatus(data.sensorStatus || 'aktif');
        // Logika arah berdasarkan string dari Firebase
        setTrainDirection(data.direction === 'Malang' ? 'kanan' : 'kiri');
      }
    });

    const unsubscribeActivities = listenActivities((data) => {
      setActivities(data);
    });

    // Cleanup untuk mencegah memory leak
    return () => {
      unsubscribeStatus();
      unsubscribeActivities();
    };
  }, [])

  // 2. Logika Alert System
  useEffect(() => {
    if (sensorStatus === 'nonaktif') {
      setSystemAlert('SISTEM SENSOR MATI');
    } else if (trainStatus === 'mendekat') {
      setSystemAlert('KERETA MENDEKAT');
    } else {
      setSystemAlert(null);
    }
  }, [trainStatus, sensorStatus])

  // 3. Handlers untuk Kontrol Interaktif
  const handleToggleMode = () => {
    const newMode = controlMode === 'otomatis' ? 'manual' : 'otomatis';
    updateControlMode(newMode); // Langsung update ke Firebase RTDB
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      router.replace('/auth/login');
    } catch (error) {
      console.error("Logout gagal:", error);
    }
  }
  
  const directionLabel = trainDirection === 'kanan' ? 'Malang → Surabaya' : 'Surabaya → Malang'
  
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
              <div className={styles.avatar}>{userName[0]}</div>
            </div>
            <button className={styles.logoutButton} onClick={handleLogout}>Logout</button>
          </div>
        </header>

        <main className={styles.mainContent}>
          <div className={styles.dashboardGrid}>
            
            <section className={styles.statusPanel}>
              <h2>System Monitor</h2>
              
              {systemAlert && (
                <div style={{
                  color: '#ff8e8f', 
                  backgroundColor: 'rgba(255, 142, 143, 0.1)', 
                  padding: '10px', 
                  borderRadius: '5px',
                  marginBottom: '15px', 
                  fontWeight: 'bold',
                  textAlign: 'center',
                  border: '1px solid #ff8e8f'
                }}>
                  ⚠️ {systemAlert}
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
                  <span style={{color: '#66a1ff'}}>{controlMode.toUpperCase()}</span>
                </div>
              </div>

              {/* Tombol yang sinkron dengan Firebase Service */}
              <button className={styles.controlButton} onClick={handleToggleMode}>
                Ubah ke {controlMode === 'otomatis' ? 'Manual' : 'Otomatis'}
              </button>
              
              {/* Dummy toggle untuk Sensor Status (bisa ditambah fungsi update di service jika perlu) */}
              <button className={styles.controlButton} style={{ opacity: 0.7 }}>
                {sensorStatus === 'aktif' ? 'Matikan Sensor' : 'Aktifkan Sensor'}
              </button>
            </section>

            <section className={styles.visualPanel}>
              <div style={{marginBottom: '20px'}}>Arah: <strong>{directionLabel}</strong></div>
              <div className={styles.barrierUnit}>
                {/* Animasi Palang berdasarkan state real-time */}
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