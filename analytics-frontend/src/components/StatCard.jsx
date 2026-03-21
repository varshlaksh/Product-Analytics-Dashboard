import React from 'react'
import styles from './StatCard.module.css'

export default function StatCard({ label, value, accentColor, delay = 0 }) {
  return (
    <div
      className={styles.card}
      style={{
        '--card-accent': accentColor,
        animationDelay: `${delay}s`,
      }}
    >
      <div className={styles.label}>{label}</div>
      <div className={styles.value}>{value ?? '—'}</div>
    </div>
  )
}
