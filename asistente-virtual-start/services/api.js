// Servicio API para comunicarse con el backend
import React from 'react';

const API_BASE_URL = 'http://localhost:8080/api';

export class ApiService {
  // Método base para hacer requests
  static async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Agregar token de autenticación si existe
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, config);
      
      // Si es un 401, limpiar token y redirigir al login
      if (response.status === 401) {
        localStorage.removeItem('authToken');
        throw new Error('Sesión expirada. Por favor, inicia sesión nuevamente.');
      }

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Error en la petición');
      }
      
      return data;
    } catch (error) {
      console.error('Error en API:', error);
      
      // Manejo específico para errores de conexión
      if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
        throw new Error('No se pudo conectar con el servidor. Verifica que el backend esté funcionando.');
      }
      
      // Manejo específico para errores de red
      if (error.name === 'TypeError' || !error.message) {
        throw new Error('Servicio temporalmente no disponible. Intenta de nuevo más tarde.');
      }
      
      throw error;
    }
  }

  // 🔐 Autenticación
  static async register(userData) {
    const response = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    
    // Guardar token automáticamente al registrarse
    if (response.token) {
      localStorage.setItem('authToken', response.token);
    }
    
    return response;
  }

  static async login(credentials) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    // Guardar token en localStorage
    if (response.token) {
      localStorage.setItem('authToken', response.token);
    }
    
    return response;
  }

  static logout() {
    localStorage.removeItem('authToken');
  }

  static async verifyToken() {
    return this.request('/auth/verify');
  }

  static isAuthenticated() {
    return !!localStorage.getItem('authToken');
  }

  // 🛠️ Servicios
  static async getAvailableServices() {
    return this.request('/services/available');
  }

  static async hireService(serviceId, notes = null) {
    return this.request('/services/hire', {
      method: 'POST',
      body: JSON.stringify({ serviceId, notes }),
    });
  }

  static async getServiceDetails(serviceId) {
    return this.request(`/services/${serviceId}`);
  }

  // 👤 Cliente
  static async getClientProfile() {
    return this.request('/clients/profile');
  }

  static async getClientServices() {
    return this.request('/clients/services');
  }

  static async updateClientProfile(profileData) {
    return this.request('/clients/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  static async requestServiceUpdate(serviceId, updateData) {
    return this.request(`/clients/services/${serviceId}/request-update`, {
      method: 'POST',
      body: JSON.stringify(updateData),
    });
  }

  // 👑 Administración (solo para usuarios admin)
  static async getAdminClients(page = 1, limit = 10) {
    return this.request(`/admin/clients?page=${page}&limit=${limit}`);
  }

  static async getAdminServices(status = null, page = 1, limit = 10) {
    const statusParam = status ? `&status=${status}` : '';
    return this.request(`/admin/services?page=${page}&limit=${limit}${statusParam}`);
  }

  static async updateServiceStatus(serviceId, status, notes = null) {
    return this.request(`/admin/services/${serviceId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, notes }),
    });
  }

  static async getDashboardStats() {
    return this.request('/admin/dashboard/stats');
  }

  // 🔍 Utilidades
  static async checkServerHealth() {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      return response.ok;
    } catch {
      return false;
    }
  }
}

// Tipos de datos para TypeScript (si estás usando TS)
export const SERVICE_TYPES = {
  ASESORIA_INICIAL: 'Asesoría Inicial',
  OPTIMIZACION_CV: 'Optimización de CV',
  PREPARACION_ENTREVISTAS: 'Preparación para Entrevistas',
  BUSQUEDA_EMPLEO: 'Búsqueda Activa de Empleo',
  COACHING_COMPLETO: 'Coaching Profesional Completo'
};

export const SERVICE_STATUSES = {
  PENDIENTE: 'Pendiente',
  EN_PROGRESO: 'En Progreso',
  COMPLETADA: 'Completada',
  CANCELADA: 'Cancelada'
};

export const PAYMENT_STATUSES = {
  PENDIENTE: 'Pendiente',
  PAGADO: 'Pagado',
  REEMBOLSADO: 'Reembolsado'
};

// Hook personalizado para manejo de autenticación
export function useAuth() {
  const [user, setUser] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    const verifyAuth = async () => {
      try {
        if (!ApiService.isAuthenticated()) {
          setLoading(false);
          return;
        }

        const response = await ApiService.verifyToken();
        setUser(response.user);
        setError(null);
      } catch (error) {
        console.log('Token inválido:', error.message);
        ApiService.logout();
        setUser(null);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    verifyAuth();
  }, []);

  const login = async (credentials) => {
    try {
      setLoading(true);
      setError(null);
      const response = await ApiService.login(credentials);
      setUser(response.user);
      return response;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await ApiService.register(userData);
      setUser(response.user);
      return response;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    ApiService.logout();
    setUser(null);
    setError(null);
  };

  return { 
    user, 
    loading, 
    error, 
    login, 
    register, 
    logout,
    isAuthenticated: !!user 
  };
}

// Hook para cargar servicios
export function useServices() {
  const [services, setServices] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  const loadAvailableServices = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await ApiService.getAvailableServices();
      setServices(response.services);
    } catch (error) {
      setError(error.message);
      console.error('Error cargando servicios:', error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    loadAvailableServices();
  }, []);

  return { services, loading, error, refetch: loadAvailableServices };
}

// Hook para servicios del cliente
export function useClientServices() {
  const [clientServices, setClientServices] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  const loadClientServices = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await ApiService.getClientServices();
      setClientServices(response.services);
    } catch (error) {
      setError(error.message);
      console.error('Error cargando servicios del cliente:', error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (ApiService.isAuthenticated()) {
      loadClientServices();
    } else {
      setLoading(false);
    }
  }, []);

  return { 
    clientServices, 
    loading, 
    error, 
    refetch: loadClientServices 
  };
}
