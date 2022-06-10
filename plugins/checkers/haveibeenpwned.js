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
            name: "HaveIBeenPwned",
            description: "Check if the specified password is pwned.",
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
                    name: "password",
                    description: "The password to check.",
                    default: "123456",
                    required: true
                }
            ],
            disclosureDate: "2022-11-08"
        }
    }

    run(args){
        const pwnedPW = this.dependencies.pwnedPW
        const log = this.log

        return new Promise(async(resolve)=>{
            pwnedPW.check(args.password).then(count=>{
                count > 0 ? log("i", "The password is pwned.") : log("i", "The password is not pwned.")

                resolve()
            })
        })
    }
}

module.exports = Plugin