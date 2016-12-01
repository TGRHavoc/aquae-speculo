/* DOCUMENT INFORMATION
    - Document: shopping.js
    - Version:  0.0.1
    - Client:   Aquae Speculo
    - Author:   Jordan Dalton

This JS file is for the shopping functionality of the website.
*/
var shoppingCart = { items : [] }; // Object to hold users shopping cart info.

init(); //Call the initialization function :D
updateCart();//Make sure the cart is up to date.

/*
Updates the cart so that the user knows what's in it.
*/
function updateCart(){
	document.getElementById("cartAmount").innerHTML = getTotalItem();//Display the correct amount of "unique" items in cart

	//Add the last five elements from the item array to the drop down...
	var itemList = document.getElementById("cartItems");//Wehere we're adding the new items
	var itemsToDisplay = getItemsToDisplay(); //Get teh last 2 items
	itemList.innerHTML = ""; //Clear the html

	//console.log("Shopping cart: {0}\nItems to display:{1}".format(JSON.stringify(shoppingCart.items),
	//	JSON.stringify(itemsToDisplay)));

	for (var i = itemsToDisplay.length - 1; i >= 0; i--) {
		var item = itemsToDisplay[i];
		itemList.innerHTML += getItemHtml(item); //Get and add the items' HTML
	}

	//Event listeners
	var classname = document.getElementsByClassName("deleteItem");
	var myFunc = function(){
		removeItem(this.getAttribute("data-name"));
	};

	for (var i = 0; i < classname.length; i++) {
		classname[i].removeEventListener("click", myFunc);//Remove my listener if it already exists
		classname[i].addEventListener('click', myFunc); //Add it (ensures each button has only one listener);
	}
}

/*
Gets the HTML for the items so that it can be displayed in the cart
*/
function getItemHtml(item){
	var html = "<li><span class=\"cartItem\"><span title=\"Remove Item\" class=\"cartItem-right\"><button class=\"deleteItem\" data-name=\"{0}\">X</button></span>"+
	"<span class=\"cartItem-left\"><img width=\"50\" height=\"50\" src=\"http://placehold.it/50x50\"/>" +
	"<span class=\"cartItem-info\"><span>{1}</span><span>&pound;{2}</span>"+
	"</span></span></span></li>";

	html = html.format(item.name, item.name + " (" + item.quantity + ")", item.price); //Format it, placing the name and price in the right places.

	return html; //Return it :D
}

/*
Gets the last 2 items in the array "items" in the object "shoppingcart"
*/
function getItemsToDisplay(){//Get the last 2 items in the items array (makes the cart drop-down smaller, only displaying the last items to added to array)
	var t = shoppingCart.items.slice(0); //Copy the array (allows us to splice without changing the original array)
	return t.splice(Math.max(t.length - 2, 0));//Get the last 2 elements
}

/*
This just initializes the shopping cart (if sessionStorage is available)
if there is sessionStorage, and there's data in it. It's put into the "shoppingCart" object.
*/
function init(){ 
	if (typeof(Storage) == "undefined"){ //If they don't support Storage
		if (debug){
			console.log("Doesn't support sessionStorage ....");
			console.log("Show them an error, I guess...");
		}
	}

	if (sessionStorage.getItem("cart") != null){
		//They have already stored some stuff in their cart.
		//Load to the shoppingCart object
		if (debug)
			console.log("JsonString: {0}".format(sessionStorage.getItem("cart")));

		shoppingCart = JSON.parse(sessionStorage.getItem("cart")); //Parse the text and put into the object

		if (debug)
			console.log("Welcome back!");

		if (debug){

			for (var i = 0; i < shoppingCart.items.length; i++) {
				var item = shoppingCart.items[i];
				console.log("{0}({1}) at \u00A3{2} per {0}".format(item.name, item.quantity, item.price));
			}
		}
	}else{
		//New session started. Maybe we have some cookies we could use?
		var cartCookie = getCookie("cart");
		if (cartCookie != ""){
			//We have a cookie!!
			shoppingCart = JSON.parse(cartCookie);

			console.log("Loaded cart from cookie");
		}
	}
}

