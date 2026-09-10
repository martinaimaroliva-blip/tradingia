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
  badge?: "popular" | "new";
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
    slug: "aurum-scalper",
    kind: "bot",
    name: "Aurum Scalper",
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
      es: "Aurum Scalper opera exclusivamente XAU/USD en M5, buscando rupturas de rango durante las sesiones de Londres y Nueva York. Filtra las entradas con volatilidad (ATR) y un rango de sesión mínimo, y protege cada operación con stop fijo y gestión a break-even.",
      en: "Aurum Scalper trades XAU/USD only, on M5, hunting range breakouts during the London and New York sessions. It filters entries with volatility (ATR) and a minimum session range, and protects every trade with a fixed stop and break-even management.",
      ar: "يتداول Aurum Scalper زوج XAU/USD فقط على فريم M5، باحثاً عن اختراقات النطاق خلال جلستَي لندن ونيويورك. يُرشّح الدخول عبر التقلب (ATR) وحد أدنى لنطاق الجلسة، ويحمي كل صفقة بوقف ثابت وإدارة نقطة التعادل.",
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
    priceUSD: 349,
    exnessPriceUSD: 249,
    badge: "popular",
  },
  {
    slug: "fx-trend-rider",
    kind: "bot",
    name: "FX Trend Rider",
    asset: "EURUSD",
    assetLabel: {
      es: "EUR/USD y GBP/USD",
      en: "EUR/USD and GBP/USD",
      ar: "EUR/USD و GBP/USD",
    },
    timeframe: "H1",
    platform: "MT4 / MT5",
    strategyTag: {
      es: "Seguimiento de tendencia",
      en: "Trend following",
      ar: "تتبّع الاتجاه",
    },
    tagline: {
      es: "Sigue tendencias de medio plazo en los principales pares de divisas.",
      en: "Rides medium-term trends on the major currency pairs.",
      ar: "يركب اتجاهات متوسطة المدى على أزواج العملات الرئيسية.",
    },
    description: {
      es: "FX Trend Rider identifica tendencias en H1 con una combinación de medias móviles y estructura de mercado, y añade posiciones a favor de la tendencia mientras se mantenga válida. Usa stop dinámico por ATR y salidas parciales escalonadas.",
      en: "FX Trend Rider identifies H1 trends with a blend of moving averages and market structure, adding positions with the trend while it stays valid. It uses an ATR-based trailing stop and staggered partial exits.",
      ar: "يحدّد FX Trend Rider اتجاهات فريم H1 عبر مزيج من المتوسطات المتحركة وبنية السوق، ويضيف مراكز مع الاتجاه ما دام صالحاً. يستخدم وقفاً متحركاً مبنياً على ATR وخروجاً جزئياً متدرّجاً.",
    },
    features: {
      es: [
        "Optimizado para EUR/USD y GBP/USD en H1",
        "Detección de tendencia por medias + estructura",
        "Piramidación controlada con riesgo total limitado",
        "Trailing stop por ATR y salidas parciales",
        "Filtro de noticias de alto impacto opcional",
        "Riesgo por operación configurable en % de la cuenta",
      ],
      en: [
        "Optimised for EUR/USD and GBP/USD on H1",
        "Trend detection via moving averages + structure",
        "Controlled pyramiding with a capped total risk",
        "ATR trailing stop and partial exits",
        "Optional high-impact news filter",
        "Per-trade risk configurable as % of account",
      ],
      ar: [
        "مُحسَّن لأزواج EUR/USD و GBP/USD على H1",
        "كشف الاتجاه عبر المتوسطات المتحركة + البنية",
        "إضافة مراكز محكومة بمخاطرة إجمالية محدودة",
        "وقف متحرك عبر ATR وخروج جزئي",
        "مرشّح أخبار عالية التأثير اختياري",
        "مخاطرة لكل صفقة قابلة للضبط كنسبة % من الحساب",
      ],
    },
    howItWorks: {
      es: [
        "Evalúa la tendencia dominante en H1 y solo opera a su favor.",
        "Entra en el primer retroceso válido tras confirmarse la tendencia.",
        "Suma posiciones en retrocesos posteriores sin superar el riesgo máximo.",
        "Ajusta el stop tras el precio y toma parciales en niveles clave.",
      ],
      en: [
        "It reads the dominant H1 trend and only trades in its direction.",
        "It enters on the first valid pullback after the trend confirms.",
        "It adds positions on later pullbacks without exceeding max risk.",
        "It trails the stop behind price and takes partials at key levels.",
      ],
      ar: [
        "يقرأ الاتجاه المهيمن على H1 ويتداول في اتجاهه فقط.",
        "يدخل عند أول ارتداد صالح بعد تأكيد الاتجاه.",
        "يضيف مراكز عند ارتدادات لاحقة دون تجاوز الحد الأقصى للمخاطرة.",
        "يحرّك الوقف خلف السعر ويجني أرباحاً جزئية عند مستويات مهمة.",
      ],
    },
    priceUSD: 299,
    exnessPriceUSD: 199,
  },
  {
    slug: "range-guardian",
    kind: "bot",
    name: "Range Guardian",
    asset: "US30",
    assetLabel: {
      es: "US30 (Dow Jones)",
      en: "US30 (Dow Jones)",
      ar: "US30 (داو جونز)",
    },
    timeframe: "M15",
    platform: "MT5",
    strategyTag: {
      es: "Reversión en rango",
      en: "Range mean-reversion",
      ar: "ارتداد داخل النطاق",
    },
    tagline: {
      es: "Compra soportes y vende resistencias mientras el índice consolida.",
      en: "Fades the edges of the range while the index consolidates.",
      ar: "يتداول عكس حدود النطاق أثناء تجميع المؤشر.",
    },
    description: {
      es: "Range Guardian trabaja US30 en M15 durante fases de consolidación. Detecta rangos estables y opera reversión hacia la media desde los extremos, con stop ajustado y desactivación automática cuando el mercado entra en tendencia.",
      en: "Range Guardian trades US30 on M15 during consolidation phases. It detects stable ranges and mean-reverts from the extremes, with a tight stop and an automatic shut-off when the market turns trending.",
      ar: "يتداول Range Guardian مؤشر US30 على M15 خلال مراحل التجميع. يكتشف نطاقات مستقرة ويتداول الارتداد نحو المتوسط من الأطراف، بوقف ضيّق وإيقاف تلقائي عندما يتحول السوق إلى اتجاه.",
    },
    features: {
      es: [
        "US30 en M15, enfocado en horario de consolidación",
        "Detección de rango por volatilidad y solapamiento de velas",
        "Entradas de reversión en los extremos del rango",
        "Stop ajustado y objetivo en la media del rango",
        "Apagado automático ante ruptura de tendencia",
        "Horario operativo y spread máximo configurables",
      ],
      en: [
        "US30 on M15, focused on consolidation hours",
        "Range detection via volatility and candle overlap",
        "Mean-reversion entries at the range extremes",
        "Tight stop and target at the range midline",
        "Automatic shut-off on a trend breakout",
        "Configurable trading hours and max spread",
      ],
      ar: [
        "US30 على M15، بتركيز على ساعات التجميع",
        "كشف النطاق عبر التقلب وتداخل الشموع",
        "دخول ارتدادي عند أطراف النطاق",
        "وقف ضيّق وهدف عند منتصف النطاق",
        "إيقاف تلقائي عند اختراق اتجاهي",
        "ساعات تداول وحد أقصى للفارق السعري قابلان للضبط",
      ],
    },
    howItWorks: {
      es: [
        "Confirma que el precio está en rango con baja expansión de volatilidad.",
        "Vende en la resistencia del rango y compra en el soporte, con stop corto.",
        "Toma beneficio al volver a la media del rango.",
        "Si el precio rompe el rango con fuerza, deja de operar hasta un nuevo rango.",
      ],
      en: [
        "It confirms price is ranging with low volatility expansion.",
        "It sells the range high and buys the range low, with a short stop.",
        "It takes profit on the return to the range midline.",
        "If price breaks out strongly, it stops trading until a new range forms.",
      ],
      ar: [
        "يؤكّد أن السعر داخل نطاق مع توسّع تقلب منخفض.",
        "يبيع عند قمة النطاق ويشتري عند قاعه، بوقف قصير.",
        "يجني الربح عند العودة إلى منتصف النطاق.",
        "إذا اخترق السعر بقوة، يتوقف عن التداول حتى يتكوّن نطاق جديد.",
      ],
    },
    priceUSD: 279,
    exnessPriceUSD: 189,
    badge: "new",
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
