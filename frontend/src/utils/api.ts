/**
 * OnboardIQ AI API Client Configuration & Fetch Utility
 * Dynamically resolves the API server location using environment variables or deployment context.
 */

export const API_URL = process.env.NEXT_PUBLIC_API_URL || 
  (typeof window !== 'undefined' 
    ? (window.location.hostname.includes('localhost') ? 'http://localhost:5050' : `${window.location.origin}/_/backend`)
    : 'http://localhost:5050');

/**
 * Returns security and credential headers including JWT token authentication.
 */
export const getHeaders = () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('onboardiq_token') : null;
  return {
    'Content-Type': 'application/json',
    ...(token && !token.startsWith('mock_') ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

/**
 * Robust fetch utility supporting automatic headers configuration and response parsing.
 */
export const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_URL}${endpoint}`;
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...getHeaders(),
        ...(options.headers || {})
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Request failed with status ${response.status}`);
    }

    return await response.json();
  } catch (error: any) {
    console.warn(`[API Client Warning] Failed fetching endpoint "${endpoint}":`, error.message);
    throw error;
  }
};
