import type { Dictionary } from "../types";

export const es: Dictionary = {
  meta: {
    siteName: "SmartradeBot",
    tagline: "Bots, indicadores y señales de trading",
    defaultTitle: "SmartradeBot — Bots, indicadores y señales de trading",
    defaultDescription:
      "Bots de trading automatizados, indicadores profesionales y señales de pago único. Compra en minutos y accede al instante, sin intervención humana.",
  },
  nav: {
    bots: "Bots",
    indicators: "Indicadores",
    signals: "Señales",
    whyExness: "Por qué Exness",
    referrals: "Compartí y ganá",
    contact: "Contacto",
    cta: "Empezar",
    menu: "Menú",
    close: "Cerrar",
  },
  common: {
    buyNow: "Comprar ahora",
    subscribe: "Suscribirme",
    learnMore: "Ver más",
    viewDetails: "Ver detalles",
    from: "Desde",
    perMonth: "/mes",
    oneTime: "pago único",
    mostPopular: "Más elegido",
    comingSoon: "Próximamente",
    customBadge: "Personalizado",
    bundleBadge: "Incluye indicador gratis",
    exnessOnlyBadge: "Solo con referido de Exness",
    exnessOnlyHint:
      "Este precio promocional requiere una cuenta de Exness verificada abierta con nuestro enlace — no tiene versión sin él.",
    depositBadge: "Se paga en 2 partes",
    depositHint:
      "Pagás {percent}% ahora como seña ({amount}) y el resto cuando el {item} esté listo para entregarse. El armado toma entre 15 y 25 días según la complejidad.",
    backtestTitle: "Resultados de backtest",
    backtestDisclaimer:
      "Resultados históricos simulados — el rendimiento pasado no garantiza resultados futuros.",
    purchaseProcessTitle: "Cómo es el proceso de compra",
    allProducts: "Todos los productos",
    needHelp: "¿Tienes dudas?",
    contactUs: "Contáctanos",
    scheduleCall: "Agendar una llamada",
    downloadManual: "Manual de uso",
    worksOn: "Opera en",
    timeframe: "Temporalidad",
    strategy: "Estrategia",
    platform: "Plataforma",
    languageLabel: "Idioma",
    securePayment: "Pago seguro",
    instantAccess: "Acceso inmediato",
    back: "Atrás",
  },
  home: {
    hero: {
      badge: "Trading automatizado, sin complicaciones",
      title: "Opera con la ventaja de la IA:",
      titleHighlight: "bots, indicadores y señales",
      subtitle:
        "Quítale la emoción al trading y haz crecer tu rendimiento con la tecnología que ya usan los profesionales.",
      ctaPrimary: "Ver los bots",
      ctaSecondary: "Ver planes de señales",
    },
    stats: [
      { value: "24/7", label: "Activo aunque no mires la pantalla" },
      { value: "Multi-activo", label: "Opera en más de un mercado a la vez" },
      { value: "Sin emociones", label: "La misma lógica en cada operación" },
      { value: "Velocidad", label: "Analiza y ejecuta más rápido que un clic" },
    ],
    trustTitle: "Pensado para traders minoristas que quieren un proceso real",
    categories: {
      title: "Tres formas de operar con nosotros",
      subtitle:
        "Cada línea de producto es independiente. Empieza por una o combínalas.",
      bots: {
        title: "Bots de trading",
        description:
          "Expert Advisors totalmente automatizados. Cada bot tiene una estrategia definida, un activo objetivo y un manual paso a paso. Pagas una vez y es tuyo.",
        cta: "Ver bots",
      },
      indicators: {
        title: "Indicadores",
        description:
          "Herramientas de precisión para tu propio análisis: entradas, salidas, filtros de tendencia y volatilidad. Pago único, actualizaciones de por vida.",
        cta: "Ver indicadores",
      },
      signals: {
        title: "Señales",
        description:
          "Pago único, acceso directo al canal de Telegram del activo que elijas. Operaciones concretas con entrada, stop-loss y take-profit, más contexto de mercado.",
        cta: "Ver señales",
      },
    },
    how: {
      title: "Cómo funciona",
      subtitle: "El mismo flujo simple para cada producto.",
      steps: [
        {
          title: "Elige tu producto",
          description:
            "Compara bots, indicadores y planes de señales. Cada página muestra la estrategia, el activo y el precio de forma clara.",
        },
        {
          title: "Paga con tarjeta o cripto",
          description:
            "Checkout con Stripe o pago en cripto. El pago se verifica automáticamente, sin idas y vueltas.",
        },
        {
          title: "Accede al instante",
          description:
            "Los bots e indicadores se entregan con credenciales y manual. A los miembros de señales se los agrega al canal privado.",
        },
      ],
    },
    exness: {
      badge: "Bróker recomendado",
      title: "Corre nuestros bots en Exness y desbloquea un precio menor",
      subtitle:
        "Nuestros bots están optimizados para la ejecución de Exness. Abre una cuenta con nuestro enlace de referido y el precio del bot baja, además de un mejor entorno de trading.",
      benefits: [
        {
          title: "Spreads más ajustados",
          description:
            "Las cuentas raw y de spread bajo reducen el costo de la estrategia, algo clave para bots de alta frecuencia.",
        },
        {
          title: "Depósitos y retiros instantáneos",
          description:
            "Financiación y pagos automáticos y casi instantáneos: nunca te quedas esperando a la mesa de operaciones.",
        },
        {
          title: "VPS gratis",
          description:
            "Las cuentas elegibles reciben un VPS gratis para que tu bot opere 24/7 sin dejar tu PC encendida.",
        },
        {
          title: "Cuentas sin swap",
          description:
            "Los tipos de cuenta sin swap eliminan el costo de financiación overnight en los instrumentos compatibles.",
        },
      ],
      cta: "Ver la oferta de Exness",
      disclaimer:
        "Podemos recibir una comisión si abres una cuenta a través de nuestro enlace, sin costo adicional para ti. Operar conlleva riesgo.",
    },
    testimonials: {
      title: "Lo que dicen los miembros",
      subtitle: "Comentarios de traders que usan los bots y la sala de señales.",
      items: [
        {
          quote:
            "La instalación me llevó diez minutos con el manual. El bot corre en mi VPS desde entonces sin que tenga que estar encima.",
          name: "Andrés M.",
          role: "Usuario del bot de oro",
        },
        {
          quote:
            "Las señales vienen con un nivel de invalidación claro, que es lo que realmente necesitaba. Sin ruido, solo la operación.",
          name: "Sara K.",
          role: "Miembro de señales",
        },
        {
          quote:
            "Pagar con cripto y recibir el archivo de licencia al instante fue impecable. El soporte respondió mi duda rápido.",
          name: "Lucas R.",
          role: "Cliente de indicadores",
        },
      ],
    },
    faq: {
      title: "Preguntas frecuentes",
      subtitle: "Todo lo demás está en las páginas de producto o a un mensaje de distancia.",
      items: [
        {
          q: "¿Tengo que pagar una suscripción por los bots?",
          a: "No. Todo en el sitio es de pago único — bots, indicadores y señales.",
        },
        {
          q: "¿Cómo recibo el bot después de pagar?",
          a: "Una vez confirmado el pago recibes la descarga o licencia, el manual de configuración y los ajustes recomendados automáticamente por correo.",
        },
        {
          q: "¿Qué bróker debería usar?",
          a: "Puedes correr los bots en la mayoría de los brókers MT4/MT5, pero están afinados para Exness. Abrir una cuenta con nuestro enlace desbloquea un precio menor del bot.",
        },
        {
          q: "¿Cómo se entregan las señales?",
          a: "A través de un canal privado de Telegram. Al comprar recibís el link de invitación por correo — el acceso queda activo sin vencimiento, no es una suscripción.",
        },
        {
          q: "¿Puedo pagar con criptomonedas?",
          a: "Sí. Todos los productos admiten pago con tarjeta vía Stripe y pago en cripto, ambos verificados automáticamente.",
        },
        {
          q: "¿Operar es riesgoso?",
          a: "Sí. El trading con apalancamiento puede ocasionar la pérdida de tu capital. El rendimiento pasado no garantiza resultados futuros. Opera solo con dinero que puedas permitirte perder.",
        },
      ],
    },
    finalCta: {
      title: "¿Listo para ponerle un proceso a tu trading?",
      subtitle: "Elige un bot, llévate un indicador o únete hoy a la sala de señales.",
      cta: "Ver productos",
    },
  },
  bots: {
    hero: {
      title: "Bots de trading",
      subtitle:
        "Estrategias automatizadas con una ventaja definida. Cada bot indica su activo, temporalidad y lógica para que sepas exactamente qué estás corriendo.",
    },
    listNote:
      "Pago único. Abre una cuenta en Exness con nuestro enlace para el precio menor.",
    empty: "Estamos agregando nuevos bots. Vuelve pronto.",
    detail: {
      overview: "Descripción",
      features: "Qué incluye",
      howItWorks: "Cómo funciona",
      pricing: "Precio",
      manual: "Manual de uso",
      specs: "Especificaciones",
      basePriceLabel: "Precio estándar",
      exnessPriceLabel: "Con referido de Exness",
      exnessHint:
        "Abre una cuenta en Exness con nuestro enlace y envíanos el número de cuenta para desbloquear este precio.",
      save: "Ahorras {amount}",
      buyCta: "Comprar este bot",
      contactCta: "Hacer una consulta",
      scheduleCta: "Agendar una llamada",
      deliveryNote:
        "Después del pago recibes el archivo del bot, la licencia y el manual de configuración por correo automáticamente.",
      customCta: "Contanos tu estrategia",
      customDeliveryNote:
        "Después de la seña, completás el formulario de tu estrategia y coordinamos una reunión para revisarlo. Te entregamos el bot con licencia y manual entre 15 y 25 días después.",
      relatedTitle: "Otros bots",
    },
  },
  indicators: {
    hero: {
      title: "Indicadores",
      subtitle:
        "Herramientas profesionales para traders discrecionales. Señales limpias, sin repintado, actualizaciones de por vida.",
    },
    listNote: "Pago único · Funciona en MT4, MT5 y TradingView donde se indique.",
    empty: "Estamos agregando nuevos indicadores. Vuelve pronto.",
    detail: {
      overview: "Descripción",
      features: "Qué incluye",
      howItWorks: "Cómo usarlo",
      pricing: "Precio",
      manual: "Manual de uso",
      specs: "Especificaciones",
      basePriceLabel: "Precio",
      exnessPriceLabel: "Con referido de Exness",
      exnessHint: "Abre una cuenta en Exness con nuestro enlace para desbloquear este precio.",
      save: "Ahorras {amount}",
      buyCta: "Comprar este indicador",
      contactCta: "Hacer una consulta",
      scheduleCta: "Agendar una llamada",
      deliveryNote:
        "Después del pago recibes el archivo del indicador y el manual por correo automáticamente.",
      customCta: "Contanos tu estrategia",
      customDeliveryNote:
        "Después de la seña, completás el formulario de tu estrategia y coordinamos una reunión para revisarlo. Te entregamos el indicador con licencia y manual entre 15 y 25 días después.",
      relatedTitle: "Otros indicadores",
    },
  },
  signals: {
    hero: {
      title: "Señales",
      subtitle:
        "Pago único, acceso directo al canal de Telegram del activo que elijas. Cada señal incluye entrada, stop-loss, take-profit y el razonamiento detrás.",
    },
    listNote:
      "Pago único · Acceso al canal de Telegram del activo elegido, sin vencimiento.",
    empty: "Estamos agregando nuevas señales. Vuelve pronto.",
    detail: {
      overview: "Descripción",
      features: "Qué incluye",
      howItWorks: "Cómo funciona",
      pricing: "Precio",
      manual: "Acceso",
      specs: "Especificaciones",
      basePriceLabel: "Precio estándar",
      exnessPriceLabel: "Con referido de Exness",
      exnessHint:
        "Abre una cuenta en Exness con nuestro enlace para desbloquear este precio.",
      save: "Ahorras {amount}",
      buyCta: "Comprar esta señal",
      contactCta: "Hacer una consulta",
      scheduleCta: "Agendar una llamada",
      deliveryNote:
        "Después del pago recibís el link de acceso al canal de Telegram por correo automáticamente.",
      customCta: "Contanos tu estrategia",
      customDeliveryNote:
        "Después de la seña, completás el formulario de tu estrategia y coordinamos una reunión para revisarlo.",
      relatedTitle: "Otras señales",
    },
  },
  exnessPage: {
    hero: {
      title: "Por qué trabajamos con Exness",
      subtitle:
        "Nuestros bots se construyen y prueban en Exness. Aquí te explicamos por qué importa para tus resultados y cómo obtener el precio menor del bot.",
    },
    benefits: [
      {
        title: "Spreads más ajustados, menor costo por operación",
        description:
          "Los spreads bajos mantienen los costos de transacción al mínimo. Para bots que operan seguido, el spread es uno de los mayores costos ocultos: spreads menores protegen la ventaja de forma directa.",
      },
      {
        title: "Depósitos y retiros automáticos e instantáneos",
        description:
          "Los depósitos son instantáneos y automáticos. Los retiros también: se procesan las 24 horas, los 7 días de la semana, sin intervención manual — nunca esperás una aprobación para sacar tus ganancias.",
      },
      {
        title: "VPS gratis para cuentas elegibles",
        description:
          "Un VPS mantiene tu bot operando 24/7 con una conexión estable y cercana a los servidores del bróker, sin dejar tu computadora encendida. Exness ofrece uno gratis según el saldo o volumen de la cuenta.",
      },
      {
        title: "Sin swap",
        description:
          "Las cuentas no cobran cargos de financiación overnight (swap) en los instrumentos compatibles, útil para estrategias que mantienen posiciones más de un día.",
      },
      {
        title: "Liquidez profunda y ejecución rápida",
        description:
          "La baja latencia y la buena calidad de ejecución reducen el slippage: el precio que espera tu bot se acerca al precio que obtiene.",
      },
      {
        title: "Escala de cuentas pequeñas a grandes",
        description:
          "Depósitos mínimos flexibles y varios tipos de cuenta te permiten empezar pequeño y crecer sin cambiar toda tu configuración.",
      },
    ],
    cta: "Abrir mi cuenta de Exness",
    disclaimer:
      "SmartradeBot no está afiliada a Exness más allá de una relación de introducción/referido. La disponibilidad de tipos de cuenta, VPS y estado sin swap depende de tu región y de los propios términos de Exness. Operar productos apalancados conlleva un alto riesgo de perder dinero.",
  },
  referrals: {
    hero: {
      badge: "Programa de partners",
      title: "Compartí y ganá",
      titleHighlight: "con cada persona que sumes",
      subtitle:
        "Abrí tu cuenta de Exness con nuestro link, activá tu perfil de partner con ese mismo email y listo: tenés tu propio link para compartir y ganar con cada persona que sumes.",
      ctaPrimary: "Abrir mi cuenta de Exness",
      ctaSecondary: "Activar mi cuenta de partner",
    },
    how: {
      title: "Cómo funciona",
      subtitle: "Tres pasos, sin esperas.",
      steps: [
        {
          title: "Abrís tu cuenta con nuestro link",
          description:
            "Nuestro link de Exness ya tiene nuestro código de partner incorporado. Cualquier cuenta que se abra con él queda asociada a nuestra red automáticamente, sin ningún paso extra.",
        },
        {
          title: "Activás tu perfil de partner",
          description:
            "Ingresás el mismo email que usaste en Exness. Verificamos al instante que tu cuenta esté asociada a nuestro link y te damos de alta como agente referido.",
        },
        {
          title: "Compartís tu propio link",
          description:
            "Te lo mandamos por correo apenas te activás. Cada persona que abra su cuenta de Exness con ese link, o compre un producto, queda identificada como tuya.",
        },
      ],
    },
    earn: {
      title: "Qué vas a poder ganar",
      subtitle: "Dos fuentes de ingresos, no solo una.",
      items: [
        {
          title: "10% de comisión por producto",
          description:
            "De cada bot, indicador o señal que compren las personas que sumaste, directo de parte nuestra.",
        },
        {
          title: "20% de comisión por trading",
          description:
            "Exness te paga directamente una parte de lo que genera la actividad de trading de tus referidos: un ingreso recurrente mientras sigan operando, no solo por la venta inicial.",
        },
      ],
    },
    form: {
      title: "Activá tu cuenta de partner",
      subtitle:
        "Ingresá el email con el que abriste tu cuenta de Exness. Si está asociada a nuestro link, te activamos al instante.",
      submit: "Enviar",
      sending: "Enviando…",
      success: "¡Listo! Te vamos a contactar a la brevedad.",
      error: "No se pudo enviar. Inténtalo de nuevo.",
    },
    activate: {
      emailLabel: "Email de tu cuenta de Exness",
      emailHint: "Tiene que ser el mismo con el que abriste la cuenta con nuestro link.",
      submit: "Activar mi cuenta de partner",
      sending: "Verificando…",
      success:
        "¡Listo! Ya sos partner de SmartradeBot. Te enviamos tu link también por correo.",
      notAffiliated:
        "No encontramos una cuenta de Exness abierta con nuestro link para ese email. Abrí tu cuenta primero y probá de nuevo.",
      error: "No se pudo activar tu cuenta. Inténtalo de nuevo o escribinos.",
    },
    faq: {
      title: "Preguntas frecuentes",
      items: [
        {
          q: "¿Necesito ser trader para participar?",
          a: "No. Cualquiera puede compartir su link y sumar personas a la red.",
        },
        {
          q: "¿Cuándo tengo mi propio link?",
          a: "Al instante: activás tu cuenta de partner con el email que usaste en Exness y te lo generamos ahí mismo.",
        },
        {
          q: "¿Cómo y cuándo cobro?",
          a: "El 20% de comisión por trading te lo paga Exness directamente, según sus propios plazos. El 10% de comisión por producto te lo pagamos nosotros cada vez que se genera una venta con tu link.",
        },
      ],
    },
    disclaimer:
      "Los referidos de Exness dependen de los términos y condiciones del programa de partners de Exness, que pueden cambiar. SmartradeBot no garantiza montos ni plazos de comisión.",
  },
  contact: {
    hero: {
      title: "Contacto y reservas",
      subtitle:
        "¿Dudas sobre un bot, un indicador o la sala de señales? Envía un mensaje o reserva una llamada.",
    },
    form: {
      name: "Nombre completo",
      email: "Correo",
      phone: "Teléfono / WhatsApp",
      topic: "Tema",
      message: "Mensaje",
      submit: "Enviar mensaje",
      sending: "Enviando…",
      success: "Gracias, recibimos tu mensaje. Te respondemos a la brevedad.",
      error: "Algo salió mal. Inténtalo de nuevo o escríbenos por Telegram.",
      topics: {
        bots: "Bots",
        indicators: "Indicadores",
        signals: "Membresía de señales",
        payment: "Pago / acceso",
        other: "Otro",
      },
    },
    schedule: {
      title: "Reserva una llamada",
      description:
        "¿Prefieres hablarlo? Reserva un Google Meet y te guiamos por el producto y la configuración.",
      cta: "Abrir la página de reservas",
    },
    directTitle: "Contáctanos directo",
    telegramCta: "Escribir por Telegram",
    whatsappCta: "Escribir por WhatsApp",
    emailCta: "Enviar un correo",
  },
  lead: {
    title: "Antes de irte: llévate la guía inicial",
    subtitle:
      "Déjanos tus datos y te enviamos la comparación de productos más una checklist de configuración. Sin spam, te puedes dar de baja cuando quieras.",
    name: "Nombre",
    email: "Correo",
    phone: "Teléfono / WhatsApp",
    submit: "Enviarme la guía",
    sending: "Enviando…",
    success: "¡Listo! Revisa tu bandeja de entrada en unos minutos.",
    error: "No se pudo enviar. Inténtalo de nuevo.",
    dismiss: "No, gracias",
    privacy:
      "Guardamos tus datos para contactarte sobre nuestros productos. Consulta nuestra Política de Privacidad.",
  },
  checkout: {
    success: {
      title: "Pago recibido",
      subtitle:
        "Gracias. Ya registramos tu compra. Revisa tu correo: ahí te vamos a enviar las credenciales, el manual y los siguientes pasos.",
      cta: "Volver al inicio",
      note: "¿No tuviste novedades en unas horas? Contáctanos y lo resolvemos.",
    },
    cancel: {
      title: "Checkout cancelado",
      subtitle:
        "No se realizó ningún cargo. Puedes retomar donde lo dejaste cuando quieras.",
      cta: "Volver a productos",
    },
    priceChoice: {
      title: "Elegí tu precio",
      subtitle: "El precio con Exness se confirma cuando verifiquemos tu cuenta.",
      standardLabel: "Sin link de Exness",
      exnessLabel: "Con link de Exness",
      exnessBadge: "Recomendado",
      savingsPrefix: "Ahorrás",
    },
    vpsWarning: {
      title: "Antes de seguir sin Exness…",
      body: "Para que el bot opere las 24 horas, necesita un VPS corriendo todo el tiempo. Sin VPS, solo funciona mientras tu PC y MT5 estén encendidos. Si abrís tu cuenta con nuestro link de Exness, el VPS es gratis a partir de $2.000 de depósito — además del precio más bajo del bot.",
      ctaExness: "Prefiero el link de Exness",
      ctaContinue: "Entiendo, continuar sin Exness",
    },
    dialog: {
      title: "Elige cómo pagar",
      subtitle: "Completá tus datos y elegí cómo pagar.",
      detailsTitle: "Tus datos",
      cryptoNetworkLabel: "Elegí la red",
      card: "Pagar con tarjeta",
      cardHint: "Visa, Mastercard, Amex vía Stripe",
      crypto: "Pagar con cripto",
      cryptoHint: "Solo USDT — red TRC20 o BEP20",
      mercadopago: "Mercado Pago",
      mercadopagoHint: "Tarjeta, cuotas y efectivo en Argentina",
      dlocal: "dLocal",
      dlocalHint: "Tarjeta local para más países de Latinoamérica",
      continue: "Continuar",
      processing: "Redirigiendo…",
      error: "No se pudo iniciar el checkout. Inténtalo de nuevo.",
      missingFields: "Completá todos los campos para continuar.",
    },
    accountForm: {
      title: "Últimos datos para activar tu bot",
      subtitle: "Con esto lo compilamos y lo activamos en tu cuenta.",
      accountNumber: "Número de cuenta",
      server: "Servidor (ej: Exness-MT5Real3)",
      submit: "Enviar datos",
      sending: "Enviando…",
      success: "¡Listo! Ya tenemos todo para preparar tu bot.",
      error: "No se pudo enviar. Inténtalo de nuevo o escribinos.",
    },
    strategyForm: {
      title: "Contanos cómo operás",
      subtitle:
        "Con esto armamos tu bot. Después lo revisamos punto por punto en una reunión.",
      asset: "Instrumento / activo",
      timeframe: "Marco temporal (timeframe)",
      entryRules: "Reglas de entrada",
      exitRules: "Reglas de salida",
      riskManagement: "Gestión de riesgo",
      tools: "Indicadores o herramientas que usás",
      notes: "Notas adicionales (opcional)",
      submit: "Enviar detalles",
      sending: "Enviando…",
      success: "¡Listo! Te contactamos para coordinar la reunión de revisión.",
      error: "No se pudo enviar. Inténtalo de nuevo o escribinos.",
    },
    exness: {
      gateTitle: "¿Ya tenés cuenta en Exness?",
      gateSubtitle: "Para confirmar el precio con Exness necesitamos verificar tu cuenta.",
      hasAccount: "Ya tengo cuenta en Exness",
      noAccount: "No tengo cuenta en Exness",

      optionsTitle: "¿Cómo preferís continuar?",
      switchOption: "Cambiar de partner en mi cuenta actual",
      switchOptionHint: "Puede demorar hasta 72 horas en confirmarse.",
      newOption: "Crear una cuenta nueva con otro correo",
      newOptionHint:
        "Más rápido y simple. Podés tener más de una cuenta en Exness, pero no con el mismo correo.",

      switchTitle: "Cómo cambiar de partner",
      switchStep1: "Ingresá a tu cuenta de Exness",
      switchStep2: "Andá al chat en línea",
      switchStep3: "Escribí \"cambio de partner\"",
      switchStep4: "Completá el formulario que te pida — usá este link cuando te lo solicite:",
      switchDone: "Ya lo hice",
      switchNote:
        "Este cambio puede demorar hasta 72 horas en confirmarse. Te avisamos por correo apenas esté.",

      newTitle: "Creá tu cuenta de Exness",
      newBody:
        "Hacé clic para registrarte con nuestro link. Usá un correo que no hayas usado antes en Exness.",
      newCta: "Abrir mi cuenta de Exness",
      newDone: "Ya me registré",

      linkLabel: "Tu link de referido",
      copy: "Copiar",
      copied: "¡Copiado!",

      emailTitle: "¿Con qué correo?",
      emailSubtitle: "Es el correo de tu cuenta de Exness — puede ser distinto al que pusiste antes.",
      emailLabel: "Correo de tu cuenta de Exness",
      submit: "Enviar y verificar",
      sending: "Enviando…",
      submitError: "No se pudo enviar. Intentá de nuevo.",

      pendingTitle: "¡Listo! Estamos verificando tu cuenta",
      pendingBody:
        "En cuanto confirmemos que tu cuenta quedó bajo nuestro link, te mandamos un correo con el link para completar la compra al precio con Exness.",
      pendingCta: "Entendido",
      verifiedBanner: "Verificamos tu cuenta de Exness — ya podés pagar al precio con Exness.",
    },
  },
  footer: {
    tagline:
      "Bots de trading automatizados, indicadores profesionales y señales de pago único.",
    productsTitle: "Productos",
    companyTitle: "Compañía",
    legalTitle: "Legal",
    rights: "Todos los derechos reservados.",
    riskTitle: "Advertencia de riesgo",
    riskBody:
      "Operar divisas, CFD y otros productos apalancados conlleva un alto nivel de riesgo y puede ocasionar la pérdida de todo tu capital invertido. El rendimiento pasado no es indicativo de resultados futuros. Nada en este sitio constituye asesoramiento financiero. Opera solo con capital que puedas permitirte perder.",
    links: {
      bots: "Bots",
      indicators: "Indicadores",
      signals: "Señales",
      whyExness: "Por qué Exness",
      referrals: "Compartí y ganá",
      contact: "Contacto",
      terms: "Términos del Servicio",
      privacy: "Política de Privacidad",
      refund: "Política de Reembolsos",
    },
  },
  legal: {
    updatedLabel: "Última actualización",
    terms: {
      title: "Términos del Servicio",
      updated: "2026-01-01",
      sections: [
        {
          heading: "1. Aceptación",
          paragraphs: [
            "Al acceder a este sitio web y comprar cualquier producto aceptas estos Términos del Servicio. Si no estás de acuerdo, no uses el sitio.",
          ],
        },
        {
          heading: "2. Productos",
          paragraphs: [
            "Vendemos software de trading automatizado (\"bots\"), indicadores técnicos y una suscripción a un canal privado de señales. Los bots e indicadores se licencian para tu uso personal en la cantidad de cuentas indicada en la compra. Queda prohibida la redistribución, reventa o descompilación.",
            "La suscripción de señales otorga acceso a un canal privado durante el período pagado. El acceso se habilita y se retira automáticamente según el estado de la suscripción.",
          ],
        },
        {
          heading: "3. Sin asesoramiento financiero",
          paragraphs: [
            "Todo el contenido y los productos se ofrecen con fines educativos e informativos y no constituyen asesoramiento financiero, de inversión ni de trading. Eres el único responsable de tus decisiones de trading.",
          ],
        },
        {
          heading: "4. Divulgación de riesgo",
          paragraphs: [
            "Operar productos apalancados conlleva un alto riesgo de pérdida. Podrías perder más que tu depósito inicial según tu bróker. El rendimiento pasado o simulado no garantiza resultados futuros.",
          ],
        },
        {
          heading: "5. Brókers de terceros",
          paragraphs: [
            "Podemos referirte a brókers de terceros como Exness y recibir una comisión. No somos responsables de los actos u omisiones de ningún bróker. Tu relación con un bróker se rige por los términos de ese bróker.",
          ],
        },
        {
          heading: "6. Pagos",
          paragraphs: [
            "Los pagos son procesados por proveedores externos (Stripe para tarjetas, un procesador de pagos cripto para criptomonedas). No almacenamos datos de tarjetas.",
          ],
        },
        {
          heading: "7. Limitación de responsabilidad",
          paragraphs: [
            "En la máxima medida permitida por la ley, no somos responsables de pérdidas de trading, lucro cesante ni daños indirectos derivados del uso de nuestros productos.",
          ],
        },
        {
          heading: "8. Contacto",
          paragraphs: [
            "Las consultas sobre estos términos pueden enviarse a través de la página de contacto.",
          ],
        },
      ],
    },
    privacy: {
      title: "Política de Privacidad",
      updated: "2026-01-01",
      sections: [
        {
          heading: "1. Datos que recopilamos",
          paragraphs: [
            "Recopilamos el nombre, el correo electrónico y el número de teléfono que envías a través de nuestros formularios, y datos técnicos como tu ubicación aproximada (país) y preferencia de idioma. Al comprar, nuestros procesadores de pago recopilan los datos necesarios para procesar la transacción.",
          ],
        },
        {
          heading: "2. Cómo los usamos",
          paragraphs: [
            "Para entregar productos y accesos, brindar soporte y enviarte información y marketing sobre nuestros productos por correo. Usamos una plataforma de marketing/CRM (systeme.io) para gestionar esta comunicación.",
          ],
        },
        {
          heading: "3. Base legal y consentimiento",
          paragraphs: [
            "Cuando corresponde, nos basamos en tu consentimiento, que puedes retirar en cualquier momento dándote de baja o contactándonos.",
          ],
        },
        {
          heading: "4. Compartición",
          paragraphs: [
            "Compartimos datos solo con proveedores que nos ayudan a operar el servicio: procesadores de pago, la plataforma de CRM/correo, el hosting (Vercel) y la mensajería (Telegram) cuando corresponde. No vendemos tus datos.",
          ],
        },
        {
          heading: "5. Conservación",
          paragraphs: [
            "Conservamos tus datos el tiempo necesario para prestar el servicio y cumplir obligaciones legales, y luego los eliminamos o anonimizamos.",
          ],
        },
        {
          heading: "6. Tus derechos",
          paragraphs: [
            "Puedes solicitar acceso, corrección o eliminación de tus datos, y oponerte al marketing, contactándonos.",
          ],
        },
        {
          heading: "7. Cookies",
          paragraphs: [
            "Usamos cookies esenciales para el manejo de idioma y sesión. Cualquier cookie de analítica o marketing que se agregue se informará aquí.",
          ],
        },
      ],
    },
    refund: {
      title: "Política de Reembolsos",
      updated: "2026-01-01",
      sections: [
        {
          heading: "Productos digitales (bots e indicadores)",
          paragraphs: [
            "Dado que los bots e indicadores son bienes digitales de entrega inmediata, todas las ventas son finales una vez entregados los archivos o la licencia. Si un producto no se instala o no funciona como se describe y no podemos resolverlo, contáctanos dentro de los 7 días de la compra y evaluaremos un reembolso caso por caso.",
          ],
        },
        {
          heading: "Suscripción de señales",
          paragraphs: [
            "Puedes cancelar la suscripción de señales en cualquier momento para detener futuros cobros. Los pagos ya realizados por el período actual no son reembolsables. No hay reembolsos parciales por días no usados.",
          ],
        },
        {
          heading: "Pagos con cripto",
          paragraphs: [
            "Cuando se aprueba un reembolso de un pago en cripto, se devuelve en la misma criptomoneda por el monto recibido, menos las comisiones de red.",
          ],
        },
        {
          heading: "Cómo solicitarlo",
          paragraphs: [
            "Envía los datos de tu pedido a través de la página de contacto con una descripción del problema.",
          ],
        },
      ],
    },
  },
  notFound: {
    title: "Página no encontrada",
    subtitle: "La página que buscabas no existe o fue movida.",
    cta: "Ir al inicio",
  },
};
