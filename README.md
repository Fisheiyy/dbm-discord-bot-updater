# dbm-discord-bot-updater
dbm-discord-bot-updater requires Node 16 per DBM v2 and it is recommended to use the [latest version of Node](https://nodejs.org/en/)

This script will update your discord bots commands.json and events.json, included is a text file called "rawdata.txt" it has the compressed data
for an event I have made which automatically updates your discord bot every night at 00:00 CDT (you can change the timezone) and an command that
only the BOT OWNER can use which forces the bot to update whenever used.

# Installation
To Install this you must copy updater.mjs and updaterConfig.json to your bots directory, But you must also edit the config.
1. If your bots Github Repository IS private replace false with true next to "PRIVATE_REPO"
2. Put your Github Username in the empty "" next to "GITHUB_USERNAME"
3. Put your Github Repository Name in the empty "" next to "GITHUB_REPO_NAME"
4. If your Github Reposiory IS private put your Github Authorization Key in the empty "" next to "GITHUB_AUTH_TOKEN" else leave the "" empty 
(you can make a github authorization key by going under settings > developer settings > personal access tokens > generate new token)
