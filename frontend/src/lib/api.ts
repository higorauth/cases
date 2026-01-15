import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
const DEFAULT_USER_ID = 'default-user-' + (typeof window !== 'undefined' ? window.location.hostname : 'server');

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const chatAPI = {
  sendMessage: async (
    conversationId: string,
    message: string,
    settings?: any
  ) => {
    const userId = DEFAULT_USER_ID;
    const response = await api.post(`/conversations/${conversationId}/message`, {
      userId,
      message,
      settings,
    });
    return response.data;
  },

  getConversations: async () => {
    const userId = DEFAULT_USER_ID;
    console.log('📥 GET /conversations/:userId com userId:', userId);
    try {
      const response = await api.get(`/conversations/${userId}`);
      console.log('✅ Conversas recebidas:', response.data);
      return response.data || [];
    } catch (error: any) {
      console.error('❌ Erro ao buscar conversas:', error.response?.data || error.message);
      return [];
    }
  },

  createConversation: async (title?: string) => {
    const userId = DEFAULT_USER_ID;
    console.log('📤 POST /conversations com userId:', userId);
    try {
      const response = await api.post('/conversations', {
        userId,
        title: title || 'Nova Conversa',
      });
      console.log('📥 Response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro na requisição:', error.response?.data || error.message);
      throw error;
    }
  },

  deleteConversation: async (id: string) => {
    await api.delete(`/conversations/${id}`);
  },
};

export const settingsAPI = {
  getSettings: async () => {
    const userId = DEFAULT_USER_ID;
    const response = await api.get(`/settings/${userId}`);
    return response.data;
  },

  updateSettings: async (settings: any) => {
    const userId = DEFAULT_USER_ID;
    const response = await api.put(`/settings/${userId}`, settings);
    return response.data;
  },
};
