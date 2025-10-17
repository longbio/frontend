// Google Analytics configuration and utility functions

export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID || ''

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageview = (url: string) => {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('config', GA_TRACKING_ID, {
      page_path: url,
    })
  }
}

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export const event = ({
  action,
  category,
  label,
  value,
}: {
  action: string
  category: string
  label?: string
  value?: number
}) => {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    const config: Record<string, string | number | boolean> = {
      event_category: category,
    }

    if (label !== undefined) {
      config.event_label = label
    }

    if (value !== undefined) {
      config.value = value
    }

    window.gtag('event', action, config)
  }
}

// Custom events for bio page
export const trackBioEvent = (
  eventName: string,
  parameters?: Record<string, string | number | boolean>
) => {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', eventName, {
      event_category: 'bio',
      ...parameters,
    })
  }
}

// Track profile interactions
export const trackProfileInteraction = (action: string, section?: string) => {
  const parameters: Record<string, string | number | boolean> = {
    action,
  }

  if (section !== undefined) {
    parameters.section = section
  }

  trackBioEvent('profile_interaction', parameters)
}

// Track share actions
export const trackShareAction = (method: 'link' | 'screenshot') => {
  trackBioEvent('share_bio', {
    method,
  })
}

// Track edit actions
export const trackEditAction = (section: string) => {
  trackBioEvent('edit_section', {
    section,
  })
}

// Track premium signup
export const trackPremiumSignup = (method: 'email' | 'phone') => {
  trackBioEvent('premium_signup', {
    method,
  })
}

// Declare gtag function for TypeScript
declare global {
  interface Window {
    gtag: (
      command: 'config' | 'event' | 'js',
      targetId: string | Date,
      config?: Record<string, string | number | boolean>
    ) => void
  }
}
