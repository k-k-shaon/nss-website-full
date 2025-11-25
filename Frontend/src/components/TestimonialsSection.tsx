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
import directorImage from '@/assets/director.jpg';
import moderatorImage from '@/assets/didar sir.jpg';
import presidentImage from '@/assets/ashik.jpg';

const testimonials = [
{
name: 'Prof. Dr. Ashequl Alam Rana',
designation: 'Director, National Institute of Textile Engineering and Research (NITER)',
image: directorImage,
quote: `It is my great pleasure to acknowledge the meaningful initiatives of the NITER Science Society (NSS) in cultivating a strong culture of scientific curiosity, innovation and student leadership on our campus. NSS continues to play a vital role in enhancing academic engagement through research activities, collaborations and impactful outreach programs that extend beyond the classroom.
In today’s rapidly advancing world, students must develop not only technical knowledge but also the ability to think critically, communicate clearly and lead with a sense of responsibility. NSS embodies these values by providing a dynamic platform where young talents can explore ideas, challenge themselves and grow into future scientists, engineers and innovators.
I wholeheartedly appreciate the dedication, enthusiasm and professionalism shown by the NSS team. Their contributions continue to strengthen the reputation of NITER in both academic and social arenas, reflecting our shared commitment to progress and excellence.
I extend my full support to the Society and encourage all members to continue moving forward with integrity, curiosity and confidence.`,
},
{
name: 'Md. Didarul Islam',
designation: 'Moderator, NITER Science Society (NSS)',
image: moderatorImage,
quote: `On behalf of the NITER Science Society (NSS), I would like to extend my heartfelt appreciation to all students, faculty, and well-wishers who continue to support the growth of scientific culture at our institute. As the Moderator of NSS, it is both an honor and a responsibility to guide a platform dedicated to inspiring curiosity, nurturing talent, and promoting scientific engagement among our students. Through seminars, workshops, competitions, and collaborative activities, NSS aims to create a dynamic environment where young minds can explore science beyond the classroom.
NITER Science Society is a student driven organization established with the vision of:
• Encouraging scientific thinking, research aptitude, and innovation
• Providing students with opportunities to participate in national and international science events
• Organizing workshops, seminars, skill-development programs, and hands-on scientific activities
• Creating a bridge between academic knowledge and real-world scientific applications
• Representing NITER in national science outreach programs and competitions
For updates on upcoming events, notices, or opportunities, please stay connected with our official NSS communication website.`,
},
{
name: 'Ashikur Rahman',
designation: 'President, NITER Science Society (NSS), National Institute of Textile Engineering & Research (NITER)',
image: presidentImage,
quote: `The NITER Science Society (NSS) symbolizes a shared commitment to curiosity, learning and innovation. We strive to create an environment where students are encouraged to think differently, explore boldly and transform ideas into meaningful contributions.
With the support of our respected Moderator, our honorable Director Sir and our faculty members, NSS continues to grow as a platform that nurtures scientific thinking and collaborative leadership.
To all members and volunteers—your dedication is the foundation of our progress. Your energy, creativity and teamwork are what make this society truly vibrant.
As we move ahead, let us continue to learn, inspire and uplift one another. Together, we carry the spark that will illuminate new paths of knowledge and discovery.`,
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
          opts={{ align: 'start', loop: true }}
          plugins={[Autoplay({ delay: 5000 })]}
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
                          <img src={testimonial.image} alt={testimonial.name} className="w-full h-full object-cover" />
                        </div>
                      </div>

                      {/* Quote content */}
                      <div className="flex-1 text-center md:text-left">
                        <Quote className="w-8 h-8 text-blue-400/30 mb-3 mx-auto md:mx-0" />
                        <p className="text-base md:text-lg text-foreground/90 mb-4 italic leading-relaxed">
                          "{testimonial.quote}"
                        </p>
                        <div>
                          <h4 className="text-lg font-bold text-foreground">{testimonial.name}</h4>
                          <p className="text-blue-600 dark:text-blue-400 font-medium">{testimonial.designation}</p>
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
