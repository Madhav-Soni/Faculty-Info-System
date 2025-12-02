import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Mail, Phone, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const FacultyDirectory = () => {
  const { data: faculty, isLoading } = useQuery({
    queryKey: ["faculty"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("faculty")
        .select(`
          *,
          departments (department_name)
        `)
        .order("name");
      
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Breadcrumbs />
        
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Faculty Directory</h1>
          <p className="text-lg text-muted-foreground">
            Browse our distinguished faculty members
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
            {faculty?.map((member) => (
              <Link key={member.faculty_id} to={`/faculty/${member.faculty_id}`}>
                <Card className="p-6 hover:shadow-lg transition-all duration-300 border-stat-card-border hover:bg-stat-card-hover cursor-pointer group h-full">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors mb-2">
                        {member.name}
                      </h3>
                      <Badge variant="secondary" className="mb-2">
                        {member.designation}
                      </Badge>
                      <p className="text-sm text-muted-foreground">{member.qualification}</p>
                    </div>

                    <div className="space-y-2 text-sm">
                      {member.departments && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Badge variant="outline">{member.departments.department_name}</Badge>
                        </div>
                      )}
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
                      {member.profile_link && (
                        <div className="flex items-center gap-2 text-primary">
                          <ExternalLink className="h-4 w-4" />
                          <span className="text-sm">View Profile</span>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}

        {!isLoading && faculty?.length === 0 && (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground text-lg">No faculty members found.</p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default FacultyDirectory;
