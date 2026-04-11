import styles from '../styles/dashboard.module.scss'

type CardIcon = 'train' | 'speed' | 'timer' | 'chip'
type CardAccent = 'blue' | 'amber'

interface CardProps {
  title: string
  value: string
  subtitle?: string
  unit?: string
  note?: string
  icon?: CardIcon
  accent?: CardAccent
}

function CardGlyph({ icon = 'train' }: { icon?: CardIcon }) {
  if (icon === 'speed') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M5 14a7 7 0 1 1 14 0" />
        <path d="M12 12l4-4" />
        <path d="M7.5 17h9" />
      </svg>
    )
  }

  if (icon === 'timer') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="13" r="6.5" />
        <path d="M12 9.5v3.5" />
        <path d="M12 4h3" />
      </svg>
    )
  }

  if (icon === 'chip') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="7.5" y="7.5" width="9" height="9" rx="1.5" />
        <path d="M10 3.5v3M14 3.5v3M10 17.5v3M14 17.5v3M3.5 10h3M3.5 14h3M17.5 10h3M17.5 14h3" />
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

function getSubtitleParts(subtitle?: string) {
  if (!subtitle) {
    return { unit: '', note: '' }
  }

  const normalized = subtitle.replace('â€”', '—')
  const [first, second] = normalized.split('—').map((part) => part.trim())

  if (!second) {
    return { unit: '', note: first ?? '' }
  }

  return { unit: first ?? '', note: second ?? '' }
}

export default function Card({ title, value, subtitle, unit, note, icon, accent = 'blue' }: CardProps) {
  const subtitleParts = getSubtitleParts(subtitle)
  const resolvedUnit = unit ?? subtitleParts.unit
  const resolvedNote = note ?? subtitleParts.note
  const isAmber = accent === 'amber' || resolvedNote.toLowerCase().includes('efficiency')

  return (
    <article className={`${styles.card} ${isAmber ? styles.cardAmber : styles.cardBlue}`}>
      <div className={styles.cardHead}>
        <div className={styles.cardTitle}>{title}</div>
        <span className={styles.cardIcon}>
          <CardGlyph icon={icon} />
        </span>
      </div>

      <div className={styles.cardMetric}>
        <span className={styles.cardValue}>{value}</span>
        {resolvedUnit ? <span className={styles.cardUnit}>{resolvedUnit}</span> : null}
      </div>

      {resolvedNote ? (
        <div className={`${styles.cardSubtitle} ${isAmber ? styles.cardSubtitleAmber : ''}`}>
          {resolvedNote}
        </div>
      ) : null}
    </article>
  )
}
