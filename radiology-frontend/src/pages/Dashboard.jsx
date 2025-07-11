import { Users, Calendar, Building2, CreditCard, TrendingUp, Clock } from 'lucide-react';
import { usePatients } from '../hooks/api/usePatients';
import { useAppointments } from '../hooks/api/useAppointments';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import Badge from '../components/ui/Badge';
import { formatDate } from '../lib/utils';

const StatCard = ({ title, value, icon: Icon, trend, color = 'primary' }) => {
  const colors = {
    primary: 'text-primary-600 bg-primary-50',
    green: 'text-green-600 bg-green-50',
    blue: 'text-blue-600 bg-blue-50',
    orange: 'text-orange-600 bg-orange-50',
  };

  return (
    <div className="card">
      <div className="flex items-center">
        <div className={`p-3 rounded-lg ${colors[color]}`}>
          <Icon className="h-6 w-6" />
        </div>
        <div className="ml-4 flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-semibold text-gray-900">{value}</p>
          {trend && (
            <p className="text-sm text-green-600 flex items-center mt-1">
              <TrendingUp className="h-4 w-4 mr-1" />
              {trend}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default function Dashboard() {
  const { data: patients, isLoading: patientsLoading } = usePatients();
  const { data: appointments, isLoading: appointmentsLoading } = useAppointments();

  const isLoading = patientsLoading || appointmentsLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  const stats = [
    {
      title: 'Total Patients',
      value: patients?.length || 0,
      icon: Users,
      trend: '+12% from last month',
      color: 'primary',
    },
    {
      title: 'Today\'s Appointments',
      value: appointments?.filter(apt => 
        formatDate(apt.appointmentDate) === formatDate(new Date())
      ).length || 0,
      icon: Calendar,
      trend: '+5% from yesterday',
      color: 'green',
    },
    {
      title: 'Active Units',
      value: 8,
      icon: Building2,
      color: 'blue',
    },
    {
      title: 'Monthly Revenue',
      value: '$24,500',
      icon: CreditCard,
      trend: '+18% from last month',
      color: 'orange',
    },
  ];

  const recentAppointments = appointments?.slice(0, 5) || [];

  const getStatusBadge = (status) => {
    const statusMap = {
      'Pending': { variant: 'warning', text: 'Pending' },
      'Confirmed': { variant: 'primary', text: 'Confirmed' },
      'Completed': { variant: 'success', text: 'Completed' },
      'Cancelled': { variant: 'danger', text: 'Cancelled' },
    };
    
    const config = statusMap[status] || { variant: 'gray', text: status };
    return <Badge variant={config.variant}>{config.text}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-600">
          Welcome back! Here's what's happening at your radiology center today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Appointments */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Recent Appointments</h3>
            <Clock className="h-5 w-5 text-gray-400" />
          </div>
          
          <div className="space-y-3">
            {recentAppointments.length > 0 ? (
              recentAppointments.map((appointment) => (
                <div key={appointment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Patient ID: {appointment.patientId}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatDate(appointment.appointmentDate)}
                    </p>
                  </div>
                  {getStatusBadge(appointment.status)}
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">
                No recent appointments
              </p>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
          
          <div className="space-y-3">
            <button className="w-full text-left p-3 bg-primary-50 hover:bg-primary-100 rounded-lg transition-colors">
              <div className="flex items-center">
                <Users className="h-5 w-5 text-primary-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Add New Patient</p>
                  <p className="text-xs text-gray-500">Register a new patient</p>
                </div>
              </div>
            </button>
            
            <button className="w-full text-left p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-green-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Schedule Appointment</p>
                  <p className="text-xs text-gray-500">Book a new appointment</p>
                </div>
              </div>
            </button>
            
            <button className="w-full text-left p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
              <div className="flex items-center">
                <Building2 className="h-5 w-5 text-blue-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Manage Units</p>
                  <p className="text-xs text-gray-500">View and manage units</p>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}