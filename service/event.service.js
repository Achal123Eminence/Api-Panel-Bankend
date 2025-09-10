import client from '../database/redis.js';
import Competition from '../model/competition.model.js';
import Currency from '../model/currency.model.js';
import DefaultSettings from '../model/default-setting.model.js';
import Event from '../model/events.model.js';

const inningInfo = {
  "t10": {perInningOver:10,totalOver:15,maxInningNumber:2},
  "t15": {perInningOver:10,totalOver:15,maxInningNumber:2},
  "t20": {perInningOver:10,totalOver:15,maxInningNumber:2},
  "100balls": {perInningOver:10,totalOver:15,maxInningNumber:2},
  "oneDay": {perInningOver:10,totalOver:15,maxInningNumber:2},
  "test": {perInningOver:10,totalOver:15,maxInningNumber:2},
};

export function generateRandom8Digit() {
  return Math.floor(10000000 + Math.random() * 90000000); // always 8 digits
}

// helper to fetch filtered limits
export async function getLimitsForGrade(gradeType, sportId) {
  let cachedData = await client.get("defaultSetting");
  let settings = cachedData ? JSON.parse(cachedData) : null;

  if (!settings) {
    const dbRecord = await DefaultSettings.findOne();
    if (!dbRecord) throw new Error("No default settings found");
    settings = JSON.parse(dbRecord.data);
    await client.set("defaultSetting", JSON.stringify(settings));
  }

  // Filter only active + correct grade
  return settings.filter(
    s =>
      s.gradeType === gradeType &&
      s.status === true &&
      s.sport.toString() === sportId.toString()
  );
}

// attach limits into markets for competition
export async function buildEventMarkets(marketsFromEvent, limits, sportId) {
  const currencies = await Currency.find();
  // console.log(currencies,"currencies currencies")

  // Special market names we always want
  const alwaysInclude = ["bookmaker", "fancy", "premium fancy", "toss"];

   let eventMarkets = marketsFromEvent
    .filter(market =>
      limits.some(l => l.marketName?.toLowerCase() === market.marketName?.toLowerCase())
    )
    .map(market => {
      const matchingLimits = limits.find(
        l => l.marketName?.toLowerCase() === market.marketName?.toLowerCase()
      );
      if (!matchingLimits) return null;

      return {
        marketId: market.marketId,
        marketName: market.marketName,
        limit: currencies.map(c => {
          // 🔑 find the limit for this currency inside matchingLimits.limit
          const currencyLimit = matchingLimits.limit.find(l => l.name === c.name);

          return {
            name: c.name,
            baseCurrency: c.isBase,
            preMinStake: (Number(currencyLimit?.preMinStake) || 0),
            preMaxStake: (Number(currencyLimit?.preMaxStake) || 0),
            preMaxPL: (Number(currencyLimit?.preMaxPL) || 0),
            minStake: (Number(currencyLimit?.minStake) || 0),
            maxStake: (Number(currencyLimit?.maxStake) || 0),
            maxPL: (Number(currencyLimit?.maxPL) || 0),
            delay: Number(currencyLimit?.delay) || 0,
            oddsLimit: Number(currencyLimit?.oddsLimit) || 0,
            b2CpreMinStake: (Number(currencyLimit?.b2CpreMinStake) || 0),
            b2CpreMaxStake: (Number(currencyLimit?.b2CpreMaxStake) || 0),
            b2CpreMaxPL: (Number(currencyLimit?.b2CpreMaxPL) || 0),
            b2CminStake: (Number(currencyLimit?.b2CminStake) || 0),
            b2CmaxStake: (Number(currencyLimit?.b2CmaxStake) || 0),
            b2CmaxPL: (Number(currencyLimit?.b2CmaxPL) || 0),
            b2Cdelay: Number(currencyLimit?.b2Cdelay) || 0,
            b2CoddsLimit: Number(currencyLimit?.b2CoddsLimit) || 0
          };
        })
      };
    })
    .filter(Boolean); // remove nulls

  // 2. Add missing special markets if required
  if (["4", "1", "2"].includes(sportId)) {
    const existingNames = eventMarkets.map(m => m.marketName?.toLowerCase());
    
    
    for (const limit of limits) {
      if (alwaysInclude.includes(limit.marketName?.toLowerCase())) {
        if (!existingNames.includes(limit.marketName?.toLowerCase())) {
          eventMarkets.push({
            marketId: `${limit.marketId}`,
            marketName: limit.marketName,
            limit: currencies.map(c => {
              const currencyLimit = limit.limit.find(l => l.name === c.name);

              return {
                name: c.name,
                baseCurrency: c.isBase,
                preMinStake: (Number(currencyLimit?.preMinStake) || 0),
                preMaxStake: (Number(currencyLimit?.preMaxStake) || 0),
                preMaxPL: (Number(currencyLimit?.preMaxPL) || 0),
                minStake: (Number(currencyLimit?.minStake) || 0),
                maxStake: (Number(currencyLimit?.maxStake) || 0),
                maxPL: (Number(currencyLimit?.maxPL) || 0),
                delay: Number(currencyLimit?.delay) || 0,
                oddsLimit: Number(currencyLimit?.oddsLimit) || 0,
                b2CpreMinStake: (Number(currencyLimit?.b2CpreMinStake) || 0),
                b2CpreMaxStake: (Number(currencyLimit?.b2CpreMaxStake) || 0),
                b2CpreMaxPL: (Number(currencyLimit?.b2CpreMaxPL) || 0),
                b2CminStake: (Number(currencyLimit?.b2CminStake) || 0),
                b2CmaxStake: (Number(currencyLimit?.b2CmaxStake) || 0),
                b2CmaxPL: (Number(currencyLimit?.b2CmaxPL) || 0),
                b2Cdelay: Number(currencyLimit?.b2Cdelay) || 0,
                b2CoddsLimit: Number(currencyLimit?.b2CoddsLimit) || 0
              };
            })
          });
        }
      }
    }
  }

  return eventMarkets;
}

