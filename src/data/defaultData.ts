import { SiteConfig, TourDataMap } from '../types';

export const ASSET_PATHS = {
  logo: '/assets/aistudio/IMG_1685_d942f301.JPG',
  genting: '/assets/aistudio/IMG_1686_39c6ba77.JPG',
  ipoh: '/assets/aistudio/IMG_1687_27e1423d.JPG',
  ipohCave: '/assets/aistudio/IMG_1688_af0a284a.JPG',
  melaka: '/assets/aistudio/IMG_1689_e688f92f.JPG',
  serena: '/assets/aistudio/IMG_1743_796062f4.JPG',
  airport: '/assets/aistudio/IMG_1744_81f2d889.JPG',
  alza: '/assets/aistudio/Unknown_5e64847e.jpeg',
} as const;

export const DEFAULT_SITE_CONFIG: SiteConfig = {
  brandTitle: 'JACK CAR TRAVEL',
  heroSubtitle: '包车旅游 · 专人讲解与旅拍',
  heroDesc:
    '主理人 Jack 拥有30年拍戏与专业摄影经验。包车出游不仅提供 Nissan Serena 与 Perodua Alza 舒适专车，还会全程为您讲解景点故事、带吃地道老字号，并亲自帮您与家人朋友拍出质感大片。涵盖云顶（RM500）、怡保（RM600）、马六甲（RM600）10小时自由行，以及吉隆坡机场专车接送（RM200起）。',
  displayPhone: '012-8331935',
  waPhone: '60128331935',
  adminPassword: '070871',
  fontFamily: "'Plus Jakarta Sans', 'Noto Sans SC', sans-serif",
  logoImg: ASSET_PATHS.logo,
  serenaImg: ASSET_PATHS.serena,
  alzaImg: ASSET_PATHS.alza,
};

