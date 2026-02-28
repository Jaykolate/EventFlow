import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import { AuthContext } from '../../context/AuthContext';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { FiPlus, FiUsers, FiCalendar, FiActivity, FiEdit, FiTrash2, FiSend } from 'react-icons/fi';
import toast from 'react-hot-toast';

const OrganizerDashboard = () => {
    const { user } = useContext(AuthContext);
    const [events, setEvents] = useState([]);
    const [stats, setStats] = useState({
        totalEvents: 0, activeEvents: 0, totalRegistrations: 0, totalParticipants: 0
    });
    const [chartData, setChartData] = useState([]);
    const [loading, setLoading] = useState(true);

    const [showNotifyModal, setShowNotifyModal] = useState(false);
    const [notifyEventId, setNotifyEventId] = useState(null);
    const [notifyMessage, setNotifyMessage] = useState('');
    const [notifyType, setNotifyType] = useState('info');

    useEffect(() => {
        fetchOrganizerData();
    }, []);

    const fetchOrganizerData = async () => {
        try {
            const res = await api.get('/events/my-events/');
            const myEvents = res.data;
            setEvents(myEvents);

            let totReg = 0;
            let cData = [];

            const topEvents = myEvents.slice(0, 5);
            for (const ev of topEvents) {
                try {
                    const pRes = await api.get(`/registrations/event/${ev.id}/`);
                    const count = pRes.data.length;
                    totReg += count;
                    cData.push({ name: ev.title.substring(0, 10) + '...', registrations: count });
                } catch (e) { }
            }

            setStats({
                totalEvents: myEvents.length,
                activeEvents: myEvents.filter(e => e.status !== 'completed').length,
                totalRegistrations: totReg,
                totalParticipants: totReg
            });
            setChartData(cData);

        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this event?')) {
            try {
                await api.delete(`/events/${id}/`);
                toast.success('Event deleted');
                setEvents(events.filter(e => e.id !== id));
            } catch (e) {
                toast.error('Failed to delete event');
            }
        }
    };

    const handleSendNotification = async (e) => {
        e.preventDefault();
        try {
            await api.post('/notifications/send/', {
                event_id: notifyEventId,
                message: notifyMessage,
                type: notifyType
            });
            toast.success('Notification sent to all participants');
            setShowNotifyModal(false);
            setNotifyMessage('');
        } catch (error) {
            toast.error('Failed to send notification');
        }
    };

    if (loading) return <div className="text-center p-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div></div>;

    return (
        <div className="page-container">
            <div className="flex justify-between items-center mb-10 pb-4 border-b border-[#2e2e2e]">
                <div>
                    <h1 className="text-2xl font-medium text-white tracking-tight">Organizer Dashboard</h1>
                    <p className="text-sm text-[#a1a1a1] mt-1">Manage your events, view analytics, and notify participants.</p>
                </div>
                <Link to="/organizer/create-event" className="btn-primary text-sm">
                    <FiPlus className="mr-2" /> Create Event
                </Link>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="stat-card">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-[#a1a1a1] mb-1 font-medium uppercase tracking-wider">Total Events</p>
                            <h3 className="text-3xl font-semibold text-white tracking-tight">{stats.totalEvents}</h3>
                        </div>
                        <div className="w-10 h-10 rounded-full border border-[#2e2e2e] bg-[#0a0a0a] flex items-center justify-center text-[#666]"><FiCalendar className="w-4 h-4" /></div>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-[#a1a1a1] mb-1 font-medium uppercase tracking-wider">Active Events</p>
                            <h3 className="text-3xl font-semibold text-white tracking-tight">{stats.activeEvents}</h3>
                        </div>
                        <div className="w-10 h-10 rounded-full border border-[#2e2e2e] bg-[#0a0a0a] flex items-center justify-center text-[#666]"><FiActivity className="w-4 h-4" /></div>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-[#a1a1a1] mb-1 font-medium uppercase tracking-wider">Registrations</p>
                            <h3 className="text-3xl font-semibold text-white tracking-tight">{stats.totalRegistrations}</h3>
                        </div>
                        <div className="w-10 h-10 rounded-full border border-[#2e2e2e] bg-[#0a0a0a] flex items-center justify-center text-[#666]"><FiUsers className="w-4 h-4" /></div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Chart */}
                <div className="lg:col-span-2 card p-6">
                    <h2 className="text-[15px] font-medium mb-6 text-white border-b border-[#2e2e2e] pb-3">Registrations per Event</h2>
                    <div className="h-64">
                        {chartData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#2e2e2e" vertical={false} />
                                    <XAxis dataKey="name" stroke="#666" tick={{ fill: '#666', fontSize: 12 }} axisLine={{ stroke: '#2e2e2e' }} tickLine={false} />
                                    <YAxis stroke="#666" tick={{ fill: '#666', fontSize: 12 }} axisLine={{ stroke: '#2e2e2e' }} tickLine={false} />
                                    <Tooltip
                                        cursor={{ fill: '#1a1a1a' }}
                                        contentStyle={{ backgroundColor: '#0a0a0a', borderColor: '#2e2e2e', color: '#fff', fontSize: '12px', borderRadius: '4px' }}
                                        itemStyle={{ color: '#fff' }}
                                    />
                                    <Bar dataKey="registrations" fill="#ffffff" radius={[2, 2, 0, 0]} barSize={30} />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex items-center justify-center h-full text-[#666] text-sm">Not enough data to display</div>
                        )}
                    </div>
                </div>

                {/* Recent Events List */}
                <div className="card p-0 flex flex-col">
                    <div className="p-4 border-b border-[#2e2e2e]">
                        <h2 className="text-[15px] font-medium text-white">Recent Events</h2>
                    </div>
                    <div className="flex-grow divide-y divide-[#2e2e2e]">
                        {events.slice(0, 4).map(event => (
                            <div key={event.id} className="p-4 hover:bg-[#161616] transition-colors">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-medium text-white text-sm line-clamp-1">{event.title}</h3>
                                    <span className="px-1.5 py-0.5 text-[10px] font-semibold tracking-wider uppercase border border-[#2e2e2e] text-[#a1a1a1] rounded">
                                        {event.status}
                                    </span>
                                </div>
                                <div className="flex gap-1 mt-3">
                                    <Link to={`/organizer/edit-event/${event.id}`} className="text-[#666] hover:text-white p-1.5 rounded transition" title="Edit">
                                        <FiEdit size={14} />
                                    </Link>
                                    <button
                                        onClick={() => { setNotifyEventId(event.id); setShowNotifyModal(true); }}
                                        className="text-[#666] hover:text-white p-1.5 rounded transition" title="Notify Participants"
                                    >
                                        <FiSend size={14} />
                                    </button>
                                    <button onClick={() => handleDelete(event.id)} className="text-[#666] hover:text-red-500 p-1.5 rounded ml-auto transition" title="Delete">
                                        <FiTrash2 size={14} />
                                    </button>
                                </div>
                            </div>
                        ))}
                        {events.length === 0 && <p className="text-[#666] text-center py-6 text-sm">No events created yet.</p>}
                    </div>
                    {events.length > 4 && (
                        <Link to="/organizer/events" className="block text-center py-3 border-t border-[#2e2e2e] text-sm text-[#a1a1a1] hover:text-white hover:bg-[#161616] transition-colors">View All Events</Link>
                    )}
                </div>
            </div>

            {/* Notify Modal */}
            {showNotifyModal && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
                    <div className="card w-full max-w-sm p-6">
                        <h3 className="text-lg font-medium mb-4 flex items-center text-white pb-3 border-b border-[#2e2e2e]"><FiSend className="mr-3 text-[#666]" /> Send Notification</h3>
                        <form onSubmit={handleSendNotification}>
                            <div className="mb-4">
                                <label className="input-label">Message</label>
                                <textarea
                                    rows="4"
                                    className="input-field resize-none"
                                    placeholder="Type your message for participants..."
                                    value={notifyMessage}
                                    onChange={(e) => setNotifyMessage(e.target.value)}
                                    required
                                ></textarea>
                            </div>
                            <div className="mb-6">
                                <label className="input-label">Type</label>
                                <select value={notifyType} onChange={e => setNotifyType(e.target.value)} className="input-field appearance-none cursor-pointer">
                                    <option value="info">Information</option>
                                    <option value="success">Success</option>
                                    <option value="warning">Warning / Urgent</option>
                                </select>
                            </div>
                            <div className="flex gap-3">
                                <button type="button" onClick={() => setShowNotifyModal(false)} className="flex-1 btn-secondary justify-center py-2 text-sm">Cancel</button>
                                <button type="submit" className="flex-1 btn-primary justify-center py-2 text-sm">Send</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrganizerDashboard;
