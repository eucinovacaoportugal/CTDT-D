import { useState } from "react";
import { motion } from "framer-motion";
import { AuthResponse } from "./types";
const AuthModal = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isSignup, setIsSignup] = useState(false);
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [loading, setLoading] = useState(false);

    const toggleAuthMode = () => setIsSignup(!isSignup);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const validateEmail = (email: string) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateEmail(formData.email)) {
            alert("Please enter a valid email address.");
            return;
        }
    
        setLoading(true);
        
        try {
            const response: AuthResponse = await fakeApiCall(formData); 
            if (response.success) {
                alert(`${isSignup ? "Signup" : "Login"} successful!`);
                setIsOpen(false); 
            } else {
                alert(response.message || "Authentication failed. Please try again.");
            }
        } catch (error) {
            console.error("Authentication error:", error);
            alert("An error occurred during authentication. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const fakeApiCall = async (data: { email: string; password: string }): Promise<AuthResponse> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                if (data.email === "test@example.com") {
                    resolve({ success: true });
                } else {
                    resolve({ success: false, message: "Invalid credentials." });
                }
            }, 1000);
        });
    };

    return (
        <div>
            <button 
                className="auth-button" 
                onClick={() => setIsOpen(true)} 
                aria-label="Open authentication modal"
            >
                <img src="/user.png" className="user" alt="User Icon" />
            </button>

            {isOpen && (
                <div className="modal-overlay" onClick={() => setIsOpen(false)} aria-hidden="true">
                    <motion.div
                        className="modal-content"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        onClick={(e) => e.stopPropagation()}
                        role="dialog"
                        aria-modal="true"
                    >

                    <button 
                        className="close-button" 
                        onClick={() => setIsOpen(false)} 
                        aria-label="Close modal"
                    >
                        ✕
                    </button>
                    
                    <h2>{isSignup ? "Create an Account" : "Login"}</h2>
                    
                    <form onSubmit={handleSubmit}>
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            aria-required="true"
                        />
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            aria-required="true"
                        />
                        <button 
                            type="submit" 
                            className="submit-button" 
                            disabled={loading}
                        >
                            {loading ? "Loading..." : (isSignup ? "Sign Up" : "Login")}
                        </button>
                    </form>

                    <p className="toggle-text" onClick={toggleAuthMode}>
                        {isSignup ? "Already have an account? Login" : "No account? Sign up"}
                    </p>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default AuthModal;