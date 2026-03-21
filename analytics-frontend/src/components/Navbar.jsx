import React from 'react'
import { useNavigate } from 'react-router-dom'
import { removeToken, getUsername } from '../utils/auth'
import styles from './Navbar.module.css'

export default function Navbar({ onMenuClick }) {
  const navigate = useNavigate()
  const username = getUsername()

  const handleLogout = () => {
    removeToken()
    navigate('/login')
  }

  return (
    <nav className={styles.nav}>
      <button className={styles.hamburger} onClick={onMenuClick} aria-label="Toggle filters">
        <span /><span /><span />
      </button>

      <div className={styles.logo}>
        <span className={styles.dot} />
        <span className={styles.name}>Analytics OS</span>
      </div>

      <div className={styles.right}>
        {username && (
          <span className={styles.user}>// {username}</span>
        )}
        <button className={styles.logout} onClick={handleLogout}>
          Sign Out
        </button>
      </div>
    </nav>
  )
}
