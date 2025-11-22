require("dotenv").config();
const mongoose = require("mongoose");
const Item = require("./models/Item");

const items = [
  { name: "One Way Light Point", unit: "Nos" },
  { name: "Two Way Light Point", unit: "Nos" },
  { name: "One Way Fan Point", unit: "Nos" },
  { name: "Two Way Fan Point", unit: "Nos" },
  { name: "Exhaust Fan Point", unit: "Nos" },
  { name: "Invertor Power Points", unit: "Nos" },
  { name: "6 Amp Socket Point", unit: "Nos" },
  { name: "16 Amp Power Point", unit: "Nos" },
  { name: "16 Amp Power Point for AC / Geyser / washing machine", unit: "Nos" },
  { name: "Speaker Points", unit: "Nos" },
  { name: "Installation or Rewiring of Power DB", unit: "Nos" },
  { name: "Reinstallation of video door bell", unit: "Nos" },
  { name: "Door Bell Point", unit: "Nos" },
  { name: "Smoke detector reinstallation", unit: "Nos" },
  { name: "LED Panel Light / COB lights / cylinder light fitting", unit: "Nos" },
  { name: "Two watt / 3 watt concealed or surface light fitting", unit: "Nos" },
  { name: "Wall mounted decorative light fitting", unit: "Nos" },
  { name: "Installation of Hanging lights", unit: "Nos" },
  { name: "Tube fitting", unit: "Nos" },
  { name: "Fan Installation", unit: "Nos" },
  { name: "Fan fastener Installation", unit: "Nos" },
  { name: "Exhaust fan fitting", unit: "Nos" },
  { name: "LED Profile fitting concealed or surface", unit: "Nos" },
  { name: "LED strip laying (Indirect Light)", unit: "mtr" },
  { name: "Laying of 1.5sq mm X 2+1 x 1.5 sq mm sub main wire", unit: "mtr" },
  { name: "Laying of 2.5sq mm X 2+1 x 1.5 sq mm sub main wire", unit: "mtr" },
  { name: "Laying of 4.0sq mm X 2+1 sq mm sub main wire", unit: "mtr" },
  { name: "Laying of 2.5+1 x 2.5 sq mm wire", unit: "mtr" },
  { name: "Laying of RGB wire main line", unit: "mtr" },
  { name: "Laying of 2 pair Telephone wire", unit: "mtr" }
];

const start = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to DB...");

    await Item.deleteMany(); // optional: clear existing
    await Item.insertMany(items);

    console.log("Items inserted successfully!");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

start();
