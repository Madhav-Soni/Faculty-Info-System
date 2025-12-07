// src/test/testDatabase.js
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase credentials!');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

console.log('✅ Supabase client initialized');
console.log('📍 URL:', supabaseUrl);
console.log('');

async function runTests() {
  console.log('🧪 Starting Database Tests...');
  console.log('═'.repeat(50));
  console.log('');

  try {
    // Test 1: Get all departments
    console.log('Test 1: Fetching departments...');
    const { data: departments, error: deptError } = await supabase
      .from('department')
      .select('*')
      .order('department_name');
    
    if (deptError) throw deptError;
    console.log(`✅ Found ${departments.length} departments`);
    console.log('');

    // Test 2: Create a test faculty member
    console.log('Test 2: Creating test faculty...');
    const testFaculty = {
      name: 'Dr. Test Professor',
      designation: 'Associate Professor',
      qualification: 'Ph.D. Computer Science',
      email: `test.prof.${Date.now()}@college.edu`,
      phone: '1234567890',
      profile_link: 'https://example.com/profile',
      department_id: departments[0]?.department_id
    };
    
    const { data: newFaculty, error: facError } = await supabase
      .from('faculty')
      .insert([testFaculty])
      .select()
      .single();
    
    if (facError) throw facError;
    console.log('✅ Faculty created:', newFaculty.name);
    console.log('');

    // Test 3: Get all faculty
    console.log('Test 3: Fetching all faculty...');
    const { data: allFaculty, error: allFacError } = await supabase
      .from('faculty')
      .select(`
        *,
        department:department_id (department_name)
      `)
      .order('name');
    
    if (allFacError) throw allFacError;
    console.log(`✅ Found ${allFaculty.length} faculty members`);
    console.log('');

    // Test 4: Create a course
    console.log('Test 4: Creating test course...');
    const testCourse = {
      course_name: 'Advanced Database Systems',
      course_code: `CS${Math.floor(Math.random() * 1000)}`,
      credits: 4,
      department_id: departments[0]?.department_id
    };
    
    const { data: newCourse, error: courseError } = await supabase
      .from('courses')
      .insert([testCourse])
      .select()
      .single();
    
    if (courseError) throw courseError;
    console.log('✅ Course created:', newCourse.course_code);
    console.log('');

    // Test 5: Assign course to faculty
    console.log('Test 5: Assigning course to faculty...');
    const { data: assignment, error: assignError } = await supabase
      .from('faculty_course')
      .insert([{
        faculty_id: newFaculty.faculty_id,
        course_id: newCourse.course_id,
        semester: 'Fall 2024',
        academic_year: '2024-25'
      }])
      .select()
      .single();
    
    if (assignError) throw assignError;
    console.log('✅ Course assigned successfully');
    console.log('');

    // Test 6: Create a publication
    console.log('Test 6: Creating test publication...');
    const testPublication = {
      faculty_id: newFaculty.faculty_id,
      title: 'Advances in Database Query Optimization',
      journal: 'Journal of Database Research',
      publication_year: 2024,
      link: 'https://example.com/paper'
    };
    
    const { data: newPublication, error: pubError } = await supabase
      .from('publications')
      .insert([testPublication])
      .select()
      .single();
    
    if (pubError) throw pubError;
    console.log('✅ Publication created');
    console.log('');

    // Test 7: Log a scrape operation
    console.log('Test 7: Logging scrape operation...');
    const { data: scrapeLog, error: logError } = await supabase
      .from('scrape_log')
      .insert([{
        records_updated: 5,
        status: 'success',
        error_message: null
      }])
      .select()
      .single();
    
    if (logError) throw logError;
    console.log('✅ Scrape logged');
    console.log('');

    // Summary
    console.log('═'.repeat(50));
    console.log('🎉 All tests passed successfully!');
    console.log('═'.repeat(50));
    console.log('');
    console.log('Database Summary:');
    console.log(`  Total Faculty: ${allFaculty.length}`);
    console.log(`  Total Departments: ${departments.length}`);
    console.log(`  Test Data Created: ✅`);
    console.log('');

  } catch (error) {
    console.error('');
    console.error('❌ Test failed:', error.message);
    console.error('');
    process.exit(1);
  }
}

// Run tests
runTests();