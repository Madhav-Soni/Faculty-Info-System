-- Create Department table
CREATE TABLE public.departments (
  department_id TEXT PRIMARY KEY,
  department_name TEXT NOT NULL,
  hod_id UUID REFERENCES auth.users(id)
);

-- Create Faculty table
CREATE TABLE public.faculty (
  faculty_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  designation TEXT NOT NULL,
  qualification TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  profile_link TEXT,
  department_id TEXT REFERENCES public.departments(department_id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create Courses table
CREATE TABLE public.courses (
  course_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_name TEXT NOT NULL,
  course_code TEXT NOT NULL UNIQUE,
  credits INTEGER NOT NULL,
  department_id TEXT REFERENCES public.departments(department_id)
);

-- Create Faculty_Course junction table
CREATE TABLE public.faculty_course (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  faculty_id UUID REFERENCES public.faculty(faculty_id) ON DELETE CASCADE,
  course_id UUID REFERENCES public.courses(course_id) ON DELETE CASCADE,
  semester TEXT NOT NULL,
  academic_year TEXT NOT NULL
);

-- Create Publications table
CREATE TABLE public.publications (
  publication_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  faculty_id UUID REFERENCES public.faculty(faculty_id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  journal TEXT NOT NULL,
  publication_year INTEGER NOT NULL,
  link TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create Scrape_Log table
CREATE TABLE public.scrape_log (
  log_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT now(),
  records_updated INTEGER DEFAULT 0,
  status TEXT NOT NULL,
  error_message TEXT
);

-- Enable Row Level Security
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faculty ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faculty_course ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.publications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scrape_log ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (since this is a public faculty directory)
CREATE POLICY "Allow public read access to departments" ON public.departments FOR SELECT USING (true);
CREATE POLICY "Allow public read access to faculty" ON public.faculty FOR SELECT USING (true);
CREATE POLICY "Allow public read access to courses" ON public.courses FOR SELECT USING (true);
CREATE POLICY "Allow public read access to faculty_course" ON public.faculty_course FOR SELECT USING (true);
CREATE POLICY "Allow public read access to publications" ON public.publications FOR SELECT USING (true);
CREATE POLICY "Allow public read access to scrape_log" ON public.scrape_log FOR SELECT USING (true);

-- Insert default departments
INSERT INTO public.departments (department_id, department_name) VALUES
  ('AIML', 'Artificial Intelligence and Machine Learning'),
  ('AIDS', 'Artificial Intelligence and Data Science'),
  ('CSE', 'Computer Science and Engineering'),
  ('ISE', 'Information Science Engineering'),
  ('CIVIL', 'Civil Engineering'),
  ('MECH', 'Mechanical Engineering'),
  ('CHEM', 'Chemical Engineering');

-- Create indexes for better query performance
CREATE INDEX idx_faculty_department ON public.faculty(department_id);
CREATE INDEX idx_courses_department ON public.courses(department_id);
CREATE INDEX idx_publications_faculty ON public.publications(faculty_id);
CREATE INDEX idx_faculty_course_faculty ON public.faculty_course(faculty_id);
CREATE INDEX idx_faculty_course_course ON public.faculty_course(course_id);