export const DEFAULT_TOUR_DATA: TourDataMap = {
  genting: {
    id: 'genting',
    name: '云顶高原一日游',
    subtitle: '私人专车 · 30年摄影师司导跟拍',
    price: 500,
    priceText: 'RM 500',
    priceLabel: '包车配套价',
    durationText: '10小时 · 含跟拍',
    bannerImg: ASSET_PATHS.genting,
    spots: [
      {
        id: 'g1',
        tag: '必去打卡',
        name: '黑风洞 Batu Caves',
        desc: '打卡272级彩虹阶梯与巨型金神像，Jack 找最佳机位帮您拍大片。',
        img: ASSET_PATHS.genting,
        selected: true,
      },
      {
        id: 'g2',
        tag: '地道美食',
        name: '梧桐再也 Gohtong Jaya',
        desc: '半山人气美食镇，品尝地道河鲜与当季猫山王榴莲。',
        img: ASSET_PATHS.genting,
        selected: true,
      },
      {
        id: 'g3',
        tag: '高空缆车',
        name: '阿娃娜缆车站 Awana SkyWay',
        desc: '乘坐高空云顶缆车，俯瞰连绵热带雨林与云海山谷。',
        img: ASSET_PATHS.genting,
        selected: true,
      },
      {
        id: 'g4',
        tag: '云海仙境',
        name: '清水岩庙 Chin Swee Temple',
        desc: '云海九层万佛塔、仙境步道与巨型观音像，人像出片率极高。',
        img: ASSET_PATHS.genting,
        selected: true,
      },
      {
        id: 'g5',
        tag: '核心乐园',
        name: '云天大道 SkyAvenue',
        desc: '云顶世界核心购物城、室内外主题游乐园与美食广场。',
        img: ASSET_PATHS.genting,
        selected: true,
      },
      {
        id: 'g6',
        tag: '名牌购物',
        name: '云顶名牌城 Premium Outlets',
        desc: '国际品牌折扣奥特莱斯，紧邻缆车站，顺路购物不绕路。',
        img: ASSET_PATHS.genting,
        selected: false,
      },
    ],
  },
  ipoh: {
    id: 'ipoh',
    name: '怡保一日游：美食山城',
    subtitle: '私人专车 · 30年摄影师司导跟拍',
    price: 600,
    priceText: 'RM 600',
    priceLabel: '包车配套价',
    durationText: '10小时 · 含跟拍',
    bannerImg: ASSET_PATHS.ipoh,
    spots: [
      {
        id: 'i1',
        tag: '古早茶室',
        name: '天津茶室 Thean Chun',
        desc: '老街必吃正宗怡保白咖啡、鸡丝沙河粉与焦糖炖蛋。',
        img: ASSET_PATHS.ipoh,
        selected: true,
      },
      {
        id: 'i2',
        tag: '人气小吃',
        name: '奇峰豆腐花 Funny Mountain',
        desc: '传统丝滑豆花与冰凉豆浆，怡保人气排队老字号。',
        img: ASSET_PATHS.ipoh,
        selected: true,
      },
      {
        id: 'i3',
        tag: '百年老街',
        name: '二奶巷 Concubine Lane',
        desc: '百年骑楼建筑、壁画街拍与特色手信打卡圣地。',
        img: ASSET_PATHS.ipoh,
        selected: true,
      },
      {
        id: 'i4',
        tag: '怡保招牌',
        name: '老黄 / 安记芽菜鸡沙河粉',
        desc: '爽脆山泉芽菜配嫩滑白斩鸡，品尝怡保灵魂美食。',
        img: ASSET_PATHS.ipoh,
        selected: true,
      },
      {
        id: 'i5',
        tag: '天然溶洞',
        name: '霹雳洞 / 极乐洞 Perak Cave',
        desc: '壮丽石灰岩溶洞、红墙古庙阶梯与碧绿湖景，摄影师私藏取景地。',
        img: ASSET_PATHS.ipohCave,
        selected: true,
      },
      {
        id: 'i6',
        tag: '下午茶歇',
        name: '建龙长江白咖啡',
        desc: '园林式怀旧茶铺，品尝地道长江白咖啡与炭烤面包。',
        img: ASSET_PATHS.ipoh,
        selected: true,
      },
      {
        id: 'i7',
        tag: '山水秘境',
        name: '清心岭 Qing Xin Ling',
        desc: '翡翠湖景隐世小村、复古街道与水上木屋，适合全家合影。',
        img: ASSET_PATHS.ipohCave,
        selected: true,
      },
      {
        id: 'i8',
        tag: '甜品夜市',
        name: '糖水街 Tong Sui Kai',
        desc: 'ABC杂雪、杂果冰与丰富地道怡保夜宵小吃。',
        img: ASSET_PATHS.ipoh,
        selected: true,
      },
    ],
  },
  melaka: {
    id: 'melaka',
    name: '马六甲历史与美食之旅',
    subtitle: '私人专车 · 30年摄影师司导跟拍',
    price: 600,
    priceText: 'RM 600',
    priceLabel: '包车配套价',
    durationText: '10小时 · 含跟拍',
    bannerImg: ASSET_PATHS.melaka,
    spots: [
      {
        id: 'm1',
        tag: '必吃美食',
        name: '和记鸡饭粒 Hoe Kee Chicken Rice',
        desc: '古早味手工鸡饭粒配香嫩白斩鸡，马六甲老街人气名店。',
        img: ASSET_PATHS.melaka,
        selected: true,
      },
      {
        id: 'm2',
        tag: '世遗地标',
        name: '荷兰红屋广场 The Stadthuys',
        desc: '百年荷兰红屋基督堂、钟楼喷泉与三轮花车经典打卡位。',
        img: ASSET_PATHS.melaka,
        selected: true,
      },
      {
        id: 'm3',
        tag: '百年古街',
        name: '鸡场街百年古街 Jonker Street',
        desc: '娘惹文化老街、古董商铺、现烤黄梨酥与特色伴手礼。',
        img: ASSET_PATHS.melaka,
        selected: true,
      },
      {
        id: 'm4',
        tag: '娘惹甜品',
        name: 'Jonker 88 娘惹晶露 Cendol',
        desc: '招牌马六甲椰糖晶露冰与正宗娘惹亚参叻沙。',
        img: ASSET_PATHS.melaka,
        selected: true,
      },
      {
        id: 'm5',
        tag: '海峡绝景',
        name: '水上清真寺 Melaka Straits Mosque',
        desc: '矗立马六甲海峡之上的唯美建筑，Jack 帮您拍出日落海岸大片。',
        img: ASSET_PATHS.melaka,
        selected: true,
      },
      {
        id: 'm6',
        tag: '顺路可选',
        name: '马六甲河游船 River Cruise',
        desc: '泛舟马六甲河，欣赏两岸彩绘壁画与百年历史古桥。',
        img: ASSET_PATHS.melaka,
        selected: false,
      },
    ],
  },
  airport: {
    id: 'airport',
    name: '吉隆坡机场专车接送',
    subtitle: 'KLIA / KLIA2 点对点准时接送',
    price: 200,
    priceText: 'RM 200起',
    priceLabel: 'KL范围起跳价',
    durationText: '点对点直达',
    bannerImg: ASSET_PATHS.airport,
    spots: [],
  },
};

