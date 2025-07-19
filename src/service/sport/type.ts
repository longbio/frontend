export type Sport = {
  idSport: string
  strSport: string
  strFormat: string
  strSportThumb: string
  strSportDescription: string
}

export interface SportApiResponse {
  sports?: Sport[]
}
