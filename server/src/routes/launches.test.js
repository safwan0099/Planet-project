const request = require("supertest");
const app = require("../app");

describe("Test get /launch", () => {
    test("This test should return 200", async () => {
        const response = await request(app)
        .get("/launches")
        .expect("Content-Type", /json/)
        .expect(200)
    });
});

describe("Test post /launch", () => {
    const completeLaunchData = {
        mission : "Kepler exploration",
        rocket : "Explorer IS1",
        launchDate : new Date("October 23, 2030"),
        target : "kepler-442 b",
    }

    const launchDataWithoutDate = {
        mission : "Kepler exploration",
        rocket : "Explorer IS1",
        target : "kepler-442 b",
    }

    const invalidLaunchData = {
        mission : "Kepler exploration",
        rocket : "Explorer IS1",
        launchDate : "ulala",
        target : "kepler-442 b",
    }

    test("This test should return 201 created", async () => {
        const response = await request(app)
            .post("/launches")
            .send(completeLaunchData)
            .expect(201)
            .expect("Content-Type", /json/)

        const requestDate = new Date(completeLaunchData.launchDate).valueOf();
        const responseDate = new Date(response.body.launchDate).valueOf();

        expect(responseDate).toBe(requestDate);
        expect(response.body).toMatchObject(launchDataWithoutDate);
    });

    test("It should catch missig requirements", async ()=> {
        const response = await request(app)
            .post("/launches")
            .send(launchDataWithoutDate)
            .expect(400)
            .expect("Content-Type", /json/)
        
        expect(response.body).toStrictEqual({
            error : "Missing required values"
        })
    });

    test("It should catch invalid case", async ()=> {
        const response = await request(app)
            .post("/launches")
            .send(invalidLaunchData)
            .expect(400)
            .expect("Content-Type", /json/)
    
        expect(response.body).toStrictEqual({
            error : "Invalid date value"
        })    
    })
})