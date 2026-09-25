(() => {
  'use strict';

  const STORAGE_KEY = 'kunsang-language';
  const SUPPORTED = new Set(['es', 'en']);
  const path = window.location.pathname.replace(/\/index\.html$/, '/');
  const page = path === '/' ? 'home' : path.replace(/^\//, '').replace(/\/$/, '').replace(/\.html$/, '').replace(/\//g, '-');

  const common = {
    'Saltar al contenido': 'Skip to content',
    'Abrir menú': 'Open menu',
    'Cerrar menú': 'Close menu',
    'Volver al inicio': 'Back to top',
    'Volver al contenido inicial': 'Back to top',
    'Navegación principal': 'Main navigation',
    'Navegación institucional': 'Institutional navigation',
    'Navegación': 'Navigation',
    'Contacto': 'Contact',
    'Contáctanos': 'Contact us',
    'Donaciones': 'Donations',
    'Servicios': 'Services',
    'Servicios y Acompañamiento Espiritual': 'Services and Spiritual Guidance',
    'Clases y actividades': 'Classes and activities',
    'Oraciones y recursos': 'Prayers and resources',
    'Prayers y recursos': 'Prayers and resources',
    'Ceremonias y oraciones': 'Ceremonies and prayers',
    'Bendiciones para hogar y negocio': 'Blessings for home and business',
    'Orientación a través de la muerte / Phowa': 'Guidance through death / Phowa',
    'Guidance a través de la muerte / Phowa': 'Guidance through death / Phowa',
    'Consulta espiritual': 'Spiritual consultation',
    'Modalidades y espacios de participación': 'Formats and ways to participate',
    'Reunión de práctica en la playa con banderas de colores': 'Practice gathering on a beach with colorful flags',
    'Geshe Dangsong Namgyal sentado con túnica amarilla': 'Geshe Dangsong Namgyal seated in a yellow robe',
    'Ilustración de meditación para la certificación Naljor': 'Meditation illustration for Naljor certification',
    'Representación de Sidpa Gyalmo': 'Representation of Sidpa Gyalmo',
    'Conoce los servicios': 'Learn about services',
    'Conoce la certificación': 'Learn about certification',
    'Conoce las clases': 'Learn about classes',
    'Ir a Donaciones': 'Go to Donations',
    'Nuestra visión': 'Our vision',
    'Maestro y fundador': 'Teacher and founder',
    'Tradición': 'Tradition',
    'Participa': 'Join',
    'Enseñanzas y práctica': 'Teachings and practice',
    'Sabiduría antigua para la sociedad moderna': 'Ancient wisdom for modern society',
    'Kunsang Gar México': 'Kunsang Gar Mexico',
    'Inicio': 'Home',
    'Clases': 'Classes',
    'Kunsang Gar': 'Kunsang Gar',
    'Geshe Dangsong': 'Geshe Dangsong',
    'Tradición Bön': 'Bön Tradition',
    'Nuevo Bön': 'New Bön',
    'Rimé': 'Rimé',
    'Sangha': 'Sangha',
    'Certificación': 'Certification',
    'Oraciones': 'Prayers',
    'México 2026': 'Mexico 2026',
    'Acceso': 'Access',
    'Acceso del practicante': 'Practitioner access',
    'Maestro y fundador': 'Teacher and founder',
    'Acceso ·': 'Access ·',
    'Redes': 'Social',
    'Copyright 2026 Kunsang Gar México.': 'Copyright 2026 Kunsang Gar Mexico.',
    'Sabiduría, práctica y comunidad.': 'Wisdom, practice and community.',
    'Pago único en México.': 'One-time payment in Mexico.',
    'Escribir por correo': 'Email us',
    'Informes por WhatsApp': 'Information via WhatsApp',
    'WhatsApp / teléfono': 'WhatsApp / phone',
    'Correo electrónico': 'Email address',
    'Contraseña': 'Password',
    'Nombre': 'Name',
    'Solicitar información': 'Request information',
    'Solicitar información ↗': 'Request information ↗',
    'Secciones de servicios': 'Services sections',
    'Secciones de clases': 'Class sections',
    'Secciones de eventos': 'Event sections',
    'Secciones de Bön': 'Bön sections',
    'Secciones de la biografía': 'Biography sections',
    'Secciones de Kunsang Gar': 'Kunsang Gar sections',
    'Prácticas de acompañamiento y ofrenda': 'Guidance and offering practices',
    'Prácticas de acompañamiento': 'Guidance practices',
    'Estudio, escritura y transmisión': 'Study, writing and transmission',
    'Comunidad, estudio y práctica': 'Community, study and practice',
    'Tradición Budista Tibetana': 'Tibetan Buddhist Tradition',
    'Flyer oficial de la clase': 'Official class flyer',
    'Material de presentación': 'Presentation material',
    'Recuperación de alma': 'Soul retrieval',
    'Ritual y relación con los elementos': 'Ritual and relationship with the elements',
    'Diálogo y reconocimiento entre tradiciones': 'Dialogue and recognition between traditions',
    'He escrito más de 20 libros en tibetano e inglés. Mi primer libro en inglés, Pure Dzogchen, ha sido traducido a varios idiomas. Desde Kunsang Gar he expandido las enseñanzas a los Estados Unidos, Europa, Latinoamérica y Asia.': 'I have written more than 20 books in Tibetan and English. My first English book, Pure Dzogchen, has been translated into several languages. From Kunsang Gar I have expanded the teachings to the United States, Europe, Latin America and Asia.',
    '“No importa cuál sea el origen de uno: el camino del Dzogchen Puro puede llevarnos al reconocimiento trascendente de la Naturaleza de la Mente.”': '“Regardless of one’s origin, the path of Pure Dzogchen can lead to a transcendent recognition of the Nature of Mind.”',
    'Los textos antiguos hablan de una categoría triple: mente o conciencia, sem en tibetano; pensamiento o intelecto, yi; y alma, la. La analogía dada es que la mente es como el fuego, el intelecto como la luz del fuego y el alma como el humo.': 'Ancient texts describe a threefold category: mind or consciousness, sem in Tibetan; thought or intellect, yi; and soul, la. The analogy is that mind is like fire, intellect like the light of fire and soul like smoke.',
    'Algunos recursos requieren autorización previa y no están disponibles para descarga pública.': 'Some resources require prior authorization and are not available for public download.',
    'Enseñanza sobre vacío, luminosidad, rigpa y Tantra Madre Bön.': 'Teaching on emptiness, luminosity, rigpa and Mother Tantra Bön.',
    'Entre los más difundidos están los Cuatro Vehículos Causales: Signos, como adivinación, astrología, medicina y ritos de limpieza y nutrición; Apariciones, varios tipos de ritos protectores; Poder Mágico, ritos coléricos; y Ritos Funerarios.': 'Among the most widespread are the Four Causal Vehicles: Signs, such as divination, astrology, medicine and cleansing and nourishment rites; Apparitions, various protective rites; Magical Power, wrathful rites; and Funeral Rites.',
    'Meditación Dzogchen': 'Dzogchen Meditation',
    'por sesión': 'per session',
    'por una sesión': 'for a session',
    'media hora': 'half an hour',
    'Para solicitar un servicio o recibir información actualizada, escribe a': 'To request a service or receive updated information, write to',
    'o utiliza': 'or use',
    'Informes': 'Information',
    'Próximamente': 'Coming soon',
    'Archivo histórico': 'Historical archive',
    'Registro histórico': 'Historical record',
    'Volver a Clases': 'Back to Classes',
    'Volver a Donaciones': 'Back to Donations',
    'Volver al inicio': 'Back to Home',
    'Abrir brochure': 'Open brochure',
    'Descargar Español ↓': 'Download Spanish ↓',
    'Download English ↓': 'Download English ↓',
    'Ver eventos': 'View events',
    'Ver información': 'View information',
    'Acceder': 'Access',
    'Iniciar sesión': 'Sign in',
    '¿Aún no tienes cuenta?': "Don't have an account yet?",
    'Crear cuenta': 'Create account',
    'Cerrar sesión': 'Sign out',
    'Ver programas': 'View programs',
    'Iniciar sesión para consultar programas y contenido autorizado.': 'Sign in to view programs and authorized content.',
    'Correo:': 'Email:',
    'Rol:': 'Role:',
    'Pagar con Mercado Pago': 'Pay with Mercado Pago',
    'Registrarme ↗': 'Register ↗',
    'Donar con Mercado Pago': 'Donate with Mercado Pago',
    'Solicitar instrucciones por WhatsApp ↗': 'Request instructions via WhatsApp ↗',
    'Escribir por correo': 'Email us',
    'Consulta la información vigente antes de inscribirte.': 'Check current information before registering.',
    'Conoce las formas de apoyar a Kunsang Gar México.': 'Learn how to support Kunsang Gar Mexico.',
    'Conoce la certificación ↗': 'Learn about certification ↗',
    'Conoce las clases': 'Learn about classes',
    'Conoce los servicios ↗': 'Learn about services ↗',
    'Conoce Oraciones': 'Explore Prayers',
    'Conoce la Tradición Bön': 'Explore Bön Tradition',
    'Conoce Kunsang Gar': 'Discover Kunsang Gar',
    'Conoce a Geshe Dangsong': 'Meet Geshe Dangsong',
    'Ir a Donaciones ↗': 'Go to Donations ↗',
    'Ver México 2026': 'View Mexico 2026',
    'Programa de Sabiduría': 'Wisdom Program',
    'Programa de Sabiduría de Kunsang Gar': 'Kunsang Gar Wisdom Program',
    'Programa de Enseñanza Kunsang Gar': 'Kunsang Gar Teaching Program',
    'Sabiduría fundamental': 'Fundamental Wisdom',
    'Desarrollo mental': 'Mental Development',
    'Sabiduría por excelencia': 'Ultimate Wisdom',
    'Práctica principal': 'Main practice',
    'Siempre excelente, todo bueno, completo, perfecto y siempre positivo.': 'Always excellent, completely good, whole, perfect and always positive.',
    'Campamento o lugar. Un espacio para la bondad para todos, en todas partes y en todo momento.': 'A camp or place. A space for goodness for everyone, everywhere and at all times.',
    'Dzogchen o Meditación de la Mente Natural.': 'Dzogchen, or Natural Mind Meditation.',
    'Saltar al contenido': 'Skip to content',
    'Contenido protegido': 'Protected content',
    'Recursos de práctica preservados': 'Preserved practice resources',
    'Material protegido': 'Protected material',
    'Recursos': 'Resources',
    'Rituales': 'Rituals',
    'Orientación': 'Guidance',
    'Cultura': 'Culture',
    'Estructura': 'Structure',
    'Participación': 'Participation',
    'Camino de práctica': 'Practice path',
    'Práctica': 'Practice',
    'Estudio y práctica': 'Study and practice',
    'Estudio, práctica y comunidad.': 'Study, practice and community.',
    'Programa': 'Program',
    'Área del practicante': 'Practitioner area',
    'Inicia sesión para consultar programas y contenido autorizado.': 'Sign in to view programs and authorized content.',
    'Estudio y desarrollo': 'Study and development',
    'Acompañamiento': 'Guidance',
    'Generosidad · México': 'Generosity · Mexico',
    'Comunidad': 'Community',
    'Visión': 'Vision',
    'Historia': 'History',
    'Formación': 'Training',
    'Trabajo internacional': 'International work',
    'Una visión amplia': 'A broad view',
    'Ejemplo ritual': 'Ritual example',
    'Introducción a la nueva oración': 'Introduction to the new prayer',
    'Material de presentación': 'Presentation material',
    'Brochures': 'Brochures',
    'Próxima clase': 'Next class',
    'Sadhana de todas las Dakinis': 'Sadhana of all Dakinis',
    'Donación Kunsang Gar México': 'Kunsang Gar Mexico donation',
    'Donativo único en MXN mediante Mercado Pago.': 'One-time donation in MXN through Mercado Pago.',
    'Concepto de pago no disponible.': 'This payment option is unavailable.',
    'Online': 'Online',
    'Presencial': 'In person',
    'Viernes': 'Friday',
    'Sábado': 'Saturday',
    'Español': 'Spanish',
    'Inglés': 'English',
    'Público': 'Public',
    'Enseñanzas': 'Teachings',
    'Biblioteca': 'Library',
    'Abrir recurso': 'Open resource',
    'Inicia sesión o solicita autorización para acceder.': 'Sign in or request authorization to access this resource.',
    'Aún no hay programas publicados.': 'No programs have been published yet.',
    'No hay recursos disponibles para este usuario.': 'No resources are available for this user.',
    'Supabase no está configurado; la biblioteca no puede cargar contenido.': 'The library is not available at this time.',
    'Programa de estudio y práctica.': 'Study and practice program.',
    'Recurso asociado a un programa publicado.': 'Resource associated with a published program.',
    'México · MXN · Mercado Pago': 'Mexico · MXN · Mercado Pago',
    'MÉXICO · MXN · MERCADO PAGO': 'MEXICO · MXN · MERCADO PAGO',
    'Completar pago.': 'Complete payment.',
    'Flujo de pago único para actividades y donaciones de Kunsang Gar México.': 'One-time payment flow for Kunsang Gar Mexico activities and donations.',
    'Concepto': 'Description',
    'Total': 'Total',
    'Monto': 'Amount',
    'Serás enviado a Mercado Pago para completar el pago en MXN. No se solicitan datos de tarjeta en este sitio.': 'You will be sent to Mercado Pago to complete payment in MXN. Card details are not requested on this site.',
    'Continuar a Mercado Pago': 'Continue to Mercado Pago',
    'Mercado Pago': 'Mercado Pago',
    'Mercado Pago · México': 'Mercado Pago · Mexico',
    'Retorno recibido.': 'Return received.',
    'Gracias. Estamos consultando el estado de la orden registrada.': 'Thank you. We are checking the status of the recorded order.',
    'Estado: consultando': 'Status: checking',
    'Estado recibido': 'Received status',
    'Estado:': 'Status:',
    'Estado de la orden': 'Order status',
    'Referencia': 'Reference',
    'Identificador de pago': 'Payment ID',
    'No recibida': 'Not received',
    'Pendiente de confirmación': 'Awaiting confirmation',
    'Pendiente': 'Pending',
    'El retorno no incluyó una referencia de orden. Confirma el resultado por WhatsApp si es necesario.': 'The return did not include an order reference. Confirm the result via WhatsApp if necessary.',
    'Demo local: el estado real se consulta cuando el endpoint seguro de Supabase esté configurado.': 'Local demo: the live status is checked once the secure endpoint is configured.',
    'El estado mostrado proviene de la orden registrada. La confirmación definitiva depende del webhook de Mercado Pago.': 'The displayed status comes from the recorded order. Final confirmation depends on the Mercado Pago notification.',
    'El pago regresó a la plataforma, pero el estado de la orden aún no puede consultarse. La confirmación depende del webhook de Mercado Pago.': 'The payment returned to the platform, but the order status cannot be checked yet. Confirmation depends on the Mercado Pago notification.',
    'Consultando la orden y el webhook de Mercado Pago.': 'Checking the order and the Mercado Pago notification.',
    'Pago pendiente.': 'Payment pending.',
    'Mercado Pago recibió la operación y todavía no ha confirmado el estado final.': 'Mercado Pago received the operation and has not yet confirmed its final status.',
    'La orden queda pendiente de confirmación.': 'The order is awaiting confirmation.',
    'El webhook actualizará el estado cuando Mercado Pago envíe la notificación.': 'The order status will update when Mercado Pago sends its notification.',
    'Pago no completado.': 'Payment not completed.',
    'La operación fue cancelada o no pudo completarse.': 'The operation was cancelled or could not be completed.',
    'No se presenta como pago aprobado.': 'It is not shown as an approved payment.',
    'Revisa el estado de tu operación directamente en Mercado Pago o vuelve a intentarlo.': 'Check your operation directly in Mercado Pago or try again.',
    'Intentar de nuevo': 'Try again',
    'Contactar': 'Contact us',
    'Pago recibido': 'Payment received',
    'Pago pendiente': 'Payment pending',
    'Pago no completado': 'Payment not completed',
    'Volver a la landing': 'Back to event page',
    'La inscripción y el donativo están cerrados': 'Registration and donations are closed',
    'Donativo cerrado': 'Donation closed',
    'La actividad ya concluyó.': 'The activity has ended.',
    'Consulta la memoria': 'View the record',
    'Esta ficha conserva la información de la enseñanza realizada.': 'This page preserves information about the completed teaching.',
    'Realizar donativo': 'Make a donation',
    'Completar registro': 'Complete registration',
    'Ya realicé mi donativo': 'I already made my donation',
    'Comunidad dedicada al estudio y práctica de la tradición Yungdrung Bön.': 'A community dedicated to the study and practice of the Yungdrung Bön tradition.',
    'Ir a detalles': 'Go to details',
    'Ir a detalles del curso': 'Go to course details',
    'Enseñanza finalizada': 'Completed teaching',
    'Ver detalles': 'View details',
    'Ver registro histórico': 'View historical record',
    'Qué aprenderás': 'What you will learn',
    'Aspectos centrales del curso destacado': 'Core aspects of the featured course',
    'Aspectos centrales de la enseñanza': 'Core aspects of the teaching',
    'Información del curso': 'Course information',
    'Información': 'Information',
    'Evento': 'Event',
    'Boleto General': 'General admission',
    'Cantidad': 'Quantity',
    'Una sola enseñanza abierta en este momento': 'One teaching record is currently available',
    'La información publicada corresponde únicamente a Mujeres Sagradas de la Gran Perfección.': 'The published information concerns only Sacred Women of the Great Perfection.',
    'Mujeres Sagradas de la Gran Perfección': 'Sacred Women of the Great Perfection',
    'Treinta Signos y significados de la Naturaleza Última en la Antigua Tradición Tibetana.': 'Thirty Signs and Meanings of Ultimate Nature in the Ancient Tibetan Tradition.',
    '25 y 26 de julio de 2026': 'July 25 and 26, 2026',
    'Sábado y domingo, 2:00 a.m. hora de CDMX': 'Saturday and Sunday, 2:00 a.m. Mexico City time',
    'WhatsApp': 'WhatsApp',
    'Facebook': 'Facebook',
    'Correo': 'Email',
    'Sitio oficial': 'Official site',
    'Inscribirme ahora': 'Register now'
  };

  const pageMaps = {
    home: {
      'Centro Budista Kunsang Gar México': 'Kunsang Gar Mexico Buddhist Center',
      'Sabiduría antigua para la sociedad moderna.': 'Ancient wisdom for modern society.',
      'Promover la Sabiduría de Kunsang Gar y llevar las tradiciones antiguas a la sociedad moderna para nutrir mentes más pacíficas, promover la curación física y ambiental y encontrar la máxima realización de la verdadera naturaleza.': 'To promote Kunsang Gar Wisdom and bring ancient traditions into modern society, nurturing more peaceful minds, supporting physical and environmental healing, and realizing the true nature.',
      'Nuestro principal estudio y práctica es Dzogchen o Meditación de la Mente Natural.': 'Our main study and practice is Dzogchen, or Natural Mind Meditation.',
      'Enseñanzas y práctica': 'Teachings and practice',
      'Un lugar para cultivar sabiduría, paz y continuidad.': 'A place to cultivate wisdom, peace and continuity.',
      'Las mayores aspiraciones de Geshe Namgyal y los miembros de Kunsang Gar son promover la Sabiduría de Kunsang Gar y llevar las tradiciones antiguas a la sociedad moderna.': 'Geshe Namgyal and the members of Kunsang Gar aspire to promote Kunsang Gar Wisdom and bring ancient traditions into modern society.',
      'Geshe Dangsong Namgyal es el maestro y fundador de Kunsang Gar. Conoce su trayectoria y el contexto institucional de sus enseñanzas.': 'Geshe Dangsong Namgyal is the teacher and founder of Kunsang Gar. Learn about his journey and the institutional context of his teachings.',
      'Acompañamiento espiritual': 'Spiritual guidance',
      'Prácticas y ceremonias espirituales de Kunsang Gar.': 'Kunsang Gar spiritual practices and ceremonies.',
      'Acompañamiento espiritual para espacios de vida y trabajo.': 'Spiritual guidance for homes and workplaces.',
      'Orientación espiritual relacionada con la muerte y la transición.': 'Spiritual guidance related to death and transition.',
      'Un espacio para solicitar orientación sobre la práctica.': 'A space to request guidance about practice.',
      'Un programa para comprender los fundamentos y desarrollar una mente con mayor salud mental, equilibrio emocional y paz.': 'A program to understand the foundations and develop greater mental health, emotional balance and peace.',
      'Comprensión fundamental y enseñanzas para comenzar el estudio.': 'Foundational understanding and teachings for beginning study.',
      'Prácticas para cultivar equilibrio emocional y una mente en paz.': 'Practices for cultivating emotional balance and a peaceful mind.',
      'La profundización del camino de estudio y práctica.': 'Deepening the path of study and practice.',
      'Tradición': 'Tradition',
      'Bön: cultura del antiguo Tíbet': 'Bön: culture of ancient Tibet',
      'Bön es la cultura espiritual indígena de Zhang Zhung, el área que rodea el monte Kailash en el Tíbet actual. La tradición Bön tiene una rica historia de tantra, chamanismo y meditación.': 'Bön is the indigenous spiritual culture of Zhang Zhung, the area surrounding Mount Kailash in present-day Tibet. The Bön tradition has a rich history of tantra, shamanism and meditation.',
      'Participa': 'Join',
      'Encuentra clases semanales, programas y actividades de Kunsang Gar en modalidad presencial y en línea.': 'Find weekly classes, programs and Kunsang Gar activities in person and online.',
      'Clases semanales': 'Weekly classes',
      'Estudio y práctica continua': 'Ongoing study and practice',
      'Programas': 'Programs',
      'Recorridos de aprendizaje': 'Learning paths',
      'Presencial y en línea': 'In person and online',
      'Participación según cada actividad': 'Participation depends on each activity',
      'Camino de práctica': 'Practice path',
      'Certificado de Finalización de Naljor': 'Naljor Completion Certificate',
      'Un camino de práctica, sabiduría y reconocimiento espiritual.': 'A path of practice, wisdom and spiritual recognition.',
      'La certificación contempla una participación mínima del 75%.': 'Certification requires a minimum participation of 75%.',
      'Existen oraciones y recursos de práctica dentro del archivo de Kunsang Gar. Su disponibilidad y uso dependen de las indicaciones correspondientes.': 'Kunsang Gar preserves prayers and practice resources. Their availability and use depend on the corresponding guidance.',
      'Apoya la continuidad': 'Support continuity'
    },
    services: {
      'Acompañamiento espiritual': 'Spiritual guidance',
      'Servicios y práctica.': 'Services and practice.',
      'La tradición Bön conserva ceremonias, oraciones, meditación y orientación para acompañar momentos importantes de la vida.': 'The Bön tradition preserves ceremonies, prayers, meditation and guidance for important moments in life.',
      'Sesiones privadas': 'Private sessions',
      'La tradición Bön tiene una rica historia de tantra, chamanismo y meditación; la curación y la transformación profundas se pueden evocar a través de ceremonias espirituales, oraciones y meditación.': 'The Bön tradition has a rich history of tantra, shamanism and meditation; deep healing and transformation can be invited through spiritual ceremonies, prayers and meditation.',
      'Un lama calificado puede guiar y ayudar en nuestro progreso. Estos servicios se pueden realizar en persona durante las visitas de Geshe a cualquier país.': 'A qualified lama can guide and support our progress. These services can be offered in person during Geshe visits in any country.',
      'Orientación para distintas necesidades.': 'Guidance for different needs.',
      'Ceremonia y oraciones para los vivos': 'Ceremony and prayers for the living',
      'Bendiciones para el hogar y el negocio': 'Blessings for home and business',
      'Orientación a través de la muerte y la muerte / Phowa': 'Guidance through death and dying / Phowa',
      'Consulta espiritual': 'Spiritual consultation',
      'Ofrenda': 'Offering',
      'Dana': 'Dana',
      'Donativo sugerido:': 'Suggested offering:',
      'Es adecuado hacer una ofrenda al maestro en función de lo que puedas manejar. Estas ofrendas sugeridas tienen como objetivo brindar orientación.': 'It is appropriate to make an offering to the teacher according to your means. These suggested offerings support guidance.',
      'Dana desempeña un papel crucial en la vida espiritual de un practicante del Dharma.': 'Dana plays a crucial role in a Dharma practitioner’s spiritual life.'
    },
    contact: {
      'Conversemos sobre la práctica.': 'Let us talk about practice.',
      'Para información sobre clases, actividades, servicios, visitas de Geshe o donaciones, utiliza los canales oficiales.': 'For information about classes, activities, services, Geshe visits or donations, use the official channels.',
      'Información directa para la comunidad.': 'Direct information for the community.',
      'El correo y WhatsApp son los canales disponibles para solicitar información y dar seguimiento a una actividad.': 'Email and WhatsApp are the available channels for requesting information and following up on an activity.'
    },
    classes: {
      'Clases y actividades.': 'Classes and activities.',
      'Encuentra espacios de estudio, meditación y práctica de Kunsang Gar en modalidad presencial y en línea.': 'Find spaces for Kunsang Gar study, meditation and practice in person and online.',
      'Con Geshe Dangsong Namgyal. Clase online por Zoom en vivo.': 'With Geshe Dangsong Namgyal. Live online class via Zoom.',
      'Viernes: 19:30 a 21:30 Sábado: 10:00 a 13:00 y 15:00 a 18:00': 'Friday: 19:30–21:30 Saturday: 10:00–13:00 and 15:00–18:00',
      'Las enseñanzas Bön nos ayudan a desarrollar una mejor comprensión de nuestra verdadera naturaleza, estudiando las enseñanzas de la sabiduría antigua e integrándolas en nuestra práctica espiritual.': 'Bön teachings help us develop a deeper understanding of our true nature by studying ancient wisdom and integrating it into spiritual practice.',
      'Geshe ha destilado métodos de las tradiciones Bön y budistas en tres categorías: Sabiduría Fundamental , Desarrollo mental y Sabiduría por excelencia .': 'Geshe has distilled methods from Bön and Buddhist traditions into three categories: Fundamental Wisdom, Mental Development and Ultimate Wisdom.',
      'Fuente de enseñanza': 'Teaching source',
      'Las enseñanzas de Kunsang Gar se originan en los nueve vehículos del Bön Zhang Zhung, enseñados por su fundador Tonpa Shenrab Miwoche.': 'Kunsang Gar teachings originate in the nine vehicles of Zhang Zhung Bön, taught by its founder Tonpa Shenrab Miwoche.',
      'Las enseñanzas fundamentales del Bön abordan una comprensión cosmológica detallada, junto con prácticas curativas para crear bienestar y armonía en el mundo relativo.': 'The foundational Bön teachings offer a detailed cosmological understanding together with healing practices that create wellbeing and harmony in the relative world.',
      'Incluye la conexión entre elementos y espíritus; reconocimiento de deidades y demonios; karma y renacimiento; significado de la vida y el alma; liberación del samsara; devoción y motivación; y purificación mediante la práctica preliminar (ngondro).': 'This includes the connection between elements and spirits; recognition of deities and demons; karma and rebirth; the meaning of life and soul; freedom from samsara; devotion and motivation; and purification through preliminary practice (ngondro).',
      'También aborda compasión, karma, samsara y nirvana, nuestra naturaleza interdependiente, la naturaleza de los cuerpos mental y físico, el renacimiento, las verdades relativas y últimas, las causas del sufrimiento y cómo liberarse de él.': 'It also addresses compassion, karma, samsara and nirvana, our interdependent nature, the mental and physical bodies, rebirth, relative and ultimate truths, the causes of suffering and freedom from it.',
      'Desarrollo mental': 'Mental Development',
      'Incluye enseñanzas sobre la naturaleza no autoexistente de los fenómenos, la vacuidad, bodichita, bondad amorosa, compasión, atención plena, calma mental, visión interior, entrenamiento mental, psicología budista, las diez perfecciones, yogas del cuerpo, mente, deidad, sueño y muerte, mantras sagrados e intención y dedicación de ceremonias y rituales.': 'This includes teachings on the non-self-existing nature of phenomena, emptiness, bodhicitta, loving-kindness, compassion, mindfulness, mental calm, insight, mind training, Buddhist psychology, the ten perfections, body, mind, deity, dream and death yogas, sacred mantras, and the intention and dedication of ceremonies and rituals.',
      'La práctica principal es la Meditación de la Mente Natural o Dzogchen. Dirigimos la conciencia al interior para encontrar felicidad profunda, prepararnos para la muerte y transformar la ignorancia en el camino hacia la iluminación.': 'The main practice is Natural Mind Meditation, or Dzogchen. We turn awareness inward to find deep happiness, prepare for death and transform ignorance into the path to awakening.',
      'Las enseñanzas incluyen el ngondro especial del Dzogchen (Rushan), reconocimiento de la mente, mente natural, luminosidad, mantra, purificación y cantos espirituales.': 'The teachings include the special Dzogchen ngondro (Rushan), recognition of mind, natural mind, luminosity, mantra, purification and spiritual chants.',
      'Dzogchen / Mente Natural': 'Dzogchen / Natural Mind',
      'La práctica de Dzogchen Puro revela naturalmente las cualidades espontáneas de luminosidad y claridad. En el programa, Geshe entrelaza las enseñanzas fundamentales y de desarrollo mental para una comprensión más completa.': 'Pure Dzogchen practice naturally reveals the spontaneous qualities of luminosity and clarity. In the program, Geshe weaves foundational and mental-development teachings together for a fuller understanding.',
      'Descarga los brochures oficiales del Programa de Sabiduría. Estos documentos están autorizados para consulta pública.': 'Download the official Wisdom Program brochures. These documents are authorized for public reference.',
      'Brochure oficial en español: Meditación Dzogchen y Tradición Budista Tibetana Rimé.': 'Official Spanish brochure: Dzogchen Meditation and Tibetan Buddhist Rimé Tradition.',
      'Camino de práctica': 'Practice path',
      'Una participación gradual y cuidada.': 'A gradual and supported participation.',
      'La disponibilidad, modalidad y requisitos dependen de cada actividad.': 'Availability, format and requirements depend on each activity.'
    },
    'kunsang-gar': {
      'Sabiduría antigua para la sociedad moderna.': 'Ancient wisdom for modern society.',
      'Las mayores aspiraciones de Geshe Namgyal y los miembros de Kunsang Gar son promover la Sabiduría de Kunsang Gar y llevar las tradiciones antiguas a la sociedad moderna.': 'Geshe Namgyal and the members of Kunsang Gar aspire to promote Kunsang Gar Wisdom and bring ancient traditions into modern society.',
      'Nutrir mentes pacíficas y reconocer la naturaleza verdadera.': 'Nurturing peaceful minds and recognizing true nature.',
      'Las mayores aspiraciones de Geshe Namgyal y los miembros de Kunsang Gar son promover la Sabiduría de Kunsang Gar y llevar las tradiciones antiguas a la sociedad moderna para nutrir mentes más pacíficas, promover la curación física y ambiental y encontrar la máxima realización de la verdadera naturaleza.': 'Geshe Namgyal and the members of Kunsang Gar aspire to promote Kunsang Gar Wisdom and bring ancient traditions into modern society, nurturing peaceful minds, supporting physical and environmental healing, and realizing true nature.',
      'Nuestro principal estudio y práctica es Dzogchen o Meditación de la Mente Natural.': 'Our main study and practice is Dzogchen, or Natural Mind Meditation.',
      'Lo que ofrecemos': 'What we offer',
      'Estudio, desarrollo mental y práctica.': 'Study, mental development and practice.',
      'El programa Kunsang Gar proporciona una sólida comprensión fundamental y enseñanzas para el desarrollo mental.': 'The Kunsang Gar program provides a solid foundation and teachings for mental development.',
      'La enseñanza por excelencia de Geshe Dangsong Namgyal es la Meditación de la Mente Natural o Dzogchen.': 'The essential teaching of Geshe Dangsong Namgyal is Natural Mind Meditation, or Dzogchen.',
      'La tradición Yungdrung Bön tiene antiguos rituales espirituales, cultura, idioma y prácticas curativas para beneficiarnos a nosotros mismos, a las comunidades y al medio ambiente.': 'The Yungdrung Bön tradition has ancient spiritual rituals, culture, language and healing practices that benefit individuals, communities and the environment.',
      'El nombre': 'The name',
      'Kunsang significa siempre excelente, todo bueno, completo, perfecto y siempre positivo. Kunsang representa la bondad para todos, en todas partes, en todo momento y en todas las circunstancias. Gar significa sitio o lugar.': 'Kunsang means always excellent, completely good, whole, perfect and always positive. Kunsang represents goodness for everyone, everywhere, at all times and in every circumstance. Gar means camp or place.'
    },
    'geshe-dangsong': {
      'Maestro, erudito y autor': 'Teacher, scholar and author',
      'Una trayectoria de estudio, práctica y enseñanza de Dzogchen Puro, tradición Bön y visión Rimé.': 'A life of study, practice and teaching in Pure Dzogchen, the Bön tradition and the Rimé vision.',
      'El camino hacia el Dzogchen Puro': 'The path to Pure Dzogchen',
      'Monasterios, maestros y estudio': 'Monasteries, teachers and study',
      'Investigación, enseñanza y Kunsang Gar': 'Research, teaching and Kunsang Gar',
      'La naturaleza de la mente': 'The nature of mind',
      'Me gustaría compartir con ustedes mi historia sobre cómo entré en el camino del Dzogchen Puro.': 'I would like to share my story of how I entered the path of Pure Dzogchen.',
      'Formación': 'Training',
      'Trabajo internacional': 'International work',
      'Visión': 'Vision',
      'He escrito más de 20 libros en tibetano e inglés. Mi primer libro en inglés, Pure Dzogchen , ha sido traducido a varios idiomas.': 'I have written more than 20 books in Tibetan and English. My first English book, Pure Dzogchen, has been translated into several languages.',
      'No importa cuál sea el origen de uno: país, sexo, edad, raza, creencias o antecedentes de experiencias y emociones dolorosas, el camino del Dzogchen Puro puede llevarnos rápidamente al reconocimiento trascendente de la Naturaleza de la Mente.': 'Regardless of one’s country, gender, age, race, beliefs or history of painful experiences and emotions, the path of Pure Dzogchen can quickly lead to a transcendent recognition of the Nature of Mind.',
      'El fruto final de la práctica del Dzogchen Puro es el logro del Cuerpo de Luz del Arco Iris, una manifestación de realización profunda única en el camino del Dzogchen.': 'The ultimate fruit of Pure Dzogchen practice is the Rainbow Light Body, a manifestation of profound realization unique to the Dzogchen path.'
    },
    'tradicion-bon': {
      'Cultura espiritual': 'Spiritual culture',
      'Bön: cultura del antiguo Tíbet.': 'Bön: culture of ancient Tibet.',
      'Bön es la cultura espiritual indígena de Zhang Zhung, el área que rodea el monte Kailash en el Tíbet actual.': 'Bön is the indigenous spiritual culture of Zhang Zhung, the area surrounding Mount Kailash in present-day Tibet.',
      'Una cultura de tantra, chamanismo y meditación': 'A culture of tantra, shamanism and meditation',
      'Historia viva': 'A living history',
      'Prácticas': 'Practices',
      'Elementos, rituales y equilibrio': 'Elements, rituals and balance',
      'Ejemplo ritual': 'Ritual example',
      'Naga Sutra': 'Naga Sutra',
      'Mandala de arena': 'Sand mandala',
      'Recuperación de alma': 'Soul retrieval',
      'Ofrendas de agua y humo': 'Water and smoke offerings',
      'Purificación del agua': 'Water purification',
      'Rituales de rescate y restauración': 'Rescue and restoration rituals',
      'Equilibrar los elementos': 'Balancing the elements',
      'Eliminar los espíritus negativos': 'Removing negative spirits',
      'Retener y restaurar la fuerza vital': 'Retaining and restoring vital force',
      'Orientación a través de la muerte y el morir': 'Guidance through death and dying',
      'Una cultura de tantra, chamanismo y meditación': 'A culture of tantra, shamanism and meditation'
    },
    'nuevo-bon': {
      'Ensayo de Geshe Dangsong Namgyal': 'An essay by Geshe Dangsong Namgyal',
      'Nuevo Bön.': 'New Bön.',
      'Una tradición no sectaria, inseparable de Bön y del budismo indio.': 'A non-sectarian tradition, inseparable from Bön and Indian Buddhism.',
      '¿Qué es el Nuevo Bön?': 'What is New Bön?',
      'Maestros, traducciones y tesoros': 'Teachers, translations and treasures',
      'Las prácticas del Nuevo Bön incluyen Sutra, Tantra, Mahamudra, Madhyamaka, Dzogchen, Hinayana y Mahayana: prácticas inseparables del antiguo Bön y del budismo indio, como la leche en el agua.': 'New Bön practices include Sutra, Tantra, Mahamudra, Madhyamaka, Dzogchen, Hinayana and Mahayana: practices inseparable from ancient Bön and Indian Buddhism, like milk in water.',
      'Prácticas': 'Practices',
      '—Por Geshe Dangsong Namgyal': '—By Geshe Dangsong Namgyal'
    },
    rime: {
      'Visión no sectaria': 'Non-sectarian vision',
      'La sabiduría puede alcanzarse abriéndose a otras enseñanzas y reconociendo lo que las tradiciones comparten.': 'Wisdom can be reached by opening to other teachings and recognizing what traditions share.',
      'Bön, budismo indio y sabiduría universal': 'Bön, Indian Buddhism and universal wisdom',
      'Práctica sin prejuicios': 'Practice without prejudice',
      'Diálogo y reconocimiento entre tradiciones': 'Dialogue and recognition between traditions'
    },
    certification: {
      'Certificación Naljor.': 'Naljor Certification.',
      'Un camino de práctica, estudio constante y compromiso con la formación.': 'A path of practice, sustained study and commitment to training.',
      'Tres categorías de estudio': 'Three areas of study',
      'El Programa de Sabiduría de Kunsang Gar se divide en tres categorías: Sabiduría Fundamental, Desarrollo mental y Sabiduría por excelencia.': 'The Kunsang Gar Wisdom Program is divided into three areas: Fundamental Wisdom, Mental Development and Ultimate Wisdom.',
      'Duración y requisitos': 'Duration and requirements',
      'La formación contempla una participación sostenida en cursos principales y secundarios, clases semanales y práctica diaria de mañana y tarde.': 'The training includes sustained participation in main and secondary courses, weekly classes and daily morning and evening practice.',
      'La plataforma conserva la referencia de una participación mínima del 75% para optar por el certificado. No se presentan fechas antiguas como futuras.': 'A minimum participation of 75% is required to qualify for the certificate. Past dates are not presented as future dates.'
    },
    prayers: {
      'Oraciones y recursos.': 'Prayers and resources.',
      'Recursos de práctica de Kunsang Gar México.': 'Practice resources from Kunsang Gar Mexico.',
      'Acceso responsable': 'Responsible access',
      'El material se comparte según las indicaciones correspondientes.': 'Materials are shared according to the corresponding guidance.',
      'Los materiales de práctica apoyan la tradición Yungdrung Bön bajo la guía de Geshe. Algunos son públicos y otros requieren transmisión, iniciación o autorización previa.': 'Practice materials support the Yungdrung Bön tradition under Geshe’s guidance. Some are public, while others require transmission, initiation or prior authorization.',
      'Las traducciones y los textos conservan sus avisos de derechos de autor. Consulta los canales oficiales para recibir orientación sobre cada material.': 'Translations and texts retain their copyright notices. Consult the official channels for guidance about each material.',
      'Materiales de práctica compartidos según las indicaciones correspondientes.': 'Practice materials shared according to the corresponding guidance.',
      'Conoce el contexto y la tradición de las prácticas de Kunsang Gar.': 'Learn about the context and tradition of Kunsang Gar practices.',
      'Solicita indicaciones de acceso por los canales oficiales.': 'Request access guidance through the official channels.'
    },
    'events': {
      'Eventos y archivo.': 'Events and archive.',
      'Conservamos la memoria de las actividades realizadas y comunicamos las próximas visitas confirmadas.': 'We preserve the record of completed activities and share confirmed upcoming visits.',
      'Visita octubre–noviembre': 'October–November visit',
      'Geshe Dangsong Namgyal, Director Espiritual de Kunsang Gar Internacional.': 'Geshe Dangsong Namgyal, Spiritual Director of Kunsang Gar International.',
      'Ciclo de Enseñanzas · Octubre–Noviembre 2026': 'Teaching Series · October–November 2026',
      'PRÓXIMA VISITA': 'UPCOMING VISIT',
      'Visita de Geshe Dangsong Namgyal': 'Visit of Geshe Dangsong Namgyal',
      'PASADO': 'PAST',
      'Eventos pasados': 'Past events',
      'Recuperación del alma, Sadhana de longevidad y Tsok': 'Soul Retrieval, Longevity Sadhana and Tsok',
      'Esencia de la Conciencia: Vacío y luminosidad': 'Essence of Consciousness: Emptiness and luminosity',
      'Yoga del Tantra Madre y meditación Dzogchen': 'Mother Tantra Yoga and Dzogchen meditation',
      'Mil Ofrendas a Nampar Gyalwa': 'One Thousand Offerings to Nampar Gyalwa',
      'Gran Empoderamiento de Nampar Gyalwa': 'Great Empowerment of Nampar Gyalwa'
    },
    programs: {
      'Programas de estudio y práctica.': 'Study and practice programs.',
      'Conoce las rutas de aprendizaje y las actividades de Kunsang Gar.': 'Explore Kunsang Gar learning paths and activities.',
      'Enseñanzas y prácticas de estudio de Kunsang Gar.': 'Kunsang Gar study teachings and practices.',
      'Consulta la información pública en Clases.': 'See the public information in Classes.',
      'Eventos y enseñanzas': 'Events and teachings',
      'Consulta las actividades públicas, visitas y próximos encuentros de Kunsang Gar.': 'Explore Kunsang Gar public activities, visits and upcoming gatherings.',
      'Calendario público disponible.': 'Public calendar available.',
      'Contenido para estudiantes': 'Student content',
      'Las enseñanzas y recursos disponibles para estudiantes se consultan desde el área del practicante.': 'Available teachings and resources for students can be accessed from the practitioner area.'
    },
    sangha: {
      'Sangha.': 'Sangha.',
      'Un espacio para acompañar el estudio, la práctica y los encuentros de Kunsang Gar.': 'A space to support Kunsang Gar study, practice and gatherings.',
      'Comunidad de práctica': 'Practice community',
      'Estudio, práctica y encuentro.': 'Study, practice and gathering.',
      'La Sangha de Kunsang Gar reúne a personas interesadas en profundizar en el estudio, la meditación y la tradición Yungdrung Bön.': 'The Kunsang Gar Sangha brings together people interested in deepening their study, meditation and practice of the Yungdrung Bön tradition.',
      'Consulta las actividades públicas y los canales oficiales de Kunsang Gar para conocer los próximos encuentros.': 'Consult Kunsang Gar public activities and official channels for upcoming gatherings.'
    },
    donations: {
      'Donaciones.': 'Donations.',
      'Tu apoyo ayuda a sostener el estudio, la práctica, las actividades y la comunidad de Kunsang Gar México.': 'Your support sustains the study, practice, activities and community of Kunsang Gar Mexico.',
      'Apoyar también es participar.': 'Supporting is also participating.',
    'Es adecuado hacer una ofrenda al maestro en función de lo que puedas manejar. La generosidad es la primera de las diez paramitas, o cualidades del carácter, que se deben perfeccionar. El acto de dar abre el corazón, disminuye por un momento el egocentrismo y valora el bienestar de los demás.': 'It is appropriate to make an offering to the teacher according to your means. Generosity is the first of the ten paramitas, or qualities of character, to be perfected. Giving opens the heart, briefly loosens self-centredness and values the wellbeing of others.',
    'Me gustaría compartir con ustedes mi historia sobre cómo entré en el camino del Dzogchen Puro. Comencé mis estudios desde muy joven con mi padre, maestro ritual del Karshod en la región Kham del Tíbet; está en la zona de la colina, muy verde con flores naturales en verano, pero con nieve y frío en invierno.': 'I would like to share my story of how I entered the path of Pure Dzogchen. I began studying very young with my father, a ritual master of Karshod in the Kham region of Tibet. The area is green and full of natural flowers in summer, but snowy and cold in winter.',
    'Los aldeanos le pedían a mi padre que realizara rituales y oraciones tradicionales Bön para muchas de las ocasiones de la vida: nacimiento, enfermedad, prosperidad, buenas cosechas, animales y propiedades, salud, matrimonio, estabilidad emocional o morir en paz y brindar orientación para la próxima vida. Lo acompañaba todos los días. Además, mi padre y yo hacíamos retiros de prácticas tántricas, a veces con mucha gente. También hubo eventos regionales y días festivos para ceremonias. Le solicitaban ceremonias para reequilibrar y crear armonía, paz con los elementos naturales y los espíritus.': 'Villagers asked my father to perform traditional Bön rituals and prayers for many occasions in life: birth, illness, prosperity, good harvests, animals and property, health, marriage, emotional stability, peaceful dying and guidance for the next life. I accompanied him every day. My father and I also held tantric practice retreats, sometimes with many people. There were regional events and holidays for ceremonies. People requested ceremonies to restore balance and create harmony and peace with natural elements and spirits.',
    'Cuando las personas se enfermaban, primero buscaban un maestro ritual, ya que el 99% de los problemas de salud se consideraban causados por daños al espíritu o a la pérdida del poder del alma.': 'When people became ill, they first sought a ritual master, since 99% of health problems were considered to be caused by harm to the spirit or loss of the soul’s power.',
    'Recibí la práctica preliminar de Dzogchen, con novecientas mil rondas de práctica de Ngondro, de Togden Sherab Phuntsog Rinpoche mientras aún residía en la casa de mi infancia. Un día, salí de mi casa y fui al monasterio. Me convertí en monje residente en el monasterio de Lung Kar. Estudié entrenamiento mental donde uno busca la paz interior; está más allá del materialismo, más allá de solo sobrevivir.': 'I received the preliminary Dzogchen practice, including nine hundred thousand rounds of ngondro, from Togden Sherab Phuntsog Rinpoche while I still lived in my childhood home. One day I left home and went to the monastery. I became a resident monk at Lung Kar Monastery. I studied mind training, in which one seeks inner peace beyond materialism and mere survival.',
    'Completé un retiro de ngondro de tres años para Kalung Gyatso con el texto Tesoro del océano de Shardza Rinpoche, Ati ngondro aprendido de Lobpon Tsultrim Namdag. El maestro Khanpo Nyima Lodo brindó enseñanzas esenciales de Dzogchen, que incluyen Phowa, Rushen y meditación.': 'I completed a three-year ngondro retreat for Kalung Gyatso using Shardza Rinpoche’s Ocean of Treasure text, and learned Ati ngondro from Lobpon Tsultrim Namdag. Master Khanpo Nyima Lodo gave essential Dzogchen teachings, including Phowa, Rushen and meditation.',
    'Para adquirir una formación más amplia, dejé el Tíbet y caminé hasta la India. Estuve cinco años en el Monasterio de Menri, la sede de la tradición Bön, bajo la tutela de Su Santidad Menri Tridzin Rinpoche. Estudié la cultura Bön, su filosofía y la meditación, y recibí múltiples iniciaciones espirituales.': 'To receive broader training, I left Tibet and walked to India. I spent five years at Menri Monastery, the seat of the Bön tradition, under His Holiness Menri Tridzin Rinpoche. I studied Bön culture, philosophy and meditation, and received many spiritual initiations.',
    'En 1995, partí hacia la Universidad Monástica Sera Je del linaje Gelugpa y estudié con SE Kyabje Choden Rinpoche, el anterior abad SE Losang Tsering Rinpoche y el anterior abad SE Khanzur Losang Delek. También tuve la suerte de asistir a numerosas enseñanzas con SS el Dalai Lama. Estudié Madhyamaka, lógica budista, psicología budista, Prajnaparamita, ciencia budista, métodos académicos occidentales y la relación entre ciencia y religión.': 'In 1995 I went to Sera Je Monastic University of the Gelugpa lineage and studied with His Eminence Kyabje Choden Rinpoche, former abbot His Eminence Losang Tsering Rinpoche and former abbot His Eminence Khanzur Losang Delek. I was also fortunate to attend many teachings with His Holiness the Dalai Lama. I studied Madhyamaka, Buddhist logic and psychology, Prajnaparamita, Buddhist science, Western academic methods and the relationship between science and religion.',
    'Regresé a mi linaje natal a través del Monasterio Triten Norbutse en Katmandú, Nepal. Los temas de estudio incluyeron las nueve formas de Bön: cosmología, filosofías de sutra, vinaya, tantra y Bön Dzogchen, guiados por SE Yongdzin Lopon Rinpoche. En 2011 obtuve el título de Geshe, Doctor en Filosofía, tras estudiar y formarme en Bön y budismo indio.': 'I returned to my native lineage through Triten Norbutse Monastery in Kathmandu, Nepal. My studies included the nine forms of Bön: cosmology, sutra philosophies, vinaya, tantra and Bön Dzogchen, guided by His Eminence Yongdzin Lopon Rinpoche. In 2011 I received the Geshe degree, Doctor of Philosophy, after studying and training in Bön and Indian Buddhism.',
    'Simultáneamente, investigué muchas partes de la historia, la cultura y la religión del Bön antiguo y fui invitado a conferencias en la Universidad de Oxford, Inglaterra (11th IATS), Francia, Japón, India y los Estados Unidos.': 'At the same time, I researched many parts of the history, culture and religion of ancient Bön and was invited to conferences at the University of Oxford, England (11th IATS), France, Japan, India and the United States.',
    'En 2013 fui invitado a ser maestro residente en el Centro Ananda Dharma en San José, California, por el gran maestro HE Choden Rinpoche. Enseñé Lamrim, psicología budista y Prajnaparamita, filosofía budista y otros temas.': 'In 2013 I was invited by the great master His Eminence Choden Rinpoche to become resident teacher at Ananda Dharma Center in San José, California. I taught Lamrim, Buddhist psychology and Prajnaparamita, Buddhist philosophy and other subjects.',
    'Finalmente, me di cuenta de que estaba más interesado en el Dzogchen Puro. En 2015 llegué a la conclusión de que las enseñanzas de Dzogchen, libres de sutras o tantras, servirían mejor a los estudiantes occidentales. Así que fundé Kunsang Gar y ahora enseño Pure Dzogchen y el Programa de Sabiduría de Kunsang Gar.': 'Eventually I realized that I was more interested in Pure Dzogchen. In 2015 I concluded that Dzogchen teachings, free from sutras or tantras, would best serve Western students. I founded Kunsang Gar and now teach Pure Dzogchen and the Kunsang Gar Wisdom Program.',
    'He escrito más de 20 libros en tibetano e inglés. Mi primer libro en inglés, Pure Dzogchen , ha sido traducido a varios idiomas. Desde Kunsang Gar he expandido las enseñanzas a los Estados Unidos, Europa, Latinoamérica y Asia.': 'I have written more than 20 books in Tibetan and English. My first English book, Pure Dzogchen, has been translated into several languages. From Kunsang Gar I have expanded the teachings to the United States, Europe, Latin America and Asia.',
    'No importa cuál sea el origen de uno: país, sexo, edad, raza, creencias o antecedentes de experiencias y emociones dolorosas, el camino del Dzogchen Puro puede llevarnos rápidamente al reconocimiento trascendente de la Naturaleza de la Mente. La meditación sobre la naturaleza de la mente es una forma poderosa de purificar la mente de patrones kármicos negativos.': 'Regardless of one’s country, gender, age, race, beliefs or history of painful experiences and emotions, the path of Pure Dzogchen can quickly lead to a transcendent recognition of the Nature of Mind. Meditation on the nature of mind is a powerful way to purify the mind of negative karmic patterns.',
    'Creo que al introducir directamente la Naturaleza Búdica primordial a través de las enseñanzas del Dzogchen Puro, quienes reciben estas enseñanzas pueden entrar en ese reconocimiento y descubrir la verdadera paz, fuerza y valentía en la vida; y confianza en una eventual experiencia positiva de muerte, Bardo y renacimiento.': 'I believe that by directly introducing primordial Buddha Nature through Pure Dzogchen teachings, those who receive them can enter that recognition and discover true peace, strength and courage in life, together with confidence in a positive experience of death, Bardo and rebirth.',
    'Entre los más difundidos están los Cuatro Vehículos Causales: Signos , como adivinación, astrología, medicina y ritos de limpieza y nutrición; Apariciones , varios tipos de ritos protectores; Poder Mágico , ritos coléricos; y Ritos Funerarios .': 'Among the most widespread are the Four Causal Vehicles: Signs, such as divination, astrology, medicine and cleansing and nourishment rites; Apparitions, various protective rites; Magical Power, wrathful rites; and Funeral Rites.',
    'Kunsang Gar presentó un raro y especial ritual de mandala de arena de Naga en septiembre de 2019. Este extenso ritual de mandala de cinco reyes de Naga fue impartido por Buda Tonpa Shenrab hace aproximadamente 4000 años en la antigua región de Bön. La ceremonia de curación elimina obstáculos a la paz, la armonía, la salud y la felicidad.': 'Kunsang Gar presented a rare and special Naga sand mandala ritual in September 2019. This extensive five-Naga-kings mandala ritual was taught by Buddha Tonpa Shenrab approximately 4,000 years ago in the ancient Bön region. The healing ceremony removes obstacles to peace, harmony, health and happiness.',
    'Los mandalas de arena transmiten energías positivas al entorno y a las personas que los contemplan. Mientras se construye un mandala, se canta y se medita. El poder curativo se extiende incluso antes de que sea barrido y dispersado en el agua que fluye. El Mandala de Arena Naga y las Ofrendas se hacen para purificar y reconocer acciones destructivas, sanar la relación con los nagas y la tierra, y restaurar la armonía.': 'Sand mandalas transmit positive energy to the environment and to those who behold them. As a mandala is built, practitioners chant and meditate. Its healing power extends even before it is swept away and dispersed in flowing water. The Naga Sand Mandala and Offerings purify and acknowledge destructive actions, heal the relationship with nagas and earth, and restore harmony.',
    'Los textos antiguos hablan de una categoría triple: mente o conciencia, sem en tibetano; pensamiento o intelecto, yi ; y alma, la . La analogía dada es que la mente es como el fuego, el intelecto como la luz del fuego y el alma como el humo.': 'Ancient texts describe a threefold category: mind or consciousness, sem in Tibetan; thought or intellect, yi; and soul, la. The analogy is that mind is like fire, intellect like the light of fire and soul like smoke.',
    'El alma puede separarse fácilmente del cuerpo. Cuando una persona experimenta un accidente grave o un trauma emocional como miedo intenso o pérdida, parte de su alma puede separarse o perderse, o tal vez ser arrebatada por espíritus negativos. Entonces se pide al maestro ritual que lleve a cabo el ritual para recuperar el alma perdida, dar ofrendas como rescate a los espíritus y atraer elementos auspiciosos para la longevidad y la prosperidad.': 'The soul can easily separate from the body. When someone experiences a serious accident or emotional trauma such as intense fear or loss, part of the soul may separate or be lost, or perhaps be taken by negative spirits. The ritual master is then asked to recover the lost soul, make offerings as a ransom to the spirits and attract auspicious elements for longevity and prosperity.',
    'Hace mucho tiempo que investigué y estudié las enseñanzas de Kundrol Jatson Nyingpo y Terton Dechen Lingpa. Me interesaba mucho la tradición del Nuevo Bön. Ahora estoy haciendo un esfuerzo por difundir estas enseñanzas en todo el mundo para beneficiar a muchas personas en estos tiempos modernos.': 'For a long time I have researched and studied the teachings of Kundrol Jatson Nyingpo and Terton Dechen Lingpa. I was deeply interested in the New Bön tradition. I am now making an effort to spread these teachings throughout the world to benefit many people in modern times.',
    'La palabra “nuevo Bön” es un nombre como “nuevo Kadampa” o “nuevo tantra”. Básicamente, es similar al Yungdrung Bön, pero tiene algunas ideas, sadhanas y rituales diferentes. Una fuente especifica que sus orígenes se remontan al siglo VIII, mientras que otra afirma que podrían remontarse a una época anterior. Buda Tonpa Shenrab dijo que todas las enseñanzas del Buda Shakyamuni deben ser parte del Yungdrung Bön.': 'The term “New Bön” is a name like “New Kadampa” or “New Tantra”. It is broadly similar to Yungdrung Bön, but has some different ideas, sadhanas and rituals. One source places its origins in the eighth century, while another says they may reach further back. Buddha Tonpa Shenrab said that all of Buddha Shakyamuni’s teachings should be part of Yungdrung Bön.',
    'El Nuevo Bön es una tradición que tiene ideas no sectarias (Rimé), significados inseparables entre Bön y Cho (budismo indio) y una mente espaciosa y más amplia. Las enseñanzas provienen de Buda Tonpa Shenrab e incluyen Sutrayana, Tantrayana y Dzogchen. El practicante sigue el tipo de tantra de Dranpa Yabse Sum, que proviene de Gyerpung Drenpa Namkha, Tsewang Rigzin y Guru Rinpoche.': 'New Bön is a tradition with non-sectarian ideas (Rimé), inseparable meaning between Bön and Cho (Indian Buddhism), and a spacious, open mind. The teachings come from Buddha Tonpa Shenrab and include Sutrayana, Tantrayana and Dzogchen. The practitioner follows the Dranpa Yabse Sum form of tantra, which comes from Gyerpung Drenpa Namkha, Tsewang Rigzin and Guru Rinpoche.',
    'Cuando los eruditos y adeptos compararon las numerosas enseñanzas de Drenpa Namkha y Vairotsana con las del antiguo Bön y el budismo indio, descubrieron un significado inseparable y enseñanzas unificadas.': 'When scholars and adepts compared the many teachings of Drenpa Namkha and Vairotsana with ancient Bön and Indian Buddhism, they discovered inseparable meaning and unified teachings.',
    'Drenpa Namkha fue un maestro Bön que más tarde se convirtió en monje bajo el budismo indio y trajo 25 discípulos a la tradición Nyingma. Vairotsana aprendió las enseñanzas Bön cuando era niño de muchos maestros Bön y se convirtió en un erudito de renombre. Más tarde fue uno de los siete monjes ordenados por Shantarakshita y sus traducciones incluyeron textos Bön.': 'Drenpa Namkha was a Bön master who later became a monk in Indian Buddhism and brought 25 disciples into the Nyingma tradition. Vairotsana learned Bön teachings as a child from many Bön masters and became a renowned scholar. He was later one of the seven monks ordained by Shantarakshita, and his translations included Bön texts.',
    'Guru Rinpoche, Padmasambhava, se convirtió en el maestro supremo para todos porque estaba más allá de la parcialidad de linaje o tradición. Shardza Rinpoche siguió a 40 maestros, incluidos 34 maestros del Nuevo Bön, y difundió gran parte del Nuevo Bön a sus estudiantes.': 'Guru Rinpoche, Padmasambhava, became the supreme teacher for all because he was beyond partiality toward lineage or tradition. Shardza Rinpoche followed 40 teachers, including 34 New Bön masters, and spread much of New Bön to his students.',
    'Las prácticas del Nuevo Bön incluyen Sutra, Tantra, Mahamudra, Madhyamaka, Dzogchen, Hinayana y Mahayana: prácticas inseparables del antiguo Bön y del budismo indio, como la leche en el agua. En los programas de Kunsang Gar hay enseñanzas de Drenpa Namkha y Tsewang Rigzin, y se continuarán desarrollando programas relacionados con la Nueva Tradición Bön.': 'New Bön practices include Sutra, Tantra, Mahamudra, Madhyamaka, Dzogchen, Hinayana and Mahayana: practices inseparable from ancient Bön and Indian Buddhism, like milk in water. Kunsang Gar programs include teachings of Drenpa Namkha and Tsewang Rigzin, and programs related to the New Bön Tradition will continue to develop.',
    'El budismo tibetano, el sistema del Señor Buda Shakyamuni, contiene las enseñanzas de Hinayana, Mahayana y Tantrayana, explicadas también a través de la lógica y la filosofía. Los principales rituales y métodos de curación practicados por la mayoría de los tibetanos son de la tradición Bön; la tradición de Nalanda trajo muchos de los sutras, sistemas filosóficos y lógicos al budismo tibetano.': 'Tibetan Buddhism, the system of Lord Buddha Shakyamuni, contains Hinayana, Mahayana and Tantrayana teachings, also explained through logic and philosophy. Many principal rituals and healing methods practised by Tibetans come from Bön; the Nalanda tradition brought many sutras and philosophical and logical systems into Tibetan Buddhism.',
    'Muchos reveladores de tesoros de distintos períodos descubrieron tanto Dharma como Bön termas, enseñanzas de tesoros escondidos. El movimiento fue revivido por Jamyang Khyentse Rinpoche, Jamgon Kongtrul Rinpoche, Terton Dechen Lingpa y otros practicantes.': 'Many treasure revealers from different periods discovered both Dharma and Bön terma, teachings of hidden treasures. The movement was revived by Jamyang Khyentse Rinpoche, Jamgon Kongtrul Rinpoche, Terton Dechen Lingpa and other practitioners.',
    'Comprensión del mundo, de los seres humanos y de la existencia; las cuatro nobles verdades, prácticas preliminares externas e internas, entrenamiento mental, los doce eslabones del origen interdependiente y la naturaleza del samsara y el nirvana.': 'Understanding the world, human beings and existence; the four noble truths, outer and inner preliminary practices, mind training, the twelve links of dependent origination, and the nature of samsara and nirvana.',
    'Compasión, intención de liberar a todos los seres del sufrimiento, vacuidad, Prajnaparamita, Gran Madre de la Esfera, Madhyamaka, Mahamudra, visión tántrica, samadhis y los Seis Yogas del Tantra.': 'Compassion, the intention to free all beings from suffering, emptiness, Prajnaparamita, Great Mother of the Sphere, Madhyamaka, Mahamudra, tantric view, samadhis and the Six Yogas of Tantra.',
    'Meditación de la Mente Natural y Dzogchen Puro: identificación de la mente y su verdadera naturaleza, y desarrollo de la sabiduría innata a través de las etapas Thun-gom, Ngang-gom y Long-gom.': 'Natural Mind Meditation and Pure Dzogchen: recognizing mind and its true nature, and developing innate wisdom through the Thun-gom, Ngang-gom and Long-gom stages.',
    'La formación contempla una participación sostenida en cursos principales y secundarios, clases semanales y práctica diaria de mañana y tarde. La información operativa, calendario y requisitos de la cohorte vigente deben confirmarse con Kunsang Gar México.': 'The training includes sustained participation in main and secondary courses, weekly classes and daily morning and evening practice. Current operational information, calendar and cohort requirements must be confirmed with Kunsang Gar Mexico.',
    'La plataforma conserva la referencia de una participación mínima del 75% para optar por el certificado. No se presentan fechas antiguas como futuras.': 'A minimum participation of 75% is required to qualify for the certificate. Past dates are not presented as future dates.',
    'Programa sobre canales, vientos, esencias, yantra yoga, mantras y práctica no dual.': 'A program on channels, winds, essences, yantra yoga, mantras and non-dual practice.',
    'Ceremonia de Nampar Gyalwa y protectores mundanos.': 'Nampar Gyalwa and worldly protectors ceremony.',
    'Ciudad de México y online': 'Mexico City and online',
    'Inglés con traducción al español.': 'English with Spanish translation.',
    'English con traducción al español.': 'English with Spanish translation.',
      'El flujo de esta página es un donativo único en pesos mexicanos. No se presenta como suscripción ni como recurrencia.': 'This page supports a one-time donation in Mexican pesos. It is not a subscription or recurring payment.',
      'Información importante': 'Important information',
      'El pago se procesa en Mercado Pago y en MXN. La disponibilidad de la operación depende de la configuración del backend y las credenciales verificadas; no se exponen secretos en este sitio.': 'Payment is processed by Mercado Pago in MXN. Availability depends on verified payment configuration; no secrets are exposed on this site.'
    },
    account: {
      'Área del practicante': 'Practitioner area',
      'Continúa tu camino.': 'Continue your path.',
      'Accede a tus programas, recursos, enseñanzas y actualizaciones de la comunidad.': 'Access your programs, resources, teachings and community updates.',
      'Un espacio para estudiantes.': 'A space for students.',
      'Sesión activa': 'Active session',
      'Bienvenido, practicante .': 'Welcome, practitioner.'
    },
    teachings: {
      'Estudio, contemplación y práctica.': 'Study, contemplation and practice.',
      'Un espacio editorial para acercarse a las enseñanzas de Kunsang Gar y a la tradición Bön.': 'An editorial space for approaching Kunsang Gar teachings and the Bön tradition.',
      'Contexto, historia y prácticas contemplativas presentadas de forma gradual.': 'Context, history and contemplative practices presented gradually.',
      'La enseñanza y la guía del maestro dentro de la comunidad.': 'The teacher’s guidance and teachings within the community.',
      'Materiales de estudio sujetos a sus indicaciones de acceso.': 'Study materials shared according to their access guidance.',
      'Profundizar': 'Go deeper',
      'La práctica se sostiene con estudio y acompañamiento.': 'Practice is sustained by study and guidance.',
      'La disponibilidad, modalidad y requisitos dependen de cada actividad. Consulta la información vigente antes de inscribirte.': 'Availability, format and requirements depend on each activity. Check current information before registering.',
      'Conocer al maestro': 'Meet the teacher'
    },
    library: {
      'Recursos para el estudio y la práctica.': 'Resources for study and practice.',
      'Un catálogo organizado de enseñanzas, textos y materiales autorizados.': 'An organized catalogue of teachings, texts and authorized materials.',
      'Brochure autorizado para conocer el programa de enseñanza de Kunsang Gar.': 'Authorized brochure introducing the Kunsang Gar teaching program.',
      'Authorized brochure with information about the Wisdom Program.': 'Authorized brochure with information about the Wisdom Program.',
      'Enseñanzas y recursos autorizados': 'Authorized teachings and resources',
      'Los materiales restringidos no se publican en esta página. Requieren una cuenta, autorización y la conexión segura de la plataforma.': 'Restricted materials are not published on this page. They require an account, authorization and the platform’s secure connection.'
    }
  };

  const titles = {
    home: ['Kunsang Gar Mexico | Wisdom, practice and community', 'Kunsang Gar Mexico: wisdom, Bön tradition, Dzogchen, classes, services and community.'],
    services: ['Services | Kunsang Gar Mexico', 'Spiritual guidance, ceremonies, prayers and practice with Kunsang Gar Mexico.'],
    contact: ['Contact | Kunsang Gar Mexico', 'Contact Kunsang Gar Mexico about classes, activities, services and donations.'],
    classes: ['Classes | Kunsang Gar Mexico', 'Study, meditation and practice with the Kunsang Gar Wisdom Program.'],
    'kunsang-gar': ['Kunsang Gar | Kunsang Gar Mexico', 'The vision, meaning and practice of Kunsang Gar.'],
    'geshe-dangsong': ['Geshe Dangsong | Kunsang Gar Mexico', 'The life, study and teachings of Geshe Dangsong Namgyal.'],
    'tradicion-bon': ['Bön Tradition | Kunsang Gar Mexico', 'The spiritual culture, history and practices of Bön.'],
    'nuevo-bon': ['New Bön | Kunsang Gar Mexico', 'New Bön, a non-sectarian tradition inseparable from Bön and Indian Buddhism.'],
    rime: ['Rimé | Kunsang Gar Mexico', 'A broad, non-sectarian vision of wisdom and practice.'],
    certification: ['Certification | Kunsang Gar Mexico', 'Naljor Certification and the Kunsang Gar Wisdom Program.'],
    prayers: ['Prayers | Kunsang Gar Mexico', 'Practice resources shared according to the appropriate guidance.'],
    events: ['Mexico 2026 | Kunsang Gar Mexico', 'Public activities, upcoming visits and historical events.'],
    programs: ['Programs | Kunsang Gar Mexico', 'Kunsang Gar study and practice programs.'],
    sangha: ['Sangha | Kunsang Gar Mexico', 'Study, practice and community with Kunsang Gar.'],
    donations: ['Donations | Kunsang Gar Mexico', 'Support Kunsang Gar Mexico through a one-time donation in MXN.'],
    account: ['Practitioner area | Kunsang Gar Mexico', 'Access programs, resources and authorized teachings.'],
    teachings: ['Teachings | Kunsang Gar Mexico', 'Study, contemplation and practice with Kunsang Gar.'],
    library: ['Library | Kunsang Gar Mexico', 'Authorized resources for study and practice.']
    , 'payment-success': ['Payment received | Kunsang Gar Mexico', 'Payment return status for Kunsang Gar Mexico.']
    , 'payment-pending': ['Payment pending | Kunsang Gar Mexico', 'Pending payment status for Kunsang Gar Mexico.']
    , 'payment-failure': ['Payment not completed | Kunsang Gar Mexico', 'Payment result for Kunsang Gar Mexico.']
  };

  // Longer doctrinal paragraphs are kept as explicit, conservative translations.
  // They are intentionally local so no external translation service is used.
  const longTranslations = {
    'La tradición Bön conserva ceremonias, oraciones, meditación y orientación para acompañar momentos importantes de la vida.': 'The Bön tradition preserves ceremonies, prayers, meditation and guidance for important moments in life.',
    'Existen cientos de rituales antiguos para abordar problemas de la vida diaria, incluidos métodos pacíficos e iracundos para crear mayor armonía y paz en todos los entornos. Muchos de estos rituales siguen siendo de gran beneficio. Cuando vivimos en equilibrio con los elementos, con la tierra y los espíritus, y mantenemos una profunda reverencia y unidad con la naturaleza, es más probable que la armonía y la abundancia perduren.': 'Hundreds of ancient rituals address daily difficulties, including peaceful and wrathful methods for creating greater harmony and peace in every environment. Many of these rituals remain deeply beneficial. When we live in balance with the elements, the earth and the spirits, maintaining deep reverence and unity with nature, harmony and abundance are more likely to endure.',
    'Geshe Namgyal realiza ofrendas y mantras de purificación y rituales para equilibrar y sanar al individuo en momentos de angustia o enfermedad.': 'Geshe Namgyal performs offerings, purification mantras and rituals to balance and heal an individual during distress or illness.',
    'Geshe Namgyal realiza ceremonias de oración y ofrendas para limpiar la negatividad y traer bendiciones a un nuevo hogar o negocio.': 'Geshe Namgyal performs prayer ceremonies and offerings to clear negativity and bring blessings to a new home or business.',
    'Phowa es la práctica de transferencia de conciencia cuando una persona se acerca a la muerte o ha fallecido. Geshe Namgyal ofrece una ceremonia de oración especial para ayudar a los seres queridos en la transición.': 'Phowa is the practice of transferring consciousness when a person is approaching death or has died. Geshe Namgyal offers a special prayer ceremony to support loved ones through the transition.',
    'La relación maestro-alumno representa la confianza en el Buda, el Dharma y la Sangha para recibir orientación en el camino hacia la iluminación. Confiar en la guía de las enseñanzas y el apoyo del maestro puede ayudar a potenciar la meditación y las prácticas espirituales.': 'The teacher-student relationship expresses trust in the Buddha, Dharma and Sangha while receiving guidance on the path to awakening. Trusting the teachings and the teacher’s support can strengthen meditation and spiritual practice.',
    'Es adecuado hacer una ofrenda al maestro en función de lo que puedas manejar. Estas ofrendas sugeridas tienen como objetivo brindar orientación.': 'It is appropriate to make an offering to the teacher according to your means. These suggested offerings support guidance.',
    'Dana desempeña un papel crucial en la vida espiritual de un practicante del Dharma. La generosidad es la primera de las diez paramitas, o cualidades del carácter, que se deben perfeccionar. El acto de dar abre el corazón, disminuye por un momento el egocentrismo y valora el bienestar de los demás, y es una forma sincera de práctica.': 'Dana plays a crucial role in a Dharma practitioner’s spiritual life. Generosity is the first of the ten paramitas, or qualities of character, to be perfected. Giving opens the heart, briefly loosens self-centredness, values the wellbeing of others and is a sincere form of practice.',
    'Las enseñanzas Bön nos ayudan a desarrollar una mejor comprensión de nuestra verdadera naturaleza, estudiando las enseñanzas de la sabiduría antigua e integrándolas en nuestra práctica espiritual. Nuestras dificultades mentales y sentimientos dolorosos surgen, pero son temporales y dependen de causas y condiciones que no existen en nuestra naturaleza primigenia.': 'Bön teachings help us develop a deeper understanding of our true nature by studying ancient wisdom and integrating it into spiritual practice. Mental difficulties and painful feelings arise, but they are temporary and depend on causes and conditions that do not exist in our primordial nature.',
    'Geshe ha destilado métodos de las tradiciones Bön y budistas en tres categorías: Sabiduría Fundamental , Desarrollo mental y Sabiduría por excelencia .': 'Geshe has distilled methods from Bön and Buddhist traditions into three categories: Fundamental Wisdom, Mental Development and Ultimate Wisdom.',
    'Las enseñanzas de Kunsang Gar se originan en los nueve vehículos del Bön Zhang Zhung, enseñados por su fundador Tonpa Shenrab Miwoche. Las enseñanzas fundamentales adicionales provienen de Buda Shakyamuni y de la tradición escrita de comentarios de los maestros del Monasterio Nalanda que se extendió a lo largo del Tíbet.': 'Kunsang Gar teachings originate in the nine vehicles of Zhang Zhung Bön, taught by its founder Tonpa Shenrab Miwoche. Additional foundational teachings come from Buddha Shakyamuni and the written commentary tradition of Nalanda masters that spread throughout Tibet.',
    'Incluye la conexión entre elementos y espíritus; reconocimiento de deidades y demonios; karma y renacimiento; significado de la vida y el alma; liberación del samsara; devoción y motivación; y purificación mediante la práctica preliminar (ngondro).': 'This includes the connection between elements and spirits; recognition of deities and demons; karma and rebirth; the meaning of life and soul; freedom from samsara; devotion and motivation; and purification through preliminary practice (ngondro).',
    'También aborda compasión, karma, samsara y nirvana, nuestra naturaleza interdependiente, la naturaleza de los cuerpos mental y físico, el renacimiento, las verdades relativas y últimas, las causas del sufrimiento y cómo liberarse de él.': 'It also addresses compassion, karma, samsara and nirvana, our interdependent nature, the mental and physical bodies, rebirth, relative and ultimate truths, the causes of suffering and freedom from it.',
    'Incluye enseñanzas sobre la naturaleza no autoexistente de los fenómenos, la vacuidad, bodichita, bondad amorosa, compasión, atención plena, calma mental, visión interior, entrenamiento mental, psicología budista, las diez perfecciones, yogas del cuerpo, mente, deidad, sueño y muerte, mantras sagrados e intención y dedicación de ceremonias y rituales.': 'This includes teachings on the non-self-existing nature of phenomena, emptiness, bodhicitta, loving-kindness, compassion, mindfulness, mental calm, insight, mind training, Buddhist psychology, the ten perfections, body, mind, deity, dream and death yogas, sacred mantras, and the intention and dedication of ceremonies and rituals.',
    'La práctica principal es la Meditación de la Mente Natural o Dzogchen. Dirigimos la conciencia al interior para encontrar felicidad profunda, prepararnos para la muerte y transformar la ignorancia en el camino hacia la iluminación.': 'The main practice is Natural Mind Meditation, or Dzogchen. We turn awareness inward to find deep happiness, prepare for death and transform ignorance into the path to awakening.',
    'Las enseñanzas incluyen el ngondro especial del Dzogchen (Rushan), reconocimiento de la mente, mente natural, luminosidad, mantra, purificación y cantos espirituales.': 'The teachings include the special Dzogchen ngondro (Rushan), recognition of mind, natural mind, luminosity, mantra, purification and spiritual chants.',
    'La práctica de Dzogchen Puro revela naturalmente las cualidades espontáneas de luminosidad y claridad. En el programa, Geshe entrelaza las enseñanzas fundamentales y de desarrollo mental para una comprensión más completa.': 'Pure Dzogchen practice naturally reveals the spontaneous qualities of luminosity and clarity. In the program, Geshe weaves foundational and mental-development teachings together for a fuller understanding.',
    'La disponibilidad, modalidad y requisitos dependen de cada actividad. Consulta la información vigente antes de inscribirte.': 'Availability, format and requirements depend on each activity. Check current information before registering.',
    'El programa Kunsang Gar proporciona una sólida comprensión fundamental y enseñanzas para el desarrollo mental. El objetivo es ayudar a las personas a encontrar una mayor salud mental, equilibrio emocional y estabilidad aplicable a la vida cotidiana.': 'The Kunsang Gar program provides a solid foundation and teachings for mental development. Its aim is to help people find greater mental health, emotional balance and stability applicable to daily life.',
    'La enseñanza por excelencia de Geshe Dangsong Namgyal es la Meditación de la Mente Natural o Dzogchen. La pureza de la Mente Natural y todas sus cualidades ya es inherente a nosotros, pero normalmente no somos conscientes de ello. Esta práctica, tal como la presenta Geshe Namgyal, puede conducir a una realización profunda.': 'The essential teaching of Geshe Dangsong Namgyal is Natural Mind Meditation, or Dzogchen. The purity of Natural Mind and all its qualities are already inherent in us, but we are usually unaware of them. As presented by Geshe Namgyal, this practice can lead to profound realization.',
    'La tradición Yungdrung Bön tiene antiguos rituales espirituales, cultura, idioma y prácticas curativas para beneficiarnos a nosotros mismos, a las comunidades y al medio ambiente.': 'The Yungdrung Bön tradition has ancient spiritual rituals, culture, language and healing practices that benefit individuals, communities and the environment.',
    'Kunsang significa siempre excelente, todo bueno, completo, perfecto y siempre positivo. Kunsang representa la bondad para todos, en todas partes, en todo momento y en todas las circunstancias. Gar significa sitio o lugar.': 'Kunsang means always excellent, completely good, whole, perfect and always positive. Kunsang represents goodness for everyone, everywhere, at all times and in every circumstance. Gar means camp or place.',
    'La tradición Bön tiene una rica historia de tantra, chamanismo y meditación, con evidencia que se remonta a 4.000 años y una historia oral de 18.000 años.': 'The Bön tradition has a rich history of tantra, shamanism and meditation, with evidence reaching back 4,000 years and an oral history of 18,000 years.',
    'Buda Tonpa Shenrab, en el sistema de Shenrab Miwoche, enseñó muchas enseñanzas Bön para la felicidad relativa y última. Estas se recopilan en los Nueve Caminos de Bön, cada uno de los cuales es un conjunto de prácticas que depende del nivel de conciencia de cada persona, desde aliviar el sufrimiento en la vida diaria hasta obtener la conciencia máxima (Dzogchen).': 'Buddha Tonpa Shenrab, in the Shenrab Miwoche system, taught many Bön teachings for relative and ultimate happiness. They are gathered in the Nine Ways of Bön, each a set of practices that depends on a person’s level of awareness, from easing daily suffering to attaining the highest awareness (Dzogchen).',
    'El Bön Kangyur, de 200 volúmenes, y el Tangyur, de 300 volúmenes, contienen enseñanzas en sutra, tantra y Dzogchen. Actualmente hay más de 500 monasterios y conventos en las regiones del Tíbet y el Himalaya. En estos tiempos difíciles, la cultura Bön continúa sobreviviendo, pero se necesita mucho para preservar las enseñanzas antiguas.': 'The 200-volume Bön Kangyur and 300-volume Tangyur contain teachings on sutra, tantra and Dzogchen. Today there are more than 500 monasteries and nunneries in Tibet and the Himalayan regions. In difficult times, Bön culture continues to survive, but much is needed to preserve the ancient teachings.',
    'El pueblo Himalaya de Zhang Zhung cultivó prácticas y rituales poderosos y efectivos para mitigar los efectos de vivir en un ambiente hostil. Los meditadores de gran habilidad recibieron enseñanzas y transmisiones para sanar problemas tanto temporales como últimos.': 'The Himalayan people of Zhang Zhung developed powerful and effective practices and rituals to mitigate the effects of living in a hostile environment. Highly skilled meditators received teachings and transmissions for healing both temporary and ultimate problems.',
    'Los Bön creen que hay cinco elementos internos y cinco externos, que son interdependientes. Los elementos exteriores son fuego, agua, aire, tierra y espacio. También creen que hay muchos seres que no son visibles para el ojo común. Muchos viven y cuidan el cielo, el agua y la tierra. Cuando los elementos y nuestra relación con la tierra y los espíritus se dañan, se utilizan métodos para restaurarnos a nosotros mismos y a nuestro entorno a un equilibrio adecuado.': 'Bön practitioners believe in five inner and five outer elements, which are interdependent. The outer elements are fire, water, air, earth and space. They also recognize many beings invisible to ordinary sight, many of whom inhabit and care for sky, water and earth. When the elements and our relationship with earth and spirits are harmed, methods are used to restore ourselves and our surroundings to proper balance.',
    'Los Naga Sutras son una extensa colección de tres volúmenes de antiguas enseñanzas sagradas que Buda Tonpa Shenrab enseñó a los ocho reyes y reinas naga para resolver problemas ambientales, incluidas enfermedades u otros obstáculos de los naga y los humanos. Se hace especial hincapié en mantener en equilibrio los elementos externos e internos.': 'The Naga Sutras are an extensive three-volume collection of ancient sacred teachings that Buddha Tonpa Shenrab taught to the eight naga kings and queens to resolve environmental problems, including illness and other obstacles affecting nagas and humans. Special emphasis is placed on keeping the outer and inner elements in balance.',
    'Los elementos exteriores e interiores están conectados. Seres invisibles como los nagas sostienen la tierra y el agua. Si los elementos externos son dañados, los espíritus pueden causar dificultades a los humanos. Estos Naga Sutras están incluidos en todos los cánones budistas tibetanos y se practican con frecuencia.': 'Outer and inner elements are connected. Invisible beings such as nagas support earth and water. If the outer elements are harmed, spirits can cause difficulties for humans. These Naga Sutras are included in all Tibetan Buddhist canons and are frequently practised.',
    'En la tradición tibetana, la mente es la fuerza que reencarna. Alma, por otro lado, es un término que significa un soporte temporal para la vida, una especie de energía vital dentro de cada ser vivo. No se identifica como materia o conciencia, ni siquiera como las personas mismas.': 'In the Tibetan tradition, mind is the force that reincarnates. Soul, on the other hand, means a temporary support for life, a kind of vital energy within every living being. It is not identified as matter or consciousness, nor even as the person themselves.',
    'El Bön principal que se practica actualmente en el Tíbet proviene de Zhang Zhung y se conoce como el sistema de Buda Tonpa Shenrab. Según la enseñanza Bön, en la época de Buda Tonpa Shenrab, Buda Shakyamuni fue su alumno, llamado Dhampa Tokar.': 'The principal Bön practised today in Tibet comes from Zhang Zhung and is known as the system of Buddha Tonpa Shenrab. According to Bön teachings, during Tonpa Shenrab’s time, Buddha Shakyamuni was his student, called Dhampa Tokar.',
    'El budismo tibetano, el sistema del Señor Buda Shakyamuni, contiene las enseñanzas de Hinayana, Mahayana y Tantrayana, explicadas también a través de la lógica y la filosofía. Los principales rituales y métodos de curación practicados por la mayoría de los tibetanos son de la tradición Bön; la tradición de Nalanda trajo muchos de los sutras, sistemas filosóficos y lógicos al budismo tibetano.': 'Tibetan Buddhism, the system of Lord Buddha Shakyamuni, contains Hinayana, Mahayana and Tantrayana teachings, also explained through logic and philosophy. Many of the principal healing rituals and methods practised by Tibetans come from the Bön tradition; the Nalanda tradition brought many sutras and philosophical and logical systems into Tibetan Buddhism.',
    'A lo largo del tiempo, los seres sagrados y los budas no han tenido ninguna limitación de tradición espiritual. La sabiduría última, la omnisciencia, es la misma para todos. Esta es la visión de Rimé. Rimé es muy importante ahora: la gente necesita entender que la sabiduría se puede alcanzar abriéndose a otras enseñanzas.': 'Throughout time, sacred beings and buddhas have not been limited by spiritual tradition. Ultimate wisdom, omniscience, is the same for all. This is the Rimé vision. Rimé is especially important now: people need to understand that wisdom can be reached by opening to other teachings.',
    'Cuando el budismo indio llegó al Tíbet en el siglo VIII, los practicantes comenzaron a desarrollar Rimé. Vairocana, Drenpa Namkha, Guru Rinpoche y muchos otros practicaron tanto el Bön como el budismo indio sin prejuicios hacia uno u otro.': 'When Indian Buddhism reached Tibet in the eighth century, practitioners began developing Rimé. Vairocana, Drenpa Namkha, Guru Rinpoche and many others practised both Bön and Indian Buddhism without prejudice toward either.',
    'Después de la agitación posterior al reinado de Trisong Detsen, las enseñanzas comenzaron a florecer nuevamente. El movimiento Rimé vio un rejuvenecimiento en el siglo XIX entre diferentes tradiciones, con el deseo de reconocer las diferencias, encontrar puntos en común e inculcar respeto.': 'After the turmoil following the reign of Trisong Detsen, the teachings began to flourish again. The Rimé movement was renewed in the nineteenth century among different traditions, with a wish to recognize differences, find common ground and cultivate respect.',
    'Actualmente, la ciencia contribuye a través de la evidencia descubierta en la arqueología, la física y la ciencia de la mente. Podemos usar nuestro potencial para traer a la sociedad más paz, paciencia, amor, altruismo y compasión.': 'Today, science contributes through evidence discovered in archaeology, physics and the science of mind. We can use our potential to bring more peace, patience, love, altruism and compassion to society.',
    'El Programa de Sabiduría de Kunsang Gar se divide en tres categorías: Sabiduría Fundamental, Desarrollo mental y Sabiduría por excelencia. Las enseñanzas buscan una comprensión sólida de nuestra naturaleza y una integración gradual en la práctica espiritual.': 'The Kunsang Gar Wisdom Program is divided into three areas: Fundamental Wisdom, Mental Development and Ultimate Wisdom. The teachings seek a solid understanding of our nature and a gradual integration into spiritual practice.',
    'Los materiales de práctica apoyan la tradición Yungdrung Bön bajo la guía de Geshe. Algunos son públicos y otros requieren transmisión, iniciación o autorización previa. No estudies ni recites un material si se indica que requiere transmisión.': 'Practice materials support the Yungdrung Bön tradition under Geshe’s guidance. Some are public, while others require transmission, initiation or prior authorization. Do not study or recite a material if it is marked as requiring transmission.',
    'Las traducciones y los textos conservan sus avisos de derechos de autor. Consulta los canales oficiales para recibir orientación sobre cada material.': 'Translations and texts retain their copyright notices. Consult the official channels for guidance about each material.',
    'La actividad abordó la relación con los elementos, el alma (La), longevidad y prácticas de Tshe Wang Rigdzin.': 'The activity addressed the relationship with the elements, soul (La), longevity and Tshe Wang Rigdzin practices.',
    '6 y 7 de junio de 2026 · Presencial y online · Inglés con traducción al español.': 'June 6 and 7, 2026 · In person and online · English with Spanish translation.',
    'Es adecuado hacer una ofrenda al maestro en función de lo que puedas manejar. La generosidad es la primera de las diez paramitas, o cualidades del carácter, que se deben perfeccionar. El acto de dar abre el corazón, disminuye por un momento el egocentrismo y valora el bienestar de los demás.': 'It is appropriate to make an offering to the teacher according to your means. Generosity is the first of the ten paramitas, or qualities of character, to be perfected. Giving opens the heart, briefly loosens self-centredness and values the wellbeing of others.'
  };

  const wordMap = {
    'la': 'the', 'el': 'the', 'las': 'the', 'los': 'the', 'una': 'a', 'uno': 'one', 'un': 'a',
    'y': 'and', 'de': 'of', 'del': 'of the', 'al': 'to the', 'para': 'for', 'con': 'with', 'en': 'in',
    'por': 'by', 'sin': 'without', 'sobre': 'about', 'entre': 'between', 'desde': 'from', 'hasta': 'until',
    'que': 'that', 'como': 'as', 'cuando': 'when', 'donde': 'where', 'pero': 'but', 'también': 'also',
    'más': 'more', 'muy': 'very', 'cada': 'each', 'todo': 'all', 'toda': 'all', 'todos': 'all', 'todas': 'all',
    'otros': 'other', 'otras': 'other', 'muchos': 'many', 'varios': 'several', 'varias': 'several',
    'es': 'is', 'son': 'are', 'fue': 'was', 'han': 'have', 'hay': 'there are', 'tiene': 'has', 'tienen': 'have',
    'puede': 'can', 'pueden': 'can', 'incluye': 'includes', 'incluyen': 'include', 'existen': 'there are',
    'esta': 'this', 'este': 'this', 'estos': 'these', 'estas': 'these', 'su': 'its', 'sus': 'its',
    'nuestro': 'our', 'nuestra': 'our', 'nuestros': 'our', 'nuestras': 'our', 'mi': 'my', 'me': 'me',
    'se': 'is', 'lo': 'it', 'le': 'to', 'les': 'to', 'ya': 'already', 'sigue': 'continues', 'siguen': 'continue',
    'fue': 'was', 'hacia': 'toward', 'través': 'through', 'vida': 'life', 'mundo': 'world', 'mundo': 'world',
    'tradición': 'tradition', 'tradiciones': 'traditions', 'práctica': 'practice', 'prácticas': 'practices',
    'enseñanzas': 'teachings', 'enseñanza': 'teaching', 'recursos': 'resources', 'materiales': 'materials',
    'estudio': 'study', 'estudios': 'studies', 'actividad': 'activity', 'actividades': 'activities',
    'información': 'information', 'disponibles': 'available', 'disponibilidad': 'availability',
    'presencial': 'in person', 'online': 'online', 'inglés': 'English', 'español': 'Spanish',
    'ciudad': 'city', 'méxico': 'Mexico', 'octubre': 'October', 'noviembre': 'November',
    'junio': 'June', 'mayo': 'May', 'julio': 'July', 'enero': 'January', 'febrero': 'February',
    'agosto': 'August', 'septiembre': 'September', 'diciembre': 'December',
    'conoce': 'learn about', 'conocer': 'learn about', 'solicita': 'request', 'solicitar': 'request',
    'consulta': 'consult', 'consultar': 'consult', 'abrir': 'open', 'descarga': 'download', 'descargar': 'download',
    'compartir': 'share', 'compartido': 'shared', 'compartidos': 'shared', 'realiza': 'performs',
    'realizar': 'perform', 'ayuda': 'helps', 'ayudar': 'help', 'recibir': 'receive', 'requiere': 'requires',
    'requieren': 'require', 'según': 'according to', 'correspondientes': 'corresponding', 'antiguo': 'ancient',
    'antigua': 'ancient', 'antiguas': 'ancient', 'espiritual': 'spiritual', 'espirituales': 'spiritual',
    'mental': 'mental', 'emocional': 'emotional', 'verdadera': 'true', 'verdadero': 'true', 'naturaleza': 'nature',
    'camino': 'path', 'caminos': 'paths', 'forma': 'way', 'formas': 'ways', 'lugar': 'place', 'personas': 'people',
    'persona': 'person', 'seres': 'beings', 'ser': 'being', 'sufrimiento': 'suffering', 'felicidad': 'happiness',
    'paz': 'peace', 'amor': 'love', 'bondad': 'kindness', 'corazón': 'heart', 'mente': 'mind', 'conciencia': 'consciousness',
    'reconocimiento': 'recognition', 'visión': 'vision', 'historia': 'history', 'histórico': 'historical', 'histórica': 'historical',
    'próximos': 'upcoming', 'próximas': 'upcoming', 'pasados': 'past', 'pasadas': 'past', 'futuro': 'future',
    'fecha': 'date', 'fechas': 'dates', 'sedes': 'venues', 'registro': 'registration', 'revisión': 'review',
    'público': 'public', 'pública': 'public', 'públicas': 'public', 'públicos': 'public', 'privado': 'private',
    'privada': 'private', 'autorizado': 'authorized', 'autorizada': 'authorized', 'protegido': 'protected',
    'importante': 'important', 'principal': 'main', 'fundamental': 'fundamental', 'excelencia': 'ultimate',
    'desarrollo': 'development', 'duración': 'duration', 'requisitos': 'requirements', 'participación': 'participation',
    'mínima': 'minimum', 'mínimo': 'minimum', 'certificado': 'certificate', 'certificación': 'certification',
    'donativo': 'donation', 'donaciones': 'donations', 'pago': 'payment', 'operación': 'operation', 'único': 'one-time',
    'única': 'one-time', 'suscripción': 'subscription', 'recurrencia': 'recurrence', 'secreto': 'secret', 'secretos': 'secrets',
    'sitio': 'site', 'segura': 'secure', 'seguro': 'secure', 'conexión': 'connection', 'guía': 'guidance', 'guía': 'guidance',
    'maestro': 'teacher', 'maestros': 'teachers', 'autor': 'author', 'autora': 'author', 'formación': 'training',
    'trabajo': 'work', 'investigación': 'research', 'cultura': 'culture', 'ritual': 'ritual', 'rituales': 'rituals',
    'elementos': 'elements', 'alma': 'soul', 'agua': 'water', 'tierra': 'earth', 'aire': 'air', 'fuego': 'fire',
    'espacio': 'space', 'espacios': 'spaces', 'sagrado': 'sacred', 'sagradas': 'sacred', 'cuerpo': 'body', 'cuerpos': 'bodies',
    'mente': 'mind', 'meditación': 'meditation', 'oraciones': 'prayers', 'oración': 'prayer', 'curación': 'healing',
    'sanar': 'heal', 'salud': 'health', 'muerte': 'death', 'morir': 'dying', 'nacimiento': 'birth', 'enfermedad': 'illness',
    'maestro': 'teacher', 'maestros': 'teachers', 'liberación': 'freedom', 'samsara': 'samsara', 'nirvana': 'nirvana',
    'compasión': 'compassion', 'vacuidad': 'emptiness', 'bondad': 'kindness', 'amorosa': 'loving', 'atención': 'attention',
    'calma': 'calm', 'interior': 'inner', 'externos': 'external', 'internos': 'internal', 'externa': 'external', 'interna': 'internal',
    'poder': 'power', 'fuerza': 'force', 'tiempo': 'time', 'momento': 'moment', 'vida': 'life', 'vivir': 'live',
    'apoyo': 'support', 'apoyar': 'support', 'sostener': 'sustain', 'encuentros': 'gatherings', 'encuentro': 'gathering',
    'cientos': 'hundreds', 'antiguos': 'ancient', 'antiguas': 'ancient', 'abordar': 'address', 'problemas': 'problems',
    'diaria': 'daily', 'incluidos': 'including', 'métodos': 'methods', 'pacíficos': 'peaceful', 'iracundos': 'wrathful',
    'crear': 'create', 'mayor': 'greater', 'armonía': 'harmony', 'entornos': 'environments', 'siendo': 'being',
    'beneficio': 'benefit', 'vivimos': 'we live', 'mantenemos': 'we maintain', 'profunda': 'deep',
    'reverencia': 'reverence', 'unidad': 'unity', 'probable': 'likely', 'abundancia': 'abundance', 'perduren': 'endure',
    'ofrendas': 'offerings', 'purificación': 'purification', 'equilibrar': 'balance', 'individuo': 'individual',
    'momentos': 'moments', 'angustia': 'distress', 'sesión': 'session', 'sesiones': 'sessions', 'horas': 'hours',
    'ceremonias': 'ceremonies', 'limpiar': 'cleanse', 'negatividad': 'negativity', 'traer': 'bring', 'bendiciones': 'blessings',
    'negocio': 'business', 'transferencia': 'transfer', 'acerca': 'approaches', 'fallecido': 'passed away', 'ofrece': 'offers',
    'especial': 'special', 'queridos': 'loved ones', 'transición': 'transition', 'relación': 'relationship', 'alumno': 'student',
    'representa': 'represents', 'confianza': 'trust', 'iluminación': 'awakening', 'potenciar': 'strengthen',
    'sugerido': 'suggested', 'adecuado': 'appropriate', 'función': 'basis', 'puedas': 'you can manage', 'objetivo': 'aim',
    'brindar': 'provide', 'papel': 'role', 'primera': 'first', 'diez': 'ten', 'cualidades': 'qualities', 'carácter': 'character',
    'deben': 'must', 'acto': 'act', 'abre': 'opens', 'disminuye': 'reduces', 'egocentrismo': 'self-centredness',
    'valora': 'values', 'bienestar': 'wellbeing', 'demás': 'others', 'sincera': 'sincere', 'servicio': 'service',
    'actualizada': 'updated', 'escribe': 'write', 'utiliza': 'use', 'principales': 'main', 'secundarios': 'secondary',
    'mañana': 'morning', 'tarde': 'evening', 'calendario': 'calendar', 'cohorte': 'cohort', 'vigente': 'current',
    'referencia': 'reference', 'cosmológica': 'cosmological', 'detallada': 'detailed', 'curativas': 'healing',
    'dificultades': 'difficulties', 'sentimientos': 'feelings', 'dolorosos': 'painful', 'surgen': 'arise',
    'temporales': 'temporary', 'dependen': 'depend', 'causas': 'causes', 'condiciones': 'conditions', 'primigenia': 'primordial',
    'destilado': 'distilled', 'categorías': 'categories', 'conexión': 'connection', 'deidades': 'deities', 'demonios': 'demons',
    'renacimiento': 'rebirth', 'significado': 'meaning', 'devoción': 'devotion', 'motivación': 'motivation',
    'preliminar': 'preliminary', 'aborda': 'addresses', 'fenómenos': 'phenomena', 'bodichita': 'bodhicitta',
    'amorosa': 'loving', 'plena': 'full', 'entrenamiento': 'training', 'psicología': 'psychology', 'perfecciones': 'perfections',
    'yogas': 'yogas', 'deidad': 'deity', 'sueño': 'dream', 'mantras': 'mantras', 'dedicación': 'dedication', 'dirigimos': 'we turn',
    'conciencia': 'awareness', 'encontrar': 'find', 'prepararnos': 'prepare', 'transformar': 'transform', 'ignorancia': 'ignorance',
    'cantos': 'chants', 'revela': 'reveals', 'espontáneas': 'spontaneous', 'luminosidad': 'luminosity', 'claridad': 'clarity',
    'entrelaza': 'weaves', 'completa': 'complete', 'descarga': 'download', 'documentos': 'documents', 'gradual': 'gradual',
    'cuidada': 'supported', 'modalidad': 'format', 'inscribirte': 'register', 'sostenida': 'sustained', 'actualizaciones': 'updates',
    'estudiantes': 'students', 'autorización': 'authorization', 'transmisión': 'transmission', 'iniciación': 'initiation',
    'recitan': 'recite', 'derechos': 'rights', 'contexto': 'context', 'presentadas': 'presented', 'sujetos': 'subject',
    'indicaciones': 'guidance', 'sostiene': 'is sustained', 'acompañamiento': 'guidance', 'depende': 'depends',
    'programa': 'program', 'programas': 'programs', 'comunidad': 'community', 'contenido': 'content', 'ceremonia': 'ceremony',
    'hora': 'hour', 'horario': 'schedule', 'traducción': 'translation', 'traducciones': 'translations', 'eventos': 'events',
    'orientación': 'guidance', 'eventual': 'eventual', 'evento': 'event', 'recuperación': 'retrieval', 'consultando': 'checking', 'ha': 'has', 'budistas': 'Buddhist',
    'tres': 'three', 'oficial': 'official', 'clase': 'class', 'observador': 'observer', 'observado': 'observed',
    'diferencia': 'difference', 'dualidad': 'duality', 'olas': 'waves', 'sean': 'are', 'grandes': 'large',
    'pequeñas': 'small', 'misma': 'same', 'océano': 'ocean', 'expresión': 'expression', 'no': 'no',
    'recorrido': 'path', 'recorridos': 'paths', 'sabiduría': 'wisdom', 'fundamental': 'foundational',
    'categoría': 'category', 'categorías': 'categories'
  };

  const hrefLabels = [
    [/events\/?$/, 'Mexico 2026'], [/services\.html$/, 'Services'], [/index\.html$|^\/$/, 'Home'], [/contact\.html$/, 'Contact'],
    [/donations\.html$/, 'Donations'], [/classes\.html$/, 'Classes'], [/kunsang-gar\.html$/, 'Kunsang Gar'],
    [/geshe-dangsong\.html$/, 'Geshe Dangsong'], [/tradicion-bon\.html$/, 'Bön Tradition'],
    [/nuevo-bon\.html$/, 'New Bön'], [/rime\.html$/, 'Rimé'], [/sangha\.html$/, 'Sangha'],
    [/certification\.html$/, 'Certification'], [/prayers\.html$/, 'Prayers'],
    [/account\/?$/, 'Access'], [/programs\/?$/, 'Programs'], [/library\/?$/, 'Library']
  ];

  function getLanguage() {
    const query = new URLSearchParams(window.location.search).get('lang');
    if (SUPPORTED.has(query)) {
      try { localStorage.setItem(STORAGE_KEY, query); } catch (_) {}
      return query;
    }
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (SUPPORTED.has(saved)) return saved;
    } catch (_) {}
    return 'es';
  }

  const lang = getLanguage();
  document.documentElement.lang = lang;

  function normalize(value) {
    return value.replace(/\s+/g, ' ').trim();
  }

  function dictionary() {
    // Some legacy entries are kept with the donations page map for backwards
    // compatibility; include them globally so long paragraphs remain complete.
    return Object.assign({}, common, pageMaps.donations || {}, longTranslations, pageMaps[page] || {});
  }

  function translated(value) {
    if (lang === 'es') return value;
    const map = dictionary();
    const exact = map[normalize(value)];
    if (exact) return value.replace(normalize(value), exact);
    let output = value;
    Object.keys(map).sort((a, b) => b.length - a.length).forEach((key) => {
      if (!key || !output.includes(key)) return;
      output = output.split(key).join(map[key]);
    });
    Object.keys(wordMap).sort((a, b) => b.length - a.length).forEach((key) => {
      const replacement = wordMap[key];
      const pattern = new RegExp(`\\b${key.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&')}\\b`, 'giu');
      output = output.replace(pattern, (match) => {
        if (match[0] === match[0].toUpperCase()) return replacement.charAt(0).toUpperCase() + replacement.slice(1);
        return replacement;
      });
    });
    return output;
  }

  function translateTextNodes(root = document.body) {
    if (lang === 'es' || !root) return;
    const map = dictionary();
    root.querySelectorAll?.('p,h1,h2,h3,h4,figcaption,li').forEach((element) => {
      if (element.closest('.language-switcher')) return;
      if (element.querySelector('[data-user-name], [data-user-email], [data-user-role]')) return;
      const source = normalize(element.textContent || '');
      const exact = map[source];
      if (exact) element.textContent = exact;
    });
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach((node) => {
      if (!node.nodeValue.trim() || /^(SCRIPT|STYLE|NOSCRIPT|TEXTAREA)$/i.test(node.parentElement?.tagName || '') || node.parentElement?.closest('.language-switcher')) return;
      const next = translated(node.nodeValue);
      if (next !== node.nodeValue) node.nodeValue = next;
    });
  }

  function translateAttributes() {
    if (lang === 'es') return;
    document.querySelectorAll('a,button,input,label').forEach((element) => {
      const href = element.getAttribute('href') || '';
      const label = hrefLabels.find(([pattern]) => pattern.test(href));
      if (label && element.children.length === 0) element.textContent = label[1];
    });
    document.querySelector('.skip-link')?.setAttribute('aria-label', 'Skip to content');
    document.querySelector('.menu-toggle')?.setAttribute('aria-label', 'Open menu');
    document.querySelectorAll('.submenu-toggle').forEach((button) => button.setAttribute('aria-label', 'Open submenu'));
    document.querySelectorAll('[aria-label]').forEach((element) => {
      const value = element.getAttribute('aria-label');
      if (value && value !== 'Language') element.setAttribute('aria-label', translated(value));
    });
    document.querySelectorAll('img[alt]').forEach((img) => {
      const alt = img.getAttribute('alt');
      if (alt) img.setAttribute('alt', translated(alt));
    });
  }

  function addLanguageSwitcher() {
    const nav = document.querySelector('.nav');
    if (!nav || document.querySelector('.language-switcher')) return;
    const host = document.querySelector('.nav-tools') || document.querySelector('.nav-cta')?.parentElement || nav;
    const wrapper = document.createElement('div');
    wrapper.className = 'language-switcher';
    wrapper.setAttribute('aria-label', 'Language');
    ['es', 'en'].forEach((code, index) => {
      if (index) {
        const separator = document.createElement('span');
        separator.setAttribute('aria-hidden', 'true');
        separator.textContent = '|';
        wrapper.append(separator);
      }
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = code.toUpperCase();
      button.dataset.lang = code;
      button.className = code === lang ? 'language-current' : '';
      button.setAttribute('aria-pressed', String(code === lang));
      button.addEventListener('click', () => {
        try { localStorage.setItem(STORAGE_KEY, code); } catch (_) {}
        const url = new URL(window.location.href);
        url.searchParams.set('lang', code);
        window.location.assign(url.toString());
      });
      wrapper.append(button);
    });
    if (host.classList.contains('nav-tools')) host.prepend(wrapper);
    else host.append(wrapper);
  }

  function updateMeta() {
    if (!titles[page]) return;
    if (lang === 'en') {
      document.title = titles[page][0];
      const description = document.querySelector('meta[name="description"]');
      if (description) description.setAttribute('content', titles[page][1]);
    }
    const canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      const link = document.createElement('link');
      link.rel = 'canonical';
      link.href = window.location.origin + window.location.pathname;
      document.head.append(link);
    }
    document.querySelectorAll('link[rel="alternate"]').forEach((link) => link.remove());
    ['es', 'en'].forEach((code) => {
      const link = document.createElement('link');
      link.rel = 'alternate';
      link.hreflang = code;
      link.href = `${window.location.origin}${window.location.pathname}?lang=${code}`;
      document.head.append(link);
    });
  }

  function addStyles() {
    if (document.getElementById('kunsang-i18n-styles')) return;
    const style = document.createElement('style');
    style.id = 'kunsang-i18n-styles';
    style.textContent = '.language-switcher{display:flex;align-items:center;gap:2px;color:rgba(255,255,255,.78);font-size:.72rem;font-weight:900;letter-spacing:.08em;white-space:nowrap}.language-switcher button{min-width:28px;padding:5px 4px;border:0;background:transparent;color:inherit;font:inherit;cursor:pointer}.language-switcher button.language-current{color:#f0c276;border-bottom:1px solid #f0c276}.language-switcher span{opacity:.55}@media(max-width:760px){.real-home .language-switcher{display:flex!important}.language-switcher{margin-left:auto}.real-home .nav-tools{gap:6px}}';
    document.head.append(style);
  }

  function run() {
    addStyles();
    addLanguageSwitcher();
    updateMeta();
    translateTextNodes();
    translateAttributes();
    document.querySelectorAll('.footer-bottom span:last-child').forEach((span) => {
      if (lang === 'en') span.textContent = 'EN';
    });
    if (lang === 'en') {
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) translateTextNodes(node);
          });
          if (mutation.type === 'characterData') translateTextNodes(mutation.target.parentElement || document.body);
        });
      });
      observer.observe(document.body, { childList: true, characterData: true, subtree: true });
      window.setTimeout(() => observer.disconnect(), 12000);
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run, { once: true });
  else run();
})();
