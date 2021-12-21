import fs from 'fs-extra'
import fetch from 'node-fetch'
const config = JSON.parse(fs.readFileSync('./updaterConfig.json', 'utf-8'))

async function configValidator() {
    if (config.GITHUB_USERNAME !== "") {
        if (config.GITHUB_REPO_NAME !== "") {
            if (typeof config.PRIVATE_REPO == 'boolean') {
                if (config.PRIVATE_REPO == true && config.GITHUB_AUTH_TOKEN == "") {throw new Error("GITHUB_AUTH_TOKEN is not set in updaterConfig.json")}
                else {console.log("Private Repo = False")}
            }
            else {throw new Error("PRIVATE_REPO is not a valid boolean in updaterConfig.json")}
        }
        else {throw new Error("GITHUB_REPO_NAME is not set in updaterConfig.json")}
    }
    else {throw new Error("GITHUB_USERNAME is not set in updaterConfig.json")}
    const githubApi = await fetch(`https://api.github.com/`)
    const githubCom = await fetch(`https://github.com/`)
    if (githubApi.status && githubCom.status != 200) {throw new Error("Github is having issues, try again later")}
    console.log("Config Valid and Github Reponse OK")
}

async function updateBot() {
    const headers = {"Authorization": `Token ${config.GITHUB_AUTH_TOKEN}`}
    console.log("Updating Commands")
    const commands = config.PRIVATE_REPO ? await fetch(`https://raw.githubusercontent.com/${config.GITHUB_USERNAME}/${config.GITHUB_REPO_NAME}/main/data/commands.json`, {"method": "GET", "headers": headers}) : await fetch(`https://raw.githubusercontent.com/${config.GITHUB_USERNAME}/${config.GITHUB_REPO_NAME}/main/data/commands.json`)
    const commandsText = await commands.text()
    fs.writeFileSync('.\\data\\commands.json', commandsText)
    console.log("Commands Updated")
    console.log("Updating Events")
    const events = config.PRIVATE_REPO ? await fetch(`https://raw.githubusercontent.com/${config.GITHUB_USERNAME}/${config.GITHUB_REPO_NAME}/main/data/events.json`, {"method": "GET", "headers": headers}) : await fetch(`https://raw.githubusercontent.com/${config.GITHUB_USERNAME}/${config.GITHUB_REPO_NAME}/main/data/events.json`)
    const eventsText = await events.text()
    fs.writeFileSync('.\\data\\events.json', eventsText)
    console.log("Events Updated")
}

(async function start() {
    await configValidator()
    await updateBot()
}())