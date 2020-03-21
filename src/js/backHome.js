"use strict"


var buttonConnexion = document.getElementById("connexion");
var buttonInscription = document.getElementById("inscription");
var formInscription = document.getElementById("formInscription");
var formConnexion = document.getElementById("formConnexion");


formConnexion.style.display ="none";
formInscription.style.display ="none";
console.log(formInscription)


    
    buttonInscription.addEventListener("click", function(){
        console.log(formInscription)
        buttonConnexion.style.display = "none";
        buttonInscription.style.display = "none";
        formInscription.style.display = "flex";
    })

    buttonConnexion.addEventListener("click", function(){
        buttonConnexion.style.display = "none";
        buttonInscription.style.display = "none";
        formConnexion.style.display = "flex";
        
    })



