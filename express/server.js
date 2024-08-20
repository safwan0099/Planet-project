const express = require("express");
const path = require("path");

const friendRouter = require('./routes/friends.router');
const messageRouter = require('./routes/message.router');
const { title } = require("process");

const PORT = 99;

const app = express();

app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "template"));

app.use((req, res, next) => {
    const start = Date.now();
    next();
    const delta = Date.now() - start;
    console.log(`${req.method} ${req.url} ${delta}ms`)
})

app.use(express.json());

app.use('/site', express.static(path.join(__dirname, "public")));
app.get("/", (req, res) => {
    res.render("index", {
        title : "Caesar !!!",
        caption : "I dont know man"
    })
})
app.use('/friends', friendRouter);
app.use('/messages', messageRouter);

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})