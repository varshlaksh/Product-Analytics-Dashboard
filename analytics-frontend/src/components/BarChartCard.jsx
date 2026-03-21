import React, { useRef } from 'react'
import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, BarElement,
  Tooltip, Legend,
} from 'chart.js'
import styles from './ChartCard.module.css'

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend)

export default function BarChartCard({ data, selectedFeature, onFeatureSelect, loading }) {
  const chartRef = useRef(null)

  const chartData = {
    labels: data.map((d) => d.feature),
    datasets: [
      {
        data: data.map((d) => d.count),
        backgroundColor: data.map((d) =>
          d.feature === selectedFeature ? '#00f0c8' : 'rgba(0,240,200,0.18)'
        ),
        borderColor: data.map((d) =>
          d.feature === selectedFeature ? '#00f0c8' : 'rgba(0,240,200,0.5)'
        ),
        borderWidth: 1,
        borderRadius: 4,
        hoverBackgroundColor: '#00f0c8',
      },
    ],
  }

  const options = {
    indexAxis: 'y',
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
        ticks: { color: '#50506a', font: { family: 'DM Mono', size: 10 } },
      },
      y: {
        grid:  { color: 'rgba(255,255,255,0.04)' },
        ticks: { color: '#50506a', font: { family: 'DM Mono', size: 10 } },
        beginAtZero: true,
      },
    },
    onClick: (_evt, elements) => {
      if (!elements.length) return
      const feature = data[elements[0].index].feature
      onFeatureSelect(feature)
    },
    onHover: (evt, elements) => {
      evt.native.target.style.cursor = elements.length ? 'pointer' : 'default'
    },
  }

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div>
          <div className={styles.title}>Feature Usage</div>
          <div className={styles.sub}>Total clicks · click a bar to drill down</div>
        </div>
        <div className={styles.badge}>Bar</div>
      </div>

      <div className={styles.chartWrap}>
        {loading && (
          <div className={styles.overlay}>
            <div className={styles.spinner} />
          </div>
        )}
        {!loading && data.length === 0 && (
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>📭</div>
            <div className={styles.emptyText}>No data for this range</div>
          </div>
        )}
        <Bar ref={chartRef} data={chartData} options={options} />
      </div>

      {selectedFeature && (
        <div className={styles.hint}>→ selected: {selectedFeature}</div>
      )}
    </div>
  )
}
