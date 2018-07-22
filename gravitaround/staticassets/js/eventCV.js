let listeClick = [];
let t = 0;
let s = 0;
let r = 0;

$(document).ready(function()
{

    $('#thomas').click(function(){
        $('#cv_thomas').toggleClass("visible");
        $('#thomas').toggleClass("whitecolor");
        t++;
        for(let i= 0; i < listeClick.length; i++){clicker(listeClick[i]); }
        listeClick = [];
        if (s %2 === 1){ $('#cv_soundouss').toggleClass("visible"); $('#soundouss').toggleClass("whitecolor"); s++;}
        else if (r %2 === 1){ $('#cv_raphael').toggleClass("visible"); $('#raphael').toggleClass("whitecolor"); r++;}

    });

    $('#soundouss').click(function(){
        $('#cv_soundouss').toggleClass("visible");
        $('#soundouss').toggleClass("whitecolor");
        s++;
        for(let i= 0; i < listeClick.length; i++){clicker(listeClick[i]); }
        listeClick = [];
        if (t %2 === 1){ $('#cv_thomas').toggleClass("visible"); $('#thomas').toggleClass("whitecolor"); t++;}
        else if (r %2 === 1){ $('#cv_raphael').toggleClass("visible"); $('#raphael').toggleClass("whitecolor"); r++;}


    });

    $('#raphael').click(function(){
        $('#cv_raphael').toggleClass("visible");
        $('#raphael').toggleClass("whitecolor");
        r++;
        for(let i= 0; i < listeClick.length; i++){clicker(listeClick[i]); }
        listeClick = [];
        if (t %2 === 1){ $('#cv_thomas').toggleClass("visible"); $('#thomas').toggleClass("whitecolor"); t++;}
        else if (s %2 === 1){ $('#cv_soundouss').toggleClass("visible"); $('#soundouss').toggleClass("whitecolor"); s++; }

    });

    $('#skillst').click(function(){
        $('#skillsitemst').toggleClass("visible");
        $('#skillst').toggleClass("whitecolor");
        listeClick.push('#skillst')

    });

    $('#formationt').click(function(){
        $('#formationitemst').toggleClass("visible");
        $('#formationt').toggleClass("whitecolor");
        listeClick.push('#formationt')

    });

    $('#experiencet').click(function(){
        $('#experienceitemst').toggleClass("visible");
        $('#experiencet').toggleClass("whitecolor");
        listeClick.push('#experiencet')
    });

    $('#contactert').click(function(){
        $('#contactitemst').toggleClass("visible");
        $('#contactert').toggleClass("whitecolor");
        listeClick.push('#contactert')
    });

    $('#skillss').click(function(){
        $('#skillsitemss').toggleClass("visible");
        $('#skillss').toggleClass("whitecolor");
        listeClick.push('#skillss')

    });

    $('#formations').click(function(){
        $('#formationitemss').toggleClass("visible");
        $('#formations').toggleClass("whitecolor");
        listeClick.push('#formations')

    });

    $('#experiences').click(function(){
        $('#experienceitemss').toggleClass("visible");
        $('#experiences').toggleClass("whitecolor");
        listeClick.push('#experiences')
    });

    $('#contacters').click(function(){
        $('#contactitemss').toggleClass("visible");
        $('#contacters').toggleClass("whitecolor");
        listeClick.push('#contacters')
    });

    $('#skillsr').click(function(){
        $('#skillsitemsr').toggleClass("visible");
        $('#skillsr').toggleClass("whitecolor");
        listeClick.push('#skillsr')

    });

    $('#formationr').click(function(){
        $('#formationitemsr').toggleClass("visible");
        $('#formationr').toggleClass("whitecolor");
        listeClick.push('#formationr')

    });

    $('#experiencer').click(function(){
        $('#experienceitemsr').toggleClass("visible");
        $('#experiencer').toggleClass("whitecolor");
        listeClick.push('#experiencer')
    });

    $('#contacterr').click(function(){
        $('#contactitemsr').toggleClass("visible");
        $('#contacterr').toggleClass("whitecolor");
        listeClick.push('#contacterr')
    });


});

function clicker(i){
    if (i === '#skillst'){
        $('#skillsitemst').toggleClass("visible");
        $('#skillst').toggleClass("whitecolor");
    }

    else if (i === '#formationt'){
        $('#formationitemst').toggleClass("visible");
        $('#formationt').toggleClass("whitecolor");
    }

    else if (i === '#experiencet'){
        $('#experienceitemst').toggleClass("visible");
        $('#experiencet').toggleClass("whitecolor");
    }

    else if (i === '#contactert'){
        $('#contactitemst').toggleClass("visible");
        $('#contactert').toggleClass("whitecolor");
    }

    else if (i === '#skillss'){
        $('#skillsitemss').toggleClass("visible");
        $('#skillss').toggleClass("whitecolor");
    }

    else if (i === '#formations'){
        $('#formationitemss').toggleClass("visible");
        $('#formations').toggleClass("whitecolor");
    }

    else if (i === '#experiences'){
        $('#experienceitemss').toggleClass("visible");
        $('#experiences').toggleClass("whitecolor");
    }

    else if (i === '#contacters'){
        $('#contactitemss').toggleClass("visible");
        $('#contacters').toggleClass("whitecolor");
    }

    else if (i === '#skillsr'){
        $('#skillsitemsr').toggleClass("visible");
        $('#skillsr').toggleClass("whitecolor");
    }

    else if (i === '#formationr'){
        $('#formationitemsr').toggleClass("visible");
        $('#formationr').toggleClass("whitecolor");
    }

    else if (i === '#experiencer'){
        $('#experienceitemsr').toggleClass("visible");
        $('#experiencer').toggleClass("whitecolor");
    }

    else if (i === '#contacterr'){
        $('#contactitemsr').toggleClass("visible");
        $('#contacterr').toggleClass("whitecolor");
    }

}