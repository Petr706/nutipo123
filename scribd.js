(async () => {
    const fetch = require('node-fetch');
    const MongoClient = require("mongodb").MongoClient;

const response = await fetch('https://api.redgifs.com/v2/gifs/search?search_text=Anal&order=trending');
const data = await response.json();
const url = "mongodb://localhost:27017/";
const mongoClient = new MongoClient(url);
const db = mongoClient.db("usersdb");
const collection = db.collection("VideosData");

for (const record of data.gifs){
    await mongoClient.connect();
    const searchResult =  await collection.findOne({"redid": record.id})
    console.log(searchResult)
    if ( searchResult !== null) {
        console.log(record.id, "found")
    }   else {
        const status = "scanned"
            await collection.insertOne({"redid": record.id, "link": record.urls.hd, "tags": record.tags, "status": status})
                }
                await mongoClient.close();
            }
})().catch(e => {
    console.log(e)
});

