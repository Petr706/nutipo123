const { resourceLimits } = require('worker_threads');

(async () => {
    const util = require('util');
    const fs = require('fs');
    const ffmpeg = require('fluent-ffmpeg');
    const getDimensions = require('get-video-dimensions')
    const {ddimensions, recode} = require('./util.js');
    const fsStatAsync = util.promisify(fs.stat)
    const fsUnlinkAsync = util.promisify(fs.unlink)
    const fsRenameAsync = util.promisify(fs.rename)
    const inFile = './frigidexcitingwoodstorks.mp4'
    const dimensions = await getDimensions(inFile)
    console.log(dimensions)
    const stats = await fsStatAsync(inFile)
    const sizeInMb = Math.round((+stats.size / 1024) / 1000).toFixed(2);
    const results = ddimensions(dimensions.width, dimensions.height, sizeInMb)
    console.log('width : ', results.width, ' height : ',results.height)

    if (results.height === dimensions.height){
        console.log('no need to recode')
    } else {
        await recode(inFile, './temp.mp4', results.width,results.height)
        await fsUnlinkAsync(inFile)
        await fsRenameAsync('./temp.mp4', inFile)
    }
})().catch(e => {
    console.log(e)
});