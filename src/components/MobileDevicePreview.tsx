import { useEffect, useMemo, useRef, useState } from "react";
import bgImage from "../assets/bg.png";
import profileImage from "../assets/profile.png";
import mpointImage from "../assets/mpoint.png";
import myCardMenuImage from "../assets/mycard.png";
import bblmMenuImage from "../assets/bblm.png";
import mPowerMenuImage from "../assets/mpower.png";
import payMPointMenuImage from "../assets/pay_mpoint.png";
import mTravelMenuImage from "../assets/mtravel.png";
import mPetMenuImage from "../assets/mpet.png";
import mJuniorMenuImage from "../assets/m_junior.png";
import shopEarnMenuImage from "../assets/shop_earn.png";
import transferMenuImage from "../assets/transfer.png";
import arMenuImage from "../assets/ar.png";
import bottomNavBgImage from "../assets/bottom.png";
import homeNavImage from "../assets/icon_home.png";
import promotionNavImage from "../assets/icon_promotion.png";
import rewardNavImage from "../assets/icon_reward.png";
import accountNavImage from "../assets/icon_account.png";

type DeviceModelId = "iphone-16e" | "iphone-16-pro-max" | "galaxy-s24";
type DeviceCanvasPage = "home" | "all-rewards" | "detail";

interface DeviceModel {
  id: DeviceModelId;
  label: string;
  platform: "iOS" | "Android";
  screenHint: string;
  shellClassName: string;
  viewportHeightClassName: string;
  topCutout: "notch" | "island" | "camera";
  statusBar: {
    topPx: number;
    heightPx: number;
    paddingXPx: number;
    centerGapPx: number;
  };
  contentInsetClass: string;
  homeIndicatorClassName: string;
}

const deviceModels: DeviceModel[] = [
  {
    id: "iphone-16e",
    label: "iPhone 16e",
    platform: "iOS",
    screenHint: "6.1″",
    shellClassName: "max-w-[378px] rounded-[44px]",
    viewportHeightClassName: "h-[560px] sm:h-[660px] lg:h-[760px]",
    topCutout: "notch",
    statusBar: { topPx: 6, heightPx: 26, paddingXPx: 24, centerGapPx: 140 },
    contentInsetClass: "px-4 pt-[44px]",
    homeIndicatorClassName: "h-[5px] w-[110px] rounded-full bg-[#111]",
  },
  {
    id: "iphone-16-pro-max",
    label: "iPhone 16 Pro Max",
    platform: "iOS",
    screenHint: "6.9″",
    shellClassName: "max-w-[398px] rounded-[48px]",
    viewportHeightClassName: "h-[600px] sm:h-[700px] lg:h-[800px]",
    topCutout: "island",
    statusBar: { topPx: 12, heightPx: 26, paddingXPx: 24, centerGapPx: 104 },
    contentInsetClass: "px-4 pt-[50px]",
    homeIndicatorClassName: "h-[5px] w-[120px] rounded-full bg-[#111]",
  },
  {
    id: "galaxy-s24",
    label: "Galaxy S24",
    platform: "Android",
    screenHint: "6.2″",
    shellClassName: "max-w-[372px] rounded-[40px]",
    viewportHeightClassName: "h-[560px] sm:h-[660px] lg:h-[760px]",
    topCutout: "camera",
    statusBar: { topPx: 8, heightPx: 24, paddingXPx: 16, centerGapPx: 28 },
    contentInsetClass: "px-4 pt-[32px]",
    homeIndicatorClassName: "h-[3px] w-[88px] rounded-full bg-[#1b1b1b]/70",
  },
];

const pageOptions: Array<{ id: DeviceCanvasPage; label: string }> = [
  { id: "home", label: "หน้า Home" },
  { id: "all-rewards", label: "คูปองทั้งหมด" },
  { id: "detail", label: "รายละเอียด" },
];

const DeviceSilhouette = ({
  cutout,
  selected,
}: {
  cutout: DeviceModel["topCutout"];
  selected: boolean;
}) => (
  <div
    className={`relative mx-auto h-12 w-6 rounded-[7px] border-2 transition ${
      selected
        ? "border-white bg-white shadow-[inset_0_0_0_1px_rgba(16,33,45,0.08)]"
        : "border-ink/25 bg-gradient-to-b from-white to-sand/80 shadow-sm"
    }`}
  >
    <div
      className={`absolute left-1/2 -translate-x-1/2 ${
        cutout === "notch"
          ? "top-0 h-1.5 w-3.5 rounded-b-[3px]"
          : cutout === "island"
            ? "top-0.5 h-1.5 w-3 rounded-full"
            : "top-1 h-1 w-1 rounded-full"
      } ${selected ? "bg-ink" : "bg-ink/70"}`}
    />
    <div
      className={`absolute bottom-1 left-1/2 h-0.5 w-2.5 -translate-x-1/2 rounded-full ${
        selected ? "bg-ink/35" : "bg-ink/20"
      }`}
    />
  </div>
);

