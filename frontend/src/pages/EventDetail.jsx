import { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { FiCalendar, FiMapPin, FiClock, FiUsers, FiUser } from 'react-icons/fi';
import toast from 'react-hot-toast';

const EventDetail = () => {
    const { id } = useParams();
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isRegistered, setIsRegistered] = useState(false);
    const [registering, setRegistering] = useState(false);

    useEffect(() => {
        fetchEventDetails();
        if (user) {
            checkRegistration();
        }
    }, [id, user]);

    const fetchEventDetails = async () => {
        try {
            const res = await api.get(`/events/${id}/`);
            setEvent(res.data);
        } catch (error) {
            toast.error('Failed to load event details');
        } finally {
            setLoading(false);
        }
    };

    const checkRegistration = async () => {
        try {
            const res = await api.get('/registrations/my/');
            const registered = res.data.some(reg => reg.event_details.id === parseInt(id));
            setIsRegistered(registered);
        } catch (error) {
            console.error(error);
        }
    };

    const handleRegister = async () => {
        if (!user) {
            navigate('/login');
            return;
        }

        setRegistering(true);
        try {
            await api.post('/registrations/', { event: id });
            toast.success('Successfully registered for the event!');
            setIsRegistered(true);
        } catch (error) {
            const msg = error.response?.data?.non_field_errors?.[0] || 'Registration failed';
            toast.error(msg);
        } finally {
            setRegistering(false);
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center min-h-[50vh]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
        </div>
    );
    if (!event) return <div className="text-center mt-20 text-lg font-medium text-[#a1a1a1]">Event not found</div>;

    return (
        <div>
            {/* Banner */}
            <div className="relative h-[40vh] md:h-[50vh] bg-[#0a0a0a] border-b border-[#2e2e2e]">
                {event.banner_image ? (
                    <img src={event.banner_image} className="w-full h-full object-cover opacity-50 grayscale hover:grayscale-0 transition-all duration-1000" alt="Banner" />
                ) : (
                    <div className="w-full h-full bg-[#0a0a0a]" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>

                <div className="absolute bottom-0 left-0 w-full">
                    <div className="page-container pb-10">
                        <span className="inline-block px-3 py-1 bg-[#1a1a1a] text-[#a1a1a1] border border-[#2e2e2e] text-xs font-medium tracking-wider rounded-full uppercase mb-4">
                            {event.category}
                        </span>
                        <h1 className="text-3xl md:text-5xl font-semibold text-white mb-4 leading-tight tracking-tight">{event.title}</h1>

                        <div className="flex flex-wrap items-center gap-6 text-[#a1a1a1] text-sm font-medium">
                            <div className="flex items-center"><FiCalendar className="mr-2 text-[#666]" /> {event.date}</div>
                            <div className="flex items-center"><FiClock className="mr-2 text-[#666]" /> {event.time}</div>
                            <div className="flex items-center"><FiMapPin className="mr-2 text-[#666]" /> {event.location}</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="page-container py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="card p-8">
                            <h2 className="text-lg font-medium mb-4 text-white">About the Event</h2>
                            <p className="text-[#a1a1a1] text-sm leading-relaxed whitespace-pre-wrap">{event.description}</p>
                        </div>

                        <div className="card p-6 flex items-center gap-4">
                            <div className="w-12 h-12 bg-[#1a1a1a] border border-[#2e2e2e] rounded-full flex items-center justify-center text-lg text-[#666]">
                                <FiUser />
                            </div>
                            <div>
                                <p className="text-xs text-[#666] font-medium uppercase tracking-wider mb-1">Organized By</p>
                                <p className="text-[15px] font-medium text-white">{event.organizer_details?.name}</p>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        <div className="card p-6">
                            <h3 className="text-[15px] font-medium mb-6 text-white text-center pb-4 border-b border-[#2e2e2e]">Registration</h3>

                            <div className="flex justify-between items-center mb-6">
                                <span className="text-sm text-[#666]">Status</span>
                                <span className="font-medium text-white bg-[#1a1a1a] border border-[#2e2e2e] px-2 py-0.5 rounded text-xs uppercase">{event.status}</span>
                            </div>

                            <div className="flex justify-between items-center mb-8">
                                <span className="text-sm text-[#666]">Capacity</span>
                                <span className="font-medium flex items-center text-white text-sm"><FiUsers className="mr-2 text-[#666]" /> Max {event.max_participants}</span>
                            </div>

                            {event.status === 'upcoming' ? (
                                isRegistered ? (
                                    <button className="w-full btn-secondary cursor-default flex justify-center items-center border-[#444] text-[#a1a1a1]">
                                        <span className="mr-2">✓</span> Registered
                                    </button>
                                ) : (
                                    <button
                                        onClick={handleRegister}
                                        disabled={registering}
                                        className="w-full btn-primary justify-center py-2.5"
                                    >
                                        {registering ? 'Processing...' : 'Register Now'}
                                    </button>
                                )
                            ) : (
                                <button disabled className="w-full bg-[#111] border border-[#2e2e2e] text-[#666] font-medium py-2.5 rounded-md cursor-not-allowed text-sm">
                                    Event {event.status}
                                </button>
                            )}
                        </div>

                        {/* Team Info if registered */}
                        {isRegistered && (
                            <div className="card p-6 text-center">
                                <h3 className="font-medium text-[15px] text-white mb-1">Looking for a team?</h3>
                                <p className="text-xs text-[#a1a1a1] mb-5">You can form or join a team for this event.</p>
                                <Link to={`/events/${event.id}/teams`} className="w-full flex justify-center btn-secondary text-sm">
                                    Manage Teams
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventDetail;