// buildEventMarketsWinner
async function buildEventMarketsWinner(eventData, limits, sportId) {
  const currencies = await Currency.find();

  return limits
    .filter(l => l.marketName?.toLowerCase() === "match odds") // only take Match Odds limit
    .map(limit => {
      // Special case: if event marketName == "Winner", replace it with Match Odds
      if (eventData.marketName?.toLowerCase() === "winner") {
        return {
          marketId: eventData.marketId, // use Winner's marketId from event
          marketName: "Match Odds",     // force marketName as "Match Odds"
          limit: currencies.map(c => ({
            name: c.name,
            baseCurrency: c.isBase,
            preMinStake: (Number(limit.preMinStake) || 0) * c.value,
            preMaxStake: (Number(limit.preMaxStake) || 0) * c.value,
            preMaxPL: (Number(limit.preMaxPL) || 0) * c.value,
            minStake: (Number(limit.minStake) || 0) * c.value,
            maxStake: (Number(limit.maxStake) || 0) * c.value,
            maxPL: (Number(limit.maxPL) || 0) * c.value,
            delay: limit.delay ?? 0,
            oddsLimit: limit.oddsLimit ?? 0,
            b2CpreMinStake: (Number(limit.preMinStake) || 0) * c.value,
            b2CpreMaxStake: (Number(limit.preMaxStake) || 0) * c.value,
            b2CpreMaxPL: (Number(limit.preMaxPL) || 0) * c.value,
            b2CminStake: (Number(limit.minStake) || 0) * c.value,
            b2CmaxStake: (Number(limit.maxStake) || 0) * c.value,
            b2CmaxPL: (Number(limit.maxPL) || 0) * c.value,
            b2Cdelay: limit.delay ?? 0,
            b2CoddsLimit: limit.oddsLimit ?? 0,
          })),
        };
      }

      return null;
    })
    .filter(Boolean); // remove nulls
}

