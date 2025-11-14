import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Skeleton } from "@/components/ui/skeleton";
import { apiService, imgUrl } from "../../services/api/apiService";

const Gallery = () => {
  const [images, setImages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCarousel = async () => {
      try {
        const data = await apiService.getCarousel();
        // Map carousel items to gallery-like structure
        setImages(data.map(item => ({
          id: item._id || item.id,
          image: item.image,
          title: item.caption || '',
        })));
      } catch (e) {
        console.error('Error fetching gallery images', e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCarousel();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20">
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-6xl">
            <h1 className="text-5xl font-bold mb-4 text-center bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Gallery
            </h1>
            <p className="text-xl text-muted-foreground text-center mb-16">
              Memories from our events and activities
            </p>

            {isLoading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Skeleton key={i} className="h-64 w-full rounded-lg" />
                ))}
              </div>
            ) : images && images.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {images.map((image) => (
                  <div
                    key={image.id}
                    className="group relative overflow-hidden rounded-lg aspect-square"
                  >
                    <img
                      src={imgUrl(image.image)}
                      alt={image.title || "Gallery image"}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    {(image.title) && (
                      <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                        <div className="p-4">
                          {image.title && (
                            <h3 className="font-semibold text-lg">{image.title}</h3>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-xl text-muted-foreground">
                  No images in the gallery yet. Check back soon!
                </p>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Gallery;
