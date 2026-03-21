import React, { useEffect, useRef } from 'react'
import Flatpickr from 'react-flatpickr'
import styles from './FilterSidebar.module.css'

export default function FilterSidebar({ open, filters, onChange, onApply, onReset, onClose }) {
  const overlayRef = useRef(null)

  // lock body scroll on mobile when open
  useEffect(() => {
    document.body.style.overflow = open && window.innerWidth <= 768 ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  const handleDateChange = (dates) => {
    if (dates.length === 2) {
      onChange('startDate', dates[0].toISOString())
      onChange('endDate',   dates[1].toISOString())
    } else {
      onChange('startDate', '')
      onChange('endDate',   '')
    }
  }

  const dateValue = filters.startDate && filters.endDate
    ? [new Date(filters.startDate), new Date(filters.endDate)]
    : []

  return (
    <>
      {/* mobile overlay */}
      <div
        ref={overlayRef}
        className={`${styles.overlay} ${open ? styles.overlayOpen : ''}`}
        onClick={onClose}
      />

      <aside className={`${styles.sidebar} ${open ? styles.open : ''}`}>
        <div className={styles.header}>
          <span className={styles.title}>// Filters</span>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close">✕</button>
        </div>

        <div className={styles.group}>
          <label className={styles.label}>Date Range</label>
          <Flatpickr
            className={styles.input}
            options={{ mode: 'range', dateFormat: 'M d, Y' }}
            value={dateValue}
            onChange={handleDateChange}
            placeholder="Pick dates…"
          />
        </div>

        <div className={styles.group}>
          <label className={styles.label}>Age Group</label>
          <select
            className={styles.select}
            value={filters.age}
            onChange={(e) => onChange('age', e.target.value)}
          >
            <option value="">All Ages</option>
            <option value="under18">&lt; 18</option>
            <option value="18to40">18 – 40</option>
            <option value="over40">&gt; 40</option>
          </select>
        </div>

        <div className={styles.group}>
          <label className={styles.label}>Gender</label>
          <select
            className={styles.select}
            value={filters.gender}
            onChange={(e) => onChange('gender', e.target.value)}
          >
            <option value="">All Genders</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className={styles.actions}>
          <button className={styles.applyBtn} onClick={onApply}>Apply Filters</button>
          <button className={styles.resetBtn} onClick={onReset}>↺ Reset</button>
        </div>
      </aside>
    </>
  )
}
