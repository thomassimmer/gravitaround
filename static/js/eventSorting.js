$( document ).ready(function() {

    console.log("static")
    let nomRecherche = listeNomCreation();
    let paysRecherche = listePaysCreation();
    let favoris = listeFavorisCreation();

    // We create a list of list for each button, useful to call them
    let objets = [[1, [], afficherLEO, 1, LEOClick, "#AfficherLEOButton", "orbit", "LEO (Low Earth Orbit)"],
        [1, [], afficherMEO, 2, MEOClick, "#AfficherMEOButton", "orbit", "MEO (Medium Earth Orbit)"],
        [1, [], afficherGEO, 3, GEOClick, "#AfficherGEOButton", "orbit", "GEO (Geostationnary Earth Orbit)"],
        [1, [], afficherHEO, 4, HEOClick, "#AfficherHEOButton", "orbit", "HEO (High Earth Orbit)"],
        [1, [], afficherGPS, 5, GPSClick, "#AfficherGPSButton", "category", "GPS Operationnal"],
        [1, [], afficherBeidou, 6, BeidouClick, "#AfficherBeidouButton", "satellite_name", "BEIDOU"],
        [1, [], afficherGalileo, 7, GalileoClick, "#AfficherGalileoButton", "category", "Galileo"],
        [1, [], afficherCubeSats, 8, CubeSatsClick, "#AfficherCubeSatsButton", "category", "CubeSats"],
        [1, [], afficherEngineering, 9, EngineeringClick, "#AfficherEngineeringButton", "category", "Engineering"],
        [1, [], afficherSpaceStations, 10, SpaceStationsClick, "#AfficherSpaceStationsButton", "category", "Space Stations"],
        [1, [], afficherGeodetic, 11, GeodeticClick, "#AfficherGeodeticButton", "category", "Geodetic"],
        [1, [], afficherWeather, 12, WeatherClick, "#AfficherWeatherButton", "category", "Weather"],
        [1, [], afficherNOAA, 13, NOAAClick, "#AfficherNOAAButton", "category", "NOAA"],
        [1, [], afficherGOES, 14, GOESClick, "#AfficherGOESButton", "category", "GOES"],
        [1, [], afficherSES, 15, SESClick, "#AfficherSESButton", "category", "Space and Earth Science"],
        [1, [], afficherISS, 16, ISSClick, "#AfficherISSButton", "satellite_name", "ISS (ZARYA)"],
        [1, [], afficherIridium, 17, Iridiumclick, "#AfficherIridiumButton", "satellite_name", "IRIDIUM"],
        [1, [], localisation, 18, LocateMeClick, "#Localisation", null, null],
        [1, [], null, 19, null, "#rechercheBar", "satellite_name", null],
        [1, [], displayAll, 20, displayAllButtonClick, "#afficherButton", "", ""],
        [1, [], null, 21, null, "#recherchePaysBar", "country", null]
    ];

    let MYPOSITION = []; // Will contain the cone created by the geolocation, useful to delete it.
    let trajectoryPosition = 0;  // even if the button is not clicked, odd else.

    if (document.location.href === "http://127.0.0.1:8000/gravitaround/connexion/") {
        $('#register').toggleClass("whitecolor");
    }
    if (document.location.href === "http://127.0.0.1:8000/gravitaround/contact/") {
        $('#contact').toggleClass("whitecolor");
    }
    if (document.URL === "http://127.0.0.1:8000/gravitaround/" || document.URL === "http://127.0.0.1:8000/") {
        $('#globe').toggleClass("whitecolor");
    }
    if (document.location.href === "http://127.0.0.1:8000/gravitaround/favourite/") {
        $('#favourites').toggleClass("whitecolor");
    }


    $(function () {
        $.widget("custom.catcomplete", $.ui.autocomplete, {
            _create: function () {
                this._super();
                this.widget().menu("option", "items", "> :not(.ui-autocomplete-category)");
            },
            _renderMenu: function (ul, items) {
                let that = this,
                    currentCategory = "";
                $.each(items, function (index, item) {
                    let li;
                    if (item.category !== currentCategory) {
                        ul.append("<li class='ui-autocomplete-category'>" + item.category + "</li>");
                        currentCategory = item.category;
                    }
                    li = that._renderItemData(ul, item);
                    if (item.category) {
                        li.attr("aria-label", item.category + " : " + item.label);
                    }
                });
            }
        });

        $("#rechercheBar").catcomplete({
            // Create the autocompletion above the search bar, with for source, list of all satellites'name sorted
            // by their category
            source: nomRecherche,
            position: {
                my: 'bottom',
                at: 'top'
            }
        });

        $('#rechercheBar').on('catcompleteselect', function (e, ui) {
            // When we trigger enter key, the satellite is created on the globe, the button is clicked, and the button's counter in increased
            $(this).toggleClass("down");
            objets[18][0]++;
            objets[18][1] = display("satellite_name", ui.item.value);
            objets[18][7] = ui.item.value;
        });

        $('#rechercheBar').click(function () {
            // When we click on search bar, the previous satellite's name disappear and the button is unclicked
            document.getElementById("rechercheBar").value = "";
            if (objets[18][0] % 2 === 0) {
                $(this).toggleClass("down");
                objets[18][7] = null;
                objets[18][1] = [];
            }
        })

    });

    $("#recherchePaysBar").autocomplete({
        source: paysRecherche,
        position: {
            my: 'bottom',
            at: 'top'
        }
    });

    $('#recherchePaysBar').on('autocompleteselect', function (e, ui) {
        $(this).toggleClass("down");
        objets[20][0]++;
        objets[20][1] = display("country", ui.item.value);
        objets[20][7] = ui.item.value;
    });

    $('#recherchePaysBar').click(function () {
        document.getElementById("recherchePaysBar").value = "";
        if (objets[20][0] % 2 === 0) {
            $(this).toggleClass("down");
            objets[20][7] = null;
            objets[20][1] = [];
        }
    });


    $("#updateButton").click(function () {
        if (noButtonIsClicked() === false) {
            update();
            $(this).toggleClass("down");                          // We put the button on

        }
    });

    $("#supprimerButton").click(function () {
        for (let i = 0; i < objets.length; i++) {
            if (objets[i][0] % 2 === 0) {
                objets[i][0]++;                             // We increment the button value
                $(objets[i][5]).toggleClass("down");        // We put the button off
            }
        }
        deleteAll();                                          // We delete all figures existing
        document.getElementById("rechercheBar").value = "";   // We put the search bar value at none
        viewer.camera.flyTo({destination: Cesium.Cartesian3.fromDegrees(-35, 30, 30000000)});
        // We come back to an initial camera position
    });

    $("#afficherButton").click(function displayAllButtonClick() {
        $(this).toggleClass("down");
        buttonFunctionnement(19, displayAll);
    });

    $("#activateTrajectory").click(function () {
        $(this).toggleClass("down");
        trajectoryPosition++;
    });

    $("#Localisation").click(function LocateMeClick() {
        $(this).toggleClass("down");
        objets[17][0]++;
        if (objets[17][0] % 2 === 0) {
            if (navigator.geolocation)             // If the user is okay with giving its position,
                objets[17][1] = navigator.geolocation.getCurrentPosition(localisation);
            // Then, we create a cone above him and put the camera above him
        } else {
            // If the button was already clicked on
            viewer.entities.remove(MYPOSITION.pop()); // We delete the cone
            objets[17][1] = [];                       // We delete cone from the list of figures for this button
        }
    });

    $("#AfficherBeidouButton").click(function BeidouClick() {
        $(this).toggleClass("down");
        buttonFunctionnement(5, afficherBeidou);
        // We call a function that simulate the effects of a click (useful to avoid redundancy)
    });

    $("#AfficherLEOButton").click(function LEOClick() {
        $(this).toggleClass("down");
        buttonFunctionnement(0, afficherLEO);
    });

    $("#AfficherMEOButton").click(function MEOClick() {
        $(this).toggleClass("down");
        buttonFunctionnement(1, afficherMEO);
    });

    $("#AfficherGEOButton").click(function GEOClick() {
        $(this).toggleClass("down");
        buttonFunctionnement(2, afficherGEO);
    });

    $("#AfficherHEOButton").click(function HEOClick() {
        $(this).toggleClass("down");
        buttonFunctionnement(3, afficherHEO);
    });

    $("#AfficherGalileoButton").click(function GalileoClick() {
        $(this).toggleClass("down");
        buttonFunctionnement(6, afficherGalileo);
    });

    $("#AfficherGeodeticButton").click(function GeodeticClick() {
        $(this).toggleClass("down");
        buttonFunctionnement(10, afficherGeodetic);
    });

    $("#AfficherGOESButton").click(function GOESClick() {
        $(this).toggleClass("down");
        buttonFunctionnement(13, afficherGOES);
    });

    $("#AfficherNOAAButton").click(function NOAAClick() {
        $(this).toggleClass("down");
        buttonFunctionnement(12, afficherNOAA);
    });

    $("#AfficherGPSButton").click(function GPSClick() {
        $(this).toggleClass("down");
        buttonFunctionnement(4, afficherGPS);
    });

    $("#AfficherWeatherButton").click(function WeatherClick() {
        $(this).toggleClass("down");
        buttonFunctionnement(11, afficherWeather);
    });

    $("#AfficherSESButton").click(function SESClick() {
        $(this).toggleClass("down");
        buttonFunctionnement(14, afficherSES);
    });

    $("#AfficherSpaceStationsButton").click(function SpaceStationsClick() {
        $(this).toggleClass("down");
        buttonFunctionnement(9, afficherSpaceStations);
    });

    $("#AfficherEngineeringButton").click(function EngineeringClick() {
        $(this).toggleClass("down");
        buttonFunctionnement(8, afficherEngineering);
    });

    $("#AfficherCubeSatsButton").click(function CubeSatsClick() {
        $(this).toggleClass("down");
        buttonFunctionnement(7, afficherCubeSats);
    });

    $("#AfficherISSButton").click(function ISSClick() {
        $(this).toggleClass("down");
        buttonFunctionnement(15, afficherISS);
    });

    $("#AfficherIridiumButton").click(function Iridiumclick() {
        $(this).toggleClass("down");
        buttonFunctionnement(16, afficherIridium);
    });


    function update() {
        console.log("update...")
        $("#updateButton").toggleClass("down");
        // Uploading is complete, we put the button off
        $.ajax({
            url: "/gravitaround/update/",
            type: 'GET',
            dataType: 'html',
            success: function () {
                for (let i = 0; i < objets.length; i++) {
                    if (objets[i][0] % 2 === 0) {                    // If a button is clicked on,
                        let colonne = objets[i][6];
                        let like = objets[i][7];
                        let listeObjet = objets[i][1];
                        let data = {
                            colonne: colonne,
                            like: like
                        };
                        $.ajax({
                            url: "/gravitaround/display/",
                            type: 'POST',
                            data: data,
                            dataType: 'html',
                            success: function (code_html) {
                                let satelliteData = code_html.substring(1, code_html.length - 1);
                                let array = satelliteData.split("][");
                                for (let sat = 0; sat < array.length; sat++) {
                                    let subarray = array[sat].split(",");
                                    let idSat = parseInt(subarray[0]);
                                    let nameSat = subarray[1].substring(2, subarray[1].length - 1);
                                    let category = subarray[2].substring(2, subarray[2].length - 1);
                                    let orbitType = subarray[3].substring(2, subarray[3].length - 1);
                                    let longitude = parseInt(subarray[4]);
                                    let latitude = parseInt(subarray[5]);
                                    let altitude = parseInt(subarray[6]);
                                    let inclinaison = parseInt(subarray[7]);
                                    let longitudeNoeud = parseInt(subarray[8]);
                                    let anomalieMoyenne = parseInt(subarray[9]);
                                    let pays = subarray[10].substring(2, subarray[10].length - 1);
                                    let semiMajorAxis = parseInt(subarray[11]);
                                    let semiMinorAxis = parseInt(subarray[12]);
                                    let arg = parseInt(subarray[13]) - 90;
                                    let modelMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(
                                        Cesium.Cartesian3.fromDegrees(longitude, latitude, altitude));
                                    let rotateMatrix = Cesium.Matrix3.fromRotationY(Cesium.Math.toRadians(0.0));
                                    let rotation4 = Cesium.Matrix4.fromRotationTranslation(rotateMatrix,
                                        Cesium.Cartesian3.ZERO);
                                    let rotatedModel = Cesium.Matrix4.multiply(modelMatrix, rotation4, modelMatrix);
                                    let ellipseCenterDistanceFromEarthSurface =
                                        (semiMajorAxis ** 2 - semiMinorAxis ** 2) ** 0.5 - 6371000;
                                    if (inclinaison > 90) {
                                        inclinaison = inclinaison - 180;
                                    }
                                    let inclinaisonRadians = inclinaison * (6.28 / 360);
                                    longitudeNoeud = longitudeNoeud - 90;
                                    let argRadians = arg * (6.28 / 360);
                                    let theta = Math.acos(Math.cos(argRadians) * Math.sin(inclinaisonRadians))
                                        * (360 / 6.28) - 90;
                                    let phi = Math.acos(Math.cos(argRadians) * Math.cos(inclinaisonRadians) /
                                        Math.pow(Math.pow(Math.cos(argRadians) * Math.cos(inclinaisonRadians), 2) +
                                            Math.pow(Math.sin(argRadians), 2), 0.5)) * (360 / 6.28);

                                    let objectToUpdate = listeObjet[2 * sat];
                                    let ellipseToUpdate = listeObjet[2 * sat + 1];
                                    // Now we have updated information, we apply them
                                    objectToUpdate.position = Cesium.Cartesian3.fromDegrees(longitude,
                                        latitude,
                                        altitude);
                                    objectToUpdate.description = "\
                                                                <p>\
                                                                  This is the satellite : " + nameSat + ". <br /> \
                                                                  <br />Id : " + idSat + " <br />\
                                                                  Category : " + category + " <br /> \
                                                                  Longitude : " + longitude + " °<br /> \
                                                                  Latitude : " + latitude + " °<br />\
                                                                  Altitude : " + String(altitude).substring(0,
                                        String(altitude).length - 3) + " km.<br /> \
                                                                  Orbit type : " + orbitType + " <br /> \
                                                                  Country : " + pays + " <br />\
                                                                </p>\
                                                                <p>\
                                                                  Source: \
                                                                  <a style='color: WHITE'\
                                                                    target='_blank'\
                                                                    href='https:www.celestrak.com/NORAD/elements/\
                                                                    science.txt'>Celestrak</a>\
                                                                </p>";


                                    if (0 < arg && arg < 180) {
                                        ellipseToUpdate.position = Cesium.Cartesian3.fromDegrees(longitudeNoeud + phi,
                                            -theta, ellipseCenterDistanceFromEarthSurface);
                                        ellipseToUpdate.orientation = Cesium.Transforms.headingPitchRollQuaternion(
                                            Cesium.Cartesian3.fromDegrees(longitudeNoeud + phi,
                                                -(Math.acos(Math.sin(inclinaisonRadians)) * (360 / 6.28) - 90),
                                                ellipseCenterDistanceFromEarthSurface),
                                            new Cesium.HeadingPitchRoll(Cesium.Math.toRadians(0),
                                                Cesium.Math.toRadians(90) + argRadians,
                                                Cesium.Math.toRadians(90)));
                                        ellipseToUpdate.description = "\
                                                                <p>\
                                                                  This is the trajectory of the satellite : "
                                            + nameSat + ". <br /> \
                                                                  <br />Id : " + idSat + " <br />\
                                                                  Category : " + category + " <br /> \
                                                                  Orbit type : " + orbitType + " <br /> \
                                                                  Node Longitude : " + longitudeNoeud + " °<br /> \
                                                                  Inclinaison : " + inclinaison + " °<br />\
                                                                  Periastris Argument : " + arg + " °<br /> \
                                                                  Mean Anomaly : " + anomalieMoyenne + " °<br /> \
                                                                  Semi Minor Axis : " +
                                            String(semiMinorAxis).substring(0, String(semiMinorAxis).length - 3)
                                            + " km. <br /> \
                                                                  Semi Major Axis : " +
                                            String(semiMajorAxis).substring(0, String(semiMajorAxis).length - 3)
                                            + " km. <br /> \
                                                                  Country : " + pays + " <br />\
                                                                </p>\
                                                                <p>\
                                                                  Source: \
                                                                  <a style='color: WHITE'\
                                                                    target='_blank'\
                                                                    href='https:www.celestrak.com/NORAD/elements/\
                                                                    science.txt'>Celestrak</a>\
                                                                </p>";
                                    }
                                    else {
                                        ellipseToUpdate.position = Cesium.Cartesian3.fromDegrees(longitudeNoeud + phi,
                                            theta, ellipseCenterDistanceFromEarthSurface);
                                        ellipseToUpdate.orientation = Cesium.Transforms.headingPitchRollQuaternion(
                                            Cesium.Cartesian3.fromDegrees(longitudeNoeud + phi,
                                                (Math.acos(Math.sin(inclinaisonRadians)) * (360 / 6.28) - 90),
                                                ellipseCenterDistanceFromEarthSurface),
                                            new Cesium.HeadingPitchRoll(Cesium.Math.toRadians(0),
                                                Cesium.Math.toRadians(90) + argRadians,
                                                Cesium.Math.toRadians(90)));
                                        ellipseToUpdate.description = "\
                                                                <p>\
                                                                  This is the trajectory of the satellite : " +
                                            nameSat + ". <br /> \
                                                                  <br />Id : " + idSat + " <br />\
                                                                  Category : " + category + " <br /> \
                                                                  Orbit type : " + orbitType + " <br /> \
                                                                  Node Longitude : " + longitudeNoeud + " °<br /> \
                                                                  Inclinaison : " + inclinaison + " °<br />\
                                                                  Periastris Argument : " + arg + " °<br /> \
                                                                  Mean Anomaly : " + anomalieMoyenne + " °<br /> \
                                                                  Semi Minor Axis : " +
                                            String(semiMinorAxis).substring(0, String(semiMinorAxis).length - 3) +
                                            " km. <br /> \
                                                                      Semi Major Axis : " +
                                            String(semiMajorAxis).substring(0, String(semiMajorAxis).length - 3) +
                                            " km. <br /> \
                                                                      Country : " + pays + " <br />\
                                                                </p>\
                                                                <p>\
                                                                  Source: \
                                                                  <a style='color: WHITE'\
                                                                    target='_blank'\
                                                                    href='https:www.celestrak.com/NORAD/elements/\
                                                                    science.txt'>Celestrak</a>\
                                                                </p>";
                                    }
                                    if (trajectoryPosition % 2 === 0) {
                                        ellipseToUpdate.show = false;
                                    }
                                    else if (trajectoryPosition % 2 === 1) {
                                        ellipseToUpdate.show = true;
                                    }
                                }
                            }
                        });
                    }
                }
            }
        });
    }

    function displayAll() {
        return display();
    }

    function deleteAll() {
        viewer.entities.removeAll();
    }

    function display(colonne = "", like = "") {
        // This function display on the globe every satellite or trajectory needed
        let points = [];  // Will contains the object created, useful to delete them
        let data = {
            colonne: colonne,
            like: like
        };
        $.ajax({
            url: "/gravitaround/display/",
            type: 'POST',
            data: data,
            dataType: 'html',
            success: function (code_html) {
                let satelliteData = code_html.substring(1, code_html.length - 1);
                let array = satelliteData.split("][");
                for (let sat = 0; sat < array.length; sat++) {
                    let subarray = array[sat].split(",");
                    let idSat = parseInt(subarray[0]);
                    let nameSat = subarray[1].substring(2, subarray[1].length - 1);
                    let category = subarray[2].substring(2, subarray[2].length - 1);
                    let orbitType = subarray[3].substring(2, subarray[3].length - 1);
                    var longitude = parseInt(subarray[4]);
                    var latitude = parseInt(subarray[5]);
                    var altitude = parseInt(subarray[6]);
                    let inclinaison = parseInt(subarray[7]);
                    let longitudeNoeud = parseInt(subarray[8]);
                    let anomalieMoyenne = parseInt(subarray[9]);
                    let pays = subarray[10].substring(2, subarray[10].length - 1);
                    let semiMajorAxis = parseInt(subarray[11]);
                    let semiMinorAxis = parseInt(subarray[12]);
                    let arg = parseInt(subarray[13]) - 90;
                    let modelMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(
                        Cesium.Cartesian3.fromDegrees(longitude, latitude, altitude));
                    let rotateMatrix = Cesium.Matrix3.fromRotationY(Cesium.Math.toRadians(0.0));
                    let rotation4 = Cesium.Matrix4.fromRotationTranslation(rotateMatrix, Cesium.Cartesian3.ZERO);
                    let rotatedModel = Cesium.Matrix4.multiply(modelMatrix, rotation4, modelMatrix);
                    let satellite = viewer.entities.add({
                        name: nameSat,
                        position: Cesium.Cartesian3.fromDegrees(longitude, latitude, altitude),
                        model: {
                            uri: '/static/satellite_models/ISSComplete1.glb',
                            scale: 200000.0
                        },
                        description: "\
                                    <p>\
                                      This is the satellite : " + nameSat + ". <br /> \
                                      <br />Id : " + idSat + " <br />\
                                      Category : " + category + " <br /> \
                                      Longitude : " + longitude + " °<br /> \
                                      Latitude : " + latitude + " °<br />\
                                      Altitude : " + String(altitude).substring(0, String(altitude).length - 3) +
                        " km.<br /> \
                                          Orbit type : " + orbitType + " <br /> \
                                      Country : " + pays + " <br />\
                                    </p>\
                                    <p>\
                                      Source: \
                                      <a style='color: WHITE'\
                                        target='_blank'\
                                        href='https:www.celestrak.com/NORAD/elements/science.txt'>Celestrak</a>\
                                    </p>"
                    });
                    let ellipseCenterDistanceFromEarthSurface = (semiMajorAxis ** 2 - semiMinorAxis ** 2) ** 0.5 -
                        6371000;
                    if (inclinaison > 90) {
                        inclinaison = inclinaison - 180;
                    } else {
                    }
                    let inclinaisonRadians = inclinaison * (6.28 / 360);
                    longitudeNoeud = longitudeNoeud - 90;
                    let argRadians = arg * (6.28 / 360);
                    let theta = Math.acos(Math.cos(argRadians) * Math.sin(inclinaisonRadians)) * (360 / 6.28) - 90;
                    let phi = Math.acos(Math.cos(argRadians) * Math.cos(inclinaisonRadians) /
                        Math.pow(Math.pow(Math.cos(argRadians) * Math.cos(inclinaisonRadians), 2) +
                            Math.pow(Math.sin(argRadians), 2), 0.5)) * (360 / 6.28);
                    let trajectory = [];
                    if (0 < arg && arg < 180) {
                        trajectory = viewer.entities.add({
                            name: nameSat,
                            position: Cesium.Cartesian3.fromDegrees(longitudeNoeud + phi,
                                -theta,
                                ellipseCenterDistanceFromEarthSurface),
                            ellipsoid: {
                                radii: new Cesium.Cartesian3(semiMajorAxis, semiMinorAxis, 1),
                                material: Cesium.Color.BLUE,
                                fill: false,
                                outline: true,
                                outlineColor: Cesium.Color.BLUE,
                                slicePartitions: 0,
                                stackPartitions: 2
                            },
                            orientation: Cesium.Transforms.headingPitchRollQuaternion(
                                Cesium.Cartesian3.fromDegrees(longitudeNoeud + phi,
                                    -(Math.acos(Math.sin(inclinaisonRadians)) * (360 / 6.28) - 90),
                                    ellipseCenterDistanceFromEarthSurface),
                                new Cesium.HeadingPitchRoll(Cesium.Math.toRadians(0),
                                    Cesium.Math.toRadians(90) + argRadians,
                                    Cesium.Math.toRadians(90))),
                            description: "\
                                    <p>\
                                      This is the trajectory of the satellite : " + nameSat + ". <br /> \
                                      <br />Id : " + idSat + " <br />\
                                      Category : " + category + " <br /> \
                                      Orbit type : " + orbitType + " <br /> \
                                      Node Longitude : " + longitudeNoeud + " °<br /> \
                                      Inclinaison : " + inclinaison + " °<br />\
                                      Periastris Argument : " + arg + " °<br /> \
                                      Mean Anomaly : " + anomalieMoyenne + " °<br /> \
                                      Semi Minor Axis : " + String(semiMinorAxis).substring(0,
                                String(semiMinorAxis).length - 3) + " km. <br /> \
                                      Semi Major Axis : " + String(semiMajorAxis).substring(0,
                                String(semiMajorAxis).length - 3) + " km. <br /> \
                                      Country : " + pays + " <br />\
                                    </p>\
                                    <p>\
                                      Source: \
                                      <a style='color: WHITE'\
                                        target='_blank'\
                                        href='https:www.celestrak.com/NORAD/elements/science.txt'>Celestrak</a>\
                                    </p>"
                        });
                    } else {
                        trajectory = viewer.entities.add({
                            name: nameSat,
                            position: Cesium.Cartesian3.fromDegrees(longitudeNoeud + phi,
                                theta,
                                ellipseCenterDistanceFromEarthSurface),
                            ellipsoid: {
                                radii: new Cesium.Cartesian3(semiMajorAxis, semiMinorAxis, 1),
                                material: Cesium.Color.BLUE,
                                fill: false,
                                outline: true,
                                outlineColor: Cesium.Color.BLUE,
                                slicePartitions: 0,
                                stackPartitions: 2
                            },
                            orientation: Cesium.Transforms.headingPitchRollQuaternion(
                                Cesium.Cartesian3.fromDegrees(longitudeNoeud + phi,
                                    (Math.acos(Math.sin(inclinaisonRadians)) * (360 / 6.28) - 90),
                                    ellipseCenterDistanceFromEarthSurface),
                                new Cesium.HeadingPitchRoll(Cesium.Math.toRadians(0),
                                    Cesium.Math.toRadians(90) + argRadians,
                                    Cesium.Math.toRadians(90))),
                            description: "\
                                    <p>\
                                      This is the trajectory of the satellite : " + nameSat + ". <br /> \
                                      <br />Id : " + idSat + " <br />\
                                      Category : " + category + " <br /> \
                                      Orbit type : " + orbitType + " <br /> \
                                      Node Longitude : " + longitudeNoeud + " °<br /> \
                                      Inclinaison : " + inclinaison + " °<br />\
                                      Periastris Argument : " + arg + " °<br /> \
                                      Mean Anomaly : " + anomalieMoyenne + " °<br /> \
                                      Semi Minor Axis : " +
                            String(semiMinorAxis).substring(0, String(semiMinorAxis).length - 3) + " km. <br /> \
                                      Semi Major Axis : " +
                            String(semiMajorAxis).substring(0, String(semiMajorAxis).length - 3) + " km. <br /> \
                                      Country : " + pays + " <br />\
                                    </p>\
                                    <p>\
                                      Source: \
                                      <a style='color: WHITE'\
                                        target='_blank'\
                                        href='https:www.celestrak.com/NORAD/elements/science.txt'>Celestrak</a>\
                                    </p>"
                        });
                    }
                    if (trajectoryPosition % 2 === 0) {
                        // If the Trajectory button is not clicked, we hid the ellipse created.
                        trajectory.show = false;
                    }
                    points.push(satellite);
                    points.push(trajectory);
                }

                if (array.length === 1) {
                    // If only one object is created, we can put the camera on him.
                    viewer.camera.flyTo({
                        destination: Cesium.Cartesian3.fromDegrees(longitude, latitude, altitude + 10000000)
                    });
                    viewer.selectedEntity = points[0];
                } else {
                }
            },
            error: function (resultat, statut, erreur) {
                // alert(erreur);
            }
        });
        return points;
    }


    function localisation(position) {

        if (navigator.geolocation) {

            MYPOSITION.push(viewer.entities.add({
                name: 'You are here',
                position: Cesium.Cartesian3.fromDegrees(position.coords.longitude,
                    position.coords.latitude, position.coords.altitude + 2000000 / 2),
                orientation: Cesium.Transforms.headingPitchRollQuaternion(
                    Cesium.Cartesian3.fromDegrees(position.coords.longitude,
                        position.coords.latitude, position.coords.altitude + 40000000 / 2),
                    new Cesium.HeadingPitchRoll(Cesium.Math.toRadians(0), Cesium.Math.toRadians(180), 0)),
                cylinder: {
                    length: 2000000.0,
                    topRadius: 400,
                    bottomRadius: 1000000.0,
                    material: Cesium.Color.GREEN.withAlpha(0.3)
                }
            }));

            viewer.camera.flyTo({
                destination: Cesium.Cartesian3.fromDegrees(position.coords.longitude,
                    position.coords.latitude,
                    position.coords.altitude + 10000000)
            });
        }
    }

    function afficherBeidou() {
        return display("satellite_name", "BEIDOU");
    }

    function afficherGalileo() {
        return display("category", "Galileo");
    }

    function afficherLEO() {
        return display("orbit", "LEO (Low Earth Orbit)");
    }

    function afficherMEO() {
        return display("orbit", "MEO (Medium Earth Orbit)");
    }

    function afficherGEO() {
        return display("orbit", "GEO (Geostationnary Earth Orbit)");
    }

    function afficherHEO() {
        return display("orbit", "HEO (High Earth Orbit)");
    }

    function afficherWeather() {
        return display("category", "Weather");
    }


    function afficherSES() {
        return display("category", "Space and Earth Science");
    }

    function afficherNOAA() {
        return display("category", "NOAA");
    }

    function afficherGOES() {
        return display("category", "GOES");
    }

    function afficherIridium() {
        return display("satellite_name", "IRIDIUM");
    }

    function afficherGPS() {
        return display("category", "GPS Operationnal");
    }

    function afficherCubeSats() {
        return display("category", "CubeSats");
    }

    function afficherEngineering() {
        return display("category", "Engineering");
    }

    function afficherSpaceStations() {
        return display("category", "Space Stations");
    }

    function afficherISS() {
        return display("satellite_name", "ISS (ZARYA)");
    }

    function afficherGeodetic() {
        return display("category", "Geodetic");
    }

    function noButtonIsClicked() {
        let nbClicked = 0;
        for (let i = 0; i < objets.length; i++) {                // We check if a button is clicked,
            if (objets[i][0] % 2 === 0) {                    // Because if no one is clicked,
                nbClicked++;                                // We don't need to update
            }
        }
        return (nbClicked > 0)
    }

    function buttonFunctionnement(idButton, fonction) {
        objets[idButton][0]++;                                            // We increment the button counter
        if (objets[idButton][0] % 2 === 0) {                               // If it's unclicked
            objets[idButton][1] = fonction();                             // We create the objects associated
        } else {
            for (let i = 0; i < objets[idButton][1].length; i++) {        // Else, We delete the objects associated
                viewer.entities.remove(objets[idButton][1][i]);
            }
            objets[idButton][1] = [];
        }
    }

    function displayAllButtonClick() {
        $(this).toggleClass("down");
        buttonFunctionnement(19, displayAll);
    }

    function LocateMeClick() {
        $("#Localisation").toggleClass("down");
        objets[17][0]++;
        if (objets[17][0] % 2 === 0) {
            if (navigator.geolocation)
                objets[17][1] = navigator.geolocation.getCurrentPosition(localisation);
        } else {
            viewer.entities.remove(MYPOSITION.pop());
            objets[17][1] = [];
        }

    }

    function BeidouClick() {
        $(this).toggleClass("down");
        buttonFunctionnement(5, afficherBeidou);
    }

    function LEOClick() {
        $(this).toggleClass("down");
        buttonFunctionnement(0, afficherLEO);
    }

    function MEOClick() {
        $(this).toggleClass("down");
        buttonFunctionnement(1, afficherMEO);
    }

    function GEOClick() {
        $(this).toggleClass("down");
        buttonFunctionnement(2, afficherGEO);
    }

    function HEOClick() {
        $(this).toggleClass("down");
        buttonFunctionnement(3, afficherHEO);
    }

    function GalileoClick() {
        $(this).toggleClass("down");
        buttonFunctionnement(6, afficherGalileo);
    }

    function GeodeticClick() {
        $(this).toggleClass("down");
        buttonFunctionnement(10, afficherGeodetic);
    }

    function GOESClick() {
        $(this).toggleClass("down");
        buttonFunctionnement(13, afficherGOES);
    }

    function NOAAClick() {
        $(this).toggleClass("down");
        buttonFunctionnement(12, afficherNOAA);
    }

    function GPSClick() {
        $(this).toggleClass("down");
        buttonFunctionnement(4, afficherGPS);
    }

    function WeatherClick() {
        $(this).toggleClass("down");
        buttonFunctionnement(11, afficherWeather);
    }

    function SESClick() {
        $(this).toggleClass("down");
        buttonFunctionnement(14, afficherSES);
    }

    function SpaceStationsClick() {
        $(this).toggleClass("down");
        buttonFunctionnement(9, afficherSpaceStations);
    }

    function EngineeringClick() {
        $(this).toggleClass("down");
        buttonFunctionnement(8, afficherEngineering);
    }

    function CubeSatsClick() {
        $(this).toggleClass("down");
        buttonFunctionnement(7, afficherCubeSats);
    }

    function ISSClick() {
        $(this).toggleClass("down");
        buttonFunctionnement(15, afficherISS);
    }

    function Iridiumclick() {
        $(this).toggleClass("down");
        buttonFunctionnement(16, afficherIridium);
    }

    function listeNomCreation() {
        // We create a list containing all satellites'name.
        let liste = [];
        $.ajax({
            url: "/gravitaround/rechercheSat/",
            type: 'GET',
            dataType: 'html',
            success: function (code_html) {
                let satellite = code_html.substring(1, code_html.length - 1);
                let array = satellite.split(")(");
                for (let i = 0; i < array.length; i++) {
                    let element = array[i].split(",");
                    liste.push({
                        label: element[0].substring(1, element[0].length - 1),
                        category: element[1].substring(2, element[1].length - 1)
                    });
                }
            },
            error: function (resultat, statut, erreur) {
                // alert(erreur);
            }
        });

        return liste;
    }

    function listePaysCreation() {
        // We create a list containing all satellites'name.
        let liste = [];
        $.ajax({
            url: "/gravitaround/recherchePays/",
            type: 'GET',
            dataType: 'html',
            success: function (code_html) {
                let satellite = code_html.substring(1, code_html.length - 1);
                let array = satellite.split(",");
                for (let i = 0; i < array.length; i++) {
                    let element = array[i].substring(1, array[i].length - 1);
                    liste.push(element);
                }
            },
            error: function (resultat, statut, erreur) {
                // alert(erreur);
            }
        });
        return liste;
    }

    function listeFavorisCreation() {
        // We create a list containing all satellites'name.
        let liste = [];
        $.ajax({
            url: "/gravitaround/favourite_group/",
            type: 'GET',
            dataType: 'html',
            success: function (code_html) {
                code_html = code_html.substring(3, code_html.length - 4);
                code_html = code_html.split("'], ['");
                for (let i = 0; i < code_html.length; i++) {
                    code_html[i].substring(1, code_html[i] - 1);
                    liste.push(code_html[i].split("', '"));
                }
            },
            error: function (resultat, statut, erreur) {
                // alert(erreur);
            }
        });
        return liste;
    }

});

