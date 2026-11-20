import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Camera,
  Car,
  Check,
  Copy,
  List,
  MapPin,
  MessageCircle,
  Minus,
  PlaneLanding,
  PlaneTakeoff,
  Plus,
  Send,
  Users,
} from 'lucide-react';
import {
  AIRPORT_DIRECTIONS,
  AIRPORT_TERMINALS,
  CAR_MODELS,
  TRIP_VIBE_OPTIONS,
} from '../data/defaultData';
import { BookingState, SiteConfig, TourDataMap, TourPackage } from '../types';
import { buildWhatsAppUrl, copyToClipboard } from '../utils/booking';
import { ResilientImage } from './ResilientImage';

interface BookingCustomizerProps {
  config: SiteConfig;
  tours: TourDataMap;
  booking: BookingState;
  activeTour: TourPackage;
  orderMessage: string;
  onUpdateBooking: (patch: Partial<BookingState>) => void;
  onSelectDestination: (destId: string) => void;
  onToggleSpot: (destId: string, spotId: string) => void;
  onToggleAllSpots: (destId: string, selected: boolean) => void;
  onOpenWeChat: () => void;
  onOpenPoster: () => void;
  onNotify: (msg: string) => void;
}

const STEPS: Array<{ step: 1 | 2 | 3 | 4; label: string }> = [
  { step: 1, label: '1. 选择路线' },
  { step: 2, label: '2. 车型人数' },
  { step: 3, label: '3. 景点或接送' },
  { step: 4, label: '4. 发送预约' },
];

