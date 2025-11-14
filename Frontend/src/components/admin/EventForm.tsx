import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { apiService } from "../../../services/api/apiService";

export const EventForm = ({ onCreated }: { onCreated?: () => void }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [attendees, setAttendees] = useState<number | "">("");
  const [type, setType] = useState("");
  const [status, setStatus] = useState("");
  const [registrationLink, setRegistrationLink] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !date) {
      toast.error("Title and date are required");
      return;
    }
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("date", date);
  if (time) formData.append("time", time);
  if (location) formData.append("location", location);
  if (attendees !== "") formData.append("attendees", String(attendees));
  if (type) formData.append("type", type);
  if (status) formData.append("status", status);
      formData.append("registration_link", registrationLink);
  if (imageUrl) formData.append("image_url", imageUrl);
      if (image) formData.append("image", image);
      await apiService.createEvent(formData);
      toast.success("Event created");
      setTitle("");
      setDescription("");
      setDate("");
  setTime("");
  setLocation("");
  setAttendees("");
  setType("");
  setStatus("");
      setRegistrationLink("");
  setImageUrl("");
      setImage(null);
      onCreated && onCreated();
    } catch (err: any) {
      toast.error(err?.message || "Failed to create event");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-sm font-medium">Title</label>
        <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Event title" />
      </div>
      <div>
        <label className="text-sm font-medium">Date</label>
        <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Time</label>
          <Input value={time} onChange={(e) => setTime(e.target.value)} placeholder="9:00 AM - 5:00 PM" />
        </div>
        <div>
          <label className="text-sm font-medium">Location</label>
          <Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="NITER Main Auditorium" />
        </div>
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        <div>
          <label className="text-sm font-medium">Attendees (expected)</label>
          <Input type="number" min={0} value={attendees} onChange={(e) => setAttendees(e.target.value === '' ? '' : Number(e.target.value))} placeholder="250" />
        </div>
        <div>
          <label className="text-sm font-medium">Type</label>
          <Input value={type} onChange={(e) => setType(e.target.value)} placeholder="Conference, Workshop, Seminar" />
        </div>
        <div>
          <label className="text-sm font-medium">Status</label>
          <Input value={status} onChange={(e) => setStatus(e.target.value)} placeholder="Open Registration" />
        </div>
      </div>
      <div>
        <label className="text-sm font-medium">Description</label>
        <Textarea rows={4} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Brief description" />
      </div>
      <div>
        <label className="text-sm font-medium">Registration Link (optional)</label>
        <Input 
          type="url" 
          value={registrationLink} 
          onChange={(e) => setRegistrationLink(e.target.value)} 
          placeholder="https://forms.google.com/..." 
        />
        <p className="text-xs text-muted-foreground mt-1">Google Form, Typeform, or any registration URL</p>
      </div>
      <div>
        <label className="text-sm font-medium">Image URL (optional)</label>
        <Input 
          type="url" 
          value={imageUrl} 
          onChange={(e) => setImageUrl(e.target.value)} 
          placeholder="https://images.unsplash.com/..." 
        />
      </div>
      <div>
        <label className="text-sm font-medium">Image (optional)</label>
        <Input type="file" accept="image/*" onChange={(e) => setImage(e.target.files?.[0] || null)} />
        <p className="text-xs text-muted-foreground mt-1">If Image URL is provided, it will be used instead of the uploaded image.</p>
      </div>
      <Button type="submit" disabled={submitting} className="w-full">
        {submitting ? "Saving..." : "Create Event"}
      </Button>
    </form>
  );
};
