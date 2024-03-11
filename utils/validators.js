//Validator Functions

export const isStringInputValid = function (input) {
  return input ? true : false;
};

export const isEmailValid = function (input) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(input);
};

export const isBirthYearValid = function (input) {
  let numValue = Number(input);
  if (
    !Number.isInteger(numValue) ||
    numValue < 1900 ||
    numValue > new Date().getFullYear()
  ) {
    return false;
  }
  return true;
};

export const isBirthMonthValid = function (input) {
  let numValue = Number(input);
  if (!Number.isInteger(numValue) || numValue < 1 || numValue > 12) {
    return false;
  }
  return true;
};

export const isBirthDayValid = function (input) {
  let numValue = Number(input);
  if (!Number.isInteger(numValue) || numValue < 1 || numValue > 31) {
    return false;
  }
  return true;
};

export const isStartYearValid = function (input) {
  let numValue = Number(input);
  if (!Number.isInteger(numValue) || numValue < 1990 || numValue > 2024) {
    return false;
  }
  return true;
};

export const isStartMonthValid = function (input) {
  let numValue = Number(input);
  if (!Number.isInteger(numValue) || numValue < 1 || numValue > 12) {
    return false;
  }
  return true;
};

export const isStartDayValid = function (input) {
  let numValue = Number(input);
  if (!Number.isInteger(numValue) || numValue < 1 || numValue > 31) {
    return false;
  }
  return true;
};

export const isBooleanInputValid = function (input) {
  return input === "yes" || input === "no";
};

export const isSalaryInputValid = (input) => {
  let numValue = Number(input);
  if (
    !Number.isInteger(numValue) ||
    numValue < 12_000 ||
    numValue > 1_000_000
  ) {
    return false;
  }
  return true;
};

export const isCurrencyCodeValid = function (code, currencyData) {
  if (!currencyData || !currencyData.rates) {
    throw new Error("Invalid currency data.");
  }
  const currencyCodes = Object.keys(currencyData.rates);
  return currencyCodes.indexOf(code) > -1;
};
