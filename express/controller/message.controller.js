
function getMessages(req, res) {
    res.send("<ul><li>I'm a good boy</li></ul>");
};

function postMessages(req, res) {
    console.log("Just chilling ....");
};

module.exports = {
    getMessages,
    postMessages
}