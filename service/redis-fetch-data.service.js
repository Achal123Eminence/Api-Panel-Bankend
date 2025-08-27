import client from "../database/redis.js";
import { getCompetitionList, getEventList, getMarketList, getBookList, getAllEventList } from "./redis-sport.service.js";

export async function refreshSportData(){
    try {
        const sports = [
          { id: "4", name: "cricket" },
          { id: "2", name: "tennis" },
          { id: "1", name: "soccer" },
        ];

        for (const sport of sports) {
            console.log(`Fetching competitions for ${sport.name}:${sport.id}...`);

            // 1. Competitions
            const competitions = await getCompetitionList(sport.id);

            // We'll mutate this competitions array later to fix marketCount
            const updatedCompetitions = [];

            for (const comp of competitions) {
              console.log(
                `Fetching events for competition: ${comp.competitionName}`
              );

              // 2. Events
              let events = await getEventList(comp.competitionId);

              await client.set(
                `api:events:${comp.competitionId}`,
                JSON.stringify(events)
              );
              await client.set(
                `eventsCount:${comp.competitionId}`,
                events.length
              );

              let competitionMarketCount = 0;

              for (const event of events) {
                console.log(`Fetching markets for event: ${event.event_name}`);

                // 3. Markets
                const markets = await getMarketList(event.event_id);
                competitionMarketCount += markets.length; // track markets for valid events
                await client.set(
                  `api:markets:${event.event_id}`,
                  JSON.stringify(markets)
                );

                for (const market of markets) {
                  console.log(
                    `Fetching market book for marketId: ${market.marketId}`
                  );

                  // 4. Market Books
                  const marketBook = await getBookList(
                    market.marketId
                  );
                  await client.set(
                    `api:marketBook:${market.marketId}`,
                    JSON.stringify(marketBook)
                  );
                }
              }

              // Fix competition marketCount (only from valid events)
              updatedCompetitions.push({...comp,marketCount: competitionMarketCount});
            }

            // Save competitions with corrected marketCount
            await client.set(`api:competitions:${sport.id}`, JSON.stringify(updatedCompetitions));
        }

        console.log("Sports data refreshed successfully");
    } catch (error) {
        console.error("Error refreshing sports data:", error.message);
    }
}

export async function refreshAllEventList(){
    try {
        const sports = [
          { id: "4", name: "cricket" },
          { id: "2", name: "tennis" },
          { id: "1", name: "soccer" },
        ];

        for (const sport of sports) {
          const enrichedEvents = await getAllEventList(sport);

          // Save consolidated list in Redis
          await client.set(
            `api:eventList:${sport.id}`,
            JSON.stringify({
              sportId: sport.id,
              totalEvents: enrichedEvents.length,
              events: enrichedEvents,
            })
          );

          console.log(`Updated All Event List for ${sport.name} (${sport.id})`);
        }
    } catch (error) {
        console.error("Error in refreshEventLists:", err.message);
    }
}