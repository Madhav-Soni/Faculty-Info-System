import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Building2, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Card } from "@/components/ui/card";

const Departments = () => {
  const { data: departments, isLoading } = useQuery({
    queryKey: ["departments"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("departments")
        .select("*")
        .order("department_name");
      
      if (error) throw error;
      return data;
    },
  });

  const { data: facultyCounts } = useQuery({
    queryKey: ["facultyCounts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("faculty")
        .select("department_id");
      
      if (error) throw error;
      
      const counts: Record<string, number> = {};
      data.forEach((f) => {
        if (f.department_id) {
          counts[f.department_id] = (counts[f.department_id] || 0) + 1;
        }
      });
      
      return counts;
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Breadcrumbs />
        
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Departments</h1>
          <p className="text-lg text-muted-foreground">
            Explore our academic departments and their faculty
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(7)].map((_, i) => (
              <Card key={i} className="p-6 animate-pulse">
                <div className="h-4 bg-muted rounded w-3/4 mb-4"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {departments?.map((dept) => (
              <Link key={dept.department_id} to={`/departments/${dept.department_id}`}>
                <Card className="p-6 hover:shadow-lg transition-all duration-300 border-stat-card-border hover:bg-stat-card-hover cursor-pointer group h-full">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 rounded-full bg-primary/10">
                      <Building2 className="h-6 w-6 text-primary" />
                    </div>
                    {facultyCounts && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Users className="h-4 w-4" />
                        <span className="text-sm font-medium">
                          {facultyCounts[dept.department_id] || 0} Faculty
                        </span>
                      </div>
                    )}
                  </div>
                  <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                    {dept.department_name}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-2">
                    Code: {dept.department_id}
                  </p>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Departments;
