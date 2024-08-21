const {existLaunchById,
    getAllLaunches,
    addNewLaunches,
    abortLaunchById,
} = require("../models/launches.model");

function httpGetAllLaunches(req, res) {
    return res.status(200).json(getAllLaunches());
};

function httpAddNewLaunches(req, res){
    const launch = req.body;
    if (!launch.launchDate || !launch.mission || !launch.rocket || !launch.target){
        return res.status(400).json({
            error : "Missing required values"
        })
    }

    launch.launchDate = new Date(launch.launchDate);
    if (isNaN(launch.launchDate)){
        return res.status(400).json({
            error : "Invalid date value"
        })
    }

    addNewLaunches(launch);
    return res.status(201).json(launch);
}

function httpAbortLaunch(req, res){
    const launchId = +req.params.id;

    if (!existLaunchById(launchId)){
        return res.status(404).json({
            error : "Launch not found"
        })
    };

    const aborted = abortLaunchById(launchId);
    return res.status(200).json(aborted);
}

module.exports = {
    httpGetAllLaunches,
    httpAddNewLaunches,
    httpAbortLaunch
};