function update() {
    $("#updateButton").toggleClass("down");
    // Uploading is complete, we put the button off
    $.ajax({
        url: "/gravitaround/update/",
        type: 'GET',
        dataType: 'html',
        success: function () {
            for (let i = 0; i < objets.length; i++) {
                if (objets[i][0] % 2 === 0) {                    // If a button is clicked on,
                    let colonne = objets[i][6];
                    let like = objets[i][7];
                    let listeObjet = objets[i][1];
                    let data = {
                        colonne: colonne,
                        like: like
                    };
                    $.ajax({
                        url: "/gravitaround/display/",
                        type: 'POST',
                        data: data,
                        dataType: 'html',
                        success: function (code_html) {
                            let satelliteData = code_html.substring(1, code_html.length - 1);
                            let array = satelliteData.split("][");
                            for (let sat = 0; sat < array.length; sat++) {
                                let subarray = array[sat].split(",");
                                let idSat = parseInt(subarray[0]);
                                let nameSat = subarray[1].substring(2, subarray[1].length - 1);
                                let category = subarray[2].substring(2, subarray[2].length - 1);
                                let orbitType = subarray[3].substring(2, subarray[3].length - 1);
                                let longitude = parseInt(subarray[4]);
                                let latitude = parseInt(subarray[5]);
                                let altitude = parseInt(subarray[6]);
                                let inclinaison = parseInt(subarray[7]);
                                let longitudeNoeud = parseInt(subarray[8]);
                                let anomalieMoyenne = parseInt(subarray[9]);
                                let pays = subarray[10].substring(2, subarray[10].length - 1);
                                let semiMajorAxis = parseInt(subarray[11]);
                                let semiMinorAxis = parseInt(subarray[12]);
                                let arg = parseInt(subarray[13]) - 90;
                                let modelMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(
                                    Cesium.Cartesian3.fromDegrees(longitude, latitude, altitude));
                                let rotateMatrix = Cesium.Matrix3.fromRotationY(Cesium.Math.toRadians(0.0));
                                let rotation4 = Cesium.Matrix4.fromRotationTranslation(rotateMatrix,
                                    Cesium.Cartesian3.ZERO);
                                let rotatedModel = Cesium.Matrix4.multiply(modelMatrix, rotation4, modelMatrix);
                                let ellipseCenterDistanceFromEarthSurface =
                                    (semiMajorAxis ** 2 - semiMinorAxis ** 2) ** 0.5 - 6371000;
                                if (inclinaison > 90) {
                                    inclinaison = inclinaison - 180;
                                }
                                let inclinaisonRadians = inclinaison * (6.28 / 360);
                                longitudeNoeud = longitudeNoeud - 90;
                                let argRadians = arg * (6.28 / 360);
                                let theta = Math.acos(Math.cos(argRadians) * Math.sin(inclinaisonRadians))
                                    * (360 / 6.28) - 90;
                                let phi = Math.acos(Math.cos(argRadians) * Math.cos(inclinaisonRadians) /
                                    Math.pow(Math.pow(Math.cos(argRadians) * Math.cos(inclinaisonRadians), 2) +
                                        Math.pow(Math.sin(argRadians), 2), 0.5)) * (360 / 6.28);

                                let objectToUpdate = listeObjet[2 * sat];
                                let ellipseToUpdate = listeObjet[2 * sat + 1];
                                // Now we have updated information, we apply them
                                objectToUpdate.position = Cesium.Cartesian3.fromDegrees(longitude,
                                    latitude,
                                    altitude);
                                objectToUpdate.description = "\
                                                            <p>\
                                                              This is the satellite : " + nameSat + ". <br /> \
                                                              <br />Id : " + idSat + " <br />\
                                                              Category : " + category + " <br /> \
                                                              Longitude : " + longitude + " °<br /> \
                                                              Latitude : " + latitude + " °<br />\
                                                              Altitude : " + String(altitude).substring(0,
                                    String(altitude).length - 3) + " km.<br /> \
                                                              Orbit type : " + orbitType + " <br /> \
                                                              Country : " + pays + " <br />\
                                                            </p>\
                                                            <p>\
                                                              Source: \
                                                              <a style='color: WHITE'\
                                                                target='_blank'\
                                                                href='https:www.celestrak.com/NORAD/elements/\
                                                                science.txt'>Celestrak</a>\
                                                            </p>";


                                if (0 < arg && arg < 180) {
                                    ellipseToUpdate.position = Cesium.Cartesian3.fromDegrees(longitudeNoeud + phi,
                                        -theta, ellipseCenterDistanceFromEarthSurface);
                                    ellipseToUpdate.orientation = Cesium.Transforms.headingPitchRollQuaternion(
                                        Cesium.Cartesian3.fromDegrees(longitudeNoeud + phi,
                                            -(Math.acos(Math.sin(inclinaisonRadians)) * (360 / 6.28) - 90),
                                            ellipseCenterDistanceFromEarthSurface),
                                        new Cesium.HeadingPitchRoll(Cesium.Math.toRadians(0),
                                            Cesium.Math.toRadians(90) + argRadians,
                                            Cesium.Math.toRadians(90)));
                                    ellipseToUpdate.description = "\
                                                            <p>\
                                                              This is the trajectory of the satellite : "
                                        + nameSat + ". <br /> \
                                                              <br />Id : " + idSat + " <br />\
                                                              Category : " + category + " <br /> \
                                                              Orbit type : " + orbitType + " <br /> \
                                                              Node Longitude : " + longitudeNoeud + " °<br /> \
                                                              Inclinaison : " + inclinaison + " °<br />\
                                                              Periastris Argument : " + arg + " °<br /> \
                                                              Mean Anomaly : " + anomalieMoyenne + " °<br /> \
                                                              Semi Minor Axis : " +
                                        String(semiMinorAxis).substring(0, String(semiMinorAxis).length - 3)
                                        + " km. <br /> \
                                                              Semi Major Axis : " +
                                        String(semiMajorAxis).substring(0, String(semiMajorAxis).length - 3)
                                        + " km. <br /> \
                                                              Country : " + pays + " <br />\
                                                            </p>\
                                                            <p>\
                                                              Source: \
                                                              <a style='color: WHITE'\
                                                                target='_blank'\
                                                                href='https:www.celestrak.com/NORAD/elements/\
                                                                science.txt'>Celestrak</a>\
                                                            </p>";
                                }
                                else {
                                    ellipseToUpdate.position = Cesium.Cartesian3.fromDegrees(longitudeNoeud + phi,
                                        theta, ellipseCenterDistanceFromEarthSurface);
                                    ellipseToUpdate.orientation = Cesium.Transforms.headingPitchRollQuaternion(
                                        Cesium.Cartesian3.fromDegrees(longitudeNoeud + phi,
                                            (Math.acos(Math.sin(inclinaisonRadians)) * (360 / 6.28) - 90),
                                            ellipseCenterDistanceFromEarthSurface),
                                        new Cesium.HeadingPitchRoll(Cesium.Math.toRadians(0),
                                            Cesium.Math.toRadians(90) + argRadians,
                                            Cesium.Math.toRadians(90)));
                                    ellipseToUpdate.description = "\
                                                            <p>\
                                                              This is the trajectory of the satellite : " +
                                        nameSat + ". <br /> \
                                                              <br />Id : " + idSat + " <br />\
                                                              Category : " + category + " <br /> \
                                                              Orbit type : " + orbitType + " <br /> \
                                                              Node Longitude : " + longitudeNoeud + " °<br /> \
                                                              Inclinaison : " + inclinaison + " °<br />\
                                                              Periastris Argument : " + arg + " °<br /> \
                                                              Mean Anomaly : " + anomalieMoyenne + " °<br /> \
                                                              Semi Minor Axis : " +
                                        String(semiMinorAxis).substring(0, String(semiMinorAxis).length - 3) +
                                        " km. <br /> \
                                                                  Semi Major Axis : " +
                                        String(semiMajorAxis).substring(0, String(semiMajorAxis).length - 3) +
                                        " km. <br /> \
                                                                  Country : " + pays + " <br />\
                                                            </p>\
                                                            <p>\
                                                              Source: \
                                                              <a style='color: WHITE'\
                                                                target='_blank'\
                                                                href='https:www.celestrak.com/NORAD/elements/\
                                                                science.txt'>Celestrak</a>\
                                                            </p>";
                                }
                                if (trajectoryPosition % 2 === 0) {
                                    ellipseToUpdate.show = false;
                                }
                                else if (trajectoryPosition % 2 === 1) {
                                    ellipseToUpdate.show = true;
                                }
                            }
                        }
                    });
                }
            }
        }
    });
}

