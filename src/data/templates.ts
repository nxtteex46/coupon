import type {
  ContentLayoutId,
  ContentLayoutOption,
  CouponTypeId,
  CouponTypeOption,
  EligibleCardId,
  FooterVariant,
  MPowerTier,
  TemplateConfig,
  TemplateSelection,
} from "../types";

export const eligibleCardOptions: Array<{
  id: EligibleCardId;
  label: string;
}> = [
  { id: "legend", label: "Bangkok Bank M Visa Legend Credit Card" },
  { id: "luxe", label: "Bangkok Bank M Visa Luxe Credit Card" },
  { id: "live", label: "Bangkok Bank M Visa Live Credit Card" },
  { id: "debit", label: "Bangkok Bank M Debit Card" },
  { id: "prepaid", label: "Bangkok Bank M Prepaid Card" },
];

export const mPowerTierOptions: Array<{
  id: MPowerTier;
  label: string;
}> = [
  { id: "white", label: "White" },
  { id: "red", label: "Red" },
  { id: "blue", label: "Blue" },
  { id: "black", label: "Black" },
];

export const couponTypeOptions: CouponTypeOption[] = [
  {
    id: "free",
    label: "รับฟรี",
    description: "ข้อความประเภทคูปองต้องเป็นคำว่า รับฟรี",
    example: "รับฟรี",
  },
  {
    id: "register",
    label: "ลงทะเบียน",
    description: "เหมาะกับคูปองที่เน้น action ให้ลงทะเบียน",
    example: "ลงทะเบียน",
  },
  {
    id: "privilege",
    label: "รับสิทธิ์",
    description: "สำหรับข้อความประเภทรับสิทธิ์แบบคงที่",
    example: "รับสิทธิ์",
  },
  {
    id: "redeem-mpoint",
    label: "แลก xx M Point",
    description: "แยก pattern ข้อความออกจากตัวเลขจำนวน M Point",
    example: "แลก 100 M Point",
  },
  {
    id: "discount-baht",
    label: "รับส่วนลด xx บาท",
    description: "รองรับจำนวนส่วนลดที่เปลี่ยนได้",
    example: "รับส่วนลด 50 บาท",
  },
  {
    id: "ecoupon-baht",
    label: "รับ e-coupon xx บาท",
    description: "รองรับรูปแบบ e-coupon และตัวเลขหลายค่า",
    example: "รับ e-coupon 100 บาท",
  },
  {
    id: "donate-mpoint",
    label: "บริจาค xx M Point",
    description: "สำหรับคูปองบริจาคแต้ม M Point",
    example: "บริจาค 50 M Point",
  },
  {
    id: "discount-percent",
    label: "รับส่วนลด xx %",
    description: "รองรับเปอร์เซ็นต์ส่วนลดแบบ dynamic",
    example: "รับส่วนลด 10%",
  },
];

export const contentLayoutOptions: ContentLayoutOption[] = [
  {
    id: "head-sub-2",
    label: "2 บรรทัด Head + Sub",
    description: "บรรทัดแรกเด่นกว่า บรรทัดสองเป็นคำอธิบายหรือเงื่อนไขสั้น",
    expectedLineCount: 2,
    roleSummary: ["Head 1 บรรทัด", "Sub 1 บรรทัด"],
  },
  {
    id: "head2-2",
    label: "2 บรรทัด Head2",
    description: "สองบรรทัดมีน้ำหนักใกล้กัน ใช้เป็น headline คู่",
    expectedLineCount: 2,
    roleSummary: ["Head 2 บรรทัด", "ไม่มี Sub"],
  },
  {
    id: "head2-sub1-3",
    label: "3 บรรทัด Head2 + Sub1",
    description: "สองบรรทัดบนเด่น และมีบรรทัดย่อยปิดท้าย",
    expectedLineCount: 3,
    roleSummary: ["Head 2 บรรทัด", "Sub 1 บรรทัด"],
  },
  {
    id: "head1-sub2-3",
    label: "3 บรรทัด Head1 + Sub2",
    description: "บรรทัดแรกเด่นมาก ตามด้วย sub ต่อเนื่อง 2 บรรทัด",
    expectedLineCount: 3,
    roleSummary: ["Head 1 บรรทัด", "Sub 2 บรรทัด"],
  },
];

export const getTemplateConfig = (selection: TemplateSelection): TemplateConfig => {
  const couponType = couponTypeOptions.find((item) => item.id === selection.couponType)!;
  const contentLayout = contentLayoutOptions.find((item) => item.id === selection.contentLayout)!;

  return {
    footerVariant: selection.footerVariant,
    couponType,
    contentLayout,
    hasFooter: selection.footerVariant === "with-footer",
    expectedLineCount: contentLayout.expectedLineCount,
  };
};

export const defaultTemplateSelection: TemplateSelection = {
  eligibleCustomerEnabled: false,
  eligibleCards: [],
  mPowerTierEnabled: false,
  mPowerTier: "white",
  mPowerBenefitTiers: [],
  footerVariant: "without-footer",
  couponType: "discount-baht",
  contentLayout: "head2-sub1-3",
  logoAspectRatio: "1:1",
};

export const getCouponTypeById = (id: CouponTypeId) =>
  couponTypeOptions.find((item) => item.id === id);

export const getContentLayoutById = (id: ContentLayoutId) =>
  contentLayoutOptions.find((item) => item.id === id);

export const getFooterVariantFromEligibleCustomer = (enabled: boolean): FooterVariant =>
  enabled ? "with-footer" : "without-footer";
