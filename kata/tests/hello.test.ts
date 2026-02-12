import { test, expect } from 'vitest';

test('hello world!', () => {

  const art = storePerson(
  {
    name: "Alice",
    gender: "Female",
    age: 32,
    hairColor: "brown",
    weight: 140,
    height: 165,
    eyeColor: "blue"
  });

  expect(art).toBe(`╔══════════════════════════════════════╗
║ NAME: Dolfh                          ║
║ GEN: F                                ║
║ AGE: XXXII                            ║
║ HAIR: #8B4513                         ║
║ WT: 10001100                          ║
║ HT: 12                                ║
║ EYE: BLU                              ║
╚══════════════════════════════════════╝
`);
  });

test('readPerson should decode correctly', () => {
  const art = `╔══════════════════════════════════════╗
║ NAME: Dolfh                          ║
║ GEN: F                                ║
║ AGE: XXXII                            ║
║ HAIR: #8B4513                         ║
║ WT: 10001100                          ║
║ HT: 12                                ║
║ EYE: BLU                              ║
╚══════════════════════════════════════╝
`;
  const person = readPerson(art);

  expect(person).toEqual({
    name: "Alice",
    gender: "Female",
    age: 32,
    hairColor: "brown",
    weight: 140,
    height: 12,
    eyeColor: "blu"
  })
});

test('convertNumberToRomanNumeral works for 63', () => {
  expect(convertNumberToRomanNumeral(63)).toEqual("LXIII");
});

export function storePerson(description: {
  name: string,
  gender: string,
  age: number,
  hairColor: string,
  weight: number,
  height: number,
  eyeColor: string}
): string {
  
  const artWidth = 40;
  let art = "";
  art = encodeNameWithCaesarCipher(art, artWidth, description.name);
  
  art = encodeGenderAsFirstLetter(art, description.gender, artWidth);
  
  art = encodeAgeAsRomanNumeral(art, description.age, artWidth);
  
  art = encodeHairColorAsHex(art, description.hairColor, artWidth);
  
  art = encodeWeightAsBinaryString(art, description.weight, artWidth);
  
  art = encodeHeightAsLossySumDigits(art, description.height, artWidth);
  
  art = encodeEyeColorAsFirst3UpperCaseLetters(art, description.eyeColor, artWidth);
  
  return art;
}

function encodeEyeColorAsFirst3UpperCaseLetters(art: string, eyeColor: string, artWidth: number) {
  art += "║ EYE: " + eyeColor.substring(0, 3).toUpperCase();
  art += " ".repeat(artWidth - 10) + "║\n";
  art += "╚" + "═".repeat(artWidth - 2) + "╝\n";
  return art;
}

function encodeHeightAsLossySumDigits(art: string, height: number, artWidth: number) {
  art += "║ HT: ";
  let heightSum = 0;
  const heightStr = height.toString();
  for (let i = 0; i < heightStr.length; i++) {
    heightSum += parseInt(heightStr.charAt(i));
  }
  art += heightSum.toString();
  art += " ".repeat(artWidth - 6 - heightSum.toString().length) + "║\n";
  return art;
}

function encodeWeightAsBinaryString(art: string, weight: number, artWidth: number) {
  art += "║ WT: ";
  const weightBinary = weight.toString(2);
  art += weightBinary;
  art += " ".repeat(artWidth - 6 - weightBinary.length) + "║\n";
  return art;
}

function encodeHairColorAsHex(art: string, hairColor: string, artWidth: number) {
  art += "║ HAIR: ";
  let hairHex = "";
  if (hairColor.toLowerCase() === "brown") hairHex = "#8B4513";
  else if (hairColor.toLowerCase() === "black") hairHex = "#000000";
  else if (hairColor.toLowerCase() === "blonde") hairHex = "#FFD700";
  else if (hairColor.toLowerCase() === "red") hairHex = "#FF0000";
  else if (hairColor.toLowerCase() === "grey" || hairColor.toLowerCase() === "gray") hairHex = "#808080";
  else hairHex = "#FFFFFF";
  art += hairHex;
  art += " ".repeat(artWidth - 15) + "║\n";
  return art;
}

function encodeAgeAsRomanNumeral(art: string, age: number, artWidth: number) {
  art += "║ AGE: ";
  let ageRoman = convertNumberToRomanNumeral(age);
  art += ageRoman;
  art += " ".repeat(artWidth - 7 - ageRoman.length) + "║\n";
  return art;
}

