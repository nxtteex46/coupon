import { useState } from "react";
import { CouponPreview } from "./components/CouponPreview";
import { Header } from "./components/Header";
import { MobileDevicePreview } from "./components/MobileDevicePreview";
import { TemplateForm } from "./components/TemplateForm";
import { defaultTemplateSelection, getContentLayoutById } from "./data/templates";
import type { TemplateSelection } from "./types";

const readFileAsDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.onerror = () => reject(new Error("ไม่สามารถอ่านไฟล์รูปภาพได้"));
    reader.readAsDataURL(file);
  });

const preloadImage = (src: string) =>
  new Promise<void>((resolve, reject) => {
    const image = new Image();
    image.decoding = "async";
    image.onload = () => resolve();
    image.onerror = () => reject(new Error("ไม่สามารถโหลดตัวอย่างรูปภาพได้"));
    image.src = src;
  });
type AppTab = "validator" | "mobile-preview" | "download-asset" | "contact";
const COUPON_CANVAS_WIDTH = 1040;
const CONTENT_WIDTH_RATIO = 0.61;
const CONTENT_MAX_WIDTH = COUPON_CANVAS_WIDTH * CONTENT_WIDTH_RATIO - 6;
const textMeasureCanvas =
  typeof document !== "undefined" ? document.createElement("canvas") : null;

