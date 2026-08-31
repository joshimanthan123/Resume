const BASE_URL = 'http://localhost:5000';

// Token & User LocalStorage helpers
export const getToken = () => localStorage.getItem('auth_token');
export const setToken = (token) => localStorage.setItem('auth_token', token);
export const removeToken = () => localStorage.removeItem('auth_token');

export const getStoredUser = () => {
  const user = localStorage.getItem('auth_user');
  try {
    return user ? JSON.parse(user) : null;
  } catch (e) {
    return null;
  }
};
export const setStoredUser = (user) => localStorage.setItem('auth_user', JSON.stringify(user));
export const removeStoredUser = () => localStorage.removeItem('auth_user');

export const logout = () => {
  removeToken();
  removeStoredUser();
};

/**
 * Helper function to handle API HTTP responses safely.
 * Checks res.ok and parses JSON errors. Intercepts 401 Unauthorized to clear token.
 */
async function handleResponse(response) {
  let data;
  try {
    data = await response.json();
  } catch (err) {
    if (!response.ok) {
      if (response.status === 401) {
        logout();
        throw new Error('Session expired or unauthorized. Please login again.');
      }
      throw new Error(`HTTP Error ${response.status}: ${response.statusText}`);
    }
    return null;
  }

  if (!response.ok) {
    if (response.status === 401) {
      logout();
      const errorMsg = data?.error || 'Session expired or unauthorized. Please login again.';
      throw new Error(errorMsg);
    }
    const errorMessage = data?.error || data?.message || `Request failed with status ${response.status}`;
    const errorDetails = data?.details ? ` (${Object.values(data.details).join(', ')})` : '';
    throw new Error(`${errorMessage}${errorDetails}`);
  }

  return data;
}

/**
 * Helper to build auth headers
 */
function getAuthHeaders() {
  const headers = {
    'Content-Type': 'application/json',
  };
  const token = getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

// ================= AUTH API ENDPOINTS =================

/**
 * POST /register - Register a new user
 */
export async function register(email, password) {
  try {
    const response = await fetch(`${BASE_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
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
 * POST /login - Authenticate user & receive JWT token
 */
export async function login(email, password) {
  try {
    const response = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await handleResponse(response);
    if (data?.token) {
      setToken(data.token);
      if (data.user) {
        setStoredUser(data.user);
      }
    }
    return data;
  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Unable to connect to the backend server at http://localhost:5000.');
    }
    throw error;
  }
}

/**
 * GET /me - Retrieve current authenticated user details
 */
export async function getMe() {
  try {
    const response = await fetch(`${BASE_URL}/me`, {
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Unable to connect to backend server at http://localhost:5000.');
    }
    throw error;
  }
}

// ================= PROTECTED TASK API ENDPOINTS =================

/**
 * GET /tasks - Retrieve all tasks owned by current user from MongoDB
 */
export async function getTasks() {
  try {
    const response = await fetch(`${BASE_URL}/tasks`, {
      headers: getAuthHeaders(),
    });
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
    const response = await fetch(`${BASE_URL}/tasks/${id}`, {
      headers: getAuthHeaders(),
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
 * POST /tasks - Create a new task in MongoDB
 */
export async function createTask(taskData) {
  try {
    const response = await fetch(`${BASE_URL}/tasks`, {
      method: 'POST',
      headers: getAuthHeaders(),
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
      headers: getAuthHeaders(),
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
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Unable to connect to the backend server at http://localhost:5000.');
    }
    throw error;
  }
}
