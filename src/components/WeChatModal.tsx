import { Check, Copy, MessageCircle, X } from 'lucide-react';
import { SiteConfig } from '../types';
import { copyToClipboard } from '../utils/booking';

interface WeChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: SiteConfig;
  orderMessage: string;
  onNotify: (msg: string) => void;
}

export function WeChatModal({
  isOpen,
  onClose,
  config,
  orderMessage,
  onNotify,
}: WeChatModalProps) {
  if (!isOpen) return null;

  const cleanPhone = config.displayPhone.replace(/-/g, '');
  const rawIntl = config.waPhone.replace(/^60/, '');

  const handleCopyPhone = async () => {
    await copyToClipboard(cleanPhone);
    onNotify(`已复制 Jack 号码：${config.displayPhone}`);
  };

  const handleCopyOrder = async () => {
    await copyToClipboard(orderMessage);
    onNotify('专属行程网单已重新复制，可直接前往微信粘贴发送');
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="wechat-modal-title"
      onClick={onClose}
    >
      <div
        className="bg-white border border-stone-200 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center shrink-0">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                <Check className="w-3.5 h-3.5" />
                行程网单已自动复制
              </p>
              <h3 id="wechat-modal-title" className="text-lg font-bold text-stone-900">
                前往微信联系 Jack
              </h3>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="关闭弹窗"
            className="w-9 h-9 rounded-lg text-stone-500 hover:text-stone-900 hover:bg-stone-100 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-sm text-stone-600 leading-relaxed">
          您的专属包车网单文字已经复制到剪贴板，添加司导 Jack 微信后直接粘贴发送即可确认车位。
        </p>

        <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between gap-3 bg-white border border-stone-200 rounded-lg p-3">
            <div>
              <span className="text-xs text-stone-500 block">Jack Car Travel 微信 / 手机号</span>
              <span className="text-base font-bold text-stone-900 tabular-nums select-all">
                {config.displayPhone}
              </span>
              <span className="text-xs text-stone-500 block tabular-nums">
                或搜索 +60{rawIntl}
              </span>
            </div>
            <button
              type="button"
              onClick={handleCopyPhone}
              className="px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold whitespace-nowrap shrink-0 flex items-center gap-1.5 transition-colors"
            >
              <Copy className="w-3.5 h-3.5" />
              复制号码
            </button>
          </div>

          <ol className="text-xs text-stone-600 space-y-1.5 list-decimal list-inside">
            <li>打开微信，搜索并添加司导 Jack 的手机号。</li>
            <li>进入聊天窗口，长按输入框选择「粘贴」，发送行程网单即可。</li>
          </ol>
        </div>

        <div className="flex gap-3 pt-1">
          <button
            type="button"
            onClick={handleCopyOrder}
            className="flex-1 py-2.5 px-4 rounded-xl border border-stone-300 text-stone-700 hover:bg-stone-50 text-xs font-semibold whitespace-nowrap transition-colors"
          >
            再次复制网单
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 px-4 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold whitespace-nowrap transition-colors"
          >
            完成，去微信粘贴
          </button>
        </div>
      </div>
    </div>
  );
}
