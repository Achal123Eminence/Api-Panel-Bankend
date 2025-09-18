import client from "../database/redis.js";
import Event from "../model/events.model.js";
import { getCompetitionListFromRedis, getEventListFromRedis, getMarketListFromRedis, getMarketBookFromRedis } from "../service/local-redis.service.js";

export async function redisCompetitionList(req,res){
    try {
        const { sportId } = req.body; // get from URL param
        if (!sportId) {
            return res.status(400).json({ error: "sportId is required" });
        }

        const competitions = await getCompetitionListFromRedis(sportId);

        
        // Map competitions to include eventCount from Redis
        const competitionsWithEventCount = await Promise.all(
            competitions.map(async (comp) => {
                const countKey = `api:eventsCount:${comp.competitionId}`;
                const countStr = await client.get(countKey);
                const eventCount = countStr ? parseInt(countStr) : 0;
                return {
                    ...comp,
                    eventCount
                };
            })
        );

        return res.status(200).json({ sportId, competitions:competitionsWithEventCount });        
    } catch (error) {
        console.error("Redis Competition List Error:", err.message);
        return res.status(500).json({ error: err.message });
    }
}

export async function redisEventList(req, res) {
    try {
      const { competitionId } = req.body;

      if (!competitionId) {
        return res.status(400).json({ error: "competitionId are required" });
      }

      const events = await getEventListFromRedis(competitionId);

      // Ensure it's an array
      let sortedEvents = Array.isArray(events) ? [...events] : [];

      // Sort by openDate (latest first)
      sortedEvents.sort((a, b) => new Date(b.open_date) - new Date(a.open_date));

      return res.status(200).json({ competitionId, events: sortedEvents });
    } catch (err) {
        console.error("Redis Event List Error:", err.message);
        return res.status(500).json({ error: err.message });
    }
}

export async function redisMarketList(req, res) {
    try {
        const { eventId } = req.body;

        if (!eventId) {
            return res.status(400).json({ error: "eventId are required" });
        }

        const markets = await getMarketListFromRedis(eventId);
        return res.status(200).json({ eventId, markets });
    } catch (err) {
        console.error("Redis Market List Error:", err.message);
        return res.status(500).json({ error: err.message });
    }
}

export async function redisMarketBook(req, res) {
    try {
        const { marketId } = req.body;

        if (!marketId) {
            return res.status(400).json({ error: "marketId are required!" });
        }

        const marketBook = await getMarketBookFromRedis(marketId);
        return res.status(200).json({ marketId, marketBook });
    } catch (err) {
        console.error("Redis MarketBook Error:", err.message);
        return res.status(500).json({ error: err.message });
    }
}

export async function redisAllEventData(req, res) {
  try {
    const { sportId } = req.body;
    if (!sportId) {
      return res.status(400).json({ error: "sportId is required!" });
    }

    // 1. Fetch events from Redis
    const result = await client.get(`api:eventList:${sportId}`);
    if (!result) {
      return res.status(404).json({ error: "No event list found in Redis for this sportId" });
    }

    let redisData = JSON.parse(result);

    // Extract events array safely
    let redisEvents = Array.isArray(redisData.events) ? redisData.events : [];

    // 2. Get all added events from MongoDB for this sport
    const dbEvents = await Event.find({ sportId, isAdded: true }).select("eventId isAdded");

    // Convert DB events to a Map for quick lookup
    const dbEventMap = new Map(dbEvents.map(e => [e.eventId, e.isAdded]));

    // 3. Update Redis events list based on DB isAdded flag
    redisEvents = redisEvents.map(event => {
      if (dbEventMap.has(event.eventId)) {
        return { ...event, isAdded: true };
      }
      return { ...event, isAdded: false };
    });

    // 5. Sort by openDate (latest first)
    redisEvents.sort((a, b) => new Date(b.openDate) - new Date(a.openDate));

    // 6. Send response
     return res.status(200).json({
      ...redisData,
      events: redisEvents,
    });

  } catch (err) {
    console.error("Redis All Event Error:", err.message);
    return res.status(500).json({ error: err.message });
  }
}