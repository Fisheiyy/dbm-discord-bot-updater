import fs from 'fs-extra'
import fetch from 'node-fetch'
const allCommits = ".\\commits.json"
const currentCommit = ".\\currentCommit.json"

if (allCommits.indexOf(currentCommit[0]) != 0) {
    var commitsSince = allCommits.indexOf(currentCommit[0])
    if (commitsSince == 1) {
        console.log(`Updating, there has been ${commitsSince} commit since last update`)
    }
    if (commitsSince != 1) {
        console.log(`Updating, there has been ${commitsSince} commits since last update`)
    }
    await updateSalmon()
    await updateCommits()
}

async function updateSalmon() {
    console.log("Updating Commands")
    var commands = await fetch('your commands.json raw github url')
    var commandsText = await commands.text()
    fs.writeFile('salmon/data/commands.json', commandsText, (err) => {
        if (err) {return console.log(err)}
    })
	console.log("Commands Updated")
    console.log("Updating Events")
    var events = await fetch('your events.json raw github url')
    var eventsText = await events.text()
    fs.writeFile('salmon/data/events.json', eventsText, (err) => {
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
    var commitsText = await commits.text()
    console.log("Updating All Commits")
    fs.writeFile(allCommits, commitsText, (err) => {
        if (err) {return console.log(err)}
    })
    console.log("Updating Current Commit")
    fs.writeFile(currentCommit, commitsText[0], (err) => {
        if (err) {return console.log(err)}
    })
}