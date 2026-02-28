import { Link } from 'react-router-dom';
import { FiCalendar, FiMapPin, FiUsers } from 'react-icons/fi';

const EventCard = ({ event }) => {
    const statusColors = {
        upcoming: 'badge-upcoming',
        ongoing: 'badge-ongoing',
        completed: 'badge-completed',
    };

    return (
        <Link to={`/events/${event.id}`} className="card-glow group">
            <div className="relative h-48 bg-[#0a0a0a] border-b border-[#2e2e2e] overflow-hidden rounded-t-[0.7rem]">
                {event.banner_image ? (
                    <img src={event.banner_image} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 grayscale group-hover:grayscale-0" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#444] text-4xl font-bold bg-[#111111]">
                        {event.title.charAt(0)}
                    </div>
                )}
                <div className={`absolute top-4 right-4 ${statusColors[event.status] || statusColors.upcoming}`}>
                    {event.status.toUpperCase()}
                </div>
            </div>

            <div className="p-5">
                <div className="text-xs text-[#666666] font-semibold mb-2 uppercase tracking-wider">{event.category}</div>
                <h3 className="text-lg font-medium text-white mb-3 line-clamp-1 group-hover:text-[#a1a1a1] transition-colors">{event.title}</h3>

                <div className="space-y-2 text-sm text-[#a1a1a1]">
                    <div className="flex items-center">
                        <FiCalendar className="w-4 h-4 mr-2 text-[#666]" />
                        <span>{event.date} • {event.time}</span>
                    </div>
                    <div className="flex items-center">
                        <FiMapPin className="w-4 h-4 mr-2 text-[#666]" />
                        <span className="truncate">{event.location}</span>
                    </div>
                    <div className="flex items-center">
                        <FiUsers className="w-4 h-4 mr-2 text-[#666]" />
                        <span>Max {event.max_participants} Participants</span>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default EventCard;
