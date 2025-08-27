import client from "../database/redis.js";

/**
* Fetch competition list from Redis for a given sportId
* @param {string} sportId
* @returns {Array} competitions 
*/

export async function getCompetitionListFromRedis(sportId) {
    try {
        console.log(sportId,"")
        const redisKey = `api:competitions:${sportId}`;
        console.log(redisKey,"redisKey")
        const data = await client.get(redisKey);
        console.log(data,"data")


        if (!data) {
            return []; // or throw new Error("No competitions found")
        }

        const competitions = JSON.parse(data);

        return (competitions);
    } catch (err) {
        console.error("Error fetching competitions from Redis:", err.message);
        throw new Error("Failed to fetch competitions from Redis");
    }
}

/**
 * Fetch event list from Redis for a given sportId and competitionId
 * @param {string} competitionId
 * @returns {Array} events
 */

export async function getEventListFromRedis(competitionId) {
  try {
    const redisKey = `api:events:${competitionId}`;
    const data = await client.get(redisKey);

    if (!data) {
      return []; // or throw new Error("No events found")
    }

    const events = JSON.parse(data);

    return events;
  } catch (err) {
    console.error("Error fetching events from Redis:", err.message);
    throw new Error("Failed to fetch events from Redis");
  }
}

/**
 * Fetch market list from Redis for a given sportId and eventId
 * @param {string} eventId
 * @returns {Array} markets
 */
export async function getMarketListFromRedis(eventId) {
    try {
        const redisKey = `api:markets:${eventId}`;
        const data = await client.get(redisKey);

        if (!data) {
            return []; // or throw new Error("No markets found")
        }

        return JSON.parse(data);
    } catch (err) {
        console.error("Error fetching markets from Redis:", err.message);
        throw new Error("Failed to fetch markets from Redis");
    }
}

/**
 * Fetch MarketBook data from Redis for a given sportId and marketId
 * @param {string} marketId
 * @returns {Object} marketBook
 */
export async function getMarketBookFromRedis(marketId) {
    try {
        const redisKey = `api:marketBook:${marketId}`;
        const data = await client.get(redisKey);

        if (!data) {
            return {}; // or throw new Error("No MarketBook found")
        }

        return JSON.parse(data);
    } catch (err) {
        console.error("Error fetching MarketBook from Redis:", err.message);
        throw new Error("Failed to fetch MarketBook from Redis");
    }
}