import { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { FiUsers, FiPlus, FiUser, FiLogOut } from 'react-icons/fi';
import toast from 'react-hot-toast';

const Teams = () => {
    const { id } = useParams(); // event_id
    const { user } = useContext(AuthContext);
    const [teams, setTeams] = useState([]);
    const [myTeam, setMyTeam] = useState(null);
    const [loading, setLoading] = useState(true);

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newTeamName, setNewTeamName] = useState('');
    const [newTeamSize, setNewTeamSize] = useState(4);

    useEffect(() => {
        fetchTeams();
        if (user) fetchMyTeam();
    }, [id, user]);

    const fetchTeams = async () => {
        try {
            const res = await api.get(`/teams/event/${id}/`);
            setTeams(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const fetchMyTeam = async () => {
        try {
            const res = await api.get(`/teams/my-team/${id}/`);
            setMyTeam(res.data);
        } catch (error) {
            // It throws 400 if user has no team
            setMyTeam(null);
        }
    };

    const handleCreateTeam = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/teams/', {
                event: id,
                team_name: newTeamName,
                max_size: newTeamSize
            });
            toast.success('Team created successfully!');
            setShowCreateModal(false);
            setNewTeamName('');
            fetchTeams();
            fetchMyTeam();
        } catch (error) {
            toast.error(error.response?.data?.non_field_errors?.[0] || 'Could not create team.');
        }
    };

    const handleJoinTeam = async (teamId) => {
        try {
            await api.post(`/teams/${teamId}/join/`);
            toast.success('Joined team successfully!');
            fetchTeams();
            fetchMyTeam();
        } catch (error) {
            toast.error(error.response?.data?.error || 'Could not join team.');
        }
    };

    const handleLeaveTeam = async (teamId) => {
        try {
            await api.delete(`/teams/${teamId}/leave/`);
            toast.success('Left team successfully!');
            fetchTeams();
            setMyTeam(null);
        } catch (error) {
            toast.error(error.response?.data?.error || 'Could not leave team.');
        }
    };

    if (loading) return <div className="text-center p-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div></div>;

    return (
        <div className="page-container">
            <div className="flex justify-between items-center mb-10 pb-4 border-b border-[#2e2e2e]">
                <div>
                    <h1 className="text-2xl font-medium text-white tracking-tight">Event Teams</h1>
                    <p className="text-sm text-[#a1a1a1] mt-1">Join or form a team for this event.</p>
                </div>

                {!myTeam && (
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="btn-primary flex items-center text-sm"
                    >
                        <FiPlus className="mr-2" /> Create Team
                    </button>
                )}
            </div>

            {myTeam && (
                <div className="mb-12">
                    <h2 className="text-[15px] font-medium mb-4 text-white flex items-center">
                        <span className="w-2 h-2 rounded-full bg-white mr-3 animate-pulse"></span>
                        Your Current Team
                    </h2>
                    <div className="card-glow p-6">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h3 className="text-2xl font-semibold text-white mb-2 tracking-tight">{myTeam.team_name}</h3>
                                <p className="text-[#a1a1a1] text-xs font-medium uppercase tracking-wider flex items-center">
                                    <FiUsers className="mr-2 text-[#666]" /> {myTeam.members_details.length} / {myTeam.max_size} Members
                                </p>
                            </div>
                            {myTeam.leader !== user?.id && (
                                <button
                                    onClick={() => handleLeaveTeam(myTeam.id)}
                                    className="bg-red-950/30 border border-red-900/50 text-red-500 hover:bg-red-900/40 px-3 py-1.5 rounded transition text-xs flex items-center font-medium"
                                >
                                    <FiLogOut className="mr-2" /> Leave
                                </button>
                            )}
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                            {myTeam.members_details.map(member => (
                                <div key={member.id} className="flex items-center space-x-3 bg-[#0a0a0a] p-3 rounded-md border border-[#2e2e2e]">
                                    <div className="w-8 h-8 rounded border border-[#2e2e2e] bg-[#111] flex items-center justify-center text-[#666]">
                                        <FiUser size={14} />
                                    </div>
                                    <div className="overflow-hidden">
                                        <p className="text-sm font-medium text-white truncate">{member.name}</p>
                                        {member.id === myTeam.leader && <span className="text-[10px] text-[#666] uppercase tracking-wider font-semibold">Leader</span>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            <div>
                <h2 className="text-[15px] font-medium mb-6 text-white pb-3 border-b border-[#2e2e2e]">All Teams ({teams.length})</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {teams.map(team => (
                        <div key={team.id} className="card p-6 flex flex-col h-full hover:border-[#444] transition-colors">
                            <div className="flex justify-between items-start mb-6">
                                <h3 className="text-lg font-medium text-white truncate">{team.team_name}</h3>
                                <span className="bg-[#1a1a1a] border border-[#2e2e2e] text-[10px] uppercase font-bold px-2 py-0.5 rounded text-[#a1a1a1] flex items-center flex-shrink-0 ml-2">
                                    <FiUsers className="mr-1 mt-[-1px]" /> {team.members.length}/{team.max_size}
                                </span>
                            </div>

                            <div className="flex-grow">
                                <p className="text-xs text-[#666] uppercase tracking-wider mb-3 font-semibold">Members</p>
                                <div className="flex flex-wrap pl-2 mb-4">
                                    {team.members_details.slice(0, 5).map(m => (
                                        <div key={m.id} title={m.name} className="w-7 h-7 rounded-full bg-[#1a1a1a] border-2 border-black flex items-center justify-center text-[10px] font-bold text-[#a1a1a1] -ml-2 relative z-10 hover:z-20 transition-transform">
                                            {m.name.charAt(0)}
                                        </div>
                                    ))}
                                    {team.members_details.length > 5 && (
                                        <div className="w-7 h-7 rounded-full bg-[#111] border-2 border-black flex items-center justify-center text-[10px] font-bold text-[#666] -ml-2 z-10">
                                            +{team.members_details.length - 5}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {!myTeam && team.members.length < team.max_size && (
                                <button
                                    onClick={() => handleJoinTeam(team.id)}
                                    className="w-full mt-4 bg-white hover:bg-[#e5e5e5] text-black transition-colors py-2 rounded text-sm font-medium"
                                >
                                    Join Team
                                </button>
                            )}
                            {team.members.length >= team.max_size && (
                                <button disabled className="w-full mt-4 bg-[#111] border border-[#2e2e2e] text-[#666] py-2 rounded text-sm font-medium cursor-not-allowed">
                                    Full
                                </button>
                            )}
                        </div>
                    ))}
                    {teams.length === 0 && (
                        <div className="col-span-full py-16 card empty-state flex flex-col items-center">
                            <FiUsers className="w-8 h-8 text-[#444] mb-3" />
                            <p className="text-sm text-[#a1a1a1]">No teams have been formed yet.</p>
                            <p className="text-xs text-[#666] mt-1">Be the first to create one!</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Create Team Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
                    <div className="card w-full max-w-sm p-6">
                        <h3 className="text-lg font-medium mb-6 text-white pb-3 border-b border-[#2e2e2e]">Create New Team</h3>
                        <form onSubmit={handleCreateTeam}>
                            <div className="mb-4">
                                <label className="input-label">Team Name</label>
                                <input
                                    type="text"
                                    value={newTeamName}
                                    onChange={e => setNewTeamName(e.target.value)}
                                    className="input-field"
                                    required
                                />
                            </div>
                            <div className="mb-8">
                                <label className="input-label">Max Size (2-10)</label>
                                <input
                                    type="number"
                                    min="2" max="10"
                                    value={newTeamSize}
                                    onChange={e => setNewTeamSize(e.target.value)}
                                    className="input-field"
                                    required
                                />
                            </div>
                            <div className="flex gap-3">
                                <button type="button" onClick={() => setShowCreateModal(false)} className="flex-1 btn-secondary justify-center py-2 text-sm">Cancel</button>
                                <button type="submit" className="flex-1 btn-primary justify-center py-2 text-sm">Create</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Teams;
