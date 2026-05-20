# 🚀 Fastech - Sistema de Gestión Empresarial (ERP)

Fastech es una solución integral de software diseñada para la administración y control de inventarios empresariales. Este sistema centraliza la gestión de productos, permitiendo a los administradores mantener un catálogo actualizado, realizar operaciones de mantenimiento (CRUD) y obtener una visión clara del stock disponible con una interfaz moderna y responsiva.

---

## 📸 Galería del Sistema

Aquí puedes visualizar el diseño y la funcionalidad del sistema:

### 1. Login de sesion (Administradores - Usuarios)
![Dashboard de Inicio]()
### 1. Panel de Inicio (Dashboard)
El centro de control donde se visualizan los productos activos con una interfaz de tarjetas modernas.
*(Inserta aquí tu imagen de las tarjetas del dashboard)*
![Dashboard de Inicio](URL_DE_TU_IMAGEN_AQUI)

### 2. Gestión de Inventario (Administración)
Tabla avanzada con herramientas de búsqueda, edición y eliminación de productos en tiempo real.
*(Inserta aquí tu imagen de la tabla de inventario)*
![Gestión de Inventario](URL_DE_TU_IMAGEN_AQUI)

---

## 🛠️ Especificaciones Técnicas

### Arquitectura
El proyecto sigue un patrón **Cliente-Servidor**:
* **Frontend:** Desarrollado en **React.js**. Utiliza hooks (`useState`, `useEffect`) para la manipulación de estados y una comunicación fluida con la API.
* **Backend:** Servidor en **Node.js** con **Express**, gestionando las peticiones HTTP y la lógica de negocio.
* **Base de Datos:** **MariaDB/MySQL**, donde reside toda la persistencia de datos (productos, precios y stock).

### Flujo de Datos
El sistema utiliza peticiones asíncronas (`fetch` / `async-await`) para asegurar que la interfaz de usuario no se bloquee mientras se procesan los datos en el servidor, garantizando una experiencia de usuario rápida y fluida.

---

## 🌟 Funcionalidades Clave

* **CRUD Completo:** Creación, Lectura, Actualización y Eliminación de productos con validaciones de seguridad.
* **Validación de Datos:** Sistema de alertas personalizadas para evitar errores de entrada (precios negativos, campos vacíos, etc.).
* **Búsqueda Dinámica:** Filtrado de productos en tiempo real a medida que el usuario escribe.
* **Diseño UI/UX "Dark Mode":** Estilos CSS enfocados en la legibilidad y la estética profesional, utilizando efectos de *blur* y *glassmorphism*.
* **Confirmación de Seguridad:** Ventanas modales integradas antes de realizar operaciones destructivas (borrado de datos).

---

## 📦 Guía de Instalación

Para ejecutar el sistema en tu entorno local:

1. **Clonar el repositorio:**
   ```bash
   git clone [https://github.com/TU_USUARIO/fastech.git](https://github.com/TU_USUARIO/fastech.git)
