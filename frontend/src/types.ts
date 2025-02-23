export interface User {
    id: string;
    email: string;
    name: string;
}

export interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
}

export interface AuthResponse {
    success: boolean;
    message?: string;
}