import axios from 'axios';
import { CacheContainer } from 'node-ts-cache';
import { MemoryStorage } from 'node-ts-cache-storage-memory';

const API_KEY: string = "LhnahbOsjaq2lWOtWntUZZtWYT8uaxm8";
const ONE_HOUR_IN_SECONDS: number = 216000;

const cache: CacheContainer = new CacheContainer(new MemoryStorage());

const getRateFromFixer = async (base: string, symbol: string) => {
  const currencyPair: string = base + '-' + symbol;
  let response: any = await cache.getItem<string>(currencyPair);
  if (!response) {
    await axios.get(`https://api.apilayer.com/fixer/latest?base=${base}&symbols=${symbol}`, {
      headers: {
        apikey: API_KEY
      }
    })
    .then(async (res) => {
      if (res.data.success) {
        response = String(res.data.rates[symbol]);
        await cache.setItem(currencyPair, response, {ttl: ONE_HOUR_IN_SECONDS});
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
        console.log('Error', error.message);
        response = error.message;
      }
      console.log(error.config);
    });
  }
  return response;
}

const refreshCache = async () => {
  await getRateFromFixer("USD", "SGD");
  await getRateFromFixer("SGD", "USD");
  await getRateFromFixer("USD", "HKD");
  await getRateFromFixer("HKD", "USD");
}

export { getRateFromFixer, refreshCache };