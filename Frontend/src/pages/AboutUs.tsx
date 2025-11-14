import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const AboutUs = () => {
  // Faculty Moderator Info
  const moderator = {
    name: "Md. Didarul Islam",
    designation: " Moderator, NITER Science Society (NSS)",
    image: "/images/didar sir.jpg",
  };

  // Executive Panel Members (Total 21)
  const executivePanel = [
    {
      id: 1,
      name: "Ashikur Rahman",
      designation: "President",
      image: "/images/ashik.jpg",
    },
    {
      id: 2,
      name: "Al Kifayat Khan Shaon",
      designation: "Vice-President (Organizing)",
      image: "/images/shaon.jpg",
    },
    {
      id: 3,
      name: "Labiba Salwa Islam",
      designation: "Vice-President (Research)",
      image: "/images/labiba.jpg",
    },
    {
      id: 4,
      name: "Md. Ashiqur Rahman Khan",
      designation: "Vice-President (Admin & HRM) ",
      image: "/images/ashiqur.jpg",
    },
    {
      id: 5,
      name: "Salehin Badhon",
      designation: "General Secretary",
      image: "/images/salehin.jpg",
    },
    {
      id: 6,
      name: "Samia Anwar Nishat",
      designation: "Joint General Secretary",
      image: "/images/samia.jpg",
    },
    {
      id: 7,
      name: "Mustakim Sarkar",
      designation: "Innovation & Development Secretary",
      image: "/images/mustakim.jpg",
    },
    {
      id: 8,
      name: "Mohtasim shahriar",
      designation: "Assistant Secretary of Innovation & Development",
      image: "/images/mohtasim.jpg",
    },
    {
      id: 9,
      name: "Kazi Robiul Islam Refat",
      designation: "Treasurer",
      image: "/images/rifat.jpg",
    },
    {
      id: 10,
      name: "Amit Sarker",
      designation: "Deputy Treasurer",
      image: "/images/amit.jpg",
    },
    {
      id: 11,
      name: "Mohammad Mamun Ar Rashid Tahsin",
      designation: "Office & IT Secretary",
      image: "/images/tasin.jpg",
    },
    {
      id: 12,
      name: "Afroja Alam Tani",
      designation: "Assistant Secretary of Office & IT",
      image: "/images/tani.jpg",
    },
    {
      id: 13,
      name: "Khaled Sifullah Kowser",
      designation: "Secretary of Public Relation",
      image: "/images/kawsar.jpg",
    },
    {
      id: 14,
      name: "Ashraf Abid",
      designation: "Assistant Secretary of Public Relation",
      image: "/images/abid.jpg",
    },
    {
      id: 15,
      name: "Mizanur Rahman",
      designation: "Secretary of Organizing",
      image: "/images/mizan.jpg",
    },
    {
      id: 16,
      name: "Shuvo Kumar Das",
      designation: "Assistant Secretary of Organizing",
      image: "/images/shuvo.jpg",
    },
    {
      id: 17,
      name: "Md. Lotifur Rahman Lihad",
      designation: "Senior Executive Member",
      image: "/images/lihad.jpg",
    },
    {
      id: 18,
      name: "Shahriar Sourav",
      designation: "Senior Executive Member",
      image: "/images/sourav.jpg",
    },
    {
      id: 19,
      name: "M.A Rafi",
      designation: "Junior Executive Member",
      image: "/images/rafi.jpg",
    },
    {
      id: 20,
      name: "Fabliha Bushra",
      designation: "Junior Executive Member",
      image: "/images/bushra.jpg",
    },
    {
      id: 21,
      name: "Gourab Saha",
      designation: "Junior Executive Member ",
      image: "/images/gourob.jpg",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20">
        {/* Club Description Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-6xl">
            <h1 className="text-5xl font-bold mb-4 text-center bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              About Us
            </h1>
            <p className="text-xl text-muted-foreground text-center mb-16">
              Learn more about NITER Science Society
            </p>

            <div className="bg-card rounded-lg p-8 border mb-20">
              <p className="text-lg text-muted-foreground leading-relaxed">
                Welcome to NITER Science Society, a vibrant community of passionate students dedicated to exploring the wonders of science and technology. 
                Our society was founded with the mission to foster scientific curiosity, promote innovation, and create a platform for knowledge sharing among students. 
                We organize workshops, seminars, competitions, and hands-on projects that bridge theoretical knowledge with practical applications. 
                Through our diverse initiatives, we aim to inspire the next generation of scientists, researchers, and innovators who will shape the future of technology and scientific discovery. 
                Join us in our journey to explore, learn, and innovate together as we push the boundaries of scientific exploration and create meaningful impact in our community.
              </p>
            </div>

            {/* Moderator Section */}
            <div className="mb-20">
              <h2 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Faculty Moderator
              </h2>
              <div className="flex justify-center">
                <Card className="w-64 hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6 text-center">
                    <Avatar className="w-32 h-32 mx-auto mb-4">
                      <AvatarImage src={moderator.image} alt={moderator.name} />
                      <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                        {moderator.name
                          .split(" ")
                          .map((part) => part[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <h3 className="text-xl font-bold text-foreground mb-1">
                      {moderator.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {moderator.designation}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Executive Panel Section */}
            <div>
              <h2 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Current Executive Panel 2025
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {executivePanel.map((member) => (
                  <Card
                    key={member.id}
                    className="hover:shadow-lg transition-shadow"
                  >
                    <CardContent className="pt-6 text-center">
                      <Avatar className="w-24 h-24 mx-auto mb-4">
                        <AvatarImage
                          src={member.image}
                          alt={member.name}
                        />
                        <AvatarFallback className="text-lg bg-secondary text-secondary-foreground">
                          {member.name
                            .split(" ")
                            .map((part) => part[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <h3 className="text-lg font-bold text-foreground mb-1">
                        {member.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {member.designation}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default AboutUs;
