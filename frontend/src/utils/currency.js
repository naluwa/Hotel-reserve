export const formatLKR = (amount = 0) => {
  const value = Number(amount) || 0;
  return value
    .toLocaleString("en-LK", {
      style: "currency",
      currency: "LKR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
    .replace("LKR", "Rs.");
};
