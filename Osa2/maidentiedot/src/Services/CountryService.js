const baseUrl = 'https://studies.cs.helsinki.fi/restcountries/api/all'

const getAll = () => {
  return fetch(baseUrl).then(response => {
    if (!response.ok) {
      throw new Error('Failed to fetch countries')
    }

    return response.json()
  })
}

export default {
  getAll
}