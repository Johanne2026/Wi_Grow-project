// utils/authHeaders.js (or in a separate utility file)
export function getAuthHeaders() {
  const token = localStorage.getItem('authToken');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
}