const mongoose = require("mongoose");

require("dotenv").config();

const DB_URL = process.env.MONGO_URL;

mongoose.connection.once("open", () => {
    console.log("MongoBD connection is ready")
});

mongoose.connection.on("error", (err) => {
    console.error(err)
});

async function mongoConnect(){
    await mongoose.connect(DB_URL);
}

async function mongoDisConnect(){
    await mongoose.disconnect();
}


module.exports = {
    mongoConnect,
    mongoDisConnect,
};