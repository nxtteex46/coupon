import {
  contentLayoutOptions,
  eligibleCardOptions,
  getFooterVariantFromEligibleCustomer,
  getContentLayoutById,
  mPowerTierOptions,
  couponTypeOptions,
} from "../data/templates";
import type { EligibleCardId, TemplateSelection } from "../types";
import { FormSection } from "./FormSection";
import { CustomInput, CustomSelect } from "./ui/CustomField";

const mPowerTierOrder: TemplateSelection["mPowerTier"][] = ["white", "red", "blue", "black"];
const formatCouponTypeValue = (value: string) => {
  const digits = value.replace(/\D+/g, "").slice(0, 5);
  if (!digits) return "";
  return Number(digits).toLocaleString("en-US");
};

interface TemplateFormProps {
  selection: TemplateSelection;
  couponTypeValue: string;
  contentLines: string[];
  onChange: (next: TemplateSelection) => void;
  onCouponTypeValueChange: (value: string) => void;
  onContentChange: (index: number, value: string) => void;
  onReset: () => void;
}

export const TemplateForm = ({
  selection,
  couponTypeValue,
  contentLines,
  onChange,
  onCouponTypeValueChange,
  onContentChange,
  onReset,
}: TemplateFormProps) => {
  const currentLayout = getContentLayoutById(selection.contentLayout);
  const isDynamicCouponType = [
    "redeem-mpoint",
    "discount-baht",
    "ecoupon-baht",
    "donate-mpoint",
    "discount-percent",
  ].includes(selection.couponType);
  const checkboxClass =
    "flex h-5 w-5 items-center justify-center rounded-md border border-ink/20 bg-white shadow-[inset_0_1px_2px_rgba(16,33,45,0.08)]";
  const allCardsSelected = selection.eligibleCards.length === eligibleCardOptions.length;
  const radioClass =
    "flex h-5 w-5 items-center justify-center rounded-full border border-ink/20 bg-white shadow-[inset_0_1px_2px_rgba(16,33,45,0.08)]";
  const syncMPowerBenefitTiers = (
    tier: TemplateSelection["mPowerTier"],
    currentTiers: TemplateSelection["mPowerBenefitTiers"],
  ) => {
    const currentIndex = mPowerTierOrder.indexOf(tier);
    const allowedTiers = mPowerTierOrder.slice(currentIndex);
    const preserved = currentTiers.filter((item) => allowedTiers.includes(item) && item !== tier);
    return [tier, ...preserved];
  };
  const toggleMPowerBenefitTier = (tierId: TemplateSelection["mPowerTier"]) => {
    const selectedTierIndex = mPowerTierOrder.indexOf(selection.mPowerTier);
    const targetTierIndex = mPowerTierOrder.indexOf(tierId);
    const isLocked = targetTierIndex <= selectedTierIndex;
    if (isLocked) return;

    const nextTiers = selection.mPowerBenefitTiers.includes(tierId)
      ? selection.mPowerBenefitTiers.filter((item) => item !== tierId)
      : [...selection.mPowerBenefitTiers, tierId];

    onChange({
      ...selection,
      mPowerBenefitTiers: nextTiers,
    });
  };

  const toggleEligibleCard = (cardId: EligibleCardId) => {
    const nextCards = selection.eligibleCards.includes(cardId)
      ? selection.eligibleCards.filter((item) => item !== cardId)
      : [...selection.eligibleCards, cardId];

    onChange({
      ...selection,
      eligibleCards: nextCards,
    });
  };

  const toggleAllEligibleCards = () => {
    onChange({
      ...selection,
      eligibleCards: allCardsSelected ? [] : eligibleCardOptions.map((card) => card.id),
    });
  };

  return (
    <section className="space-y-4 rounded-2xl border border-white/70 bg-white/80 p-5 shadow-soft backdrop-blur md:p-6">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-display text-xl font-semibold text-ink">ตั้งค่า Template</h2>
        <button
          type="button"
          onClick={onReset}
          className="rounded-full border border-ink/12 px-3.5 py-1.5 text-xs font-semibold text-ink/70 transition hover:border-ink hover:bg-ink hover:text-white"
        >
          รีเซ็ต
        </button>
      </div>

      <FormSection
        step={1}
        title="กลุ่มลูกค้า"
        description="กำหนดสิทธิ์ M Power หรือบัตร BBLM สำหรับ Footer (ไม่บังคับ)"
        defaultOpen
      >
        <div className="space-y-3">
          <label
            className={`flex cursor-pointer items-center gap-3 rounded-xl border px-3.5 py-3 transition ${
              selection.mPowerTierEnabled
                ? "border-ink/15 bg-sand/40"
                : "border-ink/8 bg-sand/15 hover:border-ink/12"
            }`}
          >
            <input
              type="checkbox"
              checked={selection.mPowerTierEnabled}
              onChange={(event) =>
                onChange({
                  ...selection,
                  mPowerTierEnabled: event.target.checked,
                  mPowerBenefitTiers: event.target.checked
                    ? syncMPowerBenefitTiers(selection.mPowerTier, selection.mPowerBenefitTiers)
                    : [],
                })
              }
              className="sr-only"
            />
            <span
              className={`flex h-6 w-6 items-center justify-center rounded-md border transition ${
                selection.mPowerTierEnabled
                  ? "border-ink/70 bg-ink/70 text-white"
                  : "border-ink/20 bg-white text-transparent"
              }`}
            >
              <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.4">
                <path d="M4 10.5 8 14l8-8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <div>
              <span className="block text-sm font-semibold text-ink">M Power Tier</span>
              <span className="text-xs text-ink/55">เลือกระดับสมาชิก</span>
            </div>
          </label>

          {selection.mPowerTierEnabled ? (
            <div className="rounded-xl border border-ink/8 bg-sand/20 px-3 py-3">
              <div className="grid gap-1 sm:grid-cols-2">
                {mPowerTierOptions.map((tier) => {
                  const selected = selection.mPowerTier === tier.id;
                  return (
                    <label
                      key={tier.id}
                      className="flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-2 transition hover:bg-white/60"
                    >
                      <input
                        type="radio"
                        name="m-power-tier"
                        checked={selected}
                        onChange={() =>
                          onChange({
                            ...selection,
                            mPowerTier: tier.id,
                            mPowerBenefitTiers: syncMPowerBenefitTiers(tier.id, selection.mPowerBenefitTiers),
                          })
                        }
                        className="sr-only"
                      />
                      <span className={radioClass}>
                        <span
                          className={`h-2 w-2 rounded-full transition ${
                            selected ? "bg-ink" : "bg-transparent"
                          }`}
                        />
                      </span>
                      <span className="text-sm font-medium text-ink">{tier.label}</span>
                    </label>
                  );
                })}
              </div>

              <div className="mt-3 border-t border-ink/8 pt-3">
                <p className="px-2 text-xs font-medium text-ink/60">สิทธิ์ที่ใช้ได้</p>
                <div className="mt-1.5 grid gap-1 sm:grid-cols-2">
                  {mPowerTierOptions.map((tier) => {
                    const checked = selection.mPowerBenefitTiers.includes(tier.id);
                    const selectedTierIndex = mPowerTierOrder.indexOf(selection.mPowerTier);
                    const tierIndex = mPowerTierOrder.indexOf(tier.id);
                    const disabled = tierIndex <= selectedTierIndex;
                    return (
                      <label
                        key={`benefit-${tier.id}`}
                        className={`flex items-center gap-2.5 rounded-lg px-2 py-2 transition ${
                          disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:bg-white/60"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleMPowerBenefitTier(tier.id)}
                          disabled={disabled}
                          className="sr-only"
                        />
                        <span className={`${checkboxClass} shadow-none`}>
                          <svg
                            viewBox="0 0 20 20"
                            className={`h-3.5 w-3.5 transition ${checked ? "text-ink" : "text-transparent"}`}
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.4"
                          >
                            <path d="M4 10.5 8 14l8-8" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </span>
                        <span className="text-sm font-medium text-ink">{tier.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : null}

          <label
            className={`flex cursor-pointer items-center gap-3 rounded-xl border px-3.5 py-3 transition ${
              selection.eligibleCustomerEnabled
                ? "border-ink/15 bg-sand/40"
                : "border-ink/8 bg-sand/15 hover:border-ink/12"
            }`}
          >
            <input
              type="checkbox"
              checked={selection.eligibleCustomerEnabled}
              onChange={(event) =>
                onChange({
                  ...selection,
                  eligibleCustomerEnabled: event.target.checked,
                  eligibleCards: event.target.checked ? selection.eligibleCards : [],
                  footerVariant: getFooterVariantFromEligibleCustomer(event.target.checked),
                })
              }
              className="sr-only"
            />
            <span
              className={`flex h-6 w-6 items-center justify-center rounded-md border transition ${
                selection.eligibleCustomerEnabled
                  ? "border-ink/70 bg-ink/70 text-white"
                  : "border-ink/20 bg-white text-transparent"
              }`}
            >
              <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.4">
                <path d="M4 10.5 8 14l8-8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <div>
              <span className="block text-sm font-semibold text-ink">ผู้ถือบัตร BBLM</span>
              <span className="text-xs text-ink/55">เลือกประเภทบัตรสำหรับ footer</span>
            </div>
          </label>

          {selection.eligibleCustomerEnabled ? (
            <div className="space-y-0.5 rounded-xl border border-ink/8 bg-sand/20 px-3 py-3">
              <label className="flex cursor-pointer items-center gap-3 px-1 py-2">
                <input
                  type="checkbox"
                  checked={allCardsSelected}
                  onChange={toggleAllEligibleCards}
                  className="sr-only"
                />
                <span className={`${checkboxClass} shadow-none`}>
                  <svg
                    viewBox="0 0 20 20"
                    className={`h-3.5 w-3.5 transition ${allCardsSelected ? "text-ink" : "text-transparent"}`}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.4"
                  >
                    <path d="M4 10.5 8 14l8-8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <span className="text-sm font-semibold text-ink">ทุกบัตร</span>
              </label>

              {eligibleCardOptions.map((card) => (
                <label key={card.id} className="flex cursor-pointer items-center gap-3 px-1 py-2">
                  <input
                    type="checkbox"
                    checked={selection.eligibleCards.includes(card.id)}
                    onChange={() => toggleEligibleCard(card.id)}
                    className="sr-only"
                  />
                  <span className={`${checkboxClass} shadow-none`}>
                    <svg
                      viewBox="0 0 20 20"
                      className={`h-3.5 w-3.5 transition ${
                        selection.eligibleCards.includes(card.id)
                          ? "text-ink"
                          : "text-transparent"
                      }`}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.4"
                    >
                      <path d="M4 10.5 8 14l8-8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <span className="text-sm text-ink">{card.label}</span>
                </label>
              ))}
            </div>
          ) : null}
        </div>
      </FormSection>

      <FormSection
        step={2}
        title="ประเภทคูปองและข้อความ"
        description="เลือกรูปแบบและกรอกเนื้อหาที่จะแสดงบนคูปอง"
        defaultOpen
      >
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <span className="text-sm font-medium text-ink">ประเภทคูปอง</span>
              <CustomSelect
                value={selection.couponType}
                options={couponTypeOptions.map((option) => ({
                  value: option.id,
                  label: option.label,
                }))}
                onChange={(couponType) => onChange({ ...selection, couponType })}
              />
            </div>

            <div className="space-y-1.5">
              <span className="text-sm font-medium text-ink">รูปแบบ Content</span>
              <CustomSelect
                value={selection.contentLayout}
                options={contentLayoutOptions.map((option) => ({
                  value: option.id,
                  label: option.label,
                }))}
                onChange={(contentLayout) => onChange({ ...selection, contentLayout })}
              />
            </div>
          </div>

          {currentLayout ? (
            <p className="rounded-xl bg-sand/40 px-3 py-2 text-xs leading-5 text-ink/60">
              {currentLayout.description}
            </p>
          ) : null}

          {isDynamicCouponType ? (
            <div className="space-y-1.5">
              <span className="text-sm font-medium text-ink">ตัวเลขในคูปอง</span>
              <CustomInput
                type="text"
                value={couponTypeValue}
                inputMode="numeric"
                onChange={(event) => onCouponTypeValueChange(formatCouponTypeValue(event.target.value))}
                placeholder="เช่น 100 หรือ 9,999"
                maxLength={6}
              />
              <p className="text-xs text-ink/45">ใส่ตัวเลขได้สูงสุดหลักหมื่น</p>
            </div>
          ) : null}

          <div className="space-y-3">
            {contentLines.map((value, index) => (
              <div key={`${selection.contentLayout}-${index}`} className="space-y-1.5">
                <span className="text-sm font-medium text-ink">
                  {index === 0 ? "หัวข้อหลัก" : index === 1 ? "หัวข้อรอง" : `รายละเอียด ${index - 1}`}
                </span>
                <CustomInput
                  type="text"
                  value={value}
                  onChange={(event) => onContentChange(index, event.target.value.replace(/[\r\n]+/g, " "))}
                  placeholder={`กรอกข้อความบรรทัดที่ ${index + 1}`}
                />
              </div>
            ))}
          </div>
        </div>
      </FormSection>
    </section>
  );
};
