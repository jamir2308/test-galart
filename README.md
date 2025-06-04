
**Centralización de Tipos:**
Las interfaces y tipos de TypeScript reutilizables se han centralizado en la carpeta `/types`. Esto mejora la organización, facilita el mantenimiento y reduce la duplicación de código. Los tipos se han agrupado por su dominio (API, autenticación, componentes).

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
3.  **Configurar variables de entorno (si aplica):**
    Si el proyecto requiere variables de entorno (ej. para claves de API, aunque la API del Art Institute es pública), crea un archivo `.env.local` en la raíz del proyecto y añade las variables necesarias. Ejemplo:
    ```env
    NEXT_PUBLIC_API_BASE_URL=https://api.artic.edu/api/v1
    ```
4.  **Ejecutar el servidor de desarrollo:**
    ```bash
    npm run dev
    # o
    # yarn dev
    # o
    # pnpm dev
    ```
    La aplicación estará disponible en `http://localhost:3000` (o el puerto que se indique).

5.  **Para construir la versión de producción:**
    ```bash
    npm run build
    npm run start
    ```

## Documentación Adicional

### Forma de Mostrar la Lista en la Home (Galería)

**Solución Implementada:**
La galería principal (`/dashboard/home`) implementa un sistema de carga de obras de arte que obtiene un conjunto inicial de tarjetas y ofrece un botón "Cargar Más Obras". Al hacer clic en este botón, se realiza una nueva petición a la API para obtener la siguiente página de resultados, que se añaden a la lista existente. El estado de carga se gestiona para mostrar indicadores visuales al usuario. Si bien se podría haber implementado un sistema de paginación más tradicional con números de página, el enfoque de "Cargar Más" cubre la solicitud de la prueba y ofrece una experiencia de usuario común para galerías infinitas.

**Alternativa Posible:**
Una mejora común sería implementar un **scroll infinito "verdadero"**. En lugar del botón, se utilizaría la API `IntersectionObserver` para detectar cuándo el usuario llega al final de la lista actual mientras hace scroll. Al alcanzar este punto (o un umbral cercano), se dispararía automáticamente la carga de la siguiente página de obras, creando una experiencia de navegación más fluida y continua, ideal para explorar grandes cantidades de contenido visual.

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

Actualmente, la aplicación realiza llamadas directas a la API pública del Art Institute of Chicago desde el cliente (o desde el servidor Next.js si se usa en Server Components/Route Handlers). Para mejorar la eficiencia, seguridad y control, se podría introducir un **Backend For Frontend (BFF)** propio.

**Mejora Propuesta: Implementar un BFF**

1.  **Crear Rutas API Propias en Next.js (o un microservicio separado):**
    En lugar de que el frontend llame directamente a `https://api.artic.edu/...`, llamaría a rutas API internas de nuestro proyecto Next.js, por ejemplo, `/api/artworks`, `/api/artworks/[id]`.
2.  **Agregación y Transformación de Datos en el BFF:**
    *   Estas rutas API internas actuarían como un proxy. Recibirían la solicitud del frontend y luego realizarían la llamada a la API externa del Art Institute.
    *   **Ventajas de Eficiencia:**
        *   **Reducción de Datos Transferidos al Cliente:** El BFF puede seleccionar solo los campos estrictamente necesarios para la UI, eliminando cualquier dato superfluo que la API externa pueda devolver. Esto reduce el payload y acelera la deserialización en el cliente.
        *   **Adaptación de Formato:** El BFF puede transformar la estructura de los datos de la API externa a un formato más conveniente o consistente para el frontend, evitando lógica de transformación compleja en el cliente.
        *   **Manejo de Múltiples Llamadas (Agregación):** Si una vista del frontend necesitara datos de múltiples endpoints de la API externa o incluso de diferentes APIs, el BFF podría realizar estas llamadas en paralelo y devolver una respuesta agregada y consolidada. Esto reduce la cantidad de peticiones de red que el cliente debe gestionar.
        *   **Cacheo en el BFF:** El BFF podría implementar estrategias de cacheo más sofisticadas para las respuestas de la API externa (ej. con Redis o en memoria). Esto puede reducir significativamente la latencia para solicitudes repetidas y disminuir la carga sobre la API externa. Next.js ya ofrece opciones de cacheo para sus Route Handlers, que podrían usarse aquí.
3.  **Mejoras Adicionales (Seguridad y Control):**
    *   **Ocultar Claves de API (si fueran necesarias):** Si la API externa requiriera una clave, esta se almacenaría y usaría de forma segura en el BFF, sin exponerla nunca al cliente.
    *   **Rate Limiting y Monitoreo:** El BFF puede implementar su propio rate limiting para proteger la API externa o para controlar el acceso desde el frontend. También facilita el monitoreo centralizado de las llamadas a la API.
    *   **Manejo de Errores Unificado:** El BFF puede estandarizar el formato de los errores devueltos al frontend, independientemente de cómo los devuelva la API externa.

**Implementación con Next.js Route Handlers:**
Se crearían archivos como `app/api/artworks/route.ts` que manejarían las solicitudes GET, realizarían la llamada a la API del Art Institute usando `fetch` (o Axios configurado para el servidor), procesarían la respuesta y la devolverían al cliente. Estos Route Handlers pueden beneficiarse de las opciones de cacheo y revalidación de Next.js.

Al introducir un BFF, aunque añade una capa adicional, se gana en eficiencia, desacoplamiento, seguridad y control sobre cómo los datos son consumidos por la aplicación frontend.

---