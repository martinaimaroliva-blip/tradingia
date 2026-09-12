import type { Locale } from "@/i18n/config";

export type Localized = Record<Locale, string>;
export type LocalizedList = Record<Locale, string[]>;

export type ProductKind = "bot" | "indicator";

export interface Product {
  slug: string;
  kind: ProductKind;
  /** Brand name — locale neutral. */
  name: string;
  /** Instrument code, e.g. XAUUSD. Use "MULTI" for multi-asset tools. */
  asset: string;
  assetLabel: Localized;
  timeframe: string;
  platform: string;
  strategyTag: Localized;
  tagline: Localized;
  description: Localized;
  features: LocalizedList;
  howItWorks: LocalizedList;
  priceUSD: number;
  /** Discounted price when the customer opens an Exness account via our referral. */
  exnessPriceUSD: number;
  badge?: "popular" | "new" | "custom";
  /** True for bespoke products (e.g. the custom bot) that need a conversation
   * before delivery — the buy flow routes to contact instead of checkout. */
  requiresConsultation?: boolean;
}

export interface SignalPlan {
  slug: string;
  name: Localized;
  priceUSD: number;
  interval: "month";
  highlight?: boolean;
  tagline: Localized;
  features: LocalizedList;
}

export const bots: Product[] = [
  {
    slug: "ziza",
    kind: "bot",
    name: "ZIZA",
    asset: "XAUUSD",
    assetLabel: { es: "Oro (XAU/USD)", en: "Gold (XAU/USD)", ar: "الذهب (XAU/USD)" },
    timeframe: "M5",
    platform: "MT4 / MT5",
    strategyTag: {
      es: "Scalping de ruptura",
      en: "Breakout scalping",
      ar: "سكالبينج الاختراق",
    },
    tagline: {
      es: "Scalping intradía sobre oro en momentos de alta volatilidad.",
      en: "Intraday gold scalping during high-volatility windows.",
      ar: "سكالبينج ذهب يومي خلال نوافذ التقلب العالي.",
    },
    description: {
      es: "ZIZA opera exclusivamente XAU/USD en M5, buscando rupturas de rango durante las sesiones de Londres y Nueva York. Filtra las entradas con volatilidad (ATR) y un rango de sesión mínimo, y protege cada operación con stop fijo y gestión a break-even.",
      en: "ZIZA trades XAU/USD only, on M5, hunting range breakouts during the London and New York sessions. It filters entries with volatility (ATR) and a minimum session range, and protects every trade with a fixed stop and break-even management.",
      ar: "يتداول ZIZA زوج XAU/USD فقط على فريم M5، باحثاً عن اختراقات النطاق خلال جلستَي لندن ونيويورك. يُرشّح الدخول عبر التقلب (ATR) وحد أدنى لنطاق الجلسة، ويحمي كل صفقة بوقف ثابت وإدارة نقطة التعادل.",
    },
    features: {
      es: [
        "Par único: XAU/USD en M5",
        "Sesiones configurables (Londres / Nueva York)",
        "Filtro de volatilidad ATR y rango mínimo de sesión",
        "Stop-loss fijo + paso automático a break-even",
        "Límite de operaciones por día y por sesión",
        "Preajustes conservador / estándar / agresivo",
      ],
      en: [
        "Single pair: XAU/USD on M5",
        "Configurable sessions (London / New York)",
        "ATR volatility filter and minimum session range",
        "Fixed stop-loss + automatic move to break-even",
        "Trades-per-day and per-session cap",
        "Conservative / standard / aggressive presets",
      ],
      ar: [
        "زوج واحد: XAU/USD على M5",
        "جلسات قابلة للتهيئة (لندن / نيويورك)",
        "مرشّح تقلب ATR وحد أدنى لنطاق الجلسة",
        "وقف خسارة ثابت + نقل تلقائي لنقطة التعادل",
        "حد لعدد الصفقات يومياً ولكل جلسة",
        "إعدادات مسبقة: متحفظ / قياسي / عدواني",
      ],
    },
    howItWorks: {
      es: [
        "Al abrir la sesión, el bot mide el rango de apertura y calcula niveles de ruptura.",
        "Si el precio rompe con volatilidad suficiente, entra a favor de la ruptura con stop fijo.",
        "Al alcanzar el primer objetivo, mueve el stop a break-even y deja correr el resto.",
        "Cierra todo antes del fin de sesión o al tocar el objetivo final.",
      ],
      en: [
        "At the session open the bot measures the opening range and computes breakout levels.",
        "If price breaks with enough volatility, it enters in the breakout direction with a fixed stop.",
        "On the first target it moves the stop to break-even and lets the rest run.",
        "It closes everything before the session end or when the final target is hit.",
      ],
      ar: [
        "عند افتتاح الجلسة يقيس الروبوت نطاق الافتتاح ويحسب مستويات الاختراق.",
        "إذا اخترق السعر بتقلب كافٍ، يدخل في اتجاه الاختراق بوقف ثابت.",
        "عند الهدف الأول ينقل الوقف إلى نقطة التعادل ويترك الباقي يعمل.",
        "يغلق كل شيء قبل نهاية الجلسة أو عند بلوغ الهدف النهائي.",
      ],
    },
    priceUSD: 7500,
    exnessPriceUSD: 5000,
    badge: "popular",
  },
  {
    slug: "paramedica",
    kind: "bot",
    name: "Paramédica",
    asset: "MULTI",
    assetLabel: {
      es: "Cuentas con hedge o pérdidas prolongadas",
      en: "Hedged or drawn-down accounts",
      ar: "حسابات بها تحوّط أو خسائر متواصلة",
    },
    timeframe: "Según la cuenta",
    platform: "MT4 / MT5",
    strategyTag: {
      es: "Gestión de cuentas en riesgo",
      en: "At-risk account management",
      ar: "إدارة الحسابات المعرّضة للخطر",
    },
    tagline: {
      es: "Rescata cuentas atrapadas en hedge o en una racha de pérdidas y las guía a una salida ordenada.",
      en: "Rescues accounts trapped in a hedge or a losing streak and guides them to an orderly exit.",
      ar: "ينقذ الحسابات العالقة في تحوّط أو سلسلة خسائر ويقودها إلى خروج منظّم.",
    },
    description: {
      es: "Paramédica está pensado para cuentas en emergencia: posiciones cubiertas (hedge) que no saben cómo cerrar, o una racha de pérdidas donde cerrar todo de golpe implicaría asumir un quebranto grande. Analiza la exposición abierta y aplica un plan de gestión progresivo para reducir el riesgo paso a paso hasta estabilizar la cuenta.",
      en: "Paramédica is built for accounts in trouble: hedged positions with no clear way out, or a losing streak where closing everything at once would mean taking a large hit in one go. It analyzes the open exposure and applies a step-by-step management plan to bring the risk down until the account is stable.",
      ar: "صُمِّم Paramédica للحسابات في أزمة: صفقات تحوّط (hedge) لا توجد طريقة واضحة للخروج منها، أو سلسلة خسائر يعني إغلاقها دفعة واحدة تحمّل خسارة كبيرة فورية. يحلّل التعرّض المفتوح ويطبّق خطة إدارة تدريجية لخفض المخاطرة خطوة بخطوة حتى يستقر الحساب.",
    },
    features: {
      es: [
        "Diseñado para cuentas con posiciones en hedge",
        "También sirve para cuentas con pérdidas prolongadas sin plan de salida",
        "Analiza la exposición abierta antes de tomar cualquier acción",
        "Cierre progresivo, no de golpe, para no forzar la pérdida",
        "Límites de riesgo configurables durante todo el proceso",
      ],
      en: [
        "Built for accounts with hedged positions",
        "Also works for accounts with a prolonged losing streak and no exit plan",
        "Analyzes the open exposure before taking any action",
        "Closes positions progressively, not all at once, to avoid forcing the loss",
        "Configurable risk limits throughout the process",
      ],
      ar: [
        "مصمَّم للحسابات ذات الصفقات المتحوّطة (hedge)",
        "يصلح أيضاً للحسابات ذات الخسائر المتواصلة بلا خطة خروج",
        "يحلّل التعرّض المفتوح قبل اتخاذ أي إجراء",
        "إغلاق تدريجي وليس دفعة واحدة، لتفادي فرض الخسارة",
        "حدود مخاطرة قابلة للضبط طوال العملية",
      ],
    },
    howItWorks: {
      es: [
        "Conectás la cuenta con las posiciones atrapadas.",
        "El bot analiza el hedge o la racha de pérdidas y arma un plan de salida.",
        "Ejecuta el cierre de forma progresiva, respetando los límites de riesgo definidos.",
        "Te mantiene informado hasta que la cuenta queda estabilizada.",
      ],
      en: [
        "Connect the account with the trapped positions.",
        "The bot analyzes the hedge or losing streak and builds an exit plan.",
        "It closes positions progressively, respecting the risk limits you set.",
        "It keeps you updated until the account is stable.",
      ],
      ar: [
        "اربط الحساب الذي يحتوي على الصفقات العالقة.",
        "يحلّل الروبوت التحوّط أو سلسلة الخسائر ويضع خطة خروج.",
        "ينفّذ الإغلاق تدريجياً وفق حدود المخاطرة التي حددتها.",
        "يبقيك على اطّلاع حتى يستقر الحساب.",
      ],
    },
    priceUSD: 1999,
    exnessPriceUSD: 1599,
  },
  {
    slug: "btc-bot",
    kind: "bot",
    name: "Bot BTCUSD",
    asset: "BTCUSD",
    assetLabel: { es: "Bitcoin (BTC/USD)", en: "Bitcoin (BTC/USD)", ar: "بيتكوين (BTC/USD)" },
    timeframe: "A confirmar en el lanzamiento",
    platform: "MT4 / MT5",
    strategyTag: {
      es: "Ficha técnica en preparación",
      en: "Spec sheet in progress",
      ar: "الملف الفني قيد الإعداد",
    },
    tagline: {
      es: "Automatización pensada para la volatilidad de Bitcoin. Ficha completa muy pronto.",
      en: "Automation built for Bitcoin's volatility. Full spec sheet coming soon.",
      ar: "أتمتة مصمّمة لتقلّب البيتكوين. الملف الفني الكامل قريباً.",
    },
    description: {
      es: "Estamos terminando de cerrar la estrategia de este bot para BTC/USD. Podés reservarlo ahora al precio de lanzamiento; apenas esté lista la versión final vas a recibir la ficha técnica completa, el archivo y el manual.",
      en: "We're finalizing the strategy for this BTC/USD bot. You can reserve it now at the launch price; as soon as the final version is ready you'll get the full spec sheet, the file and the manual.",
      ar: "نحن بصدد الانتهاء من استراتيجية هذا الروبوت لزوج BTC/USD. يمكنك حجزه الآن بسعر الإطلاق؛ وبمجرد جاهزية النسخة النهائية ستحصل على الملف الفني الكامل والملف والدليل.",
    },
    features: {
      es: ["Enfocado en BTC/USD", "Gestión de riesgo configurable", "Incluye manual y soporte al momento de la entrega"],
      en: ["Focused on BTC/USD", "Configurable risk management", "Manual and support included on delivery"],
      ar: ["مخصَّص لزوج BTC/USD", "إدارة مخاطر قابلة للضبط", "يشمل الدليل والدعم عند التسليم"],
    },
    howItWorks: {
      es: [
        "Reservás el bot al precio de lanzamiento.",
        "Te avisamos apenas se libera la versión con la ficha completa.",
        "Recibís el archivo, la licencia y el manual por correo.",
      ],
      en: [
        "Reserve the bot at the launch price.",
        "We'll notify you as soon as the full version ships.",
        "You receive the file, license and manual by email.",
      ],
      ar: [
        "احجز الروبوت بسعر الإطلاق.",
        "سنخبرك بمجرد إطلاق النسخة الكاملة.",
        "تستلم الملف والترخيص والدليل عبر البريد الإلكتروني.",
      ],
    },
    priceUSD: 1999,
    exnessPriceUSD: 1500,
    badge: "new",
  },
  {
    slug: "eur-bot",
    kind: "bot",
    name: "Bot EURUSD",
    asset: "EURUSD",
    assetLabel: {
      es: "Euro / Dólar (EUR/USD)",
      en: "Euro / US Dollar (EUR/USD)",
      ar: "يورو/دولار (EUR/USD)",
    },
    timeframe: "A confirmar en el lanzamiento",
    platform: "MT4 / MT5",
    strategyTag: {
      es: "Ficha técnica en preparación",
      en: "Spec sheet in progress",
      ar: "الملف الفني قيد الإعداد",
    },
    tagline: {
      es: "Automatización para uno de los pares más operados del mundo. Ficha completa muy pronto.",
      en: "Automation for one of the most traded pairs in the world. Full spec sheet coming soon.",
      ar: "أتمتة لأحد أكثر الأزواج تداولاً في العالم. الملف الفني الكامل قريباً.",
    },
    description: {
      es: "Estamos terminando de cerrar la estrategia de este bot para EUR/USD. Podés reservarlo ahora al precio de lanzamiento; apenas esté lista la versión final vas a recibir la ficha técnica completa, el archivo y el manual.",
      en: "We're finalizing the strategy for this EUR/USD bot. You can reserve it now at the launch price; as soon as the final version is ready you'll get the full spec sheet, the file and the manual.",
      ar: "نحن بصدد الانتهاء من استراتيجية هذا الروبوت لزوج EUR/USD. يمكنك حجزه الآن بسعر الإطلاق؛ وبمجرد جاهزية النسخة النهائية ستحصل على الملف الفني الكامل والملف والدليل.",
    },
    features: {
      es: ["Enfocado en EUR/USD", "Gestión de riesgo configurable", "Incluye manual y soporte al momento de la entrega"],
      en: ["Focused on EUR/USD", "Configurable risk management", "Manual and support included on delivery"],
      ar: ["مخصَّص لزوج EUR/USD", "إدارة مخاطر قابلة للضبط", "يشمل الدليل والدعم عند التسليم"],
    },
    howItWorks: {
      es: [
        "Reservás el bot al precio de lanzamiento.",
        "Te avisamos apenas se libera la versión con la ficha completa.",
        "Recibís el archivo, la licencia y el manual por correo.",
      ],
      en: [
        "Reserve the bot at the launch price.",
        "We'll notify you as soon as the full version ships.",
        "You receive the file, license and manual by email.",
      ],
      ar: [
        "احجز الروبوت بسعر الإطلاق.",
        "سنخبرك بمجرد إطلاق النسخة الكاملة.",
        "تستلم الملف والترخيص والدليل عبر البريد الإلكتروني.",
      ],
    },
    priceUSD: 1999,
    exnessPriceUSD: 1500,
    badge: "new",
  },
  {
    slug: "custom-bot",
    kind: "bot",
    name: "Custom Bot",
    asset: "CUSTOM",
    assetLabel: {
      es: "El instrumento que elijas",
      en: "Any instrument you choose",
      ar: "أي أداة تختارها",
    },
    timeframe: "A tu medida",
    platform: "MT4 / MT5",
    strategyTag: {
      es: "Tu propia estrategia, automatizada",
      en: "Your own strategy, automated",
      ar: "استراتيجيتك، مؤتمتة",
    },
    tagline: {
      es: "Arma tu bot con tu estrategia personal.",
      en: "Build your bot around your own strategy.",
      ar: "اصنع روبوتك الخاص باستراتيجيتك الشخصية.",
    },
    description: {
      es: "Toda estrategia puede automatizarse. Nos contás tus reglas de entrada, salida y gestión de riesgo — la tuya, tal cual la operás — y las convertimos en un Expert Advisor a medida. Se entrega igual que cualquier otro bot: con licencia y manual, listo para correr en tu cuenta.",
      en: "Any strategy can be automated. Tell us your entry, exit and risk rules — exactly how you trade — and we turn them into a custom Expert Advisor. It's delivered like any other bot: with a license and a manual, ready to run on your account.",
      ar: "يمكن أتمتة أي استراتيجية. أخبرنا بقواعدك للدخول والخروج وإدارة المخاطر — تماماً كما تتداول أنت — ونحوّلها إلى مستشار خبير (EA) مصمَّم خصيصاً لك. يُسلَّم مثل أي روبوت آخر: بترخيص ودليل استخدام، جاهزاً للعمل على حسابك.",
    },
    features: {
      es: [
        "Basado 100% en tu propia estrategia",
        "Definimos las reglas junto a vos antes de programarlo",
        "Incluye una ronda de ajustes después de la primera entrega",
        "Licencia y manual de uso incluidos",
        "Sin límite de instrumento: se programa para el activo que elijas",
      ],
      en: [
        "Based 100% on your own strategy",
        "We define the rules together with you before building it",
        "Includes one round of adjustments after the first delivery",
        "License and user manual included",
        "No instrument limit — built for whichever asset you choose",
      ],
      ar: [
        "يعتمد 100% على استراتيجيتك الخاصة",
        "نحدّد القواعد معك قبل البرمجة",
        "يشمل جولة تعديل واحدة بعد التسليم الأول",
        "يشمل الترخيص ودليل الاستخدام",
        "بلا قيد على الأداة — يُبرمَج للأصل الذي تختاره",
      ],
    },
    howItWorks: {
      es: [
        "Nos contás tu estrategia: reglas de entrada, salida y gestión de riesgo.",
        "La desarrollamos y la probamos antes de entregarla.",
        "Te la entregamos con licencia y manual, lista para correr en tu cuenta.",
      ],
      en: [
        "Tell us your strategy: entry, exit and risk rules.",
        "We build and test it before handing it over.",
        "You get it with a license and manual, ready to run on your account.",
      ],
      ar: [
        "أخبرنا باستراتيجيتك: قواعد الدخول والخروج وإدارة المخاطر.",
        "نطوّرها ونختبرها قبل تسليمها.",
        "تستلمها مع الترخيص والدليل جاهزة للعمل على حسابك.",
      ],
    },
    priceUSD: 3500,
    exnessPriceUSD: 3500,
    badge: "custom",
    requiresConsultation: true,
  },
];

