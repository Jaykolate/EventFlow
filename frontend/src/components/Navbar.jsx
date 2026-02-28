import { useState, useContext, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FiBell, FiMenu, FiX, FiUser } from 'react-icons/fi';
import api from '../api/axios';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const [isOpen, setIsOpen] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const navigate = useNavigate();
    const ws = useRef(null);

    useEffect(() => {
        if (user) {
            fetchNotifications();

            // Setup WebSocket
            const wsUrl = `ws://localhost:8000/ws/notifications/?user_id=${user.id}`;
            ws.current = new WebSocket(wsUrl);

            ws.current.onmessage = (event) => {
                const newNotif = JSON.parse(event.data);
                setNotifications(prev => [
                    { ...newNotif, id: Date.now(), is_read: false, created_at: new Date().toISOString() },
                    ...prev
                ]);
                setUnreadCount(prev => prev + 1);
            };

            return () => {
                if (ws.current) ws.current.close();
            };
        }
    }, [user]);

    const fetchNotifications = async () => {
        try {
            const res = await api.get('/notifications/');
            setNotifications(res.data);
            setUnreadCount(res.data.filter(n => !n.is_read).length);
        } catch (error) {
            console.error('Failed to fetch notifications', error);
        }
    };

    const markAllRead = async () => {
        if (unreadCount === 0) return;
        try {
            await api.put('/notifications/read-all/');
            setNotifications(notifications.map(n => ({ ...n, is_read: true })));
            setUnreadCount(0);
        } catch (error) {
            console.error(error);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <Link to="/" className="text-xl font-semibold text-white tracking-tight">
                        EventFlow
                    </Link>

                    <div className="hidden md:flex items-center space-x-6">
                        <Link to="/events" className="text-[#a1a1a1] hover:text-white transition-colors text-sm font-medium">Events</Link>

                        {user ? (
                            <>
                                <Link to={user.role === 'organizer' ? '/organizer/dashboard' : '/participant/dashboard'} className="text-[#a1a1a1] hover:text-white transition-colors text-sm font-medium">
                                    Dashboard
                                </Link>

                                {/* Notifications Bell */}
                                <div className="relative">
                                    <button
                                        onClick={() => {
                                            setShowNotifications(!showNotifications);
                                            if (!showNotifications) markAllRead();
                                        }}
                                        className="p-2 text-[#a1a1a1] hover:text-white transition-colors relative"
                                    >
                                        <FiBell className="w-5 h-5" />
                                        {unreadCount > 0 && (
                                            <span className="absolute top-1 right-1 bg-white text-black text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                                                {unreadCount}
                                            </span>
                                        )}
                                    </button>

                                    {/* Notifications Dropdown */}
                                    {showNotifications && (
                                        <div className="absolute right-0 mt-2 w-80 bg-[#111111] border border-[#2e2e2e] rounded-xl shadow-2xl py-2 max-h-96 overflow-y-auto z-50">
                                            <div className="px-4 py-3 border-b border-[#2e2e2e] flex justify-between items-center">
                                                <span className="font-medium text-white text-sm">Notifications</span>
                                                <Link to="/notifications" className="text-xs text-[#a1a1a1] hover:text-white underline" onClick={() => setShowNotifications(false)}>View All</Link>
                                            </div>
                                            {notifications.length === 0 ? (
                                                <div className="p-4 text-center text-[#666] text-sm">No notifications</div>
                                            ) : (
                                                notifications.slice(0, 5).map((n) => (
                                                    <div key={n.id} className={`p-4 border-b border-[#2e2e2e] last:border-0 ${!n.is_read ? 'bg-[#161616]' : ''}`}>
                                                        <p className="text-sm text-[#a1a1a1]">{n.message}</p>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* User Dropdown proxy */}
                                <div className="flex items-center space-x-3 ml-4 bg-[#111111] px-3 py-1.5 rounded-full border border-[#2e2e2e]">
                                    <FiUser className="text-[#666]" />
                                    <span className="text-xs font-medium text-[#a1a1a1]">{user.name}</span>
                                    <button onClick={handleLogout} className="text-xs text-[#666] hover:text-white ml-2 transition-colors">Logout</button>
                                </div>
                            </>
                        ) : (
                            <div className="space-x-4">
                                <Link to="/login" className="btn-secondary">Login</Link>
                                <Link to="/register" className="btn-primary">Sign Up</Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center">
                        <button onClick={() => setIsOpen(!isOpen)} className="text-[#a1a1a1] hover:text-white">
                            {isOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden bg-[#111111] border-t border-[#2e2e2e] p-4 space-y-4">
                    <Link to="/events" className="block text-[#a1a1a1] hover:text-white text-sm">Events</Link>
                    {user ? (
                        <>
                            <Link to={user.role === 'organizer' ? '/organizer/dashboard' : '/participant/dashboard'} className="block text-[#a1a1a1] hover:text-white text-sm">
                                Dashboard
                            </Link>
                            <Link to="/notifications" className="block text-[#a1a1a1] hover:text-white text-sm">
                                Notifications
                            </Link>
                            <button onClick={handleLogout} className="block text-[#666] hover:text-white text-sm">Logout</button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="block text-[#a1a1a1] hover:text-white text-sm">Login</Link>
                            <Link to="/register" className="block text-white text-sm">Sign Up</Link>
                        </>
                    )}
                </div>
            )}
        </nav>
    );
};
export default Navbar;
