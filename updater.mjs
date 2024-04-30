// This program is created with assistance from Github Copilot AI.
import fs from 'fs'
import { exit } from 'process';
import readline from 'readline'
const prompt = readline.createInterface(process.stdin, process.stdout);
const config = JSON.parse(fs.readFileSync('./updaterConfig.json', 'utf-8'))
const headers = {"Authorization": `Token ${config.GITHUB_ACCESS_TOKEN}`}

// config validation
async function configValidator() {
    if (config.GITHUB_USERNAME !== "") {
        if (config.GITHUB_REPO_NAME !== "") {
            if (typeof config.PRIVATE_REPO == 'boolean') {
                if (config.PRIVATE_REPO == true && config.GITHUB_ACCESS_TOKEN == "") {throw new Error("GITHUB_ACCESS_TOKEN is not set in updaterConfig.json")}
                config.PRIVATE_REPO == false ? console.log("Public Repo") : console.log("Private Repo")
            }
            else {throw new Error("PRIVATE_REPO is not a valid boolean in updaterConfig.json")}
        }
        else {throw new Error("GITHUB_REPO_NAME is not set in updaterConfig.json")}
    }
    else {throw new Error("GITHUB_USERNAME is not set in updaterConfig.json")}
    var githubAPI = await fetch(`https://api.github.com/`)
    var githubCOM = await fetch(`https://github.com/`)
    if (githubAPI.status && githubCOM.status != 200) {throw new Error("Github is having issues, try again later")}
    console.log("Github API OK")
    if (config.GITHUB_ACCESS_TOKEN !== "") {
        var checkAuthToken = await fetch(`https://api.github.com/repos/${config.GITHUB_USERNAME}/${config.GITHUB_REPO_NAME}/contents`, {"method": "GET", "headers": headers})
        checkAuthToken.status == 200 ? console.log("Github Access Token Valid") : (() => { throw new Error("GITHUB_ACCESS_TOKEN is not valid") })()
    }
    var checkRepo = await fetch(`https://api.github.com/repos/${config.GITHUB_USERNAME}/${config.GITHUB_REPO_NAME}`, {"method": "GET"})
    if (checkRepo.status != 200) {throw new Error("Repo does not exist, is private, or incorrect username/repo name defined in updaterConfig.json")}
    else {console.log("Repo Valid")}
    console.log("Config Valid")
}

// repo contents validator
async function repoContentsValidator() {
    var actions = await fetch(`https://api.github.com/repos/${config.GITHUB_USERNAME}/${config.GITHUB_REPO_NAME}/contents/actions`, {"method": "GET"})
    var events = await fetch(`https://api.github.com/repos/${config.GITHUB_USERNAME}/${config.GITHUB_REPO_NAME}/contents/events`, {"method": "GET"})
    var extensions = await fetch(`https://api.github.com/repos/${config.GITHUB_USERNAME}/${config.GITHUB_REPO_NAME}/contents/extensions`, {"method": "GET"})
    var resources = await fetch(`https://api.github.com/repos/${config.GITHUB_USERNAME}/${config.GITHUB_REPO_NAME}/contents/resources`, {"method": "GET"})
    var commands = await fetch(`https://api.github.com/repos/${config.GITHUB_USERNAME}/${config.GITHUB_REPO_NAME}/contents/data/commands.json`, {"method": "GET"})
    var settings = await fetch(`https://api.github.com/repos/${config.GITHUB_USERNAME}/${config.GITHUB_REPO_NAME}/contents/data/settings.json`, {"method": "GET"})
    var all = [actions, events, extensions, resources, commands, settings]
    for (var i = 0; i < all.length; i++) {
        if (all[i].status == 404) {throw new Error("Repo directories are not valid")}
    }
    console.log("Repo Contents Valid")
}

// main functions
async function updateCommands() {
    var commands = config.PRIVATE_REPO ? await fetch(`https://raw.githubusercontent.com/${config.GITHUB_USERNAME}/${config.GITHUB_REPO_NAME}/main/data/commands.json`, {"method": "GET", "headers": headers}) : await fetch(`https://raw.githubusercontent.com/${config.GITHUB_USERNAME}/${config.GITHUB_REPO_NAME}/main/data/commands.json`)
    var commandsText = await commands.text()
    fs.writeFileSync('.\\data\\commands.json', commandsText)
    console.log("Commands Updated")
    var events = config.PRIVATE_REPO ? await fetch(`https://raw.githubusercontent.com/${config.GITHUB_USERNAME}/${config.GITHUB_REPO_NAME}/main/data/events.json`, {"method": "GET", "headers": headers}) : await fetch(`https://raw.githubusercontent.com/${config.GITHUB_USERNAME}/${config.GITHUB_REPO_NAME}/main/data/events.json`)
    var eventsText = await events.text()
    fs.writeFileSync('.\\data\\events.json', eventsText)
    console.log("Events Updated")
    exit()
}

