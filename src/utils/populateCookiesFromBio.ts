import { setCookie } from './cookie'
import type { GetUserByIdResponse } from '@/service/user/type'

/**
 * Populates cookies with bio data from API response
 * This allows edit forms to pre-populate with existing user data
 */
export function populateCookiesFromBio(bioData: GetUserByIdResponse['data']) {
  const data = bioData

  // Set name
  if (data.fullName) {
    setCookie('info_name', JSON.stringify(data.fullName))
  }

  // Set birthday - parse birthDate into day, month, year
  if (data.birthDate) {
    const birthDate = new Date(data.birthDate)
    const day = birthDate.getDate().toString().padStart(2, '0')
    const month = (birthDate.getMonth() + 1).toString().padStart(2, '0')
    const year = birthDate.getFullYear().toString()
    setCookie('info_birthday', JSON.stringify({ day, month, year }))
  }

  // Set gender
  if (data.gender) {
    // Map API gender values to form values
    const genderMap: Record<string, string> = {
      'Male': 'male',
      'Female': 'female',
      'Non-binary': 'non-binary',
      'مرد': 'male',
      'زن': 'female',
    }
    const gender = genderMap[data.gender] || data.gender.toLowerCase()
    setCookie('info_gender', JSON.stringify({ gender }))
  }

  // Set marital status
  if (data.maritalStatus) {
    setCookie('info_marital', JSON.stringify({ marital: data.maritalStatus }))
  }

  // Set physical (height, weight)
  if (data.height || data.weight) {
    const physical: Record<string, string> = {}
    if (data.height) {
      physical.height = `${data.height} cm`
    }
    if (data.weight) {
      physical.weight = `${data.weight} kg`
    }
    setCookie('info_physical', JSON.stringify(physical))
  }

  // Set born/live place
  if (data.bornPlace || data.livePlace) {
    setCookie('info_born', JSON.stringify({ 
      birthPlace: data.bornPlace || '', 
      livePlace: data.livePlace || '' 
    }))
  }

  // Set education
  if (data.educationalStatus) {
    setCookie('info_education', JSON.stringify({ education: data.educationalStatus }))
  }

  // Set pet info
  if (data.pet) {
    const hasPet = !!(data.pet.name || data.pet.breed)
    setCookie('info_pet', JSON.stringify({
      hasPet,
      petName: data.pet.name || '',
      petBreed: data.pet.breed || '',
    }))
  }

  // Set interests
  if (data.interests && data.interests.length > 0) {
    setCookie('info_interest', JSON.stringify({ selected: data.interests }))
  }

  // Set skills
  if (data.skills && data.skills.length > 0) {
    setCookie('info_skill', JSON.stringify({ selected: data.skills }))
  }

  // Set sports
  if (data.favoriteSport && data.favoriteSport.length > 0) {
    setCookie('info_sport', JSON.stringify({ selected: data.favoriteSport }))
  }

  // Set travel
  if (data.travelStyle || data.visitedCountries) {
    const travel: { styles?: string[]; country?: any[] } = {}
    if (data.travelStyle && data.travelStyle.length > 0) {
      travel.styles = data.travelStyle
    }
    if (data.visitedCountries && data.visitedCountries.length > 0) {
      // Store country names as objects with name property
      // The form will need to match these to full CountryItem objects when loading
      travel.country = data.visitedCountries.map((countryName) => ({ name: countryName }))
    }
    setCookie('info_travel', JSON.stringify(travel))
  }

  // Set more detail (details/about me)
  if (data.details) {
    setCookie('info_more_detail', JSON.stringify({ detail: data.details }))
  }

  // Set profile image
  if (data.profileImage) {
    setCookie('info_set_profile', JSON.stringify({ preview: data.profileImage }))
  }

  // Set job
  if (data.job) {
    setCookie('info_job', JSON.stringify({ 
      job: data.job.position || data.job.company ? 'employed' : 'not employed',
      positions: data.job.position ? [data.job.position] : [],
      companies: data.job.company ? [data.job.company] : [],
    }))
  }
}

