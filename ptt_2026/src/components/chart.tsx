import React from 'react'
import styles from '@/views/dashboard/dashboard.module.scss'

interface ChartProps {
  values: number[]
  labels?: string[]
  activeBarIndex?: number
  onBarClick?: (index: number) => void
}

const defaultLabels = ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '23:59']

export default function Chart({ values, labels = defaultLabels, activeBarIndex, onBarClick }: ChartProps) {
  const max = Math.max(...values, 1)
  const activeIndex = activeBarIndex ?? values.indexOf(max)

  return (
    <div className={styles.chartWrap}>
      <div className={styles.bars}>
        {values.map((v, i) => (
          <button
            key={i}
            type="button"
            className={`${styles.bar} ${i === activeIndex ? styles.barActive : ''}`}
            style={{ height: `${(v / max) * 100}%` }}
            onClick={() => onBarClick?.(i)}
            aria-label={`Point ${i + 1}: ${v}`}
            title={`${v}`}
          />
        ))}
      </div>
      <div className={styles.xAxis} style={{ gridTemplateColumns: `repeat(${labels.length}, minmax(0, 1fr))` }}>
        {labels.map((label) => (
          <span key={label}>{label}</span>
        ))}
      </div>
    </div>
  )
}
