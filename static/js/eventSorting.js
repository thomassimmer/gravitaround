


// We create a list of list for each button, useful to call them
let objets = [["#AfficherLEOButton", "orbit", "LEO (Low Earth Orbit)"],
["#AfficherMEOButton", "orbit", "MEO (Medium Earth Orbit)"],
["#AfficherGEOButton", "orbit", "GEO (Geostationnary Earth Orbit)"],
["#AfficherHEOButton", "orbit", "HEO (High Earth Orbit)"],
["#AfficherGPSButton", "category", "GPS Operationnal"],
["#AfficherBeidouButton", "satellite_name", "BEIDOU"],
["#AfficherGalileoButton", "category", "Galileo"],
["#AfficherCubeSatsButton", "category", "CubeSats"],
["#AfficherEngineeringButton", "category", "Engineering"],
["#AfficherSpaceStationsButton", "category", "Space Stations"],
["#AfficherGeodeticButton", "category", "Geodetic"],
["#AfficherWeatherButton", "category", "Weather"],
["#AfficherNOAAButton", "category", "NOAA"],
["#AfficherGOESButton", "category", "GOES"],
["#AfficherSESButton", "category", "Space and Earth Science"],
["#AfficherISSButton", "satellite_name", "ISS (ZARYA)"],
["#AfficherIridiumButton", "satellite_name", "IRIDIUM"],
["#Localisation", null, null],
["#rechercheBar", "satellite_name", null],
["#afficherButton", "", ""],
["#recherchePaysBar", "country", null]
];

let satellites = [];
let trajectories = [];

let MYPOSITION = []; // Will contain the cone created by the geolocation, useful to delete it.
let enableTrajectory = false;  // even if the button is not clicked, odd else.
var viewer;

let paysRecherche;
let favoris;
let nomRecherche;
async function init() {
    // await updateDb();

    paysRecherche = listePaysCreation();
    favoris = listeFavorisCreation();
    nomRecherche = listeNomCreation();
    $('#loading').hide();

}

$(document).ready(function () {
    if (document.location.href.includes("connexion")) {
        $('#register').toggleClass("whitecolor");
    }
    else if (document.location.href.includes("contact")) {
        $('#contact').toggleClass("whitecolor");
    }
    else if (document.location.href.includes("favourite")) {
        $('#favourites').toggleClass("whitecolor");
    }
    else {
        $('#globe').toggleClass("whitecolor");

        Cesium.Ion.defaultAccessToken = null;

        //Create a CesiumWidget without imagery, if you haven't already done so.
        viewer = new Cesium.Viewer('cesiumContainer', {
            imageryProvider: new Cesium.ArcGisMapServerImageryProvider({
                url: 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer'
            }),
            timeline: false,
            animation: false,
            fullscreenButton: false,
            geocoder: false,
            selectionIndicator: false
        });

        // create all objects
        init();
    }

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
        display(18, ui.item.value);
    });

    $('#rechercheBar').click(function () {
        // When we click on search bar, the previous satellite's name disappear and the button is unclicked
        document.getElementById("rechercheBar").value = "";
        if (satellites[18]) {
            satellites[18].removeAll();
            trajectories[18].removeAll();
        }
    })

    $("#recherchePaysBar").autocomplete({
        source: paysRecherche,
        position: {
            my: 'bottom',
            at: 'top'
        }
    });

    $('#recherchePaysBar').on('autocompleteselect', function (e, ui) {
        $(this).toggleClass("down");
        display(20, ui.item.value);
    });

    $('#recherchePaysBar').click(function () {
        document.getElementById("recherchePaysBar").value = "";
        if (satellites[20]) {
            satellites[20].removeAll();
            trajectories[20].removeAll();
        }
    });

    $("#updateButton").click(function () {
        update();
        $(this).toggleClass("down");
    });

    $("#supprimerButton").click(function () {
        for (let i = 0; i < objets.length; i++) {
            $(objets[i][0]).removeClass("down");
        }
        deleteAll();
        document.getElementById("rechercheBar").value = "";
        viewer.camera.flyTo({ destination: Cesium.Cartesian3.fromDegrees(-35, 30, 30000000) });
        // We come back to an initial camera position
    });

    $("#afficherButton").click(function displayAllButtonClick() {
        display(19);
    });

    $("#activateTrajectory").click(function () {
        enableTrajectory = !enableTrajectory;
        for (let trajectory of trajectories) {
            if (trajectory)
                trajectory.show = enableTrajectory;
        }
    });

    $("#Localisation").click(function () {
        LocateMeClick();
    });

    $("#AfficherBeidouButton").click(function BeidouClick() {
        display(5);
    });

    $("#AfficherLEOButton").click(function LEOClick() {
        display(0);
    });

    $("#AfficherMEOButton").click(function MEOClick() {
        display(1);
    });

    $("#AfficherGEOButton").click(function GEOClick() {
        display(2);
    });

    $("#AfficherHEOButton").click(function HEOClick() {
        display(3);
    });

    $("#AfficherGalileoButton").click(function GalileoClick() {
        display(6);
    });

    $("#AfficherGeodeticButton").click(function GeodeticClick() {
        display(10);
    });

    $("#AfficherGOESButton").click(function GOESClick() {
        display(13);
    });

    $("#AfficherNOAAButton").click(function NOAAClick() {
        display(12);
    });

    $("#AfficherGPSButton").click(function GPSClick() {
        display(4);
    });

    $("#AfficherWeatherButton").click(function WeatherClick() {
        display(11);
    });

    $("#AfficherSESButton").click(function SESClick() {
        display(14);
    });

    $("#AfficherSpaceStationsButton").click(function SpaceStationsClick() {
        display(9);
    });

    $("#AfficherEngineeringButton").click(function EngineeringClick() {
        display(8);
    });

    $("#AfficherCubeSatsButton").click(function CubeSatsClick() {
        display(7);
    });

    $("#AfficherISSButton").click(async function ISSClick() {
        await display(15);
    });

    $("#AfficherIridiumButton").click(function Iridiumclick() {
        display(16);
    });

    $("#openNav").click(function () {
        $('#tri').toggle(500);
    })

    $('#tri').toggle(0);
});

