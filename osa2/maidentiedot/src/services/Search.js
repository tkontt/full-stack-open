import axios from 'axios'

const baseUrl = 'https://studies.cs.helsinki.fi/restcountries/api'
const weatherApiKey = import.meta.env.VITE_WEATHER_API_KEY

const getAll = () => {
  return axios.get(`${baseUrl}/all`)
    .then(response => response.data)
}

const getOne = (name) => {
  return axios.get(`${baseUrl}/name/${name}`)
    .then(response => response.data)
}

const getWeather = (city) => {
  const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${weatherApiKey}&units=metric`
  return axios.get(weatherUrl)
    .then(response => response.data)
}

export default { getAll, getOne, getWeather }


