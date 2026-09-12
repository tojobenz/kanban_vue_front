import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:8082/api/user/';

class CollaboratorService {

  getCollaborators() {
    return axios.get(API_URL + 'collaborators', { headers: authHeader() });
  }

  addCollaborator(email) {
    return axios.post(API_URL + 'collaborators', { email }, { headers: authHeader() });
  }

  getInviters() {
    return axios.get(API_URL + 'inviters', { headers: authHeader() });
  }

  removeCollaborator(collaboratorId) {
    return axios.delete(API_URL + `collaborators/${collaboratorId}`, { headers: authHeader() });
  }
}

export default new CollaboratorService();
