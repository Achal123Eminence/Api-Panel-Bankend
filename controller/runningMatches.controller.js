import { getEventsBySportIdService, getMarketsByEventIdService, updateMarketStatusService, updateEventPremiumAndMatchtypeService, updateEventOpenDateService, updateEventRunnersService } from "../service/runningMatches.service.js";
import { getEventListValidation, getMarketListValidation, updateEventMarketValidation, updateEventPremiumAndMatchtypeValidation, updateEventOpenDateValidation, updateEventRunnersValidation } from "../validation/runningMatches.validation.js";

export const getRunningEventController = async (req, res) => {
  try {
    // Validate body
    const { error } = getEventListValidation(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }

    const { sportId } = req.body;

    // Call service
    const events = await getEventsBySportIdService(sportId);

    return res.status(200).json({
      success: true,
      message: "Events fetched successfully",
      data: events
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message || "Internal Server Error"
    });
  }
};

export const getMarketListController = async (req, res) => {
  try {
    // Validate body
    const { error } = getMarketListValidation(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }

    const { eventId } = req.body;

    // Call service
    const markets = await getMarketsByEventIdService(eventId);

    if (!markets) {
      return res.status(404).json({
        success: false,
        message: "Event not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Markets fetched successfully",
      data: markets
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message || "Internal Server Error"
    });
  }
};


export const updateEventMarketController = async (req, res) => {
  try {
    // Validate input
    const { error } = updateEventMarketValidation(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }

    const { eventId, marketId, status } = req.body;

    // Call service
    const updatedEvent = await updateMarketStatusService(eventId, marketId, status);

    if (!updatedEvent) {
      return res.status(404).json({
        success: false,
        message: "Event or Market not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Market status updated successfully",
      data: updatedEvent.markets
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message || "Internal Server Error"
    });
  }
};

export const updateEventPremiumAndMatchtypeController = async (req, res) => {
  try {
    // Validate input
    const { error } = updateEventPremiumAndMatchtypeValidation(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const { eventId, premium, matchType } = req.body;

    // Update in DB
    const updatedEvent = await updateEventPremiumAndMatchtypeService(eventId, premium, matchType);

    if (!updatedEvent) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Event updated successfully",
      data: updatedEvent,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message || "Internal Server Error",
    });
  }
};

export const updateEventOpenDateController = async (req, res) => {
  try {
    // Validate input
    const { error } = updateEventOpenDateValidation(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const { eventId, openDate } = req.body;

    // Update in DB
    const updatedEvent = await updateEventOpenDateService(eventId, openDate);

    if (!updatedEvent) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Event updated successfully",
      data: updatedEvent,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message || "Internal Server Error",
    });
  }
};

export const updateEventRunnersController = async (req, res) => {
  try {
    console.log(req.body,"req.body")
    // Validate
    const { error, value } = updateEventRunnersValidation.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const { eventId, runners } = value;

    // Service call
    const result = await updateEventRunnersService(eventId, runners);

    return res.status(result.status).json(result);
  } catch (err) {
    console.error("Error in updateEventRunners:", err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
