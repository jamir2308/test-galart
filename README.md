# Galart - Galería de Arte Mundial

Galart es una aplicación web que te permite explorar una vasta colección de obras de arte de todo el mundo, utilizando la API pública del Art Institute of Chicago. Este proyecto demuestra el uso de tecnologías modernas de desarrollo web y buenas prácticas para crear una experiencia de usuario fluida y eficiente.

## Tecnologías Principales Utilizadas

*   **Framework:** Next.js (v14+ con App Router)
*   **Lenguaje:** TypeScript
*   **Estilos:** Tailwind CSS
*   **Gestión de Estado (Cliente):** React Context
*   **Peticiones HTTP:** fetch
*   **Manejo de Formularios:** React Hook Form

**Centralización de Tipos:**
Las interfaces y tipos de TypeScript reutilizables se han centralizado en la carpeta `/types`. Esto mejora la organización, facilita el mantenimiento y reduce la duplicación de código. Los tipos se han agrupado por su dominio (API, autenticación, componentes).

## Credenciales para inicio de Sesión.

**User:** john@example.com

**Password:** password123


## Instalación y Ejecución del Proyecto

1.  **Clonar el repositorio:**
    ```bash
    git clone <URL_DEL_REPOSITORIO>
    cd <NOMBRE_DEL_PROYECTO>
    ```
2.  **Instalar dependencias:**
    Asegúrate de tener Node.js (v18 o superior recomendado) y npm/yarn/pnpm instalados.
    ```bash
    npm install
    # o
    # yarn install
    # o
    # pnpm install
    ```
3.  **Ejecutar el servidor de desarrollo:**
    ```bash
    npm run dev
    # o
    # yarn dev
    # o
    # pnpm dev
    ```
    La aplicación estará disponible en `http://localhost:3000` (o el puerto que se indique).

4.  **Para construir la versión de producción:**
    ```bash
    npm run build
    npm run start
    ```

## Documentación Adicional

## Carga y Visualización de Obras en la Galería Principal (Home)

Para la visualización de la extensa colección de obras de arte en la página principal, se consideran varias estrategias para equilibrar la experiencia de usuario, el rendimiento y la simplicidad de implementación.

**Forma Usada (Criterio): Scroll Infinito con `IntersectionObserver`**

*   **Descripción:** A medida que el usuario se desplaza (scroll) hacia el final de la lista de obras de arte visibles, se cargan automáticamente nuevas obras sin necesidad de una acción explícita (como hacer clic en un botón).
*   **Argumento:** Esta técnica ofrece la experiencia de usuario más fluida y moderna para explorar grandes catálogos visuales. Elimina la interrupción de tener que hacer clic en "cargar más" o navegar por páginas, permitiendo un descubrimiento continuo y envolvente del contenido. Es el estándar de facto en muchas aplicaciones de galerías y redes sociales.
*   **Implementación Típica:** Se utiliza la API `IntersectionObserver` del navegador para detectar cuándo un elemento "sentinel" (al final de la lista) entra en el viewport, lo que dispara la carga de más datos.

**Otras Formas Implementables:**

1.  **Botón "Cargar Más":**
    *   **Descripción:** Se muestra un conjunto inicial de obras y un botón. Al hacer clic, se cargan y añaden más obras a la lista.
    *   **Ventajas:** Sencillo de implementar y entender por el usuario. Proporciona un control explícito sobre la carga de datos.
    *   **Consideración:** Puede interrumpir el flujo de exploración en comparación con el scroll infinito.

2.  **Paginación Tradicional:**
    *   **Descripción:** Las obras se dividen en páginas discretas, y el usuario navega entre ellas usando controles numéricos (ej. "1, 2, 3, ..., Siguiente").
    *   **Ventajas:** Útil cuando los usuarios necesitan saltar a secciones específicas o cuando la cantidad de ítems por página es relevante. Facilita el marcado de URLs para páginas específicas.
    *   **Consideración:** Puede ser menos ideal para el descubrimiento visual continuo de una galería, donde el objetivo es más la exploración que la localización de un ítem en una página concreta.

La elección final depende de los objetivos específicos del proyecto y las preferencias de la experiencia de usuario que se quiera ofrecer. Para esta prueba, el enfoque de "Scroll Infinito" representa una opcion adecuada para una experiencia de usuario óptima.