const getContentTextStyle = (
  layoutId: TemplateSelection["contentLayout"],
  index: number,
) => {
  const headStyle = { size: 28, weight: 700 };
  const subStyle = { size: 22, weight: 400 };

  switch (layoutId) {
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

const fitContentTextToWidth = (
  value: string,
  layoutId: TemplateSelection["contentLayout"],
  index: number,
) => {
  if (!textMeasureCanvas) {
    return value;
  }

  const context = textMeasureCanvas.getContext("2d");
  if (!context) {
    return value;
  }

  const { size, weight } = getContentTextStyle(layoutId, index);
  context.font = `${weight} ${size}px "DB Ariy", "Noto Sans Thai", "Prompt", Arial, sans-serif`;

  if (context.measureText(value).width <= CONTENT_MAX_WIDTH) {
    return value;
  }

  let fittedValue = value;
  while (fittedValue.length > 0 && context.measureText(fittedValue).width > CONTENT_MAX_WIDTH) {
    fittedValue = fittedValue.slice(0, -1);
  }

  return fittedValue;
};

const getDefaultContentLines = (layoutId: TemplateSelection["contentLayout"]): string[] => {
  const layout = getContentLayoutById(layoutId);
  if (!layout) return [];

  return Array.from({ length: layout.expectedLineCount }, (_, index) =>
    index === 0 ? "Headline" : index === 1 ? "Subline" : "Detail",
  );
};

function App() {
  const [activeTab, setActiveTab] = useState<AppTab>("validator");
  const [selection, setSelection] = useState<TemplateSelection>(defaultTemplateSelection);
  const [couponTypeValue, setCouponTypeValue] = useState("9,999");
  const [contentLines, setContentLines] = useState<string[]>(
    getDefaultContentLines(defaultTemplateSelection.contentLayout),
  );
  const [file, setFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const resetState = () => {
    setSelection(defaultTemplateSelection);
    setCouponTypeValue("9,999");
    setContentLines(getDefaultContentLines(defaultTemplateSelection.contentLayout));
    setFile(null);
    setLogoFile(null);
    setImagePreview(null);
    setLogoPreview(null);
  };

  const handleSelectionChange = (next: TemplateSelection) => {
    setSelection(next);
    setContentLines((currentLines) => {
      const expectedLines = getDefaultContentLines(next.contentLayout);
      return expectedLines.map((fallback, index) =>
        fitContentTextToWidth(currentLines[index] ?? fallback, next.contentLayout, index),
      );
    });
  };

  const handleContentChange = (index: number, value: string) => {
    const sanitizedValue = value.replace(/[\r\n]+/g, " ");
    const fittedValue = fitContentTextToWidth(sanitizedValue, selection.contentLayout, index);

    setContentLines((currentLines) =>
      currentLines.map((line, currentIndex) =>
        currentIndex === index ? fittedValue : line,
      ),
    );
  };

  const handleFileSelect = async (nextFile: File) => {
    try {
      const nextPreview = await readFileAsDataUrl(nextFile);
      setFile(nextFile);
      setImagePreview(nextPreview);
    } catch (error) {
      console.error(error);
      setFile(null);
      setImagePreview(null);
      window.alert("ไม่สามารถอ่านไฟล์รูปคูปองได้");
    }
  };

  const handleLogoSelect = async (nextFile: File) => {
    try {
      const nextPreview = await readFileAsDataUrl(nextFile);
      await preloadImage(nextPreview);
      setLogoFile(nextFile);
      setLogoPreview(nextPreview);
    } catch (error) {
      console.error(error);
      setLogoFile(null);
      setLogoPreview(null);
      window.alert("ไม่สามารถอ่านไฟล์โลโก้ได้");
    }
  };

  const handleLogoClear = () => {
    setLogoFile(null);
    setLogoPreview(null);
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(255,139,106,0.18),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(154,215,255,0.25),_transparent_22%),linear-gradient(180deg,_#f7f1ea_0%,_#eef7fb_48%,_#fffdfa_100%)]">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col gap-6 px-4 py-6 md:px-6 lg:px-8">
        <Header />

        <nav
          aria-label="เมนูหลัก"
          className="rounded-2xl border border-white/70 bg-white/80 p-1.5 shadow-soft backdrop-blur"
        >
          <div className="flex gap-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {[
              {
                id: "validator" as const,
                label: "สร้างคูปอง",
                icon: (
                  <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <rect x="3" y="3" width="14" height="14" rx="2.5" />
                    <path d="M7 7h6M7 10h4" strokeLinecap="round" />
                  </svg>
                ),
              },
              {
                id: "mobile-preview" as const,
                label: "ดูบนมือถือ",
                icon: (
                  <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <rect x="5.5" y="2.5" width="9" height="15" rx="2" />
                    <path d="M9 15.5h2" strokeLinecap="round" />
                  </svg>
                ),
              },
              {
                id: "download-asset" as const,
                label: "ดาวน์โหลด",
                icon: (
                  <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M10 3v9" strokeLinecap="round" />
                    <path d="M6.5 9.5 10 13l3.5-3.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M4 16h12" strokeLinecap="round" />
                  </svg>
                ),
              },
              {
                id: "contact" as const,
                label: "ติดต่อ",
                icon: (
                  <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <rect x="3" y="5" width="14" height="10" rx="2" />
                    <path d="M3 6.5l7 5 7-5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ),
              },
            ].map((tab) => {
              const selected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  aria-current={selected ? "page" : undefined}
                  className={`flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                    selected
                      ? "bg-ink text-white shadow-[0_8px_20px_rgba(16,33,45,0.18)]"
                      : "text-ink/70 hover:bg-ink/5 hover:text-ink"
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              );
            })}
          </div>
        </nav>

        {activeTab === "validator" ? (
          <>
            <main className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
              <TemplateForm
                selection={selection}
                couponTypeValue={couponTypeValue}
                contentLines={contentLines}
                onChange={handleSelectionChange}
                onCouponTypeValueChange={setCouponTypeValue}
                onContentChange={handleContentChange}
                onReset={resetState}
              />

              <div className="xl:sticky xl:top-6 xl:self-start">
                <CouponPreview
                  selection={selection}
                  couponTypeValue={couponTypeValue}
                  contentLines={contentLines}
                  uploadedImageUrl={imagePreview}
                  uploadedLogoUrl={logoPreview}
                  uploadedLogoName={logoFile?.name ?? null}
                  onFileSelect={handleFileSelect}
                  onLogoSelect={handleLogoSelect}
                  onLogoClear={handleLogoClear}
                  onLogoAspectRatioChange={(logoAspectRatio) =>
                    handleSelectionChange({ ...selection, logoAspectRatio })
                  }
                />
              </div>
            </main>
          </>
        ) : activeTab === "mobile-preview" ? (
          <MobileDevicePreview />
        ) : activeTab === "download-asset" ? (
          <section className="rounded-2xl border border-white/70 bg-white/80 p-6 shadow-soft backdrop-blur">
            <div className="max-w-3xl">
              <h2 className="font-display text-xl font-semibold text-ink">ดาวน์โหลด Asset</h2>
              <p className="mt-1.5 text-sm leading-6 text-ink/65">
                รวมไฟล์โลโก้, mockup และ coupon export สำหรับใช้งานต่อ
              </p>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {[
                "Logo Assets",
                "M Power Assets",
                "Footer Assets",
                "Device Mockups",
                "Coupon Exports",
                "Brand Images",
              ].map((item) => (
                <article
                  key={item}
                  className="rounded-[24px] border border-ink/10 bg-gradient-to-br from-white to-sand/40 p-5 shadow-[0_10px_24px_rgba(16,33,45,0.06)]"
                >
                  <h3 className="text-base font-semibold text-ink">{item}</h3>
                  <p className="mt-2 text-sm leading-6 text-ink/60">
                    Placeholder section สำหรับรวบรวมไฟล์ดาวน์โหลดของหมวดนี้
                  </p>
                </article>
              ))}
            </div>
          </section>
        ) : activeTab === "contact" ? (
          <section className="rounded-2xl border border-white/70 bg-white/80 p-6 shadow-soft backdrop-blur">
            <div className="max-w-3xl">
              <h2 className="font-display text-xl font-semibold text-ink">ติดต่อทีมงาน</h2>
              <p className="mt-1.5 text-sm leading-6 text-ink/65">
                ช่องทางสำหรับประสานงานและส่ง feedback
              </p>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {[
                { title: "Email", value: "design-team@example.com" },
                { title: "Phone", value: "+66 0 0000 0000" },
                { title: "Line OA", value: "@examplebrand" },
                { title: "Office Hours", value: "Mon - Fri, 09:00 - 18:00" },
              ].map((item) => (
                <article
                  key={item.title}
                  className="rounded-[24px] border border-ink/10 bg-white p-5 shadow-[0_10px_24px_rgba(16,33,45,0.06)]"
                >
                  <p className="text-sm font-medium uppercase tracking-[0.12em] text-ink/45">{item.title}</p>
                  <p className="mt-3 text-base font-semibold text-ink">{item.value}</p>
                </article>
              ))}
            </div>
          </section>
        ) : (
          <MobileDevicePreview />
        )}
      </div>
    </div>
  );
}

export default App;
