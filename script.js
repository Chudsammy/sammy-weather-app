document.getElementById('getWeatherBtn').addEventListener('click', getWeeklyForecast);

async function getWeeklyForecast() {
    const state = document.getElementById('stateInput').value.trim();
    const unit = document.getElementById('unitSelector').value; // Get selected unit
    // Load Font Awesome
// const link = document.createElement('link');
// link.rel = 'stylesheet';
// link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css';



    const internet = document.getElementById("internet");
    const valid = document.getElementById("valid_state");
    const load = document.getElementById("loading");
    const error_text = document.getElementById("error");

    // Check if the user is online
    if (!navigator.onLine) {
        internet.classList.remove("hidden");
        valid.classList.add("hidden");
            load.classList.add("hidden");
            error_text.classList.add("hidden");
        document.getElementById('internet').innerText = 'Please connect to the internet.';
        return;
    } else {
        if (!state) {
            valid.classList.remove("hidden");
            internet.classList.add("hidden");
            load.classList.add("hidden");
            error_text.classList.add("hidden");
            document.getElementById('valid_state').innerText = 'Please enter a valid state or city.';
            return;
        }
        else{
            load.classList.remove("hidden");
            valid.classList.add("hidden");
            internet.classList.add("hidden");
            error_text.classList.add("hidden");
            document.getElementById('loading').innerText = 'Loading...'; // Show loading message
        }
        


fetch("config.json")
.then(response => response.json())
.then(apidata => {
    console.log(apidata.apiKey)
    const apiKey = apidata.apiKey;
   
    displayapidata(apiKey);
})



async function displayapidata(apiKey) {
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${state},&appid=${apiKey}&units=${unit}`; // Use selected unitz
        try {
            const response = await fetch(url);
           

    if (!response.ok) {
        
        throw new Error('City/State not found');
            }
            const data = await response.json();
            displayCurrentWeather(data, unit); // Display current day's weather
            displayWeeklyForecast(data, unit); // Display the rest of the week's forecast
        } catch (error) {
            
            internet.classList.add("hidden");
            valid.classList.add("hidden");
            load.classList.add("hidden");
            error_text.classList.remove("hidden");
            if(error){
                const weatherResult = document.getElementById('weatherResult');
            const weatherResult_box = document.getElementById('weatherResult_box');
            weatherResult.style.display = "none";
        weatherResult_box.style.display = "none";
        document.getElementById('error').innerText = error.message;
            }
            
        }
}
    }
}

function displayCurrentWeather(data, unit) {
    const weatherResult = document.getElementById('weatherResult');
    const weatherResult_box = document.getElementById('weatherResult_box');
    const currentDate = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
    const currentForecast = data.list.find(item => item.dt_txt.startsWith(currentDate)); // Find today's forecast
    const weatherIconMap = {
        "200": "fas fa-bolt", // Thunderstorm
        "201": "fas fa-bolt",
        "300": "fas fa-cloud-drizzle", // Drizzle
        "500": "fas fa-cloud-showers-heavy", // Rain
        "600": "fas fa-snowflake", // Snow
        "800": "fas fa-sun", // Clear sky
        "801": "fas fa-cloud", // Few clouds
        "802": "fas fa-cloud", // Scattered clouds
        "803": "fas fa-cloud", // Broken clouds
        "804": "fas fa-cloud" // Overcast clouds
    };

    if (currentForecast) {
        const temp = currentForecast.main.temp;
        const weatherDescription = currentForecast.weather[0].description;
        const weatherId = currentForecast.weather[0].id;
        const iconCode = currentForecast.weather[0].icon; // This gets the icon code
        const iconUrl = `http://openweathermap.org/img/wn/${iconCode}@2x.png`; // This constructs the URL for the icon
        const pressure = currentForecast.main.pressure;
        const humidity = currentForecast.main.humidity;

        const internet = document.getElementById("internet");
    const valid = document.getElementById("valid_state");
    const load = document.getElementById("loading");
    const error_text = document.getElementById("error");
    

        internet.classList.add("hidden");
        valid.classList.add("hidden");
        load.classList.add("hidden");
        error_text.classList.add("hidden");

        weatherResult.style.display = "grid";
        weatherResult_box.style.display = "flex";

        weatherResult.innerHTML += `
            <div>
            <h3>Current Weather (${currentDate})</h3>
            <p>Temperature: ${Math.round(temp)}°${unit === 'metric' ? 'C' : 'F'}</p>
             <span>
             <img src="${iconUrl}" alt="${weatherDescription}">
            <p>${weatherDescription}</p>
             </span>
             <p>Temperature: ${Math.round(temp)}°${unit === 'metric' ? 'C' : 'F'}</p>
            <p>Pressure: ${pressure} hPa</p>
            <p>Humidity: ${humidity}%</p>
            </div>
        `;
        weatherResult_box.innerHTML += `
            <div>
            <h6>Current Weather (${currentDate})</h6>
            <p>Temperature: ${Math.round(temp)}°${unit === 'metric' ? 'C' : 'F'}</p>
            <img src="${iconUrl}" alt="${weatherDescription}">
            <p>Description: ${weatherDescription}</p>
            </div>
        `;
    }
}

function displayWeeklyForecast(data, unit) {
    const weatherResult = document.getElementById('weatherResult');
    const weatherResult_box = document.getElementById('weatherResult_box');
    const forecastList = data.list; // Get the forecast list
    const uniqueDates = [...new Set(forecastList.map(item => item.dt_txt.split(' ')[0]))]; // Get unique dates

    // Get country code and coordinates from the data
    const countryCode = data.city.country;
    const coordinates = data.city.coord;

    const weatherIconMap = {
        "200": "fas fa-bolt", // Thunderstorm
        "201": "fas fa-bolt",
        "300": "fas fa-cloud-drizzle", // Drizzle
        "500": "fas fa-cloud-showers-heavy", // Rain
        "600": "fas fa-snowflake", // Snow
        "800": "fas fa-sun", // Clear sky
        "801": "fas fa-cloud", // Few clouds
        "802": "fas fa-cloud", // Scattered clouds
        "803": "fas fa-cloud", // Broken clouds
        "804": "fas fa-cloud" // Overcast clouds
    };

    uniqueDates.forEach(date => {
        const dailyForecast = forecastList.filter(item => item.dt_txt.startsWith(date));
        const avgTemp = dailyForecast.reduce((sum, item) => sum + item.main.temp, 0) / dailyForecast.length;
        const weatherDescription = dailyForecast[0].weather[0].description; // Use the first entry's description
        const iconCode = dailyForecast[0].weather[0].icon; // This gets the icon code
        const iconUrl = `http://openweathermap.org/img/wn/${iconCode}@2x.png`; // This constructs the URL for the icon
        
        const pressure = dailyForecast[0].main.pressure; // Pressure from the first entry
        const humidity = dailyForecast[0].main.humidity; // Humidity from the first entry

        // Create a Date object to get the day of the week
        const dayOfWeek = new Date(date).toLocaleString('en-US', { weekday: 'long' });

        const internet = document.getElementById("internet");
    const valid = document.getElementById("valid_state");
    const load = document.getElementById("loading");
    const error_text = document.getElementById("error");
    const weatherId = dailyForecast[0].weather[0].id;

    weatherResult.style.display = "grid";
        weatherResult_box.style.display = "flex";
    

        internet.classList.add("hidden");
        valid.classList.add("hidden");
        load.classList.add("hidden");
        error_text.classList.add("hidden");

        weatherResult.innerHTML += `
            <div>
            <h3>${dayOfWeek}, ${date} (${countryCode})</h3>
            <p>Coordinates: Latitude ${coordinates.lat}, Longitude ${coordinates.lon}</p>
            <span>
             <img src="${iconUrl}" alt="${weatherDescription}">
            <p>${weatherDescription}</p>
             </span>
             <p>Average Temperature: ${Math.round(avgTemp)}°${unit === 'metric' ? 'C' : 'F'}</p>
            <p>Pressure: ${pressure} hPa</p>
            <p>Humidity: ${humidity}%</p>
            </div>
        `;
        weatherResult_box.innerHTML += `
            <div>
            <h6>${dayOfWeek}, ${date} (${countryCode})</h6>
            <p>Average Temperature: ${Math.round(avgTemp)}°${unit === 'metric' ? 'C' : 'F'}</p>
            <img src="${iconUrl}" alt="${weatherDescription}">
            <p>Description: ${weatherDescription}</p>
            </div>
        `;
    });



   
}

function displayWeeklyForecast(data, unit) {
    const weatherResult = document.getElementById('weatherResult');
    const weatherResult_box = document.getElementById('weatherResult_box');
    weatherResult.innerHTML = ''; // Clear previous results
    weatherResult_box.innerHTML = '' // Clear previous results

    const forecastList = data.list; // Get the forecast list
    const uniqueDates = [...new Set(forecastList.map(item => item.dt_txt.split(' ')[0]))]; // Get unique dates

    // Get country code and coordinates from the data
    const countryCode = data.city.country;
    const coordinates = data.city.coord;

    const weatherIconMap = {
        "200": "fas fa-bolt", // Thunderstorm
        "201": "fas fa-bolt",
        "300": "fas fa-cloud-drizzle", // Drizzle
        "500": "fas fa-cloud-showers-heavy", // Rain
        "600": "fas fa-snowflake", // Snow
        "800": "fas fa-sun", // Clear sky
        "801": "fas fa-cloud", // Few clouds
        "802": "fas fa-cloud", // Scattered clouds
        "803": "fas fa-cloud", // Broken clouds
        "804": "fas fa-cloud" // Overcast clouds
    };

    uniqueDates.forEach(date => {
        const dailyForecast = forecastList.filter(item => item.dt_txt.startsWith(date));
        const avgTemp = dailyForecast.reduce((sum, item) => sum + item.main.temp, 0) / dailyForecast.length;
        const weatherDescription = dailyForecast[0].weather[0].description; // Use the first entry's description
        const weatherId = dailyForecast[0].weather[0].id;
        const iconCode = dailyForecast[0].weather[0].icon; // This gets the icon code
        const iconUrl = `http://openweathermap.org/img/wn/${iconCode}@2x.png`; // This constructs the URL for the icon
        const pressure = dailyForecast[0].main.pressure; // Pressure from the first entry
        const humidity = dailyForecast[0].main.humidity; // Humidity from the first entry

        // Create a Date object to get the day of the week
        const dayOfWeek = new Date(date).toLocaleString('en-US', { weekday: 'long' });
        const internet = document.getElementById("internet");
    const valid = document.getElementById("valid_state");
    const load = document.getElementById("loading");
    const error_text = document.getElementById("error");
    

        internet.classList.add("hidden");
        valid.classList.add("hidden");
        load.classList.add("hidden");
        error_text.classList.add("hidden");

        weatherResult.style.display = "grid";
        weatherResult_box.style.display = "flex";

        weatherResult.innerHTML += `
            <div>
            <h3>${dayOfWeek}, ${date} (${countryCode})</h3>
            <p>Coordinates: Latitude ${coordinates.lat}, Longitude ${coordinates.lon}</p>
            <span>
             <img src="${iconUrl}" alt="${weatherDescription}">
            <p>${weatherDescription}</p>
             </span>
             <p>Average Temperature: ${Math.round(avgTemp)}°${unit === 'metric' ? 'C' : 'F'}</p>
            <p>Pressure: ${pressure} hPa</p>
            <p>Humidity: ${humidity}%</p>
            </div>
        `;
        weatherResult_box.innerHTML += `
            <div>
            <h6>${dayOfWeek}, (${countryCode})</h6>
            <p>Average Temperature: ${Math.round(avgTemp)}°${unit === 'metric' ? 'C' : 'F'}</p>
            <img src="${iconUrl}" alt="${weatherDescription}">
            <p>Description: ${weatherDescription}</p>
            </div>
        `;
    });



    const box = weatherResult_box.children;
    const first_box = weatherResult_box.children[0];
const second_box = weatherResult_box.children[1];
const third_box = weatherResult_box.children[2];
const fourth_box = weatherResult_box.children[3];
const fifth_box = weatherResult_box.children[4];
const sixth_box = weatherResult_box.children[5];
const seventh_box = weatherResult_box.children[6];
const eight_box = weatherResult_box.children[7];
const nine_box = weatherResult_box.children[8];
const tenth_box = weatherResult_box.children[9];
////////////////////////////////////////////////
const set = weatherResult.children;
const first_set = weatherResult.children[0];
const second_set = weatherResult.children[1];
const third_set = weatherResult.children[2];
const fourth_set = weatherResult.children[3];
const fifth_set = weatherResult.children[4];
const sixth_set = weatherResult.children[5];
const seventh_set = weatherResult.children[6];
const eight_set = weatherResult.children[7];
const nine_set = weatherResult.children[8];
const tenth_set = weatherResult.children[9];


// first_ssssssssssssssseeeeeeeeeeeeeeeeeeeeeeeetttttttttttttt

// first_boxfirst_boxfirst_box
if(weatherResult_box){
    first_box.classList.add("active");
    first_set.style.display = "grid";
}

if(first_box){
    weatherResult_box.children[0].addEventListener("click", function() {

        first_set.style.display = "grid";
        second_set.style.display = "none";
        third_set.style.display = "none";
        fourth_set.style.display = "none";
        fifth_set.style.display = "none";
        sixth_set.style.display = "none";
        first_box.classList.add("active");
        second_box.classList.remove("active");
        third_box.classList.remove("active");
        fourth_box.classList.remove("active");
        fifth_box.classList.remove("active");
        sixth_box.classList.remove("active");
        seventh_box.classList.remove("active");
    
    
      })
}


// second_box

if(second_box){
    weatherResult_box.children[1].addEventListener("click", function() {
        
        second_set.style.display = "grid";
        first_set.style.display = "none";
        third_set.style.display = "none";
        fourth_set.style.display = "none";
        fifth_set.style.display = "none";
        sixth_set.style.display = "none";
        first_box.classList.remove("active");
        second_box.classList.add("active");
        third_box.classList.remove("active");
        fourth_box.classList.remove("active");
        fifth_box.classList.remove("active");
        sixth_box.classList.remove("active");
        seventh_box.classList.remove("active");
        eight_box.classList.remove("active");
        nine_box.classList.remove("active");
        tenth_box.classList.remove("active");
      })
}
  // third_box

  if(third_box){
    weatherResult_box.children[2].addEventListener("click", function() {

        second_set.style.display = "none";
        first_set.style.display = "none";
        third_set.style.display = "grid";
        fourth_set.style.display = "none";
        fifth_set.style.display = "none";
        sixth_set.style.display = "none";
        first_box.classList.remove("active");
        second_box.classList.remove("active");
        third_box.classList.add("active");
        fourth_box.classList.remove("active");
        fifth_box.classList.remove("active");
        sixth_box.classList.remove("active");
        seventh_box.classList.remove("active");
        eight_box.classList.remove("active");
        nine_box.classList.remove("active");
        tenth_box.classList.remove("active");
      })
  }

    // 4th_box

    if(fourth_box){
        weatherResult_box.children[3].addEventListener("click", function() {
            second_set.style.display = "none";
            first_set.style.display = "none";
            third_set.style.display = "none";
            fourth_set.style.display = "grid";
            fifth_set.style.display = "none";
            sixth_set.style.display = "none";
            first_box.classList.remove("active");
            second_box.classList.remove("active");
            third_box.classList.remove("active");
            fourth_box.classList.add("active");
            fifth_box.classList.remove("active");
            sixth_box.classList.remove("active");
            seventh_box.classList.remove("active");
            eight_box.classList.remove("active");
            nine_box.classList.remove("active");
            tenth_box.classList.remove("active");
          })
    }


      // 55th_box

      if(fifth_box){
        weatherResult_box.children[4].addEventListener("click", function() {


            second_set.style.display = "none";
        first_set.style.display = "none";
        third_set.style.display = "none";
        fourth_set.style.display = "none";
        fifth_set.style.display = "grid";
        sixth_set.style.display = "none";
            first_box.classList.remove("active");
            second_box.classList.remove("active");
            third_box.classList.remove("active");
            fourth_box.classList.remove("active");
            fifth_box.classList.add("active");
            sixth_box.classList.remove("active");
            seventh_box.classList.remove("active");
            eight_box.classList.remove("active");
            nine_box.classList.remove("active");
            tenth_box.classList.remove("active");
          })
      }
        // 6666666th_box


        if(sixth_box){
            weatherResult_box.children[5].addEventListener("click", function() {


                second_set.style.display = "none";
        first_set.style.display = "none";
        third_set.style.display = "none";
        fourth_set.style.display = "none";
        fifth_set.style.display = "none";
        sixth_set.style.display = "grid";
                first_box.classList.remove("active");
                second_box.classList.remove("active");
                third_box.classList.remove("active");
                fourth_box.classList.remove("active");
                fifth_box.classList.remove("active");
                sixth_box.classList.add("active");
                seventh_box.classList.remove("active");
                eight_box.classList.remove("active");
                nine_box.classList.remove("active");
                tenth_box.classList.remove("active");
              })
        }








       



























}