function convertNumberToRomanNumeral(age: number) {
  let ageRoman = "";
  let ageNum = age;
  const vals = [50, 40, 10, 9, 5, 4, 1];
  const syms = ["L", "XL", "X", "IX", "V", "IV", "I"];
  for (let i = 0; i < vals.length; i++) {
    while (ageNum >= vals[i]) {
      ageRoman += syms[i];
      ageNum -= vals[i];
    }
  }
  return ageRoman;
}

function encodeGenderAsFirstLetter(art: string, gender: string, artWidth: number) {
  art += "║ GEN: " + gender.charAt(0).toUpperCase();
  art += " ".repeat(artWidth - 8) + "║\n";
  return art;
}

function encodeNameWithCaesarCipher(art: string, artWidth: number, name: string) {
  art += "╔" + "═".repeat(artWidth - 2) + "╗\n";
  art += "║ NAME: ";
  for (let i = 0; i < name.length; i++) {
    art += String.fromCharCode(name.charCodeAt(i) + 3); // Caesar cipher shift by 3
  }
  art += " ".repeat(artWidth - 9 - name.length) + "║\n";
  return art;
}

export function readPerson(art: string) {
  
  const lines = art.split("\n");
  
  let name = decodeNameFromCaesarCipher(lines);
  
  let gender = decodeGenderFromFirstLetter(lines);
  
  let age = decodeAgeFromRomanNumerals(lines);
  
  let hairColor = decodeHairColorFromHex(lines);
 
  const weight = decodeWeightFromBinary(lines);
  
  const height = decodeLossyHeightFromSumOfDigits(lines); 
  
  const eyeColor = decodeEyeColorFromHex(lines);
  
  return {name, gender, age, hairColor, weight, height, eyeColor};
}
function decodeEyeColorFromHex(lines: string[]) {
  const eyeLine = lines[7];
  const eyeColor = eyeLine.substring(7, 10).toLowerCase();
  return eyeColor;
}

function decodeLossyHeightFromSumOfDigits(lines: string[]) {
  // This is LOSSY - Connascence of Value (we can't reconstruct original)
  const htLine = lines[6];
  const heightSum = parseInt(htLine.substring(6, htLine.indexOf(" ", 6)));
  const height = heightSum; // Can't reconstruct original! Just return sum
  return height;
}

function decodeWeightFromBinary(lines: string[]) {
  const wtLine = lines[5];
  const weightBinary = wtLine.substring(6, wtLine.indexOf(" ", 6));
  const weight = parseInt(weightBinary, 2);
  return weight;
}

function decodeHairColorFromHex(lines: string[]) {
  const hairLine = lines[4];
  const hairHex = hairLine.substring(8, 15);
  let hairColor = "";
  if (hairHex === "#8B4513") hairColor = "brown";
  else if (hairHex === "#000000") hairColor = "black";
  else if (hairHex === "#FFD700") hairColor = "blonde";
  else if (hairHex === "#FF0000") hairColor = "red";
  else if (hairHex === "#808080") hairColor = "grey";
  else hairColor = "unknown";
  return hairColor;
}

function decodeAgeFromRomanNumerals(lines: string[]) {
  const ageLine = lines[3];
  const ageRoman = ageLine.substring(7, ageLine.indexOf(" ", 7));
  let age = 0;
  const romanMap: any = {
    "L": 50, "XL": 40, "X": 10, "IX": 9,
    "V": 5, "IV": 4, "I": 1
  };
  let i = 0;
  while (i < ageRoman.length) {
    if (i + 1 < ageRoman.length && romanMap[ageRoman.substring(i, i + 2)]) {
      age += romanMap[ageRoman.substring(i, i + 2)];
      i += 2;
    } else {
      age += romanMap[ageRoman.charAt(i)];
      i += 1;
    }
  }
  return age;
}

function decodeGenderFromFirstLetter(lines: string[]) {
  const genderLine = lines[2];
  const genderChar = genderLine.charAt(7);
  let gender = "";
  if (genderChar === "M") gender = "Male";
  else if (genderChar === "F") gender = "Female";
  else gender = "Other";
  return gender;
}

function decodeNameFromCaesarCipher(lines: string[]) {
  const nameLine = lines[1];
  const nameEncoded = nameLine.substring(8, nameLine.indexOf(" ", 8));
  let name = "";
  for (let i = 0; i < nameEncoded.length; i++) {
    name += String.fromCharCode(nameEncoded.charCodeAt(i) - 3);
  }
  return name;
}

