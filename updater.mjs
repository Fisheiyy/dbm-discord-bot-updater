import fs from 'fs-extra'
import fetch from 'node-fetch'
const config = JSON.parse(fs.readFileSync('./updaterConfig.json', 'utf-8'))
const headers = {"Authorization": `Token ${config.GITHUB_AUTH_TOKEN}`}

async function configValidator() {
    if (config.GITHUB_USERNAME !== "") {
        if (config.GITHUB_REPO_NAME !== "") {
            if (typeof config.PRIVATE_REPO == 'boolean') {
                if (config.PRIVATE_REPO == true && config.GITHUB_AUTH_TOKEN == "") {throw new Error("GITHUB_AUTH_TOKEN is not set in updaterConfig.json")}
                if (config.PRIVATE_REPO == false) {console.log("Private Repo = False")}
            }
            else {throw new Error("PRIVATE_REPO is not a valid boolean in updaterConfig.json")}
        }
        else {throw new Error("GITHUB_REPO_NAME is not set in updaterConfig.json")}
    }
    else {throw new Error("GITHUB_USERNAME is not set in updaterConfig.json")}
    console.log("Config Valid")
    const githubApi = await fetch(`https://api.github.com/`)
    const githubCom = await fetch(`https://github.com/`)
    if (githubApi.status && githubCom.status != 200) {throw new Error("Github is having issues, try again later")}
    console.log("Github Response OK")
    if (config.GITHUB_AUTH_TOKEN !== "") {
        const checkAuthToken = await fetch(`https://api.github.com/repos/${config.GITHUB_USERNAME}/${config.GITHUB_REPO_NAME}/contents`, {"method": "GET", "headers": headers})
        if (checkAuthToken.status !== 200) {throw new Error("GITHUB_AUTH_TOKEN is not valid")}
    }
    console.log("Github Auth Token Valid")
}

async function updateCommands() {
    const commands = config.PRIVATE_REPO ? await fetch(`https://raw.githubusercontent.com/${config.GITHUB_USERNAME}/${config.GITHUB_REPO_NAME}/main/data/commands.json`, {"method": "GET", "headers": headers}) : await fetch(`https://raw.githubusercontent.com/${config.GITHUB_USERNAME}/${config.GITHUB_REPO_NAME}/main/data/commands.json`)
    const commandsText = await commands.text()
    fs.writeFileSync('.\\data\\commands.json', commandsText)
    console.log("Commands Updated")
    const events = config.PRIVATE_REPO ? await fetch(`https://raw.githubusercontent.com/${config.GITHUB_USERNAME}/${config.GITHUB_REPO_NAME}/main/data/events.json`, {"method": "GET", "headers": headers}) : await fetch(`https://raw.githubusercontent.com/${config.GITHUB_USERNAME}/${config.GITHUB_REPO_NAME}/main/data/events.json`)
    const eventsText = await events.text()
    fs.writeFileSync('.\\data\\events.json', eventsText)
    console.log("Events Updated")
}

async function updateSettings() {
    const settings = config.PRIVATE_REPO ? await fetch(`https://raw.githubusercontent.com/${config.GITHUB_USERNAME}/${config.GITHUB_REPO_NAME}/main/data/settings.json`, {"method": "GET", "headers": headers}) : await fetch(`https://raw.githubusercontent.com/${config.GITHUB_USERNAME}/${config.GITHUB_REPO_NAME}/main/data/commands.json`)
    const settingsText = await settings.text()
    fs.writeFileSync('.\\data\\settings.json', settingsText)
    console.log("Settings Updated")
}

