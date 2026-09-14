import "server-only";
import type { Localized } from "@/lib/products";

export const FILE_NAME = "xauusd-impulse-signal.indie.py";

export const INSTALL_INSTRUCTIONS: Localized = {
  es: [
    "Entrá a Exness Terminal desde la web (no está disponible en la app móvil) e iniciá sesión en tu cuenta de trading.",
    'Andá a la pestaña "Indicadores" y hacé clic en "Crear nuevo script".',
    "Borrá el código de ejemplo y pegá el código del archivo adjunto en este correo.",
    "Aplicá el script a tu gráfico de XAUUSD.",
    "Guardalo — queda disponible para reutilizar con un clic.",
  ].join("\n"),
  en: [
    "Open Exness Terminal from the web (not available on the mobile app) and sign in to your trading account.",
    'Go to the "Indicators" tab and click "Create new script".',
    "Delete the sample code and paste the code from the file attached to this email.",
    "Apply the script to your XAUUSD chart.",
    "Save it — it stays ready to reuse with one click.",
  ].join("\n"),
  ar: [
    "افتح Exness Terminal من متصفح الويب (غير متاح على تطبيق الجوال) وسجّل الدخول إلى حساب التداول الخاص بك.",
    'اذهب إلى تبويب "المؤشرات" واضغط على "إنشاء سكربت جديد".',
    "احذف الكود التجريبي والصق الكود الموجود في الملف المرفق بهذا البريد.",
    "طبّق السكربت على رسمك البياني لزوج XAUUSD.",
    "احفظه — يبقى جاهزاً لإعادة الاستخدام بنقرة واحدة.",
  ].join("\n"),
};

export const CODE = `# indie:lang_version = 5

from math import nan
from datetime import datetime
from indie import indicator, param, plot, color
from indie.algorithms import Atr, Ema


@indicator('XAUUSD Manual Impulse Signal', overlay_main_pane=True)
@param.int('atr_length', default=14, min=2, title='ATR length')
@param.int('fast_length', default=20, min=2, title='Fast EMA')
@param.int('slow_length', default=50, min=3, title='Slow EMA')
@param.float(
    'impulse_atr',
    default=1.20,
    min=0.10,
    title='Impulse ATR'
)
@param.float(
    'prealert_ratio',
    default=0.70,
    min=0.10,
    max=0.95,
    title='Pre-alert ratio'
)
@param.float(
    'stop_atr',
    default=0.90,
    min=0.10,
    title='Stop ATR'
)
@param.float(
    'target_r',
    default=1.50,
    min=0.10,
    title='Target R'
)

@plot.line(color=color.AQUA, line_width=1, title='EMA 20')
@plot.line(color=color.YELLOW, line_width=1, title='EMA 50')

@plot.marker(
    color=color.LIME,
    style=plot.marker_style.LABEL,
    position=plot.marker_position.BELOW,
    size=4,
    title='LONG'
)
@plot.marker(
    color=color.RED,
    style=plot.marker_style.LABEL,
    position=plot.marker_position.ABOVE,
    size=4,
    title='SHORT'
)
@plot.marker(
    color=color.RED,
    style=plot.marker_style.CROSS,
    position=plot.marker_position.CENTER,
    size=3,
    title='STOP'
)
@plot.marker(
    color=color.AQUA,
    style=plot.marker_style.CROSS,
    position=plot.marker_position.CENTER,
    size=3,
    title='TARGET'
)
@plot.marker(
    color=color.YELLOW,
    style=plot.marker_style.LABEL,
    position=plot.marker_position.BELOW,
    size=2,
    title='PRE-LONG'
)
@plot.marker(
    color=color.YELLOW,
    style=plot.marker_style.LABEL,
    position=plot.marker_position.ABOVE,
    size=2,
    title='PRE-SHORT'
)


def Main(
    self,
    atr_length,
    fast_length,
    slow_length,
    impulse_atr,
    prealert_ratio,
    stop_atr,
    target_r
):
    atr = Atr.new(atr_length)
    fast = Ema.new(self.close, fast_length)
    slow = Ema.new(self.close, slow_length)

    # Analiza la última vela cerrada
    body = self.close[1] - self.open[1]
    large_impulse = abs(body) > impulse_atr * atr[1]

    # Horario habilitado en UTC
    current_time = datetime.utcfromtimestamp(self.time[0])
    minute_utc = current_time.hour * 60 + current_time.minute

    weekday = current_time.weekday() < 5
    trading_hours = minute_utc >= 720 and minute_utc < 1020

    # Evita operar entre 13:25 y 13:50 UTC
    fixed_news_clear = not (
        minute_utc >= 805 and minute_utc < 830
    )

    allowed = weekday and trading_hours and fixed_news_clear

    # Señales confirmadas
    long_signal = (
        allowed
        and large_impulse
        and body > 0
        and fast[1] > slow[1]
    )

    short_signal = (
        allowed
        and large_impulse
        and body < 0
        and fast[1] < slow[1]
    )

    # Prealertas sobre la vela actual
    current_body = self.close[0] - self.open[0]
    prealert_level = prealert_ratio * impulse_atr * atr[0]

    pre_long = (
        allowed
        and current_body >= prealert_level
        and fast[0] > slow[0]
    )

    pre_short = (
        allowed
        and current_body <= -prealert_level
        and fast[0] < slow[0]
    )

    # Stop loss y objetivo orientativos
    entry = self.open[0]
    stop_distance = stop_atr * atr[1]

    long_stop = entry - stop_distance
    long_target = entry + target_r * stop_distance

    short_stop = entry + stop_distance
    short_target = entry - target_r * stop_distance

    stop_value = (
        long_stop
        if long_signal
        else short_stop
        if short_signal
        else nan
    )

    target_value = (
        long_target
        if long_signal
        else short_target
        if short_signal
        else nan
    )

    return (
        fast[0],
        slow[0],
        plot.Marker(
            entry if long_signal else nan,
            text='LONG'
        ),
        plot.Marker(
            entry if short_signal else nan,
            text='SHORT'
        ),
        plot.Marker(stop_value, text='SL'),
        plot.Marker(target_value, text='TP'),
        plot.Marker(
            self.low[0] if pre_long else nan,
            text='PRE-LONG'
        ),
        plot.Marker(
            self.high[0] if pre_short else nan,
            text='PRE-SHORT'
        ),
    )
`;
