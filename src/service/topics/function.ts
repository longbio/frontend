import { topicsData } from './data'
import type { Topic, TopicsResponse } from './types'

export async function fetchTopics(): Promise<Topic[]> {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300))
    return topicsData
  } catch (error) {
    console.error('Error fetching topics:', error)
    throw new Error('Failed to fetch topics')
  }
}

export async function fetchUniversitiesByTopic(topicId: string): Promise<Topic | null> {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200))
    const topic = topicsData.find(t => t.id === topicId)
    return topic || null
  } catch (error) {
    console.error('Error fetching universities by topic:', error)
    throw new Error('Failed to fetch universities by topic')
  }
}