// ==========OLD Version buildCompetitionMarkets
// export async function buildCompetitionMarkets(marketsFromEvent, limits, sportId) {
//   const currencies = await Currency.find();

//   return limits.map(limit => {
//     // Try to find this market in marketsFromEvent
//     const matchingMarket = marketsFromEvent.find(
//       m => m.marketName?.toLowerCase() === limit.marketName?.toLowerCase()
//     );

//     return {
//       // Prefer marketId from event, else fallback to limit
//       marketId: matchingMarket ? matchingMarket.marketId : limit.id,
//       marketName: matchingMarket ? matchingMarket.marketName : limit.marketName,
//       limit: currencies.map(c => ({
//         name: c.name,
//         baseCurrency: c.isBase,
//         preMinStake: (Number(limit.preMinStake) || 0) * c.value,
//         preMaxStake: (Number(limit.preMaxStake) || 0) * c.value,
//         preMaxPL: (Number(limit.preMaxPL) || 0) * c.value,
//         minStake: (Number(limit.minStake) || 0) * c.value,
//         maxStake: (Number(limit.maxStake) || 0) * c.value,
//         maxPL: (Number(limit.maxPL) || 0) * c.value,
//         delay: limit.delay ?? 0,
//         oddsLimit: limit.oddsLimit ?? 0,
//         b2CpreMinStake: (Number(limit.preMinStake) || 0) * c.value,
//         b2CpreMaxStake: (Number(limit.preMaxStake) || 0) * c.value,
//         b2CpreMaxPL: (Number(limit.preMaxPL) || 0) * c.value,
//         b2CminStake: (Number(limit.minStake) || 0) * c.value,
//         b2CmaxStake: (Number(limit.maxStake) || 0) * c.value,
//         b2CmaxPL: (Number(limit.maxPL) || 0) * c.value,
//         b2Cdelay: limit.delay ?? 0,
//         b2CoddsLimit: limit.oddsLimit ?? 0
//       }))
//     };
//   });
// }

