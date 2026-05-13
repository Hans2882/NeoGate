import styles from '@/styles/components/components.module.scss'

interface Row {
  time: string
  gate: string
  sessionId: string
  gateState: string
  keretaLewat: string
  bahaya: string
  control: string
  limits: string
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
          <th>Gate</th>
          <th>Session ID</th>
          <th>Gate State</th>
          <th>Kereta Lewat</th>
          <th>Bahaya</th>
          <th>Control</th>
          <th>Limits</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r, i) => (
          <tr key={i}>
            <td>{r.time}</td>
            <td>
              <strong>{r.gate}</strong>
            </td>
            <td>
              <span className={styles.statusPill}>
                <span className={styles.statusIndicator} />
                {r.sessionId}
              </span>
            </td>
            <td>{r.gateState}</td>
            <td>{r.keretaLewat}</td>
            <td>{r.bahaya}</td>
            <td>{r.control}</td>
            <td>{r.limits}</td>
            <td className={styles.actionCell}>
              <button className={styles.actionButton} type="button" aria-label={`View ${r.sessionId}`}>
                <EyeIcon />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
