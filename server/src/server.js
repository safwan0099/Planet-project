const http = require("http");
const { mongoConnect } = require("./utils/mongo")

const app = require("./app");
const { loadPlanetsData } = require("../src/models/planets.model");

const PORT = process.env.PORT || 8000;

const server = http.createServer(app);

async function startServer(){
    await mongoConnect();

    await loadPlanetsData();
    server.listen(PORT, () => {
        console.log(`Listening on PORT... ${PORT}`)
    });
};

startServer();