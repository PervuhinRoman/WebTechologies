function pluralizeRecords(n) {
  if (n < 0 || !Number.isInteger(n)) {
    throw new Error('n должно быть целым неотрицательным числом');
  }

  // Определяем форму слова "запись"
  let form;
  const lastDigit = n % 10;
  const lastTwoDigits = n % 100;

  if (lastDigit === 1 && lastTwoDigits !== 11) {
    form = 'запись';
  } else if (lastDigit >= 2 && lastDigit <= 4 && !(lastTwoDigits >= 12 && lastTwoDigits <= 14)) {
    form = 'записи';
  } else {
    form = 'записей';
  }

  return `В результате выполнения запроса было найдено ${n} ${form}`;
}