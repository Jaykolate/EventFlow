import { useState, useEffect } from 'react';
import api from '../api/axios';
import EventCard from '../components/EventCard';
import { FiSearch, FiFilter } from 'react-icons/fi';

const EventsList = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('');
    const [status, setStatus] = useState('');

    const fetchEvents = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (search) params.append('search', search);
            if (category) params.append('category', category);
            if (status) params.append('status', status);

            const res = await api.get(`/events/?${params.toString()}`);
            // Assuming DRF pagination returns { results: [...] }
            setEvents(res.data.results || res.data);
        } catch (error) {
            console.error('Failed to fetch events', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchEvents();
        }, 500); // debounce search
        return () => clearTimeout(timer);
    }, [search, category, status]);

    return (
        <div className="page-container">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="page-title">Explore Events</h1>
                    <p className="page-subtitle mb-0">Discover and join amazing experiences.</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                    <div className="relative">
                        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#666]" />
                        <input
                            type="text"
                            placeholder="Search events..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="input-field pl-9 h-[38px]"
                        />
                    </div>

                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="input-field appearance-none bg-[#0a0a0a] h-[38px] py-1 cursor-pointer text-sm"
                    >
                        <option value="">All Status</option>
                        <option value="upcoming">Upcoming</option>
                        <option value="ongoing">Ongoing</option>
                        <option value="completed">Completed</option>
                    </select>

                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="input-field appearance-none bg-[#0a0a0a] h-[38px] py-1 cursor-pointer text-sm"
                    >
                        <option value="">All Categories</option>
                        <option value="Technology">Technology</option>
                        <option value="Music">Music</option>
                        <option value="Sports">Sports</option>
                        <option value="Workshop">Workshop</option>
                    </select>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                </div>
            ) : events.length === 0 ? (
                <div className="card empty-state">
                    <p className="text-lg text-[#a1a1a1] mb-1">No events found</p>
                    <p className="text-xs text-[#666]">Try adjusting your filters or search query.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {events.map(event => (
                        <EventCard key={event.id} event={event} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default EventsList;
