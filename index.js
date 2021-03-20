
const cheerio = require('cheerio');
const fetch = require('node-fetch');
const jsonFile = require('jsonfile');
const cheerioModule = require('cheerio');

armas = [];
armasMelee = [];
armasStationary = [];
granadas = [];
uGranadas = [];
extra = [];

baseUrl="https://escapefromtarkov.gamepedia.com"

var cont_armas;
var cont_armasStationary;
var cont_armasMelee;
var cont_granadas;
var cont_uGranadas;


init();
//loquesea();

/*async function loquesea(){

    await init();

    for ()
    if(!extra.includes(armasData.extra)){
        extra.push(armasData.extra)

        //Crear nuevo Extra en la BD
        fetch('http://localhost:8080/api/extras/', {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(armasData.extra)
     });

    }
}*/


async function getSimplePage(webpage){

    var web = await fetch(webpage)
    
    return await web.text();

}

async function weaponScrapp(href){
    var web = await fetch(href);
    
    var html = await web.text();
    
    var $ = cheerio.load(html);

    var type = $('#va-infobox0-content > td > table:nth-child(3) > tbody > tr:nth-child(4) > td:nth-child(3) > a').text();
   
    var extra = {type:type};
    
    return extra
}

async function imprimirArmas(){
    console.log(this.armas)
    console.log(this.armasStationary)
    console.log(this.armasMelee)
    console.log(this.granadas)
    console.log(this.uGranadas)
      
 //writeJsons();
}



