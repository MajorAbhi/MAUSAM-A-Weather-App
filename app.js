//-----------------------------Main-------------------------------------
var cityName = document.getElementById('city');
var search = document.getElementById('search');
var pseudo = document.querySelector('.pseudo');
var unitButton = document.querySelector('.unit-btns');
var container = document.querySelector('.container');
var date = document.getElementById('date');
var loca = document.getElementById('location');
var weatherIcon = document.getElementById('icon');
var weatherMain = document.getElementById('weather-main');
var weatherDesc = document.getElementById('weather-desc');
var weatherTemp = document.getElementById('weather-temp');
var weatherTempFeel = document.getElementById('weather-temp-feel');
var wind = document.getElementById('wind');
var humid = document.getElementById('humidity');
var press = document.getElementById('pressure');
var vis = document.getElementById('visibility');
var canvas = document.getElementById("myCanvas");
var error = document.querySelector(".error");

var monthNames = ["", "Jan", "Feb", "March", "April", "May", "June",
"July", "Aug", "Sept", "Oct", "Nov", "Dec"];


//It will contain both of our unit buttons
var unitBtns = document.querySelectorAll(".unit-btn");

//Check which unit is enabled
var cel = true;
//Create a chart object 
var chart = {};

//When Search button is clicked
search.addEventListener('click', ()=>showWeather(cityName.value));

function showWeather(city)
{
    if(city=='')
    {
        if(error.classList.contains('active')) return;
        else error.classList.add('active');
    }
    else
    {
        if(error.classList.contains('active')) error.classList.remove('active');
        //Create a request to Convert City name to lat and longitude using GeoCoding API
        var requestCor = new XMLHttpRequest();

        requestCor.onload = function reqWeather()
        {
            var cord = JSON.parse(requestCor.responseText);

            //If No such city exists than show error
            if(cord == '')
            {
                document.getElementById('cityError').innerHTML = "No Such City Exists. Please search again";
                if(pseudo.classList.contains('active')) return;
                else
                {
                            pseudo.classList.toggle('active');
                            unitButton.classList.toggle('active');
                            container.classList.toggle('active');
                }

            }
            else
            {

                //Required variables
                var unit, unitName;
                
                //Store lat and longitude
                var lat = cord[0].lat;
                var lon = cord[0].lon;

                var requestWeather = new XMLHttpRequest();
            
                requestWeather.onload = function()
                {
                    //Store Weather data
                    var data = JSON.parse(requestWeather.responseText);
                     
                    //Get Time and Date from api and format it using substr()
                    var reqTime = new XMLHttpRequest();

                    reqTime.onload = function ()
                    {
                        //Get and Parse DateTime and format it using slice method
                        var timeData = JSON.parse(reqTime.responseText).formatted;
                        let getDate = parseInt(timeData.slice(8, 10));
                        let getMonth = parseInt(timeData.slice(5, 7));
                        let getHour = parseInt(timeData.slice(11, 13));
                        let getMinute = timeData.slice(14, 16);
                        let time;
                        if(getHour >= 12) time = 'PM'; else time = 'AM';
                        date.innerHTML = `${getDate} ${monthNames[getMonth]}, ${getHour}:${getMinute} ${time}`;

                        //Insert Location
                        loca.innerHTML = `${cord[0].name}, ${cord[0].country}`;

                        //Use the Icon variable
                        let iconId = data.current.weather[0].icon;
                        weatherIcon.src = `//openweathermap.org/img/wn/${iconId}@2x.png`;
                        
                        //Weather Data
                        weatherMain.innerHTML = data.current.weather[0].main;
                        weatherDesc.innerHTML = data.current.weather[0].description;
                        weatherTemp.innerHTML = `${parseInt(data.current.temp)} ${unitName}`;
                        weatherTempFeel.innerHTML = `Feels like: ${parseInt(data.current.feels_like)} ${unitName}`;

                        // Additional Details about Weather
                        let windUnit;
                        if(cel) windUnit = 'm/s'; else windUnit = 'mph';
                        wind.innerHTML = `Wind: ${data.current.wind_speed} ${windUnit}`;
                        humid.innerHTML = `Humidity: ${data.current.humidity} %`;
                        press.innerHTML = `Pressure: ${data.current.pressure} hPa`;
                        vis.innerHTML = `Visibility: ${data.current.visibility/1000} Km`;
                    
                        // Store Forecast weather description
                        let days = [data.daily[0].weather[0].description,
                        data.daily[1].weather[0].description,
                        data.daily[2].weather[0].description,
                        data.daily[3].weather[0].description,
                        data.daily[4].weather[0].description]

                        //Store Forecast temp
                        let daysTemp = [data.daily[0].temp.day,
                        data.daily[1].temp.day,
                        data.daily[2].temp.day,
                        data.daily[3].temp.day,
                        data.daily[4].temp.day,];

                        //Show Unit buttons and  Container Div
                        if(pseudo.classList.contains('active'))
                        {
                            pseudo.classList.toggle('active');
                            unitButton.classList.toggle('active');
                            container.classList.toggle('active');
                        }

                        //Check if Canvas is in Use or not
                        if(Object.keys(chart).length != 0) chart.destroy();
                        

                        //Generate Chart
                        chart = new Chart(canvas, {
                            type: 'bar',
                            data: {
                                labels: [`"${days[0]}"`, `"${days[1]}"`, `"${days[2]}"`, `"${days[3]}"`, `"${days[4]}"`],
                                datasets: [{
                                    label: `Temperature in ${unitName}`,
                                    data: [daysTemp[0], daysTemp[1], daysTemp[2], daysTemp[3], daysTemp[4]],
                                    backgroundColor: 'rgba(59, 59, 59, 1)'
                                }
                                ]
                            }
                        }
                        );
                    }

                    reqTime.open("GET",`//api.timezonedb.com/v2.1/get-time-zone?key=KAKM3RZHGDK9&format=json&by=position&lat=${lat}&lng=${lon}`);
                    reqTime.send();

                    
                }
                if(cel) {unit = 'metric';unitName = "°C"} 
                else {unit = "imperial";unitName = "F"}
                requestWeather.open("GET", `//api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly&appid=73bf224f07dfbffd8b917ebe6c192a8e&units=${unit}`);
                requestWeather.send();
            }
        }
        requestCor.open("GET", "//api.openweathermap.org/geo/1.0/direct?limit=1&appid=73bf224f07dfbffd8b917ebe6c192a8e&q="+city);
        requestCor.send();
    }
}
//Event listener for Unit buttons
unitBtns.forEach(button => button.addEventListener('click', ()=>
{
    if(button.classList.contains('activeBtn')) return;
    else
    {
        //If Fahrenheit is Clicked
        if(button.nextElementSibling===null)
        {
            button.classList.toggle('activeBtn');
            button.previousElementSibling.classList.remove('activeBtn');
            cel = false;
            showWeather(cityName.value);
        }
        //If celsius is clicked
        else
        {
            button.classList.toggle('activeBtn');
            button.nextElementSibling.classList.remove('activeBtn');
            cel = true;
            showWeather(cityName.value);
        }
    }
}))






