const mongoose = require("mongoose");
const Listing = require("../models/listing.js");
const { sampleListings } = require("./data.js");

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/WanderLust");
  console.log("DB connected");

  await Listing.deleteMany({});

  const updatedListings = sampleListings.map((e) => ({
    ...e,
    owner: new mongoose.Types.ObjectId("69ee74a4abc9d91db3955c79")
  }));

  await Listing.insertMany(updatedListings);
  console.log("Data inserted");

  mongoose.connection.close();
}

main().catch(console.log);