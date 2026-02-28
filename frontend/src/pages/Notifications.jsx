import { useState, useEffect } from 'react';
import api from '../api/axios';
import { FiBell, FiCheck } from 'react-icons/fi';
import toast from 'react-hot-toast';

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            const res = await api.get('/notifications/');
            setNotifications(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async (id) => {
        try {
            await api.put(`/notifications/${id}/read/`);
            setNotifications(notifications.map(n => n.id === id ? { ...n, is_read: true } : n));
        } catch (error) {
            console.error(error);
        }
    };

    const markAllRead = async () => {
        try {
            await api.put('/notifications/read-all/');
            setNotifications(notifications.map(n => ({ ...n, is_read: true })));
            toast.success('All notifications marked as read.');
        } catch (error) {
            console.error(error);
        }
    };

    if (loading) return <div className="text-center p-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div></div>;

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="flex justify-between items-center mb-8 pb-4 border-b border-[#2e2e2e]">
                <div>
                    <h1 className="text-2xl font-medium flex items-center text-white"><FiBell className="mr-3 text-[#a1a1a1]" /> Notifications</h1>
                    <p className="text-sm text-[#a1a1a1] mt-1">Stay updated with your events and teams.</p>
                </div>

                {notifications.some(n => !n.is_read) && (
                    <button onClick={markAllRead} className="btn-secondary text-xs flex items-center py-1.5 px-3">
                        <FiCheck className="mr-2" /> Mark all as read
                    </button>
                )}
            </div>

            <div className="card divide-y divide-[#2e2e2e]">
                {notifications.length === 0 ? (
                    <div className="p-10 text-center text-[#666]">
                        <FiBell className="w-10 h-10 mx-auto mb-4 opacity-50" />
                        <p className="text-sm">You have no notifications right now.</p>
                    </div>
                ) : (
                    notifications.map(notify => (
                        <div
                            key={notify.id}
                            className={`p-5 flex items-start gap-4 transition-colors ${!notify.is_read ? 'bg-[#161616]' : 'bg-[#111]'}`}
                        >
                            <div className="mt-0.5 p-1.5 rounded-full flex-shrink-0 bg-[#1a1a1a] text-[#a1a1a1] border border-[#2e2e2e]">
                                <FiBell className="w-3.5 h-3.5" />
                            </div>

                            <div className="flex-grow">
                                <p className={`text-sm ${!notify.is_read ? 'text-white font-medium' : 'text-[#a1a1a1]'}`}>
                                    {notify.message}
                                </p>
                                <p className="text-[11px] text-[#666] mt-1.5 uppercase tracking-wider">
                                    {new Date(notify.created_at).toLocaleString()}
                                </p>
                            </div>

                            {!notify.is_read && (
                                <button
                                    onClick={() => markAsRead(notify.id)}
                                    className="w-2.5 h-2.5 bg-white rounded-full flex-shrink-0 mt-1.5 hover:scale-125 transition-transform cursor-pointer"
                                    title="Mark as read"
                                />
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Notifications;
