'use client';

import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '@/lib/LanguageContext';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion, useAnimation, useInView } from 'framer-motion';
import { 
  ChevronLeftIcon, 
  ChevronRightIcon, 
  QuoteIcon, 
  StarIcon, 
  PlayIcon, 
  GraduationCapIcon,
  BookOpenIcon,
  AwardIcon,
  HeartIcon,
  Code,
  Calculator
} from 'lucide-react';

type TestimonialsProps = {
  title?: string;
  subtitle?: string;
  videoSectionTitle?: string;
};

export default function Testimonials(props: TestimonialsProps) {
  const { t } = useLanguage();
  
  // Use translation keys
  const title = t('landing.testimonials.title');
  const subtitle = t('landing.testimonials.subtitle');
  const videoSectionTitle = t('landing.testimonials.videoSection');
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.2 });
  const controls = useAnimation();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    }
  }, [controls, isInView]);

  // Mock testimonial data
  const testimonials = [
    {
      id: 1,
      content: "11tutors completely changed my approach to studying calculus. My tutor explained concepts in ways my professors never could. I went from struggling to acing my exams!",
      author: "Jamie Chen",
      role: "Computer Science Student",
      avatar: "/testimonials/jamie.jpg",
      university: "UCLA",
      universityColor: "bg-blue-600",
      universityInitial: "U",
      rating: 5,
      subject: "Calculus",
      subjectIcon: BookOpenIcon
    },
    {
      id: 2,
      content: "The data structures course on 11tutors helped me prepare for technical interviews. The tutor shared practical tips that weren't in my textbooks. I landed my dream internship!",
      author: "Marcus Johnson",
      role: "Engineering Student",
      avatar: "/testimonials/marcus.jpg",
      university: "Georgia Tech",
      universityColor: "bg-yellow-600",
      universityInitial: "G",
      rating: 5,
      subject: "Data Structures",
      subjectIcon: Code
    },
    {
      id: 3,
      content: "As someone who struggled with statistics, finding a tutor who could break down complex concepts was game-changing. The personalized approach and flexible schedule made all the difference.",
      author: "Priya Patel",
      role: "Business Student",
      avatar: "/testimonials/priya.jpg",
      university: "NYU",
      universityColor: "bg-purple-700",
      universityInitial: "N",
      rating: 4.8,
      subject: "Statistics",
      subjectIcon: Calculator
    },
    {
      id: 4,
      content: "The quality of instruction on 11tutors is exceptional. My tutor had just taken the same course last year and knew exactly what areas would be challenging for me. Highly recommend!",
      author: "Thomas Wright",
      role: "Physics Student",
      avatar: "/testimonials/thomas.jpg",
      university: "University of Michigan",
      universityColor: "bg-blue-700",
      universityInitial: "M",
      rating: 4.9,
      subject: "Physics",
      subjectIcon: GraduationCapIcon
    }
  ];

  // Video testimonials
  const videoTestimonials = [
    {
      id: 'video-1',
      thumbnail: '/testimonials/video-thumb-1.jpg',
      videoUrl: '/testimonials/student-review-1.mp4',
      title: 'How 11tutors Helped Me Ace My Finals',
      author: 'Emily Rodriguez',
      university: 'Columbia University',
      universityColor: "bg-blue-800",
      universityInitial: "C",
      duration: "3:42",
      views: "2.4K"
    },
    {
      id: 'video-2',
      thumbnail: '/testimonials/video-thumb-2.jpg',
      videoUrl: '/testimonials/student-review-2.mp4',
      title: 'From C to A+ in Computer Science',
      author: 'Jason Kim',
      university: 'UC Berkeley',
      universityColor: "bg-blue-700",
      universityInitial: "B",
      duration: "4:15",
      views: "3.1K"
    }
  ];

  // Auto-advance carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  const nextTestimonial = () => {
    setActiveIndex((current) => (current + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setActiveIndex((current) => (current - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section id="testimonials" className="py-20 relative overflow-hidden">
      {/* Background gradient elements */}
      <div className="absolute -z-10 top-0 left-0 w-1/3 h-1/3 bg-gradient-to-br from-primary/5 to-primary/0 rounded-full blur-3xl" />
      <div className="absolute -z-10 bottom-0 right-0 w-1/2 h-1/2 bg-gradient-to-tr from-secondary/5 to-secondary/0 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4" ref={containerRef}>
        <motion.div 
          initial="hidden"
          animate={controls}
          variants={containerVariants}
          className="text-center mb-16"
        >
          <motion.h2 
            className="text-3xl md:text-4xl font-bold mb-4"
            variants={itemVariants}
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
              {title}
            </span>
          </motion.h2>
          <motion.p 
            className="text-xl text-muted-foreground max-w-2xl mx-auto"
            variants={itemVariants}
          >
            {subtitle}
          </motion.p>
        </motion.div>

        {/* Text Testimonials Carousel */}
        <motion.div 
          className="relative max-w-4xl mx-auto mb-20"
          variants={containerVariants}
        >
          <div className="overflow-hidden rounded-xl shadow-lg">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${activeIndex * 100}%)` }}
            >
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="w-full flex-shrink-0 px-4 py-6">
                  <Card className="border-none shadow-lg bg-gradient-to-br from-card to-card/90 overflow-hidden">
                    <CardContent className="p-8 relative">
                      {/* Decorative elements */}
                      <div className="absolute top-0 right-0 -mt-6 -mr-6 w-24 h-24 bg-primary/5 rounded-full blur-xl" />
                      <div className="absolute bottom-0 left-0 -mb-6 -ml-6 w-32 h-32 bg-secondary/5 rounded-full blur-xl" />
                      
                      <div className="relative z-10">
                        <div className="flex justify-between items-start mb-6">
                          <QuoteIcon className="h-10 w-10 text-primary/20" />
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <StarIcon 
                                key={i} 
                                className={`h-4 w-4 ${i < Math.floor(testimonial.rating) ? 'text-amber-400 fill-amber-400' : 'text-muted'}`} 
                              />
                            ))}
                          </div>
                        </div>
                        
                        <p className="text-lg italic mb-6">{testimonial.content}</p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Avatar className="h-12 w-12 mr-4 ring-2 ring-primary/20">
                              <AvatarImage src={testimonial.avatar} alt={testimonial.author} />
                              <AvatarFallback>{testimonial.author[0]}</AvatarFallback>
                            </Avatar>
                            <div>
                              <h4 className="font-semibold">{testimonial.author}</h4>
                              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[8px] text-white font-bold ${testimonial.universityColor}`}>
                                  {testimonial.universityInitial}
                                </div>
                                {testimonial.university}
                              </div>
                            </div>
                          </div>
                          
                          <Badge variant="outline" className="flex items-center gap-1">
                            <testimonial.subjectIcon className="h-3 w-3" />
                            <span>{testimonial.subject}</span>
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Dots */}
          <div className="flex justify-center mt-6 gap-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                className={`h-2 rounded-full transition-all ${
                  activeIndex === index ? 'w-8 bg-primary' : 'w-2 bg-primary/30'
                }`}
                onClick={() => setActiveIndex(index)}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>

          {/* Navigation Arrows */}
          <Button
            variant="outline"
            size="icon"
            className="absolute top-1/2 -left-4 -translate-y-1/2 rounded-full opacity-70 hover:opacity-100 shadow-md"
            onClick={prevTestimonial}
            aria-label={t('landing.testimonials.prevTestimonial')}
          >
            <ChevronLeftIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="absolute top-1/2 -right-4 -translate-y-1/2 rounded-full opacity-70 hover:opacity-100 shadow-md"
            onClick={nextTestimonial}
            aria-label={t('landing.testimonials.nextTestimonial')}
          >
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
        </motion.div>

        {/* Video Testimonials */}
        <motion.div 
          className="mt-16"
          variants={containerVariants}
        >
          <motion.h3 
            className="text-2xl font-semibold text-center mb-8"
            variants={itemVariants}
          >
            {videoSectionTitle}
          </motion.h3>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
            variants={containerVariants}
          >
            {videoTestimonials.map((video, index) => (
              <motion.div 
                key={video.id} 
                className="relative group"
                variants={itemVariants}
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Card className="overflow-hidden border-none shadow-lg">
                  <div className="aspect-video bg-muted relative overflow-hidden">
                    {/* Video thumbnail with play button overlay */}
                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors flex items-center justify-center z-10">
                      <motion.div 
                        className="h-16 w-16 rounded-full bg-primary flex items-center justify-center"
                        whileHover={{ scale: 1.1 }}
                        transition={{ type: "spring", stiffness: 400 }}
                      >
                        <PlayIcon className="h-8 w-8 text-white fill-white" />
                      </motion.div>
                    </div>
                    
                    {/* Duration badge */}
                    <Badge className="absolute bottom-3 right-3 z-10 bg-black/70 text-white">
                      {video.duration}
                    </Badge>
                    
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-0" />
                    
                    <img 
                      src={video.thumbnail || '/video-placeholder.jpg'} 
                      alt={video.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-lg group-hover:text-primary transition-colors">{video.title}</h4>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[8px] text-white font-bold ${video.universityColor}`}>
                          {video.universityInitial}
                        </div>
                        <span>{video.author}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">{video.views} {t('landing.testimonials.viewCount')}</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
