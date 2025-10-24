function fibb(n) {
  if (n < 0 || !Number.isInteger(n) || n > 1000) {
    throw new Error('n должно быть целым неотрицательным числом <= 1000');
  }

  if (n === 0) return 0n;
  if (n === 1) return 1n;

  let a = 0n;
  let b = 1n;

  for (let i = 2; i <= n; i++) {
    [a, b] = [b, a + b];
  }

  return b;
}