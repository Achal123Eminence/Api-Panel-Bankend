import Event from "../model/events.model.js";

export const getEventsBySportIdService = async (sportId) => {
  try {
    const events = await Event.find({ sportId }).sort({ openDate: 1 }); 
    return events;
  } catch (error) {
    throw new Error(error.message || "Error fetching events");
  }
};

export const getMarketsByEventIdService = async (eventId) => {
  try {
    const event = await Event.findOne({ eventId }).select("markets eventId eventName competitionName competitionId sportId");
    if (!event) {
      return null;
    }
    return event || [];
  } catch (error) {
    throw new Error(error.message || "Error fetching markets");
  }
};

export const updateMarketStatusService = async (eventId, marketId, status) => {
  try {
    // Find event and update specific market status
    const event = await Event.findOneAndUpdate(
      { eventId, "markets.marketId": marketId },
      { $set: { "markets.$.status": status } },
      { new: true }
    ).select("markets");

    return event;
  } catch (error) {
    throw new Error(error.message || "Error updating market status");
  }
};

export const updateEventPremiumAndMatchtypeService = async (eventId, premium, matchType) => {
  try {
    const updatedEvent = await Event.findOneAndUpdate(
      { eventId },
      { $set: { premium, matchType } },
      { new: true }
    );

    return updatedEvent;
  } catch (error) {
    throw new Error(error.message || "Error updating event");
  }
};

export const updateEventOpenDateService = async (eventId, openDate) => {
  try {
    const updatedEvent = await Event.findOneAndUpdate(
      { eventId },
      { $set: { openDate } },
      { new: true }
    );

    return updatedEvent;
  } catch (error) {
    throw new Error(error.message || "Error updating event");
  }
};


export const updateEventRunnersService = async (eventId, runners) => {
  const event = await Event.findOne({ eventId });

  if (!event) {
    return { success: false, status: 404, message: "Event not found" };
  }

  // Update
  event.matchRunners = runners;
  await event.save();

  return {
    success: true,
    status: 200,
    message: "Runners updated successfully",
    data: event,
  };
};
