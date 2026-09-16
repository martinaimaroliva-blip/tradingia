import "server-only";
import type { Localized } from "@/lib/products";

export const FILE_NAME_EA = "XAUUSD_Exness_ImpulseScalper.mq5";
export const FILE_NAME_SET = "XAUUSD_Exness_ImpulseScalper.set";

export const BONUS_NOTE: Localized = {
  es: "\n🎁 Bono incluido: el indicador visual XAUUSD Manual Impulse Signal, sin costo extra. Va adjunto y se instala por separado, en Exness Terminal:\n",
  en: "\n🎁 Included bonus: the XAUUSD Manual Impulse Signal visual indicator, at no extra cost. It's attached and installs separately, in Exness Terminal:\n",
  ar: "\n🎁 هدية مرفقة: مؤشر XAUUSD Manual Impulse Signal المرئي، دون تكلفة إضافية. مرفق ويُثبَّت بشكل منفصل في Exness Terminal:\n",
};

export const INSTALL_INSTRUCTIONS: Localized = {
  es: [
    "Cómo instalar el bot (MT5):",
    "Abrí MetaEditor desde tu MetaTrader 5 (Herramientas > MetaEditor, o F4).",
    `Copiá el archivo "${FILE_NAME_EA}" a la carpeta MQL5/Experts de tu terminal (Archivo > Abrir carpeta de datos, desde MT5).`,
    "En MetaEditor, abrí ese archivo y compilalo con F7 — genera el .ex5 que MT5 puede correr.",
    "En MT5, abrí un gráfico de XAUUSD en M5 y arrastrá el Expert Advisor desde el Navegador (Asesores Expertos) al gráfico.",
    `En la pestaña "Entradas" de la ventana que se abre, hacé clic en "Cargar" y elegí el archivo "${FILE_NAME_SET}" adjunto — trae la configuración de riesgo recomendada ya cargada.`,
    'Activá "Algo Trading" (el botón en la barra superior de MT5) para que el bot pueda operar en automático.',
  ].join("\n"),
  en: [
    "How to install the bot (MT5):",
    "Open MetaEditor from your MetaTrader 5 (Tools > MetaEditor, or F4).",
    `Copy the "${FILE_NAME_EA}" file into your terminal's MQL5/Experts folder (File > Open Data Folder, from MT5).`,
    "In MetaEditor, open that file and compile it with F7 — this produces the .ex5 MT5 actually runs.",
    "In MT5, open an XAUUSD M5 chart and drag the Expert Advisor from the Navigator (Expert Advisors) onto the chart.",
    `In the "Inputs" tab of the window that opens, click "Load" and pick the attached "${FILE_NAME_SET}" file — it loads the recommended risk configuration.`,
    `Turn on "Algo Trading" (the button in MT5's top toolbar) so the bot is allowed to trade automatically.`,
  ].join("\n"),
  ar: [
    "كيفية تثبيت البوت (MT5):",
    "افتح MetaEditor من MetaTrader 5 (Tools > MetaEditor، أو F4).",
    `انسخ الملف "${FILE_NAME_EA}" إلى مجلد MQL5/Experts في منصتك (File > Open Data Folder، من MT5).`,
    "في MetaEditor، افتح الملف واضغط F7 للترجمة — ينتج ملف .ex5 الذي يشغّله MT5 فعلياً.",
    "في MT5، افتح رسماً بيانياً لزوج XAUUSD على فريم 5 دقائق واسحب الخبير من نافذة المستكشف (Expert Advisors) إلى الرسم.",
    `في تبويب "Inputs" الذي يظهر، اضغط "Load" واختر الملف المرفق "${FILE_NAME_SET}" — يحمّل ضبط المخاطر الموصى به.`,
    'فعّل "Algo Trading" (الزر في شريط الأدوات العلوي في MT5) ليتمكّن البوت من التداول تلقائياً.',
  ].join("\n"),
};

