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
    var displayUV = $("#display-UV");
    var displayIndex = $("#display-index");

    // var forecastDate = $(".forecast-date");
    // var forecastIcon = $(".forecast-icon");
    // var forecastTemp = $(".forecast-temp");
    // var forecastHumid = $(".forecast-humid");

    var APIkey = "5127b984f77556497cf3b63325863b1a";

    var recentLocations;

    // -----------------------------------------------------------------------------------

    function getRecentSearches() {
        recentLocations = JSON.parse(localStorage.getItem("recentSearches"));

        if (!recentLocations) {
            recentLocations = ["Atlanta, US", "Chicago, US", "New York, US", "Orlando, US", "San Francisco, US", "Seattle, US", "Denver, US"];
        }
    }

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

    function colorCodeIndex(index) {
        // why the hell does this not work

        // console.log(index);
        // console.log(typeof(index));

        // console.log("-----------");
        // console.log("The index is less than 4: " + (index < 4));
        // console.log("The index is less than 7: " + (index < 7));
        // console.log("The index is less than 10: " + (index < 10));
        // console.log("The index is greater than 10: " + (index > 10));
        // console.log("-----------");

        switch (index) {
            case (index < 4):
                console.log("Index is less than 4.");
                displayIndex.addClass("bg-success text-white");
                break;
            case (index < 7):
                console.log("Index is less than 7.");
                displayIndex.addClass("bg-warning text-white");
                break;
            case (index < 10):
                console.log("Index is less than 10.");
                displayIndex.addClass("bg-danger text-white");
                break;
            case (index > 10):
                console.log("Index is greater than 10.");
                displayIndex.addClass("bg-dark text-white");
                break;
            default:
                console.log("Index is none of the above.");
                displayIndex.addClass("bg-light text-dark");
                break;
        }
    }

    function displayUVIndex(lat, lon) {
        var queryURL = `https://api.openweathermap.org/data/2.5/uvi?appid=${APIkey}&lat=${lat}&lon=${lon}`;

        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            displayUV.text("UV Index: ");
            displayIndex.text(response.value);
            colorCodeIndex(response.value);
        });
    }

    function displayWeather(city) {
        var queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIkey}`;

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
            // needs to be fixed, add a function to find the same time for each day
            var day1 = response.list[0];
            var day2 = response.list[8];
            var day3 = response.list[16];
            var day4 = response.list[24];
            var day5 = response.list[32];

            var forecastArray = [day1, day2, day3, day4, day5];

            for (var i = 0; i < forecastArray.length; i++) {
                var nextDate = moment().add(i + 1, 'days');

                // what's a better way to do this? add a class?
                $(`#day-${i + 1}-date`).text(nextDate.format('dddd') + " " + nextDate.format('l'));
                $(`#day-${i + 1}-icon`).removeClass();
                $(`#day-${i + 1}-icon`).addClass(addIcon(forecastArray[i].weather[0].main));
                //$(`#day-${i + 1}-icon`).className = addIcon(forecastArray[i].weather[0].main)
                $(`#day-${i + 1}-icon`).addClass("fa-3x py-4");
                $(`#day-${i + 1}-temp`).text("Temperature: " + convertTemp(forecastArray[i].main.temp));
                $(`#day-${i + 1}-humid`).text("Humidity: " + forecastArray[i].main.humidity + "%");

                // $(".forecast-date").text(nextDate.format('dddd') + " " + nextDate.format('l'));
                // $(".forecast-icon").removeClass();
                // $(".forecast-icon").addClass(addIcon(forecastArray[i].weather[0].main));
                // $(".forecast-icon").addClass("fa-3x py-4");
                // $(".forecast-temp").text("Temperature: " + convertTemp(forecastArray[i].main.temp));
                // $(".forecast-humid").text("Humidity: " + forecastArray[i].main.humidity + "%");
            }
        });
    }

    function renderDisplay(city) {
        // displays the current weather for the specified city
        displayWeather(city);

        // displays the 5-day forecast for the specified city
        displayForecast(city);
    }

    function enableRadioButtons() {
        radioDiv.empty();

        recentLocations.forEach(location => {
            var radioLabel = $("<label>");
            radioLabel.addClass("btn btn-light p-4 text-left border border-secondary");
            radioLabel.attr("value", location);
            radioLabel.text(location);

            radioLabel.click(function () {
                // console.log(location);
                renderDisplay(location);
            });

            var radioInput = $("<input>");
            radioInput.attr("type", "radio");

            radioLabel.append(radioInput);

            radioDiv.append(radioLabel);
        });
    }

    function enableSearchBar() {
        searchButton.click(function () {
            event.preventDefault();

            renderDisplay(searchInput.val());

            // would a call back be a better way to do this?
            // why does enter work to submit the form, is it because it's in a form tag
            setTimeout(function () {
                if (displayCity.text() != recentLocations[0]) {
                    recentLocations.unshift(displayCity.text());
                    recentLocations.pop();
                    localStorage.setItem("recentSearches", JSON.stringify(recentLocations));
                    enableRadioButtons();
                }
            }, 200);
        });
    }

    // -----------------------------------------------------------------------------------

    function main() {
        // to be removed
        localStorage.clear();
        console.clear();

        // disp recent searches from localStorage
        getRecentSearches();

        // enables radio buttons functionality
        enableRadioButtons();

        // enables search bar functionality
        enableSearchBar();

        // sets the default weather display
        renderDisplay(recentLocations[0]);
    }

    main();
});