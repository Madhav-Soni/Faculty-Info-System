// src/services/database.js
import { supabase, supabaseAdmin } from '../config/supabase.js';

// Use admin client for backend operations, regular client for frontend
const db = supabaseAdmin || supabase;

// =============================================
// DEPARTMENT OPERATIONS
// =============================================

export async function getAllDepartments() {
  const { data, error } = await db
    .from('department')
    .select('*')
    .order('department_name');
  
  if (error) throw error;
  return data;
}

export async function createDepartment(departmentName) {
  const { data, error } = await db
    .from('department')
    .insert([{ department_name: departmentName }])
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

// =============================================
// FACULTY OPERATIONS
// =============================================

export async function getAllFaculty() {
  const { data, error } = await db
    .from('faculty')
    .select(`
      *,
      department:department_id (department_id, department_name),
      office:office_id (*)
    `)
    .order('name');
  
  if (error) throw error;
  return data;
}

export async function getFacultyByDepartment(departmentId) {
  const { data, error } = await db
    .from('faculty')
    .select(`
      *,
      department:department_id (department_id, department_name),
      office:office_id (*)
    `)
    .eq('department_id', departmentId)
    .order('name');
  
  if (error) throw error;
  return data;
}

export async function createFaculty(facultyData) {
  const { data, error } = await db
    .from('faculty')
    .insert([facultyData])
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function updateFaculty(facultyId, updates) {
  const { data, error } = await db
    .from('faculty')
    .update(updates)
    .eq('faculty_id', facultyId)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function deleteFaculty(facultyId) {
  const { error } = await db
    .from('faculty')
    .delete()
    .eq('faculty_id', facultyId);
  
  if (error) throw error;
  return true;
}

export async function searchFaculty(searchTerm) {
  const { data, error } = await db
    .from('faculty')
    .select(`
      *,
      department:department_id (department_id, department_name)
    `)
    .or(`name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%,designation.ilike.%${searchTerm}%`)
    .order('name');
  
  if (error) throw error;
  return data;
}

// =============================================
// COURSE OPERATIONS
// =============================================

export async function getAllCourses() {
  const { data, error } = await db
    .from('courses')
    .select(`
      *,
      department:department_id (department_id, department_name)
    `)
    .order('course_name');
  
  if (error) throw error;
  return data;
}

export async function createCourse(courseData) {
  const { data, error } = await db
    .from('courses')
    .insert([courseData])
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function assignCourseToFaculty(facultyId, courseId, semester, academicYear) {
  const { data, error } = await db
    .from('faculty_course')
    .insert([{
      faculty_id: facultyId,
      course_id: courseId,
      semester: semester,
      academic_year: academicYear
    }])
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function getFacultyWithCourses(facultyId) {
  const { data, error } = await db
    .from('faculty')
    .select(`
      *,
      department:department_id (department_id, department_name),
      faculty_course (
        *,
        courses (*)
      )
    `)
    .eq('faculty_id', facultyId)
    .single();
  
  if (error) throw error;
  return data;
}

// =============================================
// PUBLICATION OPERATIONS
// =============================================

export async function createPublication(publicationData) {
  const { data, error } = await db
    .from('publications')
    .insert([publicationData])
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function getFacultyPublications(facultyId) {
  const { data, error } = await db
    .from('publications')
    .select('*')
    .eq('faculty_id', facultyId)
    .order('publication_year', { ascending: false });
  
  if (error) throw error;
  return data;
}

// =============================================
// SCRAPING OPERATIONS
// =============================================

export async function logScrape(recordsUpdated, status, errorMessage = null) {
  const { data, error } = await db
    .from('scrape_log')
    .insert([{
      records_updated: recordsUpdated,
      status: status,
      error_message: errorMessage
    }])
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function bulkUpsertFaculty(facultyArray) {
  const { data, error } = await db
    .from('faculty')
    .upsert(facultyArray, {
      onConflict: 'email',
      ignoreDuplicates: false
    })
    .select();
  
  if (error) throw error;
  return data;
}

// =============================================
// ADVANCED QUERIES
// =============================================

export async function getDepartmentStatistics() {
  const { data, error } = await db
    .rpc('get_department_stats');
  
  if (error) {
    // Fallback to manual query if RPC not created
    const { data: stats, error: statsError } = await db
      .from('faculty')
      .select('department_id, department(department_name)')
      .then(async (result) => {
        if (result.error) throw result.error;
        
        // Group by department
        const grouped = result.data.reduce((acc, faculty) => {
          const deptName = faculty.department?.department_name || 'Unknown';
          acc[deptName] = (acc[deptName] || 0) + 1;
          return acc;
        }, {});
        
        return Object.entries(grouped).map(([dept, count]) => ({
          department: dept,
          faculty_count: count
        }));
      });
    
    return stats;
  }
  
  return data;
}

export async function getFacultyWithAllDetails(facultyId) {
  const { data, error } = await db
    .from('faculty')
    .select(`
      *,
      department:department_id (department_id, department_name, hod_id),
      office:office_id (*),
      faculty_course (
        *,
        courses (*)
      ),
      publications (*)
    `)
    .eq('faculty_id', facultyId)
    .single();
  
  if (error) throw error;
  return data;
}