// Validator Functions

export const isStringInputValid = (input) => !!input;

export const isEmailValid = (input) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(input);
};

export const isBirthYearValid = (input) => {
  const numValue = Number(input);
  if (
    !Number.isInteger(numValue)
    || numValue < 1900
    || numValue > new Date().getFullYear()
  ) {
    return false;
  }
  return true;
};

export const isBirthMonthValid = (input) => {
  const numValue = Number(input);
  if (!Number.isInteger(numValue) || numValue < 1 || numValue > 12) {
    return false;
  }
  return true;
};

export const isBirthDayValid = (input) => {
  const numValue = Number(input);
  if (!Number.isInteger(numValue) || numValue < 1 || numValue > 31) {
    return false;
  }
  return true;
};

export const isStartYearValid = (input) => {
  const numValue = Number(input);
  if (!Number.isInteger(numValue) || numValue < 1990 || numValue > 2024) {
    return false;
  }
  return true;
};

export const isStartMonthValid = (input) => {
  const numValue = Number(input);
  if (!Number.isInteger(numValue) || numValue < 1 || numValue > 12) {
    return false;
  }
  return true;
};

export const isStartDayValid = (input) => {
  const numValue = Number(input);
  if (!Number.isInteger(numValue) || numValue < 1 || numValue > 31) {
    return false;
  }
  return true;
};

export const isBooleanInputValid = (input) => input === 'yes' || input === 'no';

export const isSalaryInputValid = (input) => {
  const numValue = Number(input);
  if (!Number.isInteger(numValue) || numValue < 12000 || numValue > 1000000) {
    return false;
  }
  return true;
};

export const isCurrencyCodeValid = (code, currencyData) => {
  if (!currencyData || !currencyData.rates) {
    throw new Error('Invalid currency data.');
  }
  const currencyCodes = Object.keys(currencyData.rates);
  return currencyCodes.indexOf(code) > -1;
};
