import ManualEvent from "../model/manualEvent.model.js";

export const createManualEventService = async (data) => {

  const { eventId } = data;

  const isEvent = await ManualEvent.findOne({eventId});
  
  if(isEvent) throw new Error("Event with same Id already Exist");

  const event = await ManualEvent.create(data);

  return event;
};