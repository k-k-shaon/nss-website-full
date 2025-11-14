import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Search, Briefcase, GraduationCap, Mail, Phone, Linkedin, Facebook, ExternalLink, Filter } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { apiService, imgUrl } from "../../services/api/apiService";

const Alumni = () => {
  const [selectedBatch, setSelectedBatch] = useState<string | null>(null);
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAlumni, setSelectedAlumni] = useState<any>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [alumni, setAlumni] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const departments = ["CSE", "EEE", "CE", "ME", "IPE", "TE", "ARCH"];

  useEffect(() => {
    const fetchAlumni = async () => {
      try {
        const data = await apiService.getAlumni();
        setAlumni(data);
      } catch (error) {
        console.error("Error fetching alumni:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAlumni();
  }, []);

  // Get unique batches from alumni data
  const availableBatches = Array.from(new Set(alumni?.map((a: any) => a.batch) || [])).sort((a, b) => b.localeCompare(a));

  // Mock alumni works (replace with API call when backend is ready)
  const alumniWorks = selectedAlumni?.id ? [] : [];

  const handleAlumniClick = (alumnus: any) => {
    setSelectedAlumni(alumnus);
    setDialogOpen(true);
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20 pb-12 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Our Alumni
            </h1>
            <p className="text-xl text-muted-foreground">
              Connect with our distinguished alumni network
            </p>
          </div>

          {/* Filters and Search */}
          <div className="flex flex-col md:flex-row gap-4 mb-8 max-w-2xl mx-auto">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full md:w-48">
                  <Filter className="h-4 w-4 mr-2" />
                  {selectedBatch ? `Batch ${selectedBatch}` : "Filter by Batch"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setSelectedBatch(null)}>
                  All Batches
                </DropdownMenuItem>
                {availableBatches.map((batch) => (
                  <DropdownMenuItem key={batch} onClick={() => setSelectedBatch(batch)}>
                    Batch {batch}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full md:w-48">
                  <Filter className="h-4 w-4 mr-2" />
                  {selectedDepartment || "Filter by Dept"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setSelectedDepartment(null)}>
                  All Departments
                </DropdownMenuItem>
                {departments.map((dept) => (
                  <DropdownMenuItem key={dept} onClick={() => setSelectedDepartment(dept)}>
                    {dept}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="text"
                placeholder="Search by name, position, company..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Alumni Grid */}
          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading alumni...</p>
            </div>
          ) : alumni && alumni.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {alumni.map((alumnus) => (
                <div
                  key={alumnus.id}
                  onClick={() => handleAlumniClick(alumnus)}
                  className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-all duration-300 cursor-pointer hover:-translate-y-1"
                >
                  <div className="flex flex-col items-center text-center">
                    <Avatar className="w-24 h-24 mb-4">
                      <AvatarImage src={imgUrl(alumnus.avatar_url)} alt={alumnus.fullname} />
                      <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                        {getInitials(alumnus.fullname)}
                      </AvatarFallback>
                    </Avatar>
                    <h3 className="font-bold text-lg mb-1">{alumnus.fullname}</h3>
                    <Badge variant="secondary" className="mb-2">
                        NITER {alumnus.batch}
                    </Badge>
                    <p className="text-sm text-muted-foreground mb-1">
                      {alumnus.department}
                    </p>
                    {alumnus.current_position && (
                      <p className="text-sm font-medium text-primary mt-2">
                        {alumnus.current_position}
                      </p>
                    )}
                    {alumnus.company && (
                      <p className="text-sm text-muted-foreground">{alumnus.company}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No alumni found for this batch.</p>
            </div>
          )}
        </div>
      </main>

      {/* Alumni Detail Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          {selectedAlumni && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-4 mb-4">
                  <Avatar className="w-20 h-20">
                    <AvatarImage
                      src={imgUrl(selectedAlumni.avatar_url)}
                      alt={selectedAlumni.fullname}
                    />
                    <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                      {getInitials(selectedAlumni.fullname)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <DialogTitle className="text-2xl">{selectedAlumni.fullname}</DialogTitle>
                    <Badge variant="secondary" className="mt-1">
                      NITER {selectedAlumni.batch}
                    </Badge>
                  </div>
                </div>
              </DialogHeader>

              <div className="space-y-4">
                {selectedAlumni.department && (
                  <div>
                    <h4 className="font-semibold mb-2">Academic Information</h4>
                    <p className="text-sm text-muted-foreground">
                      Department: {selectedAlumni.department}
                    </p>
                  </div>
                )}

                {selectedAlumni.current_position && (
                  <div className="flex items-start gap-2">
                    <Briefcase className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium">{selectedAlumni.current_position}</p>
                      {selectedAlumni.company && (
                        <p className="text-sm text-muted-foreground">{selectedAlumni.company}</p>
                      )}
                    </div>
                  </div>
                )}

                {selectedAlumni.bio && (
                  <div>
                    <h4 className="font-semibold mb-2">About</h4>
                    <p className="text-sm text-muted-foreground">{selectedAlumni.bio}</p>
                  </div>
                )}

                <div className="space-y-2">
                  {selectedAlumni.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <a
                        href={`mailto:${selectedAlumni.email}`}
                        className="text-sm text-primary hover:underline"
                      >
                        {selectedAlumni.email}
                      </a>
                    </div>
                  )}

                  {selectedAlumni.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <a
                        href={`tel:${selectedAlumni.phone}`}
                        className="text-sm text-primary hover:underline"
                      >
                        {selectedAlumni.phone}
                      </a>
                    </div>
                  )}

                  <div className="flex gap-3 pt-2">
                    {selectedAlumni.linkedin && (
                      <a
                        href={selectedAlumni.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:text-primary/80"
                      >
                        <Linkedin className="w-5 h-5" />
                      </a>
                    )}
                    {selectedAlumni.facebook && (
                      <a
                        href={selectedAlumni.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:text-primary/80"
                      >
                        <Facebook className="w-5 h-5" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default Alumni;
