import Head from 'next/head'
import Sidebar from '../components/sidebar'
import dashboardStyles from '../styles/dashboard.module.scss'
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
  return (
    <div className={dashboardStyles.page}>
      <Head>
        <title>Settings - NeoGate</title>
      </Head>

      <Sidebar active="settings" />

      <div className={dashboardStyles.mainContainer}>
        <div className={dashboardStyles.topBar}>
          <div className={dashboardStyles.brandTop}>NeoGate</div>

          <label className={dashboardStyles.search}>
            <span className={dashboardStyles.searchIcon}>
              <SearchIcon />
            </span>
            <input type="text" placeholder="Search setting options..." />
          </label>

          <div className={dashboardStyles.topActions}>
            <button className={dashboardStyles.iconButton} type="button" aria-label="Notifications">
              <BellIcon />
            </button>
            <button className={dashboardStyles.iconButton} type="button" aria-label="Settings">
              <SettingsIcon />
            </button>
            <div className={dashboardStyles.profileCard}>
              <div className={dashboardStyles.avatar}>F</div>
              <div>
                <div className={dashboardStyles.profileName}>Fandy</div>
                <div className={dashboardStyles.profileRole}>Operational Tier 1</div>
              </div>
            </div>
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
              <h2>Quick Controls</h2>
              <p className={styles.panelHint}>Status kontrol inti yang sedang aktif.</p>

              <div className={styles.settingList}>
                <div className={styles.settingRow}>
                  <span className={styles.settingText}>Alert Notification</span>
                  <span className={styles.settingStatus}>Enabled</span>
                </div>
                <div className={styles.settingRow}>
                  <span className={styles.settingText}>Auto Data Sync</span>
                  <span className={styles.settingStatus}>Every 15 min</span>
                </div>
                <div className={styles.settingRow}>
                  <span className={styles.settingText}>Emergency Broadcast</span>
                  <span className={styles.settingStatus}>Standby</span>
                </div>
              </div>
            </article>

            <article className={styles.panel}>
              <h2>Monitoring Preferences</h2>
              <p className={styles.panelHint}>Atur parameter agar sesuai kebutuhan stasiun.</p>

              <form className={styles.formGrid}>
                <label className={styles.fieldLabel}>
                  Node Name
                  <input className={styles.input} type="text" defaultValue="Network Node 04" />
                </label>

                <label className={styles.fieldLabel}>
                  Refresh Interval
                  <select className={styles.select} defaultValue="15m">
                    <option value="5m">5 Minutes</option>
                    <option value="15m">15 Minutes</option>
                    <option value="30m">30 Minutes</option>
                    <option value="60m">60 Minutes</option>
                  </select>
                </label>

                <label className={styles.fieldLabel}>
                  Alert Priority
                  <select className={styles.select} defaultValue="high">
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </label>
              </form>

              <div className={styles.actions}>
                <button type="button" className={styles.buttonPrimary}>
                  Save Settings
                </button>
                <button type="button" className={styles.buttonGhost}>
                  Reset
                </button>
              </div>
            </article>
          </section>
        </main>
      </div>
    </div>
  )
}
