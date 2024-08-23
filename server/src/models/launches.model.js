const launchesDatabase = require("./launches.mongoose");
const planets = require("./planets.mongoose");
const launches = new Map();

const DEFUALT_FLIGHT_NUMBER = 100;

const launch = {
    flightNumber : 100,
    mission : "Kepler exploration",
    rocket : "Explorer IS1",
    launchDate : new Date("October 23, 2030"),
    target : "kepler-442 b",
    customer : ["Caesar", "NASA"],
    upcoming : true,
    success : true
};

saveLaunch(launch);
// launches.set(launch.flightNumber, launch);

async function saveLaunch(launch) {

    const planet = planets.findOne({
        flightNumber: launch.flightNumber
    });

    if(!planet){
        throw new Error("Planet doesn't exist");
    }

    return await launchesDatabase.findOneAndUpdate({
        flightNumber: launch.flightNumber
    },
    {
        $set : launch
    }, 
    {
        upsert: true
    })};

async function getLatestFlightNumber() {
    const latestFlightNumber = await launchesDatabase.findOne().sort("-flightNumber");

    if(!latestFlightNumber){
        return DEFUALT_FLIGHT_NUMBER;
    }
    return latestFlightNumber.flightNumber;
}

async function existLaunchById(launchId){
    return await launchesDatabase.findOne({
        flightNumber: launchId
    });
}

async function getAllLaunches(){
   return await launchesDatabase.find({}, {"_id" : 0, "__v" : 0})
}

async function addNewLaunches(launch) {
    const currentFlightNumber = await getLatestFlightNumber() + 1;
    await saveLaunch(Object.assign(launch, {
        flightNumber : currentFlightNumber,
        upcoming: true,
        success: true,
        customer: ["Caesar group inc", "NASA"]
    }));
}

async function abortLaunchById(launchId){
    const aborted = await launchesDatabase.updateOne({flightNumber: launchId},
        {
        upcoming : false,
        success : false,
    });

    return aborted.modifiedCount === 1;
}

module.exports = {
    existLaunchById,
    getAllLaunches,
    addNewLaunches,
    abortLaunchById,
};