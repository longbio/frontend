export function setCookie(name: string, value: string, days = 30) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString()
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/`
}

export function getCookie(name: string): string | null {
  return (
    document.cookie
      .split('; ')
      .find((row) => row.startsWith(name + '='))
      ?.split('=')[1] || null
  )
}

export function removeCookie(name: string) {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
}

/**
 * Clears all application cookies (auth and info cookies)
 * This should be called after successful authentication to start fresh
 */
export function clearAllCookies() {
  // Auth cookies
  removeCookie('auth_signin')
  removeCookie('auth_signup')
  removeCookie('auth_username')

  // Info cookies
  removeCookie('info_name')
  removeCookie('info_gender')
  removeCookie('info_marital')
  removeCookie('info_birthday')
  removeCookie('info_country')
  removeCookie('info_born')
  removeCookie('info_physical')
  removeCookie('info_pet')
  removeCookie('info_interest')
  removeCookie('info_skill')
  removeCookie('info_sport')
  removeCookie('info_education')
  removeCookie('info_set_profile')
  removeCookie('info_job')
  removeCookie('info_travel')
  removeCookie('info_more_detail')
}
