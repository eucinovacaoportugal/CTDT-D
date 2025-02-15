import { useState } from "react";
import { motion } from "framer-motion";

const AuthModal = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isSignup, setIsSignup] = useState(false);
    const [formData, setFormData] = useState({ email: "", password: "" });

    const toggleAuthMode = () => setIsSignup(!isSignup);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert(`${isSignup ? "Signup" : "Login"} Submitted!`);
    };

    return (
        <div>
            <button className="auth-button" onClick={() => setIsOpen(true)}>
                Login / Signup
            </button>

            {isOpen && (
                <div className="modal-overlay" onClick={() => setIsOpen(false)}>
                    <motion.div
                        className="modal-content"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                    <h2>{isSignup ? "Create an Account" : "Login"}</h2>
                    <form onSubmit={handleSubmit}>
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                        <button type="submit" className="submit-button">
                            {isSignup ? "Sign Up" : "Login"}
                        </button>
                    </form>

                    <p className="toggle-text" onClick={toggleAuthMode}>
                        {isSignup ? "Already have an account? Login" : "No account? Sign up"}
                    </p>

                    <button className="close-button" onClick={() => setIsOpen(false)}>
                        Close
                    </button>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default AuthModal;
