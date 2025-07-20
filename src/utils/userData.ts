import { getCookie } from './cookie'

export interface UserData {
  name: string
  gender: string
  marital: string
  birthday: {
    day: string
    month: string
    year: string
  }
  country: {
    birthCountry: string
    birthCity: string
  }
  physical: {
    height: string
    weight: string
  }
  pet: {
    hasPet: boolean
    petName: string
    petBreed: string
    petImage?: string
  }
  interests: string[]
  skills: string[]
  sports: string[]
  education: string
  profileImage?: string
  topImage?: string
}

export function getUserDataFromCookies(): UserData {
  const defaultData: UserData = {
    name: 'Fari Zadeh',
    gender: 'Woman',
    marital: 'Married',
    birthday: {
      day: '04',
      month: '02',
      year: '1997',
    },
    country: {
      birthCountry: 'Iran',
      birthCity: 'Tehran',
    },
    physical: {
      height: '159 cm',
      weight: '58 kg',
    },
    pet: {
      hasPet: true,
      petName: 'Blacky',
      petBreed: 'Scottish fold',
    },
    interests: ['☕ Coffee', '🌸 Flowers & Gardening', '🧘‍♀️ Meditation', '📚 Books', '🥾 Hiking'],
    skills: ['Swimming', 'Painting', 'Mathematics'],
    sports: ['Hiking', 'Gym', 'Tennis'],
    education: "Bachelor's degree in graphics",
  }

  try {
    // Get name from auth_signup cookie
    const authSignupCookie = getCookie('auth_signup')
    if (authSignupCookie) {
      try {
        const authData = JSON.parse(decodeURIComponent(authSignupCookie))
        if (authData.name) {
          defaultData.name = authData.name
        }
      } catch {}
    }

    // Get name from info_name cookie as fallback
    const nameCookie = getCookie('info_name')
    if (nameCookie && !defaultData.name) {
      defaultData.name = JSON.parse(decodeURIComponent(nameCookie))
    }

    // Get gender
    const genderCookie = getCookie('info_gender')
    if (genderCookie) {
      const genderData = JSON.parse(decodeURIComponent(genderCookie))
      defaultData.gender =
        genderData.gender === 'male'
          ? 'Man'
          : genderData.gender === 'female'
          ? 'Woman'
          : 'Nonbinary'
    }

    // Get marital status
    const maritalCookie = getCookie('info_marital')
    if (maritalCookie) {
      const maritalData = JSON.parse(decodeURIComponent(maritalCookie))
      defaultData.marital = maritalData.marital
    }

    // Get birthday
    const birthdayCookie = getCookie('info_birthday')
    if (birthdayCookie) {
      const birthdayData = JSON.parse(decodeURIComponent(birthdayCookie))
      if (!birthdayData.day.startsWith('Exp:')) {
        defaultData.birthday = {
          day: birthdayData.day,
          month: birthdayData.month,
          year: birthdayData.year,
        }
      }
    }

    // Get country info
    const countryCookie = getCookie('info_country')
    if (countryCookie) {
      const countryData = JSON.parse(decodeURIComponent(countryCookie))
      defaultData.country = {
        birthCountry: countryData.birthPlace || defaultData.country.birthCountry,
        birthCity: countryData.livePlace || defaultData.country.birthCity,
      }
    }

    // Get physical info
    const physicalCookie = getCookie('info_physical')
    if (physicalCookie) {
      const physicalData = JSON.parse(decodeURIComponent(physicalCookie))
      if (!physicalData.height.startsWith('Exp:')) {
        defaultData.physical = {
          height: physicalData.height,
          weight: physicalData.weight,
        }
      }
    }

    // Get pet info
    const petCookie = getCookie('info_pet')
    if (petCookie) {
      const petData = JSON.parse(decodeURIComponent(petCookie))
      defaultData.pet = {
        hasPet: petData.hasPet,
        petName: petData.petName || defaultData.pet.petName,
        petBreed: petData.petBreed || defaultData.pet.petBreed,
        petImage: petData.petImage || undefined,
      }
    }

    // Get interests
    const interestCookie = getCookie('info_interest')
    if (interestCookie) {
      const interestData = JSON.parse(decodeURIComponent(interestCookie))
      if (interestData.selected && interestData.selected.length > 0) {
        defaultData.interests = interestData.selected
      }
    }

    // Get skills
    const skillCookie = getCookie('info_skill')
    if (skillCookie) {
      const skillData = JSON.parse(decodeURIComponent(skillCookie))
      if (skillData.selected && skillData.selected.length > 0) {
        defaultData.skills = skillData.selected
      }
    }

    // Get sports
    const sportCookie = getCookie('info_sport')
    if (sportCookie) {
      const sportData = JSON.parse(decodeURIComponent(sportCookie))
      if (sportData.selected && sportData.selected.length > 0) {
        defaultData.sports = sportData.selected
      }
    }

    // Get education
    const educationCookie = getCookie('info_education')
    if (educationCookie) {
      const educationData = JSON.parse(decodeURIComponent(educationCookie))
      defaultData.education = educationData.education || defaultData.education
    }

    // Get profile image
    const profileCookie = getCookie('info_set_profile')
    if (profileCookie) {
      const profileData = JSON.parse(decodeURIComponent(profileCookie))
      if (profileData.preview) {
        defaultData.profileImage = profileData.preview
      }
    }
  } catch (error) {
    console.error('Error parsing cookie data:', error)
  }

  return defaultData
}

export function calculateAge(birthday: { day: string; month: string; year: string }): number {
  const birthDate = new Date(
    parseInt(birthday.year),
    parseInt(birthday.month) - 1,
    parseInt(birthday.day)
  )
  const today = new Date()
  let age = today.getFullYear() - birthDate.getFullYear()
  const monthDiff = today.getMonth() - birthDate.getMonth()

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }

  return age
}
