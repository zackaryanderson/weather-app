var oldWeatherDataEl = document.querySelector("#old-results");
var newWeatherDataEl = document.querySelector("#btn-find");
var searchBoxEl = document.querySelector("#search");

//api key for openWeather
var apiKey = "b43c1a31341671a27776ccb6e4eb19ba";

//make first fetch to 
//"http://api.openweathermap.org/data/2.5/weather?q=salt+lake+city&appid= + apiKey and store lat and lon data
//then
//make fetch request to:
//"https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude={part}&appid=" + apiKey"

var formSubmitHandler = function (event) {
    event.preventDefault();

    //get search term value from form in html
    var searchTerm = searchBoxEl.value.trim().split(' ').join('+');

    //call getWeatherInfo if there is a search term
    if (searchTerm) {
        getWeatherInfo(searchTerm);
    } else {
        alert("Please enter a location!");
    }

    searchBoxEl.value = "";
}

var oldWeatherClickHandler = function (event) {
    event.preventDefault();

    //pull value we want out of html
    var searchTerm = event.target.text.trim().split(' ').join('+');
    oldWeatherInfo(searchTerm);
};

var getWeatherInfo = function (searchTerm) {
    //make fetch call if not empty
    fetch("http://api.openweathermap.org/data/2.5/weather?q=" + searchTerm + "&appid=" + apiKey).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                var lat = data.coord.lat;
                var lon = data.coord.lon;

                fetch("https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&appid=" + apiKey).then(function (response) {
                    if (response.ok) {
                        response.json().then(function (data) {
                            console.log(data);
                            var temp = data.current.temp;
                            var icon = data.current.weather[0].icon;
                            var humidity = data.current.humidity;
                            var wind = data.current.wind_speed;
                            var uvi = data.current.uvi;
                            updateCurrentWeather(temp, icon, humidity, wind, uvi, searchTerm);
                            updateFutureWeather(data);
                        });
                    };
                });
            });
        } else {
            alert("Error: " + response.statusText);
        }
    });
    //check status of response
    //get info out of json response
    //assign info to respective postions in html
    //save search to list
    console.log(searchTerm);
};

var oldWeatherInfo = function (searchTerm) {
    //get value of clicked element
    //make call to getWeatherInfo(value of clicked event)
    getWeatherInfo(searchTerm);
};

var updateCurrentWeather = function (temp, icon, humidity, wind, uvi, searchTerm) {
    //add searched city name to top of page
    document.querySelector("#city-name").textContent = searchTerm.split('+').join(' ');

    //add img element to city name to display weather icon and append it to city name
    var img = document.createElement("img");
    img.src = "http://openweathermap.org/img/w/" + icon + ".png";
    document.querySelector("#city-name").appendChild(img);

    //update temperature, wind-speed, uv, and humidity elements from current weather
    temp = (temp - 273.15) * 9/5 + 32;
    temp = temp.toFixed(2);
    document.querySelector("#temperature").textContent = "Temperature: " + temp + "°F";
    document.querySelector("#wind-speed").textContent = "Wind Speed: " + wind + " MPH";
    document.querySelector("#humidity").textContent = "Humidity: " + humidity + "%";
    var uvindex = document.querySelector("#uv-number");
    uvindex.textContent = uvi;

    //change background of uv elements depending on uv index
    if (uvi > 9) {
        uvindex.classList.add("bg-danger");
    } else if (uvi > 6) {
        uvindex.classList.add("bg-warning");
    } else {
        uvindex.classList.add("bg-success");
    }
};

var updateFutureWeather = function (data) {
    //clear all previous data
    document.querySelector("#future-events").textContent = '';
    //fill in new data header
    var fiveDayForecast = document.createElement("h3")
    fiveDayForecast.textContent = "5-Day Forecast";
    document.querySelector("#future-events").appendChild(fiveDayForecast);
    for (var i = 0; i < 5; i++) {
        //create new card
        var dailyCard = document.createElement("div");
        dailyCard.classList = "col-2 card bg-primary text-light";
        //create new card body
        var dailyCardEl = document.createElement("div");
        dailyCardEl.classList = "card-body";
        //create icon card img
        dailyCardIconHolder = document.createElement("div");
        dailyCardIconHolder.classList = "card-text";
        dailyCardIcon = document.createElement("img");
        dailyCardIcon.src = "http://openweathermap.org/img/w/" + data.daily[i].weather[0].icon + ".png";
        dailyCardIconHolder.appendChild(dailyCardIcon);
        dailyCardEl.appendChild(dailyCardIconHolder);
        //create temp card text
        var temp = data.daily[i].temp.day
        temp = (temp - 273.15) * 9/5 + 32; //convert kelvin to farenheit
        temp = temp.toFixed(1);
        dailyCardTemp = document.createElement("div");
        dailyCardTemp.textContent = "Temp: " + temp + "°F";
        dailyCardTemp.classList = "card-text";
        dailyCardEl.appendChild(dailyCardTemp);
        //create humdity card text
        dailyCardHumid = document.createElement("div");
        dailyCardHumid.textContent = "Humidity: " + data.daily[i].humidity + "%";
        dailyCardHumid.classList = "card-text";
        dailyCardEl.appendChild(dailyCardHumid);

        dailyCard.appendChild(dailyCardEl);
        document.querySelector("#future-events").appendChild(dailyCard);



        // var humidity = data.daily[i].humidity;
        // var temp = data.daily[i].temp.day;
        // var icon = data.daily[i].weather[0].icon;
        // //document.querySelector("#date-future").textContent = date;
        // var img2 = document.createElement("img");
        // img2.src = "http://openweathermap.org/img/w/" + icon + ".png";
        // document.querySelector("#icon-future").appendChild(img2);
        // document.querySelector("#temp-future").textContent = "Temp: " + temp + "°F";
        // document.querySelector("#humidity-future").textContent = "Humidity: " + humidity + "%";
    }
};

oldWeatherDataEl.addEventListener("click", oldWeatherClickHandler);
newWeatherDataEl.addEventListener("click", formSubmitHandler);



//storage idea:
//save in an array with a max of 8 values
//always save new value as first in array and bump all values down
//values > 8 are deleted