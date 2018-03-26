var color =  '#505050';  // This is the drawing color
var radius = 3;           // Constant radio for the line
var socket = io();        // websocket to the server
var previousPosition=[0,0]; // previous position to draw a line from
var ctx = Sketch.create(); //Creating the drawing context
var firstMessage=true;    // What the first message, to start on the first value
var style = 'Line';
    // var background = new Image();
    // background.src = "https://i.ytimg.com/vi/0apHD_h8enU/maxresdefault.jpg";

    // Make sure the image is loaded first otherwise nothing will draw.
    // background.onload = function(){
    //     ctx.drawImage(background,0,0);   
    // }
    
    //container.style.backgroundColor='red';//"url('https://i.ytimg.com/vi/0apHD_h8enU/maxresdefault.jpg')";
    ctx.container = document.getElementById( 'container' ); //reference drawing canvas
    ctx.autoclear= false; // making sure it stays
    ctx.retina='auto';
    ctx.setup = function() { console.log( 'setup' );} // Setup all variables
    ctx.keydown= function() { if ( ctx.keys.C ) ctx.clear();} // handeling keydowns
    // Color form selection
    form = document.getElementById('colorForm');
    form.addEventListener("click", function(event){
      event.preventDefault();
      select = document.getElementById("colorSelect");
      console.log(select.value);
      if (select.value == 'red') {
        color = '#ff0000';
      }else if (select.value == 'blue') {
        color = '#00bfff';
      }else if (select.value == 'green') {
        color = '#008000';
      }else {
        color = '#505050';
      }
    });
    // Stroke form selection
    formStroke = document.getElementById('strokeForm');
    formStroke.addEventListener("click", function(event){
      event.preventDefault();
      select = document.getElementById("strokeSelect");
      console.log(select.value);
      if (select.value == '3') {
        radius = 3;
      }else if (select.value == '7') {
        radius = 7;
      }else if (select.value == '15') {
        radius = 15;
      }else {
        radius = 20;
      }
    });
    // Select line style
    formStyle = document.getElementById('lineStyle');
    formStyle.addEventListener("click", function(event){
      event.preventDefault();
      select = document.getElementById("lineStyleSelect");
      console.log(select.value);
      style = select.value;
    });


    

    socket.on('reset', function() { // on a 'reset' message clean and reste firstMessage
      firstMessage=true;
      ctx.clear();
    });

    socket.on('new-pos', function(newPosition) { // handling new sensor values

      //Map the incoming 10-bit numbers to the height and width of the screen.
      // See https://github.com/soulwire/sketch.js/wiki/API for sketch references
      newPosition[0] = newPosition[0] / 1023 * screen.width;
      newPosition[1] = newPosition[1] / 1023 * screen.height;

      if(firstMessage){ // if its the first message store that value as previous
        firstMessage=false;
        previousPosition=newPosition;
      }else{ // any other message we use to draw.
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.fillStyle = ctx.strokeStyle = color;
        ctx.lineWidth = radius;
        ctx.beginPath();  //begin a adrawing
        ctx.moveTo( previousPosition[0], previousPosition[1] ); // from
        if (style == 'Line') {
          ctx.lineTo( newPosition[0],  newPosition[1]);
        }else if (style == 'Pi'){
          ctx.arc( newPosition[0],  newPosition[1], 20, 0, PI);
        }else{
          ctx.arc( newPosition[0],  newPosition[1], 20, 0, TWO_PI); // to
        }
        ctx.stroke(); // and only draw a stroke
        previousPosition=newPosition; // update to the new position.
       }
    });
