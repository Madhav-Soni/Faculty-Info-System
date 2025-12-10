import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { GraduationCap } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import Navigation from "@/components/Navigation";
import Dashboard from "./pages/Dashboard";
import FacultyDirectory from "./pages/FacultyDirectory";
import FacultyDetail from "./pages/FacultyDetail";
import Departments from "./pages/Departments";
import DepartmentDetail from "./pages/DepartmentDetail";
import Courses from "./pages/Courses";
import Publications from "./pages/Publications";
import AddFaculty from "./pages/AddFaculty";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="light" storageKey="faculty-system-theme">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
            {/* Header */}
            <header className="bg-blue-600 dark:bg-blue-800 text-white shadow-lg sticky top-0 z-50 transition-colors">
              <div className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <GraduationCap className="w-8 h-8" />
                    <h1 className="text-2xl font-bold">Faculty Info System</h1>
                  </div>
                  
                  {/* Theme Toggle Button */}
                  <ThemeToggle />
                </div>
              </div>
            </header>

            {/* Navigation */}
            <Navigation />

            {/* Main Content */}
            <main className="container mx-auto px-4 py-8">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/faculty" element={<FacultyDirectory />} />
                <Route path="/faculty/:id" element={<FacultyDetail />} />
                <Route path="/departments" element={<Departments />} />
                <Route path="/departments/:id" element={<DepartmentDetail />} />
                <Route path="/courses" element={<Courses />} />
                <Route path="/publications" element={<Publications />} />
                <Route path="/add-faculty" element={<AddFaculty />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;