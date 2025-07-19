import { sportsList } from './sportsList'
import { SportApiResponse, Sport } from './type'

export async function fetchSports(): Promise<SportApiResponse> {
  const sports: Sport[] = sportsList.map((name) => ({
    idSport: name.toLowerCase().replace(/\s+/g, '_'),
    strSport: name,
    strFormat: 'TeamvsTeam',
    strSportThumb: '',
    strSportDescription: '',
  }))

  return { sports }
}
