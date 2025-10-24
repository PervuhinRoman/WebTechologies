function cesar(str, shift, action) {
  const alphabet = 'абвгдеёжзийклмнопрстуфхцчшщъыьэюя';
  const alphabetSize = alphabet.length; // 33

  shift = ((shift % alphabetSize) + alphabetSize) % alphabetSize;

  let result = '';

  for (let char of str) {
    const isUpperCase = char === char.toUpperCase();
    const lowerChar = char.toLowerCase();

    const index = alphabet.indexOf(lowerChar);

    if (index === -1) {
      // Символ не в алфавите — оставляем как есть
      result += char;
      continue;
    }

    let newIndex;
    if (action === 'encode') {
      newIndex = (index + shift) % alphabetSize;
    } else if (action === 'decode') {
      newIndex = (index - shift + alphabetSize) % alphabetSize;
    } else {
      throw new Error("действие только 'encode' или 'decode'");
    }

    let newChar = alphabet[newIndex];

    result += isUpperCase ? newChar.toUpperCase() : newChar;
  }

  return result;
}