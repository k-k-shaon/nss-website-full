import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Users, ArrowRight, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { apiService } from '../../services/api/apiService';

interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  time?: string;
  location?: string;
  attendees?: number;
  type?: string;
  status?: string;
  image?: string;
  image_url?: string;
  registration_link?: string;
}

const EventsSection = () => {
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const events = await apiService.getEvents();
        // Get the first 3 upcoming events
        setUpcomingEvents(events.slice(0, 3));
      } catch (err) {
        console.error('Failed to fetch events:', err);
        setError('Failed to load events');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Open Registration": return "bg-success text-success-foreground";
      case "Limited Seats": return "bg-destructive text-destructive-foreground";
      case "Free Entry": return "bg-accent text-accent-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getEventImage = (event: Event) => {
    if (event.image) {
      return apiService.imgUrl(event.image);
    }
    return event.image_url || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop';
  };

  if (loading) {
    return (
      <section className="py-20 section-gradient">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center min-h-[400px]">
            <Loader2 className="h-8 w-8 animate-spin text-accent" />
          </div>
        </div>
      </section>
    );
  }

  if (error || upcomingEvents.length === 0) {
    return (
      <section className="py-20 section-gradient">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-4">
              Upcoming Events
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              {error || 'No upcoming events at the moment. Check back soon!'}
            </p>
          </div>
          <div className="text-center">
            <Link to="/events">
              <Button 
                variant="outline" 
                size="lg"
                className="btn-secondary hover:bg-accent hover:text-accent-foreground"
              >
                View All Events
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 section-gradient">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-4">
            Upcoming Events
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Discover exciting opportunities to learn, network, and contribute to the scientific community
          </p>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {upcomingEvents.map((event) => (
            <Link key={event._id} to={`/events/${event._id}`}>
              <Card className="science-card group cursor-pointer">
                {(event.image || event.image_url) && (
                  <div className="aspect-video overflow-hidden rounded-t-lg">
                    <img 
                      src={getEventImage(event)} 
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    {event.status && (
                      <Badge className={getStatusColor(event.status)}>
                        {event.status}
                      </Badge>
                    )}
                    {event.type && (
                      <Badge variant="outline" className="text-xs">
                        {event.type}
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-xl group-hover:text-accent transition-colors">
                    {event.title}
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {event.description}
                  </p>

                  <div className="space-y-3">
                    {(event.date || event.time) && (
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4 mr-2 text-accent" />
                        <span>
                          {event.date && formatDate(event.date)}
                          {event.date && event.time && ' • '}
                          {event.time}
                        </span>
                      </div>
                    )}
                    
                    {event.location && (
                      <div className="flex items-center text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4 mr-2 text-accent" />
                        <span>{event.location}</span>
                      </div>
                    )}
                    
                    {event.attendees !== undefined && event.attendees > 0 && (
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Users className="h-4 w-4 mr-2 text-accent" />
                        <span>{event.attendees} expected attendees</span>
                      </div>
                    )}
                  </div>
                </CardContent>

                <CardFooter>
                  <Button 
                    className="w-full btn-primary group-hover:bg-accent group-hover:text-accent-foreground transition-colors"
                    variant="default"
                    onClick={(e) => {
                      if (event.registration_link) {
                        e.preventDefault();
                        e.stopPropagation();
                        window.open(event.registration_link, '_blank');
                      }
                    }}
                  >
                    Register Now
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>

        {/* View All Events */}
        <div className="text-center">
          <Link to="/events">
            <Button 
              variant="outline" 
              size="lg"
              className="btn-secondary hover:bg-accent hover:text-accent-foreground"
            >
              View All Events
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default EventsSection;
