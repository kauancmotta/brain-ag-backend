// CPF: 11 dígitos numéricos
// CNPJ: 12 chars alfanuméricos [A-Z0-9] + 2 dígitos numéricos
const CPF_REGEX = /^\d{11}$/;
const CNPJ_REGEX = /^[A-Z0-9]{12}\d{2}$/;

function charValue(ch: string): number {
  return ch.charCodeAt(0) - 48;
}

function isValidCPF(value: string): boolean {
  if (!CPF_REGEX.test(value)) return false;
  if (/^(\d)\1{10}$/.test(value)) return false;

  const calcDigit = (base: string, weights: number[]): number => {
    const sum = base
      .split('')
      .reduce((acc, ch, i) => acc + Number(ch) * weights[i], 0);
    const remainder = sum % 11;
    return remainder < 2 ? 0 : 11 - remainder;
  };

  const digit1 = calcDigit(value.slice(0, 9), [10, 9, 8, 7, 6, 5, 4, 3, 2]);
  const digit2 = calcDigit(
    value.slice(0, 10),
    [11, 10, 9, 8, 7, 6, 5, 4, 3, 2],
  );

  return Number(value[9]) === digit1 && Number(value[10]) === digit2;
}

function isValidCNPJ(value: string): boolean {
  if (!CNPJ_REGEX.test(value)) return false;
  if (/^(.)\1{13}$/.test(value)) return false;

  const calcDigit = (base: string, weights: number[]): number => {
    const sum = base
      .split('')
      .reduce((acc, ch, i) => acc + charValue(ch) * weights[i], 0);
    const remainder = sum % 11;
    return remainder < 2 ? 0 : 11 - remainder;
  };

  const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

  const digit1 = calcDigit(value.slice(0, 12), weights1);
  const digit2 = calcDigit(value.slice(0, 13), weights2);

  return Number(value[12]) === digit1 && Number(value[13]) === digit2;
}

export function isValidDocument(value: string): boolean {
  if (value.length === 11) return isValidCPF(value);
  if (value.length === 14) return isValidCNPJ(value);
  return false;
}
