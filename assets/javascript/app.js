// Initial array of sports
var sports = ["football", "basketball", "tennis", "soccer"];
//initial pagecount to 0 (pagination)
var pageCount =0;
//key to store the current search term even when the page number changes in pagination
var searchItem;

//retrieves gifs from api and displays them
function displayGIFs() {

    //grab the number of gifs count to retrieve from the dropdownlist
    var countGIFs = $('#ddlCount option:selected').text();

    //grab the searchItem according to which sport button was clicked
    var searchItem = $(this).attr("data-name");

    //if searchItem is undefined i.e we are coming to this function by 
    //clicking on the pagination page link and not from the click of the button
    //set the searchItem to previously set searchTerm
    if(!searchItem)
        searchItem = searchTerm;

    //if we are coming to this function by 
    //clicking on the sport button and not from pagination page link
    //set searchTerm to searchItem and reset the pageCount to 0 since this will bring us to the first page
    else{
        searchTerm = searchItem;
        pageCount =0;
    }
    
    //prepare the query string
    var queryURL = "https://api.giphy.com/v1/gifs/search?limit="+countGIFs+"&q=" +searchItem + "&api_key=2Jh9XUPDdIoA6ZkPV02UBu2zpAP3nNzb";

    //ajax call
    $.ajax({
      url: queryURL,
      method: "GET"
    })
    //promise
    .then(function(response) {

      //console.log the response.data
      console.log(response.data);
      //reference to response.data
      var result = response.data;

      //empty the gifs shown currently
      $("#gif-area").empty();
      //empty the pagination li items
      $("#pagination-ul").empty();
      //pick the right slot of image numbers to show (1-5, 5-10, 10-15..) and loop through
      for (var i = pageCount*5; i < (pageCount+1)*5; i++) {

          //createa a div to hold the gif, raiting and the download button
          var newDiv = $("<div>");
          //give the new div class of gif-div
          newDiv.attr("class","gif-div");

          //Retrieves the Rating Data
          var rating = result[i].rating;
          // Creates an element to have the rating displayed
          var ratingP = $("<p>");
          //Provide the new p element a text
          ratingP.text("Rating: " +rating);
          
          //create a new image element
          var gifImage = $("<img>");
          //set src to result[i].images.fixed_height_still.url
          gifImage.attr("src",result[i].images.fixed_height_still.url);
          //give it a class of gif and img-fluid(for responsiveness)
          gifImage.attr("class","gif img-fluid");
          //set the animate src of image to result[i].images.fixed_height.url
          gifImage.attr("data-animate",result[i].images.fixed_height.url);
          //set the still src of image to result[i].images.fixed_height_still.url
          gifImage.attr("data-still",result[i].images.fixed_height_still.url);
          //set the current state of gif to still
          gifImage.attr("data-state","still");

          //create an anchor tag to wrap around the download button and give it an attribute of download
          var link = $("<a download>");
          //set the href to the image url
          link.attr("href",result[i].images.original.url);
          //set taget to _blank to open it in a new tab
          link.attr("target","_blank");

          //create a button 
          var downloadButton = $("<button>");
          //give it class of btn
          downloadButton.attr("class","btn");
          //give it a text of download
          downloadButton.text("Download");
          //append it to the anchor tag we created
          link.append(downloadButton);

          //append the newly created elements of image,rating and download button to newDiv
          newDiv.append(gifImage,ratingP,link);
          
          //append the newDiv to gif-area
          $("#gif-area").prepend(newDiv);
      }

      //create links for pagination pages on the bottom
      //divide the total gifs by 5 to see how many pages are needed
      //for each page
      for(var i =0;i<countGIFs/5;i++){
          //create li tag
          var page = $("<li>");
          //give it a class of page-item
          page.attr("class","page-item");
          //create anchor tag
          var pageLink = $("<a>");
          //give it a class of page-link
          pageLink.attr("class","page-link");
          pageLink.attr("href","#");
          //set the text of the link
          pageLink.text(i+1);
          //append the link to the li item we created
          page.append(pageLink);
          //add li item to the pagination-ul
          $("#pagination-ul").append(page);
      }
    });
}

// Function for displaying sports buttons
function renderButtons() {

  // Deletes the sports prior to adding new sports
  // (this is necessary otherwise you will have repeat buttons)
  $("#button-area").empty();

  //sort the sports in ascending order to display
  sports.sort();
  // Loops through the array of sports and do for each sport
  for (var i = 0; i < sports.length; i++) {

    //create a div to hold the initial and the button
    var buttonDiv = $("<div>");

    //create a span to hold the initial
    var spanTag = $("<span>");
    //give it a class of initial
    spanTag.attr("class","initial");
    //grab the first character of the sport to show as the initial in uppercase
    spanTag.text(sports[i][0].toUpperCase());
    //append this span tag with the initial to the div we created
    buttonDiv.append(spanTag);

    // Then dynamicaly generates buttons for each sports in the array
    var a = $("<button>");
    // Adds a class of movie to our button
    a.addClass("btn sport");
    // Added a data-attribute
    a.attr("data-name", sports[i]);
    // Provided the initial button text
    a.text(sports[i].charAt(0).toUpperCase() + sports[i].slice(1).toLowerCase());
    // Added the button to the button div we created
    buttonDiv.append(a);

    //Append buttonDiv to button-area
    $("#button-area").append(buttonDiv);

    //clear the input text
    $("#user-input").val("");
  }
  
}

// This function handles events where the add sport button is clicked
$("#submit-sport").on("click", function(event) {
  //prevent page refresh
  event.preventDefault();
  // This line of code will grab the input from the textbox
  var sport = $("#user-input").val().trim();

  // The sport from the textbox is then added to our array
  //check if string is empty or it already exists in the array
  if(sports.indexOf(sport.toLowerCase()) === -1 && sport !== "")
    sports.push(sport.toLowerCase());

  // Calling renderButtons which handles the processing of our sports array
  renderButtons();
});

// Adding click event listeners to all elements with a class of "sport"
$(document).on("click", ".sport", displayGIFs);

// Calling the renderButtons function to display the intial buttons
renderButtons();

//click event of gifs retrieved
$(document).on("click", ".gif",function() {

    //grab the current state of gif
    var stateGif = $(this).attr("data-state");

    //if current state is still
    if(stateGif === "still"){
        //change the gif src to animated gif src
        $(this).attr("src",$(this).attr("data-animate"));
        //change state to animate
        $(this).attr("data-state","animate");
    }
    //if current state is animate
    else if(stateGif === "animate"){
        //change the gif src to still gif src
        $(this).attr("src",$(this).attr("data-still"));
        //change state to still
        $(this).attr("data-state","still");
    }

  });

  //click event handker of the autoplay button
  //starts playing all the gifs on the page
  $("#play").on("click",function(){
    //grabs all the images from gif-area
    $("#gif-area img").each(function(){
        //for each gif on page change the gif src to the animated gif src
        $(this).attr("src",$(this).attr("data-animate"));
        //change the state to animate
        $(this).attr("data-state","animate");
    });

  });

  //click event handker of the pause button
  //pauses playing all the gifs on the page
  $("#pause").on("click",function(){
    //grabs all the images from gif-area
    $("#gif-area img").each(function(){
        //for each gif on page change the gif src to the still gif src
        $(this).attr("src",$(this).attr("data-still"));
        //change the state to still
        $(this).attr("data-state","still");
    });

  });

  //click handler of the page links on the bottom pagination area
  $(document).on("click",".page-link", function(){
      //grab the count of the page where you clicked
      pageCount = parseInt($(this).text())-1;
      //display the gifs accordingly
      displayGIFs();
  });
