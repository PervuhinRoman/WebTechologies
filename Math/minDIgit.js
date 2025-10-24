function minDigit(x) {
  if (x < 0 || !Number.isInteger(x)) {
    throw new Error('x должно быть целым неотрицательным числом');
  }

  if (x === 0) return 0;

  let min = 9;
  let num = x;

  while (num > 0) {
    let digit = num % 10;
    if (digit < min) min = digit;
    num = (num / 10) | 0; // побитовый сдвиг
  }

  return min;
}