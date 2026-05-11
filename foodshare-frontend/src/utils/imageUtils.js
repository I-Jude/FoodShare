const BACKEND_URL = 'http://localhost:8080/api';

export const getImageUrl = (path) => {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  
  // Ensure path starts with a slash
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  
  // If path already contains /api/ (unlikely given backend logic)
  if (cleanPath.startsWith('/api/')) {
    return `${BACKEND_URL}${cleanPath}`;
  }
  
  // Static files are served from the root (configured in WebConfig)
  return `${BACKEND_URL}${cleanPath}`.replace(/\\/g, '/');
};
