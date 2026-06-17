import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './routes/ProtectedRoute';

// Public Home Page
import HomePage from './pages/public/HomePage';

// Auth
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Traveler
import TravelerDashboard from './pages/traveler/TravelerDashboard';
import ServicesPage from './pages/traveler/ServicesPage';
import CityRideBooking from './pages/traveler/CityRideBooking';
import IntercityBooking from './pages/traveler/IntercityBooking';
import PackageBooking from './pages/traveler/PackageBooking';
import PackageDetail from './pages/traveler/PackageDetail';
import CustomTripRequest from './pages/traveler/CustomTripRequest';
import BookingHistory from './pages/traveler/BookingHistory';
import BookingStatus from './pages/traveler/BookingStatus';
import PaymentProofUpload from './pages/traveler/PaymentProofUpload';
import Profile from './pages/traveler/Profile';

// Driver
import DriverDashboard from './pages/driver/DriverDashboard';
import AssignedBookings from './pages/driver/AssignedBookings';
import TripSchedule from './pages/driver/TripSchedule';
import Earnings from './pages/driver/Earnings';
import TripHistory from './pages/driver/TripHistory';

// Admin
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageUsers from './pages/admin/ManageUsers';
import ManageDrivers from './pages/admin/ManageDrivers';
import ManageVehicles from './pages/admin/ManageVehicles';
import ManageRoutes from './pages/admin/ManageRoutes';
import ManagePackages from './pages/admin/ManagePackages';
import ManageBookings from './pages/admin/ManageBookings';
import ManagePayments from './pages/admin/ManagePayments';
import ReviewCustomRequests from './pages/admin/ReviewCustomRequests';
import Reports from './pages/admin/Reports';

// Layouts
import TravelerLayout from './layouts/TravelerLayout';
import DriverLayout from './layouts/DriverLayout';
import AdminLayout from './layouts/AdminLayout';
import ThemeToggle from './components/ThemeToggle';

const Unauthorized = () => (
  <div className="flex items-center justify-center h-screen text-muted">
    403 – You are not authorized to view this page.
  </div>
);

export default function App() {
  return (
    <BrowserRouter>
      <ThemeToggle />
      <Routes>
        {/* Public */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Traveler */}
        <Route path="/traveler" element={
          <ProtectedRoute roles={['traveler']}><TravelerLayout /></ProtectedRoute>
        }>
          <Route index element={<TravelerDashboard />} />
          <Route path="services" element={<ServicesPage />} />
          <Route path="book/city" element={<CityRideBooking />} />
          <Route path="book/intercity" element={<IntercityBooking />} />
          <Route path="book/package" element={<PackageBooking />} />
          <Route path="packages/:id" element={<PackageDetail />} />
          <Route path="custom-trip" element={<CustomTripRequest />} />
          <Route path="bookings" element={<BookingHistory />} />
          <Route path="bookings/:id" element={<BookingStatus />} />
          <Route path="payment/:bookingId" element={<PaymentProofUpload />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        {/* Driver */}
        <Route path="/driver" element={
          <ProtectedRoute roles={['driver']}><DriverLayout /></ProtectedRoute>
        }>
          <Route index element={<DriverDashboard />} />
          <Route path="bookings" element={<AssignedBookings />} />
          <Route path="schedule" element={<TripSchedule />} />
          <Route path="earnings" element={<Earnings />} />
          <Route path="history" element={<TripHistory />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        {/* Admin */}
        <Route path="/admin" element={
          <ProtectedRoute roles={['admin']}><AdminLayout /></ProtectedRoute>
        }>
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<ManageUsers />} />
          <Route path="drivers" element={<ManageDrivers />} />
          <Route path="vehicles" element={<ManageVehicles />} />
          <Route path="routes" element={<ManageRoutes />} />
          <Route path="packages" element={<ManagePackages />} />
          <Route path="bookings" element={<ManageBookings />} />
          <Route path="payments" element={<ManagePayments />} />
          <Route path="custom-requests" element={<ReviewCustomRequests />} />
          <Route path="reports" element={<Reports />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
