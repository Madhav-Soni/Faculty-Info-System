import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
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
          <Navigation />
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
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
