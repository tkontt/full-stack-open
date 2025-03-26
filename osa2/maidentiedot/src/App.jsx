import { useState, useEffect } from 'react'
import Filter from './components/Filter'
import searchService from './services/Search'

const App = () => {
  const [countries, setCountries] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCountry, setSelectedCountry] = useState(null)
  const [weather, setWeather] = useState(null)

  useEffect(() => {
    searchService.getAll()
      .then(initialCountries => {
        setCountries(initialCountries)
      })
  }, [])

  useEffect(() => {
    if (selectedCountry && selectedCountry.capital) {
      searchService.getWeather(selectedCountry.capital[0])
        .then(weatherData => {
          setWeather(weatherData)
        })
        .catch(error => {
          console.error('Error fetching weather:', error)
          setWeather(null)
        })
    }
  }, [selectedCountry])

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value)
    setSelectedCountry(null)
  }

  const filteredCountries = countries.filter(country =>
    country.name.common.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const showCountry = (country) => {
    console.log('Selected country:', country.name.common)
    setSelectedCountry(country)
  }

  const WeatherInfo = ({ city, weatherData }) => {
    if (!weatherData) return null
    
    return (
      <div>
        <h3>Weather in {city}</h3>
        <p>temperature {weatherData.main.temp} Celsius</p>
        <img 
          src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
          alt={weatherData.weather[0].description}
        />
        <p>wind {weatherData.wind.speed} m/s</p>
      </div>
    )
  }

  if (selectedCountry) {
    return (
      <div>
        <Filter 
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <div>
          <h2>{selectedCountry.name.common}</h2>
          <p>capital {selectedCountry.capital}</p>
          <p>area {selectedCountry.area}</p>
          <h3>languages:</h3>
          <ul>
            {Object.values(selectedCountry.languages).map(language => 
              <li key={language}>{language}</li>
            )}
          </ul>
          <img 
            src={selectedCountry.flags.png} 
            alt={`Flag of ${selectedCountry.name.common}`}
            width="150"
          />
          <WeatherInfo 
            city={selectedCountry.capital[0]} 
            weatherData={weather}
          />
        </div>
      </div>
    )
  }

  let content = <p>Start typing to search for a country</p>

  if (searchTerm !== '') {
    if (filteredCountries.length > 10) {
      content = <p>Too many matches, specify another filter</p>
    } else if (filteredCountries.length <= 10 && filteredCountries.length > 1) {
      content = (
        <div>
          {filteredCountries.map(country => (
            <div key={country.name.common}>
              {country.name.common}
              <button onClick={() => showCountry(country)}>show</button>
            </div>
          ))}
        </div>
      )
    } else if (filteredCountries.length === 1) {
      const country = filteredCountries[0]
      content = (
        <div>
          <h2>{country.name.common}</h2>
          <p>capital {country.capital}</p>
          <p>area {country.area}</p>
          <h3>languages:</h3>
          <ul>
            {Object.values(country.languages).map(language => 
              <li key={language}>{language}</li>
            )}
          </ul>
          <img 
            src={country.flags.png} 
            alt={`Flag of ${country.name.common}`}
            width="150"
          />
        </div>
      )
    } else {
      content = <p>No matches found</p>
    }
  }

  return (
    <div>
      <Filter 
        value={searchTerm}
        onChange={handleSearchChange}
      />
      {content}
    </div>
  )
}

export default App