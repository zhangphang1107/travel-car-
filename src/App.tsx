import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowDown,
  ArrowRight,
  Check,
  MessageCircle,
  Phone,
  Send,
  Settings,
} from 'lucide-react';
import { AdminModal } from './components/AdminModal';
import { BookingCustomizer } from './components/BookingCustomizer';
import { BookingProcessTimeline } from './components/BookingProcessTimeline';
import { PosterModal } from './components/PosterModal';
import { ResilientImage } from './components/ResilientImage';
import { WeChatModal } from './components/WeChatModal';
import {
  AIRPORT_DIRECTIONS,
  AIRPORT_TERMINALS,
  ASSET_PATHS,
  CAR_MODELS,
  DEFAULT_SITE_CONFIG,
  DEFAULT_TOUR_DATA,
  TRIP_VIBE_OPTIONS,
} from './data/defaultData';
import { BookingState, SiteConfig, TourDataMap } from './types';
import {
  buildBookingMessage,
  buildWhatsAppUrl,
  copyToClipboard,
  getTomorrowISO,
} from './utils/booking';

const STORAGE_KEYS = {
  config: 'JCT_SITE_CONFIG_V2',
  tours: 'JCT_TOUR_DATA_V2',
};

function loadInitialConfig(): SiteConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.config);
    if (raw) {
      return { ...DEFAULT_SITE_CONFIG, ...JSON.parse(raw) };
    }
  } catch {
    // Ignore storage parse error
  }
  return DEFAULT_SITE_CONFIG;
}

function loadInitialTours(): TourDataMap {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.tours);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && Object.keys(parsed).length > 0) {
        return parsed;
      }
    }
  } catch {
    // Ignore storage parse error
  }
  return JSON.parse(JSON.stringify(DEFAULT_TOUR_DATA));
}

