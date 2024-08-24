const {existLaunchById,
    getAllLaunches,
    addNewLaunches,
    abortLaunchById,
} = require("../models/launches.model");

function pagination(query){
    const page = Math.abs(query.page) || 1;
    const limit = Math.abs(query.limit) || 0;

    const skip = (page - 1) * limit;
    return {skip, limit};
}

async function httpGetAllLaunches(req, res) {
    const {skip, limit} = pagination(req.query);
    return res.status(200).json(await getAllLaunches(skip, limit));
};

async function httpAddNewLaunches(req, res){
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

    await addNewLaunches(launch);
    return res.status(201).json(launch);
}

async function httpAbortLaunch(req, res){
    const launchId = Number(req.params.id);

    if (!(await existLaunchById(launchId))){
        return res.status(404).json({
            error : "Launch not found"
        })
    };

    const aborted = await abortLaunchById(launchId);
    if(!aborted){
        return res.status(400).json({
            error : "Something unexpected happend"
        })
    }
    
    return res.status(200).json({
        ok : true
    });
}

module.exports = {
    httpGetAllLaunches,
    httpAddNewLaunches,
    httpAbortLaunch
};