function updateDb() {
    return $.ajax({
        url: "/gravitaround/update/",
        type: 'GET',
        dataType: 'html'
    });
}

function getDb(data) {
    return $.ajax({
        url: "/gravitaround/display/",
        type: 'POST',
        data: data,
        dataType: 'html'
    });
}

async function createNewObject(idButton, nameSat = '') {
    let colonne = objets[idButton][1];
    let like = nameSat || objets[idButton][2];
    let data = {
        colonne: colonne,
        like: like
    };
    let code_html = await getDb(data);
    console.log("request finished")
    let satelliteData = code_html.substring(1, code_html.length - 1);
    let array = satelliteData.split("][");
    console.log(array.length);
    for (let sat = 0; sat < array.length; sat++) {
        let subarray = array[sat].split(",");
        let idSat = parseInt(subarray[0]);
        let nameSat = subarray[1].substring(2, subarray[1].length - 1);
        let category = subarray[2].substring(2, subarray[2].length - 1);
        let orbitType = subarray[3].substring(2, subarray[3].length - 1);
        let longitude = parseFloat(subarray[4]);
        let latitude = parseFloat(subarray[5]);
        let altitude = parseInt(subarray[6]);
        let inclinaison = parseFloat(subarray[7]);
        let longitudeNoeud = parseFloat(subarray[8]);
        let anomalieMoyenne = parseFloat(subarray[9]);
        let pays = subarray[10].substring(2, subarray[10].length - 1);
        let semiMajorAxis = parseFloat(subarray[11]);
        let semiMinorAxis = parseFloat(subarray[12]);
        let eccentricity = Math.pow(1 - (Math.pow(semiMinorAxis, 2) / Math.pow(semiMajorAxis, 2)), 0.5);
        let arg = parseFloat(subarray[13]);

        let position = Cesium.Cartesian3.fromDegrees(longitude, latitude, altitude);
        let description = "\
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
                    </p>" ;

        let satEntity = viewer.entities.add({
            id: nameSat,
            name: nameSat,
            model: {
                uri: '/static/satellite_models/ISSComplete1.glb',
                scale: 200000.0
            },
            position: position,
            description: description,
            show: true
        });

        satellites[idButton].add(satEntity);

        let ellipseDescription = "\
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
            </p>";
        let ellipsePoints = createPathForEllipse(semiMajorAxis, eccentricity, longitudeNoeud, inclinaison, arg);

        let trajEntity = viewer.entities.add({
            id: nameSat + "_traj",
            name: nameSat,
            polyline: {
                positions: ellipsePoints,
                material: Cesium.Color.BLUE
            },
            description: ellipseDescription,
            show: true
        });
        trajectories[idButton].add(trajEntity);
    }
    trajectories[idButton].show = enableTrajectory;
}

