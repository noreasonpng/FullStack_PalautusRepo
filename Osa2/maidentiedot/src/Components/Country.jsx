const Country = ({ country, weather }) => {
    const capital = Array.isArray(country.capital) ? country.capital[0] : country.capital

    return (
        <div>
            <h1>{country.name.common}</h1>
            <p>{capital}</p>
            <p>Area {country.area}</p>
            <h1>Languages</h1>
            <ul>
                {country.languages && Object.values(country.languages).map(language =>
                    <li key={language}>{language}</li>
                )}
            </ul>
            <img src={country.flags.png} alt={country.name.common} />
            <h1>Weather in {capital}</h1>
            {weather ? (
                <div>
                    <p>Temperature: {weather.main?.temp} °C</p>
                    
                    {weather.weather && weather.weather[0]?.icon && (
                        <img
                            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                            alt={weather.weather[0].description}
                        />
                    )}
                    <p>Wind: {weather.wind.speed} m/s</p>
                </div>
            ) : (
                <p>No weather data available.</p>
            )}
        </div>
    )
}

export default Country