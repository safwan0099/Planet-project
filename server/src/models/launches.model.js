const launches = new Map();

let currentFlightNumber = 100;

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

launches.set(launch.flightNumber, launch);

function existLaunchById(launchId){
    return launches.has(launchId);
}

function getAllLaunches(){
    return Array.from(launches.values());
}

function addNewLaunches(launch) {
    currentFlightNumber++;
    launches.set(currentFlightNumber, Object.assign(launch, {
        flightNumber : currentFlightNumber,
        upcoming: true,
        success: true,
        customer: ["Caesar group inc", "NASA"]
    }))
}

function abortLaunchById(launchId){
    const aborted = launches.get(launchId);
    aborted.upcoming = false;
    aborted.success = false;
    return aborted;
}

module.exports = {
    existLaunchById,
    getAllLaunches,
    addNewLaunches,
    abortLaunchById,
};