import { useQuery } from "@tanstack/react-query";
import { BookOpen, Award } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const Courses = () => {
  const { data: courses, isLoading } = useQuery({
    queryKey: ["courses"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("courses")
        .select(`
          *,
          departments (department_name)
        `)
        .order("course_name");
      
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Breadcrumbs />
        
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Courses</h1>
          <p className="text-lg text-muted-foreground">
            Browse our comprehensive course catalog
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="p-6 animate-pulse">
                <div className="h-4 bg-muted rounded w-3/4 mb-4"></div>
                <div className="h-3 bg-muted rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-muted rounded w-2/3"></div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses?.map((course) => (
              <Card
                key={course.course_id}
                className="p-6 hover:shadow-lg transition-all duration-300 border-stat-card-border hover:bg-stat-card-hover group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 rounded-full bg-secondary/10">
                    <BookOpen className="h-6 w-6 text-secondary" />
                  </div>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Award className="h-3 w-3" />
                    {course.credits} Credits
                  </Badge>
                </div>
                
                <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors mb-2">
                  {course.course_name}
                </h3>
                
                <p className="text-sm text-muted-foreground mb-3">
                  Course Code: <span className="font-mono">{course.course_code}</span>
                </p>
                
                {course.departments && (
                  <Badge variant="secondary">{course.departments.department_name}</Badge>
                )}
              </Card>
            ))}
          </div>
        )}

        {!isLoading && courses?.length === 0 && (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground text-lg">No courses found.</p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Courses;
