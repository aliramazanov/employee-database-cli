// Currency Converter Function
export const getExchangeData = async () => {
  const maxRetries = 3;
  const baseDelay = 1000; // Milliseconds
  let currentDelay = baseDelay;
  let retries = 0;

  const result = await new Promise((resolve, reject) => {
    const attemptFetch = async () => {
      try {
        const applicationHeaders = new Headers();
        applicationHeaders.append('apikey', process.env.apikey);
        const requestOptions = {
          method: 'GET',
          headers: applicationHeaders,
          redirect: 'follow',
        };

        const response = await fetch(
          'https://api.apilayer.com/exchangerates_data/latest?base=USD',
          requestOptions,
        );

        if (!response.ok) {
          if (response.status === 429) {
            console.log(
              `Rate limited. Retrying in ${currentDelay} milliseconds...`,
            );
            setTimeout(() => {
              currentDelay *= 2;
              retries += 1;
              if (retries < maxRetries) {
                attemptFetch();
              } else {
                reject(new Error(`Maximum retries (${maxRetries}) exceeded.`));
              }
            }, currentDelay);
          } else {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
        }

        resolve(response.json());
      } catch (error) {
        console.error('Error fetching currency data from API:', error.message);
        reject(error);
      }
    };

    attemptFetch();
  });

  return result;
};

// Salary in Local Currency or USD

export const getSalary = (amountUSD, currency, currencyData) => {
  const amount = currency === 'USD' ? amountUSD : amountUSD * currencyData.rates[currency];
  const currencyFormatter = Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  });
  return currencyFormatter.format(amount);
};
