# dbm-discord-bot-updater
dbm-discord-bot-updater requires Node 16 per DBM v2 and it is recommended to use the [latest version of Node 16](https://nodejs.org/en/)

# installation
To Install this you must copy updater.mjs and updaterConfig.json to your bots directory, But you must also edit the config.
1. If your bots Github Repository is private replace `false` with `true` "PRIVATE_REPO"
2. Put your Github Username in the empty "" next to "GITHUB_USERNAME"
3. Put your Github Repository Name in the empty "" next to "GITHUB_REPO_NAME"
4. If your Github Reposiory IS private put your Github Authorization Key in the empty "" next to "GITHUB_AUTH_TOKEN" else leave the "" empty (you can find your github authorization key under setting > developer setting > personal access tokens, if you do not already have one click "Generate new token" and input all the details neccessary)