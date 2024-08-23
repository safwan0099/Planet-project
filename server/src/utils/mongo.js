const mongoose = require("mongoose");

const DB_URL = "mongodb+srv://safwanbinamir:0MlcaD5bwfTGLSha@cluster0.vdexw.mongodb.net/nasa?retryWrites=true&w=majority&appName=Cluster0"

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