import React from 'react'
import styles from './Contact.module.css'

const Contact = () => {
  return (
    <div id='contact' className={styles.contact}>
        <div className={styles.getInTouch}>
            <p className={styles.message}>
                Entre em contato
            </p>
            <div className={styles.email}>
                email@email.com
            </div>
        </div>
        <footer className={styles.pageFooter}>
            <p className={styles.mark}>
                kaique morais 2025
            </p>
            <div className={styles.socials}>
                <a>linkedin</a>
                <a>whatsapp</a>
            </div>
            <p className={styles.mark}>
                dev - renatoloren
            </p>
        </footer>
    </div>
  )
}

export default Contact
