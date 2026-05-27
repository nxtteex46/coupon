import { useEffect, useLayoutEffect, useRef, useState } from "react";
import bblmVisaLogo from "../assets/bblm_visa.png";
import mCreditCardLogo from "../assets/m_credit_card.png";
import mCreditPrepaidCardLogo from "../assets/m_credit_prepaid_card.png";
import mCreditDebitCardLogo from "../assets/m_credit_debit_card.png";
import mDebitCardLogo from "../assets/m_debit_card.png";
import mDebitPrepaidCardLogo from "../assets/m_debit_prepaid_card.png";
import mPrepaidCardLogo from "../assets/m_prepaid_card.png";
import mVisaLegendCreditCardLogo from "../assets/m_visa_legend_credit_card.png";
import mVisaLuxeCreditCardLogo from "../assets/m_visa_luxe_credit_card.png";
import mVisaLiveCreditCardLogo from "../assets/m_visa_live_credit_card.png";
import mDebitCard1Logo from "../assets/m_debit_card_1.png";
import mDebitCard2Logo from "../assets/m_debit_card_2.png";
import mPowerLogo from "../assets/m_power.png";
import mPowerBlackLogo from "../assets/m_power_black.png";
import mPowerBlueLogo from "../assets/m_power_blue.png";
import mPowerRedLogo from "../assets/m_power_red.png";
import mPowerWhiteLogo from "../assets/m_power_white.png";
import mPrepaidCard1Logo from "../assets/m_prepaid_card_1.png";
import { eligibleCardOptions, getTemplateConfig } from "../data/templates";
import type { EligibleCardId, LogoAspectRatio, TemplateSelection } from "../types";
import { CustomSelect } from "./ui/CustomField";

interface CouponPreviewProps {
  selection: TemplateSelection;
  couponTypeValue: string;
  contentLines: string[];
  uploadedImageUrl?: string | null;
  uploadedLogoUrl?: string | null;
  uploadedLogoName?: string | null;
  onFileSelect: (file: File) => void;
  onLogoSelect: (file: File) => void;
  onLogoClear: () => void;
  onLogoAspectRatioChange: (ratio: LogoAspectRatio) => void;
}

const LOGO_ASPECT_OPTIONS: Array<{ id: LogoAspectRatio; label: string }> = [
  { id: "1:1", label: "1:1" },
  { id: "16:9", label: "16:9" },
  { id: "9:16", label: "9:16" },
];

const LOGO_ACCEPTED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/svg+xml"];

const ACCEPTED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const TYPE_EXPORT_LINES: Record<
  TemplateSelection["couponType"],
  Array<{ text: string; size: number; weight: string }>
> = {
  free: [{ text: "รับฟรี", size: 72, weight: "700" }],
  register: [{ text: "ลงทะเบียน", size: 56, weight: "700" }],
  privilege: [{ text: "รับสิทธิ์", size: 72, weight: "700" }],
  "redeem-mpoint": [
    { text: "แลก", size: 44, weight: "600" },
    { text: "9,999", size: 72, weight: "700" },
    { text: "M Point", size: 44, weight: "600" },
  ],
  "discount-baht": [
    { text: "รับส่วนลด", size: 44, weight: "600" },
    { text: "9,999", size: 72, weight: "700" },
    { text: "บาท", size: 44, weight: "600" },
  ],
  "ecoupon-baht": [
    { text: "รับ e-coupon", size: 36, weight: "600" },
    { text: "9,999", size: 72, weight: "700" },
    { text: "บาท", size: 44, weight: "600" },
  ],
  "donate-mpoint": [
    { text: "บริจาค", size: 44, weight: "600" },
    { text: "9,999", size: 72, weight: "700" },
    { text: "M Point", size: 44, weight: "600" },
  ],
  "discount-percent": [
    { text: "รับส่วนลด", size: 44, weight: "600" },
    { text: "99%", size: 80, weight: "700" },
  ],
};

const PREVIEW_SCALE = 0.5;
const TYPE_LINE_GAP = 2;
const CONTENT_LINE_GAP = 9;
const EXPORT_TEXT_SCALE = 1.32;
const EXPORT_BASE_SIZE = 1040;
const EXPORT_SCALES = [1, 2, 3, 4] as const;
type ExportScale = (typeof EXPORT_SCALES)[number];
const DEFAULT_EXPORT_SCALE: ExportScale = 1;
const MIN_IMAGE_SCALE = 1;
const MAX_IMAGE_SCALE = 2.4;
const CREDIT_CARD_IDS: EligibleCardId[] = ["legend", "luxe", "live"];
const FOOTER_LOGO_MAX_WIDTH = 720;
const FOOTER_LOGO_MAX_HEIGHT = 62;
const FOOTER_ALT_LOGO_MAX_WIDTH = 860;
const FOOTER_ALT_LOGO_MAX_HEIGHT = 74;
const FOOTER_SECONDARY_LOGO_MAX_WIDTH = 190;
const FOOTER_SECONDARY_LOGO_MAX_HEIGHT = 44;
const FOOTER_WIDE_SECONDARY_LOGO_MAX_WIDTH = 760;
const FOOTER_WIDE_SECONDARY_LOGO_MAX_HEIGHT = 68;
const FOOTER_SECONDARY_GAP = 6;
const FOOTER_OVERLAP = 2;
const DIVIDER_WIDTH = 4;
const EXPORT_THAI_ASCENT_RATIO = 0.88;
const EXPORT_THAI_CLIP_TOP_PADDING = 18;
const EXPORT_THAI_CLIP_BOTTOM_PADDING = 12;
const M_POWER_LOGO_WIDTH = 112;
const M_POWER_LOGO_TOP = 36;
const M_POWER_LOGO_LEFT = 36;
const M_POWER_SUB_LOGO_WIDTH = 112;
const M_POWER_SUB_LOGO_GAP = 6;
const UPLOADED_LOGO_TOP = 36;
const UPLOADED_LOGO_RIGHT = 36;
const LOGO_FRAME_LONG_SIDE = 220;
const DEFAULT_COUPON_BACKGROUND = "#BA0100";
const WHITE_TIER_GRADIENT_STOPS = ["#DFCEB9", "#EFE5D7", "#DFCEB9"] as const;
const RED_TIER_GRADIENT_STOPS = ["#C60000", "#F30004", "#C60000"] as const;
const BLUE_TIER_GRADIENT_STOPS = ["#0144A3", "#0258D4", "#0144A3"] as const;
const BLACK_TIER_GRADIENT_STOPS = ["#262626", "#494949", "#262626"] as const;

