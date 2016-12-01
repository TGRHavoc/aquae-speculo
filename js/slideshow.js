/* DOCUMENT INFORMATION
    - Document: config.js
    - Version:  0.0.1
    - Client:   Aquae Speculo
    - Author:   Jordan Dalton

Basic slideshow made in JS. Would have used jQuery's Carosel but Amr doesn't want us to use jQuery?
This will have to do then 
*/

var slideInfo = {
	autoSpeed : 3.75, //Speed slideshow automatically changes slides. In seconds (Default = 0.5 seconds)
	//An array of slides (shown on desktops only.)
	slides: [
	{
		image : "images/slides/slide_0.jpg", //Image to show
		header : "OMG, AWESOME DEALZ!!", //Main text to show
		subtext : "Just kidding :D" //Sub text to show
	},
	{
		image : "images/slides/slide 1.jpg",
		header : "Look at this picture...",
		subtext : "Some more pointless text??"
	}
	]
};

var currentlyDisplayed;//The slide currently being displayed./

/*
//Allows for me to store the slide info in a seperate file (data/slides.json)
var xhttp = new XMLHttpRequest(); //Create a new request
xhttp.onreadystatechange = function(){ //When we've changed states 
	if (xhttp.readyState == 4 && xhttp.status == 200){ //We're good to go! AJAX ftw!!
		slideInfo = JSON.parse(xhttp.responseText); //Parse it!!
		slideLoaded();//We've loaded the info, time to show the slideshow
	}
};

xhttp.open("GET", slideshowVars.slides, true); //Prepare the request for the slide info
xhttp.send();// Send!!!! */

/*
Increases the slideshow by one image (Was going to make interactive)
*/
function increaseSlide(){
	var currentSlide = document.getElementById("slide_" + currentlyDisplayed); //Get the currently displayed slide
	
	var nextSlideI = (currentlyDisplayed + 1) % slideInfo.slides.length; //What are we showing next?
	var nextSlide = document.getElementById("slide_" + nextSlideI);//Get the next slide.

	currentSlide.className = "slide"; //Hide the current slide
	nextSlide.className += " show"; //Show the next slide.
	//FIX
	//if (debug)
	//	console.log("changed slide from " + currentlyDisplayed +  " to " + nextSlideI);
	//Change the currently being displayed slide.
	currentlyDisplayed = nextSlideI;
}

/*
Decreases the current slide by one.
function decreaseSlide(){
	var currentSlide = document.getElementById("slide_" + currentlyDisplayed);
	
	var nextSlideI = (currentlyDisplayed - 1) % slideInfo.slides.length;

	if(nextSlideI < 0)
		nextSlideI = slideInfo.slides.length -1;

	var nextSlide = document.getElementById("slide_" + nextSlideI);

	currentSlide.className = "slide";
	nextSlide.className += "show";

	if (debug)
		console.log("changed slide from " + currentlyDisplayed +  " to " + nextSlideI);
	
	currentlyDisplayed = nextSlideI;
}
*/

/*
Load the slideshow when the page has loaded.
*/
function slideLoaded(){
	for (var i = 0; i <= slideInfo.slides.length - 1; i++) { //For the number of slides we can display
		var slide = slideInfo.slides[i]; //Get the slide
		var slideshow = document.getElementById("slides"); //Get teh element we're adding the slides to

		slideshow.innerHTML += getSlideHtml(slide, i); //Add the HTML for the slide to the slideshow.
	}

	//Now all slides are loaded. Time to make them animate :D
	setInterval(increaseSlide, slideInfo.autoSpeed * 1000);
}

/*
Gets the HTML for a slide in the slideshow.
slide = slide object 
id = id of the slide

Returns a String of the HTML for the slide
*/
function getSlideHtml(slide, id){
	if (id == 0) //We're at the beginign of the show
		currentlyDisplayed = id; //Make sure we start at the beggining.

	var html = "<div class=\"slide " + (id == 0 ? "show" : "")+ "\" id=\"slide_" + id + "\">";
	html += "<img src=\"" + slide.image + "\" />"; //Make the HTML. If the id is 0 then make sure we're showing it.

	html += "<div class=\"content\">";
	html += "<h1 id=\"title\">" + slide.header + "</h1>"; //Display the header
	html += "<h2 id=\"subtext\">" + slide.subtext + "</h2>"; //And the subtexts
	html += "</div></div>";

	return html; //Return it/
}

slideLoaded();//Load the slideshow.