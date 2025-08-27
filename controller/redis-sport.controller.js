import client from "../database/redis.js";
import { getCompetitionListFromRedis, getEventListFromRedis, getMarketListFromRedis, getMarketBookFromRedis } from "../service/local-redis.service.js";

export async function redisCompetitionList(req,res){
    try {
        const { sportId } = req.params; // get from URL param
        if (!sportId) {
            return res.status(400).json({ error: "sportId is required" });
        }

        const competitions = await getCompetitionListFromRedis(sportId);
        console.log(competitions)

        
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
        const { competitionId } = req.params;

        if (!competitionId) {
            return res.status(400).json({ error: "competitionId are required" });
        }

        const events = await getEventListFromRedis(competitionId);
        return res.status(200).json({ competitionId, events });
    } catch (err) {
        console.error("Redis Event List Error:", err.message);
        return res.status(500).json({ error: err.message });
    }
}

export async function redisMarketList(req, res) {
    try {
        const { eventId } = req.params;

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
        const { marketId } = req.params;

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

export async function redisAllEventData(req,res){
    try {
        const { sportId } = req.params;
        if(!sportId){
            return res.status(400).json({error:"sportId is required!"});
        };

        const result = await client.get(`api:eventList:${sportId}`);
        if (!result) {
            return res.status(404).json({ error: "No event list found in Redis for this sportId" });
        }

        return res.status(200).json(JSON.parse(result));
    } catch (err) {
        console.error("Redis All Event Error:",err.message);
        return res.status(500).json({error: err.message});
    }
}