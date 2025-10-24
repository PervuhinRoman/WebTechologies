function getSortedArray(array, key) {
  return array.slice().sort((a, b) => {
    const valueA = a[key];
    const valueB = b[key];

    // Если оба значения — числа
    if (typeof valueA === 'number' && typeof valueB === 'number') {
      return valueA - valueB;
    }

    // Иначе — приводим к строкам и сравниваем лексикографически
    return String(valueA).localeCompare(String(valueB));
  });
}