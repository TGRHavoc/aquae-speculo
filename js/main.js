/* DOCUMENT INFORMATION
    - Document: main.js
    - Version:  0.0.1
    - Client:   Aquae Speculo
    - Author:   Jordan Dalton

This is the main JS file. Used for extending prototypes and any misc functions that need to be implemented.
*/

var debug = false; // Wether or not to show console.log messages. CHANGE TO FALSE FOR PRODUCTION
var expanded = false; //Whether or not the cart menu is expanded


//extend the array proto and contains function
//Input = object to check if in array.
//returns true if object is in array, false otherwise.
Array.prototype.contains = function(obj) {
    var i = this.length; //Start from the "back" of the array
    while (i--) { //Whilst I'm not at the "start" of the array
        if (this[i] === obj) {//check
            return true;
        }
    }
    return false;
}

//If the browser doesn't allow String.format(), add it
//Found this from stackoverflow: http://stackoverflow.com/questions/610406/javascript-equivalent-to-printf-string-format#4673436
if (!String.prototype.format) {
  String.prototype.format = function() {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function(match, number) { 
    	return typeof args[number] != 'undefined' ? args[number] : match;
    });
  };
}

//Function to allow mobile devices to use the cart. Since they cannot hover, listen for a click.
document.getElementById("helpnav").addEventListener("click", function(){
    var dom = document.getElementById("helpnav");
	
    expanded = !expanded; //Toggle boolean

    if (expanded)
        dom.className += " helpnav-hover"; //Add the hover class (apply slide animation)
    else
        dom.className = "helpnav-right"; //Reset to default class
});


window.addEventListener("beforeunload", function(e){
    console.log("Leaving page.. Save everything i need to cookies!!");
    saveCart();//Save cart to a cookie before we leave
});

//Used for simple animations on the web page.
function animate( options ){
    var start = new Date;

    var id = setInterval(function(){
        var timePassed = new Date - start;
        var progress = timePassed / options.duration;

        if (progress > 1){
            progress = 1;
        }

        var delta = options.delta(progress);
        options.step(delta);

        if (progress == 1){
            options.ended();
            clearInterval(id);
        }
    }, options.delay || 10 );
}


//Start of alert functions
var alertShown = false;
var alerts = [];
function showNextAlert(){
    if (alerts.length == 0)
        return;

    var alertOps = alerts[0];
    alerts.pop(0);
    myAlert(alertOps);
}

function myAlert( alertOpts ){
    var to = 0.9;

    if(alertShown){
        alerts.push(alertOpts);
        return;
    }
    
    document.getElementById("alert").style.display = "inline-block";
    document.getElementById("alert").style.backgroundColor = alertOpts.background;

    document.getElementById("alert_title").innerHTML = alertOpts.title;
    document.getElementById("alert_message").innerHTML = alertOpts.message;

    alertShown = true;

    animate({
        delay: 10,

        duration: alertOpts.duration || 1000, //1 sec by default

        delta: alertOpts.delta,

        step: function(delta){
            document.getElementById("alert").style.opacity = to*delta;
        },

        ended: function(){
            //Fade out
            setTimeout(function(){
                animate({
                    delay: 10,
                    duration: 1000,
                    delta: alertOpts.delta,
                    step: function (delta){
                        if (0.1 / delta > 0.6)
                            return;
                        
                        document.getElementById("alert").style.opacity = 0.1 / (delta);
                    },
                    ended: function(){
                        document.getElementById("alert").style.display = "none";
                        document.getElementById("alert").style.opacity = "0";

                        alertShown = false;

                        if (alerts.length > 0)
                            showNextAlert();
                    }
                });
            }, 1000);
        }

    });
}

function warningAlert( textToDisplay ){
    myAlert({
        message: textToDisplay,

        title: "Warning!",
        background: "#EE3124",
        delta: function(p){
            return p;
        }
    });
}

function successAlert( textToDisplay ){
    myAlert({
        message: textToDisplay,
        title: "Success!",
        
        background: "green",
        delta: function(p){
            return p;
        }
    });
}

//End of alert functions

//TODO: Remove this, add items to seperate page - Make dynamic ????
if (debug)
    loadItems();

//Test functions
function loadItems(){
    var appendTo = document.getElementById("purchaseable-items");
    if (typeof(forSale) == "undefined")
        return;
    for (var i = forSale.length - 1; i >= 0; i--) {
        var item = forSale[i];
        appendTo.innerHTML += getItemHtml(item,i);
    }

    var allButtons = document.getElementsByClassName("purchaseItem");
    for (var i = allButtons.length - 1; i >= 0; i--) {
        allButtons[i].addEventListener("click", function(){
            addItem(this.getAttribute("data-name"), this.getAttribute("data-price"));
        });
    }
}

function getItemHtml(item, index){
    var html = "<form><label>{0}</label><label>(&pound;{1})</label> <button class=\"purchaseItem\" type=\"button\" data-name=\"{0}\" data-price=\"{1}\">Add to Cart</button></form>".format(item.name, item.price);
    return html;
}