import { ArrowUpRight, CalendarCheck, Camera, Car, Map } from 'lucide-react';

interface BookingProcessTimelineProps {
  directInquiryUrl: string;
  onStartBooking: () => void;
}

const PROCESS_STEPS = [
  {
    number: '01',
    title: '选择路线',
    meta: '在线定制 · 自由勾选',
    description:
      '挑选云顶、怡保、马六甲包车一日游或吉隆坡机场接送，按喜好自由勾选打卡景点与专车车型。',
    icon: Map,
  },
  {
    number: '02',
    title: '确认档期',
    meta: 'WhatsApp / 微信直联',
    description:
      '生成专属预约网单并发送给 Jack，快速核对出发日期、接送地址、车位与清晰透明的一口价。',
    icon: CalendarCheck,
  },
  {
    number: '03',
    title: '专车接送',
    meta: '点对点准时上门',
    description:
      '出发当日专车准时抵达吉隆坡酒店、住家或 KLIA 航站楼迎接，宽敞 MPV 舒适直达各站。',
    icon: Car,
  },
  {
    number: '04',
    title: '畅游讲解',
    meta: '专人向导 · 跟拍另计收费',
    description:
      '司导沿途生动讲解景点故事、带吃地道老字号，节奏自由不催促；如需全程专业跟拍可额外加购收费。',
    icon: Camera,
  },
] as const;

export function BookingProcessTimeline({
  directInquiryUrl,
  onStartBooking,
}: BookingProcessTimelineProps) {
  return (
    <section
      id="process"
      className="bg-white border-t border-stone-200/80 py-16 sm:py-20"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold text-amber-700 tracking-wide">
              服务流程 · 四步清晰衔接
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 mt-1 text-balance">
              预约流程
            </h2>
            <p className="text-sm text-stone-600 mt-2 leading-relaxed">
              从线上选定路线、确认档期到专车上门接送与贴心向导讲解，每个环节透明直观；如需全程专业跟拍可另外加购。
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold shrink-0">
            <button
              type="button"
              onClick={onStartBooking}
              className="text-stone-900 hover:text-amber-700 underline underline-offset-4 transition-colors whitespace-nowrap"
            >
              立即去选路线
            </button>
            <span className="text-stone-300" aria-hidden="true">
              /
            </span>
            <a
              href={directInquiryUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-700 hover:text-emerald-800 inline-flex items-center gap-1 transition-colors whitespace-nowrap"
            >
              直接确认档期
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Responsive Timeline */}
        <div className="relative">
          {/* Desktop horizontal connecting rail */}
          <div
            aria-hidden="true"
            className="hidden lg:block absolute top-6 left-6 right-6 h-px bg-stone-200"
          />

          <ol className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-8 relative">
            {PROCESS_STEPS.map((step, idx) => {
              const Icon = step.icon;
              const isLast = idx === PROCESS_STEPS.length - 1;
              return (
                <li key={step.number} className="relative flex lg:flex-col gap-5 lg:gap-0">
                  {/* Mobile vertical connecting rail */}
                  {!isLast && (
                    <span
                      aria-hidden="true"
                      className="lg:hidden absolute top-12 left-6 bottom-[-2rem] w-px bg-stone-200 -translate-x-1/2"
                    />
                  )}

                  {/* Timeline Node */}
                  <div className="relative z-10 flex items-center lg:mb-6 shrink-0">
                    <div className="w-12 h-12 rounded-full bg-[#FAF9F6] border border-stone-300 flex items-center justify-center text-stone-900 shadow-xs">
                      <Icon className="w-5 h-5 text-amber-700" />
                    </div>
                  </div>

                  {/* Step Content */}
                  <div className="flex-1 pt-0.5 lg:pt-0 lg:pr-2">
                    <div className="flex items-center gap-2 text-xs text-stone-500">
                      <span className="font-bold text-amber-700 tabular-nums">
                        {step.number}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>{step.meta}</span>
                    </div>
                    <h3 className="text-lg font-bold text-stone-900 mt-1.5">
                      {step.title}
                    </h3>
                    <p className="text-sm text-stone-600 mt-2 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
