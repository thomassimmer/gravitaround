$( document ).ready(function() {
//au téléchargement du fichier
$( "form#auth" ).on( "submit", function( event ) {
// l'évènement se déclenche lors de la soumission du formulaire (click sur bouton login)

event.preventDefault();
// arrête l'envoi standard (html) du formulaire
$.ajax({
//requête ajax
url : 'python/login.py',
//fichier qui va traiter les données
type : 'POST',
// méthode d'envoi
data:
$( this ).serialize() ,
// tous les paramètres du formulaire à transmettre au fichier login.py
dataType : 'html'
// type des données retournées ici html
}
.done(
function(resultat){
// en cas de succès
//erreur d'authentification ,
affichage du message renvoyé par login.py dans la div id=msg
if (resultat==0)
{$('#msg').html("erreur d'authentification");}
else
//redirection vers la page privée quand authentification ok
{
location.href="python/prive.py/index";
}
})
.fail(
function(donnee, statut, erreur)
// { alert('erreur');})
;
// en cas d'erreur lors du transfert
});
// fin du  $.ajax
});
// fin du   $("p.login button").click(function()
});
// fin du $( document ).ready(function()

define ('NOM_BD','bd_tsa');