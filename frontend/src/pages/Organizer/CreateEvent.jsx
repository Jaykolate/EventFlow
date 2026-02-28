import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import toast from 'react-hot-toast';

const CreateEvent = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '', description: '', category: '', date: '', time: '',
        location: '', max_participants: 100, status: 'upcoming'
    });
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleImageChange = (e) => {
        if (e.target.files[0]) {
            setImage(e.target.files[0]);
            setPreview(URL.createObjectURL(e.target.files[0]));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const data = new FormData();
        for (const key in formData) {
            data.append(key, formData[key]);
        }
        if (image) {
            data.append('banner_image', image);
        }

        try {
            await api.post('/events/', data, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            toast.success('Event Created Successfully!');
            navigate('/organizer/dashboard');
        } catch (error) {
            toast.error('Failed to create event.');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-container max-w-3xl">
            <h1 className="text-2xl font-medium text-white mb-8 pb-4 border-b border-[#2e2e2e]">Create New Event</h1>

            <form onSubmit={handleSubmit} className="space-y-6">

                {/* Image Upload */}
                <div>
                    <label className="input-label">Event Banner</label>
                    <div className="relative h-64 border border-dashed border-[#2e2e2e] rounded-md overflow-hidden hover:border-[#666] transition-colors group bg-[#0a0a0a] flex items-center justify-center">
                        {preview ? (
                            <img src={preview} alt="Preview" className="w-full h-full object-cover grayscale opacity-80" />
                        ) : (
                            <div className="text-center">
                                <p className="text-sm font-medium text-[#a1a1a1] group-hover:text-white transition-colors">Click to upload image</p>
                                <p className="text-[11px] text-[#666] mt-1 uppercase tracking-wider">JPEG, PNG, JPG (max 5MB)</p>
                            </div>
                        )}
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="md:col-span-2">
                        <label className="input-label">Event Title</label>
                        <input type="text" name="title" className="input-field" value={formData.title} onChange={handleChange} required />
                    </div>

                    <div className="md:col-span-2">
                        <label className="input-label">Description</label>
                        <textarea name="description" rows="4" className="input-field resize-none" value={formData.description} onChange={handleChange} required></textarea>
                    </div>

                    <div>
                        <label className="input-label">Category</label>
                        <select name="category" className="input-field appearance-none cursor-pointer" value={formData.category} onChange={handleChange} required>
                            <option value="" disabled>Select Category</option>
                            <option value="Technology">Technology</option>
                            <option value="Music">Music</option>
                            <option value="Sports">Sports</option>
                            <option value="Workshop">Workshop</option>
                        </select>
                    </div>

                    <div>
                        <label className="input-label">Location</label>
                        <input type="text" name="location" className="input-field" value={formData.location} onChange={handleChange} required />
                    </div>

                    <div>
                        <label className="input-label">Date</label>
                        <input type="date" name="date" className="input-field" value={formData.date} onChange={handleChange} required />
                    </div>

                    <div>
                        <label className="input-label">Time</label>
                        <input type="time" name="time" className="input-field" value={formData.time} onChange={handleChange} required />
                    </div>

                    <div>
                        <label className="input-label">Max Participants</label>
                        <input type="number" name="max_participants" min="1" className="input-field" value={formData.max_participants} onChange={handleChange} required />
                    </div>

                    <div>
                        <label className="input-label">Status</label>
                        <select name="status" className="input-field appearance-none cursor-pointer" value={formData.status} onChange={handleChange}>
                            <option value="upcoming">Upcoming</option>
                            <option value="ongoing">Ongoing</option>
                            <option value="completed">Completed</option>
                        </select>
                    </div>
                </div>

                <div className="pt-8 flex justify-end border-t border-[#2e2e2e] mt-4">
                    <button type="button" onClick={() => navigate(-1)} className="btn-secondary mr-3 text-sm px-6">Cancel</button>
                    <button type="submit" className="btn-primary py-2 px-8 text-sm flex justify-center w-32" disabled={loading}>
                        {loading ? <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-black"></span> : 'Create Event'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateEvent;
