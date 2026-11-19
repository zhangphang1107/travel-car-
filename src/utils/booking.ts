import { BookingState, SiteConfig, TourPackage } from '../types';

export function getTomorrowISO(): string {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const yyyy = tomorrow.getFullYear();
  const mm = String(tomorrow.getMonth() + 1).padStart(2, '0');
  const dd = String(tomorrow.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

export function buildBookingMessage(
  state: BookingState,
  tour: TourPackage,
  config: SiteConfig
): string {
  const totalPax = state.adults + state.children;
  const paxLine =
    state.children > 0
      ? `${state.adults} 大人 + ${state.children} 小孩 (共 ${totalPax} 人)`
      : `${state.adults} 位大人`;

  if (tour.id === 'airport') {
    const lines = [
      `你好 Jack (${config.brandTitle})！我在预约网单上填写了【吉隆坡机场专车接送】，想咨询确认车位：`,
      '',
      `【接送类型】：${state.airportDirection}`,
      `【参考价格】：${tour.priceText}（KL范围起跳，视具体地点确认）`,
      `【航站楼】：${state.airportTerminal}`,
      `【所选车型】：${state.carModel}`,
    ];
    if (state.customerName.trim()) {
      lines.push(`【乘客称呼】：${state.customerName.trim()}`);
    }
    lines.push(`【乘车人数】：${paxLine}`);
    if (state.date) {
      lines.push(`【用车日期】：${state.date}`);
    }
    lines.push(
      `【具体接送地点】：${state.airportDestAddress.trim() || state.pickupLocation.trim() || '待发定位确认'}`
    );
    if (state.airportLuggage.trim()) {
      lines.push(`【行李与航班】：${state.airportLuggage.trim()}`);
    }
    if (state.airportExtraNote.trim()) {
      lines.push(`【额外接送备注】：${state.airportExtraNote.trim()}`);
    }
    lines.push('', '请问这个日期可以安排吗？请帮我确认最终报价，谢谢！');
    return lines.join('\n');
  }

  const selectedSpots = (tour.spots || []).filter((s) => s.selected);
  const spotsList =
    selectedSpots.length > 0
      ? selectedSpots.map((s, idx) => `   ${idx + 1}. ${s.name}`).join('\n')
      : '   （请 Jack 帮我推荐顺路好玩好拍的景点）';

  const lines = [
    `你好 Jack (${config.brandTitle})！我在预约网单上定制了【专属包车游 · 含30年摄影师司导跟拍与讲解】，想咨询预订：`,
    '',
    `【所选路线】：${tour.name}`,
    `【配套价格】：${tour.priceText}`,
    `【所选车型】：${state.carModel}`,
    `【专属服务】：30年摄影师经验司导帮拍照 + 景点讲解`,
  ];
  if (state.customerName.trim()) {
    lines.push(`【乘客称呼】：${state.customerName.trim()}`);
  }
  lines.push(`【出游人数】：${paxLine}`);
  if (state.date) {
    lines.push(`【出发日期】：${state.date}`);
  }
  if (state.pickupLocation.trim()) {
    lines.push(`【上车地点】：${state.pickupLocation.trim()}`);
  }
  lines.push(`【旅拍与偏好】：${state.tripVibe}`);
  lines.push('', `【我想去的景点清单 (共${selectedSpots.length}个)】：`, spotsList);

  if (state.customSpots.trim()) {
    lines.push('', `【额外想去 / 接送备注】：${state.customSpots.trim()}`);
  }
  lines.push('', '请问这个日期有车位吗？期待您的回复，谢谢！');
  return lines.join('\n');
}

export function buildWhatsAppUrl(waPhone: string, message: string): string {
  const cleanPhone = waPhone.replace(/[^\d]/g, '') || '60128331935';
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // Fallback below
  }

  try {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(textarea);
    return ok;
  } catch {
    return false;
  }
}

export function compressImageFile(file: File, maxWidth = 960): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('读取图片失败'));
    reader.onload = (ev) => {
      const img = new Image();
      img.onerror = () => reject(new Error('解析图片失败'));
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let w = img.width;
        let h = img.height;
        if (w > maxWidth) {
          h = Math.round((h * maxWidth) / w);
          w = maxWidth;
        }
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('无法处理图片'));
          return;
        }
        ctx.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL('image/jpeg', 0.84));
      };
      img.src = String(ev.target?.result || '');
    };
    reader.readAsDataURL(file);
  });
}
