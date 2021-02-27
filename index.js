
const cheerio = require('cheerio');
const fetch = require('node-fetch');
const puppeteer = require('puppeteer');
const jsonFile = require('jsonfile');

armas = [];
armasMelee = [];
armasStationary = [];
granadas = [];
uGranadas = [];
init()

async function getSimplePage(webpage){

    var web = await fetch(webpage)
    
    return await web.text();

}

async function imprimirArmas(){
    console.log(this.armas)
    console.log(this.armasStationary)
    console.log(this.armasMelee)
    console.log(this.granadas)
    console.log(this.uGranadas)
}

async function init(){
    var web = await getSimplePage("https://escapefromtarkov.gamepedia.com/Weapons");
    var $ = cheerio.load(web);
    var tabla = $('#mw-content-text > div > table:nth-child(n+6):nth-child(-n+24) > tbody > tr');

    tabla.each((index, element) => {
       if($(element).find('td:first-child > a').text() == '')
       return;
       
        var nombre = $(element).find('td:first-child > a').text();
        if($(element).find('th > a > img').attr("src") != undefined){
           var img = $(element).find('th > a > img').attr("src"); 
        }
        else if($(element).find('td > p > a > img').attr("src") != undefined){
            var img = $(element).find('td > p > a > img').attr("src");  
        }
        else{
            var img = $(element).find('th > div > a > img').attr("src");  
        }

        var cartidge = $(element).find('td:nth-child(3) > a').text();
        var firingModes = $(element).find('td:nth-child(4) ').text();
        var rateFire = $(element).find('td:nth-child(5)').text();
        var description = $(element).find('td:nth-child(6)').text();
        var armasData = {nombre:nombre, image: img, cartidge: cartidge, firingModes: firingModes, rateFire:rateFire, description:description};

        this.armas.push(armasData)

    })
    this.armas.slice(1,this.armas.length)
    tabla = $('#mw-content-text > div > table:nth-child(n+26):nth-child(-n+28) > tbody > tr');
   
    tabla.each((index, element)=>{
        var nombre = $(element).find('td:first-child > a').text();
        
        var img = $(element).find('th > a > img').attr("src");
        var cartidge = $(element).find('td:nth-child(3) > a').text();
        var firingModes = $(element).find('td:nth-child(4) ').text();
        var rateFire = $(element).find('td:nth-child(5)').text();
        var armasData = {nombre:nombre, image: img, cartidge: cartidge, firingModes: firingModes, rateFire:rateFire};
        this.armasStationary.push(armasData);
    })
   
    this.armasStationary.shift();
    this.armasStationary.splice(1,1)
    
    tabla = $('#mw-content-text > div > table:nth-child(30) > tbody > tr');
    tabla.each((index, element)=>{
        var nombre = $(element).find('td:first-child > a').text();
        var img = $(element).find('th > a > img').attr("src");
        var chopDmg = $(element).find('td:nth-child(3)').text();
        var chopRange = $(element).find('td:nth-child(4)').text();
        var stabDmg = $(element).find('td:nth-child(5)').text();
        var stabRange = $(element).find('td:nth-child(6)').text();
        var description = $(element).find('td:nth-child(7)').text();
        var armasData = {nombre:nombre, image: img, chopDmg: chopDmg, chopRange: chopRange, stabDmg:stabDmg,stabRange:stabRange, description:description};
        this.armasMelee.push(armasData);
    })
    this.armasMelee.shift();
    tabla = $('#mw-content-text > div > table:nth-child(33) > tbody > tr');

    tabla.each((index, element)=>{
        var nombre = $(element).find('td:first-child > a').text();
        var img = $(element).find('th > a > img').attr("src");
        var expDelay = $(element).find('td:nth-child(3)').text();
        var expRadius = $(element).find('td:nth-child(4)').text();
        var maxDmg = $(element).find('td:nth-child(5)').text();
        var frag = $(element).find('td:nth-child(6)').text();
        var description = $(element).find('td:nth-child(7)').text();
        var granada = {nombre:nombre, image: img, expDelay: expDelay, expRadius: expRadius, maxDmg:maxDmg,frag:frag, description:description};
        this.granadas.push(granada);
    })

    this.granadas.shift();

    tabla = $('#mw-content-text > div > table:nth-child(n+35):nth-child(-n+37) > tbody > tr')

    tabla.each((index, element)=>{
        var nombre = $(element).find('td:first-child > a').text();
        var img = $(element).find('th > a > img').attr("src");
        var expDelay = $(element).find('td:nth-child(3)').text();
        var description = $(element).find('td:nth-child(7)').text();
        var granada = {nombre:nombre, image: img, expDelay: expDelay, description:description};
        this.uGranadas.push(granada);
    })

    
    this.uGranadas.shift();
    this.uGranadas.splice(1,1)
    

    var file = './temp/armas.json'

    jsonFile.writeFile(file, armas, {spaces: 2}).then(res => {
        console.log("Armas write complete")
    }).catch(error => console.error(error))

    file = './temp/armasS.json'

    jsonFile.writeFile(file, armasStationary, {spaces: 2}).then(res => {
        console.log("Armas stationary write complete")
    }).catch(error => console.error(error))

    file = './temp/armasMelee.json'

    jsonFile.writeFile(file, armasMelee, {spaces: 2}).then(res => {
        console.log("Armas melee write complete")
    }).catch(error => console.error(error))
    
    file = './temp/granadas.json'
    jsonFile.writeFile(file, granadas, {spaces: 2}).then(res => {
        console.log("Granadas write complete")
    }).catch(error => console.error(error))


    file = './temp/uGranadas.json'
    jsonFile.writeFile(file, uGranadas, {spaces: 2}).then(res => {
        console.log("Utility granadas write complete")
    }).catch(error => console.error(error))
    
    //await imprimirArmas();


}

