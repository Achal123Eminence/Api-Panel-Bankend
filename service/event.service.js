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
}

// helper to fetch filtered limits
async function getLimitsForGrade(gradeType, sportId) {
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
async function buildCompetitionMarkets(marketsFromEvent, limits) {
  const currencies = await Currency.find();

  return marketsFromEvent
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
        type: "betfair",
        status: true,
        limit: currencies.map(c => ({
          name: c.name,
          baseCurrency: c.isBase,
          preMinStake: (Number(matchingLimits.preMinStake) || 0) * c.value,
          preMaxStake: (Number(matchingLimits.preMaxStake) || 0) * c.value,
          preMaxPL: (Number(matchingLimits.preMaxPL) || 0) * c.value,
          minStake: (Number(matchingLimits.minStake) || 0) * c.value,
          maxStake: (Number(matchingLimits.maxStake) || 0) * c.value,
          maxPL: (Number(matchingLimits.maxPL) || 0) * c.value,
          delay: matchingLimits.delay ?? 0,
          oddsLimit: matchingLimits.oddsLimit ?? 0,   // ✅ FIXED
          b2CpreMinStake: (Number(matchingLimits.preMinStake) || 0) * c.value,
          b2CpreMaxStake: (Number(matchingLimits.preMaxStake) || 0) * c.value,
          b2CpreMaxPL: (Number(matchingLimits.preMaxPL) || 0) * c.value,
          b2CminStake: (Number(matchingLimits.minStake) || 0) * c.value,
          b2CmaxStake: (Number(matchingLimits.maxStake) || 0) * c.value,
          b2CmaxPL: (Number(matchingLimits.maxPL) || 0) * c.value,
          b2Cdelay: matchingLimits.delay ?? 0,
          b2CoddsLimit: matchingLimits.oddsLimit ?? 0
        }))
      };
    })
    .filter(Boolean); // remove nulls
}

export async function addEventService(eventData) {
  try {
    let competition = await Competition.findOne({ competitionId: eventData.competitionId });
    if (!competition) {
      let compLimits = await getLimitsForGrade(eventData.competitionGrade, eventData.sportId);

      let compMarkets = await buildCompetitionMarkets(eventData.markets, compLimits);

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

    let eventLimits = await getLimitsForGrade(eventData.eventGrade, eventData.sportId);

    let eventMarkets = await buildCompetitionMarkets(eventData.markets, eventLimits);

    let onlyMarketIdArray = eventMarkets.map(m => m.marketId); //logic to get only marketId pushed in a array from eventMarkets
    let unixDateCr = Math.floor(Date.now() / 1000);//get current time stamp in it
    let inningInfoCr = inningInfo[eventData.matchType] || null;// inningInfo filter it with eventData.matchType == inningInfo.eventData.matchType

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
      matchRunners: eventData.matchRunners || [],
      bmRunners: eventData.matchRunners || [],
      totalMatched: eventData.totalMatched || "",
      isAdded: eventData.isAdded
    };

    // add matchType + inningInfo only for sportId=4
    if (eventData.sportId === "4") {
      eventPayload.matchType = eventData.matchType;
      eventPayload.inningInfo = inningInfoCr;
    }

    const newEvent = await Event.create(eventPayload);
    return newEvent;

    return newEvent;
  } catch (error) {
    throw new Error(error.message);
  }
}
