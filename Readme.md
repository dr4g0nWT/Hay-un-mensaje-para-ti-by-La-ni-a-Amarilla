# 🌻 La Niña Amarilla | Hay un mensaje para ti

> Una plataforma web interactiva dedicada a la prevención del suicidio, ofreciendo recursos, apoyo y un espacio seguro de escucha.

![Estado del Proyecto](https://img.shields.io/badge/Estado-En_Desarrollo-yellow)
![Licencia](https://img.shields.io/badge/Licencia-MIT-blue)
![Node.js](https://img.shields.io/badge/Node.js-v14+-green)

## 📖 Descripción

Este proyecto es una aplicación web desarrollada con **Node.js** y **Express** que busca concienciar sobre la salud mental. A través de una narrativa visual basada en "Scroll Snap" (desplazamiento por secciones), el usuario viaja por diferentes escenarios (el jardín, el mensaje, los recursos) diseñados para transmitir calma y esperanza.

La aplicación cuenta con un sistema de autenticación seguro, diseño responsivo y una arquitectura escalable **MVC (Modelo-Vista-Controlador)**.

## ✨ Características Principales

* **Navegación Inmersiva:** Sistema de *Scroll Snap* vertical con transiciones suaves entre escenarios (Jardín, Info Amarilla, Recursos en las Nubes).
* **Diseño Pixel Art & Glassmorphism:** Estética visual cuidada con elementos gráficos animados y tarjetas con efecto de cristal.
* **Header Dinámico:** La barra de navegación cambia de color (claro/oscuro) automáticamente según el fondo de la sección visible.
* **Autenticación Segura:**
    * Login y Registro de usuarios.
    * Validación de contraseñas robusta (Cliente y Servidor).
    * Hashing de contraseñas utilizando **BcryptJS**.
* **Diseño Responsivo:** Adaptado completamente a móviles, tablets y escritorio.
* **Arquitectura MVC:** Código modular y organizado para facilitar el mantenimiento.

## 🛠️ Tecnologías Utilizadas

* **Backend:** Node.js, Express.js.
* **Frontend:** HTML5, CSS3 (Variables, Grid, Flexbox), JavaScript (Vanilla).
* **Motor de Plantillas:** EJS (Embedded JavaScript) con *Partials* para reutilización de componentes.
* **Seguridad:** BcryptJS (Hashing), Body-Parser.
* **Base de Datos:** MySQL (Integración en progreso - Estructura preparada).

## 📂 Estructura del Proyecto

El proyecto sigue el patrón de arquitectura **Modelo-Vista-Controlador (MVC)** para separar la lógica de la presentación:

```text
/PROYECTO
│
├── app.js               # Punto de entrada de la aplicación (Configuración del servidor)
├── routes/              # Definición de rutas (Endpoints)
│   ├── pages.js         # Rutas de navegación (Home, Login, Register)
│   └── auth.js          # Rutas de autenticación (POST Login/Register)
│
├── controllers/         # Lógica de negocio
│   ├── pageController.js # Renderizado de vistas
│   └── authController.js # Lógica de registro, hash y validaciones
│
├── public/              # Archivos estáticos
│   ├── css/             # Hojas de estilo modulares (hero.css, resources.css, etc.)
│   ├── img/             # Imágenes y assets gráficos
│   └── js/              # Scripts del lado del cliente (main.js)
│
├── views/               # Plantillas EJS
│   ├── partials/        # Componentes reutilizables (header, footer)
│   ├── index.ejs        # Página principal (Scrolls)
│   ├── login.ejs        # Vista de inicio de sesión
│   └── register.ejs     # Vista de registro
│
└── config/              # Configuraciones extra
    └── db.js            # (Futura conexión a BD)
