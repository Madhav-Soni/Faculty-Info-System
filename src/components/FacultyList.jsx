import { useState, useEffect } from 'react';
import { getAllFaculty, searchFaculty, getFacultyByDepartment, getAllDepartments } from '../services/database';

export default function FacultyList() {
  const [faculty, setFaculty] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('all');

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      const [facultyData, deptData] = await Promise.all([
        getAllFaculty(),
        getAllDepartments()
      ]);
      setFaculty(facultyData);
      setDepartments(deptData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSearch(term) {
    setSearchTerm(term);
    if (term.length < 2) {
      loadData();
      return;
    }
    
    try {
      const results = await searchFaculty(term);
      setFaculty(results);
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDepartmentFilter(deptId) {
    setSelectedDept(deptId);
    
    try {
      if (deptId === 'all') {
        const data = await getAllFaculty();
        setFaculty(data);
      } else {
        const data = await getFacultyByDepartment(parseInt(deptId));
        setFaculty(data);
      }
    } catch (err) {
      setError(err.message);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading faculty data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-600">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Faculty Directory</h1>
      
      {/* Search and Filter */}
      <div className="mb-6 flex gap-4">
        <input
          type="text"
          placeholder="Search by name, email, or designation..."
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        
        <select
          value={selectedDept}
          onChange={(e) => handleDepartmentFilter(e.target.value)}
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Departments</option>
          {departments.map(dept => (
            <option key={dept.department_id} value={dept.department_id}>
              {dept.department_name}
            </option>
          ))}
        </select>
      </div>

      {/* Faculty Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {faculty.map(person => (
          <div key={person.faculty_id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
            <h2 className="text-xl font-semibold mb-2">{person.name}</h2>
            <p className="text-gray-600 mb-2">{person.designation}</p>
            <p className="text-sm text-gray-500 mb-3">{person.department?.department_name}</p>
            
            <div className="space-y-1 text-sm">
              {person.email && (
                <p className="text-blue-600">
                  📧 <a href={`mailto:${person.email}`}>{person.email}</a>
                </p>
              )}
              {person.phone && (
                <p className="text-gray-700">📞 {person.phone}</p>
              )}
              {person.qualification && (
                <p className="text-gray-600">🎓 {person.qualification}</p>
              )}
            </div>
            
            {person.profile_link && (
              <a
                href={person.profile_link}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-block text-blue-600 hover:underline"
              >
                View Profile →
              </a>
            )}
          </div>
        ))}
      </div>

      {faculty.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No faculty members found.
        </div>
      )}
    </div>
  );
}