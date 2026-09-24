import type { Locale } from "@/i18n/config";

export type Localized = Record<Locale, string>;
export type LocalizedList = Record<Locale, string[]>;

export type ProductKind = "bot" | "indicator" | "signal";

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
  badge?: "popular" | "new" | "custom" | "bundle";
  /** True for bespoke products (e.g. the custom bot) that need a conversation
   * before delivery — the buy flow routes to contact instead of checkout. */
  requiresConsultation?: boolean;
  /**
   * True when src/lib/deliverables has a matching entry (keyed by slug) with
   * the actual file + install instructions — fulfilPurchase attaches it and
   * emails the buyer automatically instead of a human sending it by hand.
   * Doesn't hold the file itself: this module is imported by client
   * components too, and the deliverable content must stay server-only.
   */
  hasAutoDelivery?: boolean;
  /**
   * True when there's no standalone standard price at all — priceUSD equals
   * exnessPriceUSD and checkout requires a verified Exness affiliation
   * regardless of priceChoice. Used for Exness-only promo pricing.
   */
  requiresExnessVerification?: boolean;
  /**
   * Extra note shown in the post-payment delivery email, on top of the
   * normal delivery content — e.g. "book your install call with an Expert"
   * for a bot that needs hands-on setup. The booking link itself
   * (NEXT_PUBLIC_MEET_URL) is appended automatically; don't include it here.
   */
  postPurchaseNote?: Localized;
  /** Real backtest screenshots (equity curve, Strategy Tester report, …),
   * shown in a dedicated section on the product page when present. */
  backtestImages?: { src: string; alt: Localized }[];
  /**
   * Steps shown on the product page, before purchase, explaining what
   * happens after checkout — e.g. "buy -> book an install call -> the
   * Expert activates it on your account". Distinct from `howItWorks`,
   * which explains the product's own logic, not the buying process.
   */
  purchaseProcess?: LocalizedList;
  /**
   * When set, checkout only charges this percentage of priceUSD/
   * exnessPriceUSD up front (a deposit) — the rest is collected manually
   * once the product is delivered. Used for made-to-order products like
   * the custom bot, where the full price can't be known/charged before the
   * work is scoped out.
   */
  depositPercent?: number;
  /**
   * Slugs of other products (any kind) to show as "Comprado junto con" on
   * this product's page — curated by hand, unlike the generic "related"
   * list which is just same-kind products. Lets a bot page cross-sell a
   * signal on the same asset, an indicator cross-sell the bot that
   * automates it, etc.
   */
  crossSell?: string[];
}

