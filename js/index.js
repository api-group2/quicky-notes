(function($)
{
    /**
     * Auto-growing textareas; technique ripped from Facebook
     *
     * http://github.com/jaz303/jquery-grab-bag/tree/master/javascripts/jquery.autogrow-textarea.js
     */
    $.fn.autogrow = function(options)
    {
        return this.filter('textarea').each(function()
        {
            var self         = this;
            var $self        = $(self);
            var minHeight    = $self.height();
            var noFlickerPad = $self.hasClass('autogrow-short') ? 0 : parseInt($self.css('lineHeight')) || 0;

            var shadow = $('<div></div>').css({
                position:    'absolute',
                top:         -10000,
                left:        -10000,
                width:       $self.width(),
                fontSize:    $self.css('fontSize'),
                fontFamily:  $self.css('fontFamily'),
                fontWeight:  $self.css('fontWeight'),
                lineHeight:  $self.css('lineHeight'),
                resize:      'none',
                'word-wrap': 'break-word'
            }).appendTo(document.body);

            var update = function(event)
            {
                var times = function(string, number)
                {
                    for (var i=0, r=''; i<number; i++) r += string;
                    return r;
                };

                var val = self.value.replace(/</g, '&lt;')
                                    .replace(/>/g, '&gt;')
                                    .replace(/&/g, '&amp;')
                                    .replace(/\n$/, '<br/>&nbsp;')
                                    .replace(/\n/g, '<br/>')
                                    .replace(/ {2,}/g, function(space){ return times('&nbsp;', space.length - 1) + ' ' });

                // Did enter get pressed?  Resize in this keydown event so that the flicker doesn't occur.
                if (event && event.data && event.data.event === 'keydown' && event.keyCode === 13) {
                    val += '<br />';
                }

                shadow.css('width', $self.width());
                shadow.html(val + (noFlickerPad === 0 ? '...' : '')); // Append '...' to resize pre-emptively.
                $self.height(Math.max(shadow.height() + noFlickerPad, minHeight));
            }

            $self.change(update).keyup(update).keydown({event:'keydown'},update);
            $(window).resize(update);

            update();
        });
    };
})(jQuery);


var noteTemp =  '<div class="note">'
				+	'<a href="javascript:;" class="button remove">X</a>'
				+ 	'<div class="note_cnt">'
				+		'<textarea id="titre" class="title" placeholder="Titre"></textarea>'
				+ 		'<textarea id="entrytxt" class="cnt" placeholder="" onchange="noteChanged(this.value)"></textarea>'
				+	'</div> '
				+'</div>';

var noteZindex = 0;
function deleteNote(){
    $(this).parent('.note').hide("puff",{ percent: 133}, 250);
};

function newNote() {
	
  $(noteTemp).hide().appendTo("#board").show("fade", 300).draggable().on('dragstart',
    function(){
       $(this).zIndex(++noteZindex);
    });
 
	$('.remove').click(deleteNote);
	$('textarea').autogrow();
	
  $('.note')
	return false; 
};

function noteChanged(val){
	var http=new XMLHttpRequest();

	var url = "http://groups.cowaboo.net/group2/public/api/entry?";
	var params = "secretKey="+encodeURIComponent("SBHHRGLVRTJBLQBD5HO5V7DBKBUVGN57SY4F4ZSP434Z7MDYPWOF3WSO");

	params    += "&observatoryId="+encodeURIComponent("Tache");

	var tag = document.getElementById("titre").value; //Création de tags dans l'api basé sur le titre de note
	if(tag.length==0){
			alert("veuillez introduire un tags valide !");
			return;
	}
	
	params    += "&tags="+encodeURIComponent(tag);
	params    += "&value="+encodeURIComponent(val);
	http.open("POST", url, true);

	//Send the proper header information along with the request+
	http.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	http.setRequestHeader("Accept", "application/json");
	http.setRequestHeader("Accept", "application/x-www-form-urlencoded");
	http.setRequestHeader("Content-length", params.length);
	http.setRequestHeader("Connection", "close");

	http.onreadystatechange = function() {//Call a function when the state changes.
	    if(http.readyState == 4 && http.status == 200) {

	        //alert(http.responseText);
	   

	    }
	}
	http.send(params);
};
	



$(document).ready(function() {
    
    $("#board").height($(document).height());
    
    $("#add_new").click(newNote);
    
    $('.remove').click(deleteNote);
    newNote();
	
	  
    return false;
});