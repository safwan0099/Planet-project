const { parse } = require('csv-parse');
const fs = require('fs');
const path = require("path");

const planets = require("./planets.mongoose");

const habitablePlanets = [];

function isHabitablePlanet(planet) {
  return planet['koi_disposition'] === 'CONFIRMED'
    && planet['koi_insol'] > 0.36 && planet['koi_insol'] < 1.11
    && planet['koi_prad'] < 1.6;
}

function loadPlanetsData(){
    return new Promise((resolve, reject) => {
        const filepath = path.resolve(__dirname,'../../data/kepler_data.csv');

        fs.createReadStream(filepath)
          .pipe(parse({
            comment: '#',
            columns: true,
          }))
          .on('data', async (data) => {
            if (isHabitablePlanet(data)) {
              savePlanet(data);
            }
          })
          .on('error', (err) => {
            console.log(err);
            reject(err);
          })
          .on('end', async () => {
            const planetLength = (await getAllPlanets()).length;
            console.log(`${planetLength} habitable planets found!`);  
            resolve();  
            });
        }
        );
    };


async function savePlanet(data){
  try{  
    await planets.updateOne({
      kepler_name : data.kepler_name
    }, {
      kepler_name: data.kepler_name,
    }, {
      upsert: true
    });
  }catch(err){
    console.error("Couldn't save all the planets")
  }
}

async function getAllPlanets(){
    return await planets.find({}, {"_id" : 0,  "__v" : 0});
} 

  module.exports = {
    loadPlanetsData,
    getAllPlanets
  }