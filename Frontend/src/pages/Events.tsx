import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Clock, Sparkles, Users } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { apiService, imgUrl } from "../../services/api/apiService";
 

const Events = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [finishedEventDialog, setFinishedEventDialog] = useState(false);
  const [selectedFinishedEvent, setSelectedFinishedEvent] = useState<any>(null);
  
  
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await apiService.getEvents();
        setEvents(data);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchEvents();
  }, []);

  

  const isUpcoming = (eventDate: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const evDate = new Date(eventDate);
    evDate.setHours(0, 0, 0, 0);
    return evDate >= today;
  };

  const handleRegisterClick = (e: React.MouseEvent, event: any) => {
    e.stopPropagation();
    if (!isUpcoming(event.date)) {
      setSelectedFinishedEvent(event);
      setFinishedEventDialog(true);
    } else {
      navigate(`/events/${event._id || event.id}`);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20">
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-6xl">
            <h1 className="text-5xl font-bold mb-4 text-center bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Events
            </h1>
            <p className="text-xl text-muted-foreground text-center mb-16">
              Upcoming and past events organized by NITER Science Society
            </p>

            {isLoading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Card key={i} className="overflow-hidden">
                    <Skeleton className="h-48 w-full" />
                    <CardHeader>
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-full" />
                    </CardHeader>
                  </Card>
                ))}
              </div>
            ) : events && events.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map((event) => (
                  <Card
                    key={event._id || event.id}
                    className="overflow-hidden hover:shadow-lg transition-all cursor-pointer group"
                    onClick={() => navigate(`/events/${event._id || event.id}`)}
                  >
                    {(event.image || event.image_url) && (
                      <div className="h-48 overflow-hidden">
                        <img
                          src={event.image ? imgUrl(event.image) : event.image_url}
                          alt={event.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <CardHeader>
                      {(event.date) && (
                        <div className="flex items-center gap-2 mb-2">
                            <Badge variant={isUpcoming(event.date) ? "default" : "secondary"}>
                              {event.status || (isUpcoming(event.date) ? "Upcoming" : "Finished")}
                          </Badge>
                            <Button 
                              size="sm" 
                              variant={isUpcoming(event.date) ? "default" : "outline"}
                              onClick={(e) => handleRegisterClick(e, event)}
                              className="ml-auto"
                            >
                              {isUpcoming(event.date) ? "Register Now" : "View Details"}
                            </Button>
                        </div>
                      )}
                      <CardTitle className="group-hover:text-primary transition-colors">
                        {event.title}
                      </CardTitle>
                      <CardDescription className="line-clamp-2">
                        {event.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm text-muted-foreground">
                        {event.date && (
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            {new Date(event.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                          </div>
                        )}
                        {event.location && (
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            {event.location}
                          </div>
                        )}
                        {event.time && (
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            {event.time}
                          </div>
                        )}
                        {typeof event.attendees !== 'undefined' && event.attendees !== null && (
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            {event.attendees} expected attendees
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-xl text-muted-foreground">
                  No events yet. Stay tuned for upcoming events!
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Finished Event Dialog */}
        <AlertDialog open={finishedEventDialog} onOpenChange={setFinishedEventDialog}>
          <AlertDialogContent className="max-w-md">
            <AlertDialogHeader>
              <div className="flex justify-center mb-4">
                <div className="relative">
                  <Clock className="h-16 w-16 text-muted-foreground" />
                  <Sparkles className="h-6 w-6 text-accent absolute -top-1 -right-1 animate-pulse" />
                </div>
              </div>
              <AlertDialogTitle className="text-center text-2xl">
                Oops! Time's Up! ⏰
              </AlertDialogTitle>
              <AlertDialogDescription className="text-center space-y-2">
                <p className="text-base">
                  The registration period for <span className="font-semibold text-foreground">{selectedFinishedEvent?.title}</span> has ended.
                </p>
                <p className="text-sm text-muted-foreground">
                  This event took place on{" "}
                  <span className="font-medium">
                    {selectedFinishedEvent?.date && new Date(selectedFinishedEvent.date).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </span>
                </p>
                <p className="text-sm mt-4">
                  🎯 Stay tuned for our upcoming events!
                </p>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="sm:justify-center">
              <Button onClick={() => setFinishedEventDialog(false)} className="w-full sm:w-auto">
                Browse Upcoming Events
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </main>
      <Footer />
    </div>
  );
};

export default Events;
