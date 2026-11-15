# Registro privado de visitas en Markdown

Se ha sustituido el correo por archivos locales. No se utiliza Web3Forms, Resend, Cloudflare ni tareas programadas para registrar visitas. El formulario de contacto conserva Web3Forms.

## XAMPP: listo para usar

Abrir el portfolio desde `http://localhost/Proyectos/LandingPage-GO/`. Una visita normal de navegador crea automáticamente `registros-visitas/AAAA-MM-DD.md`. La carpeta existe desde la instalación; el primer archivo de cada día se crea solo cuando hay una visita. Se actualiza al registrar las siguientes.

Cada archivo muestra fecha, zona horaria Europe/Madrid, total diario, última visita y una tabla con las horas (incluido el desfase de verano/invierno) y el número acumulado. No se registra IP, correo, identidad ni procedencia. Los comentarios Markdown contienen únicamente hashes distintos por día para evitar duplicados.

Una visita equivale a una sesión por pestaña. Las recargas y navegar entre el portfolio y el juego dentro de la misma sesión no suman. Tras 30 minutos sin cargar una página o al cambiar de día se cuenta una nueva sesión. Una pestaña visible que permanece abierta al cambiar el día se registra en el minuto siguiente. Los navegadores automatizados no cuentan. Los bloqueadores, JavaScript desactivado o el almacenamiento bloqueado pueden impedir el registro.

El archivo utiliza un bloqueo exclusivo para no perder incrementos con visitas simultáneas y admite hasta 8 MiB por día. Si no se puede escribir, devuelve un error sin interrumpir la navegación. No hay cola de entrega ni recuento garantizado ante fallos de red o disco. No modificar los archivos manualmente mientras se registran visitas: los metadatos permiten mantener el total y la deduplicación.

## Privacidad del directorio

- Abrir los Markdown con el explorador/editor de archivos del ordenador o con el gestor privado del alojamiento.
- En Apache, `registros-visitas/.htaccess` deniega la lectura por HTTP. Es necesario permitir estas reglas; en otros servidores configurar una denegación equivalente.
- `.gitignore` excluye todos los Markdown de la carpeta para que no se suban a GitHub. No forzar su inclusión en commits.
- Para un alojamiento público se recomienda guardar los registros **fuera de la raíz pública** usando `VISIT_LOG_DIR`.
- No se ha añadido un panel público ni una ruta para descargar los registros.

## Visitas de la web publicada

**GitHub Pages no ejecuta PHP y no puede guardar archivos en este ordenador ni en el repositorio.** Para registrar visitas de la web pública, alojar `services/visits` en un servidor PHP 8.1 o superior y configurar:

- `VISIT_ALLOWED_ORIGIN`: origen exacto del portfolio, por ejemplo `https://pachinoss.github.io`.
- `VISIT_BASE_PATH`: ruta base del portfolio, por ejemplo `/LandingPage-GO/`.
- `VISIT_LOG_DIR`: ruta absoluta de una carpeta privada, escribible por PHP, preferiblemente fuera de la raíz pública.

En Apache estas variables pueden establecerse mediante `SetEnv` en la configuración del sitio; en otros alojamientos usar sus variables de entorno. Si el registrador vive junto al portfolio en el mismo alojamiento PHP, el origen y la ruta se detectan automáticamente. Revisar HTTPS si el servidor utiliza un proxy inverso.

Editar `js/visit-config.js`: en la rama de producción, sustituir el endpoint vacío por la URL HTTPS del registrador, por ejemplo `https://TU-ALOJAMIENTO/services/visits/register.php`. No es necesaria una contraseña SMTP ni una API key. Mientras el endpoint público esté vacío, **solo se registran las visitas locales de XAMPP**.

El endpoint verifica origen, tamaño, tipo de contenido y formato de sesión. CORS no autentica personas: un cliente fuera de un navegador puede falsificar el origen. El recuento es aproximado. Antes de publicarlo es recomendable habilitar límites de peticiones en el alojamiento para evitar abuso. Actualizar la información de privacidad del sitio según el uso real.

## Comprobaciones

```powershell
C:\xampp\php\php.exe tests/visit-log.php
```

Las pruebas usan una carpeta temporal y la eliminan al terminar; no crean visitas ficticias en `registros-visitas`. Para verificar la integración real, abrir el sitio en una ventana privada normal, esperar dos segundos, consultar el archivo del día y recargar. El total no debe incrementarse con cada recarga. Comprobar que la URL `/registros-visitas/AAAA-MM-DD.md` devuelve 403 y no muestra el contenido.
