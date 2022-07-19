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

function getApi() {
    var city = $("#search-city").val();
    console.log(city);
    var apiKey = "2a18a4bd088cf490e2961f33d5aaf971";
    var weatherUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + apiKey + "&units=imperial";
    console.log(weatherUrl);
    $(currentWeatherContainer).empty();
    textInput.value = "";
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

            var cityLongitude = data.coord.lon;
            var cityLattitude = data.coord.lat;

            var uvIndexUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + cityLattitude + "&lon=" + cityLongitude + "&exclude=hourly,daily,minutely&appid=" + apiKey;


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

searchButton.addEventListener('click', getApi);


