export interface Country {
  iso2: string
  iso3: string
  country: string
  cities: string[]
}

export interface CountriesApiResponse {
  error: boolean
  msg: string
  data: Country[]
}
