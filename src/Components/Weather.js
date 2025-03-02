import React, { useEffect, useRef, useState } from 'react';
import './Weather.css';
import search_icon from '../IMG/search.png';
import clear_icon from '../IMG/clear.png';
import cloud_icon from '../IMG/cloud.png';
import drizzle_icon from '../IMG/drizzle.png';
import humidity_icon from '../IMG/humidity.png';
import rain_icon from '../IMG/rain.png';
import snow_icon from '../IMG/snow.png';
import wind_icon from '../IMG/wind.png';
import Swal from 'sweetalert2'


function Weather() {
  const ApiKey = 'e5e00da9f49c3cb975b81d6ca2ecc403';

  // step-3 Setting state--
  const [weatherData, setWeatherData] = useState(false);

  // step-5 (Storing the user input as an ref using useRef() Hook to reuse in btn trigger)
  const inputRef = useRef();

  // step-4 Setting img related to API
  const allIcons = {
    '01d' : clear_icon, 	'01n' : clear_icon, 
    '02d' : cloud_icon, 	'02n' : cloud_icon, 
    '03d' : cloud_icon, 	'03n' : cloud_icon, 
    '04d' : drizzle_icon, 	'04n' : drizzle_icon, 
    '09d' : rain_icon, 	'09n' : rain_icon, 
    '10d' : rain_icon, 	'10n' : rain_icon,
    '13d' : snow_icon, 	'13n' : snow_icon,
  }


  // step-2 (Weather API > link copy > fetch it here..using async & await)
  const search = async (city) => {

    if(city === '') {    // If Input === ''
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Enter City Name",
      });
      return;
    }
    try{
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${ApiKey}`;
      const response = await fetch(url);
      const data = await response.json();

      if(!response.ok) {      // If mismatched data,
        Swal.fire({
          icon: "warning",
          title: "Invalid",
          text: "City not found",
        });
        inputRef.current.value = '';
        return;
      }

      // Setting the server response as an Obj. into this setter function
      setWeatherData({
        humidity : data.main.humidity,
        speed : data.wind.speed,
        temp : Math.floor(data.main.temp),
        location : data.name,
        icon : allIcons[data.weather[0].icon] || clear_icon,
      });
    }
    catch(error){
      setWeatherData(false);
      console.error('Error arise when fetching the data');
    }
    inputRef.current.value = '';
  }
  useEffect(() => {
    search('Cuba');
  }, []);

  // step-1 (Building html content that we want)
  return (
    <div className='weather'>
      {/* Search box & Btn */}
      <div className="search-bar">
        <input type="text" placeholder='Search here' ref={inputRef} />
        <img src={search_icon} alt="" onClick={() => search(inputRef.current.value)} />
      </div>

       {weatherData      // if weatherData is get from server w/o any error ===> input below elements will be displayed otherwise...an Empty fragment.
       ? 
       <>
          {/* Climate Icon */}
          <img src={weatherData.icon} alt="weather_icon" className='weather-icon' />

          {/* Temerature */}
          <p className='temp'>{weatherData.temp}&deg;C</p>

          {/* City name */}
          <p className='location'>{weatherData.location}</p>

          {/* Humidity & Wind data */}
          <div className="weather-data">
            <div className="col">
              <img src={humidity_icon} alt="" />
              <div>
                <p>{weatherData.humidity} %</p>
                <span>Humidity</span>
              </div>
            </div>

            <div className="col">
              <img src={wind_icon} alt="" />
              <div>
                <p>{weatherData.speed} km/h</p>
                <span>Wind Speed</span>
              </div>
            </div>
          </div>
       </>
      : 
      <>
      </>} 
    </div>
  )
}

export default Weather;