const DevicePicker = ({
  selectedId,
  onSelect,
}: {
  selectedId: DeviceModelId;
  onSelect: (id: DeviceModelId) => void;
}) => (
  <div className="grid grid-cols-3 gap-2">
    {deviceModels.map((model) => {
      const selected = model.id === selectedId;
      return (
        <button
          key={model.id}
          type="button"
          onClick={() => onSelect(model.id)}
          aria-pressed={selected}
          className={`flex flex-col items-center gap-1.5 rounded-xl border-2 px-1.5 py-2.5 text-center transition ${
            selected
              ? "border-ink bg-ink text-white shadow-[0_6px_16px_rgba(16,33,45,0.2)]"
              : "border-ink/10 bg-white text-ink hover:border-ink/20 hover:bg-sand/40"
          }`}
        >
          <DeviceSilhouette cutout={model.topCutout} selected={selected} />
          <div className="min-w-0 w-full">
            <p className={`truncate text-[12px] font-semibold leading-tight ${selected ? "text-white" : "text-ink"}`}>
              {model.label}
            </p>
            <p className={`mt-0.5 text-[11px] leading-tight ${selected ? "text-white/75" : "text-ink/50"}`}>
              {model.platform} · {model.screenHint}
            </p>
          </div>
        </button>
      );
    })}
  </div>
);

const ACCEPTED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const MAX_PREVIEW_ITEMS = 8;

const createObjectUrl = (file: File) => URL.createObjectURL(file);

const rewardCards = Array.from({ length: 8 }, (_, index) => ({
  id: `reward-${index}`,
  remain: index % 2 === 0 ? "Remain : No limit" : "Remain : 716",
  expire: index % 2 === 0 ? "Expired in : 181 days" : "Expired in : 131 days",
}));

const quickMenuItems = [
  { label: "My Card", image: myCardMenuImage },
  { label: "Bangkok Bank M", image: bblmMenuImage },
  { label: "M Power", image: mPowerMenuImage },
  { label: "Pay with M Point", image: payMPointMenuImage },
  { label: "M Travel", image: mTravelMenuImage },
  { label: "M Pet Club", image: mPetMenuImage },
  { label: "M Junior Club", image: mJuniorMenuImage },
  { label: "Shop & Earn M Point", image: shopEarnMenuImage },
  { label: "Transfer Point", image: transferMenuImage },
  { label: "AR Hunt Navigation", image: arMenuImage },
];

const topCutoutByModel: Record<DeviceModel["topCutout"], string> = {
  notch:
    "pointer-events-none absolute left-1/2 top-0 z-[60] h-[26px] w-[130px] -translate-x-1/2 rounded-b-[18px] bg-black",
  island:
    "pointer-events-none absolute left-1/2 top-[12px] z-[60] h-[28px] w-[100px] -translate-x-1/2 rounded-full bg-black shadow-[0_2px_8px_rgba(0,0,0,0.45)]",
  camera:
    "pointer-events-none absolute left-1/2 top-[11px] z-[60] h-[11px] w-[11px] -translate-x-1/2 rounded-full bg-black ring-1 ring-white/10",
};

type StatusBarTone = "light" | "dark";

const IOSSignalIcon = ({ className = "h-3.5 w-4" }: { className?: string }) => (
  <svg viewBox="0 0 20 14" aria-hidden="true" className={`${className} fill-current`}>
    <rect x="1.5" y="9.5" width="2.2" height="3" rx="0.7" />
    <rect x="5.2" y="7.4" width="2.2" height="5.1" rx="0.7" />
    <rect x="8.9" y="5.3" width="2.2" height="7.2" rx="0.7" />
    <rect x="12.6" y="3.2" width="2.2" height="9.3" rx="0.7" />
  </svg>
);

const IOSWifiIcon = ({ className = "h-3.5 w-4" }: { className?: string }) => (
  <svg viewBox="0 0 20 14" aria-hidden="true" className={`${className} fill-none stroke-current`} strokeWidth="1.8">
    <path d="M2.5 5.5a11 11 0 0 1 15 0" strokeLinecap="round" />
    <path d="M5.3 8a7.1 7.1 0 0 1 9.4 0" strokeLinecap="round" />
    <path d="M8 10.6a3.1 3.1 0 0 1 4 0" strokeLinecap="round" />
    <circle cx="10" cy="12" r="1" className="fill-current stroke-none" />
  </svg>
);

const IOSBatteryIcon = ({ className = "h-3.5 w-7" }: { className?: string }) => (
  <svg viewBox="0 0 28 14" aria-hidden="true" className={`${className} fill-none stroke-current`} strokeWidth="1.4">
    <rect x="1" y="2" width="22" height="10" rx="3" />
    <path d="M24 5.2h2.5v3.6H24" strokeLinecap="round" strokeLinejoin="round" />
    <rect x="3.4" y="4.2" width="15.2" height="5.6" rx="1.25" className="fill-current stroke-none" />
  </svg>
);

const AndroidSignalIcon = ({ className = "h-3.5 w-4" }: { className?: string }) => (
  <svg viewBox="0 0 20 14" aria-hidden="true" className={`${className} fill-current`}>
    <rect x="2" y="9.4" width="2" height="2.6" rx="0.55" />
    <rect x="5.3" y="7.8" width="2" height="4.2" rx="0.55" />
    <rect x="8.6" y="6.1" width="2" height="5.9" rx="0.55" />
    <rect x="11.9" y="4.3" width="2" height="7.7" rx="0.55" />
    <rect x="15.2" y="2.5" width="2" height="9.5" rx="0.55" />
  </svg>
);

const AndroidWifiIcon = ({ className = "h-3.5 w-4" }: { className?: string }) => (
  <svg viewBox="0 0 20 14" aria-hidden="true" className={`${className} fill-none stroke-current`} strokeWidth="1.8">
    <path d="M2.4 5.6a11 11 0 0 1 15.2 0" strokeLinecap="round" />
    <path d="M5.4 8.2a7.2 7.2 0 0 1 9.2 0" strokeLinecap="round" />
    <path d="M8.2 10.6a3.2 3.2 0 0 1 3.6 0" strokeLinecap="round" />
    <circle cx="10" cy="12" r="1" className="fill-current stroke-none" />
  </svg>
);

