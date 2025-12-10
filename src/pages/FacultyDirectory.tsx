// src/pages/FacultyDirectory.tsx
import { useState, useEffect } from 'react';
import { facultyService, departmentService, Faculty, Department } from '../config/supabase';

// Extended department list
const COMPREHENSIVE_DEPARTMENTS = [
  'Computer Science and Engineering',
  'Mechanical Engineering',
  'Civil Engineering',
  'Electronics and Communication Engineering',
  'Electrical Engineering',
  'Information Technology',
  'Artificial Intelligence and Machine Learning',
  'Data Science',
  'Cyber Security',
  'Aerospace Engineering',
  'Biotechnology',
  'Architecture'
];

export default function FacultyDirectory() {
  const [faculty, setFaculty] = useState<Faculty[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [facultyData, deptData] = await Promise.all([
        facultyService.getAll(),
        departmentService.getAll()
      ]);
      setFaculty(facultyData);
      setDepartments(deptData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Get department name by ID
  const getDepartmentName = (deptId?: number) => {
    if (!deptId) return 'Not Assigned';
    const dept = departments.find(d => d.department_id === deptId);
    return dept?.department_name || 'Unknown';
  };

  // Filter faculty based on search and department
  const filteredFaculty = faculty.filter(f => {
    const matchesSearch = 
      f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.designation?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDepartment = 
      selectedDepartment === 'all' || 
      getDepartmentName(f.department_id) === selectedDepartment;
    
    return matchesSearch && matchesDepartment;
  });

  // Get unique department count
  const uniqueDepartments = new Set(faculty.map(f => f.department_id).filter(Boolean));

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Loading faculty...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-2">Faculty Directory</h1>
          <p className="text-blue-100">Browse and search faculty members</p>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="max-w-7xl mx-auto px-4 -mt-8 mb-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1 relative">
              <svg 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search by name, email, or designation..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Department Filter */}
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white min-w-[200px]"
            >
              <option value="all">All Departments</option>
              {COMPREHENSIVE_DEPARTMENTS.map((deptName) => (
                <option key={deptName} value={deptName}>
                  {deptName}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-4 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600 mb-1">Total Faculty</p>
            <p className="text-4xl font-bold text-gray-900">{faculty.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600 mb-1">Departments</p>
            <p className="text-4xl font-bold text-gray-900">{uniqueDepartments.size}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600 mb-1">Active Profiles</p>
            <p className="text-4xl font-bold text-gray-900">{faculty.length}</p>
          </div>
        </div>
      </div>

      {/* Faculty Cards Grid */}
      <div className="max-w-7xl mx-auto px-4 pb-12">
        {filteredFaculty.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">No faculty found</h3>
            <p className="mt-2 text-gray-500">
              Try adjusting your search or filter criteria
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFaculty.map((member) => (
              <div
                key={member.faculty_id}
                className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 p-6 border border-gray-100"
              >
                {/* Department Badge - Full Name */}
                <div className="flex justify-end mb-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {getDepartmentName(member.department_id)}
                  </span>
                </div>

                {/* Faculty Name */}
                <h3 className="text-xl font-bold text-gray-900 mb-1">
                  {member.name}
                </h3>

                {/* Designation */}
                {member.designation && (
                  <p className="text-sm text-gray-600 mb-4">
                    {member.designation}
                  </p>
                )}

                {/* Department Full Name */}
                <div className="mb-4 pb-4 border-b border-gray-100">
                  <p className="text-sm font-medium text-blue-600">
                    {getDepartmentName(member.department_id)}
                  </p>
                </div>

                {/* Contact Information */}
                <div className="space-y-3">
                  {/* Email */}
                  {member.email && (
                    <div className="flex items-start gap-3">
                      <svg 
                        className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <a 
                        href={`mailto:${member.email}`}
                        className="text-sm text-blue-600 hover:text-blue-700 hover:underline break-all"
                      >
                        {member.email}
                      </a>
                    </div>
                  )}

                  {/* Phone */}
                  {member.phone && (
                    <div className="flex items-center gap-3">
                      <svg 
                        className="w-5 h-5 text-gray-400 flex-shrink-0" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <a 
                        href={`tel:${member.phone}`}
                        className="text-sm text-gray-700 hover:text-blue-600"
                      >
                        {member.phone}
                      </a>
                    </div>
                  )}

                  {/* Qualification */}
                  {member.qualification && (
                    <div className="flex items-start gap-3">
                      <svg 
                        className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                      </svg>
                      <p className="text-sm text-gray-700">
                        {member.qualification}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}