function displayAll() {
    return display();
}

function deleteAll() {
    viewer.entities.removeAll();
}

function display(colonne = "", like = "") {
    // This function display on the globe every satellite or trajectory needed
    let points = [];  // Will contains the object created, useful to delete them
    let data = {
        colonne: colonne,
        like: like
    };
    $.ajax({
        url: "/gravitaround/display/",
        type: 'POST',
        data: data,
        dataType: 'html',
        success: function (code_html) {
            let satelliteData = code_html.substring(1, code_html.length - 1);
            let array = satelliteData.split("][");
            for (let sat = 0; sat < array.length; sat++) {
                let subarray = array[sat].split(",");
                let idSat = parseInt(subarray[0]);
                let nameSat = subarray[1].substring(2, subarray[1].length - 1);
                let category = subarray[2].substring(2, subarray[2].length - 1);
                let orbitType = subarray[3].substring(2, subarray[3].length - 1);
                var longitude = parseInt(subarray[4]);
                var latitude = parseInt(subarray[5]);
                var altitude = parseInt(subarray[6]);
                let inclinaison = parseInt(subarray[7]);
                let longitudeNoeud = parseInt(subarray[8]);
                let anomalieMoyenne = parseInt(subarray[9]);
                let pays = subarray[10].substring(2, subarray[10].length - 1);
                let semiMajorAxis = parseInt(subarray[11]);
                let semiMinorAxis = parseInt(subarray[12]);
                let arg = parseInt(subarray[13]) - 90;
                let modelMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(
                    Cesium.Cartesian3.fromDegrees(longitude, latitude, altitude));
                let rotateMatrix = Cesium.Matrix3.fromRotationY(Cesium.Math.toRadians(0.0));
                let rotation4 = Cesium.Matrix4.fromRotationTranslation(rotateMatrix, Cesium.Cartesian3.ZERO);
                let rotatedModel = Cesium.Matrix4.multiply(modelMatrix, rotation4, modelMatrix);
                let satellite = viewer.entities.add({
                    name: nameSat,
                    position: Cesium.Cartesian3.fromDegrees(longitude, latitude, altitude),
                    model: {
                        uri: '/static/satellite_models/ISSComplete1.glb',
                        scale: 200000.0
                    },
                    description: "\
                                <p>\
                                  This is the satellite : " + nameSat + ". <br /> \
                                  <br />Id : " + idSat + " <br />\
                                  Category : " + category + " <br /> \
                                  Longitude : " + longitude + " °<br /> \
                                  Latitude : " + latitude + " °<br />\
                                  Altitude : " + String(altitude).substring(0, String(altitude).length - 3) +
                    " km.<br /> \
                                      Orbit type : " + orbitType + " <br /> \
                                  Country : " + pays + " <br />\
                                </p>\
                                <p>\
                                  Source: \
                                  <a style='color: WHITE'\
                                    target='_blank'\
                                    href='https:www.celestrak.com/NORAD/elements/science.txt'>Celestrak</a>\
                                </p>"
                });
                let ellipseCenterDistanceFromEarthSurface = (semiMajorAxis ** 2 - semiMinorAxis ** 2) ** 0.5 -
                    6371000;
                if (inclinaison > 90) {
                    inclinaison = inclinaison - 180;
                } else {
                }
                let inclinaisonRadians = inclinaison * (6.28 / 360);
                longitudeNoeud = longitudeNoeud - 90;
                let argRadians = arg * (6.28 / 360);
                let theta = Math.acos(Math.cos(argRadians) * Math.sin(inclinaisonRadians)) * (360 / 6.28) - 90;
                let phi = Math.acos(Math.cos(argRadians) * Math.cos(inclinaisonRadians) /
                    Math.pow(Math.pow(Math.cos(argRadians) * Math.cos(inclinaisonRadians), 2) +
                        Math.pow(Math.sin(argRadians), 2), 0.5)) * (360 / 6.28);
                let trajectory = [];
                if (0 < arg && arg < 180) {
                    trajectory = viewer.entities.add({
                        name: nameSat,
                        position: Cesium.Cartesian3.fromDegrees(longitudeNoeud + phi,
                            -theta,
                            ellipseCenterDistanceFromEarthSurface),
                        ellipsoid: {
                            radii: new Cesium.Cartesian3(semiMajorAxis, semiMinorAxis, 1),
                            material: Cesium.Color.BLUE,
                            fill: false,
                            outline: true,
                            outlineColor: Cesium.Color.BLUE,
                            slicePartitions: 0,
                            stackPartitions: 2
                        },
                        orientation: Cesium.Transforms.headingPitchRollQuaternion(
                            Cesium.Cartesian3.fromDegrees(longitudeNoeud + phi,
                                -(Math.acos(Math.sin(inclinaisonRadians)) * (360 / 6.28) - 90),
                                ellipseCenterDistanceFromEarthSurface),
                            new Cesium.HeadingPitchRoll(Cesium.Math.toRadians(0),
                                Cesium.Math.toRadians(90) + argRadians,
                                Cesium.Math.toRadians(90))),
                        description: "\
                                <p>\
                                  This is the trajectory of the satellite : " + nameSat + ". <br /> \
                                  <br />Id : " + idSat + " <br />\
                                  Category : " + category + " <br /> \
                                  Orbit type : " + orbitType + " <br /> \
                                  Node Longitude : " + longitudeNoeud + " °<br /> \
                                  Inclinaison : " + inclinaison + " °<br />\
                                  Periastris Argument : " + arg + " °<br /> \
                                  Mean Anomaly : " + anomalieMoyenne + " °<br /> \
                                  Semi Minor Axis : " + String(semiMinorAxis).substring(0,
                            String(semiMinorAxis).length - 3) + " km. <br /> \
                                  Semi Major Axis : " + String(semiMajorAxis).substring(0,
                            String(semiMajorAxis).length - 3) + " km. <br /> \
                                  Country : " + pays + " <br />\
                                </p>\
                                <p>\
                                  Source: \
                                  <a style='color: WHITE'\
                                    target='_blank'\
                                    href='https:www.celestrak.com/NORAD/elements/science.txt'>Celestrak</a>\
                                </p>"
                    });
                } else {
                    trajectory = viewer.entities.add({
                        name: nameSat,
                        position: Cesium.Cartesian3.fromDegrees(longitudeNoeud + phi,
                            theta,
                            ellipseCenterDistanceFromEarthSurface),
                        ellipsoid: {
                            radii: new Cesium.Cartesian3(semiMajorAxis, semiMinorAxis, 1),
                            material: Cesium.Color.BLUE,
                            fill: false,
                            outline: true,
                            outlineColor: Cesium.Color.BLUE,
                            slicePartitions: 0,
                            stackPartitions: 2
                        },
                        orientation: Cesium.Transforms.headingPitchRollQuaternion(
                            Cesium.Cartesian3.fromDegrees(longitudeNoeud + phi,
                                (Math.acos(Math.sin(inclinaisonRadians)) * (360 / 6.28) - 90),
                                ellipseCenterDistanceFromEarthSurface),
                            new Cesium.HeadingPitchRoll(Cesium.Math.toRadians(0),
                                Cesium.Math.toRadians(90) + argRadians,
                                Cesium.Math.toRadians(90))),
                        description: "\
                                <p>\
                                  This is the trajectory of the satellite : " + nameSat + ". <br /> \
                                  <br />Id : " + idSat + " <br />\
                                  Category : " + category + " <br /> \
                                  Orbit type : " + orbitType + " <br /> \
                                  Node Longitude : " + longitudeNoeud + " °<br /> \
                                  Inclinaison : " + inclinaison + " °<br />\
                                  Periastris Argument : " + arg + " °<br /> \
                                  Mean Anomaly : " + anomalieMoyenne + " °<br /> \
                                  Semi Minor Axis : " +
                        String(semiMinorAxis).substring(0, String(semiMinorAxis).length - 3) + " km. <br /> \
                                  Semi Major Axis : " +
                        String(semiMajorAxis).substring(0, String(semiMajorAxis).length - 3) + " km. <br /> \
                                  Country : " + pays + " <br />\
                                </p>\
                                <p>\
                                  Source: \
                                  <a style='color: WHITE'\
                                    target='_blank'\
                                    href='https:www.celestrak.com/NORAD/elements/science.txt'>Celestrak</a>\
                                </p>"
                    });
                }
                if (trajectoryPosition % 2 === 0) {
                    // If the Trajectory button is not clicked, we hid the ellipse created.
                    trajectory.show = false;
                }
                points.push(satellite);
                points.push(trajectory);
            }

            if (array.length === 1) {
                // If only one object is created, we can put the camera on him.
                viewer.camera.flyTo({
                    destination: Cesium.Cartesian3.fromDegrees(longitude, latitude, altitude + 10000000)
                });
                viewer.selectedEntity = points[0];
            } else {
            }
        },
        error: function (resultat, statut, erreur) {
            // alert(erreur);
        }
    });
    return points;
}


