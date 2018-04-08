$(document).ready(function() {
    updateStatus();
  
    $( "#runbutton" ).click(function() {
        jQuery.ajax("/run").done(function() {
            updateStatus();
        })
    });
  
    $( "#refreshbutton" ).click(function() {
        window.setTimeout(updateStatus,1000);
    });
});

function updateStatus() {
    jQuery.ajax( { url:"/status",
    type:"GET",
    dataType:"json"
    }).done( function(json) {
        console.log(json);
        $('#output').val(json.output);
        $('#errors').val(json.err);
    });
}