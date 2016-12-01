/* DOCUMENT INFORMATION
    - Document: products.js
    - Version:  0.0.1
    - Client:   Aquae Speculo
    - Author:   Jordan Dalton

This is the JS file that runs the products page. Change values to change user experience
*/
//Items to display per page (user defined)
var itemsPer = 3;

// 0 = Don't sort (show in order in array), 1 = price (low to high), 2 = price (high to low)
var sortBy = 0;

//Array of items we have to offer. Normally I would have this in a DB where user doesn't have access.
var items = [
	{
		name : "Awesome Bottle", //Name of product
		price : 10.29, //Price 
		small_image : "http://placehold.it/50x50", //Image shown on page
		large_image : "http://placehold.it/100x100", //Image shown in pop-up
		//Description is shown in pop-up. Each seperate item is displayed in it's own <p> tag
		description : ["This awesome bottle has been perfectly crafted to fit in the palm of your hand."]
	},
	//I've commented the above item, all items follow the same structure.
	{
		name : "Glassy Bottle",
		price : 10,
		small_image : "http://placehold.it/50x50",
		large_image : "http://placehold.it/100x100",
		description : ["Crafted specifically for Steve however, our customers demanded that we allowed them to buy it so, here it is.",
		"<small>Hope you're happy</small>"]
	},
	{
		name : "Sewage Be Gone",
		price : 100,
		small_image : "http://placehold.it/50x50",
		large_image : "http://placehold.it/100x100",
		description : [
			"One of our more luxurious bottles that is by moulding the glass from the firey pits of Mordor.",
			"Comes with a built in water cleaner so you can drink Sewage without a worry."
		]
	},
	{
		name : "Homer",
		price : 5.49,
		small_image : "http://placehold.it/50x50",
		large_image : "http://placehold.it/100x100",
		description : [
			"This started out as a joke.. Turns out people like drinking from Homer Simpsons head so, here's a perfect glass bottle in the shape of your favourite TV character.",
			"Doh! Forgot to add more descriptive description."
		]
	},
	{
		name : "Bottle 2",
		price : 9.99,
		small_image : "http://placehold.it/50x50",
		large_image : "http://placehold.it/100x100",
		description : [
			"This is another awesome bottle made by us.",
			"This has been discounted from the original price of &pound;20"
		]
	},
	{
		name : "Generic Bottle",
		price : 5,
		small_image : "http://placehold.it/50x50",
		large_image : "http://placehold.it/100x100",
		description : ["This is just a generic bottle."]
	},
	{
		name : "2Spooky5U",
		price : 5,
		small_image : "http://placehold.it/50x50",
		large_image : "http://placehold.it/100x100",
		description : ["This is just a generic bottle."]
	}
];

//A copy of the items array but, sorted to the users preference
var sorted = items;

//Get the number of pages needed show all the items with N items per page.
var pages = Math.ceil(items.length / itemsPer);
var currentPage = 1;//Always start of page 1

var sortEle = document.getElementById("sort"); //The drop-down box that the user uses to change the filter.
var pagesEle = document.getElementById("pagesPer");// The number that the user changes to change the amount of items per page.

sortEle.addEventListener("change", function(e){ //Listen for when the filter is changed.
	//When the user has changed how the elements are going to be displayed
	if (this.value == "Price (Low to High)")//If they want to sort low to high.
		sortBy = 1;
	else if (this.value == "Price (High to Low)") //They want to sort high to low.
		sortBy = 2;
	else //They don't want to sort.
		sortBy = 0;

	//Reset the current page
	currentPage = 1;
	sortItems();//Sort the items

	//render new page
	renderPage();
});

pagesEle.addEventListener("change", function(e){ //Listen for when they want to display a different amount of items per page.
	//when user has changed how many items per page should be displayed
	itemsPer = this.value; //Make sure we store the new value
	if (itemsPer <= 0){ //If it's 0 or below, 
		itemsPer = 1; //Make sure that we display at least one (or everything will break)
		this.value = itemsPer; //Make sure the value shown is accurate
	}
	if (itemsPer > items.length) //If they want to display more items than we have..
	{
		itemsPer = items.length; //Make sure we display the max we can (the number of items we have)
		this.value = itemsPer;//Make sure they see the updated value.
	}
	
	pages = Math.ceil(items.length / itemsPer);//Recalulate how many pages we need to display all the items
	//Render new page
	renderPage();
});

/*
Updates the "sorted" array so that it's sorted the way the user wants.
*/
function sortItems(){
	if (debug)
		console.log("Sorting items");
	//Just a boolean to keep track of wether we need to keep looping.
	var doloop = true;

	if (sortBy == 0){ //If we don't want to sort.
		sorted = items; //Make sure it's not sorted.
		return;//We don't need to do the while loop.
	}
	
	//We want to do this loop atleast once (to make sure we don't need to sort) so,
	// "do while" is used.
	do{ 
		var changesMade = 0; //How many changes have we made this time??
		for(var i = 0; i < sorted.length-1; i++){//For each item in the array.
			if (sortBy == 1){ //Low to High
				if (debug)
					console.log("Price low to high " + changesMade);

				if (sorted[i].price > sorted[i+1].price){ //If the price near the front of the array is higher
					//Swap them around (make sure highest comes last).
					var lowest = sorted[i+1];
					var highest = sorted[i];
					sorted[i] = lowest;
					sorted[i+1] = highest;

					changesMade++;//We've made a change, make sure the loop knows.
				}
			}else if(sortBy == 2){// High to Low
				if (sorted[i].price < sorted[i+1].price){//If the price near the front of the array is lower
					//Swap them (lowest comes last)
					var t1 = sorted[i+1];
					var t2 = sorted[i];
					sorted[i] = t1;
					sorted[i+1] = t2;

					changesMade++;//We've made a change.
				}
			}
		}
		if (changesMade == 0) //If we haven't made any changes, we've sorted it as best as we can
			doloop = false; //Stop the loop.
	}while(doloop);
}

