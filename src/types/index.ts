export type FooterVariant = "with-footer" | "without-footer";
export type EligibleCardId =
  | "legend"
  | "luxe"
  | "live"
  | "debit"
  | "prepaid";

export type MPowerTier = "white" | "red" | "blue" | "black";

export type CouponTypeId =
  | "free"
  | "register"
  | "privilege"
  | "redeem-mpoint"
  | "discount-baht"
  | "ecoupon-baht"
  | "donate-mpoint"
  | "discount-percent";

export type ContentLayoutId =
  | "head-sub-2"
  | "head2-2"
  | "head2-sub1-3"
  | "head1-sub2-3";

export type LogoAspectRatio = "1:1" | "16:9" | "9:16";

export interface CouponTypeOption {
  id: CouponTypeId;
  label: string;
  description: string;
  example: string;
}

export interface ContentLayoutOption {
  id: ContentLayoutId;
  label: string;
  description: string;
  expectedLineCount: number;
  roleSummary: string[];
}

export interface TemplateSelection {
  eligibleCustomerEnabled: boolean;
  eligibleCards: EligibleCardId[];
  mPowerTierEnabled: boolean;
  mPowerTier: MPowerTier;
  mPowerBenefitTiers: MPowerTier[];
  footerVariant: FooterVariant;
  couponType: CouponTypeId;
  contentLayout: ContentLayoutId;
  logoAspectRatio: LogoAspectRatio;
}

export interface TemplateConfig {
  footerVariant: FooterVariant;
  couponType: CouponTypeOption;
  contentLayout: ContentLayoutOption;
  hasFooter: boolean;
  expectedLineCount: number;
}
