export class RomanNumeral {
  public static encodeNumberAsRomanNumeral(input: number): string {
    let romanOutput = "";
    let processedInput = input;
    const vals = [50, 40, 10, 9, 5, 4, 1];
    const syms = ["L", "XL", "X", "IX", "V", "IV", "I"];
    for (let i = 0; i < vals.length; i++) {
      while (processedInput >= vals[i]) {
        romanOutput += syms[i];
        processedInput -= vals[i];
      }
    }
    return romanOutput;
  }
}
