import fs from 'fs-extra'
import fetch from 'node-fetch'
const config = JSON.parse(fs.readFileSync('./updaterConfig.json', 'utf-8'))

async function updateBot() {
    if(typeof config.PRIVATE_REPO !== 'boolean') return console.log('Invalid PRIVATE_REPO in updaterConfig.json')
    const headers = {"Authorization": `Token ${config.GITHUB_AUTH_TOKEN}`}
    console.log("Updating Commands")
    const commands = config.PRIVATE_REPO ? await fetch(`https://raw.githubusercontent.com/${config.GITHUB_USERNAME}/${config.GITHUB_REPO_NAME}/main/data/commands.json`, {"method": "GET", "headers": headers}) : await fetch(`https://raw.githubusercontent.com/${config.GITHUB_USERNAME}/${config.GITHUB_REPO_NAME}/main/data/commands.json`);
    const commandsText = await commands.text()
    fs.writeFileSync('.\\data\\commands.json', commandsText)
    console.log("Commands Updated")
    console.log("Updating Events")
    const events = config.PRIVATE_REPO ? await fetch(`https://raw.githubusercontent.com/${config.GITHUB_USERNAME}/${config.GITHUB_REPO_NAME}/main/data/events.json`, {"method": "GET", "headers": headers}) : await fetch(`https://raw.githubusercontent.com/${config.GITHUB_USERNAME}/${config.GITHUB_REPO_NAME}/main/data/events.json`);
    const eventsText = await events.text()
    fs.writeFileSync('.\\data\\events.json', eventsText)
    console.log("Events Updated")
}

(async function start() {
    await updateBot()
}())
