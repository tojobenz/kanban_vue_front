import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:8082/api/kanban/';

class KanbanService {
  getAllKanbans() {
    return axios.get(API_URL + 'user/kanbans', { headers: authHeader() });
  }

  getOwnedKanbans() {
    return axios.get(API_URL + 'user/owned', { headers: authHeader() });
  }

  getSharedKanbans() {
    return axios.get(API_URL + 'user/shared', { headers: authHeader() });
  }

  getKanbanById(id) {
    return axios.get(API_URL + `${id}`, { headers: authHeader() });
  }

  createKanban(data) {
    return axios.post(API_URL + '', data, { headers: authHeader() });
  }

  updateKanban(id, data) {
    return axios.put(API_URL + `${id}`, data, { headers: authHeader() });
  }

  deleteKanban(id) {
    return axios.delete(API_URL + `${id}`, { headers: authHeader() });
  }

  addCollaborator(kanbanId, userId) {
    return axios.post(API_URL + `${kanbanId}/collaborators`, { userId }, { headers: authHeader() });
  }

  removeCollaborator(kanbanId, userId) {
    return axios.delete(API_URL + `${kanbanId}/collaborators/${userId}`, { headers: authHeader() });
  }

  getCollaborators(kanbanId) {
    return axios.get(API_URL + `${kanbanId}/collaborators`, { headers: authHeader() });
  }

  searchUsers(query) {
    return axios.get(API_URL + `users/search?q=${query}`, { headers: authHeader() });
  }
}

export default new KanbanService();