/*
Sets a cookie with the key and value for the amount of days specified.

Key = the key to store the cookie with
Value = the value of the cookie.
Days = the amount of days to keep the cookie (Defaults to 365);
*/
function setCookie ( key, value, days){
	var date = new Date();
	//                              \/ Transforms days to seconds
	date.setTime(date.getTime() + ( (days || 365)  * 24 * 60 * 60 * 1000)); //Add the amount of days to the current time untill cookie expires (default - 1 year)

	document.cookie = key + "=" + value +"; expires=" + date.toUTCString();//set cookie
}

/*
Gets the cookie with the specified key

Returns the value of the cookie. Or "" if we couldn't find one!
*/
function getCookie( key ){
	var name = key +"="; //We're searching for cookie (key=)
	var cookieArray = document.cookie.split(";"); // Cookies are stored in format of (key=value;key2=value2) so, makes sense to split with ;
	for (var i = 0; i < cookieArray.length; i++) {
		var cookie = cookieArray[i]; 

		while (cookie.charAt(0)==' ') //Whilst we have a space
			cookie = cookie.substring(1); //Skip!
        
        if (cookie.indexOf(name) == 0) //If we've found the cookie,
        	return cookie.substring(name.length,cookie.length);//Return it's value
	}

	return "";//We don't have a value for this cookie.
}

/*
Gets the total amount of items the user has in their cart.

returns the total total amount of items in their cart.
*/
function getTotalItem(){
	var total = 0;
	for (var i = shoppingCart.items.length - 1; i >= 0; i--) {
		total += shoppingCart.items[i].quantity;
	}
	return total;
}

/*
Gets the total price of all the items in the shoppingCart object.

returns the total price (double)
*/
function getTotalPrice(){
	var total = 0;
	for (var i = 0; i < shoppingCart.items.length; i++) {
		if (debug){
			console.log("Total before addition {0}".format(total));
			console.log("Adding {2} ({0}*{1})".format(shoppingCart.items[i].price , shoppingCart.items[i].quantity,
				(shoppingCart.items[i].quantity * shoppingCart.items[i].quantity)));
		}
		// Increase the total price
		// Price * Quantity = Price for them products
		total += (shoppingCart.items[i].price * shoppingCart.items[i].quantity); //Multiplying by 100 to bypass the annoying decimal problem (not being accurate)
	}
	return total.toFixed(2); // Divide by 100 to get the actual price.
}

/*
Removes the item "cart" from the sessionStorage.
*/
function clearSession(){
	sessionStorage.removeItem("cart");// Remove "cart" from current session
	shoppingCart.items = [];// Empty the items in the cart stored at local
	updateCart();//Update the cart, we've changed things
}


/*
Checks whether an item is in the item array of the shoppingCart object

Returns the items' index in the array if true, false if not.
*/
function cartContains(itemName){
	for (var i = 0; i < shoppingCart.items.length; i++) {// Loop through all the elements in the array of items
		if (shoppingCart.items[i].name == itemName){ // If the items' name is the same as what we're looking for
			return i; // Return the index in the items array.
		}
		else // If it's not
			continue; // Just skip to the next item
	}
	return -1; //If we can't find an item with the name. Just return -1.
}

