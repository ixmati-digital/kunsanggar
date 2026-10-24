# Entrega final — Kunsang Gar

Fecha de corte: 24 de octubre de 2026 · Sitio: https://kunsanggar.com/

## Estado

**Terminado con dependencias externas.** El sitio público y las secciones solicitadas están publicadas. El acceso automático tras pagos Stripe no se declara operativo: la configuración real del endpoint/secretos no se pudo comprobar y las seis actividades del ciclo no tienen precios autorizados.

## Publicado y comprobado

- Clases, eventos y fichas públicas en español e inglés; las descripciones largas inglesas del ciclo se muestran sin alterar fechas, precios ni URLs.
- Clases públicas: el alumno con sesión existente pudo volver desde su cuenta a la clase pendiente y ver la continuación al Payment Link. No se abrió el enlace ni se pagó.
- Sangha: el álbum de octubre muestra siete fotos únicas; la portada no se duplica. Los siete objetos de Storage responden correctamente. La tarjeta de prácticas diarias tiene inglés completo y no muestra el aviso de álbum vacío.
- Library, seis PDF de oraciones, dos videos de YouTube y testimonios visibles en producción.
- Cinco imágenes recibidas de Lena coinciden visualmente con sus originales y el SHA-256 de lo servido coincide con los assets publicados.
- CMS: pantalla de acceso revisada visualmente en español e inglés. Los perfiles conservan los roles ADMIN de Roberto y CONTENT_MANAGER de Lena.
- Supabase se verificó mediante la conexión de Kunsang Gar. Se conservaron RLS, pagos e inscripciones; no se tocaron datos reales ni se realizaron cargos.
- El antiguo dominio redirige al oficial; la documentación interna `/docs/` responde 403.
- No se trabajó en la propuesta internacional ni en sus precios.

## Pruebas no realizadas

- No había sesiones autenticadas autorizadas de Roberto o Lena para probar inicio/cierre en CMS, permisos efectivos, carga múltiple, publicación o exención. No se alteraron inscripciones reales.
- No se envió/recibió correo real de recuperación y no se cambió ninguna contraseña.
- No se envió evento Stripe firmado de test mode ni se realizó un cargo. GET a `https://kunsanggar.vercel.app/api/stripe-class-webhook` responde 405, consistente con una ruta POST; esto no prueba el registro del webhook en Stripe ni las variables de Vercel.
- No se pudo ejecutar la carpeta adicional de Google Drive desde el enlace compartido; quedan siete fotos conocidas publicadas.
- Las reglas CSS incluyen adaptación móvil, pero no se probó un viewport real de teléfono en este cierre.
- No se cambió el horario recurrente de Monte Kailash por la discrepancia entre martes y viernes.

## Dependencias externas

- Sesión autorizada de Roberto y Lena para confirmar las operaciones autenticadas del CMS.
- Acceso/configuración de Supabase Auth para verificar la entrega real del correo y la URL de retorno.
- Configuración de Stripe/Vercel verificable y precios aprobados para cada actividad antes de afirmar o activar el cobro automático.
- Confirmación del horario de Monte Kailash y acceso a la carpeta de Drive para cotejar si Lena envió fotografías adicionales.

## Git y despliegue

Repositorio: `ixmati-digital/kunsanggar`, rama `main`. Los commits históricos `bb902ca` y `75b27ac` están integrados. El último commit de código de este cierre es `7fcec97b77fa3cc68bedc408aff2e55fe2e9b87d`; la documentación se actualiza en un commit posterior. Hostinger desplegó automáticamente los archivos publicados y se compararon los assets cache-busted descargados en producción con el código local. El último commit del cierre documental debe consultarse como HEAD de `origin/main`.

Los cambios locales ajenos permanecen respaldados en `/private/tmp/KunsangGar-preserve-20261024`; no se ejecutó reset destructivo. No se usó Hostinger File Manager, no se cambió DNS ni se modificó la propuesta internacional.
