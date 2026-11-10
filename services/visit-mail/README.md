# Avisos de visitas por correo

Estado: código preparado; envío desactivado hasta desplegar y configurar el servicio.
Destino ya configurado: **joanpabloorozco@gmail.com**.

GitHub Pages sirve la web estática. Este Worker se despliega por separado en Cloudflare y utiliza Resend para enviar el correo. El formulario de contacto mantiene su integración actual con Web3Forms.

## Activación

1. Acceder a una cuenta de Resend y habilitar un remitente autorizado. Crear una API key de envío. El remitente debe cumplir los requisitos de verificación de Resend; no basta con conocer el correo de destino.
2. Acceder a Cloudflare Workers. Revisar `SITE_URL` en `wrangler.toml` si el portfolio usa un dominio diferente al de GitHub Pages.
3. Desde esta carpeta, con Wrangler instalado, ejecutar:

   ```powershell
   npx wrangler login
   npx wrangler secret put RESEND_API_KEY
   npx wrangler secret put MAIL_FROM
   npx wrangler deploy
   ```

   Introducir cada valor en el prompt privado de Wrangler. No escribir las claves en Git, el HTML, el JavaScript público ni en el chat. `MAIL_FROM` es el remitente autorizado, por ejemplo `Portfolio <avisos@tu-dominio-verificado>`.

4. En `js/visit-config.js`, cambiar el valor vacío de `endpoint` por `https://URL-DEL-WORKER.workers.dev/visit`. No poner ninguna API key ahí.
5. Publicar los archivos del portfolio en GitHub Pages. Las cuentas de Cloudflare y Resend tienen cuotas; revisar el plan elegido antes de activar el envío.
6. Abrir la web publicada en una ventana privada, esperar dos segundos y comprobar la recepción del primer aviso. Recargar: no debe llegar un segundo mensaje. Cerrar la ventana privada y abrir otra para probar una sesión nueva. Revisar spam si procede.

## Qué cuenta como visita

- Una sesión de navegación por pestaña. Tras 30 minutos sin cargar una página de la web se genera una sesión nueva en la siguiente carga.
- No se envían avisos desde localhost, HTTP ni navegadores automatizados.
- Si se bloquea JavaScript, el almacenamiento de sesión o la petición, esa visita puede no detectarse. No garantiza contar todas las personas ni excluir todos los bots.
- Se envían únicamente la ruta pública y la fecha de inicio de la sesión. Se omiten consultas, fragmentos, IP, correo del visitante, huella digital y procedencia.
- Cloudflare recibe la IP por la propia conexión y la utiliza para limitar peticiones. No se guarda ni se incluye en los correos de esta aplicación.
- Resend recibe el destinatario y el contenido del aviso. Revisar esta integración al actualizar la información de privacidad del sitio.

## Protección y fiabilidad

- Destinatario y remitente se fijan en el servidor; el navegador no puede elegirlos.
- Se valida el origen y la ruta y se limitan cuerpo y frecuencia de peticiones (5 por minuto por IP). CORS no autentica a una persona: un cliente externo puede falsificar el origen. Los avisos son aproximados; ante abuso hay que reforzar los límites o incorporar verificación de bot.
- La clave de idempotencia de Resend evita envíos duplicados durante 24 horas al reintentar el mismo evento. El evento conserva ruta, identificador y fecha para que el cuerpo de los reintentos no cambie.
- Los fallos de correo no interrumpen la web. Una nueva carga o volver a la pestaña permite reintentar los avisos que no se han confirmado. No hay cola de entrega garantizada.
- No se ha enviado ningún correo de prueba real ni se ha desplegado el Worker automáticamente.

Referencias: [Resend: enviar correo](https://resend.com/docs/api-reference/emails/send-email), [idempotencia](https://resend.com/docs/dashboard/emails/idempotency-keys), [Cloudflare: secretos](https://developers.cloudflare.com/workers/configuration/secrets/), [límites de peticiones](https://developers.cloudflare.com/workers/runtime-apis/bindings/rate-limit/).
