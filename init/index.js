const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

main().then(() => {

    console.log("mongodb connected");
}).catch(err => {

    console.log(err);
})

async function main() {

    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}



const intitDB = async () =>{

    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({...obj,owner:"688f8ddf96921e069f00de37"}))
    await Listing.insertMany(initData.data);
}
intitDB();