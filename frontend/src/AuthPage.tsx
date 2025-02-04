import React, { useState } from 'react';
import { useAuth } from './AuthContext';

export const AuthPage: React.FC = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');

    const { login, register } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
    
        try {
            if (!email || !password) {
                setError('Please enter email and password');
                return;
            }

            if (!isLogin && !name) {
                setError('Name is required for registration');
                return;
            }

            if (password.length < 8) {
                setError('Password must be at least 8 characters long');
                return;
            }

            if (isLogin) {
                await login(email, password);
            } else {
                await register(email, password, name);
            }
        } catch (err: any) {
            console.error('Authentication error:', err);
            
            if (err instanceof Error) {
                setError(err.message || 'Authentication failed. Please try again.');
            } else {
                setError('An unexpected error occurred. Please try again.');
            }
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-box">
                <h2>{isLogin ? 'Login' : 'Register'}</h2>
                {error && (
                    <div 
                        className="error-message" 
                        style={{
                            color: 'red', 
                            marginBottom: '15px', 
                            padding: '10px', 
                            backgroundColor: '#ffeeee',
                            border: '1px solid red',
                            borderRadius: '5px'
                        }}
                    >
                        {error}
                    </div>
                )}
                
                <form onSubmit={handleSubmit}>
                    {!isLogin && (
                        <div className="form-group">
                            <label>Name:</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                minLength={2}
                            />
                        </div>
                    )}
                    
                    <div className="form-group">
                        <label>Email:</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                        />
                    </div>
                    
                    <div className="form-group">
                        <label>Password:</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength={8}
                        />
                    </div>
                    
                    <button type="submit">
                        {isLogin ? 'Login' : 'Register'}
                    </button>
                </form>
                
                <p className="toggle-auth">
                    {isLogin ? "Don't have an account? " : "Already have an account? "}
                    <button 
                        className="toggle-btn"
                        onClick={() => {
                            setIsLogin(!isLogin);
                            setError('');
                        }}
                    >
                        {isLogin ? 'Register' : 'Login'}
                    </button>
                </p>
            </div>
        </div>
    );
};