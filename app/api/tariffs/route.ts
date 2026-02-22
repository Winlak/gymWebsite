import { NextResponse } from "next/server";
import type { Tariff } from "@/types/tariff";

const TARIFFS_ENDPOINT = "https://t-core.fit-hub.pro/Test/GetTariffs";

const toNumber = (value: unknown) => {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
};

const normalizeTariff = (value: unknown): Tariff | null => {
  if (!value || typeof value !== "object") {
    return null;
  }

  const candidate = value as Record<string, unknown>;
  const price = toNumber(candidate.price);
  const fullPrice = toNumber(candidate.full_price);

  if (
    typeof candidate.id !== "string" ||
    typeof candidate.period !== "string" ||
    typeof candidate.is_best !== "boolean" ||
    typeof candidate.text !== "string" ||
    price === null ||
    fullPrice === null
  ) {
    return null;
  }

  return {
    id: candidate.id,
    period: candidate.period,
    price,
    full_price: fullPrice,
    is_best: candidate.is_best,
    text: candidate.text
  };
};

export async function GET() {
  try {
    const response = await fetch(TARIFFS_ENDPOINT, {
      cache: "no-store"
    });

    if (!response.ok) {
      return NextResponse.json({ message: "Не удалось загрузить тарифы" }, { status: 502 });
    }

    const payload: unknown = await response.json();
    const tariffs = Array.isArray(payload)
      ? payload.map(normalizeTariff).filter((item): item is Tariff => item !== null)
      : [];

    return NextResponse.json(tariffs, { status: 200 });
  } catch {
    return NextResponse.json({ message: "Ошибка при обращении к сервису тарифов" }, { status: 500 });
  }
}
