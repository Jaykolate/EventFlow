import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'participant'
    });
    const [loading, setLoading] = useState(false);
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const success = await register(formData);
        setLoading(false);
        if (success) {
            if (formData.role === 'organizer') navigate('/organizer/dashboard');
            else navigate('/events');
        }
    };

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] p-4">
            <div className="card w-full max-w-sm p-8">
                <h2 className="text-2xl font-semibold text-white text-center mb-6 tracking-tight">Create Account</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="input-label">Full Name</label>
                        <input
                            type="text" name="name"
                            className="input-field"
                            value={formData.name} onChange={handleChange} required
                        />
                    </div>
                    <div>
                        <label className="input-label">Email address</label>
                        <input
                            type="email" name="email"
                            className="input-field"
                            placeholder="you@example.com"
                            value={formData.email} onChange={handleChange} required
                        />
                    </div>
                    <div>
                        <label className="input-label">Password (Min 6 chars)</label>
                        <input
                            type="password" name="password" minLength={6}
                            className="input-field"
                            placeholder="••••••••"
                            value={formData.password} onChange={handleChange} required
                        />
                    </div>
                    <div>
                        <label className="input-label">I am an</label>
                        <div className="flex gap-3">
                            <label className={`flex items-center space-x-2 cursor-pointer bg-[#0a0a0a] p-3 rounded-lg flex-1 border transition-colors ${formData.role === 'participant' ? 'border-[#666]' : 'border-[#2e2e2e]'}`}>
                                <input
                                    type="radio" name="role" value="participant"
                                    checked={formData.role === 'participant'} onChange={handleChange}
                                    className="hidden"
                                />
                                <span className={`text-xs font-medium ${formData.role === 'participant' ? 'text-white' : 'text-[#666]'}`}>Participant</span>
                            </label>
                            <label className={`flex items-center space-x-2 cursor-pointer bg-[#0a0a0a] p-3 rounded-lg flex-1 border transition-colors ${formData.role === 'organizer' ? 'border-[#666]' : 'border-[#2e2e2e]'}`}>
                                <input
                                    type="radio" name="role" value="organizer"
                                    checked={formData.role === 'organizer'} onChange={handleChange}
                                    className="hidden"
                                />
                                <span className={`text-xs font-medium ${formData.role === 'organizer' ? 'text-white' : 'text-[#666]'}`}>Organizer</span>
                            </label>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full btn-primary flex justify-center py-2.5 mt-4"
                        disabled={loading}
                    >
                        {loading ? <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-black"></span> : 'Sign Up'}
                    </button>
                </form>
                <p className="mt-6 text-center text-[#666] text-xs">
                    Already have an account? <Link to="/login" className="text-white hover:underline ml-1">Sign in</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
