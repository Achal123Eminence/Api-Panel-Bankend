import ManualCompetition from "../model/manualCompetition.model.js";

export const 
createManualCompetitionService = async (data) => {
  // find the last inserted competitionId
  const lastCompetition = await ManualCompetition.findOne()
    .sort({ competitionId: -1 })
    .lean();

  let nextId = 100000;
  if (lastCompetition) {
    nextId = lastCompetition.competitionId + 1;
  }

  const payload = {
    ...data,
    competitionId: nextId,
  };

  const competition = await ManualCompetition.create(payload);

  return competition;
};

// to fetch next available competitionId (for frontend form prefill)
export const getNextCompetitionIdService = async () => {
  const lastCompetition = await ManualCompetition.findOne()
    .sort({ competitionId: -1 })
    .lean();

  if (!lastCompetition) return 100000;
  return lastCompetition.competitionId + 1;
};
