# Kunsang Gar V1 — Alcance México

Fecha de corte: 2026-09-19

## Objetivo

Cerrar una V1 concreta para Kunsang Gar México con presencia pública, contenido editorial, clases/eventos y cobros mexicanos en MXN mediante Mercado Pago.

## Incluido en V1

- Sitio público ROOT: Inicio, Servicios, Contacto, Clases, Kunsang Gar, Geshe Dangsong, Tradición Bön, Nuevo Bön, Rimé, Libros, Certificación, Oraciones, México 2026, Eventos, Programas/Enseñanzas y Donaciones.
- Contenido editorial migrado desde los documentos del cliente y materiales autorizados.
- Presentación de clases y eventos México con descripción, fechas, horarios, modalidad, donativo/precio, registro y estado histórico/próximo cuando la fuente lo confirma.
- Sadhana de todas las Dakinis y visita de Geshe octubre-noviembre 2026.
- Brochures públicos autorizados y assets institucionales autorizados.
- Checkout Pro para México: MXN, Mercado Pago, órdenes persistentes, referencia de concepto/evento, monto, `payment_status`, `payment_id` cuando exista, webhook, retorno de éxito, pendiente y cancelación/error.
- Donaciones México de una sola vez mediante Mercado Pago, sin inventar recurrencia.
- Administración mínima de contenido/programas disponible; la verificación operativa de órdenes queda pendiente de una vista protegida o del procedimiento operativo que se defina al conectar Supabase.

## Fuera de V1: PHASE_2

- Operación Estados Unidos o internacional.
- Stripe, PayPal, USD, EUR y multimoneda.
- Traducción integral ES/EN/TIB.
- Usuarios internacionales avanzados, membresías y perfiles avanzados.
- LMS avanzado, progreso, métricas avanzadas y automatizaciones internacionales.
- Biblioteca privada avanzada, permisos doctrinales avanzados y flujos complejos de solicitudes/aprobaciones.
- Tienda/e-commerce, Email & Comunicación, infraestructura internacional adicional y video/streaming avanzado.
- Nuevos módulos solicitados después del cierre de V1.

El código adelantado de estas áreas se conserva como referencia y backlog; no es requisito de cierre de V1.

## Regla de cierre

V1 no se declara completa hasta que el golden path mexicano pueda probarse de extremo a extremo con credenciales de Mercado Pago, Supabase y una acción de pago controlada. Sin esas credenciales, el frontend puede quedar `DEMO READY`, pero producción permanece bloqueada.
