import Menu from "./components/Menu/Menu";
import TypingEffect from "./components/WelcomeText/WelcomeText";
import styles from "./page.module.css";

export default function Home() {
  const texts = [
    "Olá, eu sou o Motion Designer!",
    "Esse é um efeito de digitação.",
    "Aproveite a animação!",
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <p>Kaique Morais Motion Designer</p>
        <Menu />
      </div>
      <section className={styles.welcome}></section>
      <section className={styles.about}>
        <p>{"Kaique Morais".toUpperCase()}</p>
      </section>{" "}
      <section className={styles.projects}>
        <p>{"Kaique Morais".toUpperCase()}</p>
      </section>{" "}
      <section className={styles.contact}>
        <p>{"Kaique Morais".toUpperCase()}</p>
      </section>
    </div>
  );
}
