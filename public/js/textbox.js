 //Add draggable short text
 var t=0;
 function addShortText() {
   $('body').append('<div id="d'+t+'" class="inputDrag draggable"><input style="border: none; width: 118px; background: none" value="input field"></input></div>');
   $('.draggable').draggable({
         connectWith: '#trash'
       });

   //selected = $('#d'+t);
   $('.ui-resizable').removeClass( "ui-resizable" );
   t++;
}

 //Add draggable & resizable text box for paragraph

function addParagraph() {
   $('body').append('<div id="d'+t+'" class="paraDrag draggable"><textarea class="textbox">para</textarea></div>');
   $( "textarea" ).attr('display', 'inline-block');
   

   $('.draggable').draggable({
           connectWith: '#trash'
       });
   $('#d'+t).resizable({
           containment: $('.storyBoard')
       });
   //selected = $('#d'+t);
   $('.ui-resizable').removeClass( "ui-resizable" );
   t++;
}


 