import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/config/supabase';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Search, Mail, Phone, GraduationCap, ExternalLink } from 'lucide-react';

interface Department {
  department_id: number;
  department_name: string;
}

interface Faculty {
  faculty_id: number;
  name: string;
  designation: string;
  qualification: string;
  email: string;
  phone: string;
  profile_link: string;
  department: {
    department_name: string;
  };
}

export default function FacultyDirectory() {
  const [faculty, setFaculty] = useState<Faculty[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('all');

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      
      const [facultyData, deptData] = await Promise.all([
        supabase
          .from('faculty')
          .select(`
            *,
            department:department_id (department_name)
          `)
          .order('name'),
        supabase
          .from('department')
          .select('*')
          .order('department_name')
      ]);
      
      if (facultyData.error) throw facultyData.error;
      if (deptData.error) throw deptData.error;
      
      setFaculty(facultyData.data || []);
      setDepartments(deptData.data || []);
    } catch (err) {
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSearch(term: string) {
    setSearchTerm(term);
    if (term.length < 2) {
      loadData();
      return;
    }
    
    try {
      const { data, error } = await supabase
        .from('faculty')
        .select(`*, department:department_id (department_name)`)
        .or(`name.ilike.%${term}%,email.ilike.%${term}%,designation.ilike.%${term}%`)
        .order('name');
      
      if (error) throw error;
      setFaculty(data || []);
    } catch (err) {
      console.error('Search error:', err);
    }
  }

  async function handleDepartmentFilter(deptId: string) {
    setSelectedDept(deptId);
    
    try {
      if (deptId === 'all') {
        loadData();
      } else {
        const { data, error } = await supabase
          .from('faculty')
          .select(`*, department:department_id (department_name)`)
          .eq('department_id', parseInt(deptId))
          .order('name');
        
        if (error) throw error;
        setFaculty(data || []);
      }
    } catch (err) {
      console.error('Filter error:', err);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold">Faculty Directory</h1>
          <p className="text-muted-foreground mt-2">Browse and search faculty members</p>
        </div>
        <Link to="/add-faculty">
          <Button>Add Faculty</Button>
        </Link>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, or designation..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            
            <Select value={selectedDept} onValueChange={handleDepartmentFilter}>
              <SelectTrigger className="w-full md:w-[250px]">
                <SelectValue placeholder="All Departments" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {departments.map(dept => (
                  <SelectItem key={dept.department_id} value={dept.department_id.toString()}>
                    {dept.department_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Faculty</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{faculty.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Departments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{departments.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Profiles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{faculty.filter(f => f.email).length}</div>
          </CardContent>
        </Card>
      </div>

      {faculty.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No faculty members found.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {faculty.map(person => (
            <Card key={person.faculty_id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <CardTitle className="text-xl">{person.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{person.designation}</p>
                  </div>
                  <Badge variant="secondary">
                    {person.department?.department_name?.split(' ').slice(0, 2).join(' ')}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-3">
                {person.email && (
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <a href={`mailto:${person.email}`} className="text-primary hover:underline truncate">
                      {person.email}
                    </a>
                  </div>
                )}
                
                {person.phone && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{person.phone}</span>
                  </div>
                )}
                
                {person.qualification && (
                  <div className="flex items-center gap-2 text-sm">
                    <GraduationCap className="h-4 w-4 text-muted-foreground" />
                    <span className="truncate">{person.qualification}</span>
                  </div>
                )}
                
                <div className="flex gap-2 pt-2">
                  {person.profile_link && (
                    <Button variant="outline" size="sm" className="flex-1" asChild>
                      <a href={person.profile_link} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Profile
                      </a>
                    </Button>
                  )}
                  <Button variant="default" size="sm" className="flex-1" asChild>
                    <Link to={`/faculty/${person.faculty_id}`}>Details</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}