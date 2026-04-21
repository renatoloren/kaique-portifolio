"use client";

import { useState } from "react";
import styles from "./Menu.module.css";

export default function Menu() {
  const [selectedMenu, setSelectedMenu] = useState(null);

  const menus = [
    // { id: "#about", text: "sobre", isSelected: false },
    { id: "#projects", text: "projetos", isSelected: false },
    { id: "#contact", text: "contato", isSelected: false },
  ];

  const handleClick = (event, menuId) => {
    // event.preventDefault(); // Previne a navegação padrão do link
    setSelectedMenu(menuId); // Atualiza o estado com o id do menu selecionado
  };

  return (
    <div className={styles.menu}>
      {menus.map((menu) => (
        <p key={menu.id} className={styles.item}>
          <a
            href={menu.id}
            className={selectedMenu === menu.id ? styles.selected : ""}
            onClick={(event) => handleClick(event, menu.id)}
          >
            {menu.text.toUpperCase()}
          </a>
        </p>
      ))}
    </div>
  );
}
