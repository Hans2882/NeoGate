import React from 'react'
import styles from '../styles/dashboard.module.scss'

interface ChartProps {
  values: number[]
  labels?: string[]
}

const defaultLabels = ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '23:59']

export default function Chart({ values, labels = defaultLabels }: ChartProps) {
  const max = Math.max(...values, 1)

  return (
    <div className={styles.chartWrap}>
      <div className={styles.bars}>
        {values.map((v, i) => (
          <div
            key={i}
            className={`${styles.bar} ${i === 5 ? styles.barActive : ''}`}
            style={{ height: `${(v / max) * 100}%` }}
            title={`${v}`}
          />
        ))}
      </div>
      <div className={styles.xAxis}>
        {labels.map((label) => (
          <span key={label}>{label}</span>
        ))}
      </div>
    </div>
  )
}