// NEW Version buildCompetitionMarkets
export async function buildCompetitionMarkets(marketsFromEvent, limits, sportId) {
  const currencies = await Currency.find();

  return limits.flatMap(limit => {
    const limitName = limit.marketName?.toLowerCase();

    // --- Football special case (sportId = "1") ---
    if (sportId === "1" && limitName === "over/under") {
      // Find all Over/Under markets from the event
      const ouMarkets = marketsFromEvent.filter(
        m =>
          m.marketName?.toLowerCase().includes("over/under") &&
          (m.marketName.toLowerCase().includes("6.5") ||
           m.marketName.toLowerCase().includes("5.5") ||
           true) // allow any "Over/Under"
      );

      return ouMarkets.map(market => ({
        marketId: market.marketId,
        marketName: market.marketName,
        limit: currencies.map(c => ({
          name: c.name,
          baseCurrency: c.isBase,
          preMinStake: (Number(limit.preMinStake) || 0) * c.value,
          preMaxStake: (Number(limit.preMaxStake) || 0) * c.value,
          preMaxPL: (Number(limit.preMaxPL) || 0) * c.value,
          minStake: (Number(limit.minStake) || 0) * c.value,
          maxStake: (Number(limit.maxStake) || 0) * c.value,
          maxPL: (Number(limit.maxPL) || 0) * c.value,
          delay: limit.delay ?? 0,
          oddsLimit: limit.oddsLimit ?? 0,
          b2CpreMinStake: (Number(limit.preMinStake) || 0) * c.value,
          b2CpreMaxStake: (Number(limit.preMaxStake) || 0) * c.value,
          b2CpreMaxPL: (Number(limit.preMaxPL) || 0) * c.value,
          b2CminStake: (Number(limit.minStake) || 0) * c.value,
          b2CmaxStake: (Number(limit.maxStake) || 0) * c.value,
          b2CmaxPL: (Number(limit.maxPL) || 0) * c.value,
          b2Cdelay: limit.delay ?? 0,
          b2CoddsLimit: limit.oddsLimit ?? 0
        }))
      }));
    }

    // --- Tennis special case (sportId = "2") ---
    if (sportId === "2" && limitName === "set winner") {
      // Find all "Set X Winner" markets from the event
      const setMarkets = marketsFromEvent.filter(
        m =>
          m.marketName?.toLowerCase().includes("set winner")
      );

      return setMarkets.map(market => ({
        marketId: market.marketId,
        marketName: market.marketName,
        limit: currencies.map(c => ({
          name: c.name,
          baseCurrency: c.isBase,
          preMinStake: (Number(limit.preMinStake) || 0) * c.value,
          preMaxStake: (Number(limit.preMaxStake) || 0) * c.value,
          preMaxPL: (Number(limit.preMaxPL) || 0) * c.value,
          minStake: (Number(limit.minStake) || 0) * c.value,
          maxStake: (Number(limit.maxStake) || 0) * c.value,
          maxPL: (Number(limit.maxPL) || 0) * c.value,
          delay: limit.delay ?? 0,
          oddsLimit: limit.oddsLimit ?? 0,
          b2CpreMinStake: (Number(limit.preMinStake) || 0) * c.value,
          b2CpreMaxStake: (Number(limit.preMaxStake) || 0) * c.value,
          b2CpreMaxPL: (Number(limit.preMaxPL) || 0) * c.value,
          b2CminStake: (Number(limit.minStake) || 0) * c.value,
          b2CmaxStake: (Number(limit.maxStake) || 0) * c.value,
          b2CmaxPL: (Number(limit.maxPL) || 0) * c.value,
          b2Cdelay: limit.delay ?? 0,
          b2CoddsLimit: limit.oddsLimit ?? 0
        }))
      }));
    }

    // --- Default behavior ---
    const matchingMarket = marketsFromEvent.find(
      m => m.marketName?.toLowerCase() === limitName
    );

    return [{
      marketId: matchingMarket ? matchingMarket.marketId : limit.id,
      marketName: matchingMarket ? matchingMarket.marketName : limit.marketName,
      limit: currencies.map(c => ({
        name: c.name,
        baseCurrency: c.isBase,
        preMinStake: (Number(limit.preMinStake) || 0) * c.value,
        preMaxStake: (Number(limit.preMaxStake) || 0) * c.value,
        preMaxPL: (Number(limit.preMaxPL) || 0) * c.value,
        minStake: (Number(limit.minStake) || 0) * c.value,
        maxStake: (Number(limit.maxStake) || 0) * c.value,
        maxPL: (Number(limit.maxPL) || 0) * c.value,
        delay: limit.delay ?? 0,
        oddsLimit: limit.oddsLimit ?? 0,
        b2CpreMinStake: (Number(limit.preMinStake) || 0) * c.value,
        b2CpreMaxStake: (Number(limit.preMaxStake) || 0) * c.value,
        b2CpreMaxPL: (Number(limit.preMaxPL) || 0) * c.value,
        b2CminStake: (Number(limit.minStake) || 0) * c.value,
        b2CmaxStake: (Number(limit.maxStake) || 0) * c.value,
        b2CmaxPL: (Number(limit.maxPL) || 0) * c.value,
        b2Cdelay: limit.delay ?? 0,
        b2CoddsLimit: limit.oddsLimit ?? 0
      }))
    }];
  });
}