export default function App() {
  const [config, setConfig] = useState<SiteConfig>(loadInitialConfig);
  const [tours, setTours] = useState<TourDataMap>(loadInitialTours);

  const [booking, setBooking] = useState<BookingState>({
    currentStep: 1,
    destination: 'genting',
    carModel: CAR_MODELS[0].fullName,
    adults: 4,
    children: 0,
    date: getTomorrowISO(),
    pickupLocation: '',
    customSpots: '',
    customerName: '',
    tripVibe: TRIP_VIBE_OPTIONS[0],
    airportDirection: AIRPORT_DIRECTIONS.pickup,
    airportTerminal: AIRPORT_TERMINALS[0],
    airportLuggage: '',
    airportDestAddress: '',
    airportExtraNote: '',
  });

  const [weChatModalOpen, setWeChatModalOpen] = useState(false);
  const [posterModalOpen, setPosterModalOpen] = useState(false);
  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const toastTimerRef = useRef<number | null>(null);

  useEffect(() => {
    document.documentElement.style.setProperty('--site-font', config.fontFamily);
  }, [config.fontFamily]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    if (toastTimerRef.current) {
      window.clearTimeout(toastTimerRef.current);
    }
    toastTimerRef.current = window.setTimeout(() => {
      setToastMsg(null);
    }, 3000);
  };

  const tourList = useMemo(() => Object.values(tours), [tours]);
  const activeTour = tours[booking.destination] || tourList[0];

  const orderMessage = useMemo(
    () => buildBookingMessage(booking, activeTour, config),
    [booking, activeTour, config]
  );

  const directInquiryUrl = useMemo(() => {
    const msg = `你好 Jack (${config.brandTitle})！我想直接了解吉隆坡包车旅游（云顶 / 怡保 / 马六甲）和机场接送服务。`;
    return buildWhatsAppUrl(config.waPhone, msg);
  }, [config.brandTitle, config.waPhone]);

  const handleUpdateBooking = (patch: Partial<BookingState>) => {
    setBooking((prev) => ({ ...prev, ...patch }));
  };

  const handleSelectDestination = (destId: string) => {
    if (!tours[destId]) return;
    setBooking((prev) => ({ ...prev, destination: destId }));
    showToast(`已选择：${tours[destId].name}`);
  };

  const handleToggleSpot = (destId: string, spotId: string) => {
    setTours((prev) => {
      const target = prev[destId];
      if (!target) return prev;
      return {
        ...prev,
        [destId]: {
          ...target,
          spots: target.spots.map((s) =>
            s.id === spotId ? { ...s, selected: !s.selected } : s
          ),
        },
      };
    });
  };

  const handleToggleAllSpots = (destId: string, selected: boolean) => {
    setTours((prev) => {
      const target = prev[destId];
      if (!target) return prev;
      return {
        ...prev,
        [destId]: {
          ...target,
          spots: target.spots.map((s) => ({ ...s, selected })),
        },
      };
    });
    showToast(selected ? '已为您勾选该路线全部热门景点' : '已清空景点，可自由点击重新勾选');
  };

  const handleOpenWeChat = async () => {
    await copyToClipboard(orderMessage);
    setWeChatModalOpen(true);
  };

  const handleJumpToCustomizer = (destId: string, step: 1 | 2 | 3 | 4 = 1) => {
    if (tours[destId]) {
      setBooking((prev) => ({ ...prev, destination: destId, currentStep: step }));
    }
    const el = document.getElementById('customizer');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSaveAdmin = (nextConfig: SiteConfig, nextTours: TourDataMap) => {
    setConfig(nextConfig);
    setTours(nextTours);
    if (!nextTours[booking.destination]) {
      const firstId = Object.keys(nextTours)[0];
      if (firstId) {
        setBooking((prev) => ({ ...prev, destination: firstId }));
      }
    }
    try {
      localStorage.setItem(STORAGE_KEYS.config, JSON.stringify(nextConfig));
      localStorage.setItem(STORAGE_KEYS.tours, JSON.stringify(nextTours));
    } catch {
      // Storage full fallback
    }
    showToast('管理后台修改已保存并立即生效');
  };

  const handleResetAdmin = () => {
    localStorage.removeItem(STORAGE_KEYS.config);
    localStorage.removeItem(STORAGE_KEYS.tours);
    setConfig(DEFAULT_SITE_CONFIG);
    setTours(JSON.parse(JSON.stringify(DEFAULT_TOUR_DATA)));
    setBooking((prev) => ({ ...prev, destination: 'genting' }));
    showToast('已恢复默认设置与原始实景照片');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6] text-stone-900">
      {/* Strict 3-Zone Top Bar Contract */}
      <header className="sticky top-0 z-40 bg-[#FAF9F6]/95 backdrop-blur-md border-b border-stone-200/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Single-line Brand Wordmark */}
          <a
            href="#"
            className="flex items-center gap-2.5 text-base sm:text-lg font-extrabold tracking-tight text-stone-900 whitespace-nowrap shrink-0"
          >
            <ResilientImage
              src={config.logoImg}
              alt={config.brandTitle}
              className="w-8 h-8 rounded-lg object-cover border border-stone-200 shrink-0"
            />
            <span>{config.brandTitle}</span>
          </a>

          {/* Zone 2: Clean Single-Line Nav Links */}
          <nav
            aria-label="主导航"
            className="hidden md:flex items-center gap-7 text-sm font-medium text-stone-600"
          >
            <a
              href="#customizer"
              className="hover:text-stone-900 transition-colors whitespace-nowrap shrink-0"
            >
              在线定制
            </a>
            <a
              href="#process"
              className="hover:text-stone-900 transition-colors whitespace-nowrap shrink-0"
            >
              预约流程
            </a>
            <a
              href="#guide"
              className="hover:text-stone-900 transition-colors whitespace-nowrap shrink-0"
            >
              摄影司导
            </a>
            <a
              href="#fleet"
              className="hover:text-stone-900 transition-colors whitespace-nowrap shrink-0"
            >
              专车车队
            </a>
            <a
              href="#packages"
              className="hover:text-stone-900 transition-colors whitespace-nowrap shrink-0"
            >
              路线总览
            </a>
          </nav>

          {/* Zone 3: Single Primary Action */}
          <div className="shrink-0">
            <a
              href={directInquiryUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold inline-flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0"
            >
              <Send className="w-3.5 h-3.5" />
              WhatsApp 咨询
            </a>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="border-b border-stone-200/80 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
            <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
              {/* Left Proposition Column */}
              <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <p className="text-xs sm:text-sm font-semibold text-amber-700">
                    吉隆坡私人专车 · 30年摄影师司导免费跟拍
                  </p>
                  <h1 className="text-[clamp(2rem,4vw,3.25rem)] font-extrabold tracking-tight leading-[1.12] text-stone-900 text-balance">
                    {config.brandTitle}
                    <span className="block text-amber-700 mt-1.5">
                      {config.heroSubtitle}
                    </span>
                  </h1>
                  <p className="text-sm sm:text-base text-stone-600 leading-relaxed max-w-xl">
                    {config.heroDesc}
                  </p>
                </div>

                {/* Primary & Secondary Actions */}
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    <a
                      href={directInquiryUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold inline-flex items-center justify-center gap-2 transition-colors whitespace-nowrap"
                    >
                      <Send className="w-4 h-4" />
                      直接 WhatsApp 联系 Jack
                    </a>
                    <a
                      href="#customizer"
                      className="px-6 py-3.5 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 text-stone-900 text-sm font-semibold inline-flex items-center justify-center gap-2 transition-colors whitespace-nowrap"
                    >
                      开始勾选景点定制
                      <ArrowDown className="w-4 h-4" />
                    </a>
                  </div>

                  {/* Clean unboxed trust specs */}
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-stone-500 pt-2 border-t border-stone-200/80">
                    <span className="font-semibold text-stone-800 tabular-nums">
                      专线 {config.displayPhone}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>Nissan Serena / Perodua Alza</span>
                    <span aria-hidden="true">·</span>
                    <span>10小时随心包车</span>
                    <span aria-hidden="true">·</span>
                    <button
                      type="button"
                      onClick={handleOpenWeChat}
                      className="text-emerald-700 hover:underline font-semibold inline-flex items-center gap-1"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      微信预约入口
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Visual Route Gallery (Real Uploaded Photos) */}
              <div className="lg:col-span-6 grid grid-cols-2 gap-3.5">
                {tourList.slice(0, 4).map((pkg) => (
                  <button
                    key={pkg.id}
                    type="button"
                    onClick={() => handleJumpToCustomizer(pkg.id, 1)}
                    className="group relative rounded-2xl overflow-hidden bg-stone-900 min-h-[168px] sm:min-h-[196px] text-left focus-visible:outline-2 focus-visible:outline-amber-600"
                  >
                    <ResilientImage
                      src={pkg.bannerImg}
                      alt={pkg.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent p-4 flex flex-col justify-end">
                      <span className="text-xs font-bold text-amber-300 tabular-nums">
                        {pkg.priceText}
                      </span>
                      <h2 className="text-sm sm:text-base font-bold text-white mt-0.5 truncate">
                        {pkg.name}
                      </h2>
                      <p className="text-[11px] text-stone-200 truncate mt-0.5">
                        {pkg.id === 'airport'
                          ? 'KLIA / KLIA2 点对点专车'
                          : pkg.spots
                              .slice(0, 3)
                              .map((s) => s.name.split(' ')[0])
                              .join(' · ')}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Interactive 4-Step Booking Customizer */}
        <BookingCustomizer
          config={config}
          tours={tours}
          booking={booking}
          activeTour={activeTour}
          orderMessage={orderMessage}
          onUpdateBooking={handleUpdateBooking}
          onSelectDestination={handleSelectDestination}
          onToggleSpot={handleToggleSpot}
          onToggleAllSpots={handleToggleAllSpots}
          onOpenWeChat={handleOpenWeChat}
          onOpenPoster={() => setPosterModalOpen(true)}
          onNotify={showToast}
        />

        {/* 4-Step Booking Process Timeline */}
        <BookingProcessTimeline
          directInquiryUrl={directInquiryUrl}
          onStartBooking={() => handleJumpToCustomizer(booking.destination, 1)}
        />

        {/* 30-Year Photographer Driver-Guide Spotlight */}
        <section id="guide" className="bg-stone-950 text-stone-100 py-16 sm:py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-center">
              {/* Left Editorial Copy & Numbered Proof */}
              <div className="lg:col-span-7 space-y-8">
                <div className="space-y-3">
                  <p className="text-xs font-semibold text-amber-400 tracking-wide">
                    不仅仅是包车司机 · 30年影视与摄影经验
                  </p>
                  <h2 className="text-2xl sm:text-4xl font-bold text-white leading-tight text-balance">
                    包车即享私人向导与资深摄影师全程跟拍
                  </h2>
                  <p className="text-sm sm:text-base text-stone-300 leading-relaxed max-w-2xl">
                    出门旅游最怕遇到只顾开车的司机。主理人 Jack 拥有30年拍戏与专业摄影实战背景，带您畅游马来西亚的同时，主动帮您与家人朋友定格最美旅途记忆。
                  </p>
                </div>

                <div className="divide-y divide-stone-800 border-t border-b border-stone-800">
                  <div className="py-4 grid sm:grid-cols-12 gap-2 sm:gap-4 items-baseline">
                    <span className="sm:col-span-4 text-sm font-bold text-amber-400">
                      01. 专业构图免费跟拍
                    </span>
                    <p className="sm:col-span-8 text-sm text-stone-300 leading-relaxed">
                      熟悉黑风洞彩虹阶梯、怡保霹雳洞与二奶巷、马六甲荷兰红屋最佳光线与打卡机位，无需麻烦路人拍照。
                    </p>
                  </div>
                  <div className="py-4 grid sm:grid-cols-12 gap-2 sm:gap-4 items-baseline">
                    <span className="sm:col-span-4 text-sm font-bold text-amber-400">
                      02. 贴心景点与美食向导
                    </span>
                    <p className="sm:col-span-8 text-sm text-stone-300 leading-relaxed">
                      沿途生动介绍马来西亚风土人情，带您品尝本地人认可的老字号白咖啡、芽菜鸡与娘惹美食。
                    </p>
                  </div>
                  <div className="py-4 grid sm:grid-cols-12 gap-2 sm:gap-4 items-baseline">
                    <span className="sm:col-span-4 text-sm font-bold text-amber-400">
                      03. 10小时行程自由不催促
                    </span>
                    <p className="sm:col-span-8 text-sm text-stone-300 leading-relaxed">
                      专车直达景点门口，拍够了、吃饱了再出发，长辈与小朋友都能轻松尽兴。
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-5 text-sm">
                  <div className="flex items-center gap-3">
                    <ResilientImage
                      src={config.logoImg}
                      alt="Jack Car Travel 官方标识"
                      className="w-12 h-12 rounded-xl object-cover bg-white border border-stone-700 shrink-0"
                    />
                    <div>
                      <p className="font-bold text-white">主理人司导 Jack</p>
                      <p className="text-xs text-stone-400 tabular-nums flex items-center gap-1.5 mt-0.5">
                        <Phone className="w-3.5 h-3.5 text-amber-400" />
                        预约专线：{config.displayPhone}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Photography Proof Frame */}
              <div className="lg:col-span-5">
                <div className="rounded-2xl overflow-hidden border border-stone-800 bg-stone-900">
                  <ResilientImage
                    src={ASSET_PATHS.ipohCave}
                    alt="怡保霹雳洞实景旅拍取景地"
                    className="w-full h-[380px] sm:h-[440px] object-cover"
                  />
                  <div className="px-5 py-4 border-t border-stone-800 flex items-center justify-between text-xs text-stone-400">
                    <span>实景打卡机位 · 怡保霹雳洞 Gua Perak</span>
                    <span className="text-amber-400 font-semibold">包车即赠跟拍</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Comfort Fleet Showcase */}
        <section id="fleet" className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
          <div className="max-w-2xl mb-10">
            <p className="text-xs font-semibold text-amber-700 tracking-wide">
              舒适专车车队
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
              两款宽敞 MPV 专车任您选择
            </h2>
            <p className="text-sm text-stone-600 mt-2">
              无论是跨州包车一日游还是吉隆坡机场接送，车辆全程整洁无异味，冷气充足，行李空间充裕。
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {CAR_MODELS.map((car) => {
              const isSelected = booking.carModel === car.fullName;
              return (
                <div
                  key={car.id}
                  className="bg-white border border-stone-200 rounded-2xl overflow-hidden flex flex-col justify-between"
                >
                  <div className="h-60 bg-white border-b border-stone-100 p-6 flex items-center justify-center">
                    <ResilientImage
                      src={config[car.imgKey]}
                      alt={car.shortName}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-5">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2 text-xs text-stone-500">
                        <span>{car.highlight}</span>
                        <span className="font-semibold text-stone-800">{car.capacity}</span>
                      </div>
                      <h3 className="text-xl font-bold text-stone-900">{car.shortName}</h3>
                      <p className="text-sm text-stone-600 leading-relaxed">{car.summary}</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        handleUpdateBooking({ carModel: car.fullName, currentStep: 2 });
                        showToast(`已切换专车为 ${car.shortName}`);
                        const el = document.getElementById('customizer');
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className={`w-full py-3 px-4 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-colors ${
                        isSelected
                          ? 'bg-amber-600 hover:bg-amber-700 text-white'
                          : 'bg-stone-900 hover:bg-stone-800 text-white'
                      }`}
                    >
                      {isSelected ? (
                        <>
                          <Check className="w-4 h-4" /> 当前已选 {car.shortName}
                        </>
                      ) : (
                        <>
                          选择 {car.shortName} 定制行程
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* All Packages Overview */}
        <section id="packages" className="border-t border-stone-200/80 bg-white py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
              <div>
                <p className="text-xs font-semibold text-amber-700 tracking-wide">
                  热门包车路线与接送配套
                </p>
                <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
                  清晰透明一口价，绝无隐藏消费
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-stone-500">
                点击任意配套即可进入网单勾选景点
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {tourList.map((pkg) => (
                <div
                  key={pkg.id}
                  className="bg-[#FAF9F6] border border-stone-200 rounded-2xl overflow-hidden flex flex-col justify-between"
                >
                  <div>
                    <div className="relative h-44 bg-stone-900">
                      <ResilientImage
                        src={pkg.bannerImg}
                        alt={pkg.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent p-4 flex items-end justify-between gap-2 text-white">
                        <div className="min-w-0">
                          <span className="text-[11px] text-stone-300 block">
                            {pkg.durationText}
                          </span>
                          <h3 className="text-base font-bold truncate mt-0.5">{pkg.name}</h3>
                        </div>
                        <span className="text-lg font-extrabold text-amber-300 tabular-nums shrink-0">
                          {pkg.priceText}
                        </span>
                      </div>
                    </div>

                    <div className="p-4 space-y-2.5 text-xs text-stone-600">
                      {pkg.id === 'airport' ? (
                        <ul className="space-y-2">
                          <li className="leading-relaxed">
                            <strong className="text-stone-900">机场接机：</strong>
                            KLIA / KLIA2 提前等候，直达酒店或住家
                          </li>
                          <li className="leading-relaxed">
                            <strong className="text-stone-900">准点送机：</strong>
                            上门接送行李，安心送达航站楼出发层
                          </li>
                          <li className="leading-relaxed">
                            <strong className="text-stone-900">收费标准：</strong>
                            KL 范围 RM 200 起跳，视具体地址确认报价
                          </li>
                        </ul>
                      ) : (
                        <ul className="space-y-2">
                          {pkg.spots.slice(0, 5).map((spot, idx) => (
                            <li key={spot.id} className="flex items-baseline gap-2">
                              <span className="font-semibold text-amber-700 tabular-nums shrink-0">
                                {String(idx + 1).padStart(2, '0')}
                              </span>
                              <span className="text-stone-800 font-medium truncate">
                                {spot.name}
                              </span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>

                  <div className="p-4 pt-0">
                    <button
                      type="button"
                      onClick={() => handleJumpToCustomizer(pkg.id, 3)}
                      className="w-full py-2.5 px-4 rounded-xl border border-stone-300 bg-white hover:bg-stone-900 hover:text-white hover:border-stone-900 text-stone-900 text-xs font-semibold transition-colors whitespace-nowrap"
                    >
                      定制此行程（{pkg.priceText}）
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Quiet Footer */}
      <footer className="bg-[#FAF9F6] border-t border-stone-200 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-3 gap-y-1">
            <span className="font-bold text-stone-900">{config.brandTitle}</span>
            <span aria-hidden="true">·</span>
            <span>吉隆坡豪华包车与机场接送</span>
            <span aria-hidden="true">·</span>
            <span>Nissan Serena / Perodua Alza</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="tabular-nums">
              WhatsApp / 微信：<strong className="text-stone-900">{config.displayPhone}</strong>
            </span>
            <button
              type="button"
              onClick={() => setAdminModalOpen(true)}
              className="inline-flex items-center gap-1 text-stone-500 hover:text-stone-900 font-medium transition-colors whitespace-nowrap"
            >
              <Settings className="w-3.5 h-3.5" />
              管理后台
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <WeChatModal
        isOpen={weChatModalOpen}
        onClose={() => setWeChatModalOpen(false)}
        config={config}
        orderMessage={orderMessage}
        onNotify={showToast}
      />

      <PosterModal
        isOpen={posterModalOpen}
        onClose={() => setPosterModalOpen(false)}
        tour={activeTour}
      />

      <AdminModal
        isOpen={adminModalOpen}
        onClose={() => setAdminModalOpen(false)}
        config={config}
        tours={tours}
        onSave={handleSaveAdmin}
        onReset={handleResetAdmin}
        onNotify={showToast}
      />

      {/* Toast Notification */}
      {toastMsg && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-5 right-5 z-50 bg-stone-900 text-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 text-xs font-medium"
        >
          <Check className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}
    </div>
  );
}
