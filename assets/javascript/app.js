// Initial array of sports
var sports = ["football", "basketball", "tennis", "soccer"];
var countArray = [5,10,15,20,25];
var pageCount =0;
var searchItem;

function displayGIFs() {

    var countGIFs = $('#ddlCount option:selected').text();
    var searchItem = $(this).attr("data-name");
    if(!searchItem)
        searchItem = searchTerm;
    else{
        searchTerm = searchItem;
        pageCount =0;
    }
        
    var queryURL = "https://api.giphy.com/v1/gifs/search?limit="+countGIFs+"&q=" +searchItem + "&api_key=2Jh9XUPDdIoA6ZkPV02UBu2zpAP3nNzb";

    $.ajax({
      url: queryURL,
      method: "GET"
    }).then(function(response) {

      console.log(response.data);
      result = response.data;

      $("#gif-area").empty();
      $("#pagination-ul").empty();
      for (var i = pageCount*5; i < (pageCount+1)*5; i++) {

          var newDiv = $("<div>");
          newDiv.attr("class","gif-div");
          // Retrieves the Rating Data
          var rating = result[i].rating;

          // Creates an element to have the rating displayed
          var ratingP = $("<p>");
          ratingP.text("Rating: " +rating);
          

          var gifImage = $("<img>");
          gifImage.attr("src",result[i].images.fixed_height_still.url);
          gifImage.attr("class","gif img-fluid");
          gifImage.attr("data-animate",result[i].images.fixed_height.url);
          gifImage.attr("data-still",result[i].images.fixed_height_still.url);
          gifImage.attr("data-state","still");
          
          newDiv.append(gifImage);
          newDiv.append(ratingP);
          
          $("#gif-area").prepend(newDiv);

      }

      for(var i =0;i<countGIFs/5;i++){
      var page = $("<li>");
      page.attr("class","page-item");
      var pageLink = $("<a>");
      pageLink.attr("class","page-link");
      pageLink.attr("href","#");
      pageLink.text(i+1);
      page.append(pageLink);
      $("#pagination-ul").append(page);
      }
    });
}

// Function for displaying sports buttons
function renderButtons() {

  // Deletes the movies prior to adding new sports
  // (this is necessary otherwise you will have repeat buttons)
  $("#button-area").empty();

  sports.sort();
  // Loops through the array of sports
  for (var i = 0; i < sports.length; i++) {

    var buttonDiv = $("<div>");
    var spanTag = $("<span>");
    spanTag.attr("class","initial");
    spanTag.text(sports[i][0].toUpperCase());
    buttonDiv.append(spanTag);
    // Then dynamicaly generates buttons for each sports in the array
    // This code $("<button>") is all jQuery needs to create the beginning and end tag. (<button></button>)
    var a = $("<button>");
    // Adds a class of movie to our button
    a.addClass("btn sport");
    // Added a data-attribute
    a.attr("data-name", sports[i]);
    // Provided the initial button text
    a.text(sports[i].charAt(0).toUpperCase() + sports[i].slice(1).toLowerCase());
    // Added the button to the buttons-view div
    buttonDiv.append(a);

    $("#button-area").append(buttonDiv);

    $("#user-input").val("");
  }
  
}

// This function handles events where the add sport button is clicked
$("#submit-sport").on("click", function(event) {
  event.preventDefault();
  // This line of code will grab the input from the textbox
  var sport = $("#user-input").val().trim();

  // The sport from the textbox is then added to our array
  if(sports.indexOf(sport.toLowerCase()) === -1 && sport !== "")
    sports.push(sport.toLowerCase());

  // Calling renderButtons which handles the processing of our sports array
  renderButtons();
});

// Adding click event listeners to all elements with a class of "sport"
$(document).on("click", ".sport", displayGIFs);

// Calling the renderButtons function to display the intial buttons
renderButtons();

$(document).on("click", ".gif",function() {

    var stateGif = $(this).attr("data-state");

    if(stateGif === "still"){
        $(this).attr("src",$(this).attr("data-animate"));
        $(this).attr("data-state","animate");
    }

    else if(stateGif === "animate"){
      $(this).attr("src",$(this).attr("data-still"));
        $(this).attr("data-state","still");
    }

  });

  $("#play").on("click",function(){

    $("#gif-area img").each(function(){
        $(this).attr("src",$(this).attr("data-animate"));
        $(this).attr("data-state","animate");
    });

  });

  $("#pause").on("click",function(){

    $("#gif-area img").each(function(){
        $(this).attr("src",$(this).attr("data-still"));
        $(this).attr("data-state","still");
    });

  });

  $(document).on("click",".page-link", function(){
      pageCount = parseInt($(this).text())-1;
      displayGIFs();

  });