//Función principal en la que se realiza el scrapping
async function init(){

    //Inicializamos todos los contadores a 0
    cont_armas = 0;
    cont_armasStationary = 0;
    cont_armasMelee = 0;
    cont_granadas = 0;
    cont_uGranadas = 0;

    //Cargamos la web
    var web = await getSimplePage(baseUrl+"/Weapons");
    var $ = cheerio.load(web);

    var tabla_armas;
    var tabla_armasStationary;
    var tabla_armasMelee;
    var tabla_granadas;
    var tabla_uGranadas;

    //Tabla de armas de fuego normales
    tabla_armas = $('#mw-content-text > div > table:nth-child(n+6):nth-child(-n+24) > tbody > tr');
   
    tabla_armas.each(async (index, element) => {
        
       if($(element).find('td:first-child > a').text() == ''){
           cont_armas++;
           return;
       }
       
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
        var href = $(element).find('td:first-child > a').attr("href");
        var armasData = {nombre:nombre, image: img, cartidge: cartidge, firingModes: firingModes, rateFire:rateFire, description:description, href:baseUrl+href};
        
        
        
        armasData.extra = await weaponScrapp(armasData.href);

       // if (!extra.has(armasData.extra)){
       
        extra.push(armasData.extra)
        //

        
        //En caso de que no exista el Extra recien descubierto, lo creamos y guardamos para no repetirlo
        
       /* if(!extra.includes(armasData.extra)){
            extra.push(armasData.extra)
    
            //Crear nuevo Extra en la BD
            fetch('http://localhost:8080/api/extras/', {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(armasData.extra)
         });
    
        }else {
            print("No estoy dentro")
        } */
        
        //Crear nueva Arma en la BD
       /* fetch('http://localhost:8080/api/extras', {
         method: "POST",
         headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: "foo",
                password: "bar"
            })
        });*/

        //Plan maestro: cambiar "arraylist" por array e insertar valores en la posición correspondiente a index, de forma que se quede ordenado 100% seguro
       
        this.armas[index] = armasData;
       
        cont_armas++; 
        //console.log(cont_armas + " / "+tabla.length)
        //console.log(cont_armas)

       //Solo escribimos el JSON en caso de que estemos en la ultima iteración real (ya que trabajamos de forma asíncrona, usamos el contador para descubrirla)
        if(cont_armas == tabla_armas.length){
            //var file = './temp/armas.json'

            console.log("Estoy dentro")
            

            var limpio = armas.filter(function (el) {
                return el != null;
              });

            /*jsonFile.writeFile(file, limpio, {spaces: 2}).then(res => {
               console.log("Armas write complete")
           }).catch(error => console.error(error))*/
         
           unicos = [];
           for(var i= 0; i< extra.length; i++){

           /* fetch('http://localhost:8080/api/extras/', {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(cosos.next())
            });*/

           
          
            if(!unicos[i].find(el -> el.type == extra[i].type))
            {
                unicos.push(extra[i])
            }

         


           }
           for(var i= 0; i< unicos.length; i++){
            fetch('http://localhost:8080/api/extras/', {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(unicos[i])
            });
           }



        }
  
    //console.log(index);

    }) 

    //Tabla de armas estacionarias
    tabla_armasStationary = $('#mw-content-text > div > table:nth-child(n+26):nth-child(-n+28) > tbody > tr');
   
    tabla_armasStationary.each(async (index, element)=>{
        if($(element).find('td:first-child > a').text() == ''){
            //cont_armasStationary++;
            return;
        }
        
        var nombre = $(element).find('td:first-child > a').text();
        
        var img = $(element).find('th > a > img').attr("src");
        var cartidge = $(element).find('td:nth-child(3) > a').text();
        var firingModes = $(element).find('td:nth-child(4) ').text();
        var rateFire = $(element).find('td:nth-child(5)').text();
        var href = $(element).find('td:first-child > a').attr("href")
        var armasData = {nombre:nombre, image: img, cartidge: cartidge, firingModes: firingModes, rateFire:rateFire, href:baseUrl+href};
        armasData.extra = await weaponScrapp(armasData.href);
        
        //this.armasStationary[index] = armasData;
         
        //cont_armasStationary++;
        //Solo escribimos el JSON en caso de que estemos en la ultima iteración real (ya que trabajamos de forma asíncrona, usamos el contador para descubrirla)
         /*if(cont_armasStationary == tabla_armasStationary.length){
             var file = './temp/armasS.json'
 
             var limpio = armasStationary.filter(function (el) {
                return el != null;
              });

             jsonFile.writeFile(file, limpio, {spaces: 2}).then(res => {
                console.log("Armas Stationary write complete")
            }).catch(error => console.error(error))
         }*/

    })
   
    //this.armasStationary.shift();
    //this.armasStationary.splice(1,1)
    

    

    tabla_armasMelee = $('#mw-content-text > div > table:nth-child(30) > tbody > tr');
    tabla_armasMelee.each(async (index, element)=>{
        if($(element).find('td:first-child > a').text() == ''){
            //cont_armasMelee++;
            return;
        }
       
        var nombre = $(element).find('td:first-child > a').text();
        var img = $(element).find('th > a > img').attr("src");
        var chopDmg = $(element).find('td:nth-child(3)').text();
        var chopRange = $(element).find('td:nth-child(4)').text();
        var stabDmg = $(element).find('td:nth-child(5)').text();
        var stabRange = $(element).find('td:nth-child(6)').text();
        var description = $(element).find('td:nth-child(7)').text();
        var href = $(element).find('td:first-child > a').attr("href")
        var armasData = {nombre:nombre, image: img, chopDmg: chopDmg, chopRange: chopRange, stabDmg:stabDmg,stabRange:stabRange, description:description, href:baseUrl+href};
        armasData.extra = await weaponScrapp(armasData.href);
       
       // this.armasMelee[index] = armasData;

         
        //cont_armasMelee++;
        //Solo escribimos el JSON en caso de que estemos en la ultima iteración real (ya que trabajamos de forma asíncrona, usamos el contador para descubrirla)
         /*if(cont_armasMelee == tabla_armasMelee.length){
             var file = './temp/armasMelee.json'
 
             var limpio = armasMelee.filter(function (el) {
                return el != null;
              });

             jsonFile.writeFile(file, limpio, {spaces: 2}).then(res => {
                console.log("Armas melee write complete")
            }).catch(error => console.error(error))
         }*/
    })

    //this.armasMelee.shift();
    tabla_granadas = $('#mw-content-text > div > table:nth-child(33) > tbody > tr');

    tabla_granadas.each(async (index, element)=>{
        if($(element).find('td:first-child > a').text() == ''){
            //cont_granadas++;
            return;
        }
       
        var nombre = $(element).find('td:first-child > a').text();
        var img = $(element).find('th > a > img').attr("src");
        var expDelay = $(element).find('td:nth-child(3)').text();
        var expRadius = $(element).find('td:nth-child(4)').text();
        var maxDmg = $(element).find('td:nth-child(5)').text();
        var frag = $(element).find('td:nth-child(6)').text();
        var description = $(element).find('td:nth-child(7)').text();
        var href = $(element).find('td:first-child > a').attr("href")
        var granada = {nombre:nombre, image: img, expDelay: expDelay, expRadius: expRadius, maxDmg:maxDmg,frag:frag, description:description, href:baseUrl+href};
        granada.extra = await weaponScrapp(granada.href);

        //this.granadas[index] = granada;
         
        //cont_granadas++;
        //Solo escribimos el JSON en caso de que estemos en la ultima iteración real (ya que trabajamos de forma asíncrona, usamos el contador para descubrirla)
         /*if(cont_granadas == tabla_granadas.length){
             var file = './temp/granadas.json'
            
             var limpio = granadas.filter(function (el) {
                return el != null;
              });

             jsonFile.writeFile(file, limpio, {spaces: 2}).then(res => {
                console.log("Granadas write complete")
            }).catch(error => console.error(error))
         }*/
        
    })

    //this.granadas.shift();

    tabla_uGranadas = $('#mw-content-text > div > table:nth-child(n+35):nth-child(-n+37) > tbody > tr')

    tabla_uGranadas.each(async (index, element)=>{
        if($(element).find('td:first-child > a').text() == ''){
            //cont_uGranadas++;
            return;
        }
        
        
        var nombre = $(element).find('td:first-child > a').text();
        var img = $(element).find('th > a > img').attr("src");
        var expDelay = $(element).find('td:nth-child(3)').text();
        var description = $(element).find('td:nth-child(7)').text();
        var href = $(element).find('td:first-child > a').attr("href")
        
        var granada = {nombre:nombre, image: img, expDelay: expDelay, description:description, href:baseUrl+href};
       // granada.extra = await weaponScrapp(granada.href);

       // this.uGranadas[index] = granada;

        
        //Solo escribimos el JSON en caso de que estemos en la ultima iteración real (ya que trabajamos de forma asíncrona, usamos el contador para descubrirla)
         /*if(cont_uGranadas == tabla_uGranadas.length){
             var file = './temp/uGranadas.json'

             var limpio = uGranadas.filter(function (el) {
                return el != null;
              });
 
             jsonFile.writeFile(file, limpio, {spaces: 2}).then(res => {
                console.log("Utilidad Granadas write complete")
            }).catch(error => console.error(error))
         }*/
        })

}


