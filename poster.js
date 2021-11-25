(async () => {
const TG = require('telegram-bot-api')
const fs = require('fs')
const api = new TG({
    token: "2103691286:AAFPr5xpilHIowrfSAouHR3oAOSQ0s-ttFs"
})

api.sendVideo({
    chat_id: "-1001615726394",
    caption: 'My cute picture',
    photo: fs.createReadStream('./adolescentmushyhalibut.mp4')
})

})().catch(e => {
    console.log(e)
}); 