const scaleToPreview = (value: number) => value * PREVIEW_SCALE;
const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const imageCache = new Map<string, Promise<HTMLImageElement>>();
let couponFontsReadyPromise: Promise<void> | null = null;

const loadImage = (src: string, label = "รูปภาพ") => {
  const cached = imageCache.get(src);
  if (cached) return cached;

  const promise = new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.decoding = "async";
    if (!src.startsWith("blob:") && !src.startsWith("data:")) {
      image.crossOrigin = "anonymous";
    }
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error(`ไม่สามารถโหลด${label}สำหรับ export ได้`));
    image.src = src;
  });

  imageCache.set(src, promise);
  promise.catch(() => {
    imageCache.delete(src);
  });

  return promise;
};

const safeLoadImage = async (src: string | null | undefined, label = "รูปภาพ") => {
  if (!src) return null;
  try {
    return await loadImage(src, label);
  } catch (error) {
    console.warn("Image skipped during export:", src, error);
    return null;
  }
};

const loadCouponFonts = async () => {
  if (!("fonts" in document)) return;
  if (!couponFontsReadyPromise) {
    couponFontsReadyPromise = Promise.all([
      document.fonts.load('400 32px "DB Airy"'),
      document.fonts.load('600 32px "DB Airy"'),
      document.fonts.load('700 32px "DB Airy"'),
      document.fonts.ready,
    ])
      .then(() => undefined)
      .catch((error) => {
        couponFontsReadyPromise = null;
        console.warn("Font loading skipped:", error);
      });
  }
  await couponFontsReadyPromise;
};

const getLogoFrameDimensions = (ratio: TemplateSelection["logoAspectRatio"]) => {
  const [widthUnit, heightUnit] = ratio.split(":").map(Number);
  if (widthUnit >= heightUnit) {
    return {
      width: LOGO_FRAME_LONG_SIDE,
      height: (LOGO_FRAME_LONG_SIDE * heightUnit) / widthUnit,
    };
  }

  return {
    width: (LOGO_FRAME_LONG_SIDE * widthUnit) / heightUnit,
    height: LOGO_FRAME_LONG_SIDE,
  };
};

const getCoverPlacement = (
  frameWidth: number,
  frameHeight: number,
  imageWidth: number,
  imageHeight: number,
  offsetX: number,
  offsetY: number,
  zoom = 1,
) => {
  const imageRatio = imageWidth / imageHeight;
  const frameRatio = frameWidth / frameHeight;

  let drawWidth = frameWidth;
  let drawHeight = frameHeight;

  if (imageRatio > frameRatio) {
    drawHeight = frameHeight;
    drawWidth = frameHeight * imageRatio;
  } else {
    drawWidth = frameWidth;
    drawHeight = frameWidth / imageRatio;
  }

  drawWidth *= zoom;
  drawHeight *= zoom;

  const maxShiftX = Math.max(0, (drawWidth - frameWidth) / 2);
  const maxShiftY = Math.max(0, (drawHeight - frameHeight) / 2);
  const safeOffsetX = clamp(offsetX, -maxShiftX, maxShiftX);
  const safeOffsetY = clamp(offsetY, -maxShiftY, maxShiftY);

  return {
    drawWidth,
    drawHeight,
    drawX: (frameWidth - drawWidth) / 2 + safeOffsetX,
    drawY: (frameHeight - drawHeight) / 2 + safeOffsetY,
    maxShiftX,
    maxShiftY,
    safeOffsetX,
    safeOffsetY,
  };
};

