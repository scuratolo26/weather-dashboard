// DATE VARS
var today = new Date();
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0');
var yyyy = today.getFullYear();
var now = moment().format('LT');
today = mm + '/' + dd + '/' + yyyy;

// GET WEATHER VARS
var searchButton = document.getElementById('searchBtn');
var currentWeatherContainer = $("#current-weather");
var textInput = document.getElementById('search-city');

// FUNCTION TO SAVE SEARCH HISTORY
var searchHist = [];
var city = "";
function searchCity() {
    city = $("#search-city").val();
    if (city === "") {
        return;
    };
    searchHist.push(city);
    localStorage.setItem('city', JSON.stringify(searchHist));
    console.log(searchHist);
    // CALL FUNCTION TO GET CURRENT WEATHER
    setHistoryButtons();
    getWeatherNow();
};

var searchHistContainerEl = $("#searchHistoryContainer");

function setHistoryButtons() {
    searchHistContainerEl.empty();
    for (let i = 0; i < searchHist.length; i++) {
        var buttonRowEl = $('<row>');
        var buttonEl = $('<button>').text(searchHist[i]);

        buttonRowEl.addClass('row');
        buttonEl.addClass('btn btn-secondary historyBtn');
        buttonEl.attr('type', 'button');

        searchHistContainerEl.prepend(buttonRowEl);
        buttonRowEl.append(buttonEl);
    } if (!city) {
        return;
    };
    $(".historyBtn").on("click", function (event) {
        event.preventDefault();
        city = $(this).text();
        console.log(city);
        getWeatherNow();
    });
};

// FUNCTION TO GET CURRENT WEATHER
function getWeatherNow() {
    if (city === "") {
        return;
    };
    // get weather data
    console.log(city);
    var apiKey = "2a18a4bd088cf490e2961f33d5aaf971";
    var weatherUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + apiKey + "&units=imperial";
    console.log(weatherUrl);
    // clear any previous information
    $(currentWeatherContainer).empty();
    textInput.value = "";

    // create elements and display current weather data
    fetch(weatherUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            temp = data.main.temp;
            console.log(temp);
            $('#city-header').text(data.name + " " + today);
            $('.icons').attr('src', `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`);
            var pTempEl = $('<p>').text("Temp: " + data.main.temp + "°F");
            currentWeatherContainer.append(pTempEl);
            var pWindEl = $('<p>').text("Wind: " + data.wind.speed + " MPH");
            currentWeatherContainer.append(pWindEl);
            var pHumidityEl = $('<p>').text("Humidity: " + data.main.humidity + "%");
            currentWeatherContainer.append(pHumidityEl);

            // get coordinates to use for uv index
            var cityLongitude = data.coord.lon;
            var cityLattitude = data.coord.lat;
            // get uv index
            var uvIndexUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + cityLattitude + "&lon=" + cityLongitude + "&exclude=hourly,daily,minutely&appid=" + apiKey;

            // display uv index & use foor loop to coordinate color with uv intensity
            fetch(uvIndexUrl)
                .then(function (response) {
                    return response.json();
                })
                .then(function (data) {
                    var pUvIndexEl = $('<p>').text(`UV Index: `);
                    var spanUvIndex = $('<span>').text(data.current.uvi);
                    var uvIndex = data.current.uvi;
                    pUvIndexEl.append(spanUvIndex);
                    currentWeatherContainer.append(pUvIndexEl);
                    if (uvIndex >= 0 && uvIndex <= 2) {
                        spanUvIndex.attr('class', 'green');
                    } else if (uvIndex > 2 && uvIndex <= 5) {
                        spanUvIndex.attr("class", "yellow")
                    } else if (uvIndex > 5 && uvIndex <= 7) {
                        spanUvIndex.attr("class", "orange")
                    } else if (uvIndex > 7 && uvIndex <= 10) {
                        spanUvIndex.attr("class", "red")
                    } else {
                        spanUvIndex.attr("class", "purple")
                    }
                });
        });
};

function loadButtons() {

    var searchHistStore = JSON.parse(localStorage.getItem('city'));

    if (searchHistStore !== null) {
        searchHist = searchHistStore
    }
    searchCity();
    setHistoryButtons();
    getWeatherNow();
    console.log("loaded");
};

searchButton.addEventListener('click', searchCity);
loadButtons();