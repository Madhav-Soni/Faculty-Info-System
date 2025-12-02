import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Mail, Phone } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const DepartmentDetail = () => {
  const { id } = useParams();

  const { data: department } = useQuery({
    queryKey: ["department", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("departments")
        .select("*")
        .eq("department_id", id)
        .single();
      
      if (error) throw error;
      return data;
    },
  });

  const { data: faculty } = useQuery({
    queryKey: ["departmentFaculty", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("faculty")
        .select("*")
        .eq("department_id", id)
        .order("name");
      
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Breadcrumbs />
        
        <Link to="/departments">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Departments
          </Button>
        </Link>

        <Card className="p-8 mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {department?.department_name}
          </h1>
          <p className="text-muted-foreground">Department Code: {department?.department_id}</p>
        </Card>

        <div>
          <h2 className="text-2xl font-semibold text-foreground mb-6">Faculty Members</h2>
          
          {faculty && faculty.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {faculty.map((member) => (
                <Link key={member.faculty_id} to={`/faculty/${member.faculty_id}`}>
                  <Card className="p-6 hover:shadow-lg transition-all duration-300 border-stat-card-border hover:bg-stat-card-hover cursor-pointer group h-full">
                    <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors mb-2">
                      {member.name}
                    </h3>
                    <Badge variant="secondary" className="mb-3">
                      {member.designation}
                    </Badge>
                    <p className="text-sm text-muted-foreground mb-4">{member.qualification}</p>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Mail className="h-4 w-4" />
                        <span className="truncate">{member.email}</span>
                      </div>
                      {member.phone && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Phone className="h-4 w-4" />
                          <span>{member.phone}</span>
                        </div>
                      )}
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <Card className="p-12 text-center">
              <p className="text-muted-foreground text-lg">No faculty members in this department yet.</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default DepartmentDetail;
