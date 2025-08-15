import type { FlagCountriesApiResponse, CountryItem, CountryAndCityApiResponse } from './types'

function codeToEmoji(code: string) {
  return code
    .toUpperCase()
    .split('')
    .map((char) => String.fromCodePoint(char.charCodeAt(0) + 127397))
    .join('')
}

export async function fetchCountriesAndFlags(): Promise<FlagCountriesApiResponse> {
  const response = await fetch(
    'https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/index.json'
  )
  if (!response.ok) {
    throw new Error('Failed to fetch countries')
  }

  const data: CountryItem[] = await response.json()

  return data.map((item) => ({
    ...item,
    emoji: item.emoji || codeToEmoji(item.code),
  }))
}

// NOTE: City & Countries
export async function fetchCountriesAndCities(): Promise<CountryAndCityApiResponse> {
  const response = await fetch('https://countriesnow.space/api/v0.1/countries')
  if (!response.ok) {
    throw new Error('Failed to fetch countries')
  }
  const json = await response.json()

  return json.data
}
