export interface CountryItem {
  name: string
  code: string
  emoji: string
  unicode: string
  image: string
}

export type FlagCountriesApiResponse = CountryItem[]

export interface CountryAndCityItem {
  country: string
  cities: string[]
}

export type CountryAndCityApiResponse = CountryAndCityItem[]
