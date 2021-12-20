import fs from 'fs-extra'
import fetch from 'node-fetch'
const config = JSON.parse(fs.readFileSync('./updaterConfig.json', 'utf-8'))

async function updateBot() {
    if (config.PRIVATE_REPO && typeof config.PRIVATE_REPO === 'boolean') {
        var headers = {"Authorization": `Token ${config.GITHUB_AUTH_TOKEN}` }
        console.log("Updating Commands")
        var commands = await fetch(`https://raw.githubusercontent.com/${config.GITHUB_USERNAME}/${config.GITHUB_REPO_NAME}/main/data/commands.json`, {"method": "GET", "headers": headers})
        var commandsText = await commands.text()
        fs.writeFileSync('.\\data\\commands.json', commandsText)
        console.log("Commands Updated")
        console.log("Updating Events")
        var events = await fetch(`https://raw.githubusercontent.com/${config.GITHUB_USERNAME}/${config.GITHUB_REPO_NAME}/main/data/events.json`, {"method": "GET", "headers": headers})
        var eventsText = await events.text()
        fs.writeFileSync('.\\data\\events.json', eventsText)
        console.log("Events Updated")
    }
    else {
        console.log("Updating Commands")
        var commands = await fetch(`https://raw.githubusercontent.com/${config.GITHUB_USERNAME}/${config.GITHUB_REPO_NAME}/main/data/commands.json`)
        var commandsText = await commands.text()
        fs.writeFileSync('.\\data\\commands.json', commandsText)
        console.log("Commands Updated")
        console.log("Updating Events")
        var events = await fetch(`https://raw.githubusercontent.com/${config.GITHUB_USERNAME}/${config.GITHUB_REPO_NAME}/main/data/events.json`)
        var eventsText = await events.text()
        fs.writeFileSync('.\\data\\events.json', eventsText)
        console.log("Events Updated")
    }
}

(async function start() {
    await updateBot()
}())