import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center p-4 text-center">
            <h1 className="text-5xl md:text-7xl font-semibold mb-6 text-white tracking-tight">
                The Future of <br />
                Event Management
            </h1>
            <p className="text-lg md:text-xl text-[#a1a1a1] max-w-2xl mb-10">
                Discover, register, and form teams for the most exciting events. Whether you are an organizer or a participant, EventFlow provides the ultimate platform.
            </p>

            <div className="flex gap-4">
                <Link to="/events" className="btn-primary">Explore Events</Link>
                <Link to="/register" className="btn-secondary">Get Started</Link>
            </div>

            <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl">
                <div className="card-glow p-6 text-left">
                    <div className="w-12 h-12 border border-[#2e2e2e] bg-[#0a0a0a] rounded-lg flex items-center justify-center mb-6 text-[#a1a1a1] text-2xl">🎟️</div>
                    <h3 className="text-lg font-medium text-white mb-2">Seamless Registration</h3>
                    <p className="text-[#a1a1a1] text-sm">Register for events with a single click and manage all your tickets in one place.</p>
                </div>
                <div className="card-glow p-6 text-left">
                    <div className="w-12 h-12 border border-[#2e2e2e] bg-[#0a0a0a] rounded-lg flex items-center justify-center mb-6 text-[#a1a1a1] text-2xl">👥</div>
                    <h3 className="text-lg font-medium text-white mb-2">Team Formation</h3>
                    <p className="text-[#a1a1a1] text-sm">Join forces! Create a team, invite friends, and participate together in group events.</p>
                </div>
                <div className="card-glow p-6 text-left">
                    <div className="w-12 h-12 border border-[#2e2e2e] bg-[#0a0a0a] rounded-lg flex items-center justify-center mb-6 text-[#a1a1a1] text-2xl">🔔</div>
                    <h3 className="text-lg font-medium text-white mb-2">Live Notifications</h3>
                    <p className="text-[#a1a1a1] text-sm">Get real-time updates from organizers so you never miss a schedule change.</p>
                </div>
            </div>
        </div>
    );
};

export default Home;