export const indicators: Product[] = [
  {
    slug: "momentum-map",
    kind: "indicator",
    name: "Momentum Map",
    asset: "MULTI",
    assetLabel: {
      es: "Multi-activo",
      en: "Multi-asset",
      ar: "متعدد الأصول",
    },
    timeframe: "M1–D1",
    platform: "MT4 / MT5",
    strategyTag: {
      es: "Confluencia de momentum",
      en: "Momentum confluence",
      ar: "تقارب الزخم",
    },
    tagline: {
      es: "Un panel de momentum multi-temporal para cronometrar entradas.",
      en: "A multi-timeframe momentum panel for timing entries.",
      ar: "لوحة زخم متعددة الأطر الزمنية لتوقيت الدخول.",
    },
    description: {
      es: "Momentum Map combina RSI, MACD y fuerza de tendencia en un único panel que muestra el alineamiento entre temporalidades. Cuando varias temporalidades coinciden, marca la ventana de mayor probabilidad. No repinta.",
      en: "Momentum Map blends RSI, MACD and trend strength into one panel that shows alignment across timeframes. When several timeframes agree, it flags the highest-probability window. It does not repaint.",
      ar: "يمزج Momentum Map بين RSI و MACD وقوة الاتجاه في لوحة واحدة تُظهر التوافق عبر الأطر الزمنية. عند اتفاق عدة أطر، يُبرز النافذة الأعلى احتمالاً. لا يعيد الرسم.",
    },
    features: {
      es: [
        "Panel de 6 temporalidades en una sola vista",
        "RSI + MACD + fuerza de tendencia combinados",
        "Alertas push, email y sonido en confluencia",
        "Sin repintado: las señales quedan fijas al cierre",
        "Compatible con cualquier símbolo de tu bróker",
      ],
      en: [
        "6-timeframe panel in a single view",
        "Combined RSI + MACD + trend strength",
        "Push, email and sound alerts on confluence",
        "No repainting: signals lock on close",
        "Works on any symbol your broker offers",
      ],
      ar: [
        "لوحة 6 أطر زمنية في عرض واحد",
        "دمج RSI + MACD + قوة الاتجاه",
        "تنبيهات فورية وبريد وصوت عند التقارب",
        "دون إعادة رسم: تثبُت الإشارات عند الإغلاق",
        "يعمل على أي رمز يوفّره وسيطك",
      ],
    },
    howItWorks: {
      es: [
        "Añade el indicador a cualquier gráfico; el panel aparece en una esquina.",
        "Cada fila es una temporalidad; el color indica momentum alcista o bajista.",
        "Busca operaciones cuando 4 o más filas coinciden en dirección.",
        "Usa tu propia gestión de riesgo para entradas y salidas.",
      ],
      en: [
        "Add the indicator to any chart; the panel appears in a corner.",
        "Each row is a timeframe; colour shows bullish or bearish momentum.",
        "Look for trades when 4+ rows agree on direction.",
        "Use your own risk management for entries and exits.",
      ],
      ar: [
        "أضف المؤشر إلى أي رسم بياني؛ تظهر اللوحة في إحدى الزوايا.",
        "كل صف إطار زمني؛ اللون يوضّح زخماً صاعداً أو هابطاً.",
        "ابحث عن صفقات عندما تتفق 4 صفوف أو أكثر على الاتجاه.",
        "استخدم إدارة المخاطر الخاصة بك للدخول والخروج.",
      ],
    },
    priceUSD: 89,
    exnessPriceUSD: 69,
  },
  {
    slug: "liquidity-zones",
    kind: "indicator",
    name: "Liquidity Zones",
    asset: "MULTI",
    assetLabel: { es: "Multi-activo", en: "Multi-asset", ar: "متعدد الأصول" },
    timeframe: "M5–H4",
    platform: "MT4 / MT5",
    strategyTag: {
      es: "Oferta y demanda",
      en: "Supply & demand",
      ar: "العرض والطلب",
    },
    tagline: {
      es: "Dibuja zonas institucionales de oferta, demanda y bloques de órdenes.",
      en: "Plots institutional supply, demand and order-block zones.",
      ar: "يرسم مناطق العرض والطلب المؤسسية وكتل الأوامر.",
    },
    description: {
      es: "Liquidity Zones marca automáticamente zonas de oferta y demanda, bloques de órdenes y barridos de liquidez. Prioriza las zonas por reacción previa y las elimina cuando se consumen, manteniendo el gráfico limpio.",
      en: "Liquidity Zones automatically marks supply and demand zones, order blocks and liquidity sweeps. It ranks zones by prior reaction and removes them once consumed, keeping the chart clean.",
      ar: "يحدّد Liquidity Zones تلقائياً مناطق العرض والطلب وكتل الأوامر واكتساح السيولة. يرتّب المناطق حسب التفاعل السابق ويزيلها بعد استهلاكها، مع إبقاء الرسم البياني نظيفاً.",
    },
    features: {
      es: [
        "Zonas de oferta/demanda y bloques de órdenes automáticos",
        "Marcado de barridos de liquidez y máximos/mínimos iguales",
        "Ranking de zonas por fuerza de reacción",
        "Alertas al entrar en una zona de alta probabilidad",
        "Multi-temporalidad: zonas de H4 visibles en M5",
      ],
      en: [
        "Automatic supply/demand zones and order blocks",
        "Liquidity-sweep and equal-highs/lows marking",
        "Zone ranking by reaction strength",
        "Alerts when price enters a high-probability zone",
        "Multi-timeframe: H4 zones visible on M5",
      ],
      ar: [
        "مناطق عرض/طلب وكتل أوامر تلقائية",
        "تحديد اكتساح السيولة والقمم/القيعان المتساوية",
        "ترتيب المناطق حسب قوة التفاعل",
        "تنبيهات عند دخول السعر منطقة عالية الاحتمال",
        "متعدد الأطر: مناطق H4 مرئية على M5",
      ],
    },
    howItWorks: {
      es: [
        "El indicador escanea el histórico y dibuja las zonas vigentes.",
        "Espera a que el precio regrese a una zona bien calificada.",
        "Busca confirmación (rechazo, cambio de estructura) antes de entrar.",
        "La zona se atenúa o desaparece cuando el precio la atraviesa.",
      ],
      en: [
        "The indicator scans history and draws the live zones.",
        "Wait for price to return to a well-rated zone.",
        "Look for confirmation (rejection, structure shift) before entering.",
        "The zone fades or disappears once price trades through it.",
      ],
      ar: [
        "يمسح المؤشر السجل التاريخي ويرسم المناطق الفعّالة.",
        "انتظر عودة السعر إلى منطقة ذات تقييم جيد.",
        "ابحث عن تأكيد (رفض، تغيّر بنية) قبل الدخول.",
        "تخفت المنطقة أو تختفي بمجرد اختراق السعر لها.",
      ],
    },
    priceUSD: 119,
    exnessPriceUSD: 89,
    badge: "popular",
  },
  {
    slug: "session-sniper",
    kind: "indicator",
    name: "Session Sniper",
    asset: "MULTI",
    assetLabel: { es: "Multi-activo", en: "Multi-asset", ar: "متعدد الأصول" },
    timeframe: "M1–M30",
    platform: "MT4 / MT5",
    strategyTag: {
      es: "Rangos de sesión",
      en: "Session ranges",
      ar: "نطاقات الجلسة",
    },
    tagline: {
      es: "Rangos de Asia, Londres y Nueva York con sus killzones.",
      en: "Asia, London and New York ranges with their killzones.",
      ar: "نطاقات آسيا ولندن ونيويورك مع أوقات ذروتها.",
    },
    description: {
      es: "Session Sniper dibuja el rango de cada sesión, sus máximos y mínimos, y resalta las killzones donde suele producirse el movimiento. Ideal para estrategias de ruptura de rango asiático y continuación de Londres.",
      en: "Session Sniper draws each session's range, its highs and lows, and highlights the killzones where the move usually happens. Ideal for Asian-range breakout and London continuation strategies.",
      ar: "يرسم Session Sniper نطاق كل جلسة وقممها وقيعانها، ويُبرز أوقات الذروة التي تحدث فيها الحركة عادةً. مثالي لاستراتيجيات اختراق النطاق الآسيوي واستمرار جلسة لندن.",
    },
    features: {
      es: [
        "Rangos de Asia / Londres / Nueva York con etiquetas",
        "Killzones configurables por horario",
        "Proyección de objetivos por extensión del rango",
        "Conversión automática a tu zona horaria",
        "Alertas de ruptura del rango de sesión",
      ],
      en: [
        "Asia / London / New York ranges with labels",
        "Time-configurable killzones",
        "Target projection from range extension",
        "Automatic conversion to your timezone",
        "Session-range breakout alerts",
      ],
      ar: [
        "نطاقات آسيا / لندن / نيويورك مع تسميات",
        "أوقات ذروة قابلة للتهيئة حسب التوقيت",
        "إسقاط أهداف عبر امتداد النطاق",
        "تحويل تلقائي إلى منطقتك الزمنية",
        "تنبيهات اختراق نطاق الجلسة",
      ],
    },
    howItWorks: {
      es: [
        "Configura tu zona horaria y los horarios de cada sesión.",
        "Observa el rango de Asia al abrir Londres.",
        "Opera la ruptura del rango en la killzone indicada.",
        "Usa las proyecciones como referencia de objetivos.",
      ],
      en: [
        "Set your timezone and each session's hours.",
        "Watch the Asian range as London opens.",
        "Trade the range breakout inside the highlighted killzone.",
        "Use the projections as target references.",
      ],
      ar: [
        "اضبط منطقتك الزمنية وساعات كل جلسة.",
        "راقب النطاق الآسيوي عند افتتاح لندن.",
        "تداول اختراق النطاق داخل وقت الذروة المُبرز.",
        "استخدم الإسقاطات كمراجع للأهداف.",
      ],
    },
    priceUSD: 79,
    exnessPriceUSD: 59,
  },
];

