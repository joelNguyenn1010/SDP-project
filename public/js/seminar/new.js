var today = new Date();
var dd = today.getDate()-1;
var mm = today.getMonth()+1; //January is 0!
var yyyy = today.getFullYear();

var anchor = document.getElementById("date"); 
var att = document.createAttribute("min");        
att.value = `${yyyy}-${mm}-${dd}`;           
anchor.setAttributeNode(att);

document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('.datepicker');
    var instances = M.Datepicker.init(elems, options);
  });

  // Or with jQuery

  $(document).ready(function(){
    $('.datepicker').datepicker();
  });