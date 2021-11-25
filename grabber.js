const { Console } = require("console");

(async () => {
const request = require('request');
const fetch = require('node-fetch');
const MongoClient = require("mongodb").MongoClient;
const url = "mongodb://localhost:27017/";
const mongoClient = new MongoClient(url);
const db = mongoClient.db("usersdb");
const collection = db.collection("VideosData");
const fs = require('fs')
const downloadFile = (async (imageUrls, path) => {
    const res = await fetch(imageUrls);
    const fileStream = fs.createWriteStream(path);
    await new Promise((resolve, reject) => {
        res.body.pipe(fileStream);
        res.body.on("error", reject);
        fileStream.on("finish", resolve);
      });
  });

//for (const record of data.gifs){
await mongoClient.connect();
const status = "scanned"
const statusNew = "downloaded"
const videoLinks = await collection.find({"status":  status}).toArray()
for (const record of videoLinks) {
    console.log(record.link)
    const imageUrls = record.link
    const imageId = record.redid
    const path = './gifs/'+imageId+'.mp4'
    try{
        downloadFile(imageUrls, path);
        var myquery = { status: status };
        var newvalues = { $set: {status: statusNew} };
        await collection.updateOne(myquery, newvalues)
    } catch(e) {
    console.log('error downloading', e)
    }

}// for
await mongoClient.close();
})().catch(e => {
    console.log(e)
}); 