/*
Renders the current "page".
*/
function renderPage(){
	//Error checking :D
	if (currentPage > pages) //If we're trying to display a page greater than the pages we need.
		currentPage = pages; //just display the last page.
	else if (currentPage < 1) //If we're trying to display a page that doesn't exist.
		currentPage = 1; //Just reset to the first page and show that..

	var pEle = document.getElementById("pages"); //Element to show the user how many pages are available to view.
	pEle.innerHTML = "";//Reset the html
	for(var i = 0; i < pages; i++){//For each page, add to the pages link
		if (i+1 == currentPage) // i+1 = page number (0 = 1, 1=2 etc.); if, the page we want to render is the current page
			pEle.innerHTML += "<li><a style='color: green; text-decoration: underline;' onclick='gotoPage("+ (i+1) +")' href='#'>"+(i+1)+"</a></li>"; //Add some fancy styling to the link
		else//If it's not the current page
			pEle.innerHTML += "<li><a onclick='gotoPage("+ (i+1) +")' href='#'>"+(i+1)+"</a></li>";//Just render it normally.
	}

	var itemsEle = document.getElementById("displayedItems"); //Items to display
	var startFrom = (itemsPer * currentPage) - itemsPer; //What item index do we start from? Do some maths to work it out.
	itemsEle.innerHTML = "";//Make sure we're not displaying the previous items.

	for(var i = 0; i < itemsPer; i++){ //For the number of items we want to display
		var itemIndex = startFrom + i; //Get it's index.
		
		if (debug)
			console.log(itemIndex);

		itemsEle.innerHTML += generateItemHtml(itemIndex, sorted[itemIndex]);//Add it to the HTML so user can see it.
	}
}

/*
Used to generate the HTML to display the item to the user.
index = index of the item in the array "sorted"
itemObj = the object stored at "index" of array "sorted"
returns a String representing the HTML for the item
*/
function generateItemHtml(index, itemObj){
	var html = '<div data-pos="{2}" onclick="displayItem(this)" class="item"><img src="{3}" width="50" height="50" style="float: left" />'+
		'<div><p>{0}</p><p>&pound;{1}</p></div></div>'; //CReate the HTMLs
	html = html.format(itemObj.name, itemObj.price.toFixed(2), index, itemObj.small_image);//Format the html
	return html;//Return it
}

/*
Used to display a "pop-up" with more info on an item and allows the user to add said item to their cart.
*/
function displayItem( rootElement ){
	var pop = document.getElementById("item-pop"); //Get the pop-up element
	var popList = document.getElementById("item-pop-desc"); //Get the description element
	popList.innerHTML = ""; //Make sure we're only displaying the description we need.

	var itemIndex = rootElement.getAttribute("data-pos"); //Get the index of the item we've clicked on.
	var itemObj = sorted[itemIndex]; //Get the object representing the item from the sorted array

	pop.getElementsByTagName("img")[0].src = itemObj.large_image; //Set the image of the pop-up to show the items

	//Set the name to current item
	document.getElementById("item-pop-name").innerHTML = itemObj.name + " - <span id=\"item-pop-price\" class=\"price\">&pound;10.00</span>";
	//Set the price to current item
	document.getElementById("item-pop-price").innerHTML = "&pound;" + itemObj.price;
	
	for (var i = 0; i < itemObj.description.length; i++) { //For each string we have in the description,
		popList.innerHTML += "<li>" + itemObj.description[i] + "</li>"; //Add it to the item's description
	}

	var buttonEle = document.getElementById("item-pop-button"); //The "add to cart" button
	buttonEle.setAttribute("data-price", itemObj.price); //Make sure we've got a reference to the item's price
	buttonEle.setAttribute("data-name", itemObj.name);// Make sure we know what the item is called.

	pop.className = "item-popup";//Show the pop-up
}

/*
Used to close the item "pop-up"
*/
function closeItem(){
	document.getElementById("item-pop").className += " hidden";//Hide the pop-up when the user closes it.
}

/*
Used to change the page to the next one available.
*/
function nextPage(){
	if (currentPage +1 > pages)
		return; //No need to go to a page greater then the amount of pages we need

	currentPage++;//Increase the current page by one
	if (debug)
		console.log("Changed page to " + currentPage);

	//We've changed what the page looks like so, re-render it
	renderPage();
}

/*
Used to change the page to the previous one
*/
function previousPage(){
	if (currentPage -1 < 1)
		return; // Make sure we dont go to a page that doesn't exist.

	currentPage--;//Decrease the current page
	if (debug)
		console.log("Changed page to " + currentPage);
	//re-render the page
	renderPage();
}

/*
Used to go to a specific page number.
pageNo = number of the page to render.
*/
function gotoPage(pageNo){
	if (pageNo > pages || pageNo < 1){ //If we can't render it
		console.log("Nope."); //Tell the user to stop messing around with console :P
		return; //Don't go to a page we can't render
	}
	if (debug)
		console.log("Changed page to " + pageNo);

	currentPage = pageNo;//Change the current page.
	renderPage(); //Re-render it
}

//All our code has been loaded.. We now need to use it!!
renderPage();