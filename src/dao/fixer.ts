import axios from "axios";
import { CacheContainer } from "node-ts-cache";
import { MemoryStorage } from "node-ts-cache-storage-memory";

const API_KEY: string = "LhnahbOsjaq2lWOtWntUZZtWYT8uaxm8";
const ONE_HOUR_IN_SECONDS: number = 216000;

const cache: CacheContainer = new CacheContainer(new MemoryStorage());

const getRateFromFixer = async (base: string, symbol: string) => {
  if (base === symbol) {
    return "1";
  }

  let response: any = await getRateFromCacheIfPresent(base, symbol);
  if (!response) {
    await axios
      .get(
        `https://api.apilayer.com/fixer/latest?base=${base}&symbols=${symbol}`,
        {
          headers: {
            apikey: API_KEY,
          },
        }
      )
      .then(async (res) => {
        if (res.data.success) {
          response = String(res.data.rates[symbol]);
          const currencyPair: string = base + "-" + symbol;
          await cache.setItem(currencyPair, response, {
            ttl: ONE_HOUR_IN_SECONDS,
          });
        } else {
          response = res.data.error;
        }
      })
      .catch((error) => {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
          response = error.response.data;
        } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          console.log(error.request);
          response = error.request;
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log("Error", error.message);
          response = error.message;
        }
        console.log(error.config);
      });
  }
  return response;
};

const getRateFromCacheIfPresent = async (base: string, symbol: string) => {
  const currencyPair: string = base + "-" + symbol;
  const rate: any = await cache.getItem<string>(currencyPair);
  if (!rate) {
    const reverseCurrencyPair: string = symbol + "-" + base;
    const reverseRate: any = await cache.getItem<string>(reverseCurrencyPair);
    if (!reverseRate) {
      return null;
    }
    return (1 / reverseRate).toFixed(6);
  }
  return rate;
};

const refreshCache = async () => {
  await getRateFromFixer("USD", "SGD");
  await getRateFromFixer("USD", "HKD");
};

export { getRateFromFixer, refreshCache };
