// runs when the page loads
window.onload = function () 
{
	let endpoint = "https://api-football-v1.p.rapidapi.com/v3/teams/statistics?league=39&season=2020&team=33"
	ajax(endpoint, displayResults)
}

// checks for form submission and calls search 
document.querySelector("#search-form").onsubmit = function(event) {

	event.preventDefault();

	let searchInput = document.querySelector("#search-id").value.trim();
	let endpoint = "https://api.themoviedb.org/3/search/movie?api_key=59403ad54dcb8292cab117ba6771b841&query=" + searchInput;

	ajax(endpoint, displayResults);
}

// ajax call that returns results of the api call
function ajax(endpoint, returnFunction) {
	
	let httpRequest = new XMLHttpRequest();
	httpRequest.open("GET", endpoint);	
	httpRequest.send();
	
	httpRequest.onreadystatechange = function() {
		
		if( httpRequest.readyState == 4) {
			if(httpRequest.status == 200) {				
				returnFunction(httpRequest.responseText);
			}
			else {
			}
		}
	}
}

// displays results from the Ajax method
function displayResults(results) {

	clearResults();

	let convertedResults = JSON.parse(results);
	let totalResults = convertedResults.total_results;
	let resultsFound = convertedResults.results.length;

	document.querySelector("#found-results").innerHTML = resultsFound  
	document.querySelector("#total-results").innerHTML = totalResults

	for(let i = 0; i < resultsFound; i++) {

		// gets all necessary details from each movie
		let rating = convertedResults.results[i].vote_average;
		let num_voter = convertedResults.results[i].vote_count;
		let synopsis = convertedResults.results[i].overview;
		let poster_path = convertedResults.results[i].poster_path;

		// does error checking for summary length
		if(synopsis.length > 200) {
			synopsis = synopsis.substring(0, 199);
			synopsis = synopsis + "...";
		}	

		// creates a div that will contain another div with
		// an image and 3 p's
		// also adds necessary sizing and spacing
		let divCol = document.createElement("div");
		divCol.classList.add("col-6");
		divCol.classList.add("col-sm-4");
		divCol.classList.add("col-lg-3");
		divCol.classList.add("mt-4");
		
		// this div holds the image and is what will be overlayed
		let divImg = document.createElement("div");
		divImg.classList.add("column");

		// creates the image that will be pulled from the api db
		let imgTag = document.createElement("img");
		if(poster_path == null) {
			imgTag.src = "images/error.jpg";
		} else {
			imgTag.src = "https://image.tmdb.org/t/p/original" + poster_path;
		}

		// creates the overlay div that will come on on hover
		// and adds necessary classes in order to function
		let overlayDiv = document.createElement("div");
		overlayDiv.classList.add("overlay");

		// creates three <p> elements that all contain movie info
		let ratingP = document.createElement("p");
		let voterP = document.createElement("p");
		let synopsisP = document.createElement("p");
		ratingP.innerHTML = "Rating: " + rating;
		voterP.innerHTML = "Total Voters: " + num_voter;
		synopsisP.innerHTML = synopsis;

		// appends movie info into the overlay div
		overlayDiv.appendChild(ratingP);
		overlayDiv.appendChild(voterP);
		overlayDiv.appendChild(synopsisP);
		
		// appends overlay div and image into the image div
		divImg.appendChild(imgTag);
		divImg.appendChild(overlayDiv);

		// creates two seperate <p> tags for movie name and release date
		let movieName = document.createElement("p");
		let dateRelease = document.createElement("p");
		movieName.innerHTML = convertedResults.results[i].original_title;
		dateRelease.innerHTML = convertedResults.results[i].release_date;
		

		// appends the divImg and also appends two <p> 
		// tags to the initial column div created
		divCol.appendChild(divImg);
		divCol.appendChild(movieName);
		divCol.appendChild(dateRelease);

		// finally appends it all back to the body 
		let parentBody = document.querySelector("#parentBody");
		parentBody.appendChild(divCol);
	}
}

// clears results on every search
function clearResults() {

	let parent = document.querySelector("#parentBody");
	while(parent.hasChildNodes()) {
		parent.removeChild( parent.lastChild )
	}
}