function localisation(position) {

    if (navigator.geolocation) {

        MYPOSITION.push(viewer.entities.add({
            name: 'You are here',
            position: Cesium.Cartesian3.fromDegrees(position.coords.longitude,
                position.coords.latitude, position.coords.altitude + 2000000 / 2),
            orientation: Cesium.Transforms.headingPitchRollQuaternion(
                Cesium.Cartesian3.fromDegrees(position.coords.longitude,
                    position.coords.latitude, position.coords.altitude + 40000000 / 2),
                new Cesium.HeadingPitchRoll(Cesium.Math.toRadians(0), Cesium.Math.toRadians(180), 0)),
            cylinder: {
                length: 2000000.0,
                topRadius: 400,
                bottomRadius: 1000000.0,
                material: Cesium.Color.GREEN.withAlpha(0.3)
            }
        }));

        viewer.camera.flyTo({
            destination: Cesium.Cartesian3.fromDegrees(position.coords.longitude,
                position.coords.latitude,
                position.coords.altitude + 10000000)
        });
    }
}

function afficherBeidou() {
    return display("satellite_name", "BEIDOU");
}

function afficherGalileo() {
    return display("category", "Galileo");
}

function afficherLEO() {
    return display("orbit", "LEO (Low Earth Orbit)");
}

