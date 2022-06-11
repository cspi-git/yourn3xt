// Main
class Plugin {
    constructor(log, info, dependencies){
        this.log = log
        this.platforms = info.platforms
        this.arch = info.arch
        this.fullInfo = info.fullInfo
        this.dependencies = dependencies
    }

    info(){
        return {
            name: "Server Information Grabber",
            description: "The name already explained it.",
            authors: [
                "I2rys"
            ],
            references: [
                "https://github.com/OTAKKATO/ZeroDiscord/tree/main/serverInformationGrabber"
            ],
            platforms: [
                this.platforms.win
            ],
            arch: this.arch.both,
            options: [
                {
                    name: "token",
                    description: "Discord account token to use.",
                    required: true
                },
                {
                    name: "serverID",
                    description: "The target server(ID).",
                    required: true
                }
            ],
            disclosureDate: "2022-05-07"
        }
    }

    run(args){
        const request = this.dependencies.request

        return new Promise(async(resolve)=>{
            var response = await request(`https://discord.com/api/v6/guilds/${args.serverid}`, {
                headers: {
                    authorization: args.token
                }
            })
        
            response = JSON.parse(response.body)
        
            console.log(`
Server icon: https://cdn.discordapp.com/icons/${response.id}/${response.icon}.png
Server splash: ${response.splash}
Server discovery splash: ${response.discovery_splash}
Server id: ${response.id}
Server name: ${response.name}
Server description: ${response.description}
Server vanity: ${response.vanity_url_code}
Server owner id: ${response.owner_id}
Server verification level: ${response.verification_level}

Server emojis amount: ${response.emojis.length}
Server stickers amount: ${response.stickers.length}
Server roles amount: ${response.roles.length}
`)
            resolve()
        })
    }
}

module.exports = Plugin