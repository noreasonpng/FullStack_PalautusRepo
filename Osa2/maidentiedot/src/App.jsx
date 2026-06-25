import { useEffect, useState } from 'react'
import countryService from './Services/CountryService'
import Country from './Components/Country'
import WeatherService from './Services/WeatherService'

const App = () => {
    const [countries, setCountries] = useState([])
    const [searchValue, setSearchValue] = useState('')
    const [selectedCountry, setSelectedCountry] = useState(null)
    const [countryWeather, setCountryWeather] = useState(null)
    
    const countriesToShow = searchValue
        ? countries.filter(country =>
                country.name.common.toLowerCase().includes(searchValue.toLowerCase())
            )
        : countries
    const singleVisibleCountry = countriesToShow.length === 1 ? countriesToShow[0] : null

    useEffect(() => {
        countryService  
        .getAll()
        .then(initialCountries => {  
        setCountries(initialCountries)
        })
    }, [])

    useEffect(() => {
        const fetchWeatherFor = (country) => {
            const capital = Array.isArray(country.capital) ? country.capital[0] : country.capital
            if (!capital) {
                setCountryWeather(null)
                return
            }

            WeatherService
            .getByCity(capital)
            .then(data => setCountryWeather(data))
            .catch(() => setCountryWeather(null))
        }

        const countryToShow = selectedCountry ?? singleVisibleCountry

        if (countryToShow) {
            fetchWeatherFor(countryToShow)
        }
        }, [selectedCountry, singleVisibleCountry])
    
    const handleFilter = (event) => {
        setSelectedCountry(null)
        setSearchValue(event.target.value)
    }

    if(countriesToShow.length > 10){
        console.log(countriesToShow.length)
        return(
            <div>
                Search: <input value={searchValue} onChange={handleFilter}/>
                <p>Too many matches, specify another filter</p>
            </div>
        )
    }else if(countriesToShow.length === 0){
        console.log(countriesToShow.length)
        return(
            <div>
               Search: <input value={searchValue} onChange={handleFilter}/>
               <p>No results found with that specified search, please try again</p> 
            </div>
        )
    }else if(countriesToShow.length === 1){
        return(
            <div>
                Search: <input value={searchValue} onChange={handleFilter}/>                
                <Country country={countriesToShow[0]} weather = {countryWeather}/>
            </div>
        )
    }
    else if(countriesToShow.length <= 10){
        console.log(countriesToShow.length)
        return(
            <div>
                Search: <input value={searchValue} onChange={handleFilter}/>
                {countriesToShow.map(country => 
                <li key={country.name.common}>
                {country.name.common} <button type="button" onClick={() => setSelectedCountry(country)}>Show</button>
                </li>
                )}
                {selectedCountry && <Country country={selectedCountry} weather = {countryWeather}/>}
            </div>
        )
    }
}

export default App