// buildCompetitionMarketsWinner
async function buildCompetitionMarketsWinner(eventData, limits, sportId) {
  const currencies = await Currency.find();

  return limits.map(limit => {
    // Special case: if event marketName == "Winner" and limit.marketName == "Match Odds"
    if (
      eventData.marketName?.toLowerCase() === "winner" &&
      limit.marketName?.toLowerCase() === "match odds"
    ) {
      return {
        marketId: eventData.marketId, // use Winner's marketId from event
        marketName: "Match Odds",     // force marketName as "Match Odds"
        limit: currencies.map(c => ({
          name: c.name,
          baseCurrency: c.isBase,
          preMinStake: (Number(limit.preMinStake) || 0) * c.value,
          preMaxStake: (Number(limit.preMaxStake) || 0) * c.value,
          preMaxPL: (Number(limit.preMaxPL) || 0) * c.value,
          minStake: (Number(limit.minStake) || 0) * c.value,
          maxStake: (Number(limit.maxStake) || 0) * c.value,
          maxPL: (Number(limit.maxPL) || 0) * c.value,
          delay: limit.delay ?? 0,
          oddsLimit: limit.oddsLimit ?? 0,
          b2CpreMinStake: (Number(limit.preMinStake) || 0) * c.value,
          b2CpreMaxStake: (Number(limit.preMaxStake) || 0) * c.value,
          b2CpreMaxPL: (Number(limit.preMaxPL) || 0) * c.value,
          b2CminStake: (Number(limit.minStake) || 0) * c.value,
          b2CmaxStake: (Number(limit.maxStake) || 0) * c.value,
          b2CmaxPL: (Number(limit.maxPL) || 0) * c.value,
          b2Cdelay: limit.delay ?? 0,
          b2CoddsLimit: limit.oddsLimit ?? 0,
        })),
      };
    }

    // Fallback to normal behavior
    const matchingMarket = eventData.markets.find(
      m => m.marketName?.toLowerCase() === limit.marketName?.toLowerCase()
    );

    return {
      marketId: matchingMarket ? matchingMarket.marketId : limit.id,
      marketName: matchingMarket ? matchingMarket.marketName : limit.marketName,
      limit: currencies.map(c => ({
        name: c.name,
        baseCurrency: c.isBase,
        preMinStake: (Number(limit.preMinStake) || 0) * c.value,
        preMaxStake: (Number(limit.preMaxStake) || 0) * c.value,
        preMaxPL: (Number(limit.preMaxPL) || 0) * c.value,
        minStake: (Number(limit.minStake) || 0) * c.value,
        maxStake: (Number(limit.maxStake) || 0) * c.value,
        maxPL: (Number(limit.maxPL) || 0) * c.value,
        delay: limit.delay ?? 0,
        oddsLimit: limit.oddsLimit ?? 0,
        b2CpreMinStake: (Number(limit.preMinStake) || 0) * c.value,
        b2CpreMaxStake: (Number(limit.preMaxStake) || 0) * c.value,
        b2CpreMaxPL: (Number(limit.preMaxPL) || 0) * c.value,
        b2CminStake: (Number(limit.minStake) || 0) * c.value,
        b2CmaxStake: (Number(limit.maxStake) || 0) * c.value,
        b2CmaxPL: (Number(limit.maxPL) || 0) * c.value,
        b2Cdelay: limit.delay ?? 0,
        b2CoddsLimit: limit.oddsLimit ?? 0,
      })),
    };
  });
}


