let liste_favoris = [,];

let nomRecherche = listeNomCreation();

$(document).ready(function()
{

$('#group_name').keypress( function (e) {
        if ( e.keyCode === 13 ){
              let name = document.getElementById("group_name").value;
              liste_favoris[0] = name;
              document.getElementById("display_group").innerHTML= "Group's name : "+name ;
        }
    });

$('#group_name').click(function(){
          // When we click on search bar, the previous satellite's name disappear and the button is unclicked
          document.getElementById("group_name").value= "" ;

      });


$( function() {
      $.widget( "custom.catcomplete", $.ui.autocomplete, {
        _create: function() {
          this._super();
          this.widget().menu( "option", "items", "> :not(.ui-autocomplete-category)" );
        },
        _renderMenu: function( ul, items ) {
          let that = this,
            currentCategory = "";
          $.each( items, function( index, item ) {
            let li;
            if ( item.category !== currentCategory ) {
              ul.append( "<li class='ui-autocomplete-category'>" + item.category + "</li>" );
              currentCategory = item.category;
            }
            li = that._renderItemData( ul, item );
            if ( item.category ) {
              li.attr( "aria-label", item.category + " : " + item.label );
            }
          });
        }
      });

      $( "#sat_name").catcomplete({
          // Create the autocompletion above the search bar, with for source, list of all satellites'name sorted by their category
          source : nomRecherche,
          position : {
              my : 'bottom',
              at : 'top'
          }
      });


      $('#sat_name').keypress( function (e) {
        if ( e.keyCode === 13 ){
              let sat = document.getElementById("sat_name").value;
              liste_favoris[1] += ',' + sat;
              document.getElementById("display_sat").innerHTML += "</br> • "+sat ;
        }
      });

      $('#sat_name').click(function(){
          // When we click on search bar, the previous satellite's name disappear and the button is unclicked
          document.getElementById("sat_name").value= "" ;

      });

    });

$('#enter_button').click(function(){
          // When we click on search bar, the previous satellite's name disappear and the button is unclicked
          document.getElementById("enter_button").value= "Done !" ;
          let data = {nom: liste_favoris[0],
                      sat_list: liste_favoris[1],
                      user_id: document.getElementById("user_id").innerHTML};
          $.ajax({
              url: "/gravitaround/group_creation/",
              type : 'POST',
              data : data,
              success : function(){
                  location.reload()
                  },
              error : function(resultat, statut, erreur){
                  alert("failed");
              }
          });
      });

$( "#delete_button0" ).click(function () {
          let nom = document.getElementById("groupe0").innerHTML;
          $(this).toggleClass("down");
          $.ajax({
               url : "http://localhost:8080/simmer_zaame_delair/Gravit\'Around/python/bdd.py/" +
               "delete_favourite_group?indice="+nom,
               type : 'GET',
               success : function(code_html, statut){
               },
               error : function(resultat, statut, erreur){
                    // alert(erreur);
               }
          });
          document.getElementById("groupe_0").innerHTML= "Done !" ;

    });


$( "#delete_button1" ).click(function () {
          let nom = document.getElementById("groupe1").innerHTML;
          $(this).toggleClass("down");
          $.ajax({
               url : "http://localhost:8080/simmer_zaame_delair/Gravit\'Around/python/bdd.py/" +
               "delete_favourite_group?indice="+nom,
               type : 'GET',
               success : function(){
                location.reload();
               },
               error : function(resultat, statut, erreur){
                    // alert(erreur);
               }
          });
          document.getElementById("groupe_1").innerHTML= "Done !" ;

    });


$( "#delete_button2" ).click(function () {
          let nom = document.getElementById("groupe2").innerHTML;
          $(this).toggleClass("down");
          $.ajax({
               url : "http://localhost:8080/simmer_zaame_delair/Gravit\'Around/python/bdd.py/" +
               "delete_favourite_group?indice="+nom,
               type : 'GET',
               success : function(){
                location.reload();
               },
               error : function(resultat, statut, erreur){
                    // alert(erreur);
               }
          });
          document.getElementById("groupe_2").innerHTML= "Done !" ;

    });

});


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
            }
        });

        return liste;
    }
