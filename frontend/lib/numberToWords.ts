const ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"];
const teens = ["Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

function threeDigits(n: number): string {
  let str = "";
  if (n >= 100) {
    str += ones[Math.floor(n / 100)] + " Hundred ";
    n %= 100;
  }
  if (n >= 20) {
    str += tens[Math.floor(n / 10)] + " ";
    n %= 10;
  } else if (n >= 10) {
    str += teens[n - 10] + " ";
    n = 0;
  }
  if (n > 0) str += ones[n] + " ";
  return str.trim();
}

export function numberToWords(num: number): string {
  num = Math.floor(num);
  if (num === 0) return "Zero";
  const units = ["", "Thousand", "Million", "Billion"];
  let result = "";
  let unitIndex = 0;
  while (num > 0) {
    const chunk = num % 1000;
    if (chunk > 0) {
      result = `${threeDigits(chunk)} ${units[unitIndex]} ${result}`.trim();
    }
    num = Math.floor(num / 1000);
    unitIndex++;
  }
  return result;
}