function afficherMEO() {
    return display("orbit", "MEO (Medium Earth Orbit)");
}

function afficherGEO() {
    return display("orbit", "GEO (Geostationnary Earth Orbit)");
}

function afficherHEO() {
    return display("orbit", "HEO (High Earth Orbit)");
}

function afficherWeather() {
    return display("category", "Weather");
}


function afficherSES() {
    return display("category", "Space and Earth Science");
}

function afficherNOAA() {
    return display("category", "NOAA");
}

function afficherGOES() {
    return display("category", "GOES");
}

function afficherIridium() {
    return display("satellite_name", "IRIDIUM");
}

function afficherGPS() {
    return display("category", "GPS Operationnal");
}

function afficherCubeSats() {
    return display("category", "CubeSats");
}

function afficherEngineering() {
    return display("category", "Engineering");
}

function afficherSpaceStations() {
    return display("category", "Space Stations");
}

function afficherISS() {
    return display("satellite_name", "ISS (ZARYA)");
}

function afficherGeodetic() {
    return display("category", "Geodetic");
}

function noButtonIsClicked() {
    let nbClicked = 0;
    for (let i = 0; i < objets.length; i++) {                // We check if a button is clicked,
        if (objets[i][0] % 2 === 0) {                    // Because if no one is clicked,
            nbClicked++;                                // We don't need to update
        }
    }
    return (nbClicked > 0)
}

