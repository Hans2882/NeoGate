import styles from '@/views/dashboard/dashboard.module.scss'

interface Row {
  time: string
  name: string
  status: string
  direction: string
  icon?: 'train' | 'cargo'
}

function VehicleIcon({ type = 'train' }: { type?: 'train' | 'cargo' }) {
  if (type === 'cargo') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 8.5h10v6H4z" />
        <path d="M14 10h3l2 2v2h-5z" />
        <circle cx="8" cy="17" r="1.6" />
        <circle cx="17" cy="17" r="1.6" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="7" y="4.5" width="10" height="14" rx="2.5" />
      <path d="M7 9.5h10M10 15.5h.01M14 15.5h.01M8.5 18.5l-1.5 2M15.5 18.5l1.5 2" />
    </svg>
  )
}

function EyeIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M2.8 12s3.3-5 9.2-5 9.2 5 9.2 5-3.3 5-9.2 5-9.2-5-9.2-5Z" />
      <circle cx="12" cy="12" r="2.2" />
    </svg>
  )
}

export default function ActivityTable({ rows }: { rows: Row[] }) {
  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th>Time</th>
          <th>Train Name/ID</th>
          <th>Gate Status</th>
          <th>Direction</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r, i) => (
          <tr key={i}>
            <td>{r.time}</td>
            <td>
              <div className={styles.trainCell}>
                <span
                  className={`${styles.trainIcon} ${
                    (r.icon ?? (r.name === 'PENATARAN' ? 'cargo' : 'train')) === 'cargo' ? styles.trainIconAmber : ''
                  }`}
                >
                  <VehicleIcon type={r.icon ?? (r.name === 'PENATARAN' ? 'cargo' : 'train')} />
                </span>
                <strong>{r.name}</strong>
              </div>
            </td>
            <td>
              <span className={`${styles.statusPill} ${r.status === 'UNPASSED' ? styles.statusPillAlert : ''}`}>
                <span className={styles.statusIndicator} />
                {r.status}
              </span>
            </td>
            <td>{r.direction}</td>
            <td className={styles.actionCell}>
              <button className={styles.actionButton} type="button" aria-label={`View ${r.name}`}>
                <EyeIcon />
              </button>
            </td>
            <td>👁️</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
