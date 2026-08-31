const BASE_URL = 'http://localhost:5000';

/**
 * Helper function to handle API HTTP responses safely.
 * Checks res.ok and parses JSON errors.
 */
async function handleResponse(response) {
  let data;
  try {
    data = await response.json();
  } catch (err) {
    if (!response.ok) {
      throw new Error(`HTTP Error ${response.status}: ${response.statusText}`);
    }
    return null;
  }

  if (!response.ok) {
    const errorMessage = data?.error || data?.message || `Request failed with status ${response.status}`;
    const errorDetails = data?.details ? ` (${Object.values(data.details).join(', ')})` : '';
    throw new Error(`${errorMessage}${errorDetails}`);
  }

  return data;
}

/**
 * GET /tasks - Retrieve all tasks from MongoDB
 */
export async function getTasks() {
  try {
    const response = await fetch(`${BASE_URL}/tasks`);
    return await handleResponse(response);
  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Unable to connect to the backend server at http://localhost:5000. Please ensure Node Express backend is running.');
    }
    throw error;
  }
}

/**
 * GET /tasks/:id - Retrieve a single task by ID
 */
export async function getTaskById(id) {
  try {
    const response = await fetch(`${BASE_URL}/tasks/${id}`);
    return await handleResponse(response);
  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Unable to connect to the backend server at http://localhost:5000.');
    }
    throw error;
  }
}

/**
 * POST /tasks - Create a new task in MongoDB
 */
export async function createTask(taskData) {
  try {
    const response = await fetch(`${BASE_URL}/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(taskData),
    });
    return await handleResponse(response);
  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Unable to connect to the backend server at http://localhost:5000.');
    }
    throw error;
  }
}

/**
 * PUT /tasks/:id - Update an existing task in MongoDB
 */
export async function updateTask(id, taskData) {
  try {
    const response = await fetch(`${BASE_URL}/tasks/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(taskData),
    });
    return await handleResponse(response);
  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Unable to connect to the backend server at http://localhost:5000.');
    }
    throw error;
  }
}

/**
 * DELETE /tasks/:id - Delete a task by ID from MongoDB
 */
export async function deleteTask(id) {
  try {
    const response = await fetch(`${BASE_URL}/tasks/${id}`, {
      method: 'DELETE',
    });
    return await handleResponse(response);
  } catch (error) {
    if (error.name === 'TypeError' && error.name.includes('fetch')) {
      throw new Error('Unable to connect to the backend server at http://localhost:5000.');
    }
    throw error;
  }
}