function buttonFunctionnement(idButton, fonction) {
    objets[idButton][0]++;                                            // We increment the button counter
    if (objets[idButton][0] % 2 === 0) {                               // If it's unclicked
        objets[idButton][1] = fonction();                             // We create the objects associated
    } else {
        for (let i = 0; i < objets[idButton][1].length; i++) {        // Else, We delete the objects associated
            viewer.entities.remove(objets[idButton][1][i]);
        }
        objets[idButton][1] = [];
    }
}

function displayAllButtonClick() {
    $(this).toggleClass("down");
    buttonFunctionnement(19, displayAll);
}

function LocateMeClick() {
    $("#Localisation").toggleClass("down");
    objets[17][0]++;
    if (objets[17][0] % 2 === 0) {
        if (navigator.geolocation)
            objets[17][1] = navigator.geolocation.getCurrentPosition(localisation);
    } else {
        viewer.entities.remove(MYPOSITION.pop());
        objets[17][1] = [];
    }

}

function BeidouClick() {
    $(this).toggleClass("down");
    buttonFunctionnement(5, afficherBeidou);
}

function LEOClick() {
    $(this).toggleClass("down");
    buttonFunctionnement(0, afficherLEO);
}

function MEOClick() {
    $(this).toggleClass("down");
    buttonFunctionnement(1, afficherMEO);
}

