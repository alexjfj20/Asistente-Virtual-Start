# 🔗 Integración Frontend ↔️ Backend

## 📂 Estructura de tu Proyecto

```
version-04/
├── asistente-virtual-start/     ← Tu aplicación React (frontend)
└── backend-api/                 ← Tu nuevo backend (acabamos de crear)
```

## 🎯 Próximos Pasos para Integrar

### 1. 🚀 Mantener ambos servidores corriendo

**Terminal 1** (Backend):
```bash
cd backend-api
npm start
# Corriendo en: http://localhost:8080
```

**Terminal 2** (Frontend):
```bash
cd asistente-virtual-start
npm run dev
# Corriendo en: http://localhost:5173
```

### 2. 🔧 Crear Servicio API en tu Frontend

Crea el archivo `asistente-virtual-start/src/services/api.js`:

```javascript
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
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Error en la petición');
      }
      
      return data;
    } catch (error) {
      console.error('Error en API:', error);
      throw error;
    }
  }

  // 🔐 Autenticación
  static async register(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
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

  // 🛠️ Servicios
  static async getAvailableServices() {
    return this.request('/services/available');
  }

  static async hireService(serviceId, notes) {
    return this.request('/services/hire', {
      method: 'POST',
      body: JSON.stringify({ serviceId, notes }),
    });
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
}

// Hook de React para usar en componentes
export function useAuth() {
  const [user, setUser] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const verifyAuth = async () => {
      try {
        const response = await ApiService.verifyToken();
        setUser(response.user);
      } catch (error) {
        console.log('No autenticado');
        ApiService.logout();
      } finally {
        setLoading(false);
      }
    };

    verifyAuth();
  }, []);

  const login = async (credentials) => {
    const response = await ApiService.login(credentials);
    setUser(response.user);
    return response;
  };

  const logout = () => {
    ApiService.logout();
    setUser(null);
  };

  return { user, loading, login, logout };
}
```

### 3. 🔄 Actualizar tus Componentes

#### En `AuthModal.tsx`:

```tsx
import { ApiService } from '../services/api';

// En el handler de registro:
const handleRegister = async (formData) => {
  try {
    const response = await ApiService.register({
      email: formData.email,
      password: formData.password,
      fullName: formData.fullName,
      phone: formData.phone
    });
    
    console.log('Usuario registrado:', response.user);
    // Actualizar estado de la aplicación
    setCurrentUser(response.user);
    
  } catch (error) {
    console.error('Error en registro:', error.message);
    // Mostrar error al usuario
  }
};

// En el handler de login:
const handleLogin = async (formData) => {
  try {
    const response = await ApiService.login({
      email: formData.email,
      password: formData.password
    });
    
    console.log('Login exitoso:', response.user);
    setCurrentUser(response.user);
    
  } catch (error) {
    console.error('Error en login:', error.message);
  }
};
```

#### En `ClientDashboardSection.tsx`:

```tsx
import { ApiService } from '../services/api';

// Cargar servicios del cliente:
React.useEffect(() => {
  const loadClientServices = async () => {
    try {
      const response = await ApiService.getClientServices();
      setClientServices(response.services);
    } catch (error) {
      console.error('Error cargando servicios:', error);
    }
  };

  loadClientServices();
}, []);
```

#### En `ServicesSection.tsx`:

```tsx
import { ApiService } from '../services/api';

// Cargar servicios disponibles:
React.useEffect(() => {
  const loadServices = async () => {
    try {
      const response = await ApiService.getAvailableServices();
      setAvailableServices(response.services);
    } catch (error) {
      console.error('Error cargando servicios:', error);
    }
  };

  loadServices();
}, []);

// Contratar servicio:
const handleHireService = async (serviceId) => {
  try {
    const response = await ApiService.hireService(serviceId, 'Contratado desde la web');
    console.log('Servicio contratado:', response);
    // Actualizar estado o redirigir
  } catch (error) {
    console.error('Error contratando servicio:', error);
  }
};
```

### 4. 🧪 Probar la Integración

1. **Abrir navegador en ambas URLs:**
   - Frontend: http://localhost:5173
   - Backend: http://localhost:8080/api/health

2. **Probar flujo de registro/login en tu frontend**

3. **Verificar en Network Tab del navegador** que las peticiones van al backend

### 5. 🚀 ¡Funciones que ya tienes disponibles!

✅ **Registro de usuarios reales**
✅ **Login con JWT tokens**
✅ **Servicios dinámicos desde backend**
✅ **Dashboard de cliente con datos reales**
✅ **Gestión de estados de servicios**
✅ **Panel de administración**
✅ **Seguridad y validaciones**

## 🎯 Resultado Final

Tu aplicación ahora tendrá:

```
React Frontend (Puerto 5173)
        ↕️ HTTP Requests
Express Backend (Puerto 8080)
        ↕️ SQL Queries
PostgreSQL Database (Google Cloud)
```

## 💡 Tips Importantes

1. **Mantén ambos servidores corriendo** durante el desarrollo
2. **Revisa la consola del navegador** para ver errores de API
3. **Usa las herramientas de desarrollador** (Network tab) para debug
4. **El backend ya maneja CORS** para tu frontend
5. **Los tokens se guardan automáticamente** en localStorage

---

**🎉 ¡Tu aplicación ahora es una aplicación completa y profesional!**
