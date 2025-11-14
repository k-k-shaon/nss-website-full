import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { apiService } from "../../../services/api/apiService";

export const BlogForm = ({ onCreated }: { onCreated?: () => void }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) {
      toast.error("Title and content are required");
      return;
    }
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
  // category removed
      if (image) formData.append("image", image);
      await apiService.createBlog(formData);
      toast.success("Blog created");
      setTitle("");
      setContent("");
  // category reset removed
      setImage(null);
      onCreated && onCreated();
    } catch (err: any) {
      toast.error(err?.message || "Failed to create blog");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-sm font-medium">Title</label>
        <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Blog title" />
      </div>
      {/* Category removed */}
      <div>
        <label className="text-sm font-medium">Content</label>
        <Textarea rows={10} value={content} onChange={(e) => setContent(e.target.value)} placeholder="Blog content" />
      </div>
      <div>
        <label className="text-sm font-medium">Image (optional)</label>
        <Input type="file" accept="image/*" onChange={(e) => setImage(e.target.files?.[0] || null)} />
      </div>
      <Button type="submit" disabled={submitting} className="w-full">
        {submitting ? "Saving..." : "Create Blog"}
      </Button>
    </form>
  );
};
