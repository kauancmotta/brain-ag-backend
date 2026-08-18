// Sanitiza: remove formatação (pontos, traços, barras)
function sanitize(value: string): string {
  return value.replace(/[.\-\/]/g, '').toUpperCase();
}

// CPF — apenas numérico, 11 dígitos
function isValidCPF(cpf: string): boolean {
  const clean = sanitize(cpf);

  if (!/^\d{11}$/.test(clean)) return false;
  if (/^(\d)\1{10}$/.test(clean)) return false; // sequências iguais (ex: 111.111.111-11)

  const calcDigit = (base: string, weights: number[]) => {
    const sum = base
      .split('')
      .reduce((acc, ch, i) => acc + Number(ch) * weights[i], 0);
    const remainder = sum % 11;
    return remainder < 2 ? 0 : 11 - remainder;
  };

  const digit1 = calcDigit(clean.slice(0, 9), [10, 9, 8, 7, 6, 5, 4, 3, 2]);
  const digit2 = calcDigit(clean.slice(0, 10), [11, 10, 9, 8, 7, 6, 5, 4, 3, 2]);

  return Number(clean[9]) === digit1 && Number(clean[10]) === digit2;
}

// CNPJ — suporta formato numérico clássico e alfanumérico (novo formato 2026)
// Algoritmo: Módulo 11 com valor ASCII - 48 por caractere
function isValidCNPJ(cnpj: string): boolean {
  const clean = sanitize(cnpj);

  // Formato: 12 chars alfanuméricos [A-Z0-9] + 2 dígitos verificadores numéricos
  if (!/^[A-Z0-9]{12}\d{2}$/.test(clean)) return false;
  if (/^(.)\1{13}$/.test(clean)) return false; // todos iguais (ex: 00000000000000)

  const charValue = (ch: string): number => ch.charCodeAt(0) - 48;

  const calcDigit = (base: string, weights: number[]): number => {
    const sum = base
      .split('')
      .reduce((acc, ch, i) => acc + charValue(ch) * weights[i], 0);
    const remainder = sum % 11;
    return remainder < 2 ? 0 : 11 - remainder;
  };

  const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

  const digit1 = calcDigit(clean.slice(0, 12), weights1);
  const digit2 = calcDigit(clean.slice(0, 13), weights2);

  return Number(clean[12]) === digit1 && Number(clean[13]) === digit2;
}

export function isValidDocument(value: string): boolean {
  const clean = sanitize(value);
  if (clean.length === 11) return isValidCPF(clean);
  if (clean.length === 14) return isValidCNPJ(clean);
  return false;
}