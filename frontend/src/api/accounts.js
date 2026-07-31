import client from './client'

/**
 * Get all accounts
 */
export const getAccounts = async () => {
  try {
    const response = await client.get('/accounts')
    return response.data
  } catch (error) {
    throw error
  }
}

/**
 * Get a single account by ID
 */
export const getAccount = async (id) => {
  try {
    const response = await client.get(`/accounts/${id}`)
    return response.data
  } catch (error) {
    throw error
  }
}

/**
 * Create a new account
 */
export const createAccount = async (accountData) => {
  try {
    const response = await client.post('/accounts', accountData)
    return response.data
  } catch (error) {
    throw error
  }
}

/**
 * Update an existing account
 */
export const updateAccount = async (id, accountData) => {
  try {
    const response = await client.put(`/accounts/${id}`, accountData)
    return response.data
  } catch (error) {
    throw error
  }
}

/**
 * Delete an account
 */
export const deleteAccount = async (id) => {
  try {
    const response = await client.delete(`/accounts/${id}`)
    return response.data
  } catch (error) {
    throw error
  }
}
