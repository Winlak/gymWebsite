"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/cn";
import CountdownHeader from "@/components/CountdownHeader";
import TariffCard from "@/components/TariffCard";
import { formatPrice } from "@/lib/format";
import type { Tariff } from "@/types/tariff";

const TIMER_SECONDS = 120;
const DISCOUNT_TRANSITION_MS = 500;

const UI_TEXT = {
  titlePrefix: "Выбери подходящий для себя",
  titleAccent: "тариф",
  emptyTariffs: "Сервис вернул пустой список тарифов.",
  loadingError: "Ошибка загрузки тарифов. Попробуйте обновить страницу.",
  retry: "Повторить",
  purchase: "Купить",
  discountEnded: "Акция завершена. Отображаются цены без скидки.",
  hint:
    "Следуя плану на 3 месяца и более, люди получают в 2 раза лучший результат, чем за 1 месяц",
  disclaimer:
    "Нажимая кнопку «Купить», Пользователь соглашается на разовое списание денежных средств для получения пожизненного доступа к приложению. Пользователь соглашается, что данные кредитной / дебетовой карты будут сохранены для осуществления покупки дополнительных услуг сервиса в случае желания пользователя.",
  guaranteeTitle: "гарантия возврата 30 дней",
  guaranteeText:
    "Мы уверены, что наш план сработает для тебя и ты увидишь видимые результаты уже через 4 недели! Мы даже готовы полностью вернуть твои деньги в течение 30 дней с момента покупки, если ты не получишь видимых результатов."
};

type IndexedTariff = {
  index: number;
  tariff: Tariff;
};

const sortTariffs = (items: Tariff[]) => [...items].sort((a, b) => Number(b.is_best) - Number(a.is_best));
const getInitialSelectedIndex = (items: Tariff[]) => {
  if (items.length === 0) {
    return null;
  }

  const bestIndex = items.findIndex((item) => item.is_best);
  return bestIndex >= 0 ? bestIndex : 0;
};

const getHighlightedTariffIndex = (items: Tariff[]) => {
  if (items.length === 0) {
    return -1;
  }

  const bestIndex = items.findIndex((item) => item.is_best);
  return bestIndex >= 0 ? bestIndex : 0;
};

