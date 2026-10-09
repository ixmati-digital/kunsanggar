# Configurar el correo Kunsang Gar en un teléfono

Esta guía aplica cuando Roberto haya habilitado el servicio y creado el buzón `@kunsanggar.com`. No introduzcas credenciales de los buzones antiguos en un perfil nuevo.

## iPhone / iPad

1. Abrir **Ajustes → Apps → Mail → Cuentas de Mail → Añadir cuenta → Otra → Añadir cuenta de correo**.
2. Escribir nombre, dirección completa, contraseña del buzón y una descripción como “Kunsang Gar”.
3. Elegir **IMAP**.
4. Servidor entrante: `imap.hostinger.com`; usuario: correo completo; contraseña del buzón.
5. Servidor saliente: `smtp.hostinger.com`; usuario: correo completo; contraseña del buzón.
6. Guardar. Usar SSL en IMAP puerto 993 y SMTP puerto 465. Si SMTP no conecta, probar TLS/STARTTLS puerto 587.
7. Enviar un mensaje de prueba a una cuenta externa y responder desde ella. Confirmar que ambos aparecen en el teléfono y en Webmail.

## Android / Gmail

1. Gmail → foto de perfil → **Añadir otra cuenta → Otro**.
2. Introducir el correo completo y elegir **Personal (IMAP)**.
3. Servidor de entrada: `imap.hostinger.com`, seguridad SSL/TLS, puerto 993.
4. Servidor de salida: `smtp.hostinger.com`, seguridad SSL/TLS, puerto 465; activar inicio de sesión y usar la dirección completa.
5. Terminar la configuración y probar envío/recepción.

Mantén la contraseña privada, activa bloqueo del teléfono y no guardes datos de acceso en equipos compartidos. Parámetros vigentes según [Hostinger](https://www.hostinger.com/support/1575756-how-to-get-email-account-configuration-details-for-hostinger-email/).
