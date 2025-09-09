import Competition from "../model/competition.model.js";
import Event from "../model/events.model.js";
import { getLimitsForGrade, buildCompetitionMarkets, buildEventMarkets, generateRandom8Digit } from "./event.service.js";

export const createManualEventService = async (data) => {

  const { eventId, eventName, competitionId, competitionName, sportId, competitionGrade, openDate } = data;

  let formattedOpenDate = null;
  if (openDate) {
    const dateObj = new Date(openDate);
    formattedOpenDate = dateObj.toLocaleString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    }).replace(",", ""); // remove the comma
  }

  // 1. Ensure competition exists (or create one if not)
  let competition = await Competition.findOne({ competitionId });

  console.log(competition,"competition")

  if (!competition) {

    let compLimits = await getLimitsForGrade(competitionGrade, sportId);

    let compMarkets = await buildCompetitionMarkets([],compLimits,sportId);

    const competitionPayload = {
      sportId,
      competitionId,
      competitionName,
      competitionType: "manual",
      competitionGrade,
      markets: compMarkets,
    };

    competition = await Competition.create(competitionPayload);
  }

  const isEvent = await Event.findOne({eventId});  
  if(isEvent) throw new Error("Event with same Id already Exist");

  let eventMarkets = await buildEventMarkets([],competition.markets,sportId);
  let onlyMarketIdArray = eventMarkets.map(m => m.marketId);

  const runnersId = generateRandom8Digit();
  const fancyId = `${eventId}-${runnersId}`;
  const mType = "normal";

  const tossInfo = {
      eventId: eventId,
      eventName: eventName,
      runnersId,
      fancyId,
      mType,
      openDate: formattedOpenDate,
  };

  if(sportId === "4"){
    data.sportName = "Cricket"
  }else if(sportId === "1"){
    data.sportName = "Tennis"
  }else if(sportId === "2"){
    data.sportName = "Soccer"
  }

  data.deventId = eventId;
  data.markets = eventMarkets
  data.marketCount = eventMarkets.length
  data.marketIds = onlyMarketIdArray
  data.openDate = formattedOpenDate;

  const event = await Event.create(data);

  console.log(event,"event")
  return event;
};
