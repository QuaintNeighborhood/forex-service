"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshCache = exports.getRateFromFixer = void 0;
const axios_1 = __importDefault(require("axios"));
const node_ts_cache_1 = require("node-ts-cache");
const node_ts_cache_storage_memory_1 = require("node-ts-cache-storage-memory");
const API_KEY = "ODJIcaz2L2BXNAn3yBALfoiEEH8uJcnz";
const ONE_HOUR_IN_SECONDS = 216000;
const cache = new node_ts_cache_1.CacheContainer(new node_ts_cache_storage_memory_1.MemoryStorage());
const getRateFromFixer = (base, symbol) => __awaiter(void 0, void 0, void 0, function* () {
    const currencyPair = base + '-' + symbol;
    let rate = yield cache.getItem(currencyPair);
    if (!rate) {
        const result = yield axios_1.default.get(`https://api.apilayer.com/fixer/latest?base=${base}&symbols=${symbol}`, {
            headers: {
                apikey: API_KEY
            }
        });
        rate = String(result.data.rates[symbol]);
        yield cache.setItem(currencyPair, rate, { ttl: ONE_HOUR_IN_SECONDS });
    }
    return rate;
});
exports.getRateFromFixer = getRateFromFixer;
const refreshCache = () => __awaiter(void 0, void 0, void 0, function* () {
    yield getRateFromFixer("USD", "SGD");
    yield getRateFromFixer("SGD", "USD");
    yield getRateFromFixer("USD", "HKD");
    yield getRateFromFixer("HKD", "USD");
});
exports.refreshCache = refreshCache;