export default function TariffsScreen() {
  const [tariffs, setTariffs] = useState<Tariff[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTariffIndex, setSelectedTariffIndex] = useState<number | null>(null);

  const [secondsLeft, setSecondsLeft] = useState(TIMER_SECONDS);
  const [discountExiting, setDiscountExiting] = useState(false);

  const [acceptTerms, setAcceptTerms] = useState(false);
  const [checkboxError, setCheckboxError] = useState(false);
  const [purchaseMessage, setPurchaseMessage] = useState<string | null>(null);

  const fetchTariffs = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/tariffs", { cache: "no-store" });
      if (!response.ok) {
        throw new Error("Не удалось загрузить данные.");
      }

      const payload: Tariff[] = await response.json();
      const sortedTariffs = sortTariffs(payload);
      setTariffs(sortedTariffs);
      setSelectedTariffIndex(getInitialSelectedIndex(sortedTariffs));
    } catch {
      setError(UI_TEXT.loadingError);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchTariffs();
  }, [fetchTariffs]);

  useEffect(() => {
    if (secondsLeft <= 0) {
      return;
    }

    const timeout = window.setTimeout(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [secondsLeft]);

  useEffect(() => {
    if (secondsLeft !== 0) {
      return;
    }

    setDiscountExiting(true);
    const timeout = window.setTimeout(() => {
      setDiscountExiting(false);
    }, DISCOUNT_TRANSITION_MS);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [secondsLeft]);

  const selectedTariff = useMemo(() => {
    if (selectedTariffIndex === null) {
      return null;
    }

    return tariffs[selectedTariffIndex] ?? null;
  }, [selectedTariffIndex, tariffs]);

  const highlightedTariffIndex = useMemo(() => getHighlightedTariffIndex(tariffs), [tariffs]);

  const highlightedTariff = highlightedTariffIndex >= 0 ? tariffs[highlightedTariffIndex] : null;
  const regularTariffs = useMemo(
    () =>
      tariffs
        .map((tariff, index): IndexedTariff => ({ tariff, index }))
        .filter((item) => item.index !== highlightedTariffIndex),
    [highlightedTariffIndex, tariffs]
  );

  const showDiscountPrices = secondsLeft > 0 || discountExiting;
  const timerIsAlert = secondsLeft > 0 && secondsLeft <= 30;

  const handleTermsChange = (checked: boolean) => {
    setAcceptTerms(checked);
    if (checked) {
      setCheckboxError(false);
    }
  };

  const handleBuy = () => {
    if (!acceptTerms) {
      setCheckboxError(true);
      setPurchaseMessage(null);
      return;
    }

    setCheckboxError(false);

    if (!selectedTariff) {
      setPurchaseMessage("Сначала выберите тариф.");
      return;
    }

    const finalPrice = showDiscountPrices ? selectedTariff.price : selectedTariff.full_price;
    setPurchaseMessage(
      `Выбран тариф «${selectedTariff.period}». Итоговая стоимость: ${formatPrice(finalPrice)}.`
    );
  };

  const checkboxClassName = cn(
    "mt-2 flex items-start gap-2 rounded-[10px] border px-2 py-1.5",
    checkboxError ? "border-[#f26666] bg-[#3d2f33]" : "border-transparent bg-transparent"
  );

  const buyButtonClassName = cn(
    "mt-2 h-[48px] w-full rounded-[16px] text-[22px] font-bold leading-none sm:text-[24px] md:max-w-[330px] md:text-[27px]",
    selectedTariff
      ? "animate-button-blink bg-[#f2b45d] text-[#2c2520]"
      : "cursor-not-allowed bg-[#8e8f92] text-[#2f3134]"
  );

  const renderTariffs = () => {
    if (isLoading) {
      return (
        <div className="space-y-2">
          <div className="h-[90px] animate-pulse rounded-[20px] border border-[#4a535c] bg-[#2f363d] md:h-[98px]" />
          <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
            <div className="h-[112px] animate-pulse rounded-[18px] border border-[#4a535c] bg-[#2f363d] md:h-[124px]" />
            <div className="h-[112px] animate-pulse rounded-[18px] border border-[#4a535c] bg-[#2f363d] md:h-[124px]" />
            <div className="h-[112px] animate-pulse rounded-[18px] border border-[#4a535c] bg-[#2f363d] md:h-[124px]" />
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="rounded-[16px] border border-[#7b3d3d] bg-[#3e2c2c] px-4 py-3">
          <p className="text-sm font-semibold text-[#f6c1c1]">{error}</p>
          <button
            type="button"
            className="mt-2 rounded-lg border border-[#f2b45d] px-3 py-1.5 text-sm font-semibold text-[#f2b45d]"
            onClick={() => void fetchTariffs()}
          >
            {UI_TEXT.retry}
          </button>
        </div>
      );
    }

    if (tariffs.length === 0) {
      return (
        <div className="rounded-[16px] border border-[#5b5f63] bg-[#2d343a] px-4 py-3">
          <p className="text-sm text-[#d9dde1]">{UI_TEXT.emptyTariffs}</p>
        </div>
      );
    }

    return (
      <>
        {highlightedTariff && (
          <TariffCard
            tariff={highlightedTariff}
            selected={selectedTariffIndex === highlightedTariffIndex}
            showDiscountPrices={showDiscountPrices}
            discountExiting={discountExiting && secondsLeft === 0}
            onSelect={() => setSelectedTariffIndex(highlightedTariffIndex)}
          />
        )}

        <div className="mt-2 grid grid-cols-1 gap-2 md:grid-cols-3">
          {regularTariffs.map(({ tariff, index }) => (
            <TariffCard
              key={`${tariff.id}-${index}`}
              tariff={tariff}
              selected={selectedTariffIndex === index}
              showDiscountPrices={showDiscountPrices}
              discountExiting={discountExiting && secondsLeft === 0}
              onSelect={() => setSelectedTariffIndex(index)}
            />
          ))}
        </div>
      </>
    );
  };

  return (
    <div className="min-h-screen bg-[#161b20] px-2 py-3 text-white md:px-4 md:py-5">
      <div className="mx-auto w-full max-w-[920px] overflow-hidden rounded-[26px] border border-[#323a42] bg-[#22282e] shadow-[0_18px_40px_rgba(0,0,0,0.45)] md:rounded-[34px] xl:max-w-[1180px] 2xl:max-w-[1360px]">
        <CountdownHeader secondsLeft={secondsLeft} isAlert={timerIsAlert} />

        <main className="px-3 pb-6 pt-4 md:px-8 md:pb-10 md:pt-6 xl:px-12">
          <h1 className="mx-auto max-w-[760px] text-center text-[32px] font-extrabold leading-[0.95] tracking-tight sm:text-[38px] md:text-[46px] xl:max-w-[980px] xl:text-[57px] 2xl:text-[62px]">
            {UI_TEXT.titlePrefix} <span className="text-[#f1b45b]">{UI_TEXT.titleAccent}</span>
          </h1>

          <section className="mt-3 grid grid-cols-1 gap-4 md:grid-cols-[220px,1fr] md:gap-6 xl:grid-cols-[300px,1fr] xl:gap-8 2xl:grid-cols-[360px,1fr]">
            <div className="flex justify-center md:items-start">
              <Image
                src="/coach.png"
                alt="Спортивный персонаж"
                width={380}
                height={760}
                priority
                className="h-auto w-[112px] sm:w-[126px] md:w-[205px] xl:w-[270px] 2xl:w-[320px]"
              />
            </div>

            <div>
              {renderTariffs()}

              <div className="mt-2 rounded-[12px] border border-[#3f474f] bg-[#2d343b] px-3 py-2">
                <div className="flex items-start gap-2">
                  <span className="text-[14px] font-bold text-[#f2b45d]">!</span>
                  <p className="text-[10px] leading-tight text-[#aab0b6] sm:text-[11px]">{UI_TEXT.hint}</p>
                </div>
              </div>

              <label className={checkboxClassName}>
                <input
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={(event) => handleTermsChange(event.target.checked)}
                  className="mt-[2px] h-4 w-4 shrink-0 accent-[#f2b45d]"
                />
                <span className="text-[10px] leading-tight text-[#9299a1] sm:text-[11px]">
                  Я согласен с <span className="underline">офертой рекуррентных платежей</span> и{" "}
                  <span className="underline">Политикой Конфиденциальности</span>
                </span>
              </label>

              <button type="button" onClick={handleBuy} disabled={!selectedTariff} className={buyButtonClassName}>
                {UI_TEXT.purchase}
              </button>

              {secondsLeft === 0 && (
                <p className="mt-2 text-[10px] font-semibold text-[#ff8585] sm:text-[11px]">
                  {UI_TEXT.discountEnded}
                </p>
              )}

              {purchaseMessage && (
                <p className="mt-2 text-[11px] font-semibold text-[#8fe0a4] sm:text-[12px]">{purchaseMessage}</p>
              )}

              <p className="mt-2 text-[8px] leading-tight text-[#69727b] sm:text-[8.5px]">{UI_TEXT.disclaimer}</p>
            </div>
          </section>

          <section className="mt-4 rounded-[24px] border border-[#363f46] bg-[#232a31] px-3 py-4 md:px-4 md:py-5">
            <div className="inline-flex rounded-full border border-[#4fa66b] px-3 py-1 text-[18px] font-semibold leading-none text-[#68c684] sm:text-[22px] md:px-4 md:text-[30px] xl:text-[40px]">
              {UI_TEXT.guaranteeTitle}
            </div>
            <p className="mt-3 text-[16px] leading-[1.18] text-[#c2c8ce] sm:text-[18px] md:text-[24px] xl:text-[34px]">
              {UI_TEXT.guaranteeText}
            </p>
          </section>
        </main>
      </div>
    </div>
  );
}