export const bots: Product[] = [
  {
    slug: "xauusd-impulse-scalper-bot",
    kind: "bot",
    name: "XAUUSD Impulse Scalper",
    asset: "XAUUSD",
    assetLabel: { es: "Oro (XAU/USD)", en: "Gold (XAU/USD)", ar: "الذهب (XAU/USD)" },
    timeframe: "M5",
    platform: "MT5",
    strategyTag: {
      es: "Scalping de impulso",
      en: "Impulse scalping",
      ar: "سكالبينج الزخم",
    },
    tagline: {
      es: "La versión automática del Impulse Signal: opera sola, con stop, objetivo y gestión de riesgo integrados.",
      en: "The automated version of the Impulse Signal: trades on its own, with built-in stop, target and risk management.",
      ar: "النسخة الآلية من Impulse Signal: تتداول بمفردها، مع وقف خسارة وهدف وإدارة مخاطر مدمجة.",
    },
    description: {
      es: "Es la versión completamente automática de nuestra señal de impulso en oro: el mismo criterio del indicador visual (vela con impulso fuera de lo normal + tendencia confirmada por EMA 20/50 en M5) pero acá el bot abre, gestiona y cierra las operaciones por vos. Calcula el tamaño de la posición según un riesgo fijo por operación, pone stop y objetivo automáticos, y cierra la posición si no se resuelve dentro de una cantidad determinada de velas. Trae límites de pérdida diaria, semanal y de drawdown de cuenta que detienen el bot solo si se tocan, además de un filtro de spread, una ventana horaria fija y un filtro opcional de noticias/volatilidad para evitar condiciones de mercado erráticas. Podés elegir que replique exactamente la misma señal que ves en el indicador manual, o activar los filtros extra de protección para operar de forma más conservadora.",
      en: "This is the fully automated version of our gold impulse signal: same criteria as the visual indicator (an above-normal impulse candle plus a trend confirmed by the M5 EMA 20/50) — except here the bot opens, manages and closes the trades for you. It sizes each position from a fixed risk-per-trade percentage, sets automatic stop-loss and take-profit, and time-exits a trade if it hasn't resolved within a set number of candles. It ships with daily, weekly and account-drawdown loss limits that halt the bot if they're hit, plus a spread filter, a fixed trading window, and an optional news/volatility filter to sit out erratic conditions. You can have it mirror the exact same signal shown on the manual indicator, or turn on the extra protection filters for a more conservative run.",
      ar: "هذه هي النسخة الآلية الكاملة من إشارة الزخم على الذهب: نفس معيار المؤشر المرئي (شمعة بزخم أعلى من المعتاد مع اتجاه مؤكَّد بمتوسطين متحركين 20/50 على فريم 5 دقائق) — لكن هنا يفتح البوت الصفقات ويديرها ويغلقها عنك. يحدد حجم كل صفقة بنسبة مخاطرة ثابتة، ويضبط وقف الخسارة وأخذ الربح تلقائياً، ويغلق الصفقة بالوقت إذا لم تُحسم ضمن عدد محدد من الشموع. يأتي بحدود خسارة يومية وأسبوعية وحد أقصى لتراجع الحساب توقف البوت عند بلوغها، إضافةً إلى فلتر فروق السعر، ونطاق تداول ثابت، وفلتر اختياري للأخبار/التقلب لتجاوز الظروف غير المستقرة. يمكنك جعله يطابق تماماً إشارة المؤشر اليدوي، أو تفعيل فلاتر الحماية الإضافية لتشغيل أكثر تحفظاً.",
    },
    features: {
      es: [
        "Mismo criterio de señal que el indicador visual (impulso + tendencia EMA 20/50)",
        "Tamaño de posición automático según % de riesgo fijo por operación",
        "Stop loss y take profit automáticos (1.5R por defecto)",
        "Límites de pérdida diaria, semanal y drawdown de cuenta con freno automático",
        "Filtro de spread, horario fijo y filtro opcional de noticias/volatilidad",
        "Incluye gratis el indicador visual XAUUSD Manual Impulse Signal",
      ],
      en: [
        "Same signal criteria as the visual indicator (impulse + EMA 20/50 trend)",
        "Automatic position sizing from a fixed risk % per trade",
        "Automatic stop-loss and take-profit (1.5R by default)",
        "Daily, weekly and account-drawdown loss limits with an automatic brake",
        "Spread filter, fixed trading window, and an optional news/volatility filter",
        "Includes the XAUUSD Manual Impulse Signal visual indicator for free",
      ],
      ar: [
        "نفس معيار إشارة المؤشر المرئي (زخم + اتجاه EMA 20/50)",
        "تحديد حجم الصفقة تلقائياً بنسبة مخاطرة ثابتة لكل صفقة",
        "وقف خسارة وأخذ ربح تلقائيان (1.5R افتراضياً)",
        "حدود خسارة يومية وأسبوعية وتراجع حساب مع كبح تلقائي",
        "فلتر فروق سعر، نطاق تداول ثابت، وفلتر اختياري للأخبار/التقلب",
        "يشمل مؤشر XAUUSD Manual Impulse Signal المرئي مجاناً",
      ],
    },
    howItWorks: {
      es: [
        "Instalalo en MT5 con la configuración recomendada que te mandamos (archivo .set).",
        "El bot analiza cada vela de M5 buscando el mismo impulso + tendencia que el indicador.",
        "Cuando confirma la señal, abre la operación con stop y objetivo ya calculados.",
        "Vos controlás si opera en automático o solo te avisa — activás o desactivás \"Algo Trading\" cuando quieras.",
      ],
      en: [
        "Install it on MT5 with the recommended configuration we send you (.set file).",
        "The bot analyzes every M5 candle looking for the same impulse + trend as the indicator.",
        "Once the signal confirms, it opens the trade with stop-loss and target already calculated.",
        "You control whether it trades automatically or just alerts you — toggle \"Algo Trading\" whenever you want.",
      ],
      ar: [
        "ثبّته على MT5 بالضبط الموصى به الذي نرسله لك (ملف .set).",
        "يحلّل البوت كل شمعة على فريم 5 دقائق بحثاً عن نفس الزخم والاتجاه الذي يبحث عنه المؤشر.",
        "عند تأكيد الإشارة، يفتح الصفقة بوقف خسارة وهدف محسوبين مسبقاً.",
        "أنت من يتحكم إن كان يتداول تلقائياً أو فقط يُنبّهك — فعّل أو عطّل \"Algo Trading\" وقتما تشاء.",
      ],
    },
    priceUSD: 1499,
    exnessPriceUSD: 999,
    badge: "bundle",
    hasAutoDelivery: true,
    crossSell: ["signal-xauusd"],
  },
  {
    slug: "siza",
    kind: "bot",
    name: "SIZA",
    asset: "XAUUSD",
    assetLabel: { es: "Oro (XAU/USD)", en: "Gold (XAU/USD)", ar: "الذهب (XAU/USD)" },
    timeframe: "Multi",
    platform: "MT5",
    strategyTag: {
      es: "Método Wyckoff adaptativo",
      en: "Adaptive Wyckoff method",
      ar: "منهج وايكوف التكيّفي",
    },
    tagline: {
      es: "IA de régimen de mercado + protección institucional para operar oro 100% automático.",
      en: "Market-regime AI plus institutional-grade protection to trade gold fully automated.",
      ar: "ذكاء اصطناعي لتحديد نظام السوق مع حماية بمعايير مؤسسية لتداول الذهب بشكل آلي بالكامل.",
    },
    description: {
      es: "SIZA es un Expert Advisor 100% automatizado, desarrollado específicamente para operar el activo más líquido y volátil del mercado: el Oro (XAU/USD), sobre la plataforma institucional MetaTrader 5 (MT5). No es un bot que opera a ciegas: integra un motor basado en el Método Wyckoff que escanea el mercado en tiempo real y detecta en qué régimen se encuentra el oro — tendencia alcista, tendencia bajista o rango lateral — y adapta distancias, lotaje y objetivos a ese escenario exacto. Incorpora varias capas de protección de grado institucional: un filtro de sobre-extensión que bloquea entradas cuando el precio se aleja irracionalmente de su media, un sistema de gestión de drawdown que reduce el riesgo y libera margen con cierres parciales cuando las operaciones van en contra, un mecanismo de cobertura de emergencia que congela la cuenta ante movimientos extremos (tipo cisne negro), y un filtro de noticias/geopolítico que pausa la operativa antes de anuncios de alto impacto. En backtest sobre 9 meses de datos históricos, con un depósito inicial de $10.000, generó un beneficio neto de $4.672,74 (factor de beneficio 1,75, 78,87% de operaciones rentables sobre 8.934 operaciones). Resultados pasados no garantizan resultados futuros — el trading con apalancamiento conlleva un alto riesgo de pérdida de capital.",
      en: "SIZA is a fully automated Expert Advisor, built specifically to trade the market's most liquid and volatile asset — gold (XAU/USD) — on the institutional MetaTrader 5 (MT5) platform. It doesn't trade blindly: it runs an engine based on the Wyckoff Method that scans the market in real time and detects which regime gold is in — uptrend, downtrend, or range — adapting its distances, lot size and targets to that exact scenario. It ships with several layers of institutional-grade protection: an over-extension filter that blocks entries when price stretches irrationally away from its mean, a drawdown-management system that dials down risk and frees up margin with precise partial closes when trades go against it, an emergency hedge mechanism that locks the account during extreme moves (black-swan events), and a news/geopolitical filter that pauses trading ahead of high-impact announcements. In a 9-month historical backtest, starting from a $10,000 deposit, it produced a net profit of $4,672.74 (profit factor 1.75, 78.87% winning trades across 8,934 trades). Past results don't guarantee future ones — leveraged trading carries a high risk of losing capital.",
      ar: "SIZA هو مستشار خبير (Expert Advisor) آلي بالكامل، مصمم خصيصاً لتداول أكثر الأصول سيولةً وتقلباً في السوق — الذهب (XAU/USD) — على منصة MetaTrader 5 (MT5) المؤسسية. إنه لا يتداول عشوائياً: يشغّل محركاً قائماً على منهج وايكوف يفحص السوق في الوقت الفعلي ويحدد النظام الذي يمر به الذهب — اتجاه صاعد، اتجاه هابط، أو نطاق عرضي — ويكيّف مسافاته وحجم صفقاته وأهدافه مع هذا السيناريو بدقة. يأتي بعدة طبقات من الحماية بمعايير مؤسسية: مرشّح تمدد مفرط يمنع الدخول عندما يبتعد السعر بشكل غير منطقي عن متوسطه، نظام لإدارة التراجع يخفّف المخاطرة ويحرّر الهامش بإغلاقات جزئية دقيقة عندما تسير الصفقات بعكس الاتجاه، آلية تحوّط طارئة تُجمّد الحساب عند تحركات استثنائية (أحداث البجعة السوداء)، وفلتر أخبار/جيوسياسي يوقف التداول قبل الإعلانات عالية التأثير. في اختبار رجعي على بيانات تاريخية لمدة 9 أشهر، وبإيداع ابتدائي 10,000 دولار، حقّق صافي ربح بلغ 4,672.74 دولاراً (عامل ربح 1.75، ونسبة 78.87% صفقات رابحة من إجمالي 8,934 صفقة). النتائج السابقة لا تضمن نتائج مستقبلية — يحمل التداول بالرافعة المالية مخاطر عالية لخسارة رأس المال.",
    },
    features: {
      es: [
        "Detección automática de régimen: tendencia alcista, bajista o rango (Método Wyckoff)",
        "Filtro de sobre-extensión: evita entradas cuando el precio se aleja irracionalmente de su media",
        "Gestión de drawdown con cierres parciales para liberar margen",
        "Cobertura de emergencia (Hedge Lock) ante movimientos extremos",
        "Filtro de noticias y riesgo geopolítico de alto impacto",
        "Backtest de 9 meses: factor de beneficio 1,75, 78,87% de operaciones rentables",
      ],
      en: [
        "Automatic regime detection: uptrend, downtrend or range (Wyckoff Method)",
        "Over-extension filter: avoids entries when price strays irrationally from its mean",
        "Drawdown management with partial closes to free up margin",
        "Emergency hedge lock for extreme market moves",
        "High-impact news and geopolitical risk filter",
        "9-month backtest: 1.75 profit factor, 78.87% winning trades",
      ],
      ar: [
        "اكتشاف تلقائي لنظام السوق: اتجاه صاعد أو هابط أو نطاق (منهج وايكوف)",
        "مرشّح التمدد المفرط: يتجنّب الدخول عندما يبتعد السعر بشكل غير منطقي عن متوسطه",
        "إدارة التراجع بإغلاقات جزئية لتحرير الهامش",
        "تحوّط طارئ (Hedge Lock) عند التحركات الاستثنائية",
        "فلتر للأخبار والمخاطر الجيوسياسية عالية التأثير",
        "اختبار رجعي لمدة 9 أشهر: عامل ربح 1.75، ونسبة 78.87% صفقات رابحة",
      ],
    },
    howItWorks: {
      es: [
        "El bot escanea el oro en tiempo real y determina el régimen actual: tendencia alcista, bajista o rango.",
        "Adapta automáticamente distancias, lotaje y objetivos al régimen detectado — no usa una configuración fija.",
        "Antes de cada entrada, filtra sobre-extensión de precio, noticias de alto impacto y riesgo geopolítico.",
        "Si el mercado se mueve de forma extrema, activa la cobertura de emergencia para proteger el capital.",
      ],
      en: [
        "The bot scans gold in real time and determines the current regime: uptrend, downtrend or range.",
        "It automatically adapts distances, lot size and targets to the detected regime — no fixed configuration.",
        "Before every entry, it filters out price over-extension, high-impact news and geopolitical risk.",
        "If the market moves to extremes, it activates the emergency hedge to protect capital.",
      ],
      ar: [
        "يفحص البوت الذهب في الوقت الفعلي ويحدد النظام الحالي: اتجاه صاعد أو هابط أو نطاق.",
        "يكيّف تلقائياً المسافات وحجم الصفقات والأهداف مع النظام المكتشف — دون إعدادات ثابتة.",
        "قبل كل دخول، يُرشّح التمدد المفرط للسعر والأخبار عالية التأثير والمخاطر الجيوسياسية.",
        "إذا تحرك السوق بشكل استثنائي، يُفعّل التحوّط الطارئ لحماية رأس المال.",
      ],
    },
    priceUSD: 4999,
    exnessPriceUSD: 2999,
    badge: "popular",
    postPurchaseNote: {
      es: "Después del pago, coordiná con nuestro Experto la instalación en tu cuenta — reservá tu turno con el link de abajo. También vas a quedar agregado al grupo de seguimiento de SIZA (análisis diarios, ajustes de configuración y soporte). La licencia es de por vida para tu cuenta.",
      en: "After payment, book a slot with our Expert to install it on your account — use the link below. You'll also be added to the SIZA follow-up group (daily analysis, configuration tweaks and support). The license is lifetime, for your account.",
      ar: "بعد الدفع، حدّد موعداً مع خبيرنا لتثبيته على حسابك — استخدم الرابط أدناه. ستتم إضافتك أيضاً إلى مجموعة متابعة SIZA (تحليلات يومية، تعديلات على الإعدادات، ودعم). الترخيص مدى الحياة لحسابك.",
    },
    backtestImages: [
      {
        src: "/products/siza/backtest-equity.jpg",
        alt: {
          es: "Curva de balance/patrimonio del backtest de SIZA, de $10.000 a $14.686 en 9 meses",
          en: "SIZA's backtest balance/equity curve, from $10,000 to $14,686 over 9 months",
          ar: "منحنى الرصيد/حقوق الملكية لاختبار SIZA الرجعي، من 10,000$ إلى 14,686$ خلال 9 أشهر",
        },
      },
      {
        src: "/products/siza/backtest-report.jpg",
        alt: {
          es: "Reporte del Strategy Tester de MT5 con las métricas completas del backtest de SIZA",
          en: "MT5 Strategy Tester report with SIZA's full backtest metrics",
          ar: "تقرير Strategy Tester في MT5 بمقاييس اختبار SIZA الرجعي الكاملة",
        },
      },
    ],
    purchaseProcess: {
      es: [
        "Comprás SIZA — pago único, con o sin precio de referido Exness.",
        "Coordinás una reunión de instalación con nuestro Experto (agendás con el link que te llega por mail).",
        "En la reunión, el Experto activa SIZA en tu cuenta de MT5 — la licencia es de por vida para esa cuenta.",
        "Quedás agregado al grupo de seguimiento de SIZA: análisis diarios, ajustes de configuración y soporte.",
      ],
      en: [
        "You buy SIZA — one-time payment, with or without the Exness referral price.",
        "You book an install call with our Expert (schedule it using the link we email you).",
        "On the call, the Expert activates SIZA on your MT5 account — the license is lifetime for that account.",
        "You're added to the SIZA follow-up group: daily analysis, configuration tweaks and support.",
      ],
      ar: [
        "تشتري SIZA — دفعة واحدة، بسعر إحالة Exness أو بدونه.",
        "تحدّد موعد تثبيت مع خبيرنا (عبر الرابط الذي يصلك بالبريد).",
        "في الموعد، يفعّل الخبير SIZA على حسابك في MT5 — الترخيص مدى الحياة لهذا الحساب.",
        "تتم إضافتك إلى مجموعة متابعة SIZA: تحليلات يومية، تعديلات على الإعدادات، ودعم.",
      ],
    },
    crossSell: ["signal-xauusd", "xauusd-impulse-signal"],
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
    exnessPriceUSD: 1599,
    badge: "new",
    crossSell: ["signal-btcusd"],
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
    exnessPriceUSD: 1599,
    badge: "new",
    crossSell: ["signal-multi"],
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
    depositPercent: 50,
    purchaseProcess: {
      es: [
        "¿Tenés dudas? Reservá una llamada informativa antes de comprar (opcional).",
        "Pagás el 50% del total como seña.",
        "Completás un formulario con los detalles de tu estrategia: entradas, salidas y gestión de riesgo.",
        "Coordinamos una reunión para revisar cada punto del formulario juntos.",
        "Desarrollamos tu bot — el armado toma entre 15 y 25 días según la complejidad.",
        "Te lo entregamos y pagás el 50% restante.",
      ],
      en: [
        "Have questions? Book an informational call before buying (optional).",
        "You pay 50% of the total as a deposit.",
        "You fill out a form with your strategy's details: entries, exits and risk management.",
        "We set up a call to go through every point on the form together.",
        "We build your bot — this takes 15 to 25 days depending on complexity.",
        "We deliver it and you pay the remaining 50%.",
      ],
      ar: [
        "عندك أسئلة؟ حجز مكالمة تعريفية قبل الشراء (اختياري).",
        "تدفع 50% من الإجمالي كدفعة أولى.",
        "تعبّئ نموذجاً بتفاصيل استراتيجيتك: الدخول والخروج وإدارة المخاطر.",
        "نحدّد موعداً لمراجعة كل نقطة في النموذج معك.",
        "نطوّر روبوتك — يستغرق ذلك من 15 إلى 25 يوماً حسب التعقيد.",
        "نسلّمه وتدفع نسبة الـ 50% المتبقية.",
      ],
    },
    postPurchaseNote: {
      es: "Completá el formulario con los detalles de tu estrategia — lo vemos juntos en una reunión. El desarrollo toma entre 15 y 25 días según la complejidad.",
      en: "Fill out the form with your strategy's details — we'll go through it together on a call. Development takes 15 to 25 days depending on complexity.",
      ar: "عبّئ النموذج بتفاصيل استراتيجيتك — سنراجعها معك في مكالمة. يستغرق التطوير من 15 إلى 25 يوماً حسب التعقيد.",
    },
  },
];

