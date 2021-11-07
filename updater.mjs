import fs from 'fs-extra'
import fetch from 'node-fetch'
const allCommits = ".\\commits.json"
const currentCommit = ".\\currentCommit.json"

if (allCommits.indexOf(currentCommit.sha) > 1) {
    var commitsSince = allCommits.indexOf(currentCommit.sha)
    if (commitsSince == 1) {
        console.log(`Updating, there has been ${commitsSince} commit since last update`)
    }
    if (commitsSince != 1) {
        console.log(`Updating, there has been ${commitsSince} commits since last update`)
    }
    await updateBot()
    await updateCommits()
}

async function updateBot() {
    console.log("Updating Commands")
    var commands = await fetch('your commands.json raw github url')
    var commandsText = await commands.text()
    fs.writeFile('.\\data\\commands.json', commandsText, (err) => {
        if (err) {return console.log(err)}
    })
	console.log("Commands Updated")
    console.log("Updating Events")
    var events = await fetch('your events.json raw github url')
    var eventsText = await events.text()
    fs.writeFile('.\\data\\events.json', eventsText, (err) => {
        if (err) {return console.log(err)}
    })
	console.log("Events Updated")
}

async function updateCommits() {
    console.log("Getting Commits")
    // var headers = {"Authorization": "Token yourpersonalaccesstoken"}
    // var commits = await fetch('your bot repo url', {"method": "GET", "headers": headers})
    // if your repo is public you can comment the line below and uncomment the 2 lines above
    var commits = await fetch('your bot repo url')
    var commitsJSON = await commits.json()
    var commitsJSON = JSON.stringify(commitsJSON)
    console.log("Updating All Commits")
    fs.writeFile(allCommits, commitsJSON, (err) => {
        if (err) {return console.log(err)}
    })
    console.log("Updating Current Commit")
    fs.writeFile(currentCommit, commitsJSON[0], (err) => {
        if (err) {return console.log(err)}
    })
}