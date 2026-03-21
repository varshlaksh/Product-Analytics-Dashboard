import React from 'react'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, PointElement, LineElement,
  Filler, Tooltip, Legend,
} from 'chart.js'
import styles from './ChartCard.module.css'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip, Legend)

export default function LineChartCard({ data, selectedFeature, loading }) {
  const chartData = {
    labels: data.map((d) => d.date),
    datasets: [
      {
        data: data.map((d) => d.count),
        borderColor: '#a78bfa',
        backgroundColor: 'rgba(167,139,250,0.07)',
        borderWidth: 2,
        pointRadius: 3,
        pointBackgroundColor: '#a78bfa',
        tension: 0.4,
        fill: true,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#13131e',
        titleColor: '#eeeef5',
        bodyColor: '#50506a',
        borderColor: '#1a1a2e',
        borderWidth: 1,
        padding: 10,
        titleFont: { family: 'DM Mono', size: 12 },
        bodyFont:  { family: 'DM Mono', size: 11 },
      },
    },
    scales: {
      x: {
        grid:  { color: 'rgba(255,255,255,0.04)' },
        ticks: { color: '#50506a', font: { family: 'DM Mono', size: 10 }, maxRotation: 35 },
      },
      y: {
        grid:  { color: 'rgba(255,255,255,0.04)' },
        ticks: { color: '#50506a', font: { family: 'DM Mono', size: 10 } },
        beginAtZero: true,
      },
    },
  }

  return (
    <div className={styles.card} style={{ '--top-line': 'var(--accent3)' }}>
      <div className={styles.header}>
        <div>
          <div className={styles.title}>Time Trend</div>
          <div className={styles.sub}>Daily click count over time</div>
        </div>
        <div className={`${styles.badge} ${selectedFeature ? styles.badgeActive : ''}`}>
          {selectedFeature || 'All Features'}
        </div>
      </div>

      <div className={styles.chartWrap}>
        {loading && (
          <div className={styles.overlay}>
            <div className={styles.spinner} />
          </div>
        )}
        {!loading && data.length === 0 && (
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>📈</div>
            <div className={styles.emptyText}>No timeline data</div>
          </div>
        )}
        <Line data={chartData} options={options} />
      </div>
    </div>
  )
}
