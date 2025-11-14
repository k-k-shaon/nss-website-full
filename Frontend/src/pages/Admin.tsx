import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiService } from "../../services/api/apiService";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Loader2, LogOut } from "lucide-react";
import { EventForm } from "@/components/admin/EventForm";
import { BlogForm } from "@/components/admin/BlogForm";
import { AlumniForm } from "@/components/admin/AlumniForm";
import { ProjectForm } from "@/components/admin/ProjectForm";

// Overview Component
const Overview = () => {
  const [stats, setStats] = useState({ events: 0, blogs: 0, alumni: 0, messages: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [events, blogs, alumni, messages] = await Promise.all([
        apiService.getEvents().catch(() => []),
        apiService.getBlogs().catch(() => []),
        apiService.getAlumni().catch(() => []),
        apiService.getMessages().catch(() => []),
      ]);
      setStats({
        events: events.length,
        blogs: blogs.length,
        alumni: alumni.length,
        messages: messages.length,
      });
    } catch (err) {
      toast.error("Failed to load stats");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardHeader>
              <div className="h-4 bg-gray-200 rounded animate-pulse w-24"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded animate-pulse w-16"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium text-muted-foreground">Total Events</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-primary">{stats.events}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium text-muted-foreground">Blog Posts</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-primary">{stats.blogs}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium text-muted-foreground">Alumni</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-primary">{stats.alumni}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium text-muted-foreground">Messages</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-primary">{stats.messages}</p>
        </CardContent>
      </Card>
    </div>
  );
};

// Contact Messages Component
const ContactMessages = () => {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    try {
      const data = await apiService.getMessages();
      setMessages(data);
    } catch (err) {
      toast.error("Failed to load messages");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this message?")) return;
    try {
      await apiService.deleteMessage(id);
      toast.success("Message deleted");
      setMessages(messages.filter(msg => (msg._id || msg.id) !== id));
    } catch (err: any) {
      toast.error(err?.message || "Failed to delete message");
    }
  };

  if (loading) return <div className="text-center py-8"><Loader2 className="h-6 w-6 animate-spin mx-auto" /></div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contact Submissions</CardTitle>
        <CardDescription>{messages.length} message(s) received</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {messages.length === 0 ? (
          <p className="text-muted-foreground">No messages yet</p>
        ) : (
          messages.map((msg) => (
            <div key={msg._id || msg.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-semibold">{msg.fullName || msg.name}</p>
                  <p className="text-sm text-muted-foreground">{msg.email}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">
                    {new Date(msg.createdAt || msg.created_at).toLocaleDateString()}
                  </span>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(msg._id || msg.id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
              <p className="text-sm">{msg.message}</p>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};

// Content Management Component
const ContentManagement = () => {
  const [activeTab, setActiveTab] = useState("events");
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = () => setRefreshKey(prev => prev + 1);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Content Management</CardTitle>
        <CardDescription>Create, update, and delete site content</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="blogs">Blogs</TabsTrigger>
            <TabsTrigger value="alumni">Alumni</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="carousel">Gallery</TabsTrigger>
          </TabsList>
          
          <TabsContent value="events" className="mt-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-4">Create New Event</h3>
                <EventForm onCreated={() => { toast.success("Event created!"); handleRefresh(); }} />
              </div>
              <div>
                <h3 className="font-semibold mb-4">Existing Events</h3>
                <EventsList key={refreshKey} onDeleted={handleRefresh} />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="blogs" className="mt-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-4">Create New Blog</h3>
                <BlogForm onCreated={() => { toast.success("Blog created!"); handleRefresh(); }} />
              </div>
              <div>
                <h3 className="font-semibold mb-4">Existing Blogs</h3>
                <BlogsList key={refreshKey} onDeleted={handleRefresh} />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="alumni" className="mt-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-4">Create New Alumni</h3>
                <AlumniForm onCreated={() => { toast.success("Alumni created!"); handleRefresh(); }} />
              </div>
              <div>
                <h3 className="font-semibold mb-4">Existing Alumni</h3>
                <AlumniList key={refreshKey} onDeleted={handleRefresh} />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="projects" className="mt-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-4">Create New Project</h3>
                <ProjectForm onCreated={() => { toast.success("Project created!"); handleRefresh(); }} />
              </div>
              <div>
                <h3 className="font-semibold mb-4">Existing Projects</h3>
                <ProjectsList key={refreshKey} onDeleted={handleRefresh} />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="carousel" className="mt-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-4">Upload New Image</h3>
                <CarouselUpload onUploaded={handleRefresh} />
              </div>
              <div>
                <h3 className="font-semibold mb-4">Gallery Images</h3>
                <CarouselList key={refreshKey} onDeleted={handleRefresh} />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

// Carousel Upload Component
const CarouselUpload = ({ onUploaded }: { onUploaded?: () => void }) => {
  const [file, setFile] = useState<File | null>(null);
  const [caption, setCaption] = useState("");
  const [title, setTitle] = useState("");
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", file);
  if (title) formData.append("title", title);
  if (caption) formData.append("caption", caption);
      await apiService.createCarousel(formData);
      toast.success("Image uploaded to gallery");
      setFile(null);
  setTitle("");
      setCaption("");
      onUploaded && onUploaded();
    } catch (err: any) {
      toast.error(err?.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleUpload} className="space-y-4">
      <div>
        <label className="text-sm font-medium">Upload Gallery Image</label>
        <Input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
      </div>
      <div>
        <label className="text-sm font-medium">Title (optional)</label>
        <Input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Short title" />
      </div>
      <div>
        <label className="text-sm font-medium">Caption (optional)</label>
        <Input type="text" value={caption} onChange={(e) => setCaption(e.target.value)} placeholder="Add a short caption" />
      </div>
      <Button type="submit" disabled={!file || uploading} className="w-full">
        {uploading ? "Uploading..." : "Upload to Gallery"}
      </Button>
    </form>
  );
};

// Events List Component
const EventsList = ({ onDeleted }: { onDeleted?: () => void }) => {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editEvent, setEditEvent] = useState<any>(null);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const data = await apiService.getEvents();
      setEvents(data);
    } catch (err) {
      toast.error("Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this event?")) return;
    try {
      await apiService.deleteEvent(id);
      toast.success("Event deleted");
      setEvents(events.filter(e => (e._id || e.id) !== id));
      onDeleted && onDeleted();
    } catch (err: any) {
      toast.error(err?.message || "Delete failed");
    }
  };

  const handleUpdate = async (updatedEvent: any) => {
    try {
      await apiService.updateEvent(editEvent._id || editEvent.id, updatedEvent);
      toast.success("Event updated");
      loadEvents();
      setEditEvent(null);
      onDeleted && onDeleted();
    } catch (err: any) {
      toast.error(err?.message || "Update failed");
    }
  };

  if (loading) return <div className="text-center py-4"><Loader2 className="h-5 w-5 animate-spin mx-auto" /></div>;

  return (
    <>
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {events.length === 0 ? (
          <p className="text-sm text-muted-foreground">No events yet</p>
        ) : (
          events.map((event) => (
            <div key={event._id || event.id} className="border rounded-lg p-3 flex justify-between items-start gap-2">
              <div className="flex-1">
                <p className="font-medium text-sm">{event.title}</p>
                <p className="text-xs text-muted-foreground">{new Date(event.date || event.event_date).toLocaleDateString()}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setEditEvent(event)}>
                  Edit
                </Button>
                <Button variant="destructive" size="sm" onClick={() => handleDelete(event._id || event.id)}>
                  Delete
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
      {editEvent && <EditEventDialog event={editEvent} onClose={() => setEditEvent(null)} onUpdate={handleUpdate} />}
    </>
  );
};

// Blogs List Component
const BlogsList = ({ onDeleted }: { onDeleted?: () => void }) => {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editBlog, setEditBlog] = useState<any>(null);

  useEffect(() => {
    loadBlogs();
  }, []);

  const loadBlogs = async () => {
    try {
      const data = await apiService.getBlogs();
      setBlogs(data);
    } catch (err) {
      toast.error("Failed to load blogs");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this blog?")) return;
    try {
      await apiService.deleteBlog(id);
      toast.success("Blog deleted");
      setBlogs(blogs.filter(b => (b._id || b.id) !== id));
      onDeleted && onDeleted();
    } catch (err: any) {
      toast.error(err?.message || "Delete failed");
    }
  };

  const handleUpdate = async (updatedBlog: any) => {
    try {
      await apiService.updateBlog(editBlog._id || editBlog.id, updatedBlog);
      toast.success("Blog updated");
      loadBlogs();
      setEditBlog(null);
      onDeleted && onDeleted();
    } catch (err: any) {
      toast.error(err?.message || "Update failed");
    }
  };

  if (loading) return <div className="text-center py-4"><Loader2 className="h-5 w-5 animate-spin mx-auto" /></div>;

  return (
    <>
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {blogs.length === 0 ? (
          <p className="text-sm text-muted-foreground">No blogs yet</p>
        ) : (
          blogs.map((blog) => (
            <div key={blog._id || blog.id} className="border rounded-lg p-3 flex justify-between items-start gap-2">
              <div className="flex-1">
                <p className="font-medium text-sm">{blog.title}</p>
                <p className="text-xs text-muted-foreground">{blog.author}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setEditBlog(blog)}>
                  Edit
                </Button>
                <Button variant="destructive" size="sm" onClick={() => handleDelete(blog._id || blog.id)}>
                  Delete
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
      {editBlog && <EditBlogDialog blog={editBlog} onClose={() => setEditBlog(null)} onUpdate={handleUpdate} />}
    </>
  );
};

// Alumni List Component
const AlumniList = ({ onDeleted }: { onDeleted?: () => void }) => {
  const [alumni, setAlumni] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editAlumni, setEditAlumni] = useState<any>(null);

  useEffect(() => {
    loadAlumni();
  }, []);

  const loadAlumni = async () => {
    try {
      const data = await apiService.getAlumni();
      setAlumni(data);
    } catch (err) {
      toast.error("Failed to load alumni");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this alumni?")) return;
    try {
      await apiService.deleteAlumni(id);
      toast.success("Alumni deleted");
      setAlumni(alumni.filter(a => (a._id || a.id) !== id));
      onDeleted && onDeleted();
    } catch (err: any) {
      toast.error(err?.message || "Delete failed");
    }
  };

  const handleUpdate = async (updatedAlumni: any) => {
    try {
      await apiService.updateAlumni(editAlumni._id || editAlumni.id, updatedAlumni);
      toast.success("Alumni updated");
      loadAlumni();
      setEditAlumni(null);
      onDeleted && onDeleted();
    } catch (err: any) {
      toast.error(err?.message || "Update failed");
    }
  };

  if (loading) return <div className="text-center py-4"><Loader2 className="h-5 w-5 animate-spin mx-auto" /></div>;

  return (
    <>
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {alumni.length === 0 ? (
          <p className="text-sm text-muted-foreground">No alumni yet</p>
        ) : (
          alumni.map((alumnus) => (
            <div key={alumnus._id || alumnus.id} className="border rounded-lg p-3 flex justify-between items-start gap-2">
              <div className="flex-1">
                <p className="font-medium text-sm">{alumnus.fullname}</p>
                <p className="text-xs text-muted-foreground">
                  {alumnus.batch} - {alumnus.department}
                </p>
                {alumnus.current_position && (
                  <p className="text-xs text-muted-foreground">{alumnus.current_position}</p>
                )}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setEditAlumni(alumnus)}>
                  Edit
                </Button>
                <Button variant="destructive" size="sm" onClick={() => handleDelete(alumnus._id || alumnus.id)}>
                  Delete
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
      {editAlumni && <EditAlumniDialog alumni={editAlumni} onClose={() => setEditAlumni(null)} onUpdate={handleUpdate} />}
    </>
  );
};

// Carousel List Component
const CarouselList = ({ onDeleted }: { onDeleted?: () => void }) => {
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);

  useEffect(() => {
    loadImages();
  }, []);

  const loadImages = async () => {
    try {
      const data = await apiService.getCarousel();
      setImages(data);
    } catch (err) {
      toast.error("Failed to load images");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (imageId: string) => {
    if (!confirm("Delete this image?")) return;
    try {
      await apiService.deleteCarousel(imageId);
      toast.success("Image deleted");
      setImages(images.filter(img => img._id !== imageId));
      onDeleted && onDeleted();
    } catch (err: any) {
      toast.error(err?.message || "Delete failed");
    }
  };

  const handleSaveMeta = async (imageId: string, title: string, caption: string) => {
    try {
      setSavingId(imageId);
      await apiService.updateCarousel(imageId, { title, caption });
      toast.success("Saved");
      await loadImages();
    } catch (err: any) {
      toast.error(err?.message || "Update failed");
    } finally {
      setSavingId(null);
    }
  };

  const move = async (imageId: string, direction: 'up' | 'down') => {
    const idx = images.findIndex(i => i._id === imageId);
    if (idx === -1) return;
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= images.length) return;
    const reordered = [...images];
    const [removed] = reordered.splice(idx, 1);
    reordered.splice(targetIdx, 0, removed);
    try {
      await apiService.reorderCarousel(reordered.map(i => i._id));
      await loadImages();
    } catch (err: any) {
      toast.error(err?.message || 'Reorder failed');
    }
  };
  return (
    <div className="grid grid-cols-2 gap-3 max-h-96 overflow-y-auto">
      {images.length === 0 ? (
        <p className="text-sm text-muted-foreground col-span-2">No images yet</p>
      ) : (
        images.map((img) => (
          <div key={img._id} className="border rounded-lg p-2 space-y-2">
            <img
              src={apiService.imgUrl(img.image)}
              alt="Gallery"
              className="w-full h-24 object-cover rounded"
            />
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => move(img._id, 'up')}>
                ↑
              </Button>
              <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => move(img._id, 'down')}>
                ↓
              </Button>
            </div>
            <div className="space-y-2">
              <Input
                value={img.title || ''}
                onChange={(e) => setImages((prev) => prev.map((it) => (it._id === img._id ? { ...it, title: e.target.value } : it)))}
                placeholder="Title"
              />
              <div className="flex items-center gap-2">
                <Input
                  value={img.caption || ''}
                  onChange={(e) => setImages((prev) => prev.map((it) => (it._id === img._id ? { ...it, caption: e.target.value } : it)))}
                  placeholder="Caption"
                />
                <Button size="sm" onClick={() => handleSaveMeta(img._id, img.title || '', img.caption || '')} disabled={savingId === img._id}>
                  {savingId === img._id ? 'Saving...' : 'Save'}
                </Button>
              </div>
            </div>
            <Button
              variant="destructive"
              size="sm"
              className="w-full text-xs"
              onClick={() => handleDelete(img._id)}
            >
              Delete
            </Button>
          </div>
        ))
      )}
    </div>
  );
};

// Projects List Component
const ProjectsList = ({ onDeleted }: { onDeleted?: () => void }) => {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editProject, setEditProject] = useState<any>(null);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const data = await apiService.getProjects();
      setProjects(data);
    } catch (err) {
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this project?')) return;
    try {
      await apiService.deleteProject(id);
      toast.success('Project deleted');
      setProjects(projects.filter(p => (p._id || p.id) !== id));
      onDeleted && onDeleted();
    } catch (err: any) {
      toast.error(err?.message || 'Delete failed');
    }
  };

  const handleUpdate = async (formData: FormData) => {
    try {
      await apiService.updateProject(editProject._id || editProject.id, formData);
      toast.success('Project updated');
      loadProjects();
      setEditProject(null);
      onDeleted && onDeleted();
    } catch (err: any) {
      toast.error(err?.message || 'Update failed');
    }
  };

  if (loading) return <div className="text-center py-4"><Loader2 className="h-5 w-5 animate-spin mx-auto" /></div>;

  return (
    <>
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {projects.length === 0 ? (
          <p className="text-sm text-muted-foreground">No projects yet</p>
        ) : (
          projects.map(project => (
            <div key={project._id || project.id} className="border rounded-lg p-3 flex justify-between items-start gap-2">
              <div className="flex-1">
                <p className="font-medium text-sm">{project.title}</p>
                <p className="text-xs text-muted-foreground">
                  {(project.status || 'Status N/A')} • {(project.stars || 0)} ⭐
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setEditProject(project)}>Edit</Button>
                <Button variant="destructive" size="sm" onClick={() => handleDelete(project._id || project.id)}>Delete</Button>
              </div>
            </div>
          ))
        )}
      </div>
      {editProject && <EditProjectDialog project={editProject} onClose={() => setEditProject(null)} onUpdate={handleUpdate} />}
    </>
  );
};

// Edit Project Dialog
const EditProjectDialog = ({ project, onClose, onUpdate }: { project: any; onClose: () => void; onUpdate: (data: FormData) => void }) => {
  const [formData, setFormData] = useState({
    title: project.title || '',
    description: project.description || '',
    category: project.category || '',
    status: project.status || '',
    stars: project.stars || 0,
    team: project.team || '',
    technologies: (project.technologies || []).join(', '),
    team_members: (project.team_members || []).join(', '),
    github_url: project.github_url || '',
    demo_url: project.demo_url || '',
    content: project.content || ''
  });
  const [file, setFile] = useState<File | null>(null);
  const [updating, setUpdating] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);
    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('category', formData.category);
      data.append('status', formData.status);
      data.append('stars', String(formData.stars));
      data.append('team', formData.team);
      data.append('technologies', formData.technologies);
      data.append('team_members', formData.team_members);
      data.append('github_url', formData.github_url);
      data.append('demo_url', formData.demo_url);
      data.append('content', formData.content);
      if (file) data.append('image', file);
      await onUpdate(data);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Project</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Title</label>
              <Input value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} required />
            </div>
            <div>
              <label className="text-sm font-medium">Category</label>
              <Input value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} />
            </div>
            <div>
              <label className="text-sm font-medium">Status</label>
              <Input value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})} />
            </div>
            <div>
              <label className="text-sm font-medium">Stars</label>
              <Input type="number" min={0} value={formData.stars} onChange={(e) => setFormData({...formData, stars: parseInt(e.target.value || '0', 10)})} />
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-medium">Team</label>
              <Input value={formData.team} onChange={(e) => setFormData({...formData, team: e.target.value})} />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">Description</label>
            <Textarea rows={3} value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Technologies (comma-separated)</label>
              <Input value={formData.technologies} onChange={(e) => setFormData({...formData, technologies: e.target.value})} />
            </div>
            <div>
              <label className="text-sm font-medium">Team Members (comma-separated)</label>
              <Input value={formData.team_members} onChange={(e) => setFormData({...formData, team_members: e.target.value})} />
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">GitHub URL</label>
              <Input value={formData.github_url} onChange={(e) => setFormData({...formData, github_url: e.target.value})} />
            </div>
            <div>
              <label className="text-sm font-medium">Demo URL</label>
              <Input value={formData.demo_url} onChange={(e) => setFormData({...formData, demo_url: e.target.value})} />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">Details (optional)</label>
            <Textarea rows={6} value={formData.content} onChange={(e) => setFormData({...formData, content: e.target.value})} />
          </div>
          <div>
            <label className="text-sm font-medium">Change Image (optional)</label>
            <Input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
          </div>
          <div className="flex gap-2">
            <Button type="submit" disabled={updating} className="flex-1">{updating ? 'Updating...' : 'Update'}</Button>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// Edit Event Dialog
const EditEventDialog = ({ event, onClose, onUpdate }: { event: any; onClose: () => void; onUpdate: (data: any) => void }) => {
  const [formData, setFormData] = useState({
    title: event.title || "",
    date: event.date ? new Date(event.date).toISOString().split('T')[0] : "",
    time: event.time || "",
    location: event.location || "",
    attendees: typeof event.attendees === 'number' ? event.attendees : '',
    type: event.type || "",
    status: event.status || "",
    description: event.description || "",
    registration_link: event.registration_link || "",
    image_url: event.image_url || ""
  });
  const [file, setFile] = useState<File | null>(null);
  const [updating, setUpdating] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);
    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("date", formData.date);
  data.append("description", formData.description);
  data.append("registration_link", formData.registration_link);
  data.append("time", formData.time);
  data.append("location", formData.location);
  if (formData.attendees !== '') data.append("attendees", String(formData.attendees));
  data.append("type", formData.type);
  data.append("status", formData.status);
  data.append("image_url", formData.image_url);
      if (file) data.append("image", file);
      await onUpdate(data);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Event</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium">Title</label>
            <Input value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} required />
          </div>
          <div>
            <label className="text-sm font-medium">Date</label>
            <Input type="date" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} required />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Time</label>
              <Input value={formData.time} onChange={(e) => setFormData({...formData, time: e.target.value})} placeholder="9:00 AM - 5:00 PM" />
            </div>
            <div>
              <label className="text-sm font-medium">Location</label>
              <Input value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} placeholder="NITER Main Auditorium" />
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium">Attendees</label>
              <Input type="number" min={0} value={formData.attendees} onChange={(e) => setFormData({...formData, attendees: e.target.value === '' ? '' : Number(e.target.value)})} />
            </div>
            <div>
              <label className="text-sm font-medium">Type</label>
              <Input value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})} />
            </div>
            <div>
              <label className="text-sm font-medium">Status</label>
              <Input value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})} />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">Description</label>
            <Textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} rows={4} />
          </div>
          <div>
            <label className="text-sm font-medium">Registration Link (optional)</label>
            <Input 
              type="url" 
              value={formData.registration_link} 
              onChange={(e) => setFormData({...formData, registration_link: e.target.value})} 
              placeholder="https://forms.google.com/..." 
            />
          </div>
          <div>
            <label className="text-sm font-medium">Image URL (optional)</label>
            <Input 
              type="url" 
              value={formData.image_url} 
              onChange={(e) => setFormData({...formData, image_url: e.target.value})} 
              placeholder="https://images.unsplash.com/..." 
            />
          </div>
          <div>
            <label className="text-sm font-medium">Change Image (optional)</label>
            <Input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
          </div>
          <div className="flex gap-2">
            <Button type="submit" disabled={updating} className="flex-1">{updating ? "Updating..." : "Update"}</Button>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// Edit Blog Dialog
