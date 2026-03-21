import React, { useState, useEffect, useCallback } from 'react'
import Navbar from '../components/Navbar'
import FilterSidebar from '../components/FilterSidebar'
import StatCard from '../components/StatCard'
import BarChartCard from '../components/BarChartCard'
import LineChartCard from '../components/LineChartCard'
import { useAnalytics } from '../hooks/useAnalytics'
import { saveFilters, loadFilters } from '../utils/filters'
import styles from './DashboardPage.module.css'

function computeStats(barData) {
  const total = barData.reduce((s, d) => s + d.count, 0)
  const top = [...barData].sort((a, b) => b.count - a.count)[0]
  return {
    total: total.toLocaleString(),
    features: barData.length,
    top: top?.feature ?? '—',
  }
}

export default function DashboardPage() {
  const [sidebarOpen,     setSidebarOpen]     = useState(false)
  const [selectedFeature, setSelectedFeature] = useState(null)
  const [filters, setFilters] = useState(() => loadFilters()) // restore from cookies on mount

  const { barData, lineData, loading, load, track } = useAnalytics()

  /* initial load */
  useEffect(() => {
    load(filters)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  /* ── filter helpers ── */
  const handleFilterChange = useCallback((key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
    track(key === 'age' ? 'age_filter' : key === 'gender' ? 'gender_filter' : 'date_filter')
  }, [track])

  const handleApply = useCallback(() => {
    saveFilters(filters)
    setSelectedFeature(null)
    setSidebarOpen(false)
    load(filters)
    track('date_filter')
  }, [filters, load, track])

  const handleReset = useCallback(() => {
    const cleared = { startDate: '', endDate: '', age: '', gender: '' }
    setFilters(cleared)
    saveFilters(cleared)
    setSelectedFeature(null)
    setSidebarOpen(false)
    load(cleared)
  }, [load])

  /* ── bar click → drill into feature ── */
  const handleFeatureSelect = useCallback((feature) => {
    setSelectedFeature(feature)
    track('bar_chart_zoom')
    load({ ...filters, feature }, true /* lineOnly */)
  }, [filters, load, track])

  const stats = computeStats(barData)

  return (
    <div className={styles.page}>
      <Navbar onMenuClick={() => setSidebarOpen((o) => !o)} />

      <div className={styles.shell}>
        <FilterSidebar
          open={sidebarOpen}
          filters={filters}
          onChange={handleFilterChange}
          onApply={handleApply}
          onReset={handleReset}
          onClose={() => setSidebarOpen(false)}
        />

        <main className={styles.main}>
          <div className={styles.pageHeader}>
            <h1>Feature Analytics</h1>
            <p>// usage tracking · click a bar to drill into a feature's time trend</p>
          </div>

          {/* ── Stats row ── */}
          <div className={styles.statsRow}>
            <StatCard label="Total Clicks"    value={stats.total}    accentColor="var(--accent)"  delay={0.05} />
            <StatCard label="Unique Features" value={stats.features} accentColor="var(--accent3)" delay={0.10} />
            <StatCard label="Top Feature"     value={stats.top}      accentColor="var(--accent2)" delay={0.15} />
          </div>

          {/* ── Charts ── */}
          <div className={styles.chartsGrid}>
            <BarChartCard
              data={barData}
              selectedFeature={selectedFeature}
              onFeatureSelect={handleFeatureSelect}
              loading={loading}
            />
            <LineChartCard
              data={lineData}
              selectedFeature={selectedFeature}
              loading={loading}
            />
          </div>
        </main>
      </div>
    </div>
  )
}
