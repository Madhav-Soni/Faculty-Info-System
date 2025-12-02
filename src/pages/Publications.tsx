import { useQuery } from "@tanstack/react-query";
import { Calendar, ExternalLink, FileText } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

const Publications = () => {
  const { data: publications, isLoading } = useQuery({
    queryKey: ["publicationsAll"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("publications")
        .select(`
          *,
          faculty (name)
        `)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Breadcrumbs />
        
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Publications</h1>
          <p className="text-lg text-muted-foreground">
            Recent academic publications from our faculty
          </p>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Card key={i} className="p-6 animate-pulse">
                <div className="h-4 bg-muted rounded w-3/4 mb-4"></div>
                <div className="h-3 bg-muted rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-muted rounded w-2/3"></div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {publications?.map((pub) => (
              <Card
                key={pub.publication_id}
                className="p-6 hover:shadow-lg transition-all duration-300 border-stat-card-border hover:bg-stat-card-hover"
              >
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="p-3 rounded-full bg-primary/10">
                      <FileText className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                  
                  <div className="flex-1 space-y-3">
                    <div>
                      <h3 className="text-xl font-semibold text-foreground mb-2">
                        {pub.title}
                      </h3>
                      <p className="text-muted-foreground">{pub.journal}</p>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-4 text-sm">
                      {pub.faculty && (
                        <Badge variant="secondary">
                          Author: {pub.faculty.name}
                        </Badge>
                      )}
                      
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>Published: {pub.publication_year}</span>
                      </div>
                      
                      {pub.created_at && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>Added: {format(new Date(pub.created_at), "MMM dd, yyyy")}</span>
                        </div>
                      )}
                      
                      {pub.link && (
                        <a
                          href={pub.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-primary hover:underline"
                        >
                          View Publication
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {!isLoading && publications?.length === 0 && (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground text-lg">No publications found.</p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Publications;
