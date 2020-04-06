$(document).ready(function () {

    var displayCity = $("#display-city");
    var displayDate = $("#display-date");
    var displayIcon = $("#display-icon");

    var displayTemp = $("#display-temp");
    var displayHumid = $("#display-humid");
    var displayWind = $("#display-wind");
    var displayIndex = $("#display-index");

    var APIkey = "5127b984f77556497cf3b63325863b1a";

    var currentDate = moment().format('l');

    // -----------------------------------------------------------------------------------

    function convertTemp(Kelvin) {
        var Fahrenheit = ((Kelvin - 273.15) * 1.8) + 32;
        return Math.round(Fahrenheit) + "°";
    }

    function addIcon(condition) {
        switch (condition) {
            case "Clear":
                return "fas fa-sun";
            case "Clouds":
                return "fas fa-cloud";
            case "Rain":
                return "fas fa-cloud-rain";
            case "Snow":
                return "far fa-snowflake";
            case "Mist":
                return "fas fa-smog"
            default:
                return "fas fa-cloud-sun";
        }
    }

    function displayUVIndex(lat, lon) {
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

        console.log(queryURL);

        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            var day1 = response.list[7];
            var day2 = response.list[15];
            var day3 = response.list[23];
            var day4 = response.list[31];
            var day5 = response.list[39];

            var forecastArray = [day1, day2, day3, day4, day5];

            forecastArray.forEach(day => {
                console.log(day);
            });

            for (var i = 0; i < forecastArray.length; i++) {
                $(`#day-${i + 1}-icon`).addClass(addIcon(forecastArray[i].weather[0].main));
                $(`#day-${i + 1}-temp`).text("Temperature: " + convertTemp(forecastArray[i].main.temp));
                $(`#day-${i + 1}-humid`).text("Humidity: " + forecastArray[i].main.humidity);
            }


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