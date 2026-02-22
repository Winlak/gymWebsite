export const formatPrice = (value: number) =>
  new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    maximumFractionDigits: 0
  }).format(value);

export const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const restSeconds = (seconds % 60).toString().padStart(2, "0");

  return `${minutes}:${restSeconds}`;
};

export const calcDiscountPercent = (discountPrice: number, fullPrice: number) => {
  if (fullPrice <= 0 || discountPrice >= fullPrice) {
    return 0;
  }

  return Math.round(((fullPrice - discountPrice) / fullPrice) * 100);
};
