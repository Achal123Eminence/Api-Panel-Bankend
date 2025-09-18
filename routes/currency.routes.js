import express from "express";
import { createCurrency, bulkUpdateCurrencies, getAllNonBaseCurrencies, getBaseCurrency, deleteCurrency, updateBaseCurrency } from "../controller/currency.controller.js";
const currencyRouter = express.Router();

currencyRouter.post('/create', createCurrency);
currencyRouter.post('/update', bulkUpdateCurrencies);
currencyRouter.post('/get', getAllNonBaseCurrencies);
currencyRouter.post('/get-one', getBaseCurrency);
currencyRouter.post('/remove', deleteCurrency);
currencyRouter.post('/update-base', updateBaseCurrency);

export default currencyRouter;