import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { apiService } from "../../../services/api/apiService";

export const AlumniForm = ({ onCreated }: { onCreated?: () => void }) => {
  const [fullname, setFullname] = useState("");
  const [batch, setBatch] = useState("");
  const [department, setDepartment] = useState("");
  const [currentPosition, setCurrentPosition] = useState("");
  const [company, setCompany] = useState("");
  const [bio, setBio] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [facebook, setFacebook] = useState("");
  const [avatar, setAvatar] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullname || !batch || !department) {
      toast.error("Name, batch, and department are required");
      return;
    }
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("fullname", fullname);
      formData.append("batch", batch);
      formData.append("department", department);
      if (currentPosition) formData.append("current_position", currentPosition);
      if (company) formData.append("company", company);
      if (bio) formData.append("bio", bio);
      if (email) formData.append("email", email);
      if (phone) formData.append("phone", phone);
      if (linkedin) formData.append("linkedin", linkedin);
      if (facebook) formData.append("facebook", facebook);
      if (avatar) formData.append("avatar", avatar);
      await apiService.createAlumni(formData);
      toast.success("Alumni added");
      setFullname("");
      setBatch("");
      setDepartment("");
      setCurrentPosition("");
      setCompany("");
      setBio("");
      setEmail("");
      setPhone("");
      setLinkedin("");
      setFacebook("");
      setAvatar(null);
      onCreated && onCreated();
    } catch (err: any) {
      toast.error(err?.message || "Failed to add alumni");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-sm font-medium">Full Name</label>
        <Input value={fullname} onChange={(e) => setFullname(e.target.value)} placeholder="John Doe" />
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Batch</label>
          <Input value={batch} onChange={(e) => setBatch(e.target.value)} placeholder="2020" />
        </div>
        <div>
          <label className="text-sm font-medium">Department</label>
          <Input value={department} onChange={(e) => setDepartment(e.target.value)} placeholder="CSE" />
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Current Position</label>
          <Input value={currentPosition} onChange={(e) => setCurrentPosition(e.target.value)} placeholder="Software Engineer" />
        </div>
        <div>
          <label className="text-sm font-medium">Company</label>
          <Input value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Tech Corp" />
        </div>
      </div>
      <div>
        <label className="text-sm font-medium">Bio</label>
        <Textarea rows={3} value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Brief bio" />
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Email</label>
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="john@example.com" />
        </div>
        <div>
          <label className="text-sm font-medium">Phone</label>
          <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+880 1234567890" />
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">LinkedIn URL</label>
          <Input value={linkedin} onChange={(e) => setLinkedin(e.target.value)} placeholder="https://linkedin.com/in/..." />
        </div>
        <div>
          <label className="text-sm font-medium">Facebook URL</label>
          <Input value={facebook} onChange={(e) => setFacebook(e.target.value)} placeholder="https://facebook.com/..." />
        </div>
      </div>
      <div>
        <label className="text-sm font-medium">Avatar (optional)</label>
        <Input type="file" accept="image/*" onChange={(e) => setAvatar(e.target.files?.[0] || null)} />
      </div>
      <Button type="submit" disabled={submitting} className="w-full">
        {submitting ? "Saving..." : "Add Alumni"}
      </Button>
    </form>
  );
};
