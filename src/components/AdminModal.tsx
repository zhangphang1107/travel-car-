import { ChangeEvent, useEffect, useState } from 'react';
import {
  Check,
  Download,
  Lock,
  Plus,
  RotateCcw,
  Settings,
  Trash2,
  Upload,
  X,
} from 'lucide-react';
import { ASSET_PATHS, FONT_OPTIONS } from '../data/defaultData';
import { SiteConfig, TourDataMap } from '../types';
import { compressImageFile } from '../utils/booking';
import { ResilientImage } from './ResilientImage';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: SiteConfig;
  tours: TourDataMap;
  onSave: (nextConfig: SiteConfig, nextTours: TourDataMap) => void;
  onReset: () => void;
  onNotify: (msg: string) => void;
}

type AdminTab = 'general' | 'images' | 'packages' | 'backup';

export function AdminModal({
  isOpen,
  onClose,
  config,
  tours,
  onSave,
  onReset,
  onNotify,
}: AdminModalProps) {
  const [unlocked, setUnlocked] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [activeTab, setActiveTab] = useState<AdminTab>('general');

  const [draftConfig, setDraftConfig] = useState<SiteConfig>(config);
  const [draftTours, setDraftTours] = useState<TourDataMap>(tours);

  // New package draft state
  const [newPkgName, setNewPkgName] = useState('');
  const [newPkgPrice, setNewPkgPrice] = useState('');
  const [newPkgSubtitle, setNewPkgSubtitle] = useState('');
  const [newPkgImg, setNewPkgImg] = useState<string>(ASSET_PATHS.genting);
  const [newPkgImgReady, setNewPkgImgReady] = useState(false);

  // Per-package new spot input state
  const [spotInputs, setSpotInputs] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) {
      setDraftConfig({ ...config });
      setDraftTours(JSON.parse(JSON.stringify(tours)));
      setPasswordInput('');
      setPasswordError('');
    }
  }, [isOpen, config, tours]);

  if (!isOpen) return null;

  const handleLogin = () => {
    if (passwordInput.trim() === config.adminPassword) {
      setUnlocked(true);
      setPasswordError('');
      onNotify('管理员身份验证通过');
    } else {
      setPasswordError('密码不正确，请重试');
    }
  };

  const handleBrandPhotoUpload = async (
    e: ChangeEvent<HTMLInputElement>,
    field: 'logoImg' | 'serenaImg' | 'alzaImg'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await compressImageFile(file);
      setDraftConfig((prev) => ({ ...prev, [field]: dataUrl }));
      onNotify('照片已更新，点击保存即可生效');
    } catch {
      onNotify('图片读取失败，请尝试其他图片');
    }
  };

  const handleNewPkgImage = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await compressImageFile(file);
      setNewPkgImg(dataUrl);
      setNewPkgImgReady(true);
      onNotify('新配套封面图已上传');
    } catch {
      onNotify('封面图读取失败');
    }
  };

  const handlePackageBannerChange = async (
    e: ChangeEvent<HTMLInputElement>,
    pkgId: string
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await compressImageFile(file);
      setDraftTours((prev) => ({
        ...prev,
        [pkgId]: { ...prev[pkgId], bannerImg: dataUrl },
      }));
      onNotify('配套封面已更换');
    } catch {
      onNotify('图片处理失败');
    }
  };

  const handleAddPackage = () => {
    const name = newPkgName.trim();
    const price = parseInt(newPkgPrice, 10);
    if (!name || !price || price <= 0) {
      onNotify('请填写新配套的名称和有效价格');
      return;
    }
    const id = `pkg_${Date.now()}`;
    setDraftTours((prev) => ({
      ...prev,
      [id]: {
        id,
        name,
        subtitle: newPkgSubtitle.trim() || '私人专车 · 10小时自由行与讲解',
        price,
        priceText: `RM ${price}`,
        priceLabel: '包车配套价',
        durationText: '10小时自由包车',
        bannerImg: newPkgImg,
        spots: [
          {
            id: `spot_${Date.now()}`,
            tag: '核心打卡',
            name: `${name} 精选景点`,
            desc: '私人专车直达，资深司导 Jack 沿途贴心讲解。',
            img: newPkgImg,
            selected: true,
          },
        ],
      },
    }));
    setNewPkgName('');
    setNewPkgPrice('');
    setNewPkgSubtitle('');
    setNewPkgImgReady(false);
    onNotify(`已添加新配套：${name}`);
  };

  const handleAddSpot = (pkgId: string) => {
    const name = (spotInputs[pkgId] || '').trim();
    if (!name) return;
    setDraftTours((prev) => {
      const pkg = prev[pkgId];
      if (!pkg) return prev;
      return {
        ...prev,
        [pkgId]: {
          ...pkg,
          spots: [
            ...pkg.spots,
            {
              id: `spot_${Date.now()}`,
              tag: '新增推荐',
              name,
              desc: '私人包车精选打卡站，司导贴心接送与讲解。',
              img: pkg.bannerImg,
              selected: true,
            },
          ],
        },
      };
    });
    setSpotInputs((prev) => ({ ...prev, [pkgId]: '' }));
    onNotify(`已添加景点：${name}`);
  };

  const handleRemoveSpot = (pkgId: string, spotId: string) => {
    setDraftTours((prev) => {
      const pkg = prev[pkgId];
      if (!pkg) return prev;
      return {
        ...prev,
        [pkgId]: {
          ...pkg,
          spots: pkg.spots.filter((s) => s.id !== spotId),
        },
      };
    });
  };

  const handleDeletePackage = (pkgId: string) => {
    setDraftTours((prev) => {
      const copy = { ...prev };
      delete copy[pkgId];
      return copy;
    });
    onNotify('已删除自定义配套');
  };

  const handleExportJson = () => {
    const payload = JSON.stringify(
      { config: draftConfig, tours: draftTours },
      null,
      2
    );
    const blob = new Blob([payload], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'jack-car-travel-config.json';
    a.click();
    URL.revokeObjectURL(url);
    onNotify('配置文件已下载');
  };

  const handleImportJson = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result || ''));
        if (parsed.config && parsed.tours) {
          setDraftConfig(parsed.config);
          setDraftTours(parsed.tours);
          onNotify('配置已导入，点击「保存并生效」应用');
        } else {
          onNotify('配置文件格式不正确');
        }
      } catch {
        onNotify('无法解析该配置文件');
      }
    };
    reader.readAsText(file);
  };

  const handleSaveAll = () => {
    const sanitizedConfig: SiteConfig = {
      ...draftConfig,
      brandTitle: draftConfig.brandTitle.trim() || 'JACK CAR TRAVEL',
      adminPassword: draftConfig.adminPassword.trim() || config.adminPassword,
    };
    onSave(sanitizedConfig, draftTours);
    onClose();
  };

  const corePackageIds = new Set(['genting', 'ipoh', 'melaka', 'airport']);

  return (
    <div
      className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="admin-modal-title"
      onClick={onClose}
    >
      <div
        className="bg-white border border-stone-200 rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-stone-900 text-white px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-500 text-stone-950 flex items-center justify-center shrink-0">
              <Settings className="w-4 h-4" />
            </div>
            <div>
              <h3 id="admin-modal-title" className="font-bold text-base">
                JACK CAR TRAVEL 管理后台
              </h3>
              <p className="text-xs text-stone-400">
                自定义文案、字体、专车照片、价格与包车路线
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="关闭管理后台"
            className="w-9 h-9 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {!unlocked ? (
          <div className="p-8 sm:p-10 text-center space-y-5 my-auto">
            <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center mx-auto">
              <Lock className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h4 className="text-lg font-bold text-stone-900">管理员身份验证</h4>
              <p className="text-xs text-stone-500">请输入管理员密码解锁编辑权限</p>
            </div>
            <div className="max-w-xs mx-auto space-y-3">
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => {
                  setPasswordInput(e.target.value);
                  setPasswordError('');
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleLogin();
                }}
                placeholder="输入管理员密码"
                className="w-full text-center tracking-widest font-bold text-base border border-stone-300 focus:border-amber-600 rounded-xl px-4 py-2.5 outline-none"
              />
              {passwordError && (
                <p className="text-xs text-rose-600 font-medium">{passwordError}</p>
              )}
              <button
                type="button"
                onClick={handleLogin}
                className="w-full py-2.5 px-4 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-sm font-semibold transition-colors"
              >
                解锁进入后台
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Tabs */}
            <div className="flex items-center gap-1 p-2 bg-stone-100 border-b border-stone-200 overflow-x-auto shrink-0">
              {(
                [
                  { id: 'general', label: '文字、字体与密码' },
                  { id: 'images', label: '品牌与专车照片' },
                  { id: 'packages', label: '配套与景点管理' },
                  { id: 'backup', label: '配置备份与重置' },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 transition-colors ${
                    activeTab === tab.id
                      ? 'bg-white text-stone-900 shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Body */}
            <div className="p-6 overflow-y-auto flex-1 space-y-6">
              {activeTab === 'general' && (
                <div className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                        网站品牌名称
                      </label>
                      <input
                        type="text"
                        value={draftConfig.brandTitle}
                        onChange={(e) =>
                          setDraftConfig({ ...draftConfig, brandTitle: e.target.value })
                        }
                        className="w-full border border-stone-300 focus:border-amber-600 rounded-xl px-3.5 py-2.5 text-sm outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                        首屏副标题
                      </label>
                      <input
                        type="text"
                        value={draftConfig.heroSubtitle}
                        onChange={(e) =>
                          setDraftConfig({ ...draftConfig, heroSubtitle: e.target.value })
                        }
                        className="w-full border border-stone-300 focus:border-amber-600 rounded-xl px-3.5 py-2.5 text-sm outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                        显示电话号码（如 012-8331935）
                      </label>
                      <input
                        type="text"
                        value={draftConfig.displayPhone}
                        onChange={(e) =>
                          setDraftConfig({ ...draftConfig, displayPhone: e.target.value })
                        }
                        className="w-full border border-stone-300 focus:border-amber-600 rounded-xl px-3.5 py-2.5 text-sm tabular-nums outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                        WhatsApp 国际号码（带60，如 60128331935）
                      </label>
                      <input
                        type="text"
                        value={draftConfig.waPhone}
                        onChange={(e) =>
                          setDraftConfig({ ...draftConfig, waPhone: e.target.value })
                        }
                        className="w-full border border-stone-300 focus:border-amber-600 rounded-xl px-3.5 py-2.5 text-sm tabular-nums outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                      首屏品牌介绍文案
                    </label>
                    <textarea
                      rows={3}
                      value={draftConfig.heroDesc}
                      onChange={(e) =>
                        setDraftConfig({ ...draftConfig, heroDesc: e.target.value })
                      }
                      className="w-full border border-stone-300 focus:border-amber-600 rounded-xl px-3.5 py-2.5 text-sm outline-none"
                    />
                  </div>

                  <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-bold text-stone-900">修改后台管理密码</p>
                      <p className="text-xs text-stone-500">
                        设置新的后台登录密码（当前默认：070871）
                      </p>
                    </div>
                    <input
                      type="text"
                      value={draftConfig.adminPassword}
                      onChange={(e) =>
                        setDraftConfig({ ...draftConfig, adminPassword: e.target.value })
                      }
                      className="w-40 bg-white border border-stone-300 focus:border-amber-600 rounded-lg px-3 py-2 text-sm font-semibold tabular-nums outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-2">
                      全站字体风格
                    </label>
                    <div className="grid sm:grid-cols-3 gap-3">
                      {FONT_OPTIONS.map((font) => {
                        const active = draftConfig.fontFamily === font.value;
                        return (
                          <button
                            key={font.value}
                            type="button"
                            onClick={() =>
                              setDraftConfig({ ...draftConfig, fontFamily: font.value })
                            }
                            className={`p-3.5 rounded-xl border text-left transition-colors ${
                              active
                                ? 'border-amber-600 bg-amber-50/70 text-stone-900'
                                : 'border-stone-200 bg-white text-stone-700 hover:border-stone-300'
                            }`}
                          >
                            <span
                              className="block font-bold text-sm"
                              style={{ fontFamily: font.value }}
                            >
                              {font.label}
                            </span>
                            <span className="text-xs text-stone-500 mt-0.5 block">
                              {font.sub}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'images' && (
                <div className="space-y-4">
                  <p className="text-xs text-stone-600 bg-stone-50 border border-stone-200 rounded-xl p-3.5">
                    可直接从本地相册上传替换品牌 Logo 与两款专车照片，系统会自动压缩以保持网页加载流畅。
                  </p>
                  <div className="grid sm:grid-cols-3 gap-4">
                    {(
                      [
                        {
                          label: '品牌 Logo 头像',
                          field: 'logoImg' as const,
                          imgClass: 'w-24 h-24 rounded-xl object-cover',
                        },
                        {
                          label: 'Nissan Serena 照片',
                          field: 'serenaImg' as const,
                          imgClass: 'w-full h-24 rounded-lg object-contain bg-white',
                        },
                        {
                          label: 'Perodua Alza 照片',
                          field: 'alzaImg' as const,
                          imgClass: 'w-full h-24 rounded-lg object-contain bg-white',
                        },
                      ]
                    ).map((slot) => (
                      <div
                        key={slot.field}
                        className="border border-stone-200 rounded-xl p-4 bg-stone-50/60 flex flex-col items-center gap-3 text-center"
                      >
                        <span className="text-xs font-bold text-stone-800">{slot.label}</span>
                        <ResilientImage
                          src={draftConfig[slot.field]}
                          alt={slot.label}
                          className={`${slot.imgClass} border border-stone-200`}
                        />
                        <label className="w-full cursor-pointer py-2 px-3 rounded-lg bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors">
                          <Upload className="w-3.5 h-3.5" />
                          上传替换照片
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleBrandPhotoUpload(e, slot.field)}
                          />
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'packages' && (
                <div className="space-y-6">
                  {/* Add New Package */}
                  <div className="border border-stone-200 bg-stone-50 rounded-xl p-4 space-y-3">
                    <h4 className="text-sm font-bold text-stone-900 flex items-center gap-1.5">
                      <Plus className="w-4 h-4 text-amber-600" />
                      新增旅游包车配套
                    </h4>
                    <div className="grid sm:grid-cols-3 gap-3">
                      <input
                        type="text"
                        value={newPkgName}
                        onChange={(e) => setNewPkgName(e.target.value)}
                        placeholder="配套名称（如：金马仑高原一日游）"
                        className="bg-white border border-stone-300 rounded-lg px-3 py-2 text-xs outline-none focus:border-amber-600"
                      />
                      <input
                        type="number"
                        value={newPkgPrice}
                        onChange={(e) => setNewPkgPrice(e.target.value)}
                        placeholder="价格数字（如：750）"
                        className="bg-white border border-stone-300 rounded-lg px-3 py-2 text-xs tabular-nums outline-none focus:border-amber-600"
                      />
                      <input
                        type="text"
                        value={newPkgSubtitle}
                        onChange={(e) => setNewPkgSubtitle(e.target.value)}
                        placeholder="简短说明（如：含茶园与草莓园自由游）"
                        className="bg-white border border-stone-300 rounded-lg px-3 py-2 text-xs outline-none focus:border-amber-600"
                      />
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                      <label className="cursor-pointer py-2 px-3.5 rounded-lg bg-white border border-stone-300 hover:border-stone-400 text-stone-700 text-xs font-semibold flex items-center gap-1.5">
                        <Upload className="w-3.5 h-3.5" />
                        {newPkgImgReady ? '封面照已上传' : '上传配套封面照（可选）'}
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleNewPkgImage}
                        />
                      </label>
                      <button
                        type="button"
                        onClick={handleAddPackage}
                        className="py-2 px-4 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold transition-colors"
                      >
                        添加到列表
                      </button>
                    </div>
                  </div>

                  {/* Existing packages */}
                  <div className="space-y-3">
                    {Object.values(draftTours).map((pkg) => (
                      <div
                        key={pkg.id}
                        className="border border-stone-200 rounded-xl p-4 bg-white space-y-3"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <ResilientImage
                              src={pkg.bannerImg}
                              alt={pkg.name}
                              className="w-16 h-12 rounded-lg object-cover border border-stone-200 shrink-0"
                            />
                            <div className="flex-1 min-w-0 space-y-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <input
                                  type="text"
                                  value={pkg.name}
                                  onChange={(e) =>
                                    setDraftTours((prev) => ({
                                      ...prev,
                                      [pkg.id]: { ...prev[pkg.id], name: e.target.value },
                                    }))
                                  }
                                  className="font-bold text-sm text-stone-900 border-b border-stone-300 focus:border-amber-600 outline-none bg-transparent"
                                />
                                <label className="cursor-pointer text-xs text-amber-700 hover:underline font-medium">
                                  换封面图
                                  <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => handlePackageBannerChange(e, pkg.id)}
                                  />
                                </label>
                              </div>
                              <input
                                type="text"
                                value={pkg.subtitle}
                                onChange={(e) =>
                                  setDraftTours((prev) => ({
                                    ...prev,
                                    [pkg.id]: { ...prev[pkg.id], subtitle: e.target.value },
                                  }))
                                }
                                className="w-full text-xs text-stone-500 border-b border-stone-200 focus:border-amber-600 outline-none bg-transparent"
                              />
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <div className="flex items-center gap-1 border border-stone-300 rounded-lg px-2.5 py-1.5 bg-stone-50">
                              <span className="text-xs font-semibold text-stone-600">RM</span>
                              <input
                                type="number"
                                value={pkg.price}
                                onChange={(e) => {
                                  const num = parseInt(e.target.value, 10) || 0;
                                  setDraftTours((prev) => ({
                                    ...prev,
                                    [pkg.id]: {
                                      ...prev[pkg.id],
                                      price: num,
                                      priceText:
                                        pkg.id === 'airport' ? `RM ${num}起` : `RM ${num}`,
                                    },
                                  }));
                                }}
                                className="w-16 text-sm font-bold text-stone-900 tabular-nums bg-transparent outline-none"
                              />
                            </div>
                            {!corePackageIds.has(pkg.id) && (
                              <button
                                type="button"
                                onClick={() => handleDeletePackage(pkg.id)}
                                aria-label="删除配套"
                                className="p-2 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </div>

                        {pkg.id !== 'airport' && (
                          <div className="pt-3 border-t border-stone-100 space-y-2.5">
                            <p className="text-xs text-stone-500">
                              可选景点（{pkg.spots.length} 个）：
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {pkg.spots.map((s) => (
                                <span
                                  key={s.id}
                                  className="inline-flex items-center gap-1.5 text-xs bg-stone-100 text-stone-800 px-2.5 py-1 rounded-md"
                                >
                                  {s.name}
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveSpot(pkg.id, s.id)}
                                    className="text-stone-400 hover:text-rose-600 font-bold"
                                    aria-label={`移除 ${s.name}`}
                                  >
                                    ×
                                  </button>
                                </span>
                              ))}
                            </div>
                            <div className="flex gap-2">
                              <input
                                type="text"
                                value={spotInputs[pkg.id] || ''}
                                onChange={(e) =>
                                  setSpotInputs((prev) => ({
                                    ...prev,
                                    [pkg.id]: e.target.value,
                                  }))
                                }
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') handleAddSpot(pkg.id);
                                }}
                                placeholder="输入新景点名称，例如：极乐洞 / 猫山王榴莲园"
                                className="flex-1 border border-stone-300 rounded-lg px-3 py-1.5 text-xs outline-none focus:border-amber-600"
                              />
                              <button
                                type="button"
                                onClick={() => handleAddSpot(pkg.id)}
                                className="px-3.5 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold whitespace-nowrap transition-colors"
                              >
                                添加景点
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'backup' && (
                <div className="space-y-4">
                  <div className="bg-stone-50 border border-stone-200 rounded-xl p-5 space-y-3">
                    <h4 className="text-sm font-bold text-stone-900">
                      公开分享与数据备份说明
                    </h4>
                    <p className="text-xs text-stone-600 leading-relaxed">
                      本网单已内置您的全部真实景点、车型照片及联系方式，点击右上角公开分享链接即可直接发给客人预订，客人填写完成后通过 WhatsApp 或微信一键发送到您的手机（012-8331935）。您在管理后台所做的本地定制可导出为 JSON 文件备份。
                    </p>
                    <div className="flex flex-wrap gap-3 pt-1">
                      <button
                        type="button"
                        onClick={handleExportJson}
                        className="px-4 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
                      >
                        <Download className="w-3.5 h-3.5" />
                        导出配置备份 (JSON)
                      </button>
                      <label className="cursor-pointer px-4 py-2.5 rounded-xl border border-stone-300 hover:bg-stone-100 text-stone-700 text-xs font-semibold flex items-center gap-1.5 transition-colors">
                        <Upload className="w-3.5 h-3.5" />
                        导入配置备份
                        <input
                          type="file"
                          accept="application/json"
                          className="hidden"
                          onChange={handleImportJson}
                        />
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          onReset();
                          onClose();
                        }}
                        className="px-4 py-2.5 rounded-xl border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        恢复默认出厂设置
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer Actions */}
            <div className="bg-stone-50 border-t border-stone-200 px-6 py-3.5 flex items-center justify-between gap-4 shrink-0">
              <span className="text-xs text-stone-500">
                修改完成后请点击右侧按钮保存生效
              </span>
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 text-stone-700 text-xs font-semibold transition-colors"
                >
                  取消
                </button>
                <button
                  type="button"
                  onClick={handleSaveAll}
                  className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Check className="w-3.5 h-3.5" />
                  保存并立即生效
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
