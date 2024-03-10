// Currency Converter Function
export const getExchangeData = async () => {
  try {
    const applicationHeaders = new Headers();
    applicationHeaders.append("apikey", process.env.apikey);
    const requestOptions = {
      method: "GET",
      headers: applicationHeaders,
      redirect: "follow",
    };

    const response = await fetch(
      "https://api.apilayer.com/exchangerates_data/latest?base=USD",
      requestOptions
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching currency data from API:", error.message);
    throw error;
  }
};

// Salary in Local Currency or USD

export const getSalary = (amountUSD, currency, currencyData) => {
  const amount =
    currency === "USD" ? amountUSD : amountUSD * currencyData.rates[currency];
  const currencyFormatter = Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
  });
  return currencyFormatter.format(amount);
};
