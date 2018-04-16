const mongoClient = require("mongodb").MongoClient;
const assert = require("assert");
const fs = require("fs");
const path = require("path");
const url = "mongodb://localhost:27017";
const dbName = "test";
const util = require("util");

// mongoClient.connect(url,(err,client)=>{
//     assert.equal(null,err);
//     const db = client.db(dbName);
//     ReadDocuments(db,()=>{
//         client.close();
//     })
// });

function ReadDocuments(db, cb) {
  console.log("fetching");
  db
    .collection("restaurants")
    .find({
      location: {
        $nearSphere: {
          $geometry: {
            type: "Point",
            coordinates: [-73.93414657, 40.82302903]
          },
          $maxDistance: 5 * 1609.34
        }
      }
    })
    .limit(10)
    .toArray((err, documents) => {
      if (err) return console.log(err);
      console.log("num documents :", documents.length);
      documents.map(d => {
        console.log("------------\n", d);
      });
    });
  cb();
}

function getAreaPoints() {
  // mongoClient.connect(url,(err,client)=>{
  //     assert.equal(null,err);
  //     const db = client.db(dbName);
  //     db.collection('')
  // });
}

function setValuesFromFile(collectionName, filename) {
  mongoClient.connect(url, (err, client) => {
    if (err) console.log(err);
    const db = client.db(dbName);
    fs.readFile(
      // path.join(__dirname, "../public/js/", filename),
      filename,
      "utf8",
      (err, data) => {
        if (err) return console.log("couldnot read the file ------\n", err);
        console.log(data);
        let arr = JSON.parse(data).features;
        db.collection(collectionName).insertMany(arr, (err, res) => {
          if (err) console.log("error inserting documents :", err);
          return console.log(`Inserted ${res.insertedCount} documents`);
        });
        client.close();
      }
    );
  });
}

function getNearestPoints({ lat, lng },dist,cb) {
    console.log(lat,lng)
  mongoClient.connect(url, (err, client) => {
    if (err) return console.log("cannot connect to mongoclient :\n", err);
    let db = client.db(dbName);
    
    // let query = {
    //  $or:[
    //      {
    //        "location":{$exists:true},
    //         "location": {
    //             // $exists:true,
    //             $nearSphere: {
    //                 $geometry: { type: "Point", coordinates: [lng, lat] },
    //                 $maxDistance: dist
    //             },
    //             //$exists:true,                
               
    //         }
    //      }
    //      ,{
    //       "geometry":{$exists:true},
    //         "geometry": {
    //             // $exists:true,
    //             $nearSphere: {
    //               $geometry: { type: "Point", coordinates: [lng, lat] },
    //               $maxDistance: dist
    //             }
    //           }
    //      }
    //  ]
    // };
    let query =   {
        "location": {
            $nearSphere: {
                $geometry: { type: "Point", coordinates: [lng, lat] },
                $maxDistance: dist
            }
        }
     }

     let aggregateQuery = {
       "$geoNear":{
         "near":{
                $geometry: { type: "Point", coordinates: [lng, lat] },
                $maxDistance: dist
            },
            distanceField:"distance"
         
       }
     }
    // query = {};
    db
      // .collection("budapest_restaurants")
    .collection('restaurants')
      .find(query)
      // .aggregate(aggregateQuery)
      .toArray((err, results) => {
          if (err) return cb(err,null)
        // results.map(res => {
        //   console.log(
        //     `Place : ${res.properties.name}; geometry: ${util.inspect(
        //       res.geometry,
        //       { depth: Infinity }
        //     )}`
        //   );
        // });
        client.close();
        cb(null,results);
      });
  });
}

// setValuesFromFile('budapest_restaurants','/Users/Tvsiah-pc/Downloads/budapest.geojson');
module.exports = { getAreaPoints, setValuesFromFile,getNearestPoints };
