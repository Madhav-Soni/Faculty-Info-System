import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Mail, Phone, ExternalLink, BookOpen, Calendar, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const FacultyDetail = () => {
  const { id } = useParams();

  const { data: faculty, isLoading } = useQuery({
    queryKey: ["faculty", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("faculty")
        .select(`
          *,
          departments (department_name)
        `)
        .eq("faculty_id", id)
        .single();
      
      if (error) throw error;
      return data;
    },
  });

  const { data: publications } = useQuery({
    queryKey: ["publications", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("publications")
        .select("*")
        .eq("faculty_id", id)
        .order("publication_year", { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <Card className="p-8 animate-pulse">
            <div className="h-8 bg-muted rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-muted rounded w-1/2 mb-2"></div>
            <div className="h-4 bg-muted rounded w-2/3"></div>
          </Card>
        </div>
      </div>
    );
  }

  if (!faculty) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <Card className="p-12 text-center">
            <p className="text-muted-foreground text-lg">Faculty member not found.</p>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Breadcrumbs />
        
        <Link to="/faculty">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Faculty Directory
          </Button>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 p-8">
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-3">{faculty.name}</h1>
                <div className="flex gap-2 mb-4">
                  <Badge variant="secondary" className="text-base">
                    {faculty.designation}
                  </Badge>
                  {faculty.departments && (
                    <Badge variant="outline" className="text-base">
                      {faculty.departments.department_name}
                    </Badge>
                  )}
                </div>
                <p className="text-lg text-muted-foreground">{faculty.qualification}</p>
              </div>

              <div className="space-y-3 pt-4 border-t">
                <h2 className="text-xl font-semibold text-foreground mb-4">Contact Information</h2>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Mail className="h-5 w-5 text-primary" />
                  <a href={`mailto:${faculty.email}`} className="hover:text-primary transition-colors">
                    {faculty.email}
                  </a>
                </div>
                {faculty.phone && (
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Phone className="h-5 w-5 text-primary" />
                    <a href={`tel:${faculty.phone}`} className="hover:text-primary transition-colors">
                      {faculty.phone}
                    </a>
                  </div>
                )}
                {faculty.profile_link && (
                  <div className="flex items-center gap-3">
                    <ExternalLink className="h-5 w-5 text-primary" />
                    <a
                      href={faculty.profile_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      View External Profile
                    </a>
                  </div>
                )}
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              Publications
            </h2>
            <div className="space-y-4">
              {publications && publications.length > 0 ? (
                publications.map((pub) => (
                  <div key={pub.publication_id} className="p-4 rounded-lg bg-muted/50 space-y-2">
                    <h3 className="font-semibold text-foreground">{pub.title}</h3>
                    <p className="text-sm text-muted-foreground">{pub.journal}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>{pub.publication_year}</span>
                    </div>
                    {pub.link && (
                      <a
                        href={pub.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline inline-flex items-center gap-1"
                      >
                        View Publication
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-sm">No publications yet.</p>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default FacultyDetail;
