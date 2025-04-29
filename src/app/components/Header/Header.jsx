import React from 'react'
import Menu from '../Menu/Menu'
import styles from './Header.module.css'

const Header = () => {
  return (
    <header className={styles.header}>
        <p className={styles.logo}>kaique morais</p>
        <Menu />
    </header>
  )
}

export default Header
