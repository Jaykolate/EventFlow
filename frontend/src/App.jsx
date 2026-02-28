import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Components
import Navbar from './components/Navbar';

// Auth Pages
import Login from './pages/Login';
import Register from './pages/Register';

// Public/Participant Pages
import Home from './pages/Home';
import EventsList from './pages/EventsList';
import EventDetail from './pages/EventDetail';
import Teams from './pages/Teams';
import MyRegistrations from './pages/MyRegistrations';
import ParticipantDashboard from './pages/ParticipantDashboard';
import Notifications from './pages/Notifications';

// Organizer Pages
import OrganizerDashboard from './pages/Organizer/Dashboard';
import OrganizerEventsList from './pages/Organizer/EventsList';
import CreateEvent from './pages/Organizer/CreateEvent';
import EditEvent from './pages/Organizer/EditEvent';

function App() {
    return (
        <Router>
            <AuthProvider>
                <div className="min-h-screen flex flex-col bg-black text-white">
                    <Navbar />
                    <main className="flex-grow">
                        <Routes>
                            {/* Public Routes */}
                            <Route path="/" element={<Home />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                            <Route path="/events" element={<EventsList />} />
                            <Route path="/events/:id" element={<EventDetail />} />

                            {/* Protected Routes (Both) */}
                            <Route path="/events/:id/teams" element={
                                <ProtectedRoute allowedRoles={['participant', 'organizer']}>
                                    <Teams />
                                </ProtectedRoute>
                            } />
                            <Route path="/notifications" element={
                                <ProtectedRoute allowedRoles={['participant', 'organizer']}>
                                    <Notifications />
                                </ProtectedRoute>
                            } />

                            {/* Protected Routes (Participant Only) */}
                            <Route path="/participant/dashboard" element={
                                <ProtectedRoute allowedRoles={['participant']}>
                                    <ParticipantDashboard />
                                </ProtectedRoute>
                            } />
                            <Route path="/participant/my-registrations" element={
                                <ProtectedRoute allowedRoles={['participant']}>
                                    <MyRegistrations />
                                </ProtectedRoute>
                            } />

                            {/* Protected Routes (Organizer Only) */}
                            <Route path="/organizer/dashboard" element={
                                <ProtectedRoute allowedRoles={['organizer']}>
                                    <OrganizerDashboard />
                                </ProtectedRoute>
                            } />
                            <Route path="/organizer/events" element={
                                <ProtectedRoute allowedRoles={['organizer']}>
                                    <OrganizerEventsList />
                                </ProtectedRoute>
                            } />
                            <Route path="/organizer/create-event" element={
                                <ProtectedRoute allowedRoles={['organizer']}>
                                    <CreateEvent />
                                </ProtectedRoute>
                            } />
                            <Route path="/organizer/edit-event/:id" element={
                                <ProtectedRoute allowedRoles={['organizer']}>
                                    <EditEvent />
                                </ProtectedRoute>
                            } />

                        </Routes>
                    </main>
                    <Toaster position="bottom-right" toastOptions={{
                        style: {
                            background: '#111111',
                            color: '#ffffff',
                            border: '1px solid #2e2e2e'
                        }
                    }} />
                </div>
            </AuthProvider>
        </Router>
    );
}

export default App;
