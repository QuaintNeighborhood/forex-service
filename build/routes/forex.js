"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const forex_1 = require("../controllers/forex");
const router = express_1.default.Router();
router.get('/forex', forex_1.getForex);
module.exports = router;
