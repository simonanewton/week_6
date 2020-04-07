$(document).ready(function () {

    var searchInput = $("#search-input");
    var searchButton = $("#search-btn");
    var radioDiv = $("#radio-div");

    var displayCity = $("#display-city");
    var displayDate = $("#display-date");
    var displayIcon = $("#display-icon");

    var displayTemp = $("#display-temp");
    var displayHumid = $("#display-humid");
    var displayWind = $("#display-wind");
    var displayIndex = $("#display-index");

    var APIkey = "5127b984f77556497cf3b63325863b1a";

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
        var queryURL = `https://api.openweathermap.org/data/2.5/uvi?appid=${APIkey}&lat=${lat}&lon=${lon}`;

        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            displayIndex.text("UV Index: " + response.value);
        });
    }

    function displayWeather(city) {
        var queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIkey}`;

        console.log(queryURL);

        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            displayCity.text(response.name + ", " + response.sys.country);
            displayDate.text("(" + moment().format('l') + ")");
            displayIcon.removeClass();
            displayIcon.addClass(addIcon(response.weather[0].main));
            displayIcon.addClass("fa-2x px-2");

            displayTemp.text("Temperature: " + convertTemp(response.main.temp));
            displayHumid.text("Humidity: " + response.main.humidity + "%");
            displayWind.text("Wind Speed: " + response.wind.speed + " mph");
            displayUVIndex(response.coord.lat, response.coord.lon);
        });
    }

    function displayForecast(city) {
        queryURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${APIkey}`;

        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            var day1 = response.list[0];
            var day2 = response.list[8];
            var day3 = response.list[16];
            var day4 = response.list[24];
            var day5 = response.list[32];

            var forecastArray = [day1, day2, day3, day4, day5];

            for (var i = 0; i < forecastArray.length; i++) {
                var nextDate = moment().add(i, 'days');
                $(`#day-${i + 1}-date`).text(nextDate.format('dddd') + " " + nextDate.format('l'));
                $(`#day-${i + 1}-icon`).removeClass();
                $(`#day-${i + 1}-icon`).addClass(addIcon(forecastArray[i].weather[0].main));
                $(`#day-${i + 1}-icon`).addClass("fa-3x py-4");
                $(`#day-${i + 1}-temp`).text("Temperature: " + convertTemp(forecastArray[i].main.temp));
                $(`#day-${i + 1}-humid`).text("Humidity: " + forecastArray[i].main.humidity + "%");
            }
        });
    }

    function renderDisplay(city) {
        // displays the current weather for the specified city
        displayWeather(city);

        // displays the 5-day forecast for the specified city
        displayForecast(city);
    }

    function enableSearchBar() {
        searchInput.keyup(function (event) {
            if (event.keyCode === "13") renderDisplay(searchInput.val());
        });

        searchButton.click(function () {
            event.preventDefault();
            renderDisplay(searchInput.val());
        });
    }

    function enableRadioButtons() {
        var defaultLocations = ["Austin", "Chicago", "New York", "Orlando", "San Francisco", "Seattle", "Denver"];

        defaultLocations.forEach(location => {
            var radioLabel = $("<label>");
            radioLabel.addClass("btn btn-light p-4 text-left border border-secondary");
            radioLabel.attr("value", location);
            radioLabel.text(location);

            radioLabel.click(function () {
                console.log(radioLabel.attr("value"));
                renderDisplay(radioLabel.attr("value"));
            });

            var radioInput = $("<input>");
            radioInput.attr("type", "radio");

            radioLabel.append(radioInput);

            radioDiv.append(radioLabel);
        });
    }

    // -----------------------------------------------------------------------------------

    function main() {
        // sets the default weather display
        var defaultCity = "Atlanta"
        renderDisplay(defaultCity);

        // enables search bar functionality
        enableSearchBar();

        // enables radio buttons functionality
        enableRadioButtons();
    }

    main();
});