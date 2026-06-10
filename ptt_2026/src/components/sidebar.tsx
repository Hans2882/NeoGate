import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import styles from '@/styles/components/components.module.scss'
import { getSessionUserRole } from '@/lib/auth'

interface SidebarProps {
  active?: 'dashboard' | 'admin'
  isOpen?: boolean
}

function GridIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="4" y="4" width="6" height="6" rx="1" />
      <rect x="14" y="4" width="6" height="6" rx="1" />
      <rect x="4" y="14" width="6" height="6" rx="1" />
      <rect x="14" y="14" width="6" height="6" rx="1" />
    </svg>
  )
}

function HelpIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M9.8 9.4a2.6 2.6 0 1 1 4.3 2c-.7.6-1.4 1.1-1.4 2.2" />
      <circle cx="12" cy="17.2" r="0.8" fill="currentColor" stroke="none" />
    </svg>
  )
}

function UserPlusIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="9" cy="8" r="3.5" />
      <path d="M3.5 18.5c.7-2.8 2.8-4.5 5.5-4.5s4.8 1.7 5.5 4.5" />
      <path d="M18 8v6" />
      <path d="M15 11h6" />
    </svg>
  )
}

export default function Sidebar({ active = 'dashboard', isOpen = false }: SidebarProps) {
  const [showAdminMenu, setShowAdminMenu] = useState(false)

  useEffect(() => {
    const role = getSessionUserRole()
    setShowAdminMenu(role === 'admin' || role === 'superadmin')
  }, [])

  return (
    <aside className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : styles.sidebarClosed}`}>
      <div className={styles.brand}>
      </div>

      <nav className={styles.nav}>
        <Link className={`${styles.navItem} ${active === 'dashboard' ? styles.navItemActive : ''}`} href="/dashboard">
          <span className={styles.navIcon}>
            <GridIcon />
          </span>
          Dashboard
        </Link>
        {showAdminMenu && (
          <Link className={`${styles.navItem} ${active === 'admin' ? styles.navItemActive : ''}`} href="/admin/operators">
            <span className={styles.navIcon}>
              <UserPlusIcon />
            </span>
            Tambah Operator
          </Link>
        )}
        
      </nav>

      <div className={styles.sidebarFooter}>
        <button className={styles.emergency}>EMERGENCY OVERRIDE</button>
        <a className={styles.helpCenter} href="#">
          <span className={styles.helpIcon}>
            <HelpIcon />
          </span>
          Help Center
        </a>
      </div>
    </aside>
  )
}
