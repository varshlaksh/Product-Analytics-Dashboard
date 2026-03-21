import { useState, useCallback } from 'react'
import { fetchAnalytics, trackEvent } from '../services/api'

export function useAnalytics() {
  const [barData,   setBarData]   = useState([])
  const [lineData,  setLineData]  = useState([])
  const [loading,   setLoading]   = useState(false)
  const [error,     setError]     = useState(null)

  const load = useCallback(async (filters = {}, lineOnly = false) => {
    if (!lineOnly) setLoading(true)
    setError(null)
    try {
      const data = await fetchAnalytics(filters)
      if (!lineOnly) setBarData(data?.barChart  || [])
      setLineData(data?.lineChart || [])
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [])

  const track = useCallback((featureName) => {
    trackEvent(featureName).catch(() => {}) // fire-and-forget
  }, [])

  return { barData, lineData, loading, error, load, track }
}
