function gcd(a, b) {
  if (a < 0 || b < 0 || !Number.isInteger(a) || !Number.isInteger(b)) {
    throw new Error('Аргументы должны быть неотрицательными целыми числами');
  }

  while (b !== 0) {
    let temp = b;
    b = a % b;
    a = temp;
  }

  return a;
}