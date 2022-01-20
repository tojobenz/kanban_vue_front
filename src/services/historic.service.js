import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:8082/api/historics/';

class HistoricService {

  getAllHistorics() {
    return axios.get(API_URL + '', { headers: authHeader() });
  }

  getOneHistoric(id) {
    return axios.get(API_URL + `${id}`, { headers: authHeader() });
  }

  createHistoric(data) {
    return axios.post( API_URL + ``, data, { headers: authHeader() });
  }
  editHistoric(id, data) {
    return axios.put( API_URL + `${id}`, data, { headers: authHeader() });
  }

  deleteHistoric(id) {
    return axios.delete( API_URL + `${id}`, { headers: authHeader() });
  }

}

export default new HistoricService();