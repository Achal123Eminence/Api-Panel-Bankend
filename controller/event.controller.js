import { addEventService } from "../service/event.service.js";
import { eventValidation } from "../validation/events.validation.js";

export const addEventController = async (req, res) => {
  try {
    const { error, value } = eventValidation.validate(req.body);
    if (error) {
      return res.status(400).json({ success: false, message: error.details[0].message });
    }

    const event = await addEventService(value);

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
