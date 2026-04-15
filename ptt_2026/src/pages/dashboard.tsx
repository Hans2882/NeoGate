import Head from 'next/head'
import { useEffect, useState } from 'react'
import ActivityTable from '../components/activityTable'
import Card from '../components/card'
import Chart from '../components/chart'
import Sidebar from '../components/sidebar'
import styles from '../styles/dashboard.module.scss'

type Activity = {
  time: string
  name: string
  status: string
  direction: string
}

type ActivityResponse = {
  status: boolean
  status_code: number
  data: Activity[]
}

const chartSeries = {
  daily: {
    labels: ['00:00', '02:00', '04:00', '08:00', '12:00', '16:00', '20:00', '23:00'],
    values: [3, 4, 5, 7, 10, 9, 6, 4]
  },
  weekly: {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    values: [7, 8, 7, 9, 11, 6, 5]
  },
  monthly: {
    labels: ['Jan','Feb','Mar','Apr','May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    values: [5, 6, 8, 7, 9, 10, 8, 6, 7, 9, 10, 8]
  },
  yearly: {
    labels: [ '2022', '2023', '2024', '2025', '2026' ],
    values: [5, 6, 8, 7, 9]
  }
} as const

const data = {
  cards: [
    {
      title: 'Daily Total Trains',
      value: '142',
      unit: '',
      note: '+12% from yesterday',
      icon: 'train',
      accent: 'blue'
    },
    { title: 'Avg Train Speed', value: '84', subtitle: 'km/h — Stable baseline' },
    { title: 'Avg Gate Closed', value: '184', subtitle: 'mins — -4% efficiency' },
    { title: 'Signal Latency', value: '99.8', subtitle: 'ms — All nodes functional' }
  ],
  chart: [2, 4, 3, 6, 8, 10, 7, 5, 6, 8, 4, 3],
  activities: [
    { time: '14:12:45', name: 'DHOHO', status: 'PASSED', direction: 'Malang' },
    { time: '13:58:22', name: 'PENATARAN', status: 'PASSED', direction: 'Surabaya' },
    { time: '13:45:10', name: 'MALABAR', status: 'UNPASSED', direction: 'Bandung' },
    { time: '13:30:55', name: 'ARGO BROMO', status: 'PASSED', direction: 'Malang' },
    { time: '13:15:00', name: 'KERTANEGARA', status: 'PASSED', direction: 'Bekasi' }
  ]
}

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

function WarningIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 4.3 20 19H4l8-14.7Z" />
      <path d="M12 9v4.5" />
      <circle cx="12" cy="16.4" r="0.8" fill="currentColor" stroke="none" />
    </svg>
  )
}

