import client from '../database/redis.js';
import Event from '../model/events.model.js';

export async function addEventService(eventData) {
  try {
    // 1. Check if event already exists in MongoDB
    const existingEvent = await Event.findOne({ eventId: eventData.eventId });
    if (existingEvent) {
      throw new Error("Event Already Exist!")
    }
    // Insert event into MongoDB
    console.log(eventData,"eventData")
    const newEvent = await Event.create(eventData);

    // Update Redis lists
    // await updateIsAddedInRedis(newEvent);

    return newEvent;
  } catch (error) {
    throw new Error(error.message);
  }
}
