import fs from 'fs-extra'
import fetch from 'node-fetch'
const config = JSON.parse(fs.readFileSync('./updaterConfig.json', 'utf-8'))

async function configValidator() {
    if (config.GITHUB_USERNAME == "") {
        console.log("GITHUB_USERNAME is not set in updaterConfig.json")
        process.exit()
    }
    if (config.GITHUB_REPO_NAME == "") {
        console.log("GITHUB_REPO_NAME is not set in updaterConfig.json")
        process.exit()
    }
    if (typeof config.PRIVATE_REPO !== 'boolean') {
        console.log("PRIVATE_REPO is not a valid boolean in updaterConfig.json")
        process.exit()
    }
    if (config.PRIVATE_REPO == true && config.GITHUB_AUTH_TOKEN == "") {
        console.log("GITHUB_AUTH_TOKEN is not set in updaterConfig.json")
        process.exit()
    }
    var githubApi = await fetch(`https://api.github.com/`)
    var githubCom = await fetch(`https://github.com/`)
    if (githubApi && githubCom != 200) {throw new Error("Github is having issues, try again later")}
    console.log("Config Valid and Github OK")
}

async function updateBot() {
    var headers = {"Authorization": `Token ${config.GITHUB_AUTH_TOKEN}`}
    console.log("Updating Commands")
    var commands = config.PRIVATE_REPO ? await fetch(`https://raw.githubusercontent.com/${config.GITHUB_USERNAME}/${config.GITHUB_REPO_NAME}/main/data/commands.json`, {"method": "GET", "headers": headers}) : await fetch(`https://raw.githubusercontent.com/${config.GITHUB_USERNAME}/${config.GITHUB_REPO_NAME}/main/data/commands.json`)
    var commandsText = await commands.text()
    fs.writeFileSync('.\\data\\commands.json', commandsText)
    console.log("Commands Updated")
    console.log("Updating Events")
    var events = config.PRIVATE_REPO ? await fetch(`https://raw.githubusercontent.com/${config.GITHUB_USERNAME}/${config.GITHUB_REPO_NAME}/main/data/events.json`, {"method": "GET", "headers": headers}) : await fetch(`https://raw.githubusercontent.com/${config.GITHUB_USERNAME}/${config.GITHUB_REPO_NAME}/main/data/events.json`)
    var eventsText = await events.text()
    fs.writeFileSync('.\\data\\events.json', eventsText)
    console.log("Events Updated")
}

(async function start() {
    await configValidator()
    await updateBot()
}())