/*
Adds an item to the items array of the shoppingCart object if it doesn't already exist.
If the item does exist then it increases the quantity of the item.
*/
function addItem(itemName, price){
	var itemId = cartContains(itemName); // Check if the array 

	//console.log("is it false? " +(itemId));

	if (itemId == -1){ // If it's false (not in array)
		//Add!!!
		shoppingCart.items.push({
			name : itemName,
			quantity: 1,
			price: price
		});

		if (debug)
			console.log("Just added a new item to the cart: " + JSON.stringify(shoppingCart.items));
	}else{
		console.log("Increase quantity of \"" + itemName + "\"");
		shoppingCart.items[itemId].quantity++; // Just increase the quantity
	}
	if (itemId == -1)
		itemId = cartContains(itemName);

	var message = ("You have successfully added 1 '" + itemName + "' to your cart.<br/>You now have " + shoppingCart.items[itemId].quantity + " subtotaling at &pound;" + (shoppingCart.items[itemId].price * shoppingCart.items[itemId].quantity).toFixed(2));
	//Show an alert to teh user so they know they've added something to their cart.
	myAlert({
        message: message,
        title: "Successfully added item!",
        duration: 3500,

        background: "green",
        delta: function(p){
            return p;
        }
    });
	saveToSession();//Save to session.
	updateCart();//Make sure the cart is up to date.
}

/*
Removes an item from the user's cart.
itemName = Name of the item to remove.
*/
function removeItem( itemName ){
	var itemId = cartContains(itemName); //Get teh item's ID (if it exists);

	if (itemId == -1){ //There's no item in cart
		alert("Sorry, there was an error. Please refresh the page and try again.");//Tell user.
		
		if (debug){//Chrome has some cool features.. I'm using them here :D
			console.group("Debug Data");
			console.log("Cannot remove \"{0}\" from items as it's no in the item array:".format(itemName));
			console.log(JSON.stringify(shoppingCart.items));
			console.groupEnd();
		}
		return; //Return, we're not removing an item.
	}

	var item = shoppingCart.items[itemId];//Get the object that represents the item

	var str = "This will remove {2} {0} {1} from your cart".format(item.quantity, 
		(item.quantity > 1 ? "\""+item.name + "\"'s" : "\""+item.name+"\""),
		(item.quantity > 1 ? "all" : "the")); //Fancy way for getting the grammar correct for the conformation although, it is a long way around D:
	var res = confirm(str);//Ask if they're ok with removing the item

	if (res == true){
		//They're ok with it..
		shoppingCart.items.splice(itemId, 1);//Remove the singular item from the list
	}else{
		//They're not ok with it..
		//Let's not do anthing..
	}

	saveToSession();//Save changes
	updateCart(); //Update cart
}

/*
Sets the item's quantity to the specified amount.
itemName = The item whoes quantity you want to set.
newQuantity = The quantity to set it to.
*/
function setItemQuantity(itemname, newquantity){
	var itemId = cartContains(itemname); //Get the ID.
	if (itemId == -1){ //If it doesn't exist :(
		warningAlert("Sorry but the item \""+itemname+"\" wasn't in your cart."); //Show an alert.. Why not?
		return;//Return, we don't want to do anything else.
	}

	shoppingCart.items[itemId].quantity = newquantity; //Set the quantity of the item

	saveToSession(); //Save to session
	updateCart();// Update UI
}

/*
Gets the price for an item in the user's cart (Utility method)
itemName = name of item to get price for.
Retuns price of item if in cart, -1 otherwise.
*/
function getPrice(itemname){
	var itemId = cartContains(itemname); //Get id of item
	if (itemId == -1){ //Not in cart
		warningAlert("Sorry but the item \""+itemname+"\" wasn't in your cart.");
		return -1; 
	}

	return shoppingCart.items[itemId].price; //Return the price
}

/*
Test function. Will only work with "debug" set to true.

Adds 100 test items to the shoppingCart object at £1.00 each.
*/
function test(){
	if (!debug)
		return;
	
	for (var i = 0; i < 100; i++) {
		addItem("test_" + i, 1);
	}

	saveToSession();

	console.log("Added");
}

/*
Saves the shoppingCart object to the session as a JSON string.
*/
function saveToSession(){
	sessionStorage.setItem("cart", JSON.stringify(shoppingCart)); //Save the cart as a JSON string in sessionStorage
	
	if (debug)
		console.log("Saved cart to session");
}

/*
Saves the current cart to a cookie
*/
function saveCart(){
	setCookie("cart", JSON.stringify(shoppingCart));
	console.log("Saved as cookie");
}