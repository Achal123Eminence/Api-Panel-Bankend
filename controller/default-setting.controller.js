import client from "../database/redis.js";
import DefaultSettings from "../model/default-setting.model.js";

export const createDefault = async (req, res) => {
  try {
    // let result = await client.del('defaultSetting')
    let isDefaultSetting = await client.get("defaultSetting");
    if (isDefaultSetting) {
      return res
        .status(400)
        .json({ success: false, message: "Default settings already exist!!" });
    }

    let c = [
      {
        id: "1",
        marketName: "Match Odd",
        type: "full",
        sport: "4",
        status: true,
        gradeType: "A",
      },
      {
        id: "1",
        marketName: "Match Odd",
        type: "full",
        sport: "4",
        status: true,
        gradeType: "B",
      },
      {
        id: "1",
        marketName: "Match Odd",
        type: "full",
        sport: "4",
        status: true,
        gradeType: "C",
      },

      {
        id: "2",
        marketName: "Tied Match",
        type: "full",
        sport: "4",
        status: true,
        gradeType: "A",
      },
      {
        id: "2",
        marketName: "Tied Match",
        type: "full",
        sport: "4",
        status: true,
        gradeType: "B",
      },
      {
        id: "2",
        marketName: "Tied Match",
        type: "full",
        sport: "4",
        status: true,
        gradeType: "C",
      },

      {
        id: "3",
        marketName: "Completed Match",
        type: "full",
        sport: "4",
        status: true,
        gradeType: "A",
      },
      {
        id: "3",
        marketName: "Completed Match",
        type: "full",
        sport: "4",
        status: true,
        gradeType: "B",
      },
      {
        id: "3",
        marketName: "Completed Match",
        type: "full",
        sport: "4",
        status: true,
        gradeType: "C",
      },

      {
        id: "4",
        marketName: "To Win the Toss",
        type: "full",
        sport: "4",
        status: true,
        gradeType: "A",
      },
      {
        id: "4",
        marketName: "To Win the Toss",
        type: "full",
        sport: "4",
        status: true,
        gradeType: "B",
      },
      {
        id: "4",
        marketName: "To Win the Toss",
        type: "full",
        sport: "4",
        status: true,
        gradeType: "C",
      },

      {
        id: "5",
        marketName: "Winner",
        type: "full",
        sport: "4",
        status: true,
        gradeType: "A",
      },
      {
        id: "5",
        marketName: "Winner",
        type: "full",
        sport: "4",
        status: true,
        gradeType: "B",
      },
      {
        id: "5",
        marketName: "Winner",
        type: "full",
        sport: "4",
        status: true,
        gradeType: "C",
      },
    ];

    let t = [
      {
        id: "1",
        marketName: "Match Odd",
        type: "full",
        sport: "2",
        status: true,
        gradeType: "A",
      },
      {
        id: "1",
        marketName: "Match Odd",
        type: "full",
        sport: "2",
        status: true,
        gradeType: "B",
      },
      {
        id: "1",
        marketName: "Match Odd",
        type: "full",
        sport: "2",
        status: true,
        gradeType: "C",
      },

      {
        id: "2",
        marketName: "Set 1 Winner",
        type: "full",
        sport: "2",
        status: true,
        gradeType: "A",
      },
      {
        id: "2",
        marketName: "Set 1 Winner",
        type: "full",
        sport: "2",
        status: true,
        gradeType: "B",
      },
      {
        id: "2",
        marketName: "Set 1 Winner",
        type: "full",
        sport: "2",
        status: true,
        gradeType: "C",
      },

      {
        id: "3",
        marketName: "Set 2 Winner",
        type: "full",
        sport: "2",
        status: true,
        gradeType: "A",
      },
      {
        id: "3",
        marketName: "Set 2 Winner",
        type: "full",
        sport: "2",
        status: true,
        gradeType: "B",
      },
      {
        id: "3",
        marketName: "Set 2 Winner",
        type: "full",
        sport: "2",
        status: true,
        gradeType: "C",
      },

      {
        id: "4",
        marketName: "Winner",
        type: "full",
        sport: "2",
        status: true,
        gradeType: "A",
      },
      {
        id: "4",
        marketName: "Winner",
        type: "full",
        sport: "2",
        status: true,
        gradeType: "B",
      },
      {
        id: "4",
        marketName: "Winner",
        type: "full",
        sport: "2",
        status: true,
        gradeType: "C",
      },
    ];

    let s = [
      {
        id: "1",
        marketName: "Match Odd",
        type: "full",
        sport: "1",
        status: true,
        gradeType: "A",
      },
      {
        id: "1",
        marketName: "Match Odd",
        type: "full",
        sport: "1",
        status: true,
        gradeType: "B",
      },
      {
        id: "1",
        marketName: "Match Odd",
        type: "full",
        sport: "1",
        status: true,
        gradeType: "C",
      },

      {
        id: "2",
        marketName: "Over/Under",
        type: "full",
        sport: "1",
        status: true,
        gradeType: "A",
      },
      {
        id: "2",
        marketName: "Over/Under",
        type: "full",
        sport: "1",
        status: true,
        gradeType: "B",
      },
      {
        id: "2",
        marketName: "Over/Under",
        type: "full",
        sport: "1",
        status: true,
        gradeType: "C",
      },

      {
        id: "3",
        marketName: "Winner",
        type: "full",
        sport: "1",
        status: true,
        gradeType: "A",
      },
      {
        id: "3",
        marketName: "Winner",
        type: "full",
        sport: "1",
        status: true,
        gradeType: "B",
      },
      {
        id: "3",
        marketName: "Winner",
        type: "full",
        sport: "1",
        status: true,
        gradeType: "C",
      },
    ];

    let result = [...c, ...t, ...s];
    await client.set("defaultSetting", JSON.stringify(result));

    const mongoData = new DefaultSettings({
    //   name: "default-setting",
      data: JSON.stringify(result),
    });
    await mongoData.save();

    return res.status(201).json({ success: true, message: result });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
