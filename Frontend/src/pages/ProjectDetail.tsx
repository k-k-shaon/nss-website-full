import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Users } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { apiService, imgUrl } from "../../services/api/apiService";

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const data = await apiService.getProject(id);
        setProject(data);
      } catch (error) {
        console.error("Error fetching project:", error);
      } finally {
        setIsLoading(false);
      }
    };
    if (id) fetchProject();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-20">
          <div className="container mx-auto max-w-4xl px-4 py-16">
            <Skeleton className="h-96 w-full mb-8" />
            <Skeleton className="h-12 w-3/4 mb-4" />
            <Skeleton className="h-32 w-full" />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-20">
          <div className="container mx-auto max-w-4xl px-4 py-16 text-center">
            <h1 className="text-3xl font-bold mb-4">Project Not Found</h1>
            <Button onClick={() => navigate("/projects")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Projects
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const images = project.images as string[] || [];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20">
        <div className="container mx-auto max-w-4xl px-4 py-16">
          <Button
            variant="ghost"
            onClick={() => navigate("/projects")}
            className="mb-8"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Projects
          </Button>

          {project.image && (
            <div className="rounded-lg overflow-hidden mb-8">
              <img
                src={imgUrl(project.image)}
                alt={project.title}
                className="w-full h-96 object-cover"
              />
            </div>
          )}

          <div className="mb-6">
            {project.category && (
              <Badge className="mb-4">{project.category}</Badge>
            )}
            <h1 className="text-4xl font-bold mb-4">{project.title}</h1>
            {project.team_members && project.team_members.length > 0 && (
              <div className="flex items-center gap-2 text-muted-foreground mb-4">
                <Users className="h-5 w-5" />
                <span>{project.team_members.join(", ")}</span>
              </div>
            )}
          </div>

          <div className="prose prose-invert max-w-none mb-8">
            <p className="text-lg leading-relaxed">
              {project.detailed_description || project.description}
            </p>
          </div>

          {images.length > 0 && (
            <div className="mt-12">
              <h2 className="text-2xl font-bold mb-6">Project Gallery</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {images.map((image, index) => (
                  <div key={index} className="rounded-lg overflow-hidden">
                    <img
                      src={image}
                      alt={`${project.title} - Image ${index + 1}`}
                      className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProjectDetail;
