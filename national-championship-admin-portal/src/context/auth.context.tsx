import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

interface User {
    id: string;
    email: string;
    name: string;
    role: string;
}

interface AuthContextType {
    isAuthenticated: boolean;
    user: User | null;
    loading: boolean;
    authChecked: boolean;
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => Promise<void>;
    refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [authChecked, setAuthChecked] = useState<boolean>(false);

    // Configure axios to include credentials (cookies) with requests
    useEffect(() => {
        axios.defaults.withCredentials = true;
    }, []);

    // Function to check authentication status - extracted so it can be reused
    const checkAuthStatus = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/v1/auth/profile');

            if (response.data && response.data.user) {
                setUser(response.data.user);
                setIsAuthenticated(true);
            } else {
                setIsAuthenticated(false);
                setUser(null);
            }
        } catch (error) {
            console.error('Auth check error:', error);
            setIsAuthenticated(false);
            setUser(null);
        } finally {
            setLoading(false);
            setAuthChecked(true);  // Đánh dấu đã kiểm tra auth
        }
    };


    // Check if user is authenticated on mount
    useEffect(() => {
        // Only check once at startup
        if (!authChecked) {
            checkAuthStatus();
        }
    }, [authChecked]);

    // Handle axios response interceptor for 401 errors
    useEffect(() => {
        const interceptor = axios.interceptors.response.use(
            response => response,
            async error => {
                // If we get a 401 Unauthorized error and we thought we were authenticated
                if (error.response && error.response.status === 401 && isAuthenticated) {
                    // Clear authentication state
                    setIsAuthenticated(false);
                    setUser(null);

                    // Optionally: Redirect to login page
                    // window.location.href = '/login';
                }
                return Promise.reject(error);
            }
        );

        // Clean up interceptor on unmount
        return () => {
            axios.interceptors.response.eject(interceptor);
        };
    }, [isAuthenticated]);

    const login = async (email: string, password: string): Promise<boolean> => {
        try {
            const response = await axios.post('/api/v1/auth/login', { email, password });

            if (response.data.user && response.data.user.role === "ADMIN") {
                // The cookie is set by the backend automatically
                setUser(response.data.user);
                setIsAuthenticated(true);
                return true;
            }

            return false;
        } catch (error) {
            console.error('Login error:', error);
            return false;
        }
    };

    const logout = async () => {
        try {
            // Call the logout endpoint to clear the cookie on the server
            await axios.post('/api/v1/auth/logout');
            setIsAuthenticated(false);
            setUser(null);
        } catch (error) {
            console.error('Logout error:', error);
            // Even if the server call fails, clear the local state
            setIsAuthenticated(false);
            setUser(null);
        }
    };

    // Expose a method to manually refresh auth status
    const refreshAuth = async () => {
        return await checkAuthStatus();
    };

    const value = {
        isAuthenticated,
        user,
        loading,
        authChecked,
        login,
        logout,
        refreshAuth,
    };

    // Convert refreshAuth to return void instead of boolean
    const refreshValue = {
        ...value,
        refreshAuth: async () => {
            await checkAuthStatus();
        }
    };
    return <AuthContext.Provider value={refreshValue}>{children}</AuthContext.Provider>;
};