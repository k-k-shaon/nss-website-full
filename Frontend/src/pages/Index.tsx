import Header from '@/components/Header';
import Hero from '@/components/Hero';
import EventsSection from '@/components/EventsSection';
import BlogsSection from '@/components/BlogsSection';
import ProjectsSection from '@/components/ProjectsSection';
import Footer from '@/components/Footer';
import AchievementsCarousel from '@/components/AchievementsCarousel';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <EventsSection />
        <ProjectsSection />
        <BlogsSection />
        <AchievementsCarousel />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
