import express from "express";
import { createCurrency, bulkUpdateCurrencies, getAllNonBaseCurrencies, getBaseCurrency, deleteCurrency } from "../controller/currency.controller.js";
const currencyRouter = express.Router();

currencyRouter.post('/create', createCurrency);
currencyRouter.post('/update', bulkUpdateCurrencies);
currencyRouter.post('/get', getAllNonBaseCurrencies);
currencyRouter.post('/get-one', getBaseCurrency);
currencyRouter.delete('/remove/:id', deleteCurrency);

export default currencyRouter;