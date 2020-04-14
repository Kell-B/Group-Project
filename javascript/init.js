(function($) {
	$(function() {
		$('.sidenav').sidenav();
		$('.parallax').parallax();
	}); // end of document ready
})(jQuery); // end of jQuery name space

$('.dropdown-trigger').dropdown({
	coverTrigger   : false,
	hover          : true,
	constrainWidth : false,
	inDuration     : 350
});

// var modal = document.getElementById('modal');

// var btn = document.getElementById("modbtn");

// var span = document.getElementsByClassName("close")[0];

// btn.onclick = function() {
//   modal.style.display = "block";
// }

// span.onclick = function() {
//   modal.style.display = "none";
// }

// window.onclick = function(event) {
//   if (event.target == modal) {
//     modal.style.display = "none";
//   }
// }
