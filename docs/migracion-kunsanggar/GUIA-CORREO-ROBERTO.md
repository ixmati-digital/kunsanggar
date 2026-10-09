# Correo de Kunsang Gar — guía para Roberto

## Antes de iniciar

El nuevo correo `@kunsanggar.com` todavía no está creado. Los buzones y mensajes anteriores se conservan intactos. Primero se necesita que Roberto controle una cuenta Hostinger propia y un plan de correo ligado al nuevo dominio, con cinco buzones disponibles. No se debe cambiar MX ni migrar mensajes hasta respaldar y verificar cada buzón.

No compartir la cuenta Hostinger de Jared: aloja otros sitios. Hostinger indica que compartir un plan de alojamiento da acceso a todos los sitios de ese plan y que la gestión de buzones no está permitida a usuarios compartidos. El acceso compartido separado a email sólo existe en planes de correo pagados; una cuenta propia de Roberto es la separación más segura. [Política de acceso compartido de Hostinger](https://www.hostinger.com/support/1583777-how-to-share-access-to-your-account-at-hostinger/)

## Acceso web

Cuando el servicio esté contratado y los buzones creados, entrar a Hostinger con la cuenta propia de Roberto, abrir **Emails**, seleccionar el dominio y pulsar **Webmail**. Usar la dirección completa y la contraseña individual del buzón. Mantener 2FA en la cuenta Hostinger.

## Añadir a móvil o computadora

Primero probar la configuración automática desde el panel del correo. Si la aplicación solicita configuración manual:

- Usuario: dirección completa `nombre@kunsanggar.com`.
- Contraseña: la contraseña de ese buzón.
- IMAP entrante: `imap.hostinger.com`, puerto 993, SSL/TLS.
- SMTP saliente: `smtp.hostinger.com`, puerto 465, SSL; alternativo 587 con STARTTLS.
- SMTP requiere autenticación con la misma dirección y contraseña.

No usar POP si se quiere que los mensajes/sent items se mantengan sincronizados entre dispositivos. [Parámetros IMAP/SMTP oficiales de Hostinger](https://www.hostinger.com/support/1575756-how-to-get-email-account-configuration-details-for-hostinger-email/)

## Migración de mensajes antiguos

No cambiar MX del dominio anterior ni borrar buzones. Para cada dirección: hacer copia/exportación, copiar carpetas por IMAP al buzón nuevo, comparar carpetas y conteos, verificar mensajes enviados y recepción, y conservar el origen como respaldo. Publicar MX/SPF/DKIM/DMARC nuevos sólo después de confirmar los valores que muestra el plan de correo activo y coordinar una ventana de cambio.

## Administración

Roberto debe crear y eliminar sus propios buzones desde su propia cuenta Hostinger. No se le debe invitar al hosting actual: comparte un plan con otros sitios y el acceso de hosting no está limitado a Kunsang Gar.