async function updateSettings() {
    var settings = config.PRIVATE_REPO ? await fetch(`https://raw.githubusercontent.com/${config.GITHUB_USERNAME}/${config.GITHUB_REPO_NAME}/main/data/settings.json`, {"method": "GET", "headers": headers}) : await fetch(`https://raw.githubusercontent.com/${config.GITHUB_USERNAME}/${config.GITHUB_REPO_NAME}/main/data/settings.json`)
    var settingsText = await settings.text()
    fs.writeFileSync('.\\data\\settings.json', settingsText)
    console.log("Settings Updated")
    exit()
}

async function updateResources() {
    var resources = config.PRIVATE_REPO ? await fetch(`https://api.github.com/repos/${config.GITHUB_USERNAME}/${config.GITHUB_REPO_NAME}/contents/resources`, {"method": "GET", "headers": headers}) : await fetch(`https://api.github.com/repos/${config.GITHUB_USERNAME}/${config.GITHUB_REPO_NAME}/contents/resources`)
    var resourcesJSON = await resources.json()
    var i = 0
    while (i < resourcesJSON.length) {
        var resourceContent = config.PRIVATE_REPO ? await fetch(`${resourcesJSON[i].download_url}`, {"method": "GET", "headers": headers}) : await fetch(`${resourcesJSON[i].download_url}`)
        var resourceText = await resourceContent.text()
        fs.writeFileSync('.\\resources\\' + resourcesJSON[i].name, resourceText)
        console.log("Resources Downloaded: " + resourcesJSON[i].name)
        i++
    }
    exit()
}

async function updateActions() {
    var actions = config.PRIVATE_REPO ? await fetch(`https://api.github.com/repos/${config.GITHUB_USERNAME}/${config.GITHUB_REPO_NAME}/contents/actions`, {"method": "GET", "headers": headers}) : await fetch(`https://api.github.com/repos/${config.GITHUB_USERNAME}/${config.GITHUB_REPO_NAME}/contents/actions`)
    var actionsJSON = await actions.json()
    var events = config.PRIVATE_REPO ? await fetch(`https://api.github.com/repos/${config.GITHUB_USERNAME}/${config.GITHUB_REPO_NAME}/contents/events`, {"method": "GET", "headers": headers}) : await fetch(`https://api.github.com/repos/${config.GITHUB_USERNAME}/${config.GITHUB_REPO_NAME}/contents/events`)
    var eventsJSON = await events.json()
    var extensions = config.PRIVATE_REPO ? await fetch(`https://api.github.com/repos/${config.GITHUB_USERNAME}/${config.GITHUB_REPO_NAME}/contents/extensions`, {"method": "GET", "headers": headers}) : await fetch(`https://api.github.com/repos/${config.GITHUB_USERNAME}/${config.GITHUB_REPO_NAME}/contents/extensions`)
    var extensionsJSON = await extensions.json()
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
    exit()
}

async function choices(choice) {
    choice = choice.toLowerCase()
    switch (choice) {
        case "all":
            console.log("Updating Everything, this may take a while")
            await updateCommands()
            await updateSettings()
            await updateResources()
            await updateActions()
            break
        case "settings":
            console.log("Updating Settings, this may take a while")
            await updateSettings()
            break
        case "actions":
            console.log("Updating Actions, this may take a while")
            await updateActions()
            break
        case "commands":
            console.log("Updating Commands, this may take a while")
            await updateCommands()
            break
        case "resources":
            console.log("Updating Resources, this may take a while")
            await updateResources()
            break
        default:
            throw new Error("Invalid Argument")
    }
}

// start
(async function start() {
    await configValidator()
    await repoContentsValidator()
    if (process.argv[2] == undefined) {
        console.log("No argument provided, entering Manual Mode by default")
        let timeoutId = setTimeout(() => {
            console.log('No input received, updating commands by default...');
            choices("commands") 
        }, 10000)
        prompt.question("What do you want to update? \n  All \n  Settings \n  Actions \n  Commands \n  Resources \nYou have 10 Seconds to answer \n  ", (choice) => {
            clearTimeout(timeoutId)
            if (choice !== undefined) {
                manual(choice)
            }
        })
    }
    else {
        await choices(process.argv[2])
    }
}())
