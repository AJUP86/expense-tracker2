const API_URL = import.meta.env.VITE_API_URL;

export async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem('token');

  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  });
  let data: any = null;
  const text = await res.text();

  if (text) {
    try {
      data = JSON.parse(text);
    } catch (err) {
      console.error('Failed to parse JSON', text);
      throw new Error('Invalid JSON response from server');
    }
  }

  if (!res.ok) {
    if (res.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
      throw new Error('Session expired');
    }
    throw new Error(data.message || 'API error');
  }

  return data;
}