export const CODE_EA = `#property copyright "Research build for Exness XAUUSD"
#property version   "1.10"
#property strict

#include <Trade/Trade.mqh>

input ENUM_TIMEFRAMES SignalTimeframe = PERIOD_M5;
input int    ATRPeriod                 = 14;
input int    FastEMAPeriod             = 20;
input int    SlowEMAPeriod             = 50;
input double ImpulseATR                = 1.20;
input double StopATR                   = 0.90;
input double TargetR                   = 1.50;
input int    MaxHoldBars               = 4;
input double RiskPerTradePct           = 0.10;
input int    MaxTradesPerUTCDate       = 2;
input double MaxDailyLossPct           = 0.30;
input double MaxWeeklyLossPct          = 0.75;
input double MaxAccountDrawdownPct     = 3.00;
input bool   CloseAtMaxDrawdown        = true;
input int    SessionStartUTC           = 12;
input int    SessionEndUTC             = 17;
input double MaxSpreadPrice            = 0.30;
input bool   UseEconomicCalendar       = true;
input bool   CalendarFailClosed        = true;
input int    NewsBlockBeforeMinutes    = 20;
input int    NewsBlockAfterMinutes     = 20;
input bool   UseFixedNewsWindows       = true;
input bool   UseMicroShockFilter       = true;
input int    ShockCooldownMinutes      = 30;
input int    ShockBaselineMinutes      = 60;
input double ShockRangeMultiple        = 4.0;
input int    SlippagePoints            = 100;
input long   MagicNumber               = 26083155;
input bool   EnableTrading             = true;
input bool   DrawSignalArrows          = true;
input bool   EnablePopupAlerts         = true;
input bool   EnablePushNotifications   = false;
input bool   MirrorIndicatorSignals    = true;

CTrade trade;
int atr_handle = INVALID_HANDLE;
int fast_handle = INVALID_HANDLE;
int slow_handle = INVALID_HANDLE;
datetime last_bar_time = 0;
double day_start_equity = 0.0;
double week_start_equity = 0.0;
double equity_peak = 0.0;
int tracked_year = -1;
int tracked_day = -1;
int tracked_week_year = -1;
int tracked_monday = -999;
bool hard_stop = false;
bool calendar_error_reported = false;

void RefreshRiskAnchors()
{
   MqlDateTime utc;
   TimeToStruct(TimeGMT(), utc);
   const double equity = AccountInfoDouble(ACCOUNT_EQUITY);
   if(tracked_year != utc.year || tracked_day != utc.day_of_year)
   {
      day_start_equity = equity;
      tracked_year = utc.year;
      tracked_day = utc.day_of_year;
   }
   const int monday = utc.day_of_year - ((utc.day_of_week + 6) % 7);
   if(tracked_week_year != utc.year || tracked_monday != monday)
   {
      week_start_equity = equity;
      tracked_week_year = utc.year;
      tracked_monday = monday;
   }
   equity_peak = MathMax(equity_peak, equity);
}

bool FindOwnPosition(ulong &ticket, ENUM_POSITION_TYPE &type, datetime &opened)
{
   for(int i=PositionsTotal()-1; i>=0; --i)
   {
      const ulong candidate = PositionGetTicket(i);
      if(candidate==0 || !PositionSelectByTicket(candidate))
         continue;
      if(PositionGetString(POSITION_SYMBOL)==_Symbol && PositionGetInteger(POSITION_MAGIC)==MagicNumber)
      {
         ticket=candidate;
         type=(ENUM_POSITION_TYPE)PositionGetInteger(POSITION_TYPE);
         opened=(datetime)PositionGetInteger(POSITION_TIME);
         return true;
      }
   }
   return false;
}

bool CloseTicket(const ulong ticket, const string reason)
{
   if(!trade.PositionClose(ticket, SlippagePoints) ||
      (trade.ResultRetcode()!=TRADE_RETCODE_DONE && trade.ResultRetcode()!=TRADE_RETCODE_DONE_PARTIAL))
   {
      Print(reason," close failed: ",trade.ResultRetcode()," ",trade.ResultRetcodeDescription());
      return false;
   }
   return true;
}

void EmergencyClose()
{
   for(int i=PositionsTotal()-1; i>=0; --i)
   {
      const ulong ticket=PositionGetTicket(i);
      if(ticket>0 && PositionSelectByTicket(ticket) && PositionGetString(POSITION_SYMBOL)==_Symbol &&
         PositionGetInteger(POSITION_MAGIC)==MagicNumber)
         CloseTicket(ticket,"Emergency");
   }
}

int TradesOpenedToday()
{
   MqlDateTime utc;
   TimeToStruct(TimeGMT(),utc);
   utc.hour=0; utc.min=0; utc.sec=0;
   const datetime utc_start=StructToTime(utc);
   // History is stored as server timestamps; offset the UTC boundary to server time.
   const long offset=(long)(TimeTradeServer()-TimeGMT());
   if(!HistorySelect(utc_start+offset,TimeTradeServer()))
      return MaxTradesPerUTCDate;
   int count=0;
   for(int i=0;i<HistoryDealsTotal();++i)
   {
      const ulong deal=HistoryDealGetTicket(i);
      if(deal>0 && HistoryDealGetString(deal,DEAL_SYMBOL)==_Symbol &&
         HistoryDealGetInteger(deal,DEAL_MAGIC)==MagicNumber &&
         HistoryDealGetInteger(deal,DEAL_ENTRY)==DEAL_ENTRY_IN)
         ++count;
   }
   return count;
}

bool RiskAllowsEntry()
{
   RefreshRiskAnchors();
   const double equity=AccountInfoDouble(ACCOUNT_EQUITY);
   if(hard_stop || equity<=0.0)
      return false;
   if(day_start_equity>0.0 && equity<=day_start_equity*(1.0-MaxDailyLossPct/100.0))
      return false;
   if(week_start_equity>0.0 && equity<=week_start_equity*(1.0-MaxWeeklyLossPct/100.0))
      return false;
   if(equity_peak>0.0 && equity<=equity_peak*(1.0-MaxAccountDrawdownPct/100.0))
   {
      hard_stop=true;
      return false;
   }
   return TradesOpenedToday()<MaxTradesPerUTCDate;
}

bool SessionOK()
{
   MqlDateTime utc;
   TimeToStruct(TimeGMT(),utc);
   return utc.day_of_week>=1 && utc.day_of_week<=5 &&
          utc.hour>=SessionStartUTC && utc.hour<SessionEndUTC;
}

bool SpreadOK(double &spread)
{
   MqlTick tick;
   if(!SymbolInfoTick(_Symbol,tick))
   {
      spread=0.0;
      return false;
   }
   spread=tick.ask-tick.bid;
   return spread<=MaxSpreadPrice;
}

bool InFixedNewsWindow()
{
   if(!UseFixedNewsWindows)
      return false;
   MqlDateTime utc;
   TimeToStruct(TimeGMT(),utc);
   const int minute_of_day=utc.hour*60+utc.min;
   return (minute_of_day>=13*60+25 && minute_of_day<13*60+50) ||
          (minute_of_day>=18*60+55 && minute_of_day<19*60+15);
}

bool HighImpactUSDNewsWindow()
{
   if(!UseEconomicCalendar || MQLInfoInteger(MQL_TESTER))
      return false;
   const datetime server_now=TimeTradeServer();
   MqlCalendarValue values[];
   ResetLastError();
   const int count=CalendarValueHistory(values,
                                        server_now-NewsBlockAfterMinutes*60,
                                        server_now+NewsBlockBeforeMinutes*60,
                                        "","USD");
   if(count<0)
   {
      if(!calendar_error_reported)
      {
         Print("Economic calendar unavailable. Error ",GetLastError());
         calendar_error_reported=true;
      }
      return CalendarFailClosed;
   }
   calendar_error_reported=false;
   for(int i=0;i<count;++i)
   {
      MqlCalendarEvent event;
      if(CalendarEventById(values[i].event_id,event) && event.importance==CALENDAR_IMPORTANCE_HIGH)
         return true;
   }
   return false;
}

bool RecentMicroShock()
{
   if(!UseMicroShockFilter)
      return false;
   const int needed=ShockCooldownMinutes+ShockBaselineMinutes+2;
   MqlRates minute_bars[];
   ArraySetAsSeries(minute_bars,true);
   if(CopyRates(_Symbol,PERIOD_M1,0,needed,minute_bars)!=needed)
      return true;
   for(int i=1;i<=ShockCooldownMinutes;++i)
   {
      double baseline[];
      ArrayResize(baseline,ShockBaselineMinutes);
      for(int j=0;j<ShockBaselineMinutes;++j)
         baseline[j]=minute_bars[i+1+j].high-minute_bars[i+1+j].low;
      ArraySort(baseline);
      const int middle=ShockBaselineMinutes/2;
      double median=baseline[middle];
      if((ShockBaselineMinutes%2)==0)
         median=(baseline[middle-1]+baseline[middle])/2.0;
      const double recent_range=minute_bars[i].high-minute_bars[i].low;
      if(median>0.0 && recent_range>ShockRangeMultiple*median)
         return true;
   }
   return false;
}

double VolumeForRisk(const ENUM_ORDER_TYPE order_type,const double entry,const double stop)
{
   const double risk_money=AccountInfoDouble(ACCOUNT_EQUITY)*RiskPerTradePct/100.0;
   double one_lot_loss=0.0;
   if(!OrderCalcProfit(order_type,_Symbol,1.0,entry,stop,one_lot_loss) || one_lot_loss==0.0)
      return 0.0;
   const double min_volume=SymbolInfoDouble(_Symbol,SYMBOL_VOLUME_MIN);
   const double max_volume=SymbolInfoDouble(_Symbol,SYMBOL_VOLUME_MAX);
   const double step=SymbolInfoDouble(_Symbol,SYMBOL_VOLUME_STEP);
   double volume=MathFloor((risk_money/MathAbs(one_lot_loss))/step)*step;
   if(volume<min_volume)
      return 0.0;
   return NormalizeDouble(MathMin(volume,max_volume),8);
}

bool LoadSignal(MqlRates &bar,double &atr,double &ema_fast,double &ema_slow)
{
   MqlRates rates[];
   ArraySetAsSeries(rates,true);
   if(CopyRates(_Symbol,SignalTimeframe,0,3,rates)!=3)
      return false;
   double av[1],fv[1],sv[1];
   if(CopyBuffer(atr_handle,0,1,1,av)!=1 || CopyBuffer(fast_handle,0,1,1,fv)!=1 ||
      CopyBuffer(slow_handle,0,1,1,sv)!=1)
      return false;
   bar=rates[1]; atr=av[0]; ema_fast=fv[0]; ema_slow=sv[0];
   return atr>0.0;
}

void EmitSignal(const bool is_long,const MqlRates &bar,const double entry,
                const double stop,const double target)
{
   const string side=is_long ? "LONG" : "SHORT";
   const string message=StringFormat("%s %s M5 | Entry %.2f | SL %.2f | TP %.2f",
                                     _Symbol,side,entry,stop,target);

   if(DrawSignalArrows)
   {
      const string name=StringFormat("ImpulseSignal_%s_%I64d",side,(long)bar.time);
      const double arrow_price=is_long ? bar.low : bar.high;
      if(ObjectFind(0,name)<0 && ObjectCreate(0,name,OBJ_ARROW,0,bar.time,arrow_price))
      {
         ObjectSetInteger(0,name,OBJPROP_ARROWCODE,is_long ? 233 : 234);
         ObjectSetInteger(0,name,OBJPROP_COLOR,is_long ? clrLime : clrRed);
         ObjectSetInteger(0,name,OBJPROP_WIDTH,2);
         ObjectSetInteger(0,name,OBJPROP_SELECTABLE,false);
      }
   }

   Print(message);
   if(!MQLInfoInteger(MQL_TESTER))
   {
      if(EnablePopupAlerts)
         Alert(message);
      if(EnablePushNotifications && !SendNotification(message))
         Print("Push notification failed: ",GetLastError());
   }
}

void ReportSkippedSignal(const string reason)
{
   Print("Confirmed web-indicator signal skipped: ",reason);
}

void ProcessNewBar()
{
   ulong ticket=0;
   ENUM_POSITION_TYPE position_type;
   datetime opened=0;
   bool has_position=FindOwnPosition(ticket,position_type,opened);
   if(has_position && TimeCurrent()-opened>=MaxHoldBars*PeriodSeconds(SignalTimeframe))
   {
      CloseTicket(ticket,"Time exit");
      has_position=FindOwnPosition(ticket,position_type,opened);
   }

   // These are the only pre-signal time filters used by the Indie indicator.
   if(!SessionOK() || InFixedNewsWindow())
      return;

   MqlRates bar;
   double atr,ema_fast,ema_slow;
   if(!LoadSignal(bar,atr,ema_fast,ema_slow))
      return;
   const double body=bar.close-bar.open;
   if(MathAbs(body)<=ImpulseATR*atr)
      return;

   MqlTick tick;
   if(!SymbolInfoTick(_Symbol,tick))
      return;
   const int digits=(int)SymbolInfoInteger(_Symbol,SYMBOL_DIGITS);
   const double min_stop=SymbolInfoInteger(_Symbol,SYMBOL_TRADE_STOPS_LEVEL)*SymbolInfoDouble(_Symbol,SYMBOL_POINT);
   const double distance=MathMax(StopATR*atr,min_stop);

   const bool is_long=body>0.0 && ema_fast>ema_slow;
   const bool is_short=body<0.0 && ema_fast<ema_slow;
   if(!is_long && !is_short)
      return;

   double entry=0.0;
   double sl=0.0;
   double tp=0.0;
   ENUM_ORDER_TYPE order_type=ORDER_TYPE_BUY;
   if(is_long)
   {
      entry=tick.ask;
      sl=NormalizeDouble(entry-distance,digits);
      tp=NormalizeDouble(entry+TargetR*distance,digits);
      order_type=ORDER_TYPE_BUY;
   }
   else
   {
      entry=tick.bid;
      sl=NormalizeDouble(entry+distance,digits);
      tp=NormalizeDouble(entry-TargetR*distance,digits);
      order_type=ORDER_TYPE_SELL;
   }

   // Always expose the same confirmed technical signal as the web indicator.
   EmitSignal(is_long,bar,entry,sl,tp);

   if(!EnableTrading)
   {
      ReportSkippedSignal("EnableTrading=false");
      return;
   }
   if(has_position)
   {
      ReportSkippedSignal("another bot position is already open");
      return;
   }
   if(!RiskAllowsEntry())
   {
      ReportSkippedSignal("daily/weekly/drawdown/trade-count risk limit");
      return;
   }
   double spread=0.0;
   if(!SpreadOK(spread))
   {
      ReportSkippedSignal(StringFormat("spread %.3f exceeds %.3f",spread,MaxSpreadPrice));
      return;
   }
   if(!MirrorIndicatorSignals && HighImpactUSDNewsWindow())
   {
      ReportSkippedSignal("high-impact USD calendar window");
      return;
   }
   if(!MirrorIndicatorSignals && RecentMicroShock())
   {
      ReportSkippedSignal("M1 micro-shock filter");
      return;
   }

   const double volume=VolumeForRisk(order_type,entry,sl);
   if(volume<=0.0)
   {
      ReportSkippedSignal("calculated volume is below the broker minimum");
      return;
   }

   bool sent=false;
   if(is_long)
      sent=trade.Buy(volume,_Symbol,0.0,sl,tp,"Indicator mirror long");
   else
      sent=trade.Sell(volume,_Symbol,0.0,sl,tp,"Indicator mirror short");
   if(!sent || (trade.ResultRetcode()!=TRADE_RETCODE_DONE &&
                trade.ResultRetcode()!=TRADE_RETCODE_DONE_PARTIAL))
      Print("Order failed: ",trade.ResultRetcode()," ",trade.ResultRetcodeDescription());
   else
      Print("Order opened from confirmed web-indicator signal. Volume=",volume);
}

int OnInit()
{
   if(ATRPeriod<2 || FastEMAPeriod<2 || SlowEMAPeriod<=FastEMAPeriod || ImpulseATR<=0.0 ||
      StopATR<=0.0 || TargetR<=0.0 || MaxHoldBars<1 || RiskPerTradePct<=0.0 ||
      SessionStartUTC<0 || SessionEndUTC>24 || SessionStartUTC>=SessionEndUTC ||
      ShockCooldownMinutes<1 || ShockBaselineMinutes<10)
      return INIT_PARAMETERS_INCORRECT;
   atr_handle=iATR(_Symbol,SignalTimeframe,ATRPeriod);
   fast_handle=iMA(_Symbol,SignalTimeframe,FastEMAPeriod,0,MODE_EMA,PRICE_CLOSE);
   slow_handle=iMA(_Symbol,SignalTimeframe,SlowEMAPeriod,0,MODE_EMA,PRICE_CLOSE);
   if(atr_handle==INVALID_HANDLE || fast_handle==INVALID_HANDLE || slow_handle==INVALID_HANDLE)
      return INIT_FAILED;
   trade.SetExpertMagicNumber(MagicNumber);
   trade.SetDeviationInPoints(SlippagePoints);
   trade.SetTypeFillingBySymbol(_Symbol);
   const double equity=AccountInfoDouble(ACCOUNT_EQUITY);
   day_start_equity=week_start_equity=equity_peak=equity;
   RefreshRiskAnchors();
   last_bar_time=iTime(_Symbol,SignalTimeframe,0);
   return INIT_SUCCEEDED;
}

void OnDeinit(const int reason)
{
   if(atr_handle!=INVALID_HANDLE) IndicatorRelease(atr_handle);
   if(fast_handle!=INVALID_HANDLE) IndicatorRelease(fast_handle);
   if(slow_handle!=INVALID_HANDLE) IndicatorRelease(slow_handle);
}

void OnTick()
{
   RefreshRiskAnchors();
   const double equity=AccountInfoDouble(ACCOUNT_EQUITY);
   if(!hard_stop && equity_peak>0.0 && equity<=equity_peak*(1.0-MaxAccountDrawdownPct/100.0))
   {
      hard_stop=true;
      if(CloseAtMaxDrawdown)
         EmergencyClose();
   }
   const datetime current_bar=iTime(_Symbol,SignalTimeframe,0);
   if(current_bar>0 && current_bar!=last_bar_time)
   {
      last_bar_time=current_bar;
      ProcessNewBar();
   }
}
`;

