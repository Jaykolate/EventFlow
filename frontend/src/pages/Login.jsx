import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const success = await login(email, password);
        setLoading(false);
        if (success) {
            navigate('/events');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] p-4">
            <div className="card w-full max-w-sm p-8">
                <h2 className="text-2xl font-semibold text-white text-center mb-6 tracking-tight">Welcome Back</h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="input-label">Email address</label>
                        <input
                            type="email"
                            className="input-field"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="input-label">Password</label>
                        <input
                            type="password"
                            className="input-field"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full btn-primary flex justify-center py-2.5 mt-2"
                        disabled={loading}
                    >
                        {loading ? <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-black"></span> : 'Sign In'}
                    </button>
                </form>
                <p className="mt-6 text-center text-[#666] text-xs">
                    Don't have an account? <Link to="/register" className="text-white hover:underline ml-1">Sign up</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
