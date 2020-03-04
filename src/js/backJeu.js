"use strict"

var theme = window.document.getElementById("theme");
var question = window.document.getElementById("question");
var reponseA = window.document.getElementById("reponseA");
var reponseB = window.document.getElementById("reponseB");
var reponseC = window.document.getElementById("reponseC");
var reponseD = window.document.getElementById("reponseD");
var reponseFinale = window.document.getElementById("reponseFinale")
var anecdote = window.document.getElementById("anecdote");
var bouttonStart = document.getElementById("bouttonStart");


if(bouttonStart){
    bouttonStart.addEventListener("click", function(event){
        console.log("ahahaahahah")
        event.preventDefault();
        ioClient.emit("start", getCookie("room"));
    })
    }    

var questionPosée = function(questions){

    console.log(theme);
    theme.innerHTML= questions.theme;
    question.innerHTML= questions.question;
    reponseA.innerHTML= questions.propositions[0];
    reponseB.innerHTML= questions.propositions[1];
    reponseC.innerHTML= questions.propositions[2];
    reponseD.innerHTML= questions.propositions[3];         
}

var reponsePosée = function(questions){
    
    reponseFinale.innerHTML = questions.reponse;
    anecdote.innerHTML = questions.anecdote;
}



reponseA.addEventListener("click", function(){
    
})


reponseB.addEventListener("click", function(){

})


reponseC.addEventListener("click", function(){

})


reponseD.addEventListener("click", function(){
    
})