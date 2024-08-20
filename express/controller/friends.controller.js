const friends = require("../model/friends.model");

function postFriends(req, res) {
    if(!req.body.name){
        return res.status(400).json({
            error : "Missin name of the friend"
        })
    }
    const newFriend = {
        name: req.body.name,
        id: friends.length
    };
    friends.push(newFriend);
    res.json(friends);
};

function getFriends(req, res) {
    res.send(friends);
};

function getFriend(req, res) {
    const friendId = Number(req.params.friendId);
    const friend = friends[friendId];
    if(friend){
        res.status((200)).json(friend);
    } else{
        res.status(404).json({
            error : "Id not found",
            typo : `The shit you wrote is ${friendId}`
        });
    }
};

module.exports = {
    postFriends,
    getFriends,
    getFriend
}