export const TRIP_VIBE_OPTIONS = [
  '需要 Jack 摄影师帮忙多拍美照 + 景点介绍',
  '轻松休闲，慢慢逛 + 家庭合照跟拍',
  '吃货优先，专攻地道美食 + 打卡拍照',
  '带长辈 / 小孩，少走路舒适游',
];

export const AIRPORT_DIRECTIONS = {
  pickup: '接机服务 (KLIA/KLIA2 机场 -> 吉隆坡酒店/目的地)',
  dropoff: '送机服务 (吉隆坡酒店/住家 -> KLIA/KLIA2 机场)',
} as const;

export const AIRPORT_TERMINALS = [
  'KLIA 1 (吉隆坡国际机场 1号航站楼)',
  'KLIA 2 (吉隆坡国际机场 2号航站楼 - 亚航等)',
  'Subang 梳邦机场 (SZB)',
];

export const CAR_MODELS = [
  {
    id: 'serena',
    fullName: 'Nissan Serena (豪华商务舱 MPV)',
    shortName: 'Nissan Serena',
    capacity: '1 - 6 位乘客',
    highlight: '双侧电动滑门 · 独立 Captain 座椅',
    summary:
      '高顶宽敞车身设计，配备双侧电动滑门与中排独立舒适 Captain 航空座椅，长辈与儿童上下车轻松自如，长途出游或放置大件行李皆游刃有余。',
    imgKey: 'serenaImg' as const,
  },
  {
    id: 'alza',
    fullName: 'Perodua Alza (舒适家用 MPV)',
    shortName: 'Perodua Alza',
    capacity: '1 - 5 位乘客',
    highlight: '大马畅销新款 MPV · 灵巧好坐',
    summary:
      '马来西亚广受欢迎的新一代舒适型 MPV，车身灵巧平稳，后排冷气出风口凉爽宜人，非常适合情侣、闺蜜同行、小家庭包车一日游或机场接送。',
    imgKey: 'alzaImg' as const,
  },
];

export const FONT_OPTIONS = [
  {
    label: '现代商务黑体',
    sub: '清晰利落（默认）',
    value: "'Plus Jakarta Sans', 'Noto Sans SC', sans-serif",
  },
  {
    label: '尊贵典雅宋体',
    sub: '高端人文质感',
    value: "'Noto Serif SC', Georgia, serif",
  },
  {
    label: '轻松旅游圆体',
    sub: '亲切活力风格',
    value: "'ZCOOL KuaiLe', 'Noto Sans SC', sans-serif",
  },
];
