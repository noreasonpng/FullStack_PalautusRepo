const apiKey = import.meta.env.VITE_WEATHER_API_KEY
const baseUrl = 'https://api.openweathermap.org/data/2.5/weather'

const getByCity = (city) => {
  const url = `${baseUrl}?q=${encodeURIComponent(city)}&units=metric&appid=${apiKey}`
  return fetch(url).then(response => {
    if (!response.ok) {
      throw new Error(`Weather fetch failed (${response.status})`)
    }

    return response.json()
  })
}

export default {
  getByCity
}