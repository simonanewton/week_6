$(document).ready(function () {
    
    // variables for the side bar search and radio div
    var searchInput = $("#search-input");
    var searchButton = $("#search-btn");
    var radioDiv = $("#radio-div");

    // variables for rendering the current weather display
    var displayCity = $("#display-city");
    var displayDate = $("#display-date");
    var displayIcon = $("#display-icon");
    var displayTemp = $("#display-temp");
    var displayHumid = $("#display-humid");
    var displayWind = $("#display-wind");
    var displayUV = $("#display-UV");
    var displayIndex = $("#display-index");

    // variables for rendering the forecast weather display
    var forecastDate = $(".forecast-date");
    var forecastIcon = $(".forecast-icon");
    var forecastTemp = $(".forecast-temp");
    var forecastHumid = $(".forecast-humid");

    // given API key from the openweathermap API
    var APIkey = "5127b984f77556497cf3b63325863b1a";

    // variable for storing the recently searched cities
    var recentLocations;

    // -----------------------------------------------------------------------------------

    function getRecentSearches() {
        // get the array of recently searched locations from the localStorage
        recentLocations = JSON.parse(localStorage.getItem("recentSearches"));

        // if there are no recent locations stored in localStorage, create a default array
        if (!recentLocations) {
            recentLocations = ["Atlanta, US", "Chicago, US", "New York, US", "Orlando, US",
                "San Francisco, US", "Seattle, US", "Denver, US"];
        }
    }

    function convertTemp(Kelvin) {
        // convert the temperature to fahrenheit then round the output and format it
        var Fahrenheit = ((Kelvin - 273.15) * 1.8) + 32;
        return Math.round(Fahrenheit) + " °F";
    }

    function addIcon(condition) {
        // compare the given condition to preset values and return the corresponding Font Awesome icon class
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
        // compare the the value of the index to different UV severity levels and color code them accordingly
        switch (true) {
            case (index < 4):
                displayIndex.removeClass();
                displayIndex.addClass("px-3 py-1 rounded d-inline-block bg-success text-white");
                break;
            case (index < 7):
                displayIndex.removeClass();
                displayIndex.addClass("px-3 py-1 rounded d-inline-block bg-warning text-white");
                break;
            case (index < 10):
                displayIndex.removeClass();
                displayIndex.addClass("px-3 py-1 rounded d-inline-block bg-danger text-white");
                break;
            case (index > 10):
                displayIndex.removeClass();
                displayIndex.addClass("px-3 py-1 rounded d-inline-block bg-dark text-white");
                break;
        }
    }

    function displayUVIndex(lat, lon) {
        // queryURL for retrieving the current UV Index data for the coordinates
        var queryURL = `https://api.openweathermap.org/data/2.5/uvi?appid=${APIkey}&lat=${lat}&lon=${lon}`;

        console.log(queryURL);

        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            // add the response data to the UV Index on the display
            displayUV.text("UV Index: ");
            displayIndex.text(response.value);

            // color code the level of the UV Index
            colorCodeIndex(response.value);
        });
    }

    function displayWeather(city) {
        // queryURL for retrieving the current weather data for the given city
        var queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIkey}`;

        console.log(queryURL);

        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            // add the response data to the header of the display
            displayCity.text(response.name + ", " + response.sys.country);
            displayDate.text("(" + moment().format('l') + ")");
            displayIcon.removeClass();
            displayIcon.addClass(`${addIcon(response.weather[0].main)} fa-2x px-2`);

            // add the response data to the body of the display
            displayTemp.text("Temperature: " + convertTemp(response.main.temp));
            displayHumid.text("Humidity: " + response.main.humidity + " %");
            displayWind.text("Wind Speed: " + response.wind.speed + " mph");
            displayUVIndex(response.coord.lat, response.coord.lon);
        });
    }

    function displayForecast(city) {
        // queryURL for retrieving the forecast weather data for the given city
        queryURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${APIkey}`;

        console.log(queryURL);

        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            // empty array for adding forecast dates
            var forecastArray = [];

            // establish the current day
            var currentDay = moment().format('DD');

            // for each 3 hour interval in the response.list 
            response.list.forEach(interval => {
                var forecastDay = moment(interval.dt_txt, 'YYYY-MM-DD HH:mm:ss').format('DD')
                var forecastHour = moment(interval.dt_txt, 'YYYY-MM-DD HH:mm:ss').format('HH');

                // if the list element is in the future and is at noon, add it to the forecastArray
                if (forecastDay != currentDay && forecastHour === "12") forecastArray.push(interval);
            });

            // for each interval added to the forecast array
            for (var i = 0; i < forecastArray.length; i++) {
                // establish the day of the interval
                var forecastDay = moment(forecastArray[i].dt_txt, 'YYYY-MM-DD HH:mm:ss')

                // add the data from the interval to the display
                $(forecastDate[i]).text(forecastDay.format('dddd') + " " + forecastDay.format('l'));
                $(forecastIcon[i]).removeClass();
                $(forecastIcon[i]).addClass(`${addIcon(forecastArray[i].weather[0].main)} fa-3x py-4 `);
                $(forecastTemp[i]).text("Temperature: " + convertTemp(forecastArray[i].main.temp));
                $(forecastHumid[i]).text("Humidity: " + forecastArray[i].main.humidity + " %");
            }
        });
    }

    function renderDisplay(city) {
        // render the current weather for the given city
        displayWeather(city);

        // render the 5-day forecast for the given city
        displayForecast(city);
    }

    function enableRadioButtons() {
        // clear out previously generated buttons the radioDiv
        radioDiv.empty();

        // for each location in the recentLocations array
        recentLocations.forEach(location => {
            // create a radio button for the location
            var radioLabel = $("<label>");
            radioLabel.addClass("btn btn-light p-4 text-left border border-secondary");
            radioLabel.attr("value", location);
            radioLabel.text(location);
            var radioInput = $("<input>");
            radioInput.attr("type", "radio");

            // add the input to the label of the radio button
            radioLabel.append(radioInput);

            // when the radio button is clicked, render the display for the corresponding city
            radioLabel.click(function () {
                renderDisplay(location);
            });

            // add the radio button to the radioDiv
            radioDiv.append(radioLabel);
        });
    }

    function enableSearchBar() {
        // when the search button is clicked
        searchButton.click(function () {

            // prevent the page from being refreshed
            event.preventDefault();

            // render the display with the user input
            renderDisplay(searchInput.val());

            // after 200 milliseconds
            setTimeout(function () {
                // if the input is not the most recently searched city
                if (displayCity.text() != recentLocations[0]) {

                    // add the searched city to the top of the recentLocations array and remove the last city
                    recentLocations.unshift(displayCity.text());
                    recentLocations.pop();

                    // update localStorage and recreate the radio buttons list
                    localStorage.setItem("recentSearches", JSON.stringify(recentLocations));
                    enableRadioButtons();
                }
            }, 200);
        });
    }

    // -----------------------------------------------------------------------------------

    function main() {
        // display recent searches from localStorage
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