export async function addEventService(eventData) {
  try {
    let competition = await Competition.findOne({ competitionId: eventData.competitionId });
    if (!competition) {
      let compLimits = await getLimitsForGrade(eventData.competitionGrade, eventData.sportId);

      let compMarkets;

      if (eventData.marketName?.toLowerCase() === "winner") {
        compMarkets = await buildCompetitionMarketsWinner(eventData,compLimits,eventData.sportId);
      } else {
        compMarkets = await buildCompetitionMarkets(eventData.markets,compLimits,eventData.sportId);
      }


      const competitionPayload = {
        competitionId: eventData.competitionId,
        competitionName: eventData.competitionName,
        sportId: eventData.sportId,
        competitionGrade: eventData.competitionGrade,
        competitionType: "betfair",
        markets: compMarkets,
      };

      if (eventData.sportId === "4") {
        competitionPayload.premium = eventData.premium;
      }

      competition = await Competition.create(competitionPayload);
    }

    // 2. Check if event already exists in MongoDB
    const existingEvent = await Event.findOne({ eventId: eventData.eventId });
    if (existingEvent) {
      throw new Error("Event Already Exist!");
    }

    // let eventLimits = await getLimitsForGrade(eventData.eventGrade, eventData.sportId);

    let eventMarkets;

    if (eventData.marketName?.toLowerCase() === "winner") {
        eventMarkets = await buildEventMarketsWinner(eventData,competition.markets,eventData.sportId);
      } else {
        eventMarkets = await buildEventMarkets(eventData.markets,competition.markets,eventData.sportId);
      }

    let onlyMarketIdArray = eventMarkets.map(m => m.marketId); //logic to get only marketId pushed in a array from eventMarkets
    let unixDateCr = Math.floor(Date.now() / 1000);//get current time stamp in it
    let inningInfoCr = inningInfo[eventData.matchType] || null;// inningInfo filter it with eventData.matchType == inningInfo.eventData.matchType

    //Toss Info data
    const runnersId = generateRandom8Digit();
    const fancyId = `${eventData.eventId}-${runnersId}.FY`;
    const [teamA, teamB] = (eventData.matchRunners || []).slice(0, 2);
    const mType = eventData.marketName?.toLowerCase() === "winner" ? "winner" : "normal";

    const tossInfo = {
      eventId: eventData.eventId,
      eventName: eventData.eventName,
      runnersId,
      fancyId,
      bType:teamA?.runnerName || "Team A",
      bTypeSelection:teamA?.selectionId || 0,
      mType:teamB?.runnerName || "Team B",
      mTypeSelection:teamB?.selectionId || 0,
      openDate: eventData.openDate,
    };

    const eventPayload = {
      eventId: eventData.eventId,
      deventId: eventData.eventId,
      eventName: eventData.eventName,
      competitionId: eventData.competitionId,
      competitionName: eventData.competitionName,
      sportId: eventData.sportId,
      sportName: eventData.sportName,
      markets: eventMarkets,
      marketCount: eventMarkets.length,
      openDate: eventData.openDate,
      marketIds: onlyMarketIdArray,
      marketName: eventData.marketName,
      marketId: eventData.marketId,
      eventGrade: eventData.eventGrade,
      unixDate: unixDateCr,
      mType:mType,
      matchRunners: eventData.matchRunners || [],
      bmRunners: eventData.matchRunners || [],
      totalMatched: eventData.totalMatched || "",
      isAdded: eventData.isAdded
    };

    // add matchType + inningInfo only for sportId=4
    if (eventData.sportId === "4") {
      eventPayload.matchType = eventData.matchType;
      eventPayload.tossInfo = tossInfo;
      eventPayload.inningInfo = inningInfoCr;
    }

    const newEvent = await Event.create(eventPayload);
    return newEvent;

    return newEvent;
  } catch (error) {
    throw new Error(error.message);
  }
}


//TOSS INFO UPDATE SCHEDULAR FUNCTION ( Close toss markets 2 hours before event start )
export async function closeTossMarketsBeforeStart() {
  try {
    console.log("Update tossInfo Schedular for close date started!! ⚡⚡⚡⚡⚡")
    const now = new Date();

    // Find all events that have tossInfo with status OPEN
    const events = await Event.find({
      "tossInfo.status": "OPEN",
      "tossInfo.openDate": { $exists: true, $ne: null }
    });

    for (const event of events) {
      const tossOpenDate = new Date(event.tossInfo.openDate);

      // Calculate cutoff time (2 hours before event start)
      const cutoffTime = new Date(tossOpenDate.getTime() - 2 * 60 * 60 * 1000);

      if (now >= cutoffTime) {
        // Update status to CLOSED
        event.tossInfo.status = "CLOSED";
        await event.save();

        console.log(
          `Toss market CLOSED for Event ${event.eventId} (${event.eventName}) at ${now.toISOString()}`
        );
      }
    }
  } catch (error) {
    console.error("Error in closeTossMarketsBeforeStart:", error.message);
  }
}

