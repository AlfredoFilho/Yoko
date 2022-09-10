const RPC = require('discord-rpc')
const client = new RPC.Client({ transport: "ipc" })
client.configs = require('./configs.json')

const client_id = client.configs['application_id']

const activity = {
    details: "My Discord Bot",
    state: "Click button to invite",
    assets: {
        large_image: "botavatar"
    },
    buttons: [
        {
            "label": "Invite",
            "url": `https://discord.com/api/oauth2/authorize?client_id=${client_id}&permissions=8&scope=bot%20applications.commands`
        },
        {
            "label": "Free Bitcoin",
            "url": `https://bit.ly/3CVBnLD`
        }
    ],
    timestamps: { start: Date.now() },
    instance: true
}

client.on("ready", () => {
    client.request("SET_ACTIVITY", { pid: process.pid, activity: activity })
    console.log("Done")
})

client.login({ clientId: client_id })