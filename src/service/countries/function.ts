export async function fetchCountriesAndCities() {
  const response = await fetch('https://countriesnow.space/api/v0.1/countries')
  if (!response.ok) {
    throw new Error('Failed to fetch countries and cities')
  }
  return response.json()
}
