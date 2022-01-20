import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:8082/api/cards/';

class CardService {

  getAllCards() {
    return axios.get(API_URL + '', { headers: authHeader() });
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