function GEOClick() {
    $(this).toggleClass("down");
    buttonFunctionnement(2, afficherGEO);
}

function HEOClick() {
    $(this).toggleClass("down");
    buttonFunctionnement(3, afficherHEO);
}

function GalileoClick() {
    $(this).toggleClass("down");
    buttonFunctionnement(6, afficherGalileo);
}

function GeodeticClick() {
    $(this).toggleClass("down");
    buttonFunctionnement(10, afficherGeodetic);
}

function GOESClick() {
    $(this).toggleClass("down");
    buttonFunctionnement(13, afficherGOES);
}

function NOAAClick() {
    $(this).toggleClass("down");
    buttonFunctionnement(12, afficherNOAA);
}

function GPSClick() {
    $(this).toggleClass("down");
    buttonFunctionnement(4, afficherGPS);
}

function WeatherClick() {
    $(this).toggleClass("down");
    buttonFunctionnement(11, afficherWeather);
}

function SESClick() {
    $(this).toggleClass("down");
    buttonFunctionnement(14, afficherSES);
}

function SpaceStationsClick() {
    $(this).toggleClass("down");
    buttonFunctionnement(9, afficherSpaceStations);
}

function EngineeringClick() {
    $(this).toggleClass("down");
    buttonFunctionnement(8, afficherEngineering);
}

