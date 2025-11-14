import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { apiService } from "../../../services/api/apiService";

export const ProjectForm = ({ onCreated }: { onCreated?: () => void }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const [stars, setStars] = useState<number | "">("");
  const [team, setTeam] = useState("");
  const [technologies, setTechnologies] = useState("");
  const [teamMembers, setTeamMembers] = useState("");
  const [content, setContent] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [demoUrl, setDemoUrl] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) {
      toast.error("Title and description are required");
      return;
    }
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
  if (category) formData.append("category", category);
  if (status) formData.append("status", status);
  if (stars !== "") formData.append("stars", String(stars));
  if (team) formData.append("team", team);
  if (technologies) formData.append("technologies", technologies);
  if (teamMembers) formData.append("team_members", teamMembers);
  if (content) formData.append("content", content);
  if (githubUrl) formData.append("github_url", githubUrl);
  if (demoUrl) formData.append("demo_url", demoUrl);
  if (image) formData.append("image", image);
      await apiService.createProject(formData);
      toast.success("Project created");
      setTitle("");
      setDescription("");
  setCategory("");
  setStatus("");
  setStars("");
  setTeam("");
  setTechnologies("");
  setTeamMembers("");
  setContent("");
  setGithubUrl("");
  setDemoUrl("");
  setImage(null);
      onCreated && onCreated();
    } catch (err: any) {
      toast.error(err?.message || "Failed to create project");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-sm font-medium">Title</label>
        <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Project title" />
      </div>
      <div>
        <label className="text-sm font-medium">Description</label>
        <Textarea rows={4} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Brief description" />
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Category</label>
          <Input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="e.g., Web, AI" />
        </div>
        <div>
          <label className="text-sm font-medium">Status</label>
          <Input value={status} onChange={(e) => setStatus(e.target.value)} placeholder="In Progress, Completed" />
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Technologies (comma-separated)</label>
          <Input value={technologies} onChange={(e) => setTechnologies(e.target.value)} placeholder="React, Node, MongoDB" />
        </div>
        <div>
          <label className="text-sm font-medium">Stars</label>
          <Input type="number" min={0} value={stars} onChange={(e) => setStars(e.target.value === '' ? '' : Number(e.target.value))} placeholder="e.g., 42" />
        </div>
      </div>
      <div>
        <label className="text-sm font-medium">Team</label>
        <Input value={team} onChange={(e) => setTeam(e.target.value)} placeholder="e.g., Electronics Club" />
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">GitHub URL (optional)</label>
          <Input value={githubUrl} onChange={(e) => setGithubUrl(e.target.value)} placeholder="https://github.com/..." />
        </div>
        <div>
          <label className="text-sm font-medium">Demo URL (optional)</label>
          <Input value={demoUrl} onChange={(e) => setDemoUrl(e.target.value)} placeholder="https://demo.example.com" />
        </div>
      </div>
      <div>
        <label className="text-sm font-medium">Team Members (comma-separated)</label>
        <Input value={teamMembers} onChange={(e) => setTeamMembers(e.target.value)} placeholder="John, Jane" />
      </div>
      <div>
        <label className="text-sm font-medium">Details (optional)</label>
        <Textarea rows={6} value={content} onChange={(e) => setContent(e.target.value)} placeholder="More details" />
      </div>
      <div>
        <label className="text-sm font-medium">Image (optional)</label>
        <Input type="file" accept="image/*" onChange={(e) => setImage(e.target.files?.[0] || null)} />
      </div>
      <Button type="submit" disabled={submitting} className="w-full">
        {submitting ? "Saving..." : "Create Project"}
      </Button>
    </form>
  );
};
