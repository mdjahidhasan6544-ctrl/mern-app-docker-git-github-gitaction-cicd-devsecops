import { create } from 'zustand';
import axios from 'axios';
import { apiUrl } from '../lib/api';

const useAuthStore = create((set) => ({
    userInfo: JSON.parse(localStorage.getItem('userInfo')) || null,
    loading: false,
    error: null,

    login: async (email, password) => {
        try {
            set({ loading: true, error: null });
            const { data } = await axios.post(apiUrl('/api/auth/login'), { email, password });
            
            localStorage.setItem('userInfo', JSON.stringify(data));
            set({ userInfo: data, loading: false });
            return true;
        } catch (error) {
            set({ 
                error: error.response && error.response.data.message ? error.response.data.message : error.message,
                loading: false 
            });
            return false;
        }
    },

    register: async (name, email, password) => {
        try {
            set({ loading: true, error: null });
            const { data } = await axios.post(apiUrl('/api/auth/register'), { name, email, password });
            
            localStorage.setItem('userInfo', JSON.stringify(data));
            set({ userInfo: data, loading: false });
            return true;
        } catch (error) {
            set({ 
                error: error.response && error.response.data.message ? error.response.data.message : error.message,
                loading: false 
            });
            return false;
        }
    },

    logout: () => {
        localStorage.removeItem('userInfo');
        set({ userInfo: null });
    },
    
    clearError: () => set({ error: null })
}));

export default useAuthStore;