export const CouponPreview = ({
  selection,
  couponTypeValue,
  contentLines,
  uploadedImageUrl,
  uploadedLogoUrl,
  uploadedLogoName,
  onFileSelect,
  onLogoSelect,
  onLogoClear,
  onLogoAspectRatioChange,
}: CouponPreviewProps) => {
  const artworkRef = useRef<HTMLDivElement | null>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const offscreenCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const renderGenerationRef = useRef(0);
  const renderFrameRef = useRef<number | null>(null);
  const contentBoxRef = useRef<HTMLDivElement | null>(null);
  const logoInputRef = useRef<HTMLInputElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const imageAreaRef = useRef<HTMLDivElement | null>(null);
  const typeLineRefs = useRef<Array<HTMLDivElement | null>>([]);
  const contentLineRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [exporting, setExporting] = useState(false);
  const [exportScale, setExportScale] = useState<ExportScale>(DEFAULT_EXPORT_SCALE);
  const [imageNaturalSize, setImageNaturalSize] = useState<{ width: number; height: number } | null>(null);
  const [cropOffset, setCropOffset] = useState({ x: 0, y: 0 });
  const [imageScale, setImageScale] = useState(1);
  const [isEditingImage, setIsEditingImage] = useState(false);
  const dragStateRef = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    initialX: number;
    initialY: number;
  } | null>(null);
  const template = getTemplateConfig(selection);
  const lineBlocks = Array.from({ length: template.expectedLineCount });
  const isFooterLayout = template.hasFooter;
  const hasCreditSelected = selection.eligibleCards.some((cardId) => CREDIT_CARD_IDS.includes(cardId));
  const hasDebitSelected = selection.eligibleCards.includes("debit");
  const hasPrepaidSelected = selection.eligibleCards.includes("prepaid");
  const showFooterBrandImage =
    isFooterLayout &&
    selection.eligibleCustomerEnabled &&
    (selection.eligibleCards.length === eligibleCardOptions.length ||
      (hasCreditSelected && hasDebitSelected && hasPrepaidSelected));
  const footerSecondaryLogoSrcs = showFooterBrandImage
    ? []
    : [
        ...(selection.eligibleCards.includes("legend") ? [mVisaLegendCreditCardLogo] : []),
        ...(selection.eligibleCards.includes("luxe") ? [mVisaLuxeCreditCardLogo] : []),
        ...(selection.eligibleCards.includes("live") ? [mVisaLiveCreditCardLogo] : []),
        ...(selection.eligibleCards.includes("debit") && selection.eligibleCards.includes("prepaid")
          ? [mDebitPrepaidCardLogo]
          : []),
        ...(selection.eligibleCards.includes("debit") ? [mDebitCard1Logo, mDebitCard2Logo] : []),
        ...(selection.eligibleCards.includes("prepaid") ? [mPrepaidCard1Logo] : []),
      ];
  const showCreditCardFooterImage =
    isFooterLayout &&
    selection.eligibleCustomerEnabled &&
    !showFooterBrandImage &&
    hasCreditSelected &&
    !hasDebitSelected;
  const showCreditDebitFooterImage =
    isFooterLayout &&
    selection.eligibleCustomerEnabled &&
    !showFooterBrandImage &&
    hasCreditSelected &&
    hasDebitSelected;
  const showCreditPrepaidFooterImage =
    isFooterLayout &&
    selection.eligibleCustomerEnabled &&
    !showFooterBrandImage &&
    hasCreditSelected &&
    !hasDebitSelected &&
    hasPrepaidSelected;
  const showDebitCardFooterImage =
    isFooterLayout &&
    selection.eligibleCustomerEnabled &&
    !showFooterBrandImage &&
    !hasCreditSelected &&
    hasDebitSelected &&
    !hasPrepaidSelected;
  const showPrepaidCardFooterImage =
    isFooterLayout &&
    selection.eligibleCustomerEnabled &&
    !showFooterBrandImage &&
    !hasCreditSelected &&
    !hasDebitSelected &&
    hasPrepaidSelected;
  const footerLogoSrc = showFooterBrandImage
    ? bblmVisaLogo
    : showCreditDebitFooterImage
      ? mCreditDebitCardLogo
      : showCreditPrepaidFooterImage
        ? mCreditPrepaidCardLogo
      : showCreditCardFooterImage
      ? mCreditCardLogo
      : showDebitCardFooterImage
        ? mDebitCardLogo
        : showPrepaidCardFooterImage
          ? mPrepaidCardLogo
          : null;
  const hasAnyFooterLogo = Boolean(footerLogoSrc) || footerSecondaryLogoSrcs.length > 0;
  const isPrimaryFooterLogo = footerLogoSrc === bblmVisaLogo;
  const typePreviewLines = TYPE_EXPORT_LINES[selection.couponType];
  const canvasSize = EXPORT_BASE_SIZE;
  const redHeight = isFooterLayout ? 300 : 380;
  const footerHeight = isFooterLayout ? 80 : 0;
  const redTop = canvasSize - redHeight - footerHeight;
  const redMidY = redTop + redHeight / 2;
  const dividerHeight = isFooterLayout ? 205 : 230;
  const dividerTop = redTop + (redHeight - dividerHeight) / 2;
  const textBlockHeight = isFooterLayout ? 228 : 246;
  const textBlockTop = redTop + (redHeight - textBlockHeight) / 2;
  const sideCutoutSize = 72;
  const typeLeft = 0.05;
  const typeWidth = 0.225;
  const dividerX = 0.305;
  const contentLeft = 0.35;
  const contentWidth = 0.61;
  const previewFontStyle = {
    fontFamily: '"DB Ariy", "Noto Sans Thai", "Prompt", Arial, sans-serif',
  } as const;
  const isWhiteTierTheme = selection.mPowerTierEnabled && selection.mPowerTier === "white";
  const isRedTierTheme = selection.mPowerTierEnabled && selection.mPowerTier === "red";
  const isBlueTierTheme = selection.mPowerTierEnabled && selection.mPowerTier === "blue";
  const isBlackTierTheme = selection.mPowerTierEnabled && selection.mPowerTier === "black";
  const showMPowerLogo = selection.mPowerTierEnabled;
  const mPowerBenefitLogoMap = {
    white: mPowerWhiteLogo,
    red: mPowerRedLogo,
    blue: mPowerBlueLogo,
    black: mPowerBlackLogo,
  } as const;
  const mPowerBenefitOrder: TemplateSelection["mPowerTier"][] = ["white", "red", "blue", "black"];
  const mPowerBenefitLogoSrcs = mPowerBenefitOrder
    .filter((tier) => selection.mPowerBenefitTiers.includes(tier))
    .map((tier) => mPowerBenefitLogoMap[tier]);
  const couponTextColor = isWhiteTierTheme ? "#1A2833" : "#ffffff";
  const dividerColor = isWhiteTierTheme ? "#000000" : "rgba(255,255,255,0.95)";
  const legendCouponBarStyle = isWhiteTierTheme
    ? { background: "linear-gradient(90deg, #DFCEB9 0%, #EFE5D7 50%, #DFCEB9 100%)" }
    : isRedTierTheme
      ? { background: "linear-gradient(90deg, #C60000 0%, #F30004 50%, #C60000 100%)" }
      : isBlueTierTheme
        ? { background: "linear-gradient(90deg, #0144A3 0%, #0258D4 50%, #0144A3 100%)" }
        : isBlackTierTheme
          ? { background: "linear-gradient(90deg, #262626 0%, #494949 50%, #262626 100%)" }
          : { backgroundColor: DEFAULT_COUPON_BACKGROUND };
  const uploadedLogoFrame = getLogoFrameDimensions(selection.logoAspectRatio);
  const thaiSafeLineClass =
    "block overflow-visible whitespace-nowrap pt-[0.2em] pb-[0.16em] leading-[1.17] [text-rendering:geometricPrecision]";
  const getContentLineStyle = (index: number, text: string) => {
    const headStyle = { fontSize: "28px", fontWeight: 700 as const };
    const subStyle = { fontSize: "22px", fontWeight: 400 as const };

    switch (template.contentLayout.id) {
      case "head2-2":
        return headStyle;
      case "head2-sub1-3":
        return index <= 1 ? headStyle : subStyle;
      case "head1-sub2-3":
        return index === 0 ? headStyle : subStyle;
      case "head-sub-2":
      default:
        return index === 0 ? headStyle : subStyle;
    }
  };

  const isHeadLine = (index: number) => {
    switch (template.contentLayout.id) {
      case "head2-2":
        return true;
      case "head2-sub1-3":
        return index <= 1;
      case "head1-sub2-3":
        return index === 0;
      case "head-sub-2":
      default:
        return index === 0;
    }
  };

  const getDisplayContentText = (index: number) => {
    const fallback = index === 0 ? "Headline" : index === 1 ? "Subline" : "Detail";
    return contentLines[index] || fallback;
  };

  const resolvedCouponTypeValue = couponTypeValue.trim() || "9,999";
  const renderedTypeLines = typePreviewLines.map((line) => ({
    ...line,
    text:
      line.text === "9,999"
        ? resolvedCouponTypeValue
        : line.text === "99%"
          ? `${resolvedCouponTypeValue}%`
          : line.text,
  }));

  useEffect(() => {
    if (!uploadedImageUrl) {
      setImageNaturalSize(null);
      setCropOffset({ x: 0, y: 0 });
      setImageScale(1);
      setIsEditingImage(false);
      return;
    }

    let active = true;

    loadImage(uploadedImageUrl)
      .then((image) => {
        if (!active) return;
        setImageNaturalSize({ width: image.width, height: image.height });
        setCropOffset({ x: 0, y: 0 });
        setImageScale(1);
        setIsEditingImage(true);
      })
      .catch(() => {
        if (!active) return;
        setImageNaturalSize(null);
      });

    return () => {
      active = false;
    };
  }, [uploadedImageUrl]);

  const imagePlacement = imageNaturalSize
    ? getCoverPlacement(
        canvasSize,
        redTop,
        imageNaturalSize.width,
        imageNaturalSize.height,
        cropOffset.x,
        cropOffset.y,
        imageScale,
      )
    : null;

  const resetCrop = () => {
    setCropOffset({ x: 0, y: 0 });
    setImageScale(1);
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!uploadedImageUrl) return;
    dragStateRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      initialX: cropOffset.x,
      initialY: cropOffset.y,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!uploadedImageUrl || !imagePlacement || !dragStateRef.current || !imageAreaRef.current) return;
    if (dragStateRef.current.pointerId !== event.pointerId) return;

    const rect = imageAreaRef.current.getBoundingClientRect();
    if (!rect.width || !rect.height) return;

    const deltaX = (event.clientX - dragStateRef.current.startX) * (canvasSize / rect.width);
    const deltaY = (event.clientY - dragStateRef.current.startY) * (redTop / rect.height);

    setCropOffset({
      x: clamp(dragStateRef.current.initialX + deltaX, -imagePlacement.maxShiftX, imagePlacement.maxShiftX),
      y: clamp(dragStateRef.current.initialY + deltaY, -imagePlacement.maxShiftY, imagePlacement.maxShiftY),
    });
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    if (dragStateRef.current?.pointerId === event.pointerId) {
      dragStateRef.current = null;
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  const paintCouponToCanvas = async (context: CanvasRenderingContext2D) => {
    const measureRoot = artworkRef.current;
    if (!measureRoot) {
      throw new Error("ไม่พบ preview สำหรับวาดคูปอง");
    }

    const artworkBounds = measureRoot.getBoundingClientRect();
    if (!artworkBounds.width) {
      return;
    }

    const layoutScale = canvasSize / artworkBounds.width;

    context.clearRect(0, 0, canvasSize, canvasSize);

      context.fillStyle = "#dddddd";
      context.fillRect(0, 0, canvasSize, redTop);

      if (uploadedImageUrl) {
        const uploadedImage = await loadImage(uploadedImageUrl, "รูปคูปอง");
        const exportPlacement = getCoverPlacement(
          canvasSize,
          redTop,
          uploadedImage.width,
          uploadedImage.height,
          cropOffset.x,
          cropOffset.y,
          imageScale,
        );
        context.drawImage(
          uploadedImage,
          exportPlacement.drawX,
          exportPlacement.drawY,
          exportPlacement.drawWidth,
          exportPlacement.drawHeight,
        );
      }

      if (showMPowerLogo) {
        const mPowerImage = await safeLoadImage(mPowerLogo, "โลโก้ M Power");
        if (mPowerImage) {
          const scale = M_POWER_LOGO_WIDTH / mPowerImage.width;
          const drawWidth = M_POWER_LOGO_WIDTH;
          const drawHeight = mPowerImage.height * scale;
          context.drawImage(
            mPowerImage,
            M_POWER_LOGO_LEFT,
            M_POWER_LOGO_TOP,
            drawWidth,
            drawHeight,
          );

          let benefitY = M_POWER_LOGO_TOP + drawHeight + M_POWER_SUB_LOGO_GAP;
          for (const logoSrc of mPowerBenefitLogoSrcs) {
            const benefitImage = await safeLoadImage(logoSrc, "โลโก้สิทธิ์ M Power");
            if (!benefitImage) continue;
            const benefitScale = M_POWER_SUB_LOGO_WIDTH / benefitImage.width;
            const benefitDrawWidth = M_POWER_SUB_LOGO_WIDTH;
            const benefitDrawHeight = benefitImage.height * benefitScale;
            context.drawImage(
              benefitImage,
              M_POWER_LOGO_LEFT,
              benefitY,
              benefitDrawWidth,
              benefitDrawHeight,
            );
            benefitY += benefitDrawHeight + M_POWER_SUB_LOGO_GAP;
          }
        }
      }

      if (uploadedLogoUrl) {
        const uploadedLogo = await loadImage(uploadedLogoUrl, "โลโก้ที่อัปโหลด");
        const logoPlacement = getCoverPlacement(
          uploadedLogoFrame.width,
          uploadedLogoFrame.height,
          uploadedLogo.width,
          uploadedLogo.height,
          0,
          0,
        );
        const frameX = canvasSize - UPLOADED_LOGO_RIGHT - uploadedLogoFrame.width;
        const frameY = UPLOADED_LOGO_TOP;
        context.save();
        context.beginPath();
        context.rect(frameX, frameY, uploadedLogoFrame.width, uploadedLogoFrame.height);
        context.clip();
        context.drawImage(
          uploadedLogo,
          frameX + logoPlacement.drawX,
          frameY + logoPlacement.drawY,
          logoPlacement.drawWidth,
          logoPlacement.drawHeight,
        );
        context.restore();
      }

      if (isWhiteTierTheme || isRedTierTheme || isBlueTierTheme || isBlackTierTheme) {
        const couponGradient = context.createLinearGradient(0, redTop, canvasSize, redTop);
        const gradientStops = isWhiteTierTheme
          ? WHITE_TIER_GRADIENT_STOPS
          : isRedTierTheme
            ? RED_TIER_GRADIENT_STOPS
            : isBlueTierTheme
              ? BLUE_TIER_GRADIENT_STOPS
              : BLACK_TIER_GRADIENT_STOPS;
        couponGradient.addColorStop(0, gradientStops[0]);
        couponGradient.addColorStop(0.5, gradientStops[1]);
        couponGradient.addColorStop(1, gradientStops[2]);
        context.fillStyle = couponGradient;
      } else {
        context.fillStyle = DEFAULT_COUPON_BACKGROUND;
      }
      const redFillHeight = isFooterLayout ? redHeight + FOOTER_OVERLAP : redHeight;
      context.fillRect(0, redTop, canvasSize, redFillHeight);

      if (isFooterLayout) {
        context.fillStyle = "#000000";
        context.fillRect(0, canvasSize - footerHeight, canvasSize, footerHeight);
        if (hasAnyFooterLogo) {
          const footerImage = await safeLoadImage(footerLogoSrc, "โลโก้ footer");
          const footerScale = footerImage
            ? Math.min(
                (isPrimaryFooterLogo ? FOOTER_LOGO_MAX_WIDTH : FOOTER_ALT_LOGO_MAX_WIDTH) / footerImage.width,
                (isPrimaryFooterLogo ? FOOTER_LOGO_MAX_HEIGHT : FOOTER_ALT_LOGO_MAX_HEIGHT) / footerImage.height,
              )
            : 0;
          const footerDrawWidth = footerImage ? footerImage.width * footerScale : 0;
          const footerDrawHeight = footerImage ? footerImage.height * footerScale : 0;
          const secondaryImages = await Promise.all(
            footerSecondaryLogoSrcs.map(async (src) => {
              const image = await safeLoadImage(src, "โลโก้บัตรเพิ่มเติม");
              if (!image) {
                return null;
              }
              const isWideSecondaryLogo = src === mDebitPrepaidCardLogo;
              const scale = Math.min(
                (isWideSecondaryLogo
                  ? FOOTER_WIDE_SECONDARY_LOGO_MAX_WIDTH
                  : FOOTER_SECONDARY_LOGO_MAX_WIDTH) / image.width,
                (isWideSecondaryLogo
                  ? FOOTER_WIDE_SECONDARY_LOGO_MAX_HEIGHT
                  : FOOTER_SECONDARY_LOGO_MAX_HEIGHT) / image.height,
              );
              return {
                src,
                image,
                drawWidth: image.width * scale,
                drawHeight: image.height * scale,
              };
            }),
          );
          const filteredSecondaryImages = secondaryImages.filter(
            (item): item is NonNullable<typeof item> => Boolean(item),
          );
          const secondaryTotalWidth = filteredSecondaryImages.reduce((sum, item) => sum + item.drawWidth, 0);
          const gapCount = Math.max(0, (footerImage ? 1 : 0) + filteredSecondaryImages.length - 1);
          const totalWidth = footerDrawWidth + secondaryTotalWidth + FOOTER_SECONDARY_GAP * gapCount;
          const startX = (canvasSize - totalWidth) / 2;
          const footerCenterY = canvasSize - footerHeight / 2;
          let cursorX = startX;

          if (footerImage) {
            context.drawImage(
              footerImage,
              cursorX,
              footerCenterY - footerDrawHeight / 2,
              footerDrawWidth,
              footerDrawHeight,
            );
            cursorX += footerDrawWidth + (secondaryImages.length > 0 ? FOOTER_SECONDARY_GAP : 0);
          }
          filteredSecondaryImages.forEach((item) => {
            context.drawImage(
              item.image,
              cursorX,
              footerCenterY - item.drawHeight / 2,
              item.drawWidth,
              item.drawHeight,
            );
            cursorX += item.drawWidth + FOOTER_SECONDARY_GAP;
          });
        }
      }

      context.fillStyle = dividerColor;
      context.fillRect(canvasSize * dividerX - DIVIDER_WIDTH / 2, dividerTop, DIVIDER_WIDTH, dividerHeight);

      context.textAlign = "center";
      context.textBaseline = "alphabetic";
      context.fillStyle = couponTextColor;

      renderedTypeLines.forEach((line, index) => {
        const lineElement = typeLineRefs.current[index];
        if (!lineElement) return;
        const rect = lineElement.getBoundingClientRect();
        const style = window.getComputedStyle(lineElement);
        const previewFontSize = parseFloat(style.fontSize);
        const fontSize = previewFontSize * layoutScale * EXPORT_TEXT_SCALE;
        const centerX = (rect.left - artworkBounds.left + rect.width / 2) * layoutScale;
        const centerY = (rect.top - artworkBounds.top + rect.height / 2) * layoutScale;
        const y = centerY + fontSize * (EXPORT_THAI_ASCENT_RATIO - 0.5);
        context.font = `${style.fontWeight} ${fontSize}px "DB Airy", "Noto Sans Thai", "Prompt", Arial, sans-serif`;
        context.fillText(line.text, centerX, y);
      });

      context.textAlign = "left";

      const contentBoxRect = contentBoxRef.current?.getBoundingClientRect();
      if (contentBoxRect) {
        context.save();
        context.beginPath();
        context.rect(
          (contentBoxRect.left - artworkBounds.left) * layoutScale,
          (contentBoxRect.top - artworkBounds.top) * layoutScale - EXPORT_THAI_CLIP_TOP_PADDING,
          contentBoxRect.width * layoutScale,
          contentBoxRect.height * layoutScale + EXPORT_THAI_CLIP_TOP_PADDING + EXPORT_THAI_CLIP_BOTTOM_PADDING,
        );
        context.clip();
      }

      lineBlocks.forEach((_, index) => {
        const lineElement = contentLineRefs.current[index];
        if (!lineElement) return;
        const rect = lineElement.getBoundingClientRect();
        const style = window.getComputedStyle(lineElement);
        const previewFontSize = parseFloat(style.fontSize);
        const fontSize = previewFontSize * layoutScale * EXPORT_TEXT_SCALE;
        const text = getDisplayContentText(index);
        const x = (rect.left - artworkBounds.left) * layoutScale;
        const centerY = (rect.top - artworkBounds.top + rect.height / 2) * layoutScale;
        const y = centerY + fontSize * (EXPORT_THAI_ASCENT_RATIO - 0.5);
        const maxWidth = rect.width * layoutScale;
        context.font = `${style.fontWeight} ${fontSize}px "DB Airy", "Noto Sans Thai", "Prompt", Arial, sans-serif`;
        context.fillText(text, x, y, maxWidth);
      });

      if (contentBoxRect) {
        context.restore();
      }

      const cutoutRadius = sideCutoutSize / 2;
      context.save();
      context.globalCompositeOperation = "destination-out";
      context.beginPath();
      context.arc(0, redTop, cutoutRadius, 0, Math.PI * 2);
      context.fill();
      context.beginPath();
      context.arc(canvasSize, redTop, cutoutRadius, 0, Math.PI * 2);
      context.fill();
      context.restore();
  };

  useLayoutEffect(() => {
    const generation = ++renderGenerationRef.current;
    let cancelled = false;

    if (renderFrameRef.current !== null) {
      cancelAnimationFrame(renderFrameRef.current);
    }

    renderFrameRef.current = requestAnimationFrame(() => {
      renderFrameRef.current = null;
      if (cancelled || generation !== renderGenerationRef.current) return;

      void (async () => {
        await loadCouponFonts();
        if (cancelled || generation !== renderGenerationRef.current) return;

        const canvas = previewCanvasRef.current;
        const measureRoot = artworkRef.current;
        if (!canvas || !measureRoot) return;

        const bounds = measureRoot.getBoundingClientRect();
        if (bounds.width < 1) return;

        if (!offscreenCanvasRef.current) {
          offscreenCanvasRef.current = document.createElement("canvas");
        }
        const offscreenCanvas = offscreenCanvasRef.current;

        if (offscreenCanvas.width !== canvasSize || offscreenCanvas.height !== canvasSize) {
          offscreenCanvas.width = canvasSize;
          offscreenCanvas.height = canvasSize;
        }
        if (canvas.width !== canvasSize || canvas.height !== canvasSize) {
          canvas.width = canvasSize;
          canvas.height = canvasSize;
        }

        const offscreenContext = offscreenCanvas.getContext("2d");
        const visibleContext = canvas.getContext("2d");
        if (!offscreenContext || !visibleContext) return;

        offscreenContext.imageSmoothingEnabled = true;
        offscreenContext.imageSmoothingQuality = "high";
        visibleContext.imageSmoothingEnabled = true;
        visibleContext.imageSmoothingQuality = "high";

        try {
          await paintCouponToCanvas(offscreenContext);
        } catch (error) {
          console.error("Preview render failed:", error);
          return;
        }

        if (cancelled || generation !== renderGenerationRef.current) return;

        visibleContext.drawImage(offscreenCanvas, 0, 0);
      })();
    });

    return () => {
      cancelled = true;
      if (renderFrameRef.current !== null) {
        cancelAnimationFrame(renderFrameRef.current);
        renderFrameRef.current = null;
      }
    };
  }, [
    selection,
    couponTypeValue,
    contentLines,
    uploadedImageUrl,
    uploadedLogoUrl,
    selection.logoAspectRatio,
    cropOffset.x,
    cropOffset.y,
    imageScale,
    isFooterLayout,
    footerLogoSrc,
    footerSecondaryLogoSrcs.length,
    showMPowerLogo,
    mPowerBenefitLogoSrcs.length,
    isWhiteTierTheme,
    isRedTierTheme,
    isBlueTierTheme,
    isBlackTierTheme,
    template.expectedLineCount,
    template.contentLayout.id,
  ]);

  const handleExport = async () => {
    const outputScale = exportScale;

    try {
      setExporting(true);
      await loadCouponFonts();
      const canvas = document.createElement("canvas");
      canvas.width = canvasSize * outputScale;
      canvas.height = canvasSize * outputScale;
      const context = canvas.getContext("2d");

      if (!context) {
        throw new Error("ไม่สามารถสร้าง canvas export ได้");
      }

      context.scale(outputScale, outputScale);
      context.imageSmoothingEnabled = true;
      context.imageSmoothingQuality = "high";

      await paintCouponToCanvas(context);

      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob((nextBlob) => {
          if (nextBlob) {
            resolve(nextBlob);
            return;
          }
          reject(new Error("ไม่สามารถสร้างไฟล์ PNG ได้"));
        }, "image/png");
      });

      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.download = `coupon-template-${selection.couponType}-${selection.contentLayout}-x${outputScale}.png`;
      link.href = blobUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.setTimeout(() => URL.revokeObjectURL(blobUrl), 0);
    } catch (error) {
      console.error(error);
      const message =
        error instanceof Error ? error.message : "เกิดข้อผิดพลาดระหว่าง export รูปภาพ";
      window.alert(`ไม่สามารถ export รูปภาพได้ในตอนนี้: ${message}`);
    } finally {
      setExporting(false);
    }
  };

  const handleLocalFileSelect = (files: FileList | null) => {
    const file = files?.[0];
    if (!file) return;
    if (!ACCEPTED_TYPES.includes(file.type)) return;
    onFileSelect(file);
  };

  const handleLogoFileSelect = (files: FileList | null) => {
    const file = files?.[0];
    if (!file) return;
    if (!LOGO_ACCEPTED_TYPES.includes(file.type)) return;
    onLogoSelect(file);
  };

  return (
    <section className="rounded-2xl border border-white/70 bg-white/80 p-5 shadow-soft backdrop-blur md:p-6">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h2 className="font-display text-xl font-semibold text-ink">Preview คูปอง</h2>
          <p className="mt-1 text-sm leading-5 text-ink/60">ตัวอย่างด้านล่าง = ผลลัพธ์ที่ Export</p>
        </div>
        <span className="rounded-full bg-mint/60 px-2.5 py-1 text-xs font-semibold text-ink">
          {template.contentLayout.label}
        </span>
      </div>

      <div className="mt-3 flex flex-col gap-3 rounded-xl border border-ink/8 bg-sand/25 p-3 sm:flex-row sm:items-center">
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white ${
            uploadedLogoUrl ? "border border-ink/10" : "border border-dashed border-ink/15"
          }`}
        >
          {uploadedLogoUrl ? (
            <img src={uploadedLogoUrl} alt="" className="h-full w-full object-contain" decoding="async" />
          ) : (
            <span className="text-[11px] font-medium text-ink/40">โลโก้</span>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-ink">โลโก้มุมขวาบน</p>
          <p className="text-xs text-ink/50">ไม่บังคับ — แสดงบนพื้นที่รูปด้านบน</p>
        </div>
        <div className="flex w-full shrink-0 flex-wrap items-center gap-2 sm:w-auto sm:justify-end">
          <div className="w-[88px] shrink-0">
            <CustomSelect
              value={selection.logoAspectRatio}
              options={LOGO_ASPECT_OPTIONS.map((option) => ({
                value: option.id,
                label: option.label,
              }))}
              onChange={onLogoAspectRatioChange}
            />
          </div>
          <input
            ref={logoInputRef}
            type="file"
            accept=".jpg,.jpeg,.png,.webp,.svg"
            className="hidden"
            onChange={(event) => {
              handleLogoFileSelect(event.target.files);
              event.currentTarget.value = "";
            }}
          />
          <button
            type="button"
            onClick={() => logoInputRef.current?.click()}
            className="min-w-[72px] rounded-full border border-ink/12 bg-white px-3.5 py-1.5 text-center text-xs font-semibold text-ink transition hover:border-ink"
          >
            {uploadedLogoName ? "เปลี่ยน" : "อัปโหลด"}
          </button>
          <button
            type="button"
            onClick={onLogoClear}
            aria-hidden={!uploadedLogoName}
            tabIndex={uploadedLogoName ? 0 : -1}
            className={`min-w-[40px] rounded-full px-3 py-1.5 text-center text-xs font-medium text-ink/55 transition hover:text-ink ${
              uploadedLogoName ? "" : "invisible pointer-events-none"
            }`}
          >
            ลบ
          </button>
        </div>
      </div>

      <div className="mt-4">
        <div className="relative mx-auto aspect-square w-full max-w-[520px] overflow-hidden bg-transparent shadow-[0_20px_60px_rgba(16,33,45,0.18)]">
          <div
            ref={artworkRef}
            className="pointer-events-none invisible absolute inset-0 overflow-hidden"
            aria-hidden
          >
            <div
              className="absolute flex flex-col justify-center overflow-visible text-center"
              style={{
                ...previewFontStyle,
                color: couponTextColor,
                left: `${typeLeft * 100}%`,
                width: `${typeWidth * 100}%`,
                top: `${(textBlockTop / canvasSize) * 100}%`,
                height: `${(textBlockHeight / canvasSize) * 100}%`,
              }}
            >
              <div className="leading-[1.02]" style={{ display: "grid", rowGap: `${scaleToPreview(TYPE_LINE_GAP)}px` }}>
                {renderedTypeLines.map((line: { text: string; size: number; weight: string }, index) => (
                  <div
                    key={line.text}
                    ref={(element) => {
                      typeLineRefs.current[index] = element;
                    }}
                    className={thaiSafeLineClass}
                    style={{
                      fontSize: `${scaleToPreview(line.size)}px`,
                      fontWeight: Number(line.weight),
                    }}
                  >
                    {line.text}
                  </div>
                ))}
              </div>
            </div>

            <div
              ref={contentBoxRef}
              className="absolute flex flex-col justify-center overflow-visible py-2.5 text-left"
              style={{
                ...previewFontStyle,
                color: couponTextColor,
                left: `${contentLeft * 100}%`,
                width: `${contentWidth * 100}%`,
                top: `${(textBlockTop / canvasSize) * 100}%`,
                height: `${(textBlockHeight / canvasSize) * 100}%`,
                boxSizing: "border-box",
              }}
            >
              <div className="leading-[1.08]" style={{ display: "grid", rowGap: `${scaleToPreview(CONTENT_LINE_GAP)}px` }}>
                {lineBlocks.map((_, index) => {
                  const displayText = getDisplayContentText(index);
                  return (
                    <div
                      key={index}
                      ref={(element) => {
                        contentLineRefs.current[index] = element;
                      }}
                      className={thaiSafeLineClass}
                      style={getContentLineStyle(index, displayText)}
                    >
                      {displayText}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <canvas ref={previewCanvasRef} className="relative block aspect-square w-full" />

          <div className="absolute inset-0 z-10">
            <input
              ref={inputRef}
              type="file"
              accept=".jpg,.jpeg,.png,.webp"
              className="hidden"
              onChange={(event) => handleLocalFileSelect(event.target.files)}
            />
            <div
              ref={imageAreaRef}
              className={`absolute left-0 right-0 top-0 ${
                uploadedImageUrl ? "cursor-grab active:cursor-grabbing" : ""
              }`}
              style={{ height: `${(redTop / canvasSize) * 100}%` }}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
            />
            {!uploadedImageUrl ? (
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="absolute left-0 right-0 top-0 flex items-center justify-center bg-transparent text-center transition hover:bg-black/5"
                style={{ height: `${(redTop / canvasSize) * 100}%` }}
              >
                <div className="rounded-full bg-white/90 px-5 py-2.5 text-sm font-semibold text-ink shadow-md backdrop-blur">
                  คลิกเพื่ออัปโหลดรูป
                </div>
              </button>
            ) : isEditingImage ? (
              <div className="absolute inset-x-4 top-4 flex items-start justify-between gap-3">
                <div className="rounded-2xl bg-black/40 px-3 py-2 text-xs font-medium text-white/90 backdrop-blur">
                  ลากรูปเพื่อปรับตำแหน่ง
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2 rounded-full bg-black/45 px-3 py-2 backdrop-blur">
                    <span className="text-xs font-semibold text-white/85">Zoom</span>
                    <input
                      type="range"
                      min={MIN_IMAGE_SCALE}
                      max={MAX_IMAGE_SCALE}
                      step={0.01}
                      value={imageScale}
                      onChange={(event) => setImageScale(Number(event.target.value))}
                      className="h-1 w-20 accent-white"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={resetCrop}
                    className="rounded-full bg-black/45 px-3 py-2 text-xs font-semibold text-white backdrop-blur transition hover:bg-black/55"
                  >
                    Reset
                  </button>
                  <button
                    type="button"
                    onClick={() => inputRef.current?.click()}
                    className="rounded-full bg-black/45 px-4 py-2 text-xs font-semibold text-white backdrop-blur transition hover:bg-black/55"
                  >
                    Change Image
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditingImage(false)}
                    className="rounded-full bg-white/80 px-4 py-2 text-xs font-semibold text-ink shadow-sm backdrop-blur transition hover:bg-white"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setIsEditingImage(true)}
                className="absolute right-4 top-4 rounded-full bg-black/45 px-4 py-2 text-xs font-semibold text-white backdrop-blur transition hover:bg-black/55"
              >
                Edit
              </button>
            )}
          </div>
        </div>
        <p className="mt-2 text-center text-xs text-ink/50">คลิกพื้นที่สีเทาด้านบนเพื่ออัปโหลดรูปพื้นหลัง</p>
      </div>

      <div className="mt-4 space-y-3">
        <div className="flex flex-col gap-3 rounded-xl border border-ink/10 bg-white p-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-ink">Export PNG</span>
            <div
              className="inline-flex rounded-full bg-ink/5 p-0.5"
              role="group"
              aria-label="ขนาดไฟล์ Export"
            >
              {EXPORT_SCALES.map((scale) => {
                const selected = exportScale === scale;
                return (
                  <button
                    key={scale}
                    type="button"
                    onClick={() => setExportScale(scale)}
                    disabled={exporting}
                    aria-pressed={selected}
                    title={`${EXPORT_BASE_SIZE * scale} × ${EXPORT_BASE_SIZE * scale} px`}
                    className={`min-w-[32px] rounded-full px-2 py-0.5 text-xs font-semibold transition ${
                      selected ? "bg-ink text-white" : "text-ink/55 hover:text-ink"
                    } disabled:opacity-60`}
                  >
                    x{scale}
                  </button>
                );
              })}
            </div>
            <span className="text-xs text-ink/50 tabular-nums">
              {EXPORT_BASE_SIZE * exportScale}px
            </span>
          </div>
          <button
            type="button"
            onClick={handleExport}
            disabled={exporting}
            className="inline-flex items-center justify-center gap-1.5 rounded-full bg-ink px-5 py-2 text-sm font-semibold text-white transition hover:bg-ink/90 disabled:opacity-70"
          >
            <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M10 3v9" strokeLinecap="round" />
              <path d="M6.5 9.5 10 13l3.5-3.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M4 16h12" strokeLinecap="round" />
            </svg>
            {exporting ? "กำลัง Export..." : "ดาวน์โหลด"}
          </button>
        </div>

        <ul className="space-y-2.5 text-sm leading-relaxed text-ink/60">
          <li className="flex gap-2.5">
            <span
              className="mt-1 h-3 w-3 shrink-0 rounded-sm border border-ink/10"
              style={{ backgroundColor: "#dddddd" }}
              aria-hidden
            />
            <span>
              <span className="font-semibold text-ink/70">พื้นหลัง (สีเทา)</span>
              {" — "}
              พื้นที่ด้านบนของคูปอง สำหรับอัปโหลดรูปภาพหลัก (คลิกหรือลากเพื่อปรับตำแหน่ง/ซูมได้)
            </span>
          </li>
          <li className="flex gap-2.5">
            <span
              className="mt-1 h-3 w-3 shrink-0 rounded-sm border border-ink/10"
              style={legendCouponBarStyle}
              aria-hidden
            />
            <span>
              <span className="font-semibold text-ink/70">แถบคูปอง</span>
              {" — "}
              พื้นที่ใส่ข้อความประเภทคูปองและข้อความรายละเอียด สีเปลี่ยนตามระดับ M Power ที่เลือก
              {selection.mPowerTierEnabled ? "" : " (ค่าเริ่มต้นเป็นสีแดง)"}
            </span>
          </li>
          <li className="flex gap-2.5">
            <span
              className="mt-1 h-3 w-3 shrink-0 rounded-sm border border-ink/10 bg-black"
              aria-hidden
            />
            <span>
              <span className="font-semibold text-ink/70">Footer</span>
              {" — "}
              แถบดำด้านล่างสุดสำหรับโลโก้บัตรที่ร่วมรายการ{" "}
              {isFooterLayout ? (
                <>
                  <span className="font-medium text-ink/65">(แสดงอยู่)</span> เปิดจากขั้นที่ 1
                  กลุ่มลูกค้า โดยติ๊ก <span className="font-medium text-ink/65">ผู้ถือบัตร BBLM</span>{" "}
                  แล้วเลือกประเภทบัตร
                </>
              ) : (
                <>
                  จะปรากฏเมื่อไปที่ขั้นที่ 1 กลุ่มลูกค้า ติ๊ก{" "}
                  <span className="font-medium text-ink/65">ผู้ถือบัตร BBLM</span> และเลือกอย่างน้อย 1
                  ประเภทบัตร — ตอนนี้ยังไม่เปิด แถบคูปองจึงยาวลงจนขอบล่าง
                </>
              )}
            </span>
          </li>
        </ul>
      </div>
    </section>
  );
};
