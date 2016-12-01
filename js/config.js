/* DOCUMENT INFORMATION
    - Document: config.js
    - Version:  0.0.1
    - Client:   Aquae Speculo
    - Author:   Jordan Dalton

This JS file will contains variables that you can configure. USED ONLY WHEN DEBUG = TRUE!!
*/
var maxPrice = 100;
var minPrice = 0.01;

//Maybe allow items to be added to the site dynamically?
var forSale = [
	{
		name : "Some Item", 
		price: getRandomPrice(),
		image : "http://placehold.it/50x50"
	},
	{
		name : "Another item",
		price : getRandomPrice(),
		image : "http://placehold.it/50x50"
	},
	{
		name : "Some Item 2",
		price: getRandomPrice(),
		image : "http://placehold.it/50x50"
	}
];


//Utility method.
function getRandomPrice(){
	return Math.floor(Math.random() * maxPrice) + minPrice;
}