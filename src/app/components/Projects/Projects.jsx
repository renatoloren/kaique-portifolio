import React from 'react'
import styles from './Projects.module.css'
import projects from '@/data/projects.json';
import ProjectCard from '../ProjectCard/ProjectCard';

const Projects = () => {

  return (
        <section className={styles.projects}>
            <h2>Projetos</h2>
                {projects.map(project => (
                            project.images?.[0] && (
                                <ProjectCard key={project.name} image={project.images[0]} title={project.name} date={project.date} videoUrl={project.link}/>
                            )
                    ))
                }
        </section>
  )
}

export default Projects