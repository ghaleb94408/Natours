const fs = require('fs');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const Tour = require('../../model/tourModel');

dotenv.config({ path: './config.env' });

async function connectDB() {
  await mongoose.connect(process.env.DATABASE_LOCAL);
  console.log('Connected to DB');
}
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8')
);
connectDB();
const deleteTours = async () => {
  console.log('deleting Tours...');
  await Tour.deleteMany();
  console.log('Tours Deleted.');
};
const addTours = async () => {
  console.log('Adding Tours...');
  await Tour.insertMany(tours);
  console.log('Tours Added.');
};
console.log(process.argv);
if (process.argv[2] === '--delete') deleteTours();
if (process.argv[2] === '--add') addTours();

// console.log(process.env);
