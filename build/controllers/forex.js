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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getForexApollo = exports.getForex = void 0;
const fixer_1 = require("../dao/fixer");
const getForex = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const base = req.query.base;
    const symbol = req.query.symbol;
    const rate = yield (0, fixer_1.getRateFromFixer)(base, symbol);
    res.type('txt');
    return res.status(200).send(rate);
});
exports.getForex = getForex;
const getForexApollo = (obj, args) => __awaiter(void 0, void 0, void 0, function* () {
    const base = args.base;
    const symbol = args.symbol;
    const rate = yield (0, fixer_1.getRateFromFixer)(base, symbol);
    return rate;
});
exports.getForexApollo = getForexApollo;