export const indicators: Product[] = [
  {
    slug: "xauusd-impulse-signal",
    kind: "indicator",
    name: "XAUUSD Manual Impulse Signal",
    asset: "XAUUSD",
    assetLabel: { es: "Oro (XAU/USD)", en: "Gold (XAU/USD)", ar: "الذهب (XAU/USD)" },
    timeframe: "M5",
    platform: "Exness",
    strategyTag: {
      es: "Señal de impulso",
      en: "Impulse signal",
      ar: "إشارة زخم",
    },
    tagline: {
      es: "Señales de impulso en oro, filtradas por horario y tendencia.",
      en: "Gold impulse signals, filtered by schedule and trend.",
      ar: "إشارات زخم على الذهب، مُصفّاة حسب التوقيت والاتجاه.",
    },
    description: {
      es: "Es una herramienta visual diseñada para encontrar movimientos fuertes y poco frecuentes en el precio del oro. Analiza gráficos de 5 minutos y busca una combinación específica: una vela con impulso superior a lo normal y una tendencia confirmada por medias móviles. Cuando todas las condiciones coinciden, muestra una etiqueta verde para una posible compra o una etiqueta roja para una posible venta. También puede mostrar una prealerta amarilla mientras se está formando un posible movimiento — todavía no es una entrada confirmada, solo llama la atención. Para reducir señales de baja calidad, trabaja de lunes a viernes dentro de un horario determinado, evitando la franja asociada a noticias o mayor inestabilidad. En resumen: observa el mercado, filtra el ruido y avisa cuándo aparece una oportunidad — la decisión y la ejecución quedan en manos del trader.",
      en: "A visual tool designed to spot strong, infrequent moves in the price of gold. It analyzes 5-minute charts looking for a specific combination: a candle with above-normal impulse plus a trend confirmed by moving averages. When every condition lines up, it shows a green label for a possible buy or a red label for a possible sell. It can also show a yellow pre-alert while a potential move is still forming — that's not a confirmed entry yet, just a heads-up. To cut down on low-quality signals, it only runs Monday to Friday within a set schedule, skipping the window usually tied to news releases and higher volatility. In short: it watches the market, filters out the noise, and flags when an opportunity appears — the decision and execution stay in the trader's hands.",
      ar: "أداة بصرية مصممة لرصد التحركات القوية وغير المتكررة في سعر الذهب. يحلّل المؤشر الرسوم البيانية لفريم 5 دقائق ويبحث عن تركيبة محددة: شمعة بزخم أعلى من المعتاد مع اتجاه مؤكَّد بالمتوسطات المتحركة. عند توافق كل الشروط، يُظهر بطاقة خضراء لفرصة شراء محتملة أو بطاقة حمراء لفرصة بيع محتملة. يمكنه أيضاً إظهار تنبيه أصفر مسبق أثناء تشكّل حركة محتملة — وهذا ليس دخولاً مؤكداً بعد، بل لفت انتباه فقط. لتقليل الإشارات ضعيفة الجودة، يعمل المؤشر من الإثنين إلى الجمعة ضمن نطاق زمني محدد، ويتجنّب الفترة المرتبطة عادة بالأخبار وزيادة التقلب. باختصار: يراقب السوق، يُصفّي الضوضاء، وينبّهك عند ظهور فرصة — بينما يبقى القرار والتنفيذ بيد المتداول.",
    },
    features: {
      es: [
        "Etiqueta verde/roja cuando coinciden vela de impulso + tendencia confirmada",
        "Prealerta amarilla mientras se forma el movimiento",
        "Filtro de horario: solo de lunes a viernes",
        "Evita la franja asociada a noticias y mayor inestabilidad",
        "Diseñado específicamente para XAU/USD en M5",
      ],
      en: [
        "Green/red label when an impulse candle lines up with a confirmed trend",
        "Yellow pre-alert while the move is still forming",
        "Schedule filter: Monday to Friday only",
        "Skips the window tied to news and higher volatility",
        "Built specifically for XAU/USD on M5",
      ],
      ar: [
        "بطاقة خضراء/حمراء عند توافق شمعة الزخم مع اتجاه مؤكَّد",
        "تنبيه أصفر مسبق أثناء تشكّل الحركة",
        "فلتر توقيت: من الإثنين إلى الجمعة فقط",
        "يتجنّب الفترة المرتبطة بالأخبار وزيادة التقلب",
        "مصمم خصيصاً لزوج XAU/USD على فريم 5 دقائق",
      ],
    },
    howItWorks: {
      es: [
        "Pegalo como script en Exness Terminal (versión web) y aplicalo a tu gráfico de XAU/USD en M5.",
        "El indicador monitorea cada vela buscando impulso + tendencia confirmada.",
        "Si empieza a formarse un posible movimiento, aparece una prealerta amarilla.",
        "Cuando se confirma, muestra una etiqueta verde (compra) o roja (venta) — la entrada y gestión quedan en tus manos.",
      ],
      en: [
        "Paste it as a script in Exness Terminal (web version) and apply it to your XAU/USD M5 chart.",
        "The indicator watches every candle for impulse plus a confirmed trend.",
        "A yellow pre-alert appears while a potential move is forming.",
        "Once confirmed, it shows a green (buy) or red (sell) label — entry and execution stay yours.",
      ],
      ar: [
        "ألصقه كسكربت في Exness Terminal (نسخة الويب) وطبّقه على رسمك البياني لزوج XAU/USD على فريم 5 دقائق.",
        "يراقب المؤشر كل شمعة بحثاً عن زخم مع اتجاه مؤكَّد.",
        "يظهر تنبيه أصفر مسبق أثناء تشكّل حركة محتملة.",
        "عند التأكيد، يُظهر بطاقة خضراء (شراء) أو حمراء (بيع) — يبقى الدخول والتنفيذ بيدك.",
      ],
    },
    priceUSD: 300,
    exnessPriceUSD: 200,
    hasAutoDelivery: true,
    crossSell: ["xauusd-impulse-scalper-bot", "signal-xauusd"],
  },
  {
    slug: "custom-indicator",
    kind: "indicator",
    name: "Custom Indicador",
    asset: "CUSTOM",
    assetLabel: {
      es: "El instrumento que elijas",
      en: "Any instrument you choose",
      ar: "أي أداة تختارها",
    },
    timeframe: "A tu medida",
    platform: "MT4 / MT5 / Exness",
    strategyTag: {
      es: "Tu propia estrategia, en un indicador",
      en: "Your own strategy, as an indicator",
      ar: "استراتيجيتك، في مؤشر",
    },
    tagline: {
      es: "Arma tu indicador con tu estrategia personal.",
      en: "Build your indicator around your own strategy.",
      ar: "اصنع مؤشرك الخاص باستراتيجيتك الشخصية.",
    },
    description: {
      es: "Toda estrategia puede convertirse en un indicador visual. Nos contás cómo leés el mercado — tus reglas de entrada, salida y gestión de riesgo — y las convertimos en un indicador a medida que marca esas condiciones directamente en tu gráfico. Se entrega igual que cualquier otro indicador: con licencia y manual, listo para usar.",
      en: "Any strategy can become a visual indicator. Tell us how you read the market — your entry, exit and risk rules — and we turn them into a custom indicator that plots those conditions right on your chart. It's delivered like any other indicator: with a license and a manual, ready to use.",
      ar: "يمكن تحويل أي استراتيجية إلى مؤشر بصري. أخبرنا كيف تقرأ السوق — قواعدك للدخول والخروج وإدارة المخاطر — ونحوّلها إلى مؤشر مصمَّم خصيصاً لك يعرض هذه الشروط مباشرة على رسمك البياني. يُسلَّم مثل أي مؤشر آخر: بترخيص ودليل استخدام، جاهزاً للاستعمال.",
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
        "Nos contás tu estrategia: qué condiciones marca y cómo las leés.",
        "La desarrollamos y la probamos antes de entregarla.",
        "Te la entregamos con licencia y manual, lista para usar.",
      ],
      en: [
        "Tell us your strategy: what conditions it flags and how you read them.",
        "We build and test it before handing it over.",
        "You get it with a license and manual, ready to use.",
      ],
      ar: [
        "أخبرنا باستراتيجيتك: ما الشروط التي يرصدها وكيف تقرأها.",
        "نطوّرها ونختبرها قبل تسليمها.",
        "تستلمها مع الترخيص والدليل جاهزة للاستعمال.",
      ],
    },
    priceUSD: 1499,
    exnessPriceUSD: 999,
    badge: "custom",
    depositPercent: 50,
    purchaseProcess: {
      es: [
        "¿Tenés dudas? Reservá una llamada informativa antes de comprar (opcional).",
        "Pagás el 50% del total como seña.",
        "Completás un formulario con los detalles de tu estrategia: entradas, salidas y gestión de riesgo.",
        "Coordinamos una reunión para revisar cada punto del formulario juntos.",
        "Desarrollamos tu indicador — el armado toma entre 15 y 25 días según la complejidad.",
        "Te lo entregamos y pagás el 50% restante.",
      ],
      en: [
        "Have questions? Book an informational call before buying (optional).",
        "You pay 50% of the total as a deposit.",
        "You fill out a form with your strategy's details: entries, exits and risk management.",
        "We set up a call to go through every point on the form together.",
        "We build your indicator — this takes 15 to 25 days depending on complexity.",
        "We deliver it and you pay the remaining 50%.",
      ],
      ar: [
        "عندك أسئلة؟ حجز مكالمة تعريفية قبل الشراء (اختياري).",
        "تدفع 50% من الإجمالي كدفعة أولى.",
        "تعبّئ نموذجاً بتفاصيل استراتيجيتك: الدخول والخروج وإدارة المخاطر.",
        "نحدّد موعداً لمراجعة كل نقطة في النموذج معك.",
        "نطوّر مؤشرك — يستغرق ذلك من 15 إلى 25 يوماً حسب التعقيد.",
        "نسلّمه وتدفع نسبة الـ 50% المتبقية.",
      ],
    },
    postPurchaseNote: {
      es: "Completá el formulario con los detalles de tu estrategia — lo vemos juntos en una reunión. El desarrollo toma entre 15 y 25 días según la complejidad.",
      en: "Fill out the form with your strategy's details — we'll go through it together on a call. Development takes 15 to 25 days depending on complexity.",
      ar: "عبّئ النموذج بتفاصيل استراتيجيتك — سنراجعها معك في مكالمة. يستغرق التطوير من 15 إلى 25 يوماً حسب التعقيد.",
    },
  },
];

