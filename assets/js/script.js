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
var apiKey = "2a18a4bd088cf490e2961f33d5aaf971";
var fiveDayEl = $("#five-day");
var searchHistContainerEl = $("#searchHistoryContainer");
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
    // CALL FUNCTION TO GET CURRENT WEATHER
    setHistoryButtons();
    getWeatherNow();
    fiveDayEl.empty();
};



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
    }
    $(".historyBtn").on("click", function (event) {
        event.preventDefault();
        city = $(this).text();
        fiveDayEl.empty();
        getWeatherNow();
    });
};

function fiveDayForecast() {

    var fiveDayUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=imperial&appid=" + apiKey;

    fetch(fiveDayUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            var futureArray = data.list;
            var futureWeather = [];
            $.each(futureArray, function (index, value) {
                fiveDayObj = {
                    date: value.dt_txt.split(' ')[0],
                    time: value.dt_txt.split(' ')[1],
                    temp: value.main.temp,
                    icon: value.weather[0].icon,
                    wind: value.wind.speed,
                    humidity: value.main.humidity
                }
                if (value.dt_txt.split(' ')[1] === "12:00:00") {
                    futureWeather.push(fiveDayObj);
                }
            })
            for (let i = 0; i < futureWeather.length; i++) {
                var divCardEl = $('<div>');
                divCardEl.attr('class', 'card text-white bg-primary mb-3 cardOne');
                divCardEl.attr('style', 'max-width: 200px;');
                fiveDayEl.append(divCardEl);

                var divDateEl = $('<div>');
                divDateEl.attr('class', 'card-header')
                var m = moment(`${futureWeather[i].date}`).format('MM-DD-YYYY');
                divDateEl.text(m);
                divCardEl.append(divDateEl)

                var divBodyEL = $('<div>');
                divBodyEL.attr('class', 'card-body');
                divCardEl.append(divBodyEL);

                var iconEl = $('<img>');
                iconEl.attr('class', 'icons');
                iconEl.attr('src', `https://openweathermap.org/img/wn/${futureWeather[i].icon}@2x.png`);
                divBodyEL.append(iconEl);

                var pTempEl1 = $('<p>').text(`Temp: ${futureWeather[i].temp} °F`);
                divBodyEL.append(pTempEl1);
                var pWindEl1 = $('<p>').text(`Wind: ${futureWeather[i].wind} MPH`);
                divBodyEL.append(pWindEl1);
                var pHumidEl = $('<p>').text(`Humidity: ${futureWeather[i].humidity} %`);
                divBodyEL.append(pHumidEl);
            }
        });
};

// FUNCTION TO GET CURRENT WEATHER
function getWeatherNow() {
    if (city === "") {
        return;
    };
    // get weather data
    console.log(city);

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
    fiveDayForecast();
};



function loadButtons() {

    var searchHistStore = JSON.parse(localStorage.getItem('city'));

    if (searchHistStore !== null) {
        searchHist = searchHistStore
    }

    setHistoryButtons();
};

$("#clear-history").on("click", function (event) {
    event.preventDefault();
    localStorage.clear();
    location.reload();
});

searchButton.addEventListener('click', searchCity);
loadButtons();