export default function Dashboard() {
  const [activeSeries, setActiveSeries] = useState<keyof typeof chartSeries>('daily')
  const [chartValues, setChartValues] = useState<number[]>([...chartSeries.daily.values])
  const [selectedBar, setSelectedBar] = useState(0)
  const [activities, setActivities] = useState<Activity[]>(data.activities)

  useEffect(() => {
    setChartValues([...chartSeries[activeSeries].values])
    setSelectedBar(0)
  }, [activeSeries])

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const res = await fetch('/api/aktivitas')
        const json: ActivityResponse = await res.json()

        if (json.status && Array.isArray(json.data)) {
          setActivities(json.data)
        }
      } catch (error) {
        console.error('Failed to fetch activities:', error)
      }
    }

    fetchActivities()
  }, [])

  const handleBarClick = (index: number) => {
    setSelectedBar(index)
  }

  return (
    <div className={styles.page}>
      <Head>
        <title>Dashboard — NeoGate</title>
      </Head>

      <Sidebar active="dashboard" />

      <div className={styles.mainContainer}>
        <div className={styles.topBar}>
          <div className={styles.brandTop}>NeoGate</div>

          <label className={styles.search}>
            <span className={styles.searchIcon}>
              <SearchIcon />
            </span>
            <input type="text" placeholder="Search track node or ID..." />
          </label>

          <div className={styles.topActions}>
            <button className={styles.iconButton} type="button" aria-label="Notifications">
              <BellIcon />
            </button>
            <button className={styles.iconButton} type="button" aria-label="Settings">
              <SettingsIcon />
            </button>
            <div className={styles.profileCard}>
              <div className={styles.avatar}>F</div>
              <div>
                <div className={styles.profileName}>Fandy</div>
                <div className={styles.profileRole}>Operational Tier 1</div>
              </div>
            </div>
          </div>
        </div>

        <main className={styles.main}>
          <header className={styles.hero}>
            <div>
              <p className={styles.kicker}>Gate Control Terminal</p>
              <div className={styles.statusRow}>
                <h1 className={styles.pageTitle}>System Status:</h1>
                <span className={styles.statusBadge}>
                  <span className={styles.statusDot} />
                  ACTIVE
                </span>
              </div>
            </div>

            <div className={styles.nextArrival}>
              <span className={styles.warningIcon}>
                <WarningIcon />
              </span>
              <span>Next Expected Arrival: 14:42 (Train EX-904)</span>
            </div>
          </header>

          <section className={styles.cards}>
            {data.cards.map((card, index) => (
              <Card
                key={card.title}
                title={card.title}
                value={card.value}
                subtitle={'subtitle' in card ? card.subtitle : undefined}
                unit={index === 1 ? 'km/h' : index === 2 ? 'mins' : index === 3 ? 'ms' : 'unit' in card ? card.unit : ''}
                note={
                  index === 1
                    ? 'Stable baseline'
                    : index === 2
                      ? '-4% efficiency gain'
                      : index === 3
                        ? 'All nodes functional'
                        : 'note' in card
                          ? card.note
                          : ''
                }
                icon={index === 0 ? 'train' : index === 1 ? 'speed' : index === 2 ? 'timer' : 'chip'}
                accent={index === 2 ? 'amber' : 'blue'}
              />
            ))}
          </section>

          <section className={styles.chartSection}>
            <div className={styles.sectionHead}>
              <div>
                <h2>Train Traffic Analytics</h2>
                <p>Density analysis of kinetic node intersections</p>
              </div>

              <div className={styles.tabs}>
                <button
                  className={`${styles.tab} ${activeSeries === 'daily' ? styles.tabActive : ''}`}
                  type="button"
                  onClick={() => setActiveSeries('daily')}
                >
                  Daily
                </button>
                <button
                  className={`${styles.tab} ${activeSeries === 'weekly' ? styles.tabActive : ''}`}
                  type="button"
                  onClick={() => setActiveSeries('weekly')}
                >
                  Weekly
                </button>
                <button
                  className={`${styles.tab} ${activeSeries === 'monthly' ? styles.tabActive : ''}`}
                  type="button"
                  onClick={() => setActiveSeries('monthly')}
                >
                  Monthly
                </button>
                <button
                  className={`${styles.tab} ${activeSeries === 'yearly' ? styles.tabActive : ''}`}
                  type="button"
                  onClick={() => setActiveSeries('yearly')}
                >
                  Yearly
                </button>
              </div>
            </div>

            <Chart
              values={chartValues}
              labels={[...chartSeries[activeSeries].labels]}
              activeBarIndex={selectedBar}
              onBarClick={handleBarClick}
            />
          </section>

          <section className={styles.activitySection}>
            <div className={styles.sectionHead}>
              <h2>Recent Activity Log</h2>
              <a href="#" className={styles.historyLink}>
                View Full History
                <span aria-hidden="true">→</span>
              </a>
            </div>

            <ActivityTable rows={activities} />
          </section>

          <footer className={styles.footer}>© 2026 Sistem Palang KAI</footer>
        </main>
      </div>
    </div>
  )
}
