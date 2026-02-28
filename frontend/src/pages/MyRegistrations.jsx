import { useState, useEffect } from 'react';
import api from '../api/axios';
import { FiCalendar, FiMapPin, FiClock } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const MyRegistrations = () => {
    const [registrations, setRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMyRegistrations();
    }, []);

    const fetchMyRegistrations = async () => {
        try {
            const res = await api.get('/registrations/my/');
            setRegistrations(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = async (id) => {
        if (window.confirm("Are you sure you want to cancel your registration?")) {
            try {
                await api.delete(`/registrations/${id}/`);
                toast.success("Registration cancelled successfully.");
                setRegistrations(registrations.filter(reg => reg.id !== id));
            } catch (error) {
                toast.error("Could not cancel registration.");
            }
        }
    }

    if (loading) return <div className="text-center p-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div></div>;

    return (
        <div className="page-container">
            <h1 className="page-title">Participant Dashboard</h1>
            <p className="page-subtitle">Manage your event registrations and schedules.</p>

            {registrations.length === 0 ? (
                <div className="card empty-state flex flex-col items-center">
                    <div className="text-4xl mb-4 grayscale opacity-70">🎟️</div>
                    <h2 className="text-lg font-medium text-white mb-1">No Registrations Yet</h2>
                    <p className="text-xs text-[#666] mb-6 max-w-sm">You haven't registered for any events. Browse the directory to find something exciting!</p>
                    <Link to="/events" className="btn-primary">Browse Events</Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {registrations.map(reg => {
                        const event = reg.event_details;
                        return (
                            <div key={reg.id} className="card-glow flex flex-col group relative p-0 overflow-hidden">
                                <div className="absolute top-4 right-4 z-10 flex gap-2">
                                    <div className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-black border ${reg.status === 'confirmed' ? 'text-green-400 border-green-900' :
                                        reg.status === 'pending' ? 'text-yellow-400 border-yellow-900' :
                                            'text-red-400 border-red-900'
                                        }`}>
                                        {reg.status}
                                    </div>
                                </div>

                                <div className="h-40 bg-[#0a0a0a] border-b border-[#2e2e2e] relative overflow-hidden">
                                    {event.banner_image ? (
                                        <img src={event.banner_image} className="w-full h-full object-cover opacity-60 grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" alt="Banner" />
                                    ) : (
                                        <div className="w-full h-full bg-[#0a0a0a]" />
                                    )}
                                </div>

                                <div className="p-5 flex-grow flex flex-col">
                                    <h3 className="text-lg font-medium text-white mb-4 line-clamp-1">{event.title}</h3>
                                    <div className="space-y-2 text-sm text-[#a1a1a1] mb-6 flex-grow">
                                        <div className="flex items-center"><FiCalendar className="mr-2 text-[#666]" /> {event.date}</div>
                                        <div className="flex items-center"><FiClock className="mr-2 text-[#666]" /> {event.time}</div>
                                        <div className="flex items-center"><FiMapPin className="mr-2 text-[#666]" /> <span className="truncate">{event.location}</span></div>
                                    </div>

                                    <div className="mt-auto flex flex-col gap-3">
                                        <Link to={`/events/${event.id}`} className="w-full btn-secondary justify-center text-sm py-2">View Event Details</Link>
                                        <button
                                            onClick={() => handleCancel(reg.id)}
                                            className="w-full py-2 rounded-md border border-[#2e2e2e] text-[#a1a1a1] hover:text-red-500 hover:border-red-900 hover:bg-red-950/20 transition-colors font-medium text-sm"
                                        >
                                            Cancel Registration
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default MyRegistrations;
