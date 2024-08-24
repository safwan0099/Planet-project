const launchesDatabase = require("./launches.mongoose");
const planets = require("./planets.mongoose");
const axios = require("axios");

const DEFUALT_FLIGHT_NUMBER = 100;

const launch = {
    flightNumber : 100,
    mission : "Kepler exploration",
    rocket : "Explorer IS1",
    launchDate : new Date("October 23, 2030"),
    target : "kepler-442 b",
    customers : ["Caesar", "NASA"],
    upcoming : true,
    success : true
};

saveLaunch(launch);

const SPACEX_URL = "https://api.spacexdata.com/v4/launches/query";

async function getLaunchFromApi(){
    const response = await axios.post(SPACEX_URL, {    
        query : {},
        options : {
            pagination : false,
            populate : [{
                path : "rocket",
                select : {"name" : 1}
                },
                {
                path : "payloads",
                select : {"customers" : 1}
                }]
            }    
        }
    )

    if (response.status !== 200){
        console.log("There was a problem loading the launches from SPACEX API");
        throw new Error("Problem loading launches from sapceX api");
    }

    const launchDocs = response.data.docs;
    for (const launchDoc of launchDocs){
        const customers = launchDoc["payloads"].flatMap((payload) => {
            return payload["customers"];
        }); 
        const launch = {
            flightNumber: launchDoc["flight_number"],
            mission : launchDoc["name"],
            rocket : launchDoc["rocket"]["name"],
            launchDate : launchDoc["date_local"],
            upcoming: launchDoc["upcoming"],
            success : launchDoc["success"],
            customers: customers,
        }
        console.log(`${launch.flightNumber} ${launch.rocket} ${launch.customers}`)
        await saveLaunch(launch);
    }
}

async function loadLaunchData(){
    const firstSpaceXLaunch = await launchExist({
        flightNumber: 1,
        rocket: "Falcon 1",
        mission : "FalconSat"
    })
    
    if(firstSpaceXLaunch){
        console.log("We have already downloaded the launches!!")
    } else{
        await getLaunchFromApi();
    }
}

async function saveLaunch(launch) {
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

async function launchExist(filter){
    return await launchesDatabase.findOne(filter)
}

async function existLaunchById(launchId){
    return await launchExist({
        flightNumber: launchId
    });
}

async function getAllLaunches(skip, limit){
   return await launchesDatabase.find({}, {"_id" : 0, "__v" : 0})
   .sort({ flightNumber : 1})
   .skip(skip)
   .limit(limit)
}

async function addNewLaunches(launch) {
    const planet = planets.findOne({
        flightNumber: launch.flightNumber
    });

    if(!planet){
        throw new Error("Planet doesn't exist");
    }

    const currentFlightNumber = await getLatestFlightNumber() + 1;
    await saveLaunch(Object.assign(launch, {
        flightNumber : currentFlightNumber,
        upcoming: true,
        success: true,
        customers: ["Caesar group inc", "NASA"]
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
    loadLaunchData,
    existLaunchById,
    getAllLaunches,
    addNewLaunches,
    abortLaunchById,
};