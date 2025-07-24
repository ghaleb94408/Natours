const fs = require("fs");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const Tour = require("../../model/tourModel");

const data = JSON.parse(
  fs.readFileSync(`${__dirname}/../data/tours-simple.json`, "utf-8")
);
dotenv.config({ path: `${__dirname}/../../config.env` });

const importTours = async () => {
  console.log("\nAdding New Tours.....");
  await Tour.insertMany(data);
  console.log("Added New Tours.....");
  process.exit();
};
const deleteTours = async () => {
  try {
    console.log("Deleting All Tours.....");
    await Tour.deleteMany({});
    console.log("Deleted All Tours");
    process.exit();
  } catch (err) {
    console.log(err);
  }
};
const connectDB = async () => {
  console.log("connecting");
  await mongoose.connect(process.env.DB_LINK, {
    dbName: "natours",
  });
  console.log("connected to DB successfully");
  if (process.argv[2] === "--delete") deleteTours();
  if (process.argv[2] === "--import") importTours();
};
connectDB();
