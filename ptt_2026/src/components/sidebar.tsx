import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import styles from '@/styles/components/components.module.scss'
import { getSessionUserRole } from '@/lib/auth'

interface SidebarProps {
  active?: 'dashboard' | 'settings' | 'admin'
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

function GearIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 3.5 13.4 5l2-.3.9 1.7 1.9.5.1 2 1.4 1.3-1 1.8 1 1.8-1.4 1.3-.1 2-1.9.5-.9 1.7-2-.3L12 20.5l-1.4-1.4-2 .3-.9-1.7-1.9-.5-.1-2-1.4-1.3 1-1.8-1-1.8 1.4-1.3.1-2 1.9-.5.9-1.7 2 .3L12 3.5Z" />
      <circle cx="12" cy="12" r="3.2" />
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
        <div className={styles.logo}>
          <Image src="/logo2.png" alt="NeoGate logo" width={64} height={64} priority />
        </div>
        <div>
          <div className={styles.brandTitle}>Sistem Deteksi Palang Kereta</div>
          <div className={styles.brandSub}>Network Node 04</div>
        </div>
      </div>

      <nav className={styles.nav}>
        <a className={`${styles.navItem} ${active === 'dashboard' ? styles.navItemActive : ''}`} href="/dashboard">
          <span className={styles.navIcon}>
            <GridIcon />
          </span>
          Dashboard
        </a>
        <a className={`${styles.navItem} ${active === 'settings' ? styles.navItemActive : ''}`} href="/settings">
          <span className={styles.navIcon}>
            <GearIcon />
          </span>
          Settings
        </a>
        {showAdminMenu && (
          <a className={`${styles.navItem} ${active === 'admin' ? styles.navItemActive : ''}`} href="/admin/operators">
            <span className={styles.navIcon}>
              <UserPlusIcon />
            </span>
            Admin Operator
          </a>
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