const AndroidBatteryIcon = ({ className = "h-3.5 w-[18px]" }: { className?: string }) => (
  <svg viewBox="0 0 22 12" aria-hidden="true" className={`${className} fill-none stroke-current`} strokeWidth="1.3">
    <rect x="1" y="1.5" width="17" height="9" rx="2.2" />
    <path d="M19 4.1h1.8v3H19" strokeLinecap="round" strokeLinejoin="round" />
    <rect x="3.2" y="3.2" width="10.4" height="5.6" rx="1.1" className="fill-current stroke-none" />
  </svg>
);

const StatusBar = ({ model, tone = "dark" }: { model: DeviceModel; tone?: StatusBarTone }) => {
  const textClass = tone === "light" ? "text-white" : "text-[#0a0a0a]";

  if (model.id === "galaxy-s24") {
    return (
      <div
        className={`grid h-full grid-cols-[1fr_auto_1fr] items-center text-[12px] font-medium tabular-nums leading-none tracking-[0.01em] ${textClass}`}
      >
        <span className="justify-self-start pl-0.5">9:41</span>
        <span
          aria-hidden="true"
          className="shrink-0"
          style={{ width: `${model.statusBar.centerGapPx}px` }}
        />
        <div className="flex items-center justify-self-end gap-[3px] text-current">
          <AndroidSignalIcon className="h-[13px] w-[14px]" />
          <AndroidWifiIcon className="h-[13px] w-[14px]" />
          <AndroidBatteryIcon className="h-[12px] w-[19px]" />
        </div>
      </div>
    );
  }

  const isLargeIOS = model.id === "iphone-16-pro-max" || model.id === "iphone-16e";

  return (
    <div
      className={`flex h-full items-center justify-between font-semibold tabular-nums leading-none tracking-[-0.02em] ${
        isLargeIOS ? "text-[16px]" : "text-[14px]"
      } ${textClass}`}
    >
      <span>9:41</span>
      <span aria-hidden="true" className="shrink-0" style={{ width: `${model.statusBar.centerGapPx}px` }} />
      <div className="flex items-center gap-[5px] text-current">
        <IOSSignalIcon className="h-[11px] w-[16px]" />
        <IOSWifiIcon className="h-[11px] w-[15px]" />
        <IOSBatteryIcon className="h-[12px] w-[25px]" />
      </div>
    </div>
  );
};

