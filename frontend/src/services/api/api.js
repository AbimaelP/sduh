// frontend/src/services/appsheet/api.js
import api from './config';

export async function loginAPI(identify, password, authType) {
  try {
    const response = await api.post('/auth/login', { identify, password, authType });
    return response.data ; // { id, name, role }
  } catch (err) {
    const message = err.response?.data?.error || 'Autenticação falhou';
    throw new Error(message); //user: 'Cidadão', role: 'cidadao', main_role: 'cidadao'
  }
}

export async function loginGOV() {
  try {
    const response = await api.get('/auth/gov/login'); // GET porque não há payload
    return response.data.url;
  } catch (err) {
    const message = err.response?.data?.error || 'Autenticação falhou';
    throw new Error(message);
  }
}

export async function callbackMinhaArea() {
  try {
    const response = await api.get('/auth/minha-area/callback'); // GET porque não há payload
    return response.data.url;
  } catch (err) {
    const message = err.response?.data?.error || 'Autenticação falhou';
    throw new Error(message);
  }
}

export async function callbackGovBR(data) {
  try {
    const response = await api.post('/auth/gov/callback', data);
    return response.data; // { id, name, role }
  } catch (err) {
    const message = err.response?.data?.error || 'Autenticação falhou';
    throw new Error(message);
  }
}

export async function callbackCyberark(data) {
  try {
    const response = await api.post('/auth/cyberark/callback', data);
    return response.data; // { id, name, role }
  } catch (err) {
    const message = err.response?.data?.error || 'Autenticação falhou';
    throw new Error(message);
  }
}


export async function empreendimentos(statusObra = '', municipios = []) {
  try {
    const cacheKey = "empreendimentosData";
    const cacheTimestampKey = "empreendimentosTimestamp";

    // Pega dados do cache
    const cachedData = localStorage.getItem(cacheKey);
    const cachedTimestamp = localStorage.getItem(cacheTimestampKey);

    // Horário base do dia (08:00:00 local)
    const now = new Date();
    const today8h = new Date();
    today8h.setHours(8, 0, 0, 0);

    let isCacheValid = false;
    if (cachedData && cachedTimestamp) {
      const lastFetch = new Date(Number(cachedTimestamp));

      if (lastFetch >= today8h) {
        isCacheValid = true;
      }
    }

    if (isCacheValid) {
      return JSON.parse(cachedData);
    }

    let url = "/empreendimentos";
    // const params = [];

    // if (statusObra) {
    //   params.push(`statusObra=${encodeURIComponent(statusObra)}`);
    // }
    // if (municipios.length > 0) {
    //   params.push(`municipios=${municipios.join(",")}`);
    // }
    // if (params.length > 0) {
    //   url += `?${params.join("&")}`;
    // }

    const response = await api.get(url);

    localStorage.setItem(cacheKey, JSON.stringify(response.data));
    localStorage.setItem(cacheTimestampKey, Date.now().toString());
    console.log(response.data)
    return response.data;
  } catch (err) {
    console.log(err)
    if (err.response?.status === 401) {
      throw new Error("Token inválido");
    } else {
      const message = err.response?.data?.error || "Falhou";
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