export const signals: Product[] = [
  {
    slug: "signal-xauusd",
    kind: "signal",
    name: "Señal XAUUSD",
    asset: "XAUUSD",
    assetLabel: { es: "Oro (XAU/USD)", en: "Gold (XAU/USD)", ar: "الذهب (XAU/USD)" },
    timeframe: "Intradía",
    platform: "Telegram",
    strategyTag: {
      es: "Señales de oro",
      en: "Gold signals",
      ar: "إشارات الذهب",
    },
    tagline: {
      es: "Señales de trading en oro (XAU/USD), directo a tu Telegram.",
      en: "Gold (XAU/USD) trading signals, straight to your Telegram.",
      ar: "إشارات تداول على الذهب (XAU/USD)، مباشرة إلى تيليجرام.",
    },
    description: {
      es: "Acceso de pago único al canal de Telegram donde publicamos nuestras señales de oro (XAU/USD). Cada señal trae el precio de entrada, el stop-loss, el take-profit y el razonamiento detrás — vos decidís cuándo y cómo ejecutarla. El acceso queda activo sin vencimiento, no es una suscripción.",
      en: "One-time access to the Telegram channel where we post our gold (XAU/USD) trading signals. Every call comes with the entry price, stop-loss, take-profit and the reasoning behind it — you decide when and how to execute it. Access stays open with no expiry; this isn't a subscription.",
      ar: "وصول بدفعة واحدة إلى قناة تيليجرام التي ننشر فيها إشارات تداول الذهب (XAU/USD). كل صفقة تأتي مع سعر الدخول ووقف الخسارة وجني الأرباح والسبب وراءها — القرار بالتنفيذ ووقته يعود لك. يبقى الوصول مفتوحاً دون انتهاء؛ هذا ليس اشتراكاً.",
    },
    features: {
      es: [
        "Señales con entrada, stop-loss y take-profit",
        "Contexto y razonamiento detrás de cada operación",
        "Actualizaciones de gestión (break-even, parciales, cierre)",
        "Acceso de por vida — no es una suscripción mensual",
      ],
      en: [
        "Signals with entry, stop-loss and take-profit",
        "Context and reasoning behind every trade",
        "Management updates (break-even, partials, close)",
        "Lifetime access — not a monthly subscription",
      ],
      ar: [
        "إشارات مع سعر دخول ووقف خسارة وجني أرباح",
        "سياق وسبب كل صفقة",
        "تحديثات إدارة الصفقة (نقطة تعادل، جني جزئي، إغلاق)",
        "وصول مدى الحياة — ليس اشتراكاً شهرياً",
      ],
    },
    howItWorks: {
      es: [
        "Pagás una sola vez y recibís por mail el link de invitación al canal de Telegram.",
        "Te unís al canal — el acceso queda activo, sin vencimiento.",
        "Publicamos ahí cada señal de XAUUSD, con entrada, SL y TP.",
        "Vos decidís si la operás y con qué tamaño según tu propia gestión de riesgo.",
      ],
      en: [
        "Pay once and get the Telegram invite link by email.",
        "Join the channel — access stays active, no expiry.",
        "We post every XAUUSD signal there, with entry, SL and TP.",
        "You decide whether to trade it and at what size, using your own risk management.",
      ],
      ar: [
        "ادفع مرة واحدة واستلم رابط دعوة تيليجرام عبر البريد.",
        "انضم إلى القناة — يبقى الوصول نشطاً دون انتهاء.",
        "ننشر هناك كل إشارة على XAUUSD، مع الدخول ووقف الخسارة وجني الأرباح.",
        "أنت من يقرر التنفيذ وحجم الصفقة وفق إدارة مخاطرك الخاصة.",
      ],
    },
    priceUSD: 150,
    exnessPriceUSD: 99,
    crossSell: ["siza", "xauusd-impulse-scalper-bot"],
  },
  {
    slug: "signal-btcusd",
    kind: "signal",
    name: "Señal BTCUSD",
    asset: "BTCUSD",
    assetLabel: {
      es: "Bitcoin (BTC/USD)",
      en: "Bitcoin (BTC/USD)",
      ar: "بيتكوين (BTC/USD)",
    },
    timeframe: "Intradía",
    platform: "Telegram",
    strategyTag: {
      es: "Señales de Bitcoin",
      en: "Bitcoin signals",
      ar: "إشارات بيتكوين",
    },
    tagline: {
      es: "Señales de trading en Bitcoin (BTC/USD), directo a tu Telegram.",
      en: "Bitcoin (BTC/USD) trading signals, straight to your Telegram.",
      ar: "إشارات تداول على بيتكوين (BTC/USD)، مباشرة إلى تيليجرام.",
    },
    description: {
      es: "Acceso de pago único al canal de Telegram donde publicamos nuestras señales de Bitcoin (BTC/USD). Cada señal trae el precio de entrada, el stop-loss, el take-profit y el razonamiento detrás — vos decidís cuándo y cómo ejecutarla. El acceso queda activo sin vencimiento, no es una suscripción.",
      en: "One-time access to the Telegram channel where we post our Bitcoin (BTC/USD) trading signals. Every call comes with the entry price, stop-loss, take-profit and the reasoning behind it — you decide when and how to execute it. Access stays open with no expiry; this isn't a subscription.",
      ar: "وصول بدفعة واحدة إلى قناة تيليجرام التي ننشر فيها إشارات تداول بيتكوين (BTC/USD). كل صفقة تأتي مع سعر الدخول ووقف الخسارة وجني الأرباح والسبب وراءها — القرار بالتنفيذ ووقته يعود لك. يبقى الوصول مفتوحاً دون انتهاء؛ هذا ليس اشتراكاً.",
    },
    features: {
      es: [
        "Señales con entrada, stop-loss y take-profit",
        "Contexto y razonamiento detrás de cada operación",
        "Actualizaciones de gestión (break-even, parciales, cierre)",
        "Acceso de por vida — no es una suscripción mensual",
      ],
      en: [
        "Signals with entry, stop-loss and take-profit",
        "Context and reasoning behind every trade",
        "Management updates (break-even, partials, close)",
        "Lifetime access — not a monthly subscription",
      ],
      ar: [
        "إشارات مع سعر دخول ووقف خسارة وجني أرباح",
        "سياق وسبب كل صفقة",
        "تحديثات إدارة الصفقة (نقطة تعادل، جني جزئي، إغلاق)",
        "وصول مدى الحياة — ليس اشتراكاً شهرياً",
      ],
    },
    howItWorks: {
      es: [
        "Pagás una sola vez y recibís por mail el link de invitación al canal de Telegram.",
        "Te unís al canal — el acceso queda activo, sin vencimiento.",
        "Publicamos ahí cada señal de BTCUSD, con entrada, SL y TP.",
        "Vos decidís si la operás y con qué tamaño según tu propia gestión de riesgo.",
      ],
      en: [
        "Pay once and get the Telegram invite link by email.",
        "Join the channel — access stays active, no expiry.",
        "We post every BTCUSD signal there, with entry, SL and TP.",
        "You decide whether to trade it and at what size, using your own risk management.",
      ],
      ar: [
        "ادفع مرة واحدة واستلم رابط دعوة تيليجرام عبر البريد.",
        "انضم إلى القناة — يبقى الوصول نشطاً دون انتهاء.",
        "ننشر هناك كل إشارة على BTCUSD، مع الدخول ووقف الخسارة وجني الأرباح.",
        "أنت من يقرر التنفيذ وحجم الصفقة وفق إدارة مخاطرك الخاصة.",
      ],
    },
    priceUSD: 150,
    exnessPriceUSD: 99,
    crossSell: ["btc-bot"],
  },
  {
    slug: "signal-multi",
    kind: "signal",
    name: "Señal Multi-Activo",
    asset: "MULTI",
    assetLabel: {
      es: "Oro + Bitcoin + EUR/USD",
      en: "Gold + Bitcoin + EUR/USD",
      ar: "الذهب + بيتكوين + EUR/USD",
    },
    timeframe: "Intradía",
    platform: "Telegram",
    strategyTag: {
      es: "Señales multi-activo",
      en: "Multi-asset signals",
      ar: "إشارات متعددة الأصول",
    },
    tagline: {
      es: "Las tres señales juntas — Oro, Bitcoin y EUR/USD — a precio promocional.",
      en: "All three signals together — Gold, Bitcoin and EUR/USD — at a promo price.",
      ar: "الإشارات الثلاث معاً — الذهب وبيتكوين وEUR/USD — بسعر ترويجي.",
    },
    description: {
      es: "Acceso de pago único a los tres canales de señales juntos: Oro (XAU/USD), Bitcoin (BTC/USD) y EUR/USD, a un precio promocional. Cada señal trae entrada, stop-loss, take-profit y el razonamiento detrás. Este precio promocional está disponible únicamente para quienes abren su cuenta de Exness con nuestro enlace de referido — no tiene versión sin link.",
      en: "One-time access to all three signal channels together: Gold (XAU/USD), Bitcoin (BTC/USD) and EUR/USD, at a promo price. Every call comes with entry, stop-loss, take-profit and the reasoning behind it. This promo price is only available to buyers who open their Exness account through our referral link — there's no non-referral version.",
      ar: "وصول بدفعة واحدة إلى قنوات الإشارات الثلاث معاً: الذهب (XAU/USD) وبيتكوين (BTC/USD) وEUR/USD، بسعر ترويجي. كل صفقة تأتي مع الدخول ووقف الخسارة وجني الأرباح والسبب وراءها. هذا السعر الترويجي متاح فقط لمن يفتح حساب Exness عبر رابط الإحالة الخاص بنا — لا توجد نسخة بدون الرابط.",
    },
    features: {
      es: [
        "Acceso a los 3 canales: Oro, Bitcoin y EUR/USD",
        "Señales con entrada, stop-loss y take-profit en cada activo",
        "Contexto y razonamiento detrás de cada operación",
        "Acceso de por vida — no es una suscripción mensual",
        "Precio promocional solo disponible con referido de Exness",
      ],
      en: [
        "Access to all 3 channels: Gold, Bitcoin and EUR/USD",
        "Signals with entry, stop-loss and take-profit on every asset",
        "Context and reasoning behind every trade",
        "Lifetime access — not a monthly subscription",
        "Promo price only available with the Exness referral",
      ],
      ar: [
        "وصول إلى القنوات الثلاث: الذهب وبيتكوين وEUR/USD",
        "إشارات مع دخول ووقف خسارة وجني أرباح على كل أداة",
        "سياق وسبب كل صفقة",
        "وصول مدى الحياة — ليس اشتراكاً شهرياً",
        "السعر الترويجي متاح فقط مع إحالة Exness",
      ],
    },
    howItWorks: {
      es: [
        "Abrí tu cuenta de Exness con nuestro enlace (es requisito para este precio).",
        "Verificamos tu afiliación y desbloqueamos el precio promocional.",
        "Pagás una sola vez y recibís por mail los 3 links de invitación a Telegram.",
        "Te unís a los 3 canales — el acceso queda activo, sin vencimiento.",
      ],
      en: [
        "Open your Exness account through our link (required for this price).",
        "We verify your affiliation and unlock the promo price.",
        "Pay once and get all 3 Telegram invite links by email.",
        "Join all 3 channels — access stays active, no expiry.",
      ],
      ar: [
        "افتح حساب Exness عبر رابطنا (مطلوب لهذا السعر).",
        "نتحقق من انتسابك ونفتح السعر الترويجي.",
        "ادفع مرة واحدة واستلم روابط الدعوة الثلاث لتيليجرام عبر البريد.",
        "انضم إلى القنوات الثلاث — يبقى الوصول نشطاً دون انتهاء.",
      ],
    },
    priceUSD: 200,
    exnessPriceUSD: 200,
    requiresExnessVerification: true,
    crossSell: ["btc-bot", "eur-bot"],
  },
];

export const allProducts: Product[] = [...bots, ...indicators, ...signals];

export function getProduct(slug: string): Product | undefined {
  return allProducts.find((p) => p.slug === slug);
}

export function getProductsByKind(kind: ProductKind): Product[] {
  return allProducts.filter((p) => p.kind === kind);
}
