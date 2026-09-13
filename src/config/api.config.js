const API_BASE_URL = process.env.VUE_APP_API_URL || 
  (process.env.NODE_ENV === 'production' 
    ? 'https://kanban-node-mongo.vercel.app' 
    : 'http://localhost:8082');

export default {
  AUTH: `${API_BASE_URL}/api/auth/`,
  CARDS: `${API_BASE_URL}/api/cards/`,
  HISTORICS: `${API_BASE_URL}/api/historics/`,
  KANBAN: `${API_BASE_URL}/api/kanban/`,
  TASKS: `${API_BASE_URL}/api/taches/`,
  USER: `${API_BASE_URL}/api/user/`,
  TEST: `${API_BASE_URL}/api/test/`
};
