import React from 'react'
import styles from './About.module.css'

const About = () => {
  return (
        <section id='about' className={styles.about}>

               <h1 className={styles.section_title}>
                  {"Sobre mim"}
               </h1>
           <img src='images/me_3.GIF' className={styles.about_picture}/>

            <div className={styles.about_text}>


               <p className={styles.aboutText}>
                        {"Experiência em filmagens, direção de fotografia e edição, crio vídeos que unem "}
                        <span className={styles.highlight}>{"estética, "}</span> 
                        <span className={styles.highlight}>{"ritmo e "}</span>
                        <span className={styles.highlight}>{"storytelling "} </span> 
                        {"para dar destaque à sua marca, coleção ou projeto pessoal. Qualificado para levar sua visão do papel para a tela com "} 
                        <span className={styles.highlight}>{"criatividade e "}</span> 
                        <span className={styles.highlight}>{"técnica."}</span> 
               </p>
            </div>
               
        </section>
  )
}

export default About
