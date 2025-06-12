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


### Estado Global

Aunque el estado global de esta aplicación es relativamente simple (principalmente estado de autenticación), usar Zustand es una decisión totalmente justificable y, en muchos aspectos, una mejor práctica que usar solo React Context.

#### Justificaciones para usar Zustand

1. Menos Boilerplate y Más Sencillez:
   * React Context: Requiere crear un contexto (createContext), un Provider que envuelva tu árbol de componentes (<AuthProvider>), y usar el hook useContext en cada componente que consuma el estado.
    * Zustand: crear un "store" con una simple función create(). Luego, en cualquier componente, simplemente llamas al hook useAuthStore() para acceder al estado y las acciones. No se necesita envolver la aplicación en ningún provider. Esto mantiene el árbol de componentes más limpio.
  
2. Rendimiento Superior (Evita Re-renders Innecesarios):

   * Este es el argumento técnico más importante.
    * React Context: Cuando cualquier valor dentro del estado del contexto cambia, todos los componentes que consumen ese contexto (useContext) se vuelven a renderizar, incluso si no usan la          parte específica del estado que cambió.
    * Zustand: Está optimizado para evitar esto. Puedes seleccionar "rebanadas" (slices) del estado. Un componente solo se volverá a renderizar si la rebanada específica del estado que le             interesa ha cambiado.

3. Lógica Desacoplada del Árbol de React:

    * El store de Zustand es un objeto JavaScript que vive fuera del árbol de componentes de React. Esto facilita la organización de la lógica del estado (como login, logout) y hace que sea más       fácil de probar de forma aislada.

4. Middleware Integrado:

    * Zustand tiene un ecosistema de middleware muy potente. Se esta usando persist para guardar el estado en sessionStorage y se ha integrado js-cookie en las acciones. Hacer esto con React           Context sería mucho más manual y verboso, probablemente requiriendo useEffects dentro de tu componente Provider para sincronizar el estado con sessionStorage y las cookies.

#### Consideraciones

Aunque el impacto en el rendimiento puede no ser dramático en una aplicación de este tamaño, las ventajas arquitectónicas son claras:

* Es más escalable: Si la aplicación crece y más componentes necesitan acceder a diferentes partes del estado, la optimización de re-renders de Zustand se volverá cada vez más valiosa.
* Es más limpio: La ausencia de Providers y la capacidad de seleccionar el estado de forma concisa hacen que el código sea más legible y fácil de mantener.
* Es más potente: La facilidad para añadir middleware como persist es una gran ventaja.
  
#### ¿Cuándo sería suficiente React Context?

React Context es ideal para pasar datos que no cambian con frecuencia o para evitar el "prop drilling" en un sub-árbol de componentes localizado y no en toda la aplicación. Por ejemplo, para un estado de un formulario complejo que se comparte entre varios componentes hijos de ese formulario, o para un tema (claro/oscuro) que no cambia a menudo.

Para un estado verdaderamente global y dinámico como la autenticación del usuario, que es accedido desde lugares muy diferentes (Header, páginas, middleware indirectamente), Zustand (o librerías similares como Redux Toolkit, Jotai, etc.) es una solución arquitectónicamente más robusta y eficiente.


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