export const CODE_SET = `SignalTimeframe=5||0||0||49153||N
ATRPeriod=14||14||1||140||N
FastEMAPeriod=20||20||1||200||N
SlowEMAPeriod=50||50||1||500||N
ImpulseATR=1.20||1.20||0.05||3.00||N
StopATR=0.90||0.90||0.05||3.00||N
TargetR=1.50||1.50||0.10||5.00||N
MaxHoldBars=4||4||1||12||N
RiskPerTradePct=0.10||0.10||0.05||0.50||N
MaxTradesPerUTCDate=2||2||1||5||N
MaxDailyLossPct=0.30||0.30||0.05||2.00||N
MaxWeeklyLossPct=0.75||0.75||0.05||5.00||N
MaxAccountDrawdownPct=3.00||3.00||0.25||10.00||N
CloseAtMaxDrawdown=true||false||0||true||N
SessionStartUTC=12||12||1||23||N
SessionEndUTC=17||17||1||24||N
MaxSpreadPrice=0.30||0.30||0.01||1.00||N
UseEconomicCalendar=true||false||0||true||N
CalendarFailClosed=true||false||0||true||N
NewsBlockBeforeMinutes=20||20||5||60||N
NewsBlockAfterMinutes=20||20||5||60||N
UseFixedNewsWindows=true||false||0||true||N
UseMicroShockFilter=true||false||0||true||N
ShockCooldownMinutes=30||30||5||60||N
ShockBaselineMinutes=60||60||10||180||N
ShockRangeMultiple=4.0||4.0||0.25||10.0||N
SlippagePoints=100||100||10||500||N
MagicNumber=26083155||26083155||1||99999999||N
EnableTrading=true||false||0||true||N
DrawSignalArrows=true||false||0||true||N
EnablePopupAlerts=true||false||0||true||N
EnablePushNotifications=false||false||0||true||N
MirrorIndicatorSignals=true||false||0||true||N
`;