export function BookingCustomizer({
  config,
  tours,
  booking,
  activeTour,
  orderMessage,
  onUpdateBooking,
  onSelectDestination,
  onToggleSpot,
  onToggleAllSpots,
  onOpenWeChat,
  onOpenPoster,
  onNotify,
}: BookingCustomizerProps) {
  const totalPax = booking.adults + booking.children;
  const perPerson = Math.round(activeTour.price / Math.max(1, totalPax));
  const selectedSpots = (activeTour.spots || []).filter((s) => s.selected);
  const waOrderUrl = buildWhatsAppUrl(config.waPhone, orderMessage);
  const isAirport = activeTour.id === 'airport';

  const handleCopyOrder = async () => {
    await copyToClipboard(orderMessage);
    onNotify('专属行程网单已复制，可直接粘贴到微信或 WhatsApp');
  };

  return (
    <section id="customizer" className="max-w-6xl mx-auto px-4 sm:px-6 py-14 sm:py-16">
      {/* Section Header + Stepper */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <p className="text-xs font-semibold text-amber-700 tracking-wide">
            在线预约网单 · 自由定制行程
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 mt-1 text-balance">
            4 步定制您的专属吉隆坡包车行程
          </h2>
        </div>

        {/* Interactive Step Switcher */}
        <div
          className="grid grid-cols-4 gap-1 p-1 bg-stone-200/70 rounded-xl w-full md:w-auto"
          role="tablist"
          aria-label="定制步骤"
        >
          {STEPS.map(({ step, label }) => {
            const isCurrent = booking.currentStep === step;
            const isDone = booking.currentStep > step;
            return (
              <button
                key={step}
                type="button"
                role="tab"
                aria-selected={isCurrent}
                onClick={() => onUpdateBooking({ currentStep: step })}
                className={`px-2.5 sm:px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  isCurrent
                    ? 'bg-white text-stone-900 shadow-xs'
                    : isDone
                      ? 'text-emerald-800 hover:text-stone-900'
                      : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main 12-Col Grid */}
      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Left 7 Cols: Interactive Step Panel */}
        <div className="lg:col-span-7 bg-white border border-stone-200 rounded-2xl p-5 sm:p-7">
          {/* STEP 1: Choose Package */}
          {booking.currentStep === 1 && (
            <div className="space-y-6">
              <div className="flex items-baseline justify-between border-b border-stone-200 pb-4">
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-stone-900">
                    第一步：选择包车路线或机场接送
                  </h3>
                  <p className="text-xs text-stone-500 mt-1">
                    私人专车不拼团 · 10小时自由游与景点讲解（不含全程跟拍，如需跟拍另外收费）
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {Object.values(tours).map((pkg) => {
                  const selected = booking.destination === pkg.id;
                  const summaryText =
                    pkg.id === 'airport'
                      ? '提供 KLIA 1 / KLIA 2 往返吉隆坡酒店或住家点对点接送，KL范围 RM200起。'
                      : pkg.spots.length > 0
                        ? pkg.spots.map((s) => s.name.split(' ')[0]).join(' · ')
                        : pkg.subtitle;

                  return (
                    <button
                      key={pkg.id}
                      type="button"
                      onClick={() => onSelectDestination(pkg.id)}
                      className={`w-full text-left rounded-xl border transition-all overflow-hidden flex flex-col sm:flex-row focus-visible:outline-2 focus-visible:outline-amber-600 ${
                        selected
                          ? 'border-amber-600 bg-amber-50/40 ring-1 ring-amber-600/30'
                          : 'border-stone-200 bg-white hover:border-stone-300'
                      }`}
                    >
                      <div className="sm:w-44 h-36 sm:h-auto shrink-0 relative bg-stone-100">
                        <ResilientImage
                          src={pkg.bannerImg}
                          alt={pkg.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 p-4 flex flex-col justify-between gap-3">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 text-xs text-stone-500">
                              <span>{pkg.id === 'airport' ? '机场接送' : '包车一日游'}</span>
                              <span aria-hidden="true">·</span>
                              <span>{pkg.durationText}</span>
                            </div>
                            <h4 className="text-base font-bold text-stone-900 mt-0.5">
                              {pkg.name}
                            </h4>
                          </div>
                          <div className="text-right shrink-0">
                            <span className="text-[11px] text-stone-500 block">
                              {pkg.priceLabel}
                            </span>
                            <span className="text-lg font-extrabold text-amber-700 tabular-nums">
                              {pkg.priceText}
                            </span>
                          </div>
                        </div>

                        <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                          {summaryText}
                        </p>

                        <div className="flex items-center justify-between pt-2 border-t border-stone-200/70 text-xs">
                          <span className="text-stone-500">{pkg.subtitle}</span>
                          <span
                            className={`font-semibold flex items-center gap-1 whitespace-nowrap shrink-0 ${
                              selected ? 'text-amber-700' : 'text-stone-600'
                            }`}
                          >
                            {selected ? (
                              <>
                                <Check className="w-3.5 h-3.5" /> 已选择
                              </>
                            ) : (
                              '选择路线'
                            )}
                          </span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => onUpdateBooking({ currentStep: 2 })}
                  className="px-6 py-3 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-sm font-semibold flex items-center gap-2 transition-colors whitespace-nowrap"
                >
                  下一步：选择专车与人数
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Vehicle & Pax */}
          {booking.currentStep === 2 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-stone-200 pb-4">
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-stone-900">
                    第二步：选择专车车型、人数与日期
                  </h3>
                  <p className="text-xs text-stone-500 mt-1">
                    两款热门宽敞 MPV 任选，冷气充足整洁舒适
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onUpdateBooking({ currentStep: 1 })}
                  className="text-xs font-semibold text-stone-500 hover:text-stone-900 flex items-center gap-1 whitespace-nowrap shrink-0"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> 更换路线
                </button>
              </div>

              {/* Car Selector */}
              <div className="grid sm:grid-cols-2 gap-4">
                {CAR_MODELS.map((car) => {
                  const isSelected = booking.carModel === car.fullName;
                  return (
                    <button
                      key={car.id}
                      type="button"
                      onClick={() => {
                        onUpdateBooking({ carModel: car.fullName });
                        onNotify(`已选择专车：${car.shortName}`);
                      }}
                      className={`text-left rounded-xl border p-4 transition-all focus-visible:outline-2 focus-visible:outline-amber-600 ${
                        isSelected
                          ? 'border-amber-600 bg-amber-50/40 ring-1 ring-amber-600/30'
                          : 'border-stone-200 bg-white hover:border-stone-300'
                      }`}
                    >
                      <div className="h-32 rounded-lg bg-white border border-stone-100 mb-3 flex items-center justify-center p-2 overflow-hidden">
                        <ResilientImage
                          src={config[car.imgKey]}
                          alt={car.shortName}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="font-bold text-base text-stone-900">
                            {car.shortName}
                          </h4>
                          <p className="text-xs text-stone-500 mt-0.5">
                            {car.capacity} · {car.highlight}
                          </p>
                        </div>
                        <span
                          className={`text-xs font-semibold whitespace-nowrap shrink-0 ${
                            isSelected ? 'text-amber-700' : 'text-stone-400'
                          }`}
                        >
                          {isSelected ? '已选' : '选择'}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Pax Steppers */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="border border-stone-200 rounded-xl p-4 flex items-center justify-between bg-stone-50/50">
                  <div>
                    <p className="text-sm font-bold text-stone-900">大人人数</p>
                    <p className="text-xs text-stone-500">12岁或以上乘客</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      aria-label="减少大人人数"
                      onClick={() =>
                        onUpdateBooking({ adults: Math.max(1, booking.adults - 1) })
                      }
                      className="w-10 h-10 rounded-lg border border-stone-300 bg-white hover:bg-stone-100 text-stone-800 flex items-center justify-center transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="text-lg font-bold text-stone-900 w-6 text-center tabular-nums">
                      {booking.adults}
                    </span>
                    <button
                      type="button"
                      aria-label="增加大人人数"
                      onClick={() =>
                        onUpdateBooking({ adults: Math.min(40, booking.adults + 1) })
                      }
                      className="w-10 h-10 rounded-lg bg-stone-900 hover:bg-stone-800 text-white flex items-center justify-center transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="border border-stone-200 rounded-xl p-4 flex items-center justify-between bg-stone-50/50">
                  <div>
                    <p className="text-sm font-bold text-stone-900">小孩人数</p>
                    <p className="text-xs text-stone-500">12岁以下儿童</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      aria-label="减少小孩人数"
                      onClick={() =>
                        onUpdateBooking({ children: Math.max(0, booking.children - 1) })
                      }
                      className="w-10 h-10 rounded-lg border border-stone-300 bg-white hover:bg-stone-100 text-stone-800 flex items-center justify-center transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="text-lg font-bold text-stone-900 w-6 text-center tabular-nums">
                      {booking.children}
                    </span>
                    <button
                      type="button"
                      aria-label="增加小孩人数"
                      onClick={() =>
                        onUpdateBooking({ children: Math.min(20, booking.children + 1) })
                      }
                      className="w-10 h-10 rounded-lg bg-stone-900 hover:bg-stone-800 text-white flex items-center justify-center transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Per-person estimate */}
              <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl px-4 py-3 flex items-center justify-between gap-4">
                <span className="text-xs sm:text-sm text-stone-700">
                  共 <strong className="text-stone-900 tabular-nums">{totalPax}</strong>{' '}
                  人同行，专车费用人均折合约：
                </span>
                <span className="text-base sm:text-lg font-extrabold text-amber-800 tabular-nums whitespace-nowrap">
                  RM {perPerson}
                  {isAirport ? '起' : ''} / 人
                </span>
              </div>

              {/* Date & Pickup */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="booking-date"
                    className="block text-xs font-semibold text-stone-700 mb-1.5"
                  >
                    用车日期（选填）
                  </label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      id="booking-date"
                      type="date"
                      value={booking.date}
                      onChange={(e) => onUpdateBooking({ date: e.target.value })}
                      className="w-full pl-10 pr-3.5 py-2.5 text-sm border border-stone-300 focus:border-amber-600 rounded-xl bg-white outline-none tabular-nums"
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="pickup-location"
                    className="block text-xs font-semibold text-stone-700 mb-1.5"
                  >
                    上车地点 / 酒店名称
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      id="pickup-location"
                      type="text"
                      value={booking.pickupLocation}
                      onChange={(e) => onUpdateBooking({ pickupLocation: e.target.value })}
                      placeholder="例如：KLCC 酒店 / 武吉免登 / 住家地址"
                      className="w-full pl-10 pr-3.5 py-2.5 text-sm border border-stone-300 focus:border-amber-600 rounded-xl bg-white outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => onUpdateBooking({ currentStep: 1 })}
                  className="px-5 py-3 rounded-xl border border-stone-300 text-stone-700 hover:bg-stone-50 text-sm font-semibold transition-colors whitespace-nowrap"
                >
                  上一步
                </button>
                <button
                  type="button"
                  onClick={() => onUpdateBooking({ currentStep: 3 })}
                  className="px-6 py-3 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-sm font-semibold flex items-center gap-2 transition-colors whitespace-nowrap"
                >
                  {isAirport ? '下一步：填写接送详情' : '下一步：自由勾选景点'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Attractions OR Airport Transfer */}
          {booking.currentStep === 3 && (
            <div className="space-y-6">
              {!isAirport ? (
                <>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200 pb-4">
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-stone-900">
                        第三步：勾选想去的打卡景点
                      </h3>
                      <p className="text-xs text-stone-500 mt-1">
                        不限制死板时间，司导 Jack 按最顺路路线带您游览并讲解当地特色
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => onToggleAllSpots(activeTour.id, true)}
                        className="px-3 py-1.5 rounded-lg border border-stone-300 text-xs font-semibold text-stone-700 hover:bg-stone-50 whitespace-nowrap transition-colors"
                      >
                        全选热门
                      </button>
                      <button
                        type="button"
                        onClick={() => onToggleAllSpots(activeTour.id, false)}
                        className="px-3 py-1.5 rounded-lg border border-stone-200 text-xs font-semibold text-stone-500 hover:text-stone-900 hover:bg-stone-50 whitespace-nowrap transition-colors"
                      >
                        清空
                      </button>
                    </div>
                  </div>

                  {activeTour.spots.length === 0 ? (
                    <div className="text-center py-8 text-xs text-stone-500 bg-stone-50 rounded-xl border border-stone-200">
                      此路线暂未设置预设景点，请在下方备注栏自由填写想去的地方。
                    </div>
                  ) : (
                    <div className="grid sm:grid-cols-2 gap-3.5 max-h-[460px] overflow-y-auto pr-1">
                      {activeTour.spots.map((spot) => (
                        <button
                          key={spot.id}
                          type="button"
                          onClick={() => onToggleSpot(activeTour.id, spot.id)}
                          className={`text-left rounded-xl border overflow-hidden flex flex-col transition-all focus-visible:outline-2 focus-visible:outline-amber-600 ${
                            spot.selected
                              ? 'border-amber-600 bg-amber-50/30 ring-1 ring-amber-600/25'
                              : 'border-stone-200 bg-white opacity-75 hover:opacity-100'
                          }`}
                        >
                          <div className="h-28 w-full relative bg-stone-100">
                            <ResilientImage
                              src={spot.img}
                              alt={spot.name}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                            <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-white text-xs">
                              <span className="font-medium">{spot.tag}</span>
                              <span className="font-semibold flex items-center gap-1">
                                {spot.selected ? (
                                  <>
                                    <Check className="w-3.5 h-3.5 text-amber-300" /> 已选
                                  </>
                                ) : (
                                  '加入'
                                )}
                              </span>
                            </div>
                          </div>
                          <div className="p-3.5">
                            <h4 className="font-bold text-sm text-stone-900 truncate">
                              {spot.name}
                            </h4>
                            <p className="text-xs text-stone-600 mt-1 line-clamp-2 leading-relaxed">
                              {spot.desc}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                  <div>
                    <label
                      htmlFor="custom-spots"
                      className="block text-xs font-semibold text-stone-700 mb-1.5"
                    >
                      还有其他想去的地点、想吃的餐厅或顺路接送要求？（选填）
                    </label>
                    <input
                      id="custom-spots"
                      type="text"
                      value={booking.customSpots}
                      onChange={(e) => onUpdateBooking({ customSpots: e.target.value })}
                      placeholder="例如：顺路吃猫山王榴莲、买手信、或回程送到指定餐厅"
                      className="w-full px-3.5 py-2.5 text-sm border border-stone-300 focus:border-amber-600 rounded-xl bg-white outline-none"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="border-b border-stone-200 pb-4">
                    <h3 className="text-lg sm:text-xl font-bold text-stone-900">
                      第三步：填写吉隆坡机场接送详情
                    </h3>
                    <p className="text-xs text-stone-500 mt-1">
                      吉隆坡（KL）范围 RM 200 起跳，提交后 Jack 将按具体地点为您确认最终价格
                    </p>
                  </div>

                  {/* Pick-up vs Drop-off */}
                  <div className="grid sm:grid-cols-2 gap-3.5">
                    <button
                      type="button"
                      onClick={() =>
                        onUpdateBooking({ airportDirection: AIRPORT_DIRECTIONS.pickup })
                      }
                      className={`text-left p-4 rounded-xl border flex items-start gap-3 transition-all ${
                        booking.airportDirection === AIRPORT_DIRECTIONS.pickup
                          ? 'border-amber-600 bg-amber-50/40 ring-1 ring-amber-600/30'
                          : 'border-stone-200 bg-white hover:border-stone-300'
                      }`}
                    >
                      <div className="w-10 h-10 rounded-lg bg-stone-100 text-stone-800 flex items-center justify-center shrink-0">
                        <PlaneLanding className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-bold text-sm text-stone-900">机场接机</p>
                        <p className="text-xs text-stone-500 mt-0.5">
                          KLIA / KLIA2 接您直达酒店或住家
                        </p>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        onUpdateBooking({ airportDirection: AIRPORT_DIRECTIONS.dropoff })
                      }
                      className={`text-left p-4 rounded-xl border flex items-start gap-3 transition-all ${
                        booking.airportDirection === AIRPORT_DIRECTIONS.dropoff
                          ? 'border-amber-600 bg-amber-50/40 ring-1 ring-amber-600/30'
                          : 'border-stone-200 bg-white hover:border-stone-300'
                      }`}
                    >
                      <div className="w-10 h-10 rounded-lg bg-stone-100 text-stone-800 flex items-center justify-center shrink-0">
                        <PlaneTakeoff className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-bold text-sm text-stone-900">专车送机</p>
                        <p className="text-xs text-stone-500 mt-0.5">
                          酒店或住家准时接您送往机场
                        </p>
                      </div>
                    </button>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="airport-terminal"
                        className="block text-xs font-semibold text-stone-700 mb-1.5"
                      >
                        航站楼
                      </label>
                      <select
                        id="airport-terminal"
                        value={booking.airportTerminal}
                        onChange={(e) => onUpdateBooking({ airportTerminal: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-sm border border-stone-300 focus:border-amber-600 rounded-xl bg-white outline-none"
                      >
                        {AIRPORT_TERMINALS.map((term) => (
                          <option key={term} value={term}>
                            {term}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label
                        htmlFor="airport-luggage"
                        className="block text-xs font-semibold text-stone-700 mb-1.5"
                      >
                        行李数量与航班号（选填）
                      </label>
                      <input
                        id="airport-luggage"
                        type="text"
                        value={booking.airportLuggage}
                        onChange={(e) => onUpdateBooking({ airportLuggage: e.target.value })}
                        placeholder="例如：3个24寸行李箱 / 航班 MH123"
                        className="w-full px-3.5 py-2.5 text-sm border border-stone-300 focus:border-amber-600 rounded-xl bg-white outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label
                        htmlFor="airport-address"
                        className="block text-xs font-semibold text-stone-700 mb-1.5"
                      >
                        具体接送地址 / 酒店名称
                      </label>
                      <input
                        id="airport-address"
                        type="text"
                        value={booking.airportDestAddress}
                        onChange={(e) =>
                          onUpdateBooking({ airportDestAddress: e.target.value })
                        }
                        placeholder="请填写送达酒店或上车地址（如：KLCC 双子塔附近 / 武吉免登）"
                        className="w-full px-3.5 py-2.5 text-sm border border-stone-300 focus:border-amber-600 rounded-xl bg-white outline-none"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="airport-extra"
                        className="block text-xs font-semibold text-stone-700 mb-1.5"
                      >
                        额外接送或顺路停靠备注（选填）
                      </label>
                      <input
                        id="airport-extra"
                        type="text"
                        value={booking.airportExtraNote}
                        onChange={(e) => onUpdateBooking({ airportExtraNote: e.target.value })}
                        placeholder="例如：接机后想顺路吃个饭再回酒店"
                        className="w-full px-3.5 py-2.5 text-sm border border-stone-300 focus:border-amber-600 rounded-xl bg-white outline-none"
                      />
                    </div>
                  </div>
                </>
              )}

              <div className="flex items-center justify-between gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => onUpdateBooking({ currentStep: 2 })}
                  className="px-5 py-3 rounded-xl border border-stone-300 text-stone-700 hover:bg-stone-50 text-sm font-semibold transition-colors whitespace-nowrap"
                >
                  上一步
                </button>
                <button
                  type="button"
                  onClick={() => onUpdateBooking({ currentStep: 4 })}
                  className="px-6 py-3 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-sm font-semibold flex items-center gap-2 transition-colors whitespace-nowrap"
                >
                  下一步：生成预约网单
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Final Order Preview & Send */}
          {booking.currentStep === 4 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-stone-200 pb-4">
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-stone-900">
                    第四步：核对网单并发送给 Jack
                  </h3>
                  <p className="text-xs text-stone-500 mt-1">
                    确认信息无误后，选择 WhatsApp 直发或复制前往微信发送（{config.displayPhone}）
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onUpdateBooking({ currentStep: 3 })}
                  className="text-xs font-semibold text-stone-500 hover:text-stone-900 flex items-center gap-1 whitespace-nowrap shrink-0"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> 修改内容
                </button>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="customer-name"
                    className="block text-xs font-semibold text-stone-700 mb-1.5"
                  >
                    您的称呼
                  </label>
                  <input
                    id="customer-name"
                    type="text"
                    value={booking.customerName}
                    onChange={(e) => onUpdateBooking({ customerName: e.target.value })}
                    placeholder="例如：陈先生 / 王小姐 / Mr. Lee"
                    className="w-full px-3.5 py-2.5 text-sm border border-stone-300 focus:border-amber-600 rounded-xl bg-white outline-none"
                  />
                </div>
                <div>
                  <label
                    htmlFor="trip-vibe"
                    className="block text-xs font-semibold text-stone-700 mb-1.5"
                  >
                    行程偏好
                  </label>
                  <select
                    id="trip-vibe"
                    value={booking.tripVibe}
                    onChange={(e) => onUpdateBooking({ tripVibe: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-sm border border-stone-300 focus:border-amber-600 rounded-xl bg-white outline-none"
                  >
                    {TRIP_VIBE_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Optional Paid Photography Add-on */}
              {!isAirport && (
                <label
                  htmlFor="add-photography"
                  className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-colors ${
                    booking.addPhotography
                      ? 'border-amber-600 bg-amber-50/50'
                      : 'border-stone-200 bg-stone-50/60 hover:border-stone-300'
                  }`}
                >
                  <input
                    id="add-photography"
                    type="checkbox"
                    checked={booking.addPhotography}
                    onChange={(e) =>
                      onUpdateBooking({ addPhotography: e.target.checked })
                    }
                    className="mt-0.5 w-4 h-4 accent-amber-600 rounded shrink-0"
                  />
                  <div className="text-xs space-y-1">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                      <span className="font-bold text-stone-900">
                        加购：全程专业跟拍服务
                      </span>
                      <span className="font-semibold text-amber-700">
                        另外收费 · 需另行报价
                      </span>
                    </div>
                    <p className="text-stone-600 leading-relaxed">
                      标准包车配套不含全程跟拍。如需 30 年资深摄影师 Jack 提供全程专业跟拍，请勾选此项，发送网单后将为您单独报价。
                    </p>
                  </div>
                </label>
              )}

              {/* Order text preview */}
              <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-stone-800">
                    生成的专属包车预约网单
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyOrder}
                    className="px-3 py-1.5 rounded-lg bg-white border border-stone-300 hover:bg-stone-100 text-stone-700 text-xs font-semibold flex items-center gap-1.5 transition-colors whitespace-nowrap"
                  >
                    <Copy className="w-3.5 h-3.5" /> 复制全文
                  </button>
                </div>
                <pre className="text-xs text-stone-800 whitespace-pre-wrap font-sans bg-white border border-stone-200 rounded-lg p-3.5 leading-relaxed max-h-60 overflow-y-auto">
                  {orderMessage}
                </pre>
              </div>

              {/* Dual Channel Action Buttons */}
              <div className="grid sm:grid-cols-2 gap-3.5 pt-1">
                <a
                  href={waOrderUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3.5 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold flex items-center justify-center gap-2 transition-colors whitespace-nowrap"
                >
                  <Send className="w-4 h-4" />
                  WhatsApp 一键发送网单
                </a>
                <button
                  type="button"
                  onClick={onOpenWeChat}
                  className="py-3.5 px-5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-sm font-semibold flex items-center justify-center gap-2 transition-colors whitespace-nowrap"
                >
                  <MessageCircle className="w-4 h-4" />
                  复制网单去微信发送
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right 5 Cols: Sticky Live Itinerary Passport */}
        <aside className="lg:col-span-5 lg:sticky lg:top-20">
          <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden">
            {/* Banner image with measured contrast scrim */}
            <div className="relative h-40 bg-stone-900">
              <ResilientImage
                src={activeTour.bannerImg}
                alt={activeTour.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent p-5 flex items-end justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-[11px] font-medium text-amber-300">
                    实时行程网单预览
                  </p>
                  <h3 className="text-lg font-bold text-white truncate mt-0.5">
                    {activeTour.name}
                  </h3>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-[11px] text-stone-300 block">
                    {activeTour.priceLabel}
                  </span>
                  <span className="text-xl font-extrabold text-amber-300 tabular-nums">
                    {activeTour.priceText}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-5 space-y-5">
              {/* Key Specs Row - Clean Unboxed Metadata */}
              <div className="grid grid-cols-3 gap-3 pb-4 border-b border-stone-200 text-xs">
                <div>
                  <span className="text-stone-500 flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" /> 人数
                  </span>
                  <span className="font-bold text-stone-900 mt-1 block tabular-nums">
                    {booking.children > 0
                      ? `${booking.adults}大 ${booking.children}小`
                      : `${booking.adults} 位大人`}
                  </span>
                </div>
                <div>
                  <span className="text-stone-500 flex items-center gap-1">
                    <Camera className="w-3.5 h-3.5" /> 全程跟拍
                  </span>
                  <span className="font-bold text-amber-700 mt-1 block">
                    {isAirport
                      ? '专车准点直达'
                      : booking.addPhotography
                        ? '已加购(另收费)'
                        : '不含(可另付费)'}
                  </span>
                </div>
                <div>
                  <span className="text-stone-500 flex items-center gap-1">
                    <Car className="w-3.5 h-3.5" /> 日期
                  </span>
                  <span className="font-bold text-stone-900 mt-1 block tabular-nums">
                    {booking.date || '待定'}
                  </span>
                </div>
              </div>

              {/* Chosen Vehicle */}
              <div className="flex items-center justify-between text-xs bg-stone-50 border border-stone-200/80 rounded-xl px-3.5 py-2.5">
                <span className="text-stone-500">已选专车</span>
                <span className="font-bold text-stone-900 truncate ml-2">
                  {booking.carModel}
                </span>
              </div>

              {/* Dynamic Itinerary / Airport Summary */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-stone-800">
                    {isAirport
                      ? '机场接送信息'
                      : `已选打卡景点（${selectedSpots.length} 个）`}
                  </span>
                  {!isAirport && activeTour.spots.length > 0 && (
                    <button
                      type="button"
                      onClick={onOpenPoster}
                      className="text-amber-700 hover:underline font-semibold flex items-center gap-1"
                    >
                      <List className="w-3.5 h-3.5" /> 查看全部景点
                    </button>
                  )}
                </div>

                {isAirport ? (
                  <div className="bg-stone-50 border border-stone-200/80 rounded-xl p-3.5 space-y-1.5 text-xs text-stone-700">
                    <p className="font-bold text-stone-900">{booking.airportDirection}</p>
                    <p>航站楼：{booking.airportTerminal}</p>
                    <p>
                      接送地点：
                      {booking.airportDestAddress.trim() ||
                        booking.pickupLocation.trim() ||
                        '尚未填写'}
                    </p>
                    {booking.airportLuggage.trim() && (
                      <p>行李与航班：{booking.airportLuggage}</p>
                    )}
                  </div>
                ) : selectedSpots.length === 0 ? (
                  <p className="text-xs text-stone-500 bg-stone-50 border border-stone-200/80 rounded-xl p-4 text-center">
                    暂未勾选具体景点，出发时可由 Jack 司导为您推荐最顺路好玩的一日游路线。
                  </p>
                ) : (
                  <ol className="space-y-2 max-h-56 overflow-y-auto pr-1">
                    {selectedSpots.map((spot, idx) => (
                      <li
                        key={spot.id}
                        className="flex items-center justify-between gap-3 text-xs bg-stone-50 border border-stone-200/70 rounded-lg px-3 py-2"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="font-bold text-amber-700 tabular-nums shrink-0">
                            {String(idx + 1).padStart(2, '0')}
                          </span>
                          <span className="font-medium text-stone-900 truncate">
                            {spot.name}
                          </span>
                        </div>
                        <span className="text-stone-500 shrink-0">{spot.tag}</span>
                      </li>
                    ))}
                  </ol>
                )}
              </div>

              {/* Quick Send Row */}
              <div className="grid grid-cols-2 gap-2.5 pt-2 border-t border-stone-200">
                <a
                  href={waOrderUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap"
                >
                  <Send className="w-3.5 h-3.5" />
                  WhatsApp 发送
                </a>
                <button
                  type="button"
                  onClick={onOpenWeChat}
                  className="py-2.5 px-3 rounded-xl border border-stone-300 hover:bg-stone-50 text-stone-800 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  复制发微信
                </button>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