const EditBlogDialog = ({ blog, onClose, onUpdate }: { blog: any; onClose: () => void; onUpdate: (data: any) => void }) => {
  const [formData, setFormData] = useState({
    title: blog.title || "",
    author: blog.author || "",
    content: blog.content || ""
  });
  const [file, setFile] = useState<File | null>(null);
  const [updating, setUpdating] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);
    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("author", formData.author);
      data.append("content", formData.content);
      if (file) data.append("image", file);
      await onUpdate(data);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Blog</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium">Title</label>
            <Input value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} required />
          </div>
          <div>
            <label className="text-sm font-medium">Author</label>
            <Input value={formData.author} onChange={(e) => setFormData({...formData, author: e.target.value})} required />
          </div>
          <div>
            <label className="text-sm font-medium">Content</label>
            <Textarea value={formData.content} onChange={(e) => setFormData({...formData, content: e.target.value})} rows={8} required />
          </div>
          <div>
            <label className="text-sm font-medium">Change Image (optional)</label>
            <Input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
          </div>
          <div className="flex gap-2">
            <Button type="submit" disabled={updating} className="flex-1">{updating ? "Updating..." : "Update"}</Button>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// Edit Alumni Dialog
const EditAlumniDialog = ({ alumni, onClose, onUpdate }: { alumni: any; onClose: () => void; onUpdate: (data: any) => void }) => {
  const [formData, setFormData] = useState({
    fullname: alumni.fullname || "",
    batch: alumni.batch || "",
    department: alumni.department || "",
    current_position: alumni.current_position || "",
    company: alumni.company || "",
    bio: alumni.bio || "",
    email: alumni.email || "",
    phone: alumni.phone || "",
    linkedin: alumni.linkedin || "",
    facebook: alumni.facebook || ""
  });
  const [file, setFile] = useState<File | null>(null);
  const [updating, setUpdating] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);
    try {
      const data = new FormData();
      data.append("fullname", formData.fullname);
      data.append("batch", formData.batch);
      data.append("department", formData.department);
      data.append("current_position", formData.current_position);
      data.append("company", formData.company);
      data.append("bio", formData.bio);
      data.append("email", formData.email);
      data.append("phone", formData.phone);
      data.append("linkedin", formData.linkedin);
      data.append("facebook", formData.facebook);
      if (file) data.append("avatar", file);
      await onUpdate(data);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Alumni</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Full Name</label>
              <Input value={formData.fullname} onChange={(e) => setFormData({...formData, fullname: e.target.value})} required />
            </div>
            <div>
              <label className="text-sm font-medium">Batch</label>
              <Input value={formData.batch} onChange={(e) => setFormData({...formData, batch: e.target.value})} />
            </div>
            <div>
              <label className="text-sm font-medium">Department</label>
              <Input value={formData.department} onChange={(e) => setFormData({...formData, department: e.target.value})} />
            </div>
            <div>
              <label className="text-sm font-medium">Current Position</label>
              <Input value={formData.current_position} onChange={(e) => setFormData({...formData, current_position: e.target.value})} />
            </div>
            <div>
              <label className="text-sm font-medium">Company</label>
              <Input value={formData.company} onChange={(e) => setFormData({...formData, company: e.target.value})} />
            </div>
            <div>
              <label className="text-sm font-medium">Email</label>
              <Input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
            </div>
            <div>
              <label className="text-sm font-medium">Phone</label>
              <Input value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
            </div>
            <div>
              <label className="text-sm font-medium">LinkedIn URL</label>
              <Input value={formData.linkedin} onChange={(e) => setFormData({...formData, linkedin: e.target.value})} />
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-medium">Facebook URL</label>
              <Input value={formData.facebook} onChange={(e) => setFormData({...formData, facebook: e.target.value})} />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">Bio</label>
            <Textarea value={formData.bio} onChange={(e) => setFormData({...formData, bio: e.target.value})} rows={4} />
          </div>
          <div>
            <label className="text-sm font-medium">Change Avatar (optional)</label>
            <Input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
          </div>
          <div className="flex gap-2">
            <Button type="submit" disabled={updating} className="flex-1">{updating ? "Updating..." : "Update"}</Button>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const Admin = () => {
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const userData = await apiService.checkAuth();
      if (userData && userData.isAdmin) {
        setUser(userData);
        setIsAdmin(true);
      }
    } catch (error) {
      // Not authenticated or not admin
    }
    setLoading(false);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);

    try {
        const userData = await apiService.login(email, password);
        setUser(userData);
        setIsAdmin(true);
        toast.success("Welcome back, Admin!");
    } catch (error: any) {
      toast.error(error.message || "Login failed");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
      await apiService.logout();
    setUser(null);
    setIsAdmin(false);
    toast.success("Logged out successfully");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-20 pb-12 px-4">
          <div className="container mx-auto max-w-md">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl text-center">Admin Login</CardTitle>
                <CardDescription className="text-center">
                  Sign in to access the admin dashboard
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Email</label>
                    <Input
                      type="email"
                      placeholder="admin@niter.edu"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Password</label>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoggingIn}>
                    {isLoggingIn ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      "Sign In"
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20 pb-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold">Admin Dashboard</h1>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="memberships">Memberships</TabsTrigger>
              <TabsTrigger value="contacts">Contacts</TabsTrigger>
              <TabsTrigger value="content">Manage Content</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <Overview />
            </TabsContent>

            <TabsContent value="memberships">
              <Card>
                <CardHeader>
                  <CardTitle>Membership Applications</CardTitle>
                  <CardDescription>Membership management coming soon</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    This feature will be implemented to manage membership applications
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="contacts">
              <ContactMessages />
            </TabsContent>

            <TabsContent value="content">
              <ContentManagement />
            </TabsContent>

            
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Admin;