export const signalPlans: SignalPlan[] = [
  {
    slug: "core",
    name: { es: "Core", en: "Core", ar: "Core" },
    priceUSD: 39,
    interval: "month",
    tagline: {
      es: "Las señales esenciales y el canal de la comunidad.",
      en: "The essential signals and the community channel.",
      ar: "الإشارات الأساسية وقناة المجتمع.",
    },
    features: {
      es: [
        "Señales intradía con entrada, SL y TP",
        "Sesgo diario del mercado",
        "Canal privado de Telegram",
        "Actualizaciones de gestión de la operación",
      ],
      en: [
        "Intraday signals with entry, SL and TP",
        "Daily market bias",
        "Private Telegram channel",
        "Trade-management updates",
      ],
      ar: [
        "إشارات يومية مع الدخول ووقف الخسارة وجني الأرباح",
        "اتجاه السوق اليومي",
        "قناة تيليجرام خاصة",
        "تحديثات إدارة الصفقة",
      ],
    },
  },
  {
    slug: "pro",
    name: { es: "Pro", en: "Pro", ar: "Pro" },
    priceUSD: 79,
    interval: "month",
    highlight: true,
    tagline: {
      es: "Todo lo de Core más swing trading y soporte prioritario.",
      en: "Everything in Core plus swing trades and priority support.",
      ar: "كل ما في Core إضافةً إلى صفقات السوينج والدعم ذي الأولوية.",
    },
    features: {
      es: [
        "Todo lo incluido en Core",
        "Setups de swing (varios días)",
        "Directo semanal de análisis",
        "Soporte prioritario en el canal",
        "Registro de operaciones publicado",
      ],
      en: [
        "Everything in Core",
        "Swing setups (multi-day)",
        "Weekly analysis livestream",
        "Priority support in the channel",
        "Published trade log",
      ],
      ar: [
        "كل ما في Core",
        "صفقات سوينج (عدة أيام)",
        "بث تحليل أسبوعي مباشر",
        "دعم ذو أولوية في القناة",
        "سجل صفقات منشور",
      ],
    },
  },
  {
    slug: "vip",
    name: { es: "VIP", en: "VIP", ar: "VIP" },
    priceUSD: 199,
    interval: "month",
    tagline: {
      es: "Acompañamiento cercano y revisión mensual de tu operativa.",
      en: "Close guidance and a monthly review of your trading.",
      ar: "متابعة عن قرب ومراجعة شهرية لتداولك.",
    },
    features: {
      es: [
        "Todo lo incluido en Pro",
        "Llamada mensual 1:1 de revisión (Google Meet)",
        "Ajuste de gestión de riesgo a tu cuenta",
        "Acceso anticipado a nuevos bots e indicadores",
      ],
      en: [
        "Everything in Pro",
        "Monthly 1:1 review call (Google Meet)",
        "Risk management tuned to your account",
        "Early access to new bots and indicators",
      ],
      ar: [
        "كل ما في Pro",
        "مكالمة مراجعة شهرية فردية (Google Meet)",
        "ضبط إدارة المخاطر بما يناسب حسابك",
        "وصول مبكر إلى الروبوتات والمؤشرات الجديدة",
      ],
    },
  },
];

export const allProducts: Product[] = [...bots, ...indicators];

export function getProduct(slug: string): Product | undefined {
  return allProducts.find((p) => p.slug === slug);
}

export function getProductsByKind(kind: ProductKind): Product[] {
  return allProducts.filter((p) => p.kind === kind);
}

export function getSignalPlan(slug: string): SignalPlan | undefined {
  return signalPlans.find((p) => p.slug === slug);
}

/** Env var name that should hold the Stripe Price ID for a given item. */
export function stripePriceEnvKey(slug: string): string {
  return `STRIPE_PRICE_${slug.replace(/-/g, "_").toUpperCase()}`;
}
