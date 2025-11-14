import { Button } from '@/components/ui/button';
import { ArrowRight, Users, Calendar, BookOpen } from 'lucide-react';
import heroImage from '@/assets/hero-science.jpg';

const Hero = () => {
  return (
    <section className="hero-section">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/70 to-primary/50"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Main Heading */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Exploring Science,
            <span className="block text-gradient">Building Tomorrow</span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
            Join NITER's premier science society where curious minds collaborate, 
            innovate, and push the boundaries of scientific discovery.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button size="lg" className="btn-primary text-lg px-8 py-4 group">
              Join Our Community
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="text-lg px-8 py-4 bg-white/10 border-white/30 text-white hover:bg-white hover:text-primary"
            >
              Explore Projects
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="flex flex-col items-center space-y-2">
              <div className="science-card bg-white/10 backdrop-blur-sm border-white/20 p-4 rounded-full">
                <Users className="h-8 w-8 text-accent" />
              </div>
              <div className="text-2xl font-bold text-white">100+</div>
              <div className="text-white/80">Active Members</div>
            </div>
            
            <div className="flex flex-col items-center space-y-2">
              <div className="science-card bg-white/10 backdrop-blur-sm border-white/20 p-4 rounded-full">
                <Calendar className="h-8 w-8 text-accent" />
              </div>
              <div className="text-2xl font-bold text-white">30+</div>
              <div className="text-white/80">Events Annually</div>
            </div>
            
            <div className="flex flex-col items-center space-y-2">
              <div className="science-card bg-white/10 backdrop-blur-sm border-white/20 p-4 rounded-full">
                <BookOpen className="h-8 w-8 text-accent" />
              </div>
              <div className="text-2xl font-bold text-white">20+</div>
              <div className="text-white/80">Research Projects</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      {/* <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full p-1">
          <div className="w-1 h-3 bg-white rounded-full mx-auto animate-pulse"></div>
        </div>
      </div> */}
    </section>
  );
};

export default Hero;