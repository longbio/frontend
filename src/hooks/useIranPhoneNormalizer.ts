import { useCallback } from 'react'

/**
 * Hook to normalize Iranian phone numbers.
 * When the dial code is +98 (Iran) and the phone number starts with 0
 * followed by 9 and 9 more digits (pattern: 09xxxxxxxxx), removes the leading "0".
 * 
 * This is because Iranian phone numbers in international format should not have
 * the leading 0: +989123456789 instead of +9809123456789
 */
export function useIranPhoneNormalizer() {
  const normalizeIranPhone = useCallback(
    (dialCode: string, phoneNumber: string): string => {
      // Check if dial code is Iran (+98)
      if (dialCode !== '+98') {
        return phoneNumber
      }

      // Check if phone number matches pattern: starts with 0, followed by 9, then 9 more digits
      // Pattern: 09\d{9} (total 11 digits starting with 09)
      const iranPhonePattern = /^09\d{9}$/

      if (iranPhonePattern.test(phoneNumber)) {
        // Remove the first "0"
        return phoneNumber.slice(1)
      }

      return phoneNumber
    },
    []
  )

  return { normalizeIranPhone }
}

