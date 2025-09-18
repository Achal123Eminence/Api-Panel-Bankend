import Currency from "../model/currency.model.js";
import { createCurrencyValidation, bulkUpdateCurrencyValidation, updateBaseCurrencyValidation } from "../validation/currency.validation.js";

// Create Currency
export const createCurrency = async (req, res) => {
  try {
    const { error, value } = createCurrencyValidation.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }

    // check duplicate
    const exists = await Currency.findOne({ name: value.name });
    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Currency with this name already exists"
      });
    }

    const newCurrency = await Currency.create(value);

    return res.status(201).json({
      success: true,
      message: "Currency created successfully",
      data: newCurrency
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

// Update Currency
export const bulkUpdateCurrencies = async (req, res) => {
  try {
    const { error, value } = bulkUpdateCurrencyValidation.validate(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }

    const currencies = value.currencies; // array of currencies

    // Check duplicates in DB (by name but exclude its own id)
    for (let currency of currencies) {
      const duplicate = await Currency.findOne({
        name: currency.name,
        _id: { $ne: currency._id }
      });
      if (duplicate) {
        return res.status(400).json({
          success: false,
          message: `Currency with name '${currency.name}' already exists`
        });
      }
    }

    // Perform updates
    const updatePromises = currencies.map(c =>
      Currency.findByIdAndUpdate(c._id, c, { new: true, runValidators: true })
    );

    const updatedCurrencies = await Promise.all(updatePromises);

    return res.status(200).json({
      success: true,
      message: "Currencies updated successfully",
      data: updatedCurrencies
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

// Get all currencies
export const getAllNonBaseCurrencies = async (req, res) => {
  try {
    const currencies = await Currency.find({isBase:false});

    return res.status(200).json({
      success: true,
      message: "Currencies fetched successfully",
      data: currencies
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

export const getBaseCurrency = async (req, res) => {
  try {
    const currencies = await Currency.findOne({isBase:true});

    return res.status(200).json({
      success: true,
      message: "Currencies fetched successfully",
      data: currencies
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

export const deleteCurrency = async (req, res) => {
  try {
    const { id } = req.body;

    const deletedCurrency = await Currency.findByIdAndDelete(id);

    if (!deletedCurrency) {
      return res.status(404).json({
        success: false,
        message: "Currency not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Currency deleted successfully",
      data: deletedCurrency
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

// Update Base Currency Name by ID from req.body
export const updateBaseCurrency = async (req, res) => {
  try {
    const { error, value } = updateBaseCurrencyValidation.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }

    const { id } = req.body; // base currency ID

    // find the currency
    const currency = await Currency.findById(id);
    if (!currency) {
      return res.status(404).json({
        success: false,
        message: "Currency not found"
      });
    }

    // check if it's a base currency
    if (!currency.isBase) {
      return res.status(400).json({
        success: false,
        message: "Only base currency can be updated"
      });
    }

    // check duplicate name
    const exists = await Currency.findOne({ name: value.name });
    if (exists && exists._id.toString() !== currency._id.toString()) {
      return res.status(400).json({
        success: false,
        message: "Currency with this name already exists"
      });
    }

    currency.name = value.name;
    await currency.save();

    return res.status(200).json({
      success: true,
      message: "Base currency name updated successfully",
      data: currency
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message
    });
  }
};