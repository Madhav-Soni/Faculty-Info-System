import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Users, BookOpen, Building2, FileText, UserPlus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Card } from "@/components/ui/card";

const Dashboard = () => {
  const { data: facultyCount } = useQuery({
    queryKey: ["facultyCount"],
    queryFn: async () => {
      const { count } = await supabase.from("faculty").select("*", { count: "exact", head: true });
      return count || 0;
    },
  });

  const { data: coursesCount } = useQuery({
    queryKey: ["coursesCount"],
    queryFn: async () => {
      const { count } = await supabase.from("courses").select("*", { count: "exact", head: true });
      return count || 0;
    },
  });

  const { data: departmentsCount } = useQuery({
    queryKey: ["departmentsCount"],
    queryFn: async () => {
      const { count } = await supabase.from("departments").select("*", { count: "exact", head: true });
      return count || 0;
    },
  });

  const { data: publicationsCount } = useQuery({
    queryKey: ["publicationsCount"],
    queryFn: async () => {
      const { count } = await supabase.from("publications").select("*", { count: "exact", head: true });
      return count || 0;
    },
  });

  const stats = [
    {
      title: "Total Faculty",
      value: facultyCount,
      icon: Users,
      link: "/faculty",
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Courses Offered",
      value: coursesCount,
      icon: BookOpen,
      link: "/courses",
      color: "text-secondary",
      bgColor: "bg-secondary/10",
    },
    {
      title: "Departments",
      value: departmentsCount,
      icon: Building2,
      link: "/departments",
      color: "text-accent-foreground",
      bgColor: "bg-accent",
    },
    {
      title: "Publications",
      value: publicationsCount,
      icon: FileText,
      link: "/publications",
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Add Faculty",
      value: "+",
      icon: UserPlus,
      link: "/add-faculty",
      color: "text-secondary",
      bgColor: "bg-secondary/10",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Breadcrumbs />
        
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Faculty Information System</h1>
          <p className="text-lg text-muted-foreground">
            Comprehensive management system for faculty, courses, and publications
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Link key={stat.title} to={stat.link}>
                <Card className="p-6 hover:shadow-lg transition-all duration-300 border-stat-card-border hover:bg-stat-card-hover cursor-pointer group">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">{stat.title}</p>
                      <p className="text-3xl font-bold text-foreground group-hover:text-primary transition-colors">
                        {stat.value}
                      </p>
                    </div>
                    <div className={`p-4 rounded-full ${stat.bgColor}`}>
                      <Icon className={`h-8 w-8 ${stat.color}`} />
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6 border-stat-card-border">
            <h2 className="text-xl font-semibold mb-4 text-foreground">Quick Actions</h2>
            <div className="space-y-3">
              <Link
                to="/add-faculty"
                className="block p-4 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
              >
                Add New Faculty Member
              </Link>
              <Link
                to="/faculty"
                className="block p-4 rounded-lg bg-secondary text-secondary-foreground hover:opacity-90 transition-opacity"
              >
                View Faculty Directory
              </Link>
            </div>
          </Card>

          <Card className="p-6 border-stat-card-border">
            <h2 className="text-xl font-semibold mb-4 text-foreground">System Overview</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                Welcome to the Faculty Information Management System. This platform helps manage faculty
                information, course assignments, department organization, and academic publications.
              </p>
              <p className="text-sm">
                Navigate through different sections using the menu above or click on any statistics card to explore.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