async function updateOnlyShownObjects() {
    let colonne = ""
    let like = "";
    let data = {
        colonne: colonne,
        like: like
    };

    let code_html = await getDb(data);
    let satelliteData = code_html.substring(1, code_html.length - 1);
    let array = satelliteData.split("][");
    for (let sat = 0; sat < array.length; sat++) {
        let subarray = array[sat].split(",");
        let idSat = parseInt(subarray[0]);
        let nameSat = subarray[1].substring(2, subarray[1].length - 1);

        let satellite = viewer.entities.getById(nameSat);
        let ellipse = viewer.entities.getById(nameSat + "_traj");

        if (!satellite) continue;

        let category = subarray[2].substring(2, subarray[2].length - 1);
        let orbitType = subarray[3].substring(2, subarray[3].length - 1);
        let longitude = parseFloat(subarray[4]);
        let latitude = parseFloat(subarray[5]);
        let altitude = parseInt(subarray[6]);
        let inclinaison = parseFloat(subarray[7]);
        let longitudeNoeud = parseFloat(subarray[8]);
        let anomalieMoyenne = parseFloat(subarray[9]);
        let pays = subarray[10].substring(2, subarray[10].length - 1);
        let semiMajorAxis = parseFloat(subarray[11]);
        let semiMinorAxis = parseFloat(subarray[12]);
        let eccentricity = Math.pow(1 - (Math.pow(semiMinorAxis, 2) / Math.pow(semiMajorAxis, 2)), 0.5);
        let arg = parseFloat(subarray[13]);

        let position = Cesium.Cartesian3.fromDegrees(longitude, latitude, altitude);
        let description = "\
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
                    </p>" ;
        satellite.position = position;
        satellite.description = description;


        let ellipseDescription = "\
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
                    </p>";
        let ellipsePoints = createPathForEllipse(semiMajorAxis, eccentricity, arg, inclinaison, longitudeNoeud);

        ellipse.polyline.positions = ellipsePoints;
        ellipse.description = ellipseDescription;

    }
}

async function update() {

    let start = performance.now();
    console.log("update")
    $("#updateButton").toggleClass("down");
    // Uploading is complete, we put the button off
    try {
        let result = await updateDb();
        console.log("db updated", objets.length);
        await updateOnlyShownObjects();
    } catch (e) {
        console.log(e)
    }
    let end = performance.now();
    console.log("finished update, time : ", (end - start) / 1000)
    $("#updateButton").toggleClass("down");
}

function displayAll() {
    for (let i = 0; i < objets.length; i++) {
        display(i);
    }
}

function deleteAll() {
    for (let satellite of satellites) {
        if (satellite) satellite.show = false;
    }
    for (let trajectory of trajectories) {
        if (trajectory) trajectory.show = false;
    }
    viewer.selectedEntity = null;
}

async function display(idButton, nameSat = '') {

    $(objets[idButton][0]).toggleClass("down");

    // check if collection exists
    if (satellites[idButton]) {
        satellites[idButton].show = !satellites[idButton].show;
        trajectories[idButton].show = satellites[idButton].show ? enableTrajectory : false;
        if (!satellites[idButton].show)
            viewer.selectedEntity = null;
        else 
            if (satellites[idButton].values.length == 1) {
                zoomToEntity(satellites[idButton].values[0]);
            }
    }
    else {
        satellites[idButton] = new Cesium.EntityCollection(idButton);
        trajectories[idButton] = new Cesium.EntityCollection(idButton);
        await createNewObject(idButton, nameSat);
        if (satellites[idButton].values.length == 1) {
            zoomToEntity(satellites[idButton].values[0]);
        }
    }
}

function zoomToEntity(entity) {
    let position = Cesium.Cartographic.fromCartesian(entity.position.getValue());
    // If only one object is created, we can put the camera on him.
    viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromRadians(position.longitude, position.latitude, position.height + 10000000)
    });
    viewer.selectedEntity = entity;
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

function LocateMeClick() {
    $("#Localisation").toggleClass("down");
    objets[17][0]++;
    if (objets[17][0]) {
        if (navigator.geolocation)
            objets[17][1] = navigator.geolocation.getCurrentPosition(localisation);
    } else {
        MYPOSITION.pop().show = false;
        objets[17][1] = [];
    }

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


function createPathForEllipse(a, e, W, i, w) {
    let path = [];

    // from meter to AU
    a = a / 1.496e+11;
    // from deg to rad
    W = W * 2 * Math.PI / 360;
    i = i * 2 * Math.PI / 360;
    w = w * 2 * Math.PI / 360;

    for (let M = 0; M < 2 * Math.PI; M += 0.1) {

        let E = M;
        while (true) {
            var dE = (E - e * Math.sin(E) - M) / (1 - e * Math.cos(E));
            E -= dE;
            if (Math.abs(dE) < 1e-6) break;
        }

        var P = a * (Math.cos(E) - e);
        var Q = a * Math.sin(E) * Math.sqrt(1 - Math.pow(e, 2));

        // rotate by argument of periapsis
        var x = Math.cos(w) * P - Math.sin(w) * Q;
        var y = Math.sin(w) * P + Math.cos(w) * Q;
        // rotate by inclination
        var z = Math.sin(i) * y;
        y = Math.cos(i) * y;
        // rotate by longitude of ascending node
        var xtemp = x;
        x = Math.cos(W) * xtemp - Math.sin(W) * y;
        y = Math.sin(W) * xtemp + Math.cos(W) * y;

        // from AU to meters
        x = x * 1.496e+11;
        y = y * 1.496e+11;
        z = z * 1.496e+11;

        let position = new Cesium.Cartesian3(x, y, z);
        path.push(position);
    }
    return path
}