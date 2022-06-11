"use strict";

// Dependencies
const _ = require("lodash")

// Variables
const facts = require("../database/facts.json")

var YourN3xt = {}

// Functions
function status(chalk, info){
    const counts = info.counts

    console.log(`         ⥚- ${chalk.blueBright(`YourN3xt v${info.version}`)}`)

    console.log()
    console.log("         Plugins:")
    Object.keys(counts).forEach(name =>{
        console.log(`         ⥚- ${_.capitalize(name)} -> ${counts[name]}`)
    })

    console.log()
    console.log("         Status:")
    console.log(`         ⥚- Errors encountered: ${info.status.errors ? info.status.errors : "None" }`)

    console.log()
    console.log(`   "${facts[Math.floor(Math.random() * facts.length)]}"`)
    console.log()
}

function mainBanner(chalk, info){
    console.log(chalk.redBright(`
             ......................         
      .............................     
    ..........             .........    
    .........               ........    
    .....                      .....    
    .....                      .....    
    .....                      .....    
    .....   ................   .....    
    .........     ....     .........    
.   ......        ....        ......   .
   ......        ......        .....    
     ....                      ....     
     .....                    .....     
      .....                  .....      
       ......              ......       
         ......          ......         
           .......    .......           
             ..............             
                ........                
                  ....                  

    `))

    status(chalk, info)
}

// Main
YourN3xt.randomBanner = function(chalk, counts){
    const banners = [mainBanner]
    
    banners[Math.floor(Math.random() * banners.length)](chalk, counts)
}

YourN3xt.isArgsEmpty = function(args){
    var empty = true

    if(args.default){
      if(args.name !== true && args.value !== true) empty = false
    }else{
      if(args.name && args.value) empty = false
    }

    return empty
}

module.exports = YourN3xt