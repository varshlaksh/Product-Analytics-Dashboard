import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './index.css'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import { getToken } from './utils/auth'

function PrivateRoute({ children }) {
  return getToken() ? children : <Navigate to="/login" replace />
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <DashboardPage />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<Navigate to={getToken() ? '/dashboard' : '/login'} replace />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)
