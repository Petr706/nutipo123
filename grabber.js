const { Console } = require("console");

(async () => {
    const getDimensions = require('get-video-dimensions')
    const fs = require('fs')
    const util = require('util');
    const fsUnlinkAsync = util.promisify(fs.unlink)
    const fsRenameAsync = util.promisify(fs.rename)
    const ffmpeg = require('fluent-ffmpeg');
    const request = require('request');
    const MongoClient = require("mongodb").MongoClient;
    const url = "mongodb://localhost:27017/";
    const mongoClient = new MongoClient(url);
    const db = mongoClient.db("usersdb");
    const collection = db.collection("VideosData");
    const getDuration = require('ffprobe-duration');
    const files = fs.readdirSync('./gifs/')
    const separator = ";"
    const { delay, geVideoInfo, downloadFile, ddimensions, recode } = require('./util.js')
    await mongoClient.connect();
    const videoLinks = await collection.find({ "status": 'scanned' }).toArray()
    for (const record of videoLinks) {
        const imageUrls = record.link
        const pluginUrl = imageUrls.split('.')
        const imageId = record.redid
        const lastElement = pluginUrl[pluginUrl.length - 1]
        const path = './gifs/' + imageId + '.' + lastElement
        try {
            downloadFile(imageUrls, path);
            const fsStatAsync = util.promisify(fs.stat)
            const stats = await fsStatAsync(path)
            const sizeInMb = Math.round((+stats.size / 1024) / 1000).toFixed(2);
            const dimensions = await getDimensions(path)
            const results = ddimensions(dimensions.width, dimensions.height, sizeInMb)
            //console.log(imageUrls, sizeInMb)
            if (results.height === dimensions.height) {
                console.log('no need to recode')
            } else {
                await recode(path, './temp.mp4', results.width, results.height)
                await fsUnlinkAsync(path)
                await fsRenameAsync('./temp.mp4', path)
            }
            await collection.updateOne({ "redid": record.redid }, { $set: { "status": "downloaded" } })
        } catch (e) {
            console.log(e)
            await collection.updateOne({ "redid": record.redid }, { $set: { "status": "download failed" } })
        }//catch
        await delay(1000)
    }
    await mongoClient.close();
})().catch(e => {
    console.log(e)
}); 
