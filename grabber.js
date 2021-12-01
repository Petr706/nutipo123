const { Console } = require("console");

(async () => {
const ffmpeg = require('fluent-ffmpeg');
const request = require('request');
const MongoClient = require("mongodb").MongoClient;
const url = "mongodb://localhost:27017/";
const mongoClient = new MongoClient(url);
const db = mongoClient.db("usersdb");
const collection = db.collection("VideosData");
const fs = require('fs')
const getDuration = require('ffprobe-duration');
const files = fs.readdirSync('./gifs/')
const separator = ";"
const {delay, geVideoInfo, downloadFile} = require('./util.js')
await mongoClient.connect();
const videoLinks = await collection.find({"status":  'scanned'}).toArray()
for (const record of videoLinks) {
    const imageUrls = record.link
    const pluginUrl = imageUrls.split('.')
    const imageId = record.redid
    const lastElement = pluginUrl[pluginUrl.length-1]
    const path = './gifs/'+imageId+'.'+lastElement
    const test = './gifs/aggravatingtwinbird.mp4'
    try{
        downloadFile(imageUrls, path);
        const fullFileName = test
        const metaData = await geVideoInfo(fullFileName)
        const sizeInMb = metaData.format.size
        console.log(sizeInMb)
        //console.log(imageUrls, sizeInMb)
        await collection.updateOne({ "redid": record.redid }, { $set: {"status": "downloaded"} })
        if(sizeInMb > 10) {
            console.log(imageId, "is over 10 Mb")
        }
    } catch(e) {
        await collection.updateOne({ "redid": record.redid }, { $set: {"status": "download failed"} })
        }//catch
    await delay(1000)
    }
await mongoClient.close();
})().catch(e => {
    console.log(e)
}); 
