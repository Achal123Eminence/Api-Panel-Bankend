import { createManualEventService } from "../service/manualEvent.service.js";
import { createManualEventValidation } from "../validation/manualEvent.validation.js";

export const createManualEvent = async (req, res) => {
  try {
    const { error, value } = createManualEventValidation.validate(req.body);
    
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }
    
    console.log(req.body,"req.body");
    const event = await createManualEventService(value);

    res.status(201).json({
      success: true,
      message: "Manual Event created successfully",
      data: event,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};