function CubeSatsClick() {
    $(this).toggleClass("down");
    buttonFunctionnement(7, afficherCubeSats);
}

function ISSClick() {
    $(this).toggleClass("down");
    buttonFunctionnement(15, afficherISS);
}

function Iridiumclick() {
    $(this).toggleClass("down");
    buttonFunctionnement(16, afficherIridium);
}

function listeNomCreation() {
    // We create a list containing all satellites'name.
    let liste = [];
    $.ajax({
        url: "/gravitaround/rechercheSat/",
        type: 'GET',
        dataType: 'html',
        success: function (code_html) {
            let satellite = code_html.substring(1, code_html.length - 1);
            let array = satellite.split(")(");
            for (let i = 0; i < array.length; i++) {
                let element = array[i].split(",");
                liste.push({
                    label: element[0].substring(1, element[0].length - 1),
                    category: element[1].substring(2, element[1].length - 1)
                });
            }
        },
        error: function (resultat, statut, erreur) {
            // alert(erreur);
        }
    });

    return liste;
}

function listePaysCreation() {
    // We create a list containing all satellites'name.
    let liste = [];
    $.ajax({
        url: "/gravitaround/recherchePays/",
        type: 'GET',
        dataType: 'html',
        success: function (code_html) {
            let satellite = code_html.substring(1, code_html.length - 1);
            let array = satellite.split(",");
            for (let i = 0; i < array.length; i++) {
                let element = array[i].substring(1, array[i].length - 1);
                liste.push(element);
            }
        },
        error: function (resultat, statut, erreur) {
            // alert(erreur);
        }
    });
    return liste;
}

function listeFavorisCreation() {
    // We create a list containing all satellites'name.
    let liste = [];
    $.ajax({
        url: "/gravitaround/favourite_group/",
        type: 'GET',
        dataType: 'html',
        success: function (code_html) {
            code_html = code_html.substring(3, code_html.length - 4);
            code_html = code_html.split("'], ['");
            for (let i = 0; i < code_html.length; i++) {
                code_html[i].substring(1, code_html[i] - 1);
                liste.push(code_html[i].split("', '"));
            }
        },
        error: function (resultat, statut, erreur) {
            // alert(erreur);
        }
    });
    return liste;
}
