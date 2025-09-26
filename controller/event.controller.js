import Competition from "../model/competition.model.js";
import Event from "../model/events.model.js";
import { addEventService, addSingleMarketService, removeSingleMarketService, updateCompetitionGradeService, deleteCompetitionService, updateEventGradeService, deleteEventService, removeEventService, updateCompetitionMarketService, updateEventMarketService, rollbackEventService } from "../service/event.service.js";
import { eventValidation, addSingleMarketValiidation, removeSingleMarketValidation } from "../validation/events.validation.js";

export const addEventController = async (req, res) => {
  try {
    // const { error, value } = eventValidation.validate(req.body);
    // if (error) {
    //   return res.status(400).json({ success: false, message: error.details[0].message });
    // }
    const event = await addEventService(req.body);

    return res.status(201).json({
      success: true,
      message: "Event added successfully",
      data: event
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message
    });
  }
}

export const addSingleMarket = async (req,res) =>{
  try {
    const { error, value } = addSingleMarketValiidation.validate(req.body);
    if (error) {
      return res.status(400).json({ success: false, message: error.details[0].message });
    }

    const market = await addSingleMarketService(req.body);
    
    return res.status(201).json({
      success: true,
      message: "Market Added Successfully",
      data:market
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
}

//REMOVE THE SINGLE MARKET
export const removeSingleMarket = async (req, res) => {
  try {
    const { error } = removeSingleMarketValidation.validate(req.body);
    if (error) {
      return res.status(400).json({ success: false, message: error.details[0].message });
    }

    const result = await removeSingleMarketService(req.body);

    return res.status(200).json({
      success: true,
      message: "Market removed successfully",
      data: result
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

//Get Competition
export const getCompetitionList = async (req,res) => {
  try {
    const {sportId} = req.body;
    if (!sportId) {
      return res.status(400).json({
        success: false,
        message: "sportId is required"
      });
    }
    const competitionList = await Competition.aggregate([
      {$match: {sportId}},
      {
        $lookup:{
          from:"events",
          localField: "competitionId",
          foreignField: "competitionId",
          as: "events" 
        }
      }
    ]);

    res.status(200).json({success:true,message:"Competition list fetched successfully!",data:competitionList});
  } catch (error) {
    res.status(500).json({success:false,message: error.message || "Internal Server Error"})
  }
}

// UPDATE COMEPTIITON GARDE
export const updateComeptitionGrade = async (req,res) => {
  try {
    const updatedCompetition = await updateCompetitionGradeService(req.body);

    console.log(updateComeptitionGrade,"updateComeptitionGrade")
    return res.status(201).json({
      success: true,
      message: "Event added successfully",
      data: updatedCompetition
    });
  } catch (error) {
    res.status(500).json({success:false,message: error.message || "Internal Server Error"})
  }
};

// DELETE COMPETITION GRADE
export const deleteCompetition = async (req, res) => {
  try {
    const result = await deleteCompetitionService(req.body);

    return res.status(200).json({
      success: true,
      message: result.message
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// UPDATE EVENT GARDE
export const updateEventGrade = async (req,res) => {
  try {
    const updatedEvent = await updateEventGradeService(req.body);

    console.log(updatedEvent,"updatedEvent")
    return res.status(201).json({
      success: true,
      message: "Event added successfully",
      data: updatedEvent
    });
  } catch (error) {
    res.status(500).json({success:false,message: error.message || "Internal Server Error"})
  }
};

// DELETE EVENT
export const deleteEvent = async (req, res) => {
  try {
    const result = await deleteEventService(req.body);

    return res.status(200).json({
      success: true,
      message: result.message
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// REMOVE EVENT
export const removeEvent = async (req, res) => {
  try {
    const result = await removeEventService(req.body);

    return res.status(200).json({
      success: true,
      message: result.message
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const updateCompetitionMarket = async (req,res) => {
  try {
    const result = await updateCompetitionMarketService(req.body);

    return res.status(200).json({
      success: true,
      message: result.message
    });    
  } catch (error) {
    console.log(error,"error")
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
}

export const updateEventMarket = async (req,res) => {
  try {
    const result = await updateEventMarketService(req.body);

    return res.status(200).json({
      success: true,
      message: result.message
    });    
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getSavedEventBySportId = async (req,res) => {
  try {
    const { sportId } = req.body;
    let eventList = await Event.find({sportId});

    // Convert string -> Date and sort
    eventList = eventList.sort((a, b) => {
      console.log(new Date(a.openDate),"new Date(a.openDate) - new Date(b.openDate)",new Date(b.openDate))
      return new Date(a.openDate) - new Date(b.openDate);
    });

    return res.status(200).json({
      success: true,
      data: eventList
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

// ROLL BACK EVENT
export const rollBackEvent = async (req, res) => {
  try {
    const result = await rollbackEventService(req.body);

    return res.status(200).json({
      success: true,
      message: result.message
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const isCompetitionExist = async (req, res) => {
  try {
    const { competitionId } = req.body;
    console.log(competitionId,"competitionId")

    const exist = await Competition.findOne({ competitionId });
    console.log(exist,"exist")

    return res.status(200).json({
      success: true,
      message: exist ? "Competition exists" : "Competition not found",
      data: !!exist
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
