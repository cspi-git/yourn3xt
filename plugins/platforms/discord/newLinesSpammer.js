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
            name: "New Lines Spammer",
            description: "Spams a lot's of new lines in the specified Discord server channel.",
            authors: [
                "I2rys"
            ],
            references: [
                "https://github.com/OTAKKATO/ZeroDiscord/tree/main/multiLineSpammer"
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
                    name: "channelID",
                    description: "The target channel(ID).",
                    required: true
                },
                {
                    name: "amount",
                    description: "The amount of spamming new lines.",
                    required: true
                }
            ],
            disclosureDate: "2022-05-07"
        }
    }

    run(args){
        const request = this.dependencies.request
        const log = this.log

        return new Promise((resolve)=>{
            function createPayload(amount){
                var result = ""
            
                for( let i = 0; i <= amount; i++ ) result += "\n"
            
                return result
            }

            async function spamPayload(i){
                if(i === args.amount){
                    log("i", "Finished!")
                    return resolve()
                }
                
                var response = await request.post(`https://discord.com/api/v9/channels/${args.channelid}/messages`, {
                    headers: {
                        "content-type": "application/json",
                        authorization: args.token
                    },
                    body: JSON.stringify({ content: `\nLOL${createPayload(500)}LOL\n`, nonce: `AAAAAAAAA${Math.floor(Math.random() * 9999999999)}` })
                })

                response = JSON.parse(response.body)

                if(response.hasOwnProperty("retry_after")) return setTimeout(()=>{
                    spamPayload(i)
                }, response.retry_after)

                log("i", "Payload sent.")
            }


            for( let i = 0; i < +args.amount; i++ ) spamPayload(i)
        })
    }
}

module.exports = Plugin