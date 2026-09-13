import axios from 'axios';
import authHeader from './auth-header';
import API_CONFIG from '../config/api.config';

const API_URL = API_CONFIG.TASKS;

class TaskService {

  getAllTasks() {
    return axios.get(API_URL + '', { headers: authHeader() });
  }

  getOneTask(id) {
    return axios.get(API_URL + `${id}`, { headers: authHeader() });
  }

  createTask(data) {
    return axios.post( API_URL + ``, data, { headers: authHeader() });
  }
  editTask(id, data) {
    return axios.put( API_URL + `${id}`, data, { headers: authHeader() });
  }
  editTaskCard(card, data) {
    return axios.put( API_URL + `/update-card/${card}`, data, { headers: authHeader() });
  }

  deleteTask(id) {
    return axios.delete( API_URL + `${id}`, { headers: authHeader() });
  }
 
}

export default new TaskService();