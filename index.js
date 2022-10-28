(async()=>{
    "use strict";

    // Dependencies
    const log = require("simple-node-logger").createSimpleLogger("./logs/errors.log")
    const YourN3xtModule = require("./modules/yourn3xt")
    const rra = require("recursive-readdir-async")
    const parallelPark = require("parallel-park")
    const PythonShell = require("python-shell")
    const readLine = require("readline-sync")
    const shellQuote = require("shell-quote")
    const request = require("request-async")
    const columnify = require("columnify")
    const puppeteer = require("puppeteer")
    const minimist = require("minimist")
    const pwnedPW = require("pwned-pw")
    const shellJS = require("shelljs")
    const sha256 = require("sha256")
    const chalk = require("chalk")
    const _ = require("lodash")
    const fs = require("fs")

    // Variables
    const settings = require("./settings.json")

    var YourN3xt = {
        plugins: {
            loaded: [],
            plugins: await rra.list("./plugins", { recursive: true, extensions: true, realPath: true }, function(obj){
                if(obj.extension !== ".js") return true
            }),
            counts: {}
        },
        core: {
            platforms: {
                win: "windows",
                lin: "linux",
                uni: "unix",
                ubu: "ubuntu"
            },
            arch: {
                x86: "x86",
                x64: "x64",
                both: "x86-x64"
            }
        },
        status: {
            errors: 0
        },
        version: "1.0.0-beta"
    }

    const global = {
        plugin: {
            info: { arch: YourN3xt.core.arch, platforms: YourN3xt.core.platforms },
            dependencies: { _, chalk, fs, readLine, puppeteer, request, PythonShell, sha256, parallelPark, pwnedPW },
            portables: {},
            options: null
        }
    }

    // Functions
    YourN3xt.log = function(type, message){
        if(type === "i"){
            console.log(`${chalk.gray(settings.log.style.left) + chalk.blueBright(settings.log.prefixes.information) + chalk.gray(settings.log.style.right)} ${message}`)
        }else if(type === "w"){
            console.log(`${chalk.gray(settings.log.style.left) + chalk.yellowBright(settings.log.prefixes.warning) + chalk.gray(settings.log.style.right)} ${message}`)
        }else if(type === "e"){
            console.log(`${chalk.gray(settings.log.style.left) + chalk.red(settings.log.prefixes.error) + chalk.gray(settings.log.style.right)} ${message}`)
        }else if(type === "c"){
            console.log(`${chalk.gray(settings.log.style.left) + chalk.redBright(settings.log.prefixes.critical) + chalk.gray(settings.log.style.right)} ${message}`)
        }
    }

    YourN3xt.banner = function(){
        YourN3xtModule.randomBanner(chalk, { version: YourN3xt.version, status: YourN3xt.status, counts: YourN3xt.plugins.counts })

        YourN3xt.checkVersion()
    }

    YourN3xt.checkVersion = async function(){
        try{
            var versions = await request("https://hanaui.vercel.app/api/github/repos/info")
            versions = _.find(JSON.parse(versions.body), { name: "YourN3xt" }).versions
            
            for( const version of versions ) if(YourN3xt.version < version) YourN3xt.log("w", "New version detected. Please check https://github.com/hanaui-git/yourn3xt\n")
        }catch{
            YourN3xt.log("e", "Unable to check YourN3xt versions.")
        }
    

        YourN3xt.navigation()
    }

    YourN3xt.callbackFaline = function(plugin, callback){
        if(plugin){
            callback(plugin)
        }else{
            callback()
        }
    }

    YourN3xt.showLoadedPlugins = function(){
        console.log()
        console.log(columnify(YourN3xt.plugins.loaded, {
            columns: ["name", "path", "disclosureDate", "description"],
            minWidth: 25,
            config: {
                name: {
                    headingTransform: function(){
                        return "Name"
                    }
                },
                path: {
                    headingTransform: function(){
                        return "Path"
                    }
                },
                disclosureDate: {
                    headingTransform: function(){
                        return "Disclosure"
                    }
                },
                description: {
                    headingTransform: function(){
                        return "Description"
                    }
                }
            }
        }))
        console.log()
    }

    YourN3xt.setOptions = function(pluginInfo){
        for( const option in global.plugin.options ){
            if(!global.plugin.options[option].hasOwnProperty("default")) global.plugin.options[option].default = null
            if(!global.plugin.options[option].hasOwnProperty("required")) global.plugin.options[option].required = false

            global.plugin.options[option].name = global.plugin.options[option].name.toLowerCase()
            global.plugin.options[option].set = null
            global.plugin.options[option].from = pluginInfo.path
        }
    }

    YourN3xt.faline = async function(plugin, command, callback){
        const commandArgs = command.split(" ")

        var pluginInfo;

        if(plugin){
            pluginInfo = plugin.fullInfo

            if(global.plugin.options){
                if(global.plugin.options[0].from !== pluginInfo.path){
                    global.plugin.options = pluginInfo.options

                    YourN3xt.setOptions(pluginInfo)
                }
            }else{
                global.plugin.options = pluginInfo.options

                YourN3xt.setOptions(pluginInfo)
            }
        }

        if(command === "help"){
            console.log(`
General Commands
================

    Command                     Description
    -------                     -----------
    help                        Show this.
    use                         Use the specified plugin.
    plugins                     Show the loaded plugins.
    version                     Show this current YourN3xt version.
    exit                        Exit Yunna.

Plugin Commands
===============
    Command                     Description
    -------                     -----------
    run                         Run plugin.
    options                     Show plugin options.
    info                        Show plugin information.
            `)
        }else if(commandArgs[0] === "run" && plugin){
            var args = {}

            for( const option of global.plugin.options ) args[option.name] = option.set ? option.set : option.default

            await plugin.run(args)
        }else if(commandArgs[0] === "info" && plugin){
            console.log(`
Name: ${pluginInfo.name}
Description: ${pluginInfo.description}
Path: ${pluginInfo.path}
Authors: ${pluginInfo.authors.join(", ")}
Portable: ${pluginInfo.hasOwnProperty("portable") ? "Yes" : "No"}
Disclosure Date: ${pluginInfo.hasOwnProperty("disclosureDate") ? pluginInfo.disclosureDate : "None"}
Created Date: ${pluginInfo.hasOwnProperty("createdDate") ? pluginInfo.createdDate : "None"}

Aliases: ${pluginInfo.hasOwnProperty("aliases") ? pluginInfo.aliases.join(", ") : "None"}
Platforms: ${pluginInfo.hasOwnProperty("platforms") ? pluginInfo.platforms.join(", ") : "None"}
Arch: ${pluginInfo.hasOwnProperty("arch") ? pluginInfo.arch : "None"}

Full Path: ${pluginInfo.fullPath}
            `)
        }else if(command === "options" && plugin){
            console.log()
            console.log(columnify(global.plugin.options, {
                columns: ["name", "default", "set", "required", "description"],
                minWidth: 16,
                config: {
                    name: {
                        headingTransform: function(){
                            return "Name"
                        }
                    },
                    default: {
                        headingTransform: function(){
                            return "Default"
                        }
                    },
                    set: {
                        headingTransform: function(){
                            return "Set"
                        }
                    },
                    required: {
                        headingTransform: function(){
                            return "Required"
                        },
                        dataTransform: function(data){
                            return data ? chalk.greenBright("Yes") : chalk.redBright("No")
                        }
                    },
                    description: {
                        headingTransform: function(){
                            return "Description"
                        }
                    }
                }
            }))
            console.log()
        }else if(commandArgs[0] === "set" && plugin){
            var args = commandArgs.slice(1).join(" ")

            args = minimist(shellQuote.parse(args), { string: ["name", "value"] })

            const name = args.name
            const value = args.value
            
            if(!_.find(global.plugin.options, { name: name })) {
                YourN3xt.log("i", "usage: set --name <name> --value <value>")
                return YourN3xt.callbackFaline(plugin, callback)
            }

            if(YourN3xtModule.isArgsEmpty({ name: name, value: value, default: _.find(global.plugin.options, { name: name }) }).default){
                YourN3xt.log("i", "usage: set --name <name> --value <value>")
                return YourN3xt.callbackFaline(plugin, callback)
            }

            for( const option in global.plugin.options ) if(global.plugin.options[option].name === name){
                global.plugin.options[option].set = value
            }

            YourN3xt.log("i", `Value successfully set to ${name}`)
        }else if(commandArgs[0] === "use"){
            const pluginPath = commandArgs[1]

            if(!commandArgs[1]){
                YourN3xt.log("i", "usage: use <pluginPath>")
                return YourN3xt.callbackFaline(plugin, callback)
            }

            plugin = _.find(YourN3xt.plugins.loaded, { path: pluginPath })

            if(plugin){
                global.plugin.info.fullInfo = plugin

                plugin = require(plugin.fullPath)
                plugin = new plugin(YourN3xt.log, global.plugin.info, global.plugin.dependencies, global.plugin.portables)

                YourN3xt.pluginNavigation(plugin)
                return
            }else{
                YourN3xt.log("e", "Invalid pluginPath.")
            }

            return YourN3xt.callbackFaline(plugin, callback)
        }else if(command === "errors"){
            console.log()
            console.log(fs.readFileSync("./logs/errors.log", "utf8"))
            console.log()
        }else if(command === "plugins"){
            YourN3xt.showLoadedPlugins()
        }else if(command === "version"){
            YourN3xt.log("i", `Your YourN3xt current version is ${YourN3xt.version}`)
        }else if(command === "exit"){
            process.exit()
        }else{
            const results = shellJS.exec(command, { silent: true })

            results.stdout ? console.log(results.stdout) : YourN3xt.log("e", "Unrecognized command.")
        }

        YourN3xt.callbackFaline(plugin, callback)
    }

    YourN3xt.pluginNavigation = function(plugin){
        const command = readLine.question(`yourn3xt(${chalk.redBright(plugin.fullInfo.path)}) ${settings.cli.navigationStyle} `)

        YourN3xt.faline(plugin, command, YourN3xt.pluginNavigation)
    }

    YourN3xt.navigation = function(){
        const command = readLine.question(`yourn3xt ${settings.cli.navigationStyle} `)

        YourN3xt.faline(null, command, YourN3xt.navigation)
    }

    YourN3xt.log("i", "Loading plugins, please wait.")

    for( const dir of fs.readdirSync("./plugins") ){
        const counts = YourN3xt.plugins.counts

        if(!counts.hasOwnProperty(dir)) YourN3xt.plugins.counts[dir] = 0
    }
    
    for( const loadedPlugin of YourN3xt.plugins.plugins ){
        try{
            var plugin = require(loadedPlugin.fullname)
            const path = loadedPlugin.fullname

            plugin = new plugin(YourN3xt.log, global.plugin.info, global.plugin.dependencies, global.plugin.portables).info()

            if(plugin.hasOwnProperty("name") && plugin.hasOwnProperty("description") && plugin.hasOwnProperty("options") && plugin.hasOwnProperty("disclosureDate")){
                plugin.path = path.slice(path.indexOf("YourN3xt/plugins")+17, path.length).replace(".js", "")
                plugin.fullPath = loadedPlugin.fullname
    
                const rootDir = plugin.path.match(/^.*?\//g)[0].replace(/\//g, "")
    
                if(YourN3xt.plugins.counts.hasOwnProperty(rootDir)) YourN3xt.plugins.counts[rootDir]++
    
                if(plugin.hasOwnProperty("portable")){
                    const portable = plugin.portable
    
                    var portablePlugin = require(loadedPlugin.fullname)
                    portablePlugin = new portablePlugin(YourN3xt.log, global.plugin.info, global.plugin.dependencies, global.plugin.portables)
    
                    if(!global.plugin.portables.hasOwnProperty(portable.type)) global.plugin.portables[portable.type] = {}
    
                    global.plugin.portables[portable.type][portable.name] = portablePlugin
                }
                
                YourN3xt.plugins.loaded.push(plugin)
            }else{
                log.error(`Unable to load plugin. Plugin: ${loadedPlugin.fullname}`)
                YourN3xt.status.errors++
            }
        }catch(err){
            log.error(`Unable to load plugin. Plugin: ${loadedPlugin.fullname} | Error: ${err}`)
            YourN3xt.status.errors++
        }
    }

    if(!YourN3xt.plugins.plugins.length) return YourN3xt.log("c", "Something went wrong, no plugins found.")

    setTimeout(function(){
        console.clear()
        YourN3xt.banner()
    }, 1000)
})()