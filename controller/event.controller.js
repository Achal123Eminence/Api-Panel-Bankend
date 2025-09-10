import { addEventService, addSingleMarketService, removeSingleMarketService } from "../service/event.service.js";
import { eventValidation, addSingleMarketValiidation, removeSingleMarketValidation } from "../validation/events.validation.js";

export const addEventController = async (req, res) => {
  try {
    // const { error, value } = eventValidation.validate(req.body);
    // if (error) {
    //   return res.status(400).json({ success: false, message: error.details[0].message });
    // }
    const event = await addEventService(req.body);

    return res.status(201).json({
      success: true,
      message: "Event added successfully",
      data: event
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message
    });
  }
}

export const addSingleMarket = async (req,res) =>{
  try {
    const { error, value } = addSingleMarketValiidation.validate(req.body);
    if (error) {
      return res.status(400).json({ success: false, message: error.details[0].message });
    }

    const market = await addSingleMarketService(req.body);
    
    return res.status(201).json({
      success: true,
      message: "Market Added Successfully",
      data:market
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
}

//REMOVE THE SINGLE MARKET
// controller
export const removeSingleMarket = async (req, res) => {
  try {
    const { error } = removeSingleMarketValidation.validate(req.body);
    if (error) {
      return res.status(400).json({ success: false, message: error.details[0].message });
    }

    const result = await removeSingleMarketService(req.body);

    return res.status(200).json({
      success: true,
      message: "Market removed successfully",
      data: result
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
