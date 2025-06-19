"use client";

import React from "react";
import { useLanguage } from "@/lib/LanguageContext";
import { motion } from "framer-motion";
import { 
  SearchIcon, 
  FilterIcon, 
  StarIcon, 
  MapPinIcon, 
  GraduationCapIcon,
  BookOpenIcon,
  CheckCircleIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";

export default function TutorsPage() {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = React.useState("");
  const [subjectFilter, setSubjectFilter] = React.useState("all");
  
  // Mock tutor data - in a real app, this would come from an API
  const tutors = [
    {
      id: 1,
      name: "Dr. Sarah Johnson",
      avatar: "https://i.pravatar.cc/150?img=1",
      subjects: ["Mathematics", "Physics"],
      rating: 4.9,
      reviews: 124,
      location: "New York, USA",
      hourlyRate: "$45",
      education: "Ph.D. in Mathematics, MIT",
      experience: "10+ years",
      bio: "Experienced mathematics and physics tutor with a passion for making complex concepts easy to understand.",
      verified: true,
      availability: "Weekdays, Evenings"
    },
    {
      id: 2,
      name: "Prof. Michael Chen",
      avatar: "https://i.pravatar.cc/150?img=11",
      subjects: ["Computer Science", "Data Science"],
      rating: 4.8,
      reviews: 98,
      location: "San Francisco, USA",
      hourlyRate: "$60",
      education: "Ph.D. in Computer Science, Stanford",
      experience: "8+ years",
      bio: "Specialized in programming, algorithms, and machine learning. I help students build practical skills for the tech industry.",
      verified: true,
      availability: "Flexible"
    },
    {
      id: 3,
      name: "Emily Williams",
      avatar: "https://i.pravatar.cc/150?img=5",
      subjects: ["English Literature", "Creative Writing"],
      rating: 4.7,
      reviews: 87,
      location: "London, UK",
      hourlyRate: "$40",
      education: "M.A. in English Literature, Oxford",
      experience: "6+ years",
      bio: "Passionate about literature and helping students develop their writing skills and critical thinking.",
      verified: true,
      availability: "Weekends, Evenings"
    },
    {
      id: 4,
      name: "Dr. Robert Thompson",
      avatar: "https://i.pravatar.cc/150?img=12",
      subjects: ["History", "Political Science"],
      rating: 4.9,
      reviews: 76,
      location: "Chicago, USA",
      hourlyRate: "$50",
      education: "Ph.D. in History, University of Chicago",
      experience: "12+ years",
      bio: "Specialized in modern history and political systems. I make history come alive for my students.",
      verified: true,
      availability: "Weekdays"
    },
    {
      id: 5,
      name: "Lisa Anderson",
      avatar: "https://i.pravatar.cc/150?img=9",
      subjects: ["Chemistry", "Biology"],
      rating: 4.8,
      reviews: 92,
      location: "Boston, USA",
      hourlyRate: "$55",
      education: "Ph.D. in Chemistry, Harvard",
      experience: "7+ years",
      bio: "Helping students master the sciences with clear explanations and practical examples.",
      verified: true,
      availability: "Flexible"
    },
    {
      id: 6,
      name: "David Miller",
      avatar: "https://i.pravatar.cc/150?img=15",
      subjects: ["Economics", "Business"],
      rating: 4.6,
      reviews: 68,
      location: "Toronto, Canada",
      hourlyRate: "$48",
      education: "MBA, University of Toronto",
      experience: "9+ years",
      bio: "Specialized in economics and business strategy. I help students understand real-world applications.",
      verified: true,
      availability: "Weekdays, Evenings"
    },
  ];

  // Filter tutors based on search query and subject
  const filteredTutors = tutors.filter(tutor => {
    const matchesSearch = tutor.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          tutor.bio.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = subjectFilter === "all" || 
                          tutor.subjects.some(subject => subject.toLowerCase() === subjectFilter.toLowerCase());
    return matchesSearch && matchesSubject;
  });

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-b from-primary/10 to-background">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">{t('tutors.title')}</h1>
            <p className="text-xl text-muted-foreground mb-8">
              {t('tutors.description')}
            </p>
            
            {/* Search and Filter */}
            <div className="flex flex-col md:flex-row gap-4 max-w-2xl mx-auto">
              <div className="relative flex-1">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input 
                  placeholder={t('tutors.searchPlaceholder')}
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={subjectFilter} onValueChange={setSubjectFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder={t('tutors.filterBySubject')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('tutors.allSubjects')}</SelectItem>
                  <SelectItem value="mathematics">{t('tutors.subjects.mathematics')}</SelectItem>
                  <SelectItem value="physics">{t('tutors.subjects.physics')}</SelectItem>
                  <SelectItem value="computer science">{t('tutors.subjects.computerScience')}</SelectItem>
                  <SelectItem value="english literature">{t('tutors.subjects.englishLiterature')}</SelectItem>
                  <SelectItem value="history">{t('tutors.subjects.history')}</SelectItem>
                  <SelectItem value="chemistry">{t('tutors.subjects.chemistry')}</SelectItem>
                  <SelectItem value="economics">{t('tutors.subjects.economics')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </motion.div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-secondary/5 rounded-full blur-3xl" />
        </div>
      </section>
      
      {/* Tutors Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">
              {filteredTutors.length} {filteredTutors.length === 1 ? t('tutors.tutor') : t('tutors.tutorsPlural')}
            </h2>
            <div className="flex items-center gap-2">
              <FilterIcon className="h-4 w-4 text-muted-foreground" />
              <Select defaultValue="rating">
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder={t('tutors.sortBy')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rating">{t('tutors.sortOptions.rating')}</SelectItem>
                  <SelectItem value="priceAsc">{t('tutors.sortOptions.priceAsc')}</SelectItem>
                  <SelectItem value="priceDesc">{t('tutors.sortOptions.priceDesc')}</SelectItem>
                  <SelectItem value="experience">{t('tutors.sortOptions.experience')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {filteredTutors.length === 0 ? (
            <div className="text-center py-16">
              <GraduationCapIcon className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="text-xl font-medium mb-2">{t('tutors.noTutorsFound')}</h3>
              <p className="text-muted-foreground">{t('tutors.tryDifferentSearch')}</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => {
                  setSearchQuery("");
                  setSubjectFilter("all");
                }}
              >
                {t('tutors.clearFilters')}
              </Button>
            </div>
          ) : (
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            >
              {filteredTutors.map((tutor) => (
                <motion.div key={tutor.id} variants={itemVariants}>
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                    <CardHeader className="pb-2">
                      <div className="flex items-start gap-4">
                        <Avatar className="h-16 w-16 border-2 border-primary/20">
                          <AvatarImage src={tutor.avatar} alt={tutor.name} />
                          <AvatarFallback>{tutor.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="text-xl font-bold">{tutor.name}</h3>
                            {tutor.verified && (
                              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                <CheckCircleIcon className="h-3 w-3 mr-1" />
                                {t('tutors.verified')}
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <GraduationCapIcon className="h-3 w-3" />
                            <span>{tutor.education}</span>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex items-center">
                              <StarIcon className="h-4 w-4 text-yellow-400" />
                              <span className="ml-1 font-medium">{tutor.rating}</span>
                              <span className="text-muted-foreground text-sm ml-1">({tutor.reviews})</span>
                            </div>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <MapPinIcon className="h-3 w-3 mr-1" />
                              {tutor.location}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-lg">{tutor.hourlyRate}</div>
                          <div className="text-xs text-muted-foreground">{t('tutors.perHour')}</div>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">
                        {tutor.bio}
                      </p>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        {tutor.subjects.map((subject, index) => (
                          <Badge key={index} variant="secondary" className="bg-primary/10">
                            {subject}
                          </Badge>
                        ))}
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">{t('tutors.experience')}:</span>
                          <span className="ml-1 font-medium">{tutor.experience}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">{t('tutors.availability')}:</span>
                          <span className="ml-1 font-medium">{tutor.availability}</span>
                        </div>
                      </div>
                    </CardContent>
                    
                    <CardFooter className="flex justify-between border-t pt-4">
                      <Button variant="outline">
                        {t('tutors.viewProfile')}
                      </Button>
                      <Button>
                        {t('tutors.bookSession')}
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
          
          {/* Pagination */}
          {filteredTutors.length > 0 && (
            <div className="flex justify-center mt-12">
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" disabled>
                  {t('tutors.previous')}
                </Button>
                <Button variant="outline" size="sm" className="bg-primary text-white hover:bg-primary/90">
                  1
                </Button>
                <Button variant="outline" size="sm">
                  2
                </Button>
                <Button variant="outline" size="sm">
                  3
                </Button>
                <Button variant="outline" size="sm">
                  {t('tutors.next')}
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>
      
      {/* Become a Tutor CTA */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-8"
          >
            <div className="flex-1">
              <h2 className="text-3xl font-bold mb-4">{t('tutors.becomeTitle')}</h2>
              <p className="text-lg text-muted-foreground mb-6">
                {t('tutors.becomeDescription')}
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center gap-2">
                  <CheckCircleIcon className="h-5 w-5 text-primary" />
                  <span>{t('tutors.benefits.flexible')}</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircleIcon className="h-5 w-5 text-primary" />
                  <span>{t('tutors.benefits.earnings')}</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircleIcon className="h-5 w-5 text-primary" />
                  <span>{t('tutors.benefits.impact')}</span>
                </li>
              </ul>
              <Button size="lg">
                {t('tutors.applyNow')}
              </Button>
            </div>
            <div className="flex-1 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-lg blur-xl -z-10" />
              <div className="bg-card p-6 rounded-lg border shadow-lg">
                <div className="flex items-center gap-4 mb-4">
                  <BookOpenIcon className="h-10 w-10 text-primary" />
                  <div>
                    <h3 className="font-bold text-xl">{t('tutors.joinTitle')}</h3>
                    <p className="text-muted-foreground">{t('tutors.joinSubtitle')}</p>
                  </div>
                </div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start gap-2">
                    <CheckCircleIcon className="h-5 w-5 text-primary mt-0.5" />
                    <span>{t('tutors.joinBenefits.students')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircleIcon className="h-5 w-5 text-primary mt-0.5" />
                    <span>{t('tutors.joinBenefits.tools')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircleIcon className="h-5 w-5 text-primary mt-0.5" />
                    <span>{t('tutors.joinBenefits.community')}</span>
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}
