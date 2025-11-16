import { Card, CardContent } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import { Quote } from 'lucide-react';
import directorImage from '@/assets/niter-logo.png';
import moderatorImage from '@/assets/didar sir.jpg';
import presidentImage from '@/assets/salehin.jpg';

const testimonials = [
  {
    name: 'Dr. [Director Name]',
    designation: 'Director, NITER',
    image: directorImage,
    quote: 'Science clubs are the cornerstone of innovation and discovery. Through hands-on exploration and collaborative learning, students transform theoretical knowledge into practical solutions that shape our future.',
  },
  {
    name: 'Didar Ahmed',
    designation: 'Moderator, NITER Science Society',
    image: moderatorImage,
    quote: 'The NITER Science Society embodies the spirit of curiosity and excellence. Our mission is to nurture young minds, fostering a culture where scientific inquiry meets practical application.',
  },
  {
    name: '[President Name]',
    designation: 'President, NITER Science Society',
    image: presidentImage,
    quote: 'Being part of this society has been transformative. Together, we create an ecosystem where passion for science meets opportunity, empowering every member to pursue their dreams and make meaningful contributions.',
  },
];

const TestimonialsSection = () => {
  return (
    <section className="py-12 bg-gradient-to-b from-primary/10 via-accent/8 to-background relative overflow-hidden">
      {/* Decorative eclipse circles */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-blue-300/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
      <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-blue-200/10 rounded-full blur-2xl -translate-x-1/2 -translate-y-1/2"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-blue-400 dark:from-blue-400 dark:to-blue-300 bg-clip-text text-transparent">
            Words of Inspiration
          </h2>
          <p className="text-muted-foreground text-base max-w-2xl mx-auto">
            Hear from the visionaries guiding our journey towards scientific excellence
          </p>
        </div>

        <Carousel
          opts={{
            align: 'start',
            loop: true,
          }}
          plugins={[
            Autoplay({
              delay: 5000,
            }),
          ]}
          className="w-full max-w-5xl mx-auto"
        >
          <CarouselContent>
            {testimonials.map((testimonial, index) => (
            <CarouselItem key={index}>
                <Card className="border-none shadow-lg bg-card/50 backdrop-blur-sm">
                  <CardContent className="p-6 md:p-8">
                    <div className="flex flex-col md:flex-row items-center gap-6">
                      {/* Image with eclipse effect */}
                      <div className="relative flex-shrink-0">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-blue-600/20 rounded-full blur-xl"></div>
                        <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-blue-400/20 shadow-lg">
                          <img
                            src={testimonial.image}
                            alt={testimonial.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>

                      {/* Quote content */}
                      <div className="flex-1 text-center md:text-left">
                        <Quote className="w-8 h-8 text-blue-400/30 mb-3 mx-auto md:mx-0" />
                        <p className="text-base md:text-lg text-foreground/90 mb-4 italic leading-relaxed">
                          "{testimonial.quote}"
                        </p>
                        <div>
                          <h4 className="text-lg font-bold text-foreground">
                            {testimonial.name}
                          </h4>
                          <p className="text-blue-600 dark:text-blue-400 font-medium">
                            {testimonial.designation}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex" />
          <CarouselNext className="hidden md:flex" />
        </Carousel>
      </div>
    </section>
  );
};

export default TestimonialsSection;
