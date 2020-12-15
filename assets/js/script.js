var oldWeatherDataEl = document.querySelector("#old-results");
var newWeatherDataEl = document.querySelector("#btn-find");
var searchBoxEl = document.querySelector("#search");

//api key for openWeather
var apiKey = "b43c1a31341671a27776ccb6e4eb19ba";

//google api key for coordinates
var gapiKey = "AIzaSyB-T13U4tAtdMO-cGST_fUtT1Uq4RCkPv4";

//make first fetch to 
//"http://api.openweathermap.org/data/2.5/weather?q=salt+lake+city&appid= + apiKey and store lat and lon data
//then
//make fetch request to:
//"https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude={part}&appid=" + apiKey"

var getWeatherInfo = function(event){
    event.preventDefault();
    //make fetch call if not empty
    //check status of response
    //get info out of json response
    //assign info to respective postions in html
    //save search to list
    var search = searchBoxEl.value.trim().split(' ').join('+');
    console.log(search);

};

var oldWeatherInfo = function(event){
    event.preventDefault();
    //get value of clicked element
    //make call to getWeatherInfo(value of clicked event)
    console.log(event.target);
};

oldWeatherDataEl.addEventListener("click",oldWeatherInfo);
newWeatherDataEl.addEventListener("click",getWeatherInfo);