export const MobileDevicePreview = () => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const phonePreviewRef = useRef<HTMLDivElement | null>(null);
  const [selectedModel, setSelectedModel] = useState<DeviceModelId>("iphone-16-pro-max");
  const [selectedPage, setSelectedPage] = useState<DeviceCanvasPage>("home");
  const [previewItems, setPreviewItems] = useState<Array<{ url: string; name: string }>>([]);
  const [dragging, setDragging] = useState(false);

  const activeModel = useMemo(
    () => deviceModels.find((model) => model.id === selectedModel) ?? deviceModels[1],
    [selectedModel],
  );

  const handleSelectModel = (modelId: DeviceModelId) => {
    setSelectedModel(modelId);
    window.requestAnimationFrame(() => {
      phonePreviewRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  useEffect(() => {
    phonePreviewRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [selectedPage]);

  const detailMetrics = useMemo(() => {
    if (activeModel.id === "galaxy-s24") {
      return {
        title: "text-[19px]",
        titleLeading: "leading-[1.5]",
        body: "text-[15px]",
        bodyLeading: "leading-[1.9]",
        meta: "text-[13px]",
        metaLeading: "leading-[1.8]",
        statLabel: "text-[11px] leading-[1.4]",
        statValue: "text-[13px]",
        statValueLeading: "leading-[1.3]",
      };
    }

    return {
      title: "text-[20px]",
      titleLeading: "leading-[1.5]",
      body: "text-[16px]",
      bodyLeading: "leading-[1.95]",
      meta: "text-[13px]",
      metaLeading: "leading-[1.8]",
      statLabel: "text-[11px] leading-[1.4]",
      statValue: "text-[14px]",
      statValueLeading: "leading-[1.3]",
    };
  }, [activeModel.id]);

  const compactCardMetrics = useMemo(() => {
    if (activeModel.id === "galaxy-s24") {
      return {
        width: 122,
        titleClassName: "text-[14px]",
        metaClassName: "text-[11px]",
        regularTitleClassName: "text-[13px]",
        regularMetaClassName: "text-[11px]",
        heartClassName: "h-[16px] w-[16px]",
        placeholderTextClassName: "text-[13px]",
      };
    }

    return {
      width: 132,
      titleClassName: "text-[15px]",
      metaClassName: "text-[12px]",
      regularTitleClassName: "text-[14px]",
      regularMetaClassName: "text-[11px]",
      heartClassName: "h-[17px] w-[17px]",
      placeholderTextClassName: "text-[14px]",
    };
  }, [activeModel.id]);

  const homeMetrics = useMemo(() => {
    if (activeModel.id === "galaxy-s24") {
      return {
        topIconWrap: "h-[30px] w-[30px]",
        topIconSize: "h-5 w-5",
        profileSize: "h-11 w-11",
        greetingLabel: "text-[13px]",
        greetingName: "text-[17px]",
        greetingEmoji: "text-[16px]",
        badgeText: "text-[11px]",
        badgePadding: "px-2.5 py-[5px]",
        mPointLabel: "text-[13px]",
        mPointValue: "text-[19px]",
        mPointIcon: "h-11 w-11",
        menuWrap: "w-[60px]",
        menuIconWrap: "h-10 w-10",
        menuIcon: "h-10 w-10",
        menuText: "text-[13px]",
        sectionTitle: "text-[19px]",
        sectionLink: "text-[13px]",
        rewardsMt: "mt-7",
        menuMt: "mt-[60px]",
        homeBgHeight: "h-[284px]",
        bottomNavText: "text-[12px]",
        bottomNavIcon: "h-5 w-5",
        bottomCenterWrap: "h-14 w-14",
        bottomCenterText: "text-2xl",
      };
    }

    return {
      topIconWrap: "h-8 w-8",
      topIconSize: "h-[22px] w-[22px]",
      profileSize: "h-11 w-11",
      greetingLabel: "text-[13px]",
      greetingName: "text-[18px]",
      greetingEmoji: "text-[16px]",
      badgeText: "text-[11px]",
      badgePadding: "px-2.5 py-[5px]",
      mPointLabel: "text-[13px]",
      mPointValue: "text-[19px]",
      mPointIcon: "h-11 w-11",
      menuWrap: "w-[62px]",
      menuIconWrap: "h-11 w-11",
      menuIcon: "h-10 w-10",
      menuText: "text-[13px]",
      sectionTitle: "text-[19px]",
      sectionLink: "text-[13px]",
      rewardsMt: "mt-7",
      menuMt: "mt-[60px]",
      homeBgHeight: "h-[292px]",
      bottomNavText: "text-[12px]",
      bottomNavIcon: "h-5 w-5",
      bottomCenterWrap: "h-14 w-14",
      bottomCenterText: "text-2xl",
    };
  }, [activeModel.id]);

  useEffect(() => {
    return () => {
      previewItems.forEach((item) => URL.revokeObjectURL(item.url));
    };
  }, [previewItems]);

  const handleFiles = (files: FileList | null) => {
    const nextFiles = Array.from(files ?? []).filter((file) => ACCEPTED_TYPES.includes(file.type));
    if (nextFiles.length === 0) return;

    setPreviewItems((current) => {
      const nextItems = nextFiles.map((file) => ({
        url: createObjectUrl(file),
        name: file.name,
      }));

      const availableSlots = Math.max(MAX_PREVIEW_ITEMS - current.length, 0);
      if (availableSlots === 0) {
        nextItems.forEach((item) => URL.revokeObjectURL(item.url));
        return current;
      }

      const acceptedItems = nextItems.slice(0, availableSlots);
      const overflowItems = nextItems.slice(availableSlots);
      overflowItems.forEach((item) => URL.revokeObjectURL(item.url));

      return [...current, ...acceptedItems];
    });

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const handleRemoveItem = (indexToRemove: number) => {
    setPreviewItems((current) => {
      const target = current[indexToRemove];
      if (target) {
        URL.revokeObjectURL(target.url);
      }

      return current.filter((_, index) => index !== indexToRemove);
    });
  };

  const handleClearItems = () => {
    setPreviewItems((current) => {
      current.forEach((item) => URL.revokeObjectURL(item.url));
      return [];
    });

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const RewardCard = ({ index, compact = false }: { index: number; compact?: boolean }) => {
    const card = rewardCards[index];
    const image = previewItems[index];

    return (
      <article
        className={`overflow-hidden rounded-[8px] bg-white shadow-[0_10px_24px_rgba(16,33,45,0.09)] ${compact ? "shrink-0" : ""}`}
        style={compact ? { width: `${compactCardMetrics.width}px` } : undefined}
      >
        <div className="relative aspect-square bg-[#f5f0f0]">
          {image ? (
            <img
              src={image.url}
              alt={`Coupon preview ${index + 1}`}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-[#d9d9d9] p-4 text-center">
              <div className="w-full rounded-[8px] bg-white/65 px-4 py-5 shadow-sm">
                <p className={`${compact ? compactCardMetrics.placeholderTextClassName : "text-[14px]"} font-semibold uppercase tracking-[0.3em] text-[#8b7f86]`}>
                  Image
                </p>
              </div>
            </div>
          )}
        </div>

        <div className={`${compact ? "px-3 py-3" : "px-3 py-3.5"}`}>
          <p
            className={`whitespace-nowrap font-semibold text-[#2a2a2a] ${
              compact ? compactCardMetrics.titleClassName : compactCardMetrics.regularTitleClassName
            }`}
          >
            {card.remain}
          </p>
          <div
            className={`mt-1 flex items-center justify-between gap-1.5 text-[#979797] ${
              compact ? compactCardMetrics.metaClassName : compactCardMetrics.regularMetaClassName
            }`}
          >
            <span className="min-w-0 flex-1 truncate">{card.expire}</span>
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              className={`${compact ? compactCardMetrics.heartClassName : "h-[18px] w-[18px]"} shrink-0 stroke-[#2a2a2a] stroke-[1.9] fill-none`}
            >
              <path
                d="M12 20.6 4.9 13.8a4.7 4.7 0 0 1 6.7-6.6L12 7.6l.4-.4a4.7 4.7 0 1 1 6.7 6.6L12 20.6Z"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </article>
    );
  };

  return (
    <section className="space-y-6">
      <section className="rounded-2xl border border-white/70 bg-white/80 p-5 shadow-soft backdrop-blur md:p-6">
        <h2 className="font-display text-xl font-semibold text-ink">ดูบนมือถือ</h2>
        <p className="mt-1 text-sm leading-5 text-ink/60">
          อัปโหลดคูปอง แล้วเลือกรุ่นมือถือและหน้าจอเพื่อดู preview
        </p>
      </section>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,340px)_minmax(0,1fr)] xl:grid-cols-[360px_minmax(0,1fr)]">
        <section className="order-2 rounded-2xl border border-white/70 bg-white/80 p-5 shadow-soft backdrop-blur md:p-6 lg:order-1">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="font-display text-base font-semibold text-ink">อัปโหลดคูปอง</h3>
              <p className="mt-1 text-sm leading-5 text-ink/60">
                รองรับ JPG, PNG, WebP — สูงสุด {MAX_PREVIEW_ITEMS} รูป
              </p>
            </div>
            {previewItems.length > 0 ? (
              <button
                type="button"
                onClick={handleClearItems}
                className="rounded-full border border-ink/15 px-4 py-2 text-sm font-semibold text-ink transition hover:border-coral hover:bg-coral hover:text-white"
              >
                ลบทั้งหมด
              </button>
            ) : null}
          </div>

          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            onDragOver={(event) => {
              event.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(event) => {
              event.preventDefault();
              setDragging(false);
              handleFiles(event.dataTransfer.files);
            }}
            className={`mt-5 flex min-h-[260px] w-full flex-col items-center justify-center rounded-[28px] border-2 border-dashed px-6 py-8 text-center transition ${
              dragging
                ? "border-coral bg-coral/10"
                : "border-ink/15 bg-gradient-to-br from-sand/60 via-white to-sky/20"
            }`}
          >
            <input
              ref={inputRef}
              type="file"
              multiple
              accept=".jpg,.jpeg,.png,.webp"
              className="hidden"
              onChange={(event) => handleFiles(event.target.files)}
            />
            {previewItems.length > 0 ? (
              <div className="w-full">
                <div className="max-h-[340px] overflow-y-auto pr-1">
                  <div className="grid grid-cols-2 gap-3">
                    {previewItems.map((item, index) => (
                    <div key={item.url} className="rounded-2xl bg-white p-2 shadow-soft">
                      <img
                        src={item.url}
                        alt={item.name}
                        className="aspect-square w-full rounded-xl object-cover"
                      />
                      <div className="mt-2 flex items-center gap-2">
                        <p className="min-w-0 flex-1 truncate text-xs font-medium text-ink">{item.name}</p>
                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            handleRemoveItem(index);
                          }}
                          className="shrink-0 rounded-full border border-ink/10 px-2 py-1 text-[12px] font-semibold text-ink transition hover:border-coral hover:bg-coral hover:text-white"
                        >
                          ลบ
                        </button>
                      </div>
                    </div>
                    ))}
                  </div>
                </div>
                <p className="mt-4 text-sm font-medium text-ink">
                  อัปโหลดแล้ว {previewItems.length} รูป
                </p>
              </div>
            ) : (
              <>
                <div className="rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white">
                  Drag & Drop หรือคลิกเพื่ออัปโหลด
                </div>
                <p className="mt-4 max-w-xs text-sm leading-7 text-ink/65">
                  รูปที่อัปโหลดจะถูกนำไปแสดงใน mock หน้า reward feed ของมือถือ และสามารถเลือกหลายภาพได้
                </p>
              </>
            )}
          </button>

          <div className="mt-4 rounded-3xl bg-ink/5 p-4 text-sm leading-6 text-ink/65">
            ถ้ายังไม่อัปโหลด ระบบจะใช้ placeholder card แทน และเมื่ออัปโหลดแล้วคูปองจะถูกเติมลง feed ตามจำนวนรูปที่อัปโหลด
          </div>
        </section>

        <section className="order-1 rounded-2xl border border-white/70 bg-white/80 p-5 shadow-soft backdrop-blur md:p-6 lg:order-2 lg:sticky lg:top-6 lg:self-start">
          <h3 className="font-display text-base font-semibold text-ink">หน้าจอจำลอง</h3>
          <p className="mt-1 text-sm text-ink/55">เลือกรุ่นและหน้าจอ — ตัวอย่างอยู่ด้านล่าง</p>

          <div className="mt-4 space-y-3">
            <div>
              <p className="mb-1.5 text-xs font-medium text-ink/55">รุ่นมือถือ</p>
              <DevicePicker selectedId={selectedModel} onSelect={handleSelectModel} />
            </div>

            <div>
              <p className="mb-1.5 text-xs font-medium text-ink/55">หน้าจอแอป</p>
              <div className="grid grid-cols-3 gap-1 rounded-xl bg-white p-1 ring-1 ring-ink/10">
                {pageOptions.map((page) => {
                  const selected = selectedPage === page.id;
                  return (
                    <button
                      key={page.id}
                      type="button"
                      onClick={() => setSelectedPage(page.id)}
                      className={`rounded-lg px-2 py-2 text-xs font-semibold transition ${
                        selected
                          ? "bg-ink text-white shadow-sm"
                          : "text-ink/65 hover:bg-sand/50 hover:text-ink"
                      }`}
                    >
                      {page.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div
            ref={phonePreviewRef}
            className="mt-4 scroll-mt-24 overflow-x-auto overflow-y-visible rounded-2xl bg-gradient-to-b from-ink/[0.04] to-transparent px-2 py-4 sm:px-4"
          >
            <div className="mx-auto w-full max-w-[400px]">
            <div className={`mx-auto w-full ${activeModel.shellClassName}`}>
            <div
              className="rounded-[48px] bg-[linear-gradient(180deg,_#2b313a_0%,_#11161d_48%,_#090c11_100%)] p-[10px] shadow-[0_30px_80px_rgba(8,16,28,0.35)] ring-1 ring-white/10"
            >
              <div className="rounded-[38px] bg-[#0a0d12] p-[3px] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
                <div className={`relative overflow-hidden bg-[#f6f6f6] ${activeModel.viewportHeightClassName} rounded-[32px]`}>
                <div className={topCutoutByModel[activeModel.topCutout]} />

                <div
                  className="pointer-events-none absolute z-[55]"
                  style={{
                    top: `${activeModel.statusBar.topPx}px`,
                    height: `${activeModel.statusBar.heightPx}px`,
                    left: `${activeModel.statusBar.paddingXPx}px`,
                    right: `${activeModel.statusBar.paddingXPx}px`,
                  }}
                >
                  <StatusBar
                    model={activeModel}
                    tone={selectedPage === "home" ? "light" : "dark"}
                  />
                </div>

                <div className={`relative h-full overflow-y-auto ${activeModel.contentInsetClass}`}>
                  {selectedPage === "home" ? (
                    <div
                      aria-hidden="true"
                      className={`pointer-events-none absolute inset-x-0 top-0 bg-cover bg-top bg-no-repeat ${homeMetrics.homeBgHeight}`}
                      style={{ backgroundImage: `url(${bgImage})` }}
                    />
                  ) : null}

                  {selectedPage === "home" ? (
                    <>
                      <div className="relative z-[1] -mx-4 mt-3 px-4 pb-3 pt-2 text-white">
                        <div className="flex justify-end gap-2">
                          {["search", "scan", "bell"].map((icon) => (
                            <span
                              key={icon}
                              className={`relative flex items-center justify-center rounded-full bg-white/70 shadow-[0_8px_16px_rgba(0,0,0,0.12)] ${homeMetrics.topIconWrap}`}
                            >
                              {icon === "search" ? (
                                <svg viewBox="0 0 24 24" className={`${homeMetrics.topIconSize} stroke-[#333] stroke-[2] fill-none`}>
                                  <circle cx="10.5" cy="10.5" r="5.5" />
                                  <path d="M15 15 20 20" strokeLinecap="round" />
                                </svg>
                              ) : icon === "scan" ? (
                                <svg viewBox="0 0 24 24" className={`${homeMetrics.topIconSize} stroke-[#333] stroke-[2] fill-none`}>
                                  <path d="M7 4H5a1 1 0 0 0-1 1v2M17 4h2a1 1 0 0 1 1 1v2M4 17v2a1 1 0 0 0 1 1h2M20 17v2a1 1 0 0 1-1 1h-2" strokeLinecap="round"/>
                                  <path d="M8 8h8v8H8z" />
                                </svg>
                              ) : (
                                <svg viewBox="0 0 24 24" className={`${homeMetrics.topIconSize} stroke-[#333] stroke-[2] fill-none`}>
                                  <path d="M6 16v-5a6 6 0 1 1 12 0v5" />
                                  <path d="M4 16h16" strokeLinecap="round" />
                                  <path d="M10 19a2 2 0 0 0 4 0" strokeLinecap="round" />
                                </svg>
                              )}
                              {icon === "bell" ? (
                                <span className="absolute right-[2px] top-[2px] h-2.5 w-2.5 rounded-full bg-[#ff2e2e]" />
                              ) : null}
                            </span>
                          ))}
                        </div>

                        <div className="mt-3 flex items-start gap-3">
                          <div className="flex items-center gap-3">
                            <div className={`flex items-center justify-center overflow-hidden rounded-full shadow-[0_8px_18px_rgba(0,0,0,0.2)] ${homeMetrics.profileSize}`}>
                              <img src={profileImage} alt="Profile" className="h-full w-full object-cover" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <p className={`${homeMetrics.greetingLabel} font-medium text-white/85`}>Good Morning</p>
                                <p className={`${homeMetrics.greetingName} font-semibold tracking-[-0.01em]`}>Panisa</p>
                                <span className={homeMetrics.greetingEmoji}>👋🏻</span>
                              </div>
                              <div className="mt-1.5 flex flex-nowrap gap-1.5">
                                <span className={`whitespace-nowrap rounded-full bg-[#252525] font-semibold shadow-[0_6px_12px_rgba(0,0,0,0.12)] ${homeMetrics.badgePadding} ${homeMetrics.badgeText}`}>
                                  Platinum M Card
                                </span>
                                <span className={`whitespace-nowrap rounded-full bg-[#323FDC] font-semibold shadow-[0_6px_12px_rgba(0,0,0,0.12)] ${homeMetrics.badgePadding} ${homeMetrics.badgeText}`}>
                                  M Power Blue
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="mt-3 rounded-[12px] bg-white px-4 py-3 text-[#333] shadow-[0_10px_22px_rgba(0,0,0,0.12)]">
                          <div className="flex items-center gap-3">
                            <div className={`flex items-center justify-center ${homeMetrics.mPointIcon}`}>
                              <img src={mpointImage} alt="M Point" className="h-full w-full object-contain" />
                            </div>
                            <div>
                              <div className={`${homeMetrics.mPointLabel} text-[#9a9a9a]`}>M Point</div>
                              <div className={`${homeMetrics.mPointValue} font-semibold tracking-[-0.02em] text-[#222]`}>890,789</div>
                            </div>
                          </div>
                        </div>

                      </div>

                      <div className={`${homeMetrics.menuMt} overflow-x-auto overflow-y-visible [scrollbar-width:none] [&::-webkit-scrollbar]:hidden`}>
                        <div className="grid min-w-max grid-flow-col grid-rows-2 gap-x-4 gap-y-5">
                          {quickMenuItems.map((item) => (
                            <div key={item.label} className={`flex shrink-0 flex-col items-center gap-2 text-center ${homeMetrics.menuWrap}`}>
                              <div className={`flex items-center justify-center ${homeMetrics.menuIconWrap}`}>
                                <img src={item.image} alt={item.label} className={`${homeMetrics.menuIcon} object-contain`} />
                              </div>
                              <p
                                className={`${homeMetrics.menuText} font-medium leading-[1.2] text-[#363636]`}
                                style={{
                                  display: "-webkit-box",
                                  WebkitLineClamp: 2,
                                  WebkitBoxOrient: "vertical",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                }}
                              >
                                {item.label}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className={`${homeMetrics.rewardsMt} flex items-center justify-between`}>
                        <h4 className={`${homeMetrics.sectionTitle} font-semibold text-[#222]`}>Rewards for you</h4>
                        <button type="button" className={`${homeMetrics.sectionLink} font-medium text-[#666]`}>
                          See All
                        </button>
                      </div>

                      <div className="mt-3 overflow-x-auto overflow-y-visible pb-28 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                        <div className="flex min-w-max gap-3">
                          {rewardCards.map((_, index) => (
                            <RewardCard key={`home-${index}`} index={index} compact />
                          ))}
                        </div>
                      </div>

                      <div className="pointer-events-none sticky bottom-0 z-[3] flex justify-center -mx-4">
                        <div
                          className="w-full rounded-t-[24px] bg-cover bg-top bg-no-repeat px-5 py-3 shadow-[0_-8px_20px_rgba(16,33,45,0.08)]"
                          style={{ backgroundImage: `url(${bottomNavBgImage})` }}
                        >
                          <div className={`grid grid-cols-5 items-end text-center font-medium text-[#7c7c7c] ${homeMetrics.bottomNavText}`}>
                            <div className="text-[#2d56ff]">
                              <div className="mx-auto mb-1 flex h-5 w-5 items-center justify-center">
                                <img src={homeNavImage} alt="Home" className={`${homeMetrics.bottomNavIcon} object-contain`} />
                              </div>
                              Home
                            </div>
                            <div>
                              <div className="mx-auto mb-1 flex h-5 w-5 items-center justify-center">
                                <img src={promotionNavImage} alt="Promotion" className={`${homeMetrics.bottomNavIcon} object-contain`} />
                              </div>
                              Promotion
                            </div>
                            <div className="relative">
                              <div className={`relative -top-7 mx-auto flex items-center justify-center rounded-full bg-[#ef120d] font-bold text-white ${homeMetrics.bottomCenterWrap} ${homeMetrics.bottomCenterText}`}>
                                M
                              </div>
                            </div>
                            <div>
                              <div className="mx-auto mb-1 flex h-5 w-5 items-center justify-center">
                                <img src={rewardNavImage} alt="Rewards" className={`${homeMetrics.bottomNavIcon} object-contain`} />
                              </div>
                              Rewards
                            </div>
                            <div>
                              <div className="mx-auto mb-1 flex h-5 w-5 items-center justify-center">
                                <img src={accountNavImage} alt="Account" className={`${homeMetrics.bottomNavIcon} object-contain`} />
                              </div>
                              Account
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : selectedPage === "all-rewards" ? (
                    <>
                      <div className="mt-6 flex items-center justify-between">
                        <button type="button" className="text-3xl text-[#252525]">
                          ‹
                        </button>
                        <div className="flex items-center gap-4 text-[#252525]">
                          <svg
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                            className="h-6 w-6 stroke-[#252525] stroke-[1.9] fill-none"
                          >
                            <path d="M3 6h18" strokeLinecap="round" />
                            <path d="M3 12h18" strokeLinecap="round" />
                            <path d="M3 18h18" strokeLinecap="round" />
                            <circle cx="9" cy="6" r="2.5" />
                            <circle cx="15" cy="12" r="2.5" />
                            <circle cx="9" cy="18" r="2.5" />
                          </svg>
                          <svg
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                            className="h-6 w-6 stroke-[#252525] stroke-[1.9] fill-none"
                          >
                            <circle cx="10.5" cy="10.5" r="6.5" />
                            <path d="M15.5 15.5 20 20" strokeLinecap="round" />
                          </svg>
                        </div>
                      </div>

                      <div className="mt-6 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-[19px] font-semibold text-[#222]">All Rewards</h4>
                          <svg
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                            className="relative top-[1px] h-[18px] w-[18px] stroke-[#333] stroke-[2] fill-none"
                          >
                            <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </div>
                        <button
                          type="button"
                          className="rounded-full bg-[#ed0400] px-4 py-2 text-xs font-semibold text-white shadow-[0_10px_20px_rgba(237,4,0,0.28)]"
                        >
                          See all my rewards
                        </button>
                      </div>

                      <div className="mt-4 rounded-2xl bg-[#ececec] px-4 py-3 text-sm text-[#333]">
                        M Point <span className="ml-2 font-semibold">890,789</span>
                      </div>

                      <div className="mt-5 grid grid-cols-2 gap-4 pb-8">
                        {rewardCards.map((_, index) => (
                          <RewardCard key={`rewards-${index}`} index={index} />
                        ))}
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="mt-5 flex items-center justify-between text-[#202020]">
                        <button type="button" className="text-3xl leading-none">
                          ‹
                        </button>
                        <div className="text-[15px] font-semibold tracking-[0.01em]">M point 890,789</div>
                        <button type="button" className="flex h-8 w-8 items-center justify-center">
                          <svg viewBox="0 0 24 24" className="h-[22px] w-[22px] stroke-[#202020] stroke-[2] fill-none">
                            <circle cx="18" cy="5" r="2.2" />
                            <circle cx="6" cy="12" r="2.2" />
                            <circle cx="18" cy="19" r="2.2" />
                            <path d="M8 11l7.7-4.2M8 13l7.7 4.2" strokeLinecap="round" />
                          </svg>
                        </button>
                      </div>

                      <div className="mt-5 overflow-hidden rounded-[18px] bg-white shadow-[0_12px_28px_rgba(16,33,45,0.08)]">
                        <div className="aspect-square bg-[#f4f1f1]">
                          {previewItems[0] ? (
                            <img
                              src={previewItems[0].url}
                              alt={previewItems[0].name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center bg-[#d9d9d9] p-4 text-center">
                              <div className="w-full rounded-[12px] bg-white/65 px-4 py-6 shadow-sm">
                                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#8b7f86]">Image</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="mt-5 space-y-4 pb-28 text-[#2a2a2a]">
                        <div>
                          <h4 className={`${detailMetrics.title} ${detailMetrics.titleLeading} font-semibold`}>
                            Lorem ipsum dolor sit amet consectetur adipiscing elit
                          </h4>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="rounded-[14px] bg-[#ebe7fb] px-4 py-3">
                            <div className="flex items-center gap-2">
                              <div className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-[#6f5cff] text-white">
                                <svg viewBox="0 0 24 24" className="h-4 w-4 stroke-white stroke-[2] fill-none">
                                  <rect x="4" y="6" width="16" height="14" rx="2.5" />
                                  <path d="M8 4v4M16 4v4M4 10h16" strokeLinecap="round" />
                                </svg>
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className={`${detailMetrics.statLabel} whitespace-nowrap text-[#666]`}>End in 194 Days</div>
                                <div className={`${detailMetrics.statValue} ${detailMetrics.statValueLeading} whitespace-nowrap pt-0.5 font-semibold`}>31 Jan 2026</div>
                              </div>
                            </div>
                          </div>
                          <div className="rounded-[14px] bg-[#fff1df] px-4 py-3">
                            <div className="flex items-center gap-2">
                              <div className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-[#ff8a00] text-white">
                                <svg viewBox="0 0 24 24" className="h-4 w-4 stroke-white stroke-[2] fill-none">
                                  <path d="M7 7h10v10H7z" />
                                  <path d="M4 12h3M17 12h3M12 4v3M12 17v3" strokeLinecap="round" />
                                </svg>
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className={`${detailMetrics.statLabel} whitespace-nowrap text-[#666]`}>Remaining</div>
                                <div className={`${detailMetrics.statValue} ${detailMetrics.statValueLeading} whitespace-nowrap pt-0.5 font-semibold`}>710</div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className={`${detailMetrics.body} ${detailMetrics.bodyLeading} text-[#333]`}>
                          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                        </div>

                        <div className={`${detailMetrics.body} ${detailMetrics.bodyLeading} space-y-2 text-[#333]`}>
                          <p className="font-medium underline underline-offset-2">Lorem ipsum dolor sit amet.</p>
                          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                          <p>Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                          <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.</p>
                        </div>

                        <div>
                          <h5 className={`${detailMetrics.body} font-semibold`}>Lorem ipsum dolor sit amet:</h5>
                          <ul className={`${detailMetrics.meta} ${detailMetrics.metaLeading} mt-2 list-disc space-y-2 pl-5 text-[#3c3c3c]`}>
                            <li>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</li>
                            <li>Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</li>
                            <li>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi.</li>
                            <li>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum.</li>
                          </ul>
                        </div>
                      </div>

                      <div className="pointer-events-none sticky bottom-0 z-[3] -mx-4 pb-3">
                        <div className="flex items-center gap-3 px-4">
                          <button
                            type="button"
                            className="pointer-events-auto flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-[0_10px_24px_rgba(16,33,45,0.12)]"
                          >
                            <svg viewBox="0 0 24 24" className="h-5 w-5 stroke-[#222] stroke-[1.9] fill-none">
                              <path d="M12 20.6 4.9 13.8a4.7 4.7 0 0 1 6.7-6.6L12 7.6l.4-.4a4.7 4.7 0 1 1 6.7 6.6L12 20.6Z" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </button>
                          <button
                            type="button"
                            className="pointer-events-auto flex-1 rounded-full bg-[#ef120d] px-5 py-3 text-[16px] font-semibold text-white shadow-[0_14px_28px_rgba(239,18,13,0.28)]"
                          >
                            Redeem
                          </button>
                        </div>
                      </div>
                    </>
                  )}

                  <div className="pointer-events-none sticky bottom-0 flex justify-center pb-2">
                    <div className={activeModel.homeIndicatorClassName} />
                  </div>
                </div>
              </div>
            </div>
            </div>
            </div>
            </div>
          </div>
        </section>
      </div>
    </section>
  );
};
