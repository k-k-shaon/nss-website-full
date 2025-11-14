import { useEffect, useState } from "react";
import { apiService } from "../../services/api/apiService";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

const AchievementsCarousel = () => {
  const [slides, setSlides] = useState<Array<{ _id: string; image: string; title?: string; caption?: string }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await apiService.getCarousel();
        setSlides(data);
      } catch (e) {
        // silent fail for homepage
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading || slides.length === 0) return null;

  return (
    <section className="py-10 container mx-auto">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-4">
            Our Achievements & Memories
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Memories from our events and activities
          </p>
        </div>
        </div>
      <div className="relative">
        <Carousel className="w-full" opts={{ align: "start", loop: true }}>
          <CarouselContent>
            {slides.map((s) => (
              <CarouselItem key={s._id} className="md:basis-1/2 lg:basis-1/3">
                <div className="relative h-56 md:h-64 lg:h-72 overflow-hidden rounded-lg group">
                  <img
                    src={apiService.imgUrl(s.image)}
                    alt={s.title || s.caption || "Achievement"}
                    className="w-full h-full object-cover transition-transform group-hover:scale-[1.02]"
                  />
                  {(s.title || s.caption) && (
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent p-4 text-white">
                      {s.title && <h3 className="font-semibold text-base leading-tight mb-1 line-clamp-2">{s.title}</h3>}
                      {s.caption && <p className="text-xs opacity-90 line-clamp-2">{s.caption}</p>}
                    </div>
                  )}
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="-left-2" />
          <CarouselNext className="-right-2" />
        </Carousel>
      </div>
    </section>
  );
};

export default AchievementsCarousel;
