const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
process.on("uncaughtException", (err) => {
  console.log(err.name, err.message);
});
const mongoose = require("mongoose");
const app = require("./app");

const connectDB = async () => {
  await mongoose.connect(process.env.DB_LINK, {
    dbName: "natours",
  });
  console.log("connected to DB successfully");
};
connectDB();
const port = process.env.PORT;

const server = app.listen(port, () => {
  console.log(`listening at port ${port}`);
});

process.on("unhandledRejection", (err) => {
  console.log(err.name, err.message);
  console.log("Unhandled rejection. Shutting down now ....");
  server.close(() => {
    process.exit(1);
  });
});
