import axios from 'axios';
import authHeader from './auth-header';
import API_CONFIG from '../config/api.config';

const API_URL = API_CONFIG.HISTORICS;

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