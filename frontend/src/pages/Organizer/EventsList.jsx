import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import { FiPlus, FiEdit, FiTrash2, FiCalendar, FiUsers } from 'react-icons/fi';
import toast from 'react-hot-toast';

const OrganizerEventsList = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const res = await api.get('/events/my-events/');
            setEvents(res.data);
        } catch (error) {
            toast.error('Failed to load events');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this event?')) {
            try {
                await api.delete(`/events/${id}/`);
                toast.success('Event deleted successfully');
                setEvents(events.filter(e => e.id !== id));
            } catch (error) {
                toast.error('Failed to delete event');
            }
        }
    };

    if (loading) return <div className="text-center p-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div></div>;

    return (
        <div className="page-container">
            <div className="flex justify-between items-center mb-10 pb-4 border-b border-[#2e2e2e]">
                <div>
                    <h1 className="text-2xl font-medium text-white tracking-tight">My Events</h1>
                    <p className="text-sm text-[#a1a1a1] mt-1">Manage all the events you've created.</p>
                </div>
                <Link to="/organizer/create-event" className="btn-primary text-sm flex items-center">
                    <FiPlus className="mr-2" /> Create Event
                </Link>
            </div>

            <div className="card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[#0a0a0a] border-b border-[#2e2e2e] text-[#666] text-xs uppercase tracking-wider">
                                <th className="p-4 font-medium">Event</th>
                                <th className="p-4 font-medium">Date & Time</th>
                                <th className="p-4 font-medium">Capacity</th>
                                <th className="p-4 font-medium">Status</th>
                                <th className="p-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#2e2e2e]">
                            {events.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="p-10 text-center text-[#666] text-sm">
                                        You haven't created any events yet.
                                    </td>
                                </tr>
                            ) : (
                                events.map(event => (
                                    <tr key={event.id} className="hover:bg-[#161616] transition-colors">
                                        <td className="p-4">
                                            <div className="flex items-center">
                                                <div className="w-10 h-10 rounded border border-[#2e2e2e] bg-[#0a0a0a] overflow-hidden mr-3 flex-shrink-0">
                                                    {event.banner_image ? (
                                                        <img src={event.banner_image} className="w-full h-full object-cover grayscale" alt="" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-[#444] text-lg font-bold">{event.title.charAt(0)}</div>
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-white text-[15px] line-clamp-1">{event.title}</p>
                                                    <p className="text-xs text-[#a1a1a1] uppercase tracking-wider mt-0.5">{event.category}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center text-sm text-[#a1a1a1]"><FiCalendar className="mr-2 text-[#666]" />{event.date}</div>
                                            <div className="text-[11px] text-[#666] mt-1 pl-6">{event.time}</div>
                                        </td>
                                        <td className="p-4">
                                            <span className="flex items-center text-sm text-[#a1a1a1]"><FiUsers className="mr-2 text-[#666]" />{event.max_participants}</span>
                                        </td>
                                        <td className="p-4">
                                            <span className="px-2 py-0.5 text-[10px] font-semibold tracking-wider uppercase border border-[#2e2e2e] text-[#a1a1a1] rounded bg-[#0a0a0a]">
                                                {event.status}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex justify-end gap-1">
                                                <Link to={`/events/${event.id}`} className="text-[#666] hover:text-white p-2 text-sm rounded transition" title="View Public Page">
                                                    Preview
                                                </Link>
                                                <Link to={`/organizer/edit-event/${event.id}`} className="text-[#666] hover:text-white p-2 rounded transition" title="Edit">
                                                    <FiEdit size={15} />
                                                </Link>
                                                <button onClick={() => handleDelete(event.id)} className="text-[#666] hover:text-red-500 p-2 rounded transition" title="Delete">
                                                    <FiTrash2 size={15} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default OrganizerEventsList;
