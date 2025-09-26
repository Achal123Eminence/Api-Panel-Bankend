import ManualCompetition from "../model/manualCompetition.model.js";
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

// Get manual competition list
export const getManualComeptitionList = async (req,res) => {
  try {
    const manualCompetition = await ManualCompetition.find();

    manualCompetition.sort((a, b) => new Date(a.openDate) - new Date(b.openDate));
    
     res.status(201).json({
      success: true,
      message: "Manual Competition List fetched successfully",
      data: manualCompetition,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: err.message });
  }
}

// UPDATE COMPETITION STATUS
export const updateCompetitionStatus = async (req, res) => {
  try {
    const { id } = req.body;
    // Validate input
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Competition ID is required",
      });
    }

    const isCompetition = await ManualCompetition.findById(id);
    if(!isCompetition){
      return res.status(404).json({
        success: false,
        message: "Competition doesn't exist!!"
      });
    };

    isCompetition.status = false;
    await isCompetition.save();
    res.status(201).json({
      success: true,
      message: "Manual Competition updated successfully",
      data: isCompetition,
    }); 
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}