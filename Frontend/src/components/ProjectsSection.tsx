import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Github, Star, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { apiService, imgUrl } from '../../services/api/apiService';

const ProjectsSection = () => {
  const navigate = useNavigate();
  const [featuredProjects, setFeaturedProjects] = useState<any[]>([]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-600 text-white';
      case 'In Progress':
        return 'bg-blue-600 text-white';
      case 'Beta Testing':
        return 'bg-yellow-500 text-white';
      case 'Research Phase':
        return 'bg-gray-500 text-white';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  useEffect(() => {
    const run = async () => {
      try {
        const data = await apiService.getProjects();
        setFeaturedProjects(data.slice(0, 4));
      } catch (e) {
        console.error('Failed to load projects', e);
      }
    };
    run();
  }, []);

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-4">
            Student Projects & Research
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Innovative solutions and cutting-edge research projects developed by our talented student community
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {featuredProjects.map((project) => (
            <Card key={project._id || project.id} className="science-card group">
              <CardHeader>
                <div className="flex items-start justify-between mb-3">
                  <div className="text-4xl mb-2">
                    {project.image ? (
                      <img src={imgUrl(project.image)} alt={project.title} className="h-10 w-10 object-cover rounded" />
                    ) : (
                      <span role="img" aria-label="project">🌐</span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    {project.status && (
                      <Badge className={getStatusColor(project.status)}>
                        {project.status}
                      </Badge>
                    )}
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Star className="h-4 w-4 mr-1 text-yellow-500" />
                      {project.stars || 0}
                    </div>
                  </div>
                </div>
                
                <CardTitle className="text-xl group-hover:text-accent transition-colors mb-2">
                  {project.title}
                </CardTitle>
                
                <div className="flex items-center text-sm text-muted-foreground mb-2">
                  <Users className="h-4 w-4 mr-2" />
                  {project.team || (Array.isArray(project.team_members) ? project.team_members.join(', ') : '')}
                </div>
                
                {project.category && (
                  <Badge variant="outline" className="w-fit">
                    {project.category}
                  </Badge>
                )}
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-2">
                  {(project.technologies || []).map((tech: string) => (
                    <Badge 
                      key={tech} 
                      variant="secondary" 
                      className="text-xs bg-accent/10 text-accent hover:bg-accent hover:text-accent-foreground"
                    >
                      {tech}
                    </Badge>
                  ))}
                </div>
              </CardContent>

              <CardFooter className="flex gap-2">
                <Button 
                  variant="default" 
                  className="flex-1 btn-primary"
                  size="sm"
                  onClick={() => project.demo_url ? window.open(project.demo_url, '_blank') : navigate(`/projects/${project._id || project.id}`)}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View Project
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="hover:bg-accent hover:text-accent-foreground"
                  onClick={() => project.github_url && window.open(project.github_url, '_blank')}
                >
                  <Github className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link to="/projects">
            <Button 
              size="lg" 
              className="btn-primary"
            >
              Browse All Projects
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
