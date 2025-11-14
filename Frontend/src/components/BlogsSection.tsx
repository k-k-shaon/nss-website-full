import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Calendar, Eye, ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { apiService, imgUrl } from '../../services/api/apiService';

const BlogsSection = () => {
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const data = await apiService.getBlogs();
        // Show only the first 3 blogs
        setBlogs(data.slice(0, 3));
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-4">
            Latest Blog Posts
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Stay updated with the latest news, articles, and insights from NITER Science Society
          </p>
        </div>

  {/* Blogs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {isLoading ? (
            Array.from({length: 3}).map((_, i) => (
              <Card key={i}>
                <div className="aspect-video bg-muted animate-pulse rounded-t-lg" />
                <CardHeader>
                  <div className="h-6 bg-muted animate-pulse rounded w-3/4" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="h-4 bg-muted animate-pulse rounded" />
                    <div className="h-4 bg-muted animate-pulse rounded w-5/6" />
                  </div>
                </CardContent>
              </Card>
            ))
          ) : blogs.length > 0 ? (
            blogs.map((blog: any) => (
            <Card key={blog._id || blog.id} className="group overflow-hidden hover:shadow-lg transition-all">
              {blog.image && (
                <div className="aspect-video overflow-hidden">
                  <img 
                    src={imgUrl(blog.image)} 
                    alt={blog.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}

              <CardHeader>
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex-1">
                    {blog.date && (
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3 mr-1" />
                        {new Date(blog.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                      </div>
                    )}
                  </div>
                  {/* Category removed from blog cards */}
                </div>
                <CardTitle className="text-xl group-hover:text-primary transition-colors line-clamp-2">
                  <button onClick={() => navigate(`/blog/${blog._id || blog.id}`)} className="text-left w-full">
                    {blog.title}
                  </button>
                </CardTitle>
              </CardHeader>

              <CardContent>
                <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">
                  {blog.description || blog.content}
                </p>
                {blog.views !== undefined && (
                  <div className="flex items-center gap-2 mt-4 text-sm text-muted-foreground">
                    <Eye className="h-4 w-4" />
                    <span>{blog.views} views</span>
                  </div>
                )}
                <div className="mt-6">
                  <Button variant="outline" className="w-full group/btn" onClick={() => navigate(`/blog/${blog._id || blog.id}`)}>
                    View Details
                    <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-0.5 transition-transform" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
          ) : (
            <div className="col-span-3 text-center py-12">
              <p className="text-muted-foreground">No blog posts available at the moment. Check back soon!</p>
            </div>
          )}
        </div>

        {/* View All Blogs */}
        <div className="text-center">
          <Link to="/blog">
            <Button 
              variant="outline" 
              size="lg"
              className="hover:bg-primary hover:text-primary-foreground"
            >
              Read More Articles
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BlogsSection;