// ADD MARKET FOR THE EVENT FROM THE SEQUENTIAL LIST
export async function addSingleMarketService(marketData){
  try {
    const { eventId, marketId, marketName } = marketData;
    if(!eventId){
      throw new Error("EventId is required!!");
    }

    // 1. Find event
    const event = await Event.findOne({eventId});
    if(!event){
      throw new Error("Event not found");
    }

    // 2. Find competition
    const competition = await Competition.findOne({competitionId:event.competitionId});
    if (!competition) {
      throw new Error("Competition not found");
    }

    const currencies = await Currency.find();

    // 3. Find limit for this market in competition.markets
    const matchingLimit = competition.markets.find(
      m => m.marketName?.toLowerCase() === marketName?.toLowerCase()
    );

    if (!matchingLimit) {
      throw new Error(`Market not valid or Closed in Default Market: ${marketName}`);
    }

    // 4. Build the new market object (similar to buildEventMarkets)
    const newMarket = {
      marketId,
      marketName,
      limit: currencies.map(c => {
        const currencyLimit = matchingLimit.limit.find(l => l.name === c.name);

        return {
          name: c.name,
          baseCurrency: c.isBase,
          preMinStake: (Number(currencyLimit?.preMinStake) || 0),
          preMaxStake: (Number(currencyLimit?.preMaxStake) || 0),
          preMaxPL: (Number(currencyLimit?.preMaxPL) || 0),
          minStake: (Number(currencyLimit?.minStake) || 0),
          maxStake: (Number(currencyLimit?.maxStake) || 0),
          maxPL: (Number(currencyLimit?.maxPL) || 0),
          delay: Number(currencyLimit?.delay) || 0,
          oddsLimit: Number(currencyLimit?.oddsLimit) || 0,
          b2CpreMinStake: (Number(currencyLimit?.b2CpreMinStake) || 0),
          b2CpreMaxStake: (Number(currencyLimit?.b2CpreMaxStake) || 0),
          b2CpreMaxPL: (Number(currencyLimit?.b2CpreMaxPL) || 0),
          b2CminStake: (Number(currencyLimit?.b2CminStake) || 0),
          b2CmaxStake: (Number(currencyLimit?.b2CmaxStake) || 0),
          b2CmaxPL: (Number(currencyLimit?.b2CmaxPL) || 0),
          b2Cdelay: Number(currencyLimit?.b2Cdelay) || 0,
          b2CoddsLimit: Number(currencyLimit?.b2CoddsLimit) || 0
        };
      })
    };

    event.markets.push(newMarket);
    if (!event.marketIds.includes(marketId)) {
      event.marketIds.push(marketId);
    }

    await event.save();

    return newMarket;
  } catch (error) {
    throw new Error(error.message);
  }
}

//REMOVE THE SINGLE MARKET FROM THE SEQUENTIAL LIST
// service
export async function removeSingleMarketService({ eventId, marketId }) {
  try {
    if (!eventId) {
      throw new Error("EventId is required!!");
    }

    // 1. Find event
    const event = await Event.findOne({ eventId });
    if (!event) {
      throw new Error("Event not found");
    }

    // 2. Check if market exists
    const marketExists = event.markets.some(m => m.marketId === marketId);
    if (!marketExists) {
      throw new Error("Market not found in this event");
    }

    // 3. Remove market object from event.markets
    event.markets = event.markets.filter(m => m.marketId !== marketId);

    // 4. Remove marketId from event.marketIds
    event.marketIds = event.marketIds.filter(id => id !== marketId);

    await event.save();

    return { eventId, marketId };
  } catch (error) {
    throw new Error(error.message);
  }
}
