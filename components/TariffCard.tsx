"use client";

import { cn } from "@/lib/cn";
import { calcDiscountPercent, formatPrice } from "@/lib/format";
import type { Tariff } from "@/types/tariff";

type TariffCardProps = {
  tariff: Tariff;
  selected: boolean;
  showDiscountPrices: boolean;
  discountExiting: boolean;
  onSelect: () => void;
};

export default function TariffCard({
  tariff,
  selected,
  showDiscountPrices,
  discountExiting,
  onSelect
}: TariffCardProps) {
  const isBest = tariff.is_best;
  const discountPercent = calcDiscountPercent(tariff.price, tariff.full_price);
  const currentPrice = showDiscountPrices ? tariff.price : tariff.full_price;
  const previousPrice = showDiscountPrices ? tariff.full_price : null;
  const containerClassName = cn(
    "relative w-full border text-left transition-colors",
    isBest
      ? "min-h-[114px] rounded-[18px] bg-[#30373d] px-4 py-3 md:min-h-[128px] md:rounded-[20px] md:px-5 md:py-4 xl:min-h-[150px]"
      : "min-h-[96px] rounded-[15px] bg-[#343b42] px-3 py-2.5 md:min-h-[156px] md:rounded-[18px] md:px-4 md:py-3 xl:min-h-[186px]",
    selected ? "border-[#f2b45d]" : isBest ? "border-[#8c6f43]" : "border-[#4e5861]"
  );

  const priceClassName = cn(
    "font-extrabold leading-none",
    isBest
      ? showDiscountPrices
        ? "text-[36px] text-[#f1b45b] sm:text-[42px] md:text-[52px] xl:text-[60px]"
        : "text-[36px] text-white sm:text-[42px] md:text-[52px] xl:text-[60px]"
      : "text-[32px] text-white sm:text-[38px] md:text-[43px] xl:text-[48px]"
  );

  const oldPriceClassName = cn(
    "mt-0.5 leading-none text-[#8d949b] line-through",
    isBest ? "text-[14px] md:text-[20px] xl:text-[24px]" : "text-[12px] md:text-[15px] xl:text-[17px]"
  );

  const descriptionClassName = cn(
    "text-left leading-[1.2] text-[#c6ccd1]",
    isBest
      ? "max-w-[126px] text-[11px] md:max-w-[165px] md:text-[15px] xl:max-w-[190px] xl:text-[16px]"
      : "max-w-[115px] text-[11px] md:mt-2 md:max-w-none md:text-[13px] xl:text-[14px]"
  );

  return (
    <button type="button" onClick={onSelect} className={containerClassName}>
      <div className="flex items-start justify-between gap-3">
        <p className="text-[14px] font-semibold leading-none text-[#d4d8dd] md:text-[16px] xl:text-[18px]">
          {tariff.period}
        </p>
        <div className="flex items-center gap-2">
          {showDiscountPrices && discountPercent > 0 && (
            <span className="rounded-md bg-[#f26666] px-1.5 py-0.5 text-[10px] font-bold leading-none text-white md:px-2 md:text-[12px]">
              -{discountPercent}%
            </span>
          )}
          {isBest && (
            <span className="text-[11px] font-semibold uppercase tracking-wide text-[#e8b05f] md:text-[13px]">
              хит!
            </span>
          )}
        </div>
      </div>

      <div
        className={cn(
          isBest
            ? "mt-2 flex items-end justify-between gap-2 md:gap-3"
            : "mt-2 flex items-end justify-between gap-2 md:mt-3 md:block"
        )}
      >
        <div className={discountExiting ? "animate-discount-out" : !showDiscountPrices ? "animate-price-in" : ""}>
          <p className={priceClassName}>{formatPrice(currentPrice)}</p>
          {previousPrice !== null ? (
            <p className={oldPriceClassName}>{formatPrice(previousPrice)}</p>
          ) : (
            <p className="mt-0.5 text-[10px] uppercase tracking-wide text-[#9aa2a9] md:text-[12px]">без скидки</p>
          )}
        </div>

        <p className={descriptionClassName}>{tariff.text}</p>
      </div>
    </button>
  );
}
