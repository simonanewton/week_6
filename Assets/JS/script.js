$(document).ready(function () {

    var displayCity = $("#display-city");
    var displayDate = $("#display-date");
    var displayIcon =  $("#display-icon");

    var displayTemp = $("#display-temp");
    var displayHumid = $("#display-humid");
    var displayWind = $("#display-wind");
    var displayIndex = $("#display-index");

    var currentDate = moment().format('l');

    var APIkey = "5127b984f77556497cf3b63325863b1a";

    // -----------------------------------------------------------------------------------

    function convertTemp(Kelvin) {
        var Fahrenheit = ((Kelvin - 273.15) * 1.8) + 32;
        return Math.round(Fahrenheit) + "°";
    }

    function addIcon(condition) {
        switch (condition) {
            case "Clear":
                return "fas fa-sun fa-2x px-2";
            case "Clouds":
                return "fas fa-cloud fa-2x px-2";
            case "Rain":
                return "fas fa-cloud-rain fa-2x px-2";
            case "Snow":
                return "far fa-snowflake fa-2x px-2";
            case "Mist":
                return "fas fa-smog fa-2x px-2"
            default:
                return "fas fa-cloud-sun fa-2x px-2";
        }
    }

    function displayUVIndex(lat,lon) {
        var queryURL = `http://api.openweathermap.org/data/2.5/uvi?appid=${APIkey}&lat=${lat}&lon=${lon}`;

        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            displayIndex.text("UV Index: " + response.value);
        });
    }

    function displayWeather(city) {
        var queryURL = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIkey}`;

        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            console.log(response);

            displayCity.text(response.name);
            displayDate.text("(" + currentDate + ")");
            displayIcon.addClass(addIcon(response.weather[0].main));

            displayTemp.text("Temperature: " + convertTemp(response.main.temp));
            displayHumid.text("Humidity: " + response.main.humidity + "%");
            displayWind.text("Wind Speed: " + response.wind.speed);
            displayUVIndex(response.coord.lat, response.coord.lon);
        });
    }

    function displayForecast(city) {
        queryURL = `http://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${APIkey}`;

        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            console.log("Response:");
            console.log(response);
        });
    }

    function setDefault() {
        // sets the default city to display
        var city = "Atlanta";
        // var city = prompt("What city do you want to search for?");

        // displays the current weather for the default city
        displayWeather(city);

        // displays the 5-day forecast for the default city
        displayForecast(city);
    }

    // -----------------------------------------------------------------------------------

    function main() {
        // clears the console for testing
        console.clear();

        // sets the default weather display
        setDefault();
    }

    main();
});