import axios from 'axios';
import authHeader from './auth-header';
import API_CONFIG from '../config/api.config';

const API_URL = API_CONFIG.CARDS;

class CardService {

  getAllCards(ownerId) {
    const url = ownerId ? `${API_URL}?owner=${ownerId}` : API_URL;
    return axios.get(url, { headers: authHeader() });
  }

  getOneCard(id) {
    return axios.get(API_URL + `${id}`, { headers: authHeader() });
  }

  createCard(data) {
    return axios.post( API_URL + ``, data, { headers: authHeader() });
  }
  editCard(id, data) {
    return axios.put( API_URL + `${id}`, data, { headers: authHeader() });
  }

  deleteCard(name) {
    return axios.delete( API_URL + `${name}`, { headers: authHeader() });
  }

}

export default new CardService();