async function updateResources() {
    const resources = config.PRIVATE_REPO ? await fetch(`https://api.github.com/repos/${config.GITHUB_USERNAME}/${config.GITHUB_REPO_NAME}/contents/resources`, {"method": "GET", "headers": headers}) : await fetch(`https://api.github.com/repos/${config.GITHUB_USERNAME}/${config.GITHUB_REPO_NAME}/contents/resources`)
    const resourcesJSON = await resources.json()
    var i = 0
    while (i < resourcesJSON.length) {
        var resourceContent = config.PRIVATE_REPO ? await fetch(`${resourcesJSON[i].download_url}`, {"method": "GET", "headers": headers}) : await fetch(`${resourcesJSON[i].download_url}`)
        var resourceText = await resourceContent.text()
        fs.writeFileSync('.\\resources\\' + resourcesJSON[i].name, resourceText)
        console.log("Resources Downloaded: " + resourcesJSON[i].name)
        i++
    }
}

async function updateActions() {
    const actions = config.PRIVATE_REPO ? await fetch(`https://api.github.com/repos/${config.GITHUB_USERNAME}/${config.GITHUB_REPO_NAME}/contents/actions`, {"method": "GET", "headers": headers}) : await fetch(`https://api.github.com/repos/${config.GITHUB_USERNAME}/${config.GITHUB_REPO_NAME}/contents/actions`)
    const actionsJSON = await actions.json()
    const events = config.PRIVATE_REPO ? await fetch(`https://api.github.com/repos/${config.GITHUB_USERNAME}/${config.GITHUB_REPO_NAME}/contents/events`, {"method": "GET", "headers": headers}) : await fetch(`https://api.github.com/repos/${config.GITHUB_USERNAME}/${config.GITHUB_REPO_NAME}/contents/events`)
    const eventsJSON = await events.json()
    const extensions = config.PRIVATE_REPO ? await fetch(`https://api.github.com/repos/${config.GITHUB_USERNAME}/${config.GITHUB_REPO_NAME}/contents/extensions`, {"method": "GET", "headers": headers}) : await fetch(`https://api.github.com/repos/${config.GITHUB_USERNAME}/${config.GITHUB_REPO_NAME}/contents/extensions`)
    const extensionsJSON = await extensions.json()
    var i = 0
    while (i < actionsJSON.length) {
        var actionContent = config.PRIVATE_REPO ? await fetch(`${actionsJSON[i].download_url}`, {"method": "GET", "headers": headers}) : await fetch(`${actionsJSON[i].download_url}`)
        var actionText = await actionContent.text()
        fs.writeFileSync('.\\actions\\' + actionsJSON[i].name, actionText)
        i++
    }
    console.log("Actions Updated")
    var i = 0
    while (i < eventsJSON.length) {
        var eventContent = config.PRIVATE_REPO ? await fetch(`${eventsJSON[i].download_url}`, {"method": "GET", "headers": headers}) : await fetch(`${eventsJSON[i].download_url}`)
        var eventText = await eventContent.text()
        fs.writeFileSync('.\\events\\' + eventsJSON[i].name, eventText)
        i++
    }
    console.log("Events Updated")
    var i = 0
    while (i < extensionsJSON.length) {
        if (extensionsJSON[i].download_url == null) {
            i++
            continue
        }
        var extensionContent = config.PRIVATE_REPO ? await fetch(`${extensionsJSON[i].download_url}`, {"method": "GET", "headers": headers}) : await fetch(`${extensionsJSON[i].download_url}`)
        var extensionText = await extensionContent.text()
        fs.writeFileSync('.\\extensions\\' + extensionsJSON[i].name, extensionText)
        i++
    }
    console.log("Extensions Updated")
}

(async function start() {
    await configValidator()
    if (process.argv[2] == undefined) {
        console.log("No argument provided, updating commands by default")
        await updateCommands()
    }
    else {
        switch (process.argv[2]) {
            case "settings":
                await updateSettings()
                break
            case "resources":
                console.log("Updating Resources, this may take a while")
                await updateResources()
                break
            case "actions":
                console.log("Updating Actions, this may take a while")
                await updateActions()
                break
            default:
                throw new Error("Invalid Argument")
        }
    }
}())