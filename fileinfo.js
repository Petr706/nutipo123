const path = require('path');

(async () => {
var ffmpeg = require('fluent-ffmpeg');
const getDuration = require('ffprobe-duration');
const fs = require('fs');
const files = fs.readdirSync('./gifs/')
const path = "./gifs/"
const csv = require('csv')
const separator = ";"
const {geVideoInfo} = require('./util.js')
for(const fileName of files){
        const fullFileName = path + fileName
        const test = './gifs/aggravatingtwinbird.mp4'
        try {
            const metaData = await geVideoInfo(test)
            console.log(metaData.format.size)
            //const width = metaData.streams[0].width
            //const height = metaData.streams[0].height
            //const durationInSex = Math.round(metaData.format.duration * 10) / 10
            //const sizeInMb = Math.round((metaData.format.size / 1024 / 1024 ) * 10) / 10
            //const csvLog = fileName+separator+width+"*"+height+separator+sizeInMb+separator+durationInSex
            //console.log(csvLog)
        } catch(e) {
            console.log(e)
        }
    }
        //const path = './gifs/'+file;
        /*try {
        } catch(e) {
            console.log(e)
        }*/

})().catch(e => {
    console.log(e)
});
