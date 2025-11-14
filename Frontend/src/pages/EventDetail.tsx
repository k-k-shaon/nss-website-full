import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, MapPin, ArrowLeft, ExternalLink, UserPlus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { apiService, imgUrl } from "../../services/api/apiService";

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const data = await apiService.getEvent(id);
        setEvent(data);
      } catch (error) {
        console.error("Error fetching event:", error);
      } finally {
        setIsLoading(false);
      }
    };
    if (id) fetchEvent();
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

  if (!event) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-20">
          <div className="container mx-auto max-w-4xl px-4 py-16 text-center">
            <h1 className="text-3xl font-bold mb-4">Event Not Found</h1>
            <Button onClick={() => navigate("/events")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Events
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const images = event.images as string[] || [];
  const isUpcoming = event.date && new Date(event.date) >= new Date();
  const hasRegistration = event.registration_link && isUpcoming;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20">
        <div className="container mx-auto max-w-4xl px-4 py-16">
          <Button
            variant="ghost"
            onClick={() => navigate("/events")}
            className="mb-8"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Events
          </Button>

          {event.image && (
            <div className="rounded-lg overflow-hidden mb-8">
              <img
                src={imgUrl(event.image)}
                alt={event.title}
                className="w-full h-96 object-cover"
              />
            </div>
          )}

          <div className="mb-6">
            <Badge variant={isUpcoming ? "default" : "secondary"} className="mb-4">
              {isUpcoming ? "Upcoming" : "Past Event"}
            </Badge>
            <h1 className="text-4xl font-bold mb-4">{event.title}</h1>
            <div className="flex flex-wrap gap-4 text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                {event.date && new Date(event.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
              {event.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  {event.location}
                </div>
              )}
            </div>
          </div>

          <div className="prose prose-invert max-w-none mb-8">
            <p className="text-lg leading-relaxed">
              {event.detailed_description || event.description}
            </p>
          </div>

          {/* Registration Section */}
          {hasRegistration && (
            <Card className="mb-8 border-primary/50 bg-primary/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserPlus className="h-5 w-5" />
                  Register for This Event
                </CardTitle>
                <CardDescription>
                  Don't miss out! Register now to secure your spot at this exciting event.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  size="lg" 
                  className="w-full sm:w-auto"
                  onClick={() => window.open(event.registration_link, '_blank')}
                >
                  Register Now
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Button>
                <p className="text-xs text-muted-foreground mt-3">
                  You'll be redirected to the registration form
                </p>
              </CardContent>
            </Card>
          )}

          {images.length > 0 && (
            <div className="mt-12">
              <h2 className="text-2xl font-bold mb-6">Event Gallery</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {images.map((image, index) => (
                  <div key={index} className="rounded-lg overflow-hidden">
                    <img
                      src={image}
                      alt={`${event.title} - Image ${index + 1}`}
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

export default EventDetail;
