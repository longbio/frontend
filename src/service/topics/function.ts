import { topicsData, totalUniversitiesData } from './data'
import type { Topic, University } from './types'

export async function fetchTopics(): Promise<Topic[]> {
  try {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300))
    return topicsData
  } catch (error) {
    console.error('Error fetching topics:', error)
    throw new Error('Failed to fetch topics')
  }
}

export async function fetchUniversitiesByTopic(topicId: string): Promise<University[]> {
  try {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 200))
    // All topics have access to all universities (no relations needed)
    return totalUniversitiesData
  } catch (error) {
    console.error('Error fetching universities by topic:', error)
    throw new Error('Failed to fetch universities by topic')
  }
}

export async function fetchAllUniversities(): Promise<University[]> {
  try {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 200))
    return totalUniversitiesData
  } catch (error) {
    console.error('Error fetching all universities:', error)
    throw new Error('Failed to fetch all universities')
  }
}
