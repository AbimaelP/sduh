// frontend/src/services/appsheet/api.js
import api from './config';

export async function loginAPI(email, password) {
  try {
    const response = await api.post('/login', { email, password });
    return response.data; // { id, name, role }
  } catch (err) {
    // pega o erro retornado pelo backend
    const message = err.response?.data?.error || 'Login falhou';
    throw new Error(message);
  }
}

export async function empreendimentos(statusObra = '') {
  try {
    let url = '/empreendimentos';
    if (statusObra) {
      url += `?statusObra=${encodeURIComponent(statusObra)}`;
    }
    const response = await api.get(url);
    return response.data; 
  } catch (err) {
    if (err.response?.status === 401) {
      throw new Error('Token inválido');
    } else {
      const message = err.response?.data?.error || 'Falhou';
      throw new Error(message);
    }
  }
}

export async function ultimaAtualizacao(statusObra = '') {
  try {
    let url = '/empreendimentos/ultima-atualizacao';
    const response = await api.get(url);
    return response.data; 
  } catch (err) {
    if (err.response?.status === 401) {
      throw new Error('Token inválido');
    } else {
      const message = err.response?.data?.error || 'Falhou';
      throw new Error(message);
    }
  }
}