$(document).ready(function()
{

    $('#en').click(function(){
        document.getElementById("title").innerHTML = "Gravit\'Around";
        document.getElementById("globe").innerHTML = "Globe";
        document.getElementById("favourites").innerHTML = "Favourites";
        document.getElementById("register").innerHTML = "Register";
        document.getElementById("contact").innerHTML = "Contact";
        footer.innerHTML = "&copy All rights reserved ENAC";

        if (document.location.href === "http://127.0.0.1:8000/gravitaround/" ||
            document.location.href === "http://127.0.0.1:8000/" ){
            document.getElementById("rechercheBar").placeholder= "Research a satellite..." ;
            document.getElementById("recherchePaysBar").placeholder= "Search a country..." ;
            document.getElementById("updateButton").value= "Update" ;
            document.getElementById("supprimerButton").value= "Delete all" ;
            document.getElementById("afficherButton").value= "All" ;
            document.getElementById("activateTrajectory").value= "Trajectory" ;
            document.getElementById("Localisation").value= "Locate Me" ;
            document.getElementById("AfficherBeidouButton").value= "Beidou" ;
            document.getElementById("AfficherLEOButton").value= "LEO" ;
            document.getElementById("AfficherMEOButton").value= "MEO" ;
            document.getElementById("AfficherGEOButton").value= "GEO" ;
            document.getElementById("AfficherHEOButton").value= "HEO" ;
            document.getElementById("AfficherGalileoButton").value= "Galileo" ;
            document.getElementById("AfficherGeodeticButton").value= "Geodetic" ;
            document.getElementById("AfficherGOESButton").value= "GOES" ;
            document.getElementById("AfficherNOAAButton").value= "NOAA" ;
            document.getElementById("AfficherGPSButton").value= "GPS" ;
            document.getElementById("AfficherWeatherButton").value= "Weather" ;
            document.getElementById("AfficherSESButton").value= "Space and Earth Science" ;
            document.getElementById("AfficherSpaceStationsButton").value= "Space Stations" ;
            document.getElementById("AfficherEngineeringButton").value= "Engineering" ;
            document.getElementById("AfficherCubeSatsButton").value= "CubeSats" ;
            document.getElementById("AfficherISSButton").value= "ISS" ;
            document.getElementById("AfficherIridiumButton").value= "Iridium" ;
            document.getElementById("research").innerHTML= "Research" ;
            document.getElementById("researchCountries").innerHTML= "Countries" ;
            document.getElementById("orbit").innerHTML= "Orbit" ;
            document.getElementById("navigation").innerHTML= "Navigation" ;
            document.getElementById("others").innerHTML= "Others" ;
        }


    });

    $('#fr').click(function(){
        document.getElementById("title").innerHTML = "Gravit\'Around";
        document.getElementById("globe").innerHTML = "Globe";
        document.getElementById("favourites").innerHTML = "Favoris";
        document.getElementById("register").innerHTML = "Se connecter";
        document.getElementById("contact").innerHTML = "Contact";
        footer.innerHTML = " &copy Tous droits réservés.";

        if (document.location.href === "http://127.0.0.1:8000/gravitaround/" ||
            document.location.href === "http://127.0.0.1:8000/" ){
            document.getElementById("rechercheBar").placeholder= "Cherchez un satellite..." ;
            document.getElementById("recherchePaysBar").placeholder= "Cherchez un pays..." ;
            document.getElementById("updateButton").value= "Mise à jour" ;
            document.getElementById("supprimerButton").value= "Nettoyer" ;
            document.getElementById("afficherButton").value= "Tout" ;
            document.getElementById("activateTrajectory").value= "Trajectoires" ;
            document.getElementById("Localisation").value= "Ma position" ;
            document.getElementById("AfficherBeidouButton").value= "Beidou" ;
            document.getElementById("AfficherLEOButton").value= "LEO" ;
            document.getElementById("AfficherMEOButton").value= "MEO" ;
            document.getElementById("AfficherGEOButton").value= "GEO" ;
            document.getElementById("AfficherHEOButton").value= "HEO" ;
            document.getElementById("AfficherGalileoButton").value= "Galileo" ;
            document.getElementById("AfficherGeodeticButton").value= "Geodétique" ;
            document.getElementById("AfficherGOESButton").value= "GOES" ;
            document.getElementById("AfficherNOAAButton").value= "NOAA" ;
            document.getElementById("AfficherGPSButton").value= "GPS" ;
            document.getElementById("AfficherWeatherButton").value= "Météo" ;
            document.getElementById("AfficherSESButton").value= "Biologie et Spatiale" ;
            document.getElementById("AfficherSpaceStationsButton").value= "Stations spatiales" ;
            document.getElementById("AfficherEngineeringButton").value= "Ingénierie" ;
            document.getElementById("AfficherCubeSatsButton").value= "Nano-Satellites" ;
            document.getElementById("AfficherISSButton").value= "ISS" ;
            document.getElementById("AfficherIridiumButton").value= "Iridium" ;
            document.getElementById("research").innerHTML= "Recherche" ;
            document.getElementById("researchCountries").innerHTML= "Pays" ;
            document.getElementById("orbit").innerHTML= "Orbite" ;
            document.getElementById("navigation").innerHTML= "Navigation" ;
            document.getElementById("others").innerHTML= "Autres" ;
        }

    });

    $('#ru').click(function(){
        document.getElementById("title").innerHTML = "Гравит\'Аранд";
        document.getElementById("globe").innerHTML = "Глобус";
        document.getElementById("favourites").innerHTML = "Любимые";
        document.getElementById("register").innerHTML = "Соединять";
        document.getElementById("contact").innerHTML = "Связь";
        footer.innerHTML = "&copy Авторское право ENAC.";

        if (document.location.href === "http://127.0.0.1:8000/gravitaround/" ||
            document.location.href === "http://127.0.0.1:8000/" ){
            document.getElementById("rechercheBar").placeholder= "Исследование спутника..." ;
            document.getElementById("recherchePaysBar").placeholder= "Искать страну..." ;
            document.getElementById("updateButton").value= "Обновлять" ;
            document.getElementById("supprimerButton").value= "Удалить" ;
            document.getElementById("afficherButton").value= "Все" ;
            document.getElementById("activateTrajectory").value= "Траектория" ;
            document.getElementById("Localisation").value= "Найдите Меня" ;
            document.getElementById("AfficherBeidouButton").value= "Бэйдоу" ;
            document.getElementById("AfficherLEOButton").value= "HOО" ;
            document.getElementById("AfficherMEOButton").value= "MEO" ;
            document.getElementById("AfficherGEOButton").value= "ГCO" ;
            document.getElementById("AfficherHEOButton").value= "HEO" ;
            document.getElementById("AfficherGalileoButton").value= "Галилео" ;
            document.getElementById("AfficherGeodeticButton").value= "Геодезический" ;
            document.getElementById("AfficherGOESButton").value= "GOES" ;
            document.getElementById("AfficherNOAAButton").value= "NOAA" ;
            document.getElementById("AfficherGPSButton").value= "GPS" ;
            document.getElementById("AfficherWeatherButton").value= "Метео" ;
            document.getElementById("AfficherSESButton").value= "Космос и Наука о Земле" ;
            document.getElementById("AfficherSpaceStationsButton").value= "Космические Станции" ;
            document.getElementById("AfficherEngineeringButton").value= "Инжиниринг" ;
            document.getElementById("AfficherCubeSatsButton").value= "CubeSats" ;
            document.getElementById("AfficherISSButton").value= "МКС" ;
            document.getElementById("AfficherIridiumButton").value= "Iridium" ;
            document.getElementById("research").innerHTML= "Исследование" ;
            document.getElementById("researchCountries").innerHTML= "Cтрана" ;
            document.getElementById("orbit").innerHTML= "Oрбита" ;
            document.getElementById("navigation").innerHTML= "Навигация" ;
            document.getElementById("others").innerHTML= "Другие" ;
        }

    });
});