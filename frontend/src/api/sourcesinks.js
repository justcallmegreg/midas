import client from './client'

/**
 * Get all sources and sinks
 */
export const getSourcesSinks = async () => {
  try {
    const response = await client.get('/sources-sinks')
    return response.data
  } catch (error) {
    throw error
  }
}

/**
 * Get a single source/sink by ID
 */
export const getSourceSink = async (id) => {
  try {
    const response = await client.get(`/sources-sinks/${id}`)
    return response.data
  } catch (error) {
    throw error
  }
}

/**
 * Create a new source or sink
 */
export const createSourceSink = async (data) => {
  try {
    const response = await client.post('/sources-sinks', data)
    return response.data
  } catch (error) {
    throw error
  }
}

/**
 * Update an existing source or sink
 */
export const updateSourceSink = async (id, data) => {
  try {
    const response = await client.put(`/sources-sinks/${id}`, data)
    return response.data
  } catch (error) {
    throw error
  }
}

/**
 * Delete a source or sink
 */
export const deleteSourceSink = async (id) => {
  try {
    const response = await client.delete(`/sources-sinks/${id}`)
    return response.data
  } catch (error) {
    throw error
  }
}
