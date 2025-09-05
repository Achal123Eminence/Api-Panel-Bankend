import { createManualCompetitionService, getNextCompetitionIdService } from "../service/manualCompetition.service.js";
import { createManualCompetitionValidation } from "../validation/manualCompetition.validation.js";

export const createManualCompetition = async (req, res) => {
  try {
    const { error, value } = createManualCompetitionValidation.validate(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const competition = await createManualCompetitionService(value);

    res.status(201).json({
      success: true,
      message: "Manual Competition created successfully",
      data: competition,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// API to get the next available competitionId
export const getNextCompetitionId = async (req, res) => {
  try {
    const nextId = await getNextCompetitionIdService();
    res.status(200).json({ success: true, nextId });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};