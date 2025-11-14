import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, Github } from 'lucide-react';
import niterLogo from '@/assets/niter-logo.png';

const Footer = () => {
  const quickLinks = [
    { name: 'About Us', href: '/about' },
    { name: 'Events', href: '/events' },
    { name: 'Membership', href: '/membership' },
  ];

  const resources = [
    { name: 'Gallery', href: '/gallery' },
    { name: 'Blog', href: '/blog' },
    { name: 'Contact', href: '/contact' },
    { name: 'Privacy Policy', href: '/privacy' },
  ];

  const socialLinks = [
    { name: 'Facebook', icon: Facebook, href: 'https://www.facebook.com/nitersciencesociety' },
    { name: 'Twitter', icon: Twitter, href: '#' },
    { name: 'Instagram', icon: Instagram, href: '#' },
    { name: 'LinkedIn', icon: Linkedin, href: 'https://www.linkedin.com/company/niter-science-society-nss' },
    { name: 'GitHub', icon: Github, href: '#' },
  ];

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Society Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <img 
                src={niterLogo} 
                alt="NITER Science Society" 
                className="h-12 w-12 rounded-full"
              />
              <div>
                <h3 className="text-xl font-bold">NITER Science Society</h3>
                <p className="text-sm opacity-80">Official Website</p>
              </div>
            </div>
            <p className="text-sm opacity-90 leading-relaxed">
              Fostering scientific innovation and discovery through collaborative research, 
              educational events, and community engagement at NITER.
            </p>
            <div className="flex space-x-3">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="p-2 rounded-full bg-white/10 hover:bg-accent hover:text-accent-foreground transition-colors"
                  aria-label={social.name}
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.href}
                    className="text-sm opacity-80 hover:opacity-100 hover:text-accent transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Resources</h4>
            <ul className="space-y-2">
              {resources.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.href}
                    className="text-sm opacity-80 hover:opacity-100 hover:text-accent transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <div className="space-y-3">
              <div className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 mt-1 text-accent" />
                <div>
                  <p className="text-sm opacity-90">National Institute of Textile Engineering and Research (NITER)</p>
                  <p className="text-sm opacity-80">Nayarhat, Savar-1350</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-accent" />
                <a 
                  href="mailto:science@niter.edu.bd"
                  className="text-sm opacity-80 hover:opacity-100 hover:text-accent transition-colors"
                >
                  nitersciencesociety@niter.edu.bd
                </a>
              </div>
              
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-accent" />
                <a 
                  href="tel:+8801952806594"
                  className="text-sm opacity-80 hover:opacity-100 hover:text-accent transition-colors"
                >
                  +880 1952806594
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/20 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm opacity-80">
            © 2025 NITER Science Society. All rights reserved.
          </p>
          <p className="text-sm opacity-80 mt-2 md:mt-0">
            Designed by NSS Developer Team
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;