# Galart - Galería de Arte Mundial

Galart es una aplicación web que te permite explorar una vasta colección de obras de arte de todo el mundo, utilizando la API pública del Art Institute of Chicago. Este proyecto demuestra el uso de tecnologías modernas de desarrollo web y buenas prácticas para crear una experiencia de usuario fluida y eficiente.

## Tecnologías Principales Utilizadas

*   **Framework:** Next.js (v14+ con App Router)
*   **Lenguaje:** TypeScript
*   **Estilos:** Tailwind CSS
*   **Gestión de Estado (Cliente):** Zustand
*   **Peticiones HTTP:** Axios
*   **Manejo de Formularios:** React Hook Form
*   **Testing:** Jest/React Testing Library

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

1.  **Botón "Cargar Más" (Implementación Actual en la Prueba):**
    *   **Descripción:** Se muestra un conjunto inicial de obras y un botón. Al hacer clic, se cargan y añaden más obras a la lista.
    *   **Ventajas:** Sencillo de implementar y entender por el usuario. Proporciona un control explícito sobre la carga de datos.
    *   **Consideración:** Puede interrumpir el flujo de exploración en comparación con el scroll infinito.

2.  **Paginación Tradicional:**
    *   **Descripción:** Las obras se dividen en páginas discretas, y el usuario navega entre ellas usando controles numéricos (ej. "1, 2, 3, ..., Siguiente").
    *   **Ventajas:** Útil cuando los usuarios necesitan saltar a secciones específicas o cuando la cantidad de ítems por página es relevante. Facilita el marcado de URLs para páginas específicas.
    *   **Consideración:** Puede ser menos ideal para el descubrimiento visual continuo de una galería, donde el objetivo es más la exploración que la localización de un ítem en una página concreta.

La elección final depende de los objetivos específicos del proyecto y las preferencias de la experiencia de usuario que se quiera ofrecer. Para esta prueba, el enfoque de "Scroll Infinito" representa una opcion adecuada para una experiencia de usuario óptima.

### Estrategia de Logout

La estrategia de logout está diseñada para ser coherente con la separación de contextos público/privado de la aplicación:

1.  **Acción del Usuario:** El usuario hace clic en el botón/icono de "Cerrar Sesión" en el Header.
2.  **Limpieza de Estado (Cliente):**
    *   La función `handleLogout` en el componente `Header` llama a la acción `logout` del store de Zustand (`useAuthStore`).
    *   Esta acción `logout` en el store se encarga de:
        *   Eliminar el token de autenticación de las cookies HTTP (`Cookies.remove('authToken')`). Esta es la parte crucial para que el middleware reconozca al usuario como no autenticado en futuras solicitudes.
        *   Restablecer el estado de autenticación en Zustand a sus valores iniciales (token a `null`, usuario a `null`, `isAuthenticated` a `false`). Esto actualiza la UI inmediatamente en el lado del cliente.
3.  **Redirección:**
    *   Después de limpiar el estado y la cookie, se redirige al usuario a la página de login (`router.replace("/login")` o `/auth/login`).
4.  **Protección por Middleware:**
    *   Si el usuario intenta acceder a una ruta privada (ej. `/dashboard/home`) después del logout, el middleware, al no encontrar la `authToken` en las cookies, lo redirigirá automáticamente de nuevo a la página de login.

Esta estrategia asegura que tanto el estado del cliente como el reconocimiento del servidor (a través de la cookie) se actualicen, manteniendo la integridad del sistema público/privado.

### Propuesta de Mejora Teórica sobre Llamadas al Backend

Actualmente, la aplicación realiza llamadas directas a la API pública del Art Institute of Chicago desde el cliente y un handle router para mockear el login. Para mejorar la eficiencia, seguridad y control, propongo algunos patrones o buenas practicas.

**Backend For Frontend BFF**

Un Backend For Frontend (BFF) es una capa de backend ligera y específica de la interfaz que actúa como proxy entre el frontend y los servicios externos: agrupa, filtra y transforma datos, aplica caché y políticas de seguridad, y entrega al cliente solo la información necesaria en el formato óptimo. Para optimizar rendimiento, seguridad y control en tu proyecto, reemplaza las llamadas directas del cliente a la API pública del Art Institute por un BFF en Next .js mediante rutas internas (app/api/**); estas consultarán la API externa, devolverán solo los campos requeridos (ya formateados), podrán agregar datos de varios endpoints, cachear respuestas con la revalidación de Next, ocultar claves, aplicar rate-limiting y unificar el manejo de errores, de modo que el frontend consuma /api/artworks (u otras) y reciba una respuesta ligera, consistente y segura.

**Reducción de la Cantidad de Datos Transferidos (Payload Optimization):**

* GraphQL o Selección de Campos Específicos:
    * Teoría: En lugar de que las APIs RESTful devuelvan objetos completos con todos sus campos (over-fetching), permitir que el cliente solicite exactamente los campos que necesita. GraphQL está diseñado para esto por defecto. Algunas APIs REST también soportan parámetros como fields=id,name,description para lograr algo similar.
    * Eficiencia: Menor tamaño de payload significa menos ancho de banda consumido, menor tiempo de transferencia de red y deserialización más rápida en el cliente.
* Compresión de Datos:
    * Teoría: Aplicar algoritmos de compresión (como Gzip o Brotli) a las respuestas del backend antes de enviarlas al cliente. Los navegadores modernos pueden descomprimir esto automáticamente.
    * Eficiencia: Reduce drásticamente el tamaño de los datos transferidos por la red.

**Cacheo Estratégico:**

* Cacheo del Lado del Cliente (Navegador):
    * Teoría: Utilizar cabeceras HTTP como Cache-Control, Expires, y ETag para permitir que el navegador almacene en caché las respuestas. Con ETag y If-None-Match, el servidor puede devolver un 304 Not Modified si los datos no han cambiado, ahorrando el reenvío del payload completo.
    * Eficiencia: Las solicitudes subsecuentes para el mismo recurso pueden ser servidas instantáneamente desde la caché del navegador o con una validación rápida al servidor.
* Cacheo en el Servidor/CDN:
    * Teoría: Implementar capas de caché en el backend (ej. Redis, Memcached) o utilizar una Content Delivery Network (CDN) para cachear respuestas de API comunes o datos estáticos cerca de los usuarios.
    * Eficiencia: Reduce la carga sobre los servidores de origen, disminuye la latencia ya que los datos se sirven desde una ubicación más cercana o desde una caché rápida en memoria.
* Cacheo de Datos de Aplicación en el Cliente (State Management):
    * Teoría: Almacenar los datos obtenidos en el estado global del cliente (ej. Zustand, Redux, React Query) para evitar volver a solicitarlos si ya están disponibles y se consideran frescos.
    * Eficiencia: Evita llamadas de red innecesarias si los datos ya existen en el cliente y son válidos.
 
Estas son algunas de las estrategias teóricas más impactantes. La elección de cuáles implementar dependerá del contexto específico de la aplicación, los cuellos de botella identificados y los recursos disponibles. A menudo, una combinación de varias de estas técnicas produce los mejores resultados.

---
