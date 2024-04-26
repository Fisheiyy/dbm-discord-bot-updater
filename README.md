# dbm-discord-bot-updater
dbm-discord-bot-updater requires Node 18+ but it is recommended to use [the latest version of Node](https://nodejs.org/en/)

This script will update your discord bots commands.json and events.json. 
Included is "rawdata.txt" it has the compressed data for an event and command that will automatically update your bot everyday at 00:00 CDT or whenever the command is called by the BOT OWNER

# Installation
To Install this you must copy updater.mjs and updaterConfig.json to your bots directory, but you must also edit the updater config.
1. Enter your Github Username in the "GITHUB_USERNAME" field.
2. Enter the Github Repository Name in the "GITHUB_REPO_NAME" field.
3. Update the "PRIVATE_REPO" field if neccesary, by default it is false.
4. IF your Repository IS private, update the "GITHUB_ACCESS_TOKEN" field.

You can create a "Pernsonal Access Token" on Github by going under, "Settings" > "Developer Settings" > "Personal Access Tokens" > "Fine-Grained Tokens" OR "Tokens (Classic)"