---

## Estrategia de Logout

La estrategia de logout está alineada con la separación de contextos público/privado y el uso de Context API en React:

1. **Acción del Usuario:** El usuario hace clic en el botón/icono de "Cerrar Sesión" en el Header.
2. **Limpieza de Estado (Cliente):**
   - La función `logout` del contexto de autenticación (`AuthContext`) elimina el usuario y el estado de autenticación del contexto global.
3. **Limpieza de Sesión (Servidor):**
   - Se realiza una petición a `/api/auth/logout`, que elimina la cookie `authToken` (HttpOnly) en el servidor.
4. **Redirección:**
   - Tras el logout, el usuario es redirigido automáticamente a la página de login (`/login`).
5. **Protección por Middleware:**
   - Si el usuario intenta acceder a una ruta privada después del logout, el middleware detecta la ausencia de la cookie y lo redirige a `/login`.

**Ventaja:**  
Este enfoque asegura que tanto el estado del cliente como la sesión del servidor se limpian correctamente, y que la protección de rutas es robusta tanto en el cliente como en el servidor.

---

## Estado Global y Contexto Público/Privado

En este proyecto se utiliza **React Context** para la gestión del estado de autenticación, en lugar de Zustand u otras librerías.  
**¿Por qué Context es adecuado aquí?**
- El estado de autenticación es simple y global (usuario, token, estado de carga).
- Context permite compartir este estado entre layouts públicos y privados de forma sencilla.
- El Contexto se inicializa en el layout raíz, y los layouts público y privado consumen el estado según corresponda.
- El layout privado protege rutas y redirige a login si no hay sesión; el layout público redirige a home si ya hay sesión.

**Ventaja:**  
Context es nativo de React, fácil de mantener, y perfecto para separar el acceso público (login, registro) del privado (dashboard, home), permitiendo crecer el proyecto modularmente.

---

## Técnicas de Mejoramiento de Performance

Se implementaron varias técnicas avanzadas para optimizar el performance y la experiencia de usuario:

- **Server Components y SSR:**  
  La galería principal se renderiza en el servidor, enviando el HTML y las imágenes críticas en la primera respuesta, mejorando drásticamente el LCP.
- **Incremental Static Regeneration (ISR):**  
  Las respuestas de la API externa se cachean en el servidor por 1 hora, acelerando el TTFB para visitas subsecuentes.
- **Imágenes Responsivas y Prioridad:**  
  Las imágenes usan la prop `sizes` y URLs dinámicas para servir el tamaño óptimo según el dispositivo, y las imágenes LCP se marcan con `priority`.
- **Eliminación de dependencias pesadas:**  
  Se eliminó `axios` y otras librerías innecesarias del bundle inicial.
- **Optimización de fuentes:**  
  Se usa `next/font` con `display: swap` para evitar el bloqueo del renderizado por fuentes externas.
- **CDN y cacheo:**  
  El proyecto está preparado para ser servido desde un CDN, acelerando la entrega de recursos estáticos.

---

## Flujo de Tokenización

- **Token en Cookie HttpOnly:**  
  El token de autenticación se almacena en una cookie `HttpOnly` y `Secure`, inaccesible desde JavaScript, lo que protege contra XSS.
- **Verificación en Middleware y API:**  
  El middleware y los endpoints de API leen la cookie para validar la sesión, permitiendo proteger rutas tanto en el cliente como en el servidor.
- **Ventaja:**  
  Este enfoque es seguro, compatible con SSR y edge, y permite proteger rutas antes de que React se monte, mejorando la seguridad y la UX.

---

## Diseño/Arquitectura Público/Privado

- **Layouts separados:**  
  El proyecto usa layouts distintos para el contexto público (`/login`, `/register`) y privado (`/home`, `/dashboard`), lo que permite aislar la lógica de autenticación y navegación.
- **Escalabilidad:**  
  Esta arquitectura permite agregar nuevos módulos privados o públicos fácilmente, simplemente creando nuevas carpetas y layouts según el contexto.
- **Protección centralizada:**  
  El layout privado y el middleware aseguran que solo usuarios autenticados accedan a rutas protegidas, y que los públicos no vean páginas privadas.
- **Mantenibilidad:**  
  Separar el contexto público/privado hace que el código sea más limpio, fácil de entender y de escalar a futuro.

---
