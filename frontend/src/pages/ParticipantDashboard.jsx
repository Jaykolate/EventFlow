import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import EventCard from '../components/EventCard';
import { FiBell, FiUsers, FiClock } from 'react-icons/fi';

const ParticipantDashboard = () => {
    const { user } = useContext(AuthContext);
    const [registrations, setRegistrations] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            const [regRes, notifRes] = await Promise.all([
                api.get('/registrations/my/'),
                api.get('/notifications/')
            ]);
            setRegistrations(regRes.data);
            setNotifications(notifRes.data.slice(0, 5)); // Just show recent 5
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="text-center p-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div></div>;

    const upcomingEvents = registrations.filter(r => r.event_details.status === 'upcoming');

    return (
        <div className="page-container">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="page-title">Welcome back, {user?.name.split(' ')[0]}!</h1>
                    <p className="page-subtitle mb-0">Here is what's happening with your events.</p>
                </div>
                <Link to="/events" className="btn-primary hidden sm:block">Browse New Events</Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Main Content Column */}
                <div className="lg:col-span-2 space-y-8">

                    <section>
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-medium text-white flex items-center"><FiClock className="mr-2 text-[#666]" /> Your Upcoming Events</h2>
                            <Link to="/participant/my-registrations" className="text-sm text-[#a1a1a1] hover:text-white underline">View All</Link>
                        </div>

                        {upcomingEvents.length === 0 ? (
                            <div className="card p-8 text-center">
                                <p className="text-[#a1a1a1] text-sm mb-4">You have no upcoming events.</p>
                                <Link to="/events" className="btn-secondary">Explore Events</Link>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {upcomingEvents.slice(0, 4).map(reg => (
                                    <EventCard key={reg.id} event={reg.event_details} />
                                ))}
                            </div>
                        )}
                    </section>

                    <section>
                        <h2 className="text-lg font-medium text-white flex items-center mb-4"><FiUsers className="mr-2 text-[#666]" /> Quick Actions</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Link to="/participant/my-registrations" className="card-glow p-6 group">
                                <h3 className="font-medium text-[15px] mb-2 text-white group-hover:text-[#a1a1a1] transition-colors">Manage Registrations</h3>
                                <p className="text-xs text-[#666]">Cancel or view details of your registered events.</p>
                            </Link>
                            <Link to="/events" className="card-glow p-6 group">
                                <h3 className="font-medium text-[15px] mb-2 text-white group-hover:text-[#a1a1a1] transition-colors">Join a Team</h3>
                                <p className="text-xs text-[#666]">Find your event and form a team to participate together.</p>
                            </Link>
                        </div>
                    </section>
                </div>

                {/* Sidebar Column */}
                <div className="space-y-8">

                    <section className="card p-6">
                        <div className="flex justify-between items-center mb-6 border-b border-[#2e2e2e] pb-4">
                            <h2 className="text-[15px] font-medium text-white flex items-center"><FiBell className="mr-2 text-[#666]" /> Recent Updates</h2>
                            <Link to="/notifications" className="text-xs text-[#a1a1a1] hover:text-white underline">All</Link>
                        </div>

                        <div className="space-y-4">
                            {notifications.length === 0 ? (
                                <p className="text-sm text-[#666] text-center py-4">No recent notifications</p>
                            ) : (
                                notifications.map(n => (
                                    <div key={n.id} className="border-l-2 border-[#444] pl-4 py-1">
                                        <p className="text-sm text-[#a1a1a1]">{n.message}</p>
                                        <p className="text-xs text-[#666] mt-1">{new Date(n.created_at).toLocaleDateString()}</p>
                                    </div>
                                ))
                            )}
                        </div>
                    </section>

                    <section className="card-glow p-6 text-center">
                        <div className="w-12 h-12 bg-[#1a1a1a] rounded-full flex items-center justify-center mx-auto mb-4 border border-[#2e2e2e]">
                            <span className="text-lg grayscale">🏆</span>
                        </div>
                        <h3 className="font-medium mb-1 text-white text-[15px]">Ready to compete?</h3>
                        <p className="text-xs text-[#666] mb-6">Discover the most trending hackathons and workshops.</p>
                        <Link to="/events" className="btn-primary w-full justify-center">Find Events</Link>
                    </section>

                </div>
            </div>
        </div>
    );
};

export default ParticipantDashboard;
