'use client';

import { useState } from 'react';
import { useLanguage } from '@/lib/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  StarIcon, 
  BookOpenIcon, 
  Clock, 
  ArrowRightIcon, 
  Code, 
  Calculator, 
  LineChart,
  BrainCircuit,
  Database,
  Globe,
  PieChart,
  FileSpreadsheet,
  GraduationCap
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

// Define types for course data
type Tutor = {
  name: string;
  avatar: string;
  university: string;
  universityColor: string;
  universityInitial: string;
};

type Course = {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  iconBgClass: string;
  price: number;
  rating: number;
  reviewCount: number;
  tutor: Tutor;
  level: string;
  duration: string;
};

type CourseCategories = {
  'computer-science': Course[];
  'mathematics': Course[];
  'business': Course[];
};

type CourseCardProps = {
  course: Course;
};

type FeaturedCoursesProps = {
  title?: string;
  subtitle?: string;
  viewAllText?: string;
  categoryLabels?: {
    computerScience?: string;
    mathematics?: string;
    business?: string;
  };
};

// Mock data for courses
const mockCourses: CourseCategories = {
  'computer-science': [
    {
      id: 'cs-1',
      title: 'Introduction to Python Programming',
      description: 'Learn Python fundamentals from scratch with practical projects.',
      icon: Code,
      iconBgClass: 'bg-gradient-to-br from-blue-500 to-blue-700',
      price: 49.99,
      rating: 4.8,
      reviewCount: 245,
      tutor: {
        name: 'Alex Johnson',
        avatar: '/tutors/alex.jpg',
        university: 'MIT',
        universityColor: 'bg-red-700',
        universityInitial: 'M'
      },
      level: 'Beginner',
      duration: '8 weeks'
    },
    {
      id: 'cs-2',
      title: 'Data Structures & Algorithms',
      description: 'Master the core concepts of DSA with Java implementations.',
      icon: Database,
      iconBgClass: 'bg-gradient-to-br from-purple-500 to-purple-700',
      price: 59.99,
      rating: 4.7,
      reviewCount: 189,
      tutor: {
        name: 'Sophia Chen',
        avatar: '/tutors/sophia.jpg',
        university: 'Stanford',
        universityColor: 'bg-red-600',
        universityInitial: 'S'
      },
      level: 'Intermediate',
      duration: '10 weeks'
    },
    {
      id: 'cs-3',
      title: 'Web Development Bootcamp',
      description: 'Full-stack web development with modern frameworks.',
      icon: Globe,
      iconBgClass: 'bg-gradient-to-br from-green-500 to-green-700',
      price: 69.99,
      rating: 4.9,
      reviewCount: 312,
      tutor: {
        name: 'Michael Park',
        avatar: '/tutors/michael.jpg',
        university: 'Berkeley',
        universityColor: 'bg-blue-700',
        universityInitial: 'B'
      },
      level: 'Intermediate',
      duration: '12 weeks'
    },
  ],
  'mathematics': [
    {
      id: 'math-1',
      title: 'Calculus I: Limits & Derivatives',
      description: 'Comprehensive introduction to differential calculus.',
      icon: Calculator,
      iconBgClass: 'bg-gradient-to-br from-red-500 to-red-700',
      price: 44.99,
      rating: 4.6,
      reviewCount: 178,
      tutor: {
        name: 'Emma Wilson',
        avatar: '/tutors/emma.jpg',
        university: 'Harvard',
        universityColor: 'bg-red-800',
        universityInitial: 'H'
      },
      level: 'Intermediate',
      duration: '8 weeks'
    },
    {
      id: 'math-2',
      title: 'Linear Algebra Fundamentals',
      description: 'Vector spaces, matrices, and linear transformations explained.',
      icon: LineChart,
      iconBgClass: 'bg-gradient-to-br from-amber-500 to-amber-700',
      price: 49.99,
      rating: 4.7,
      reviewCount: 156,
      tutor: {
        name: 'David Kim',
        avatar: '/tutors/david.jpg',
        university: 'Princeton',
        universityColor: 'bg-orange-600',
        universityInitial: 'P'
      },
      level: 'Intermediate',
      duration: '9 weeks'
    },
  ],
  'business': [
    {
      id: 'bus-1',
      title: 'Introduction to Marketing',
      description: 'Learn core marketing principles and digital strategies.',
      icon: PieChart,
      iconBgClass: 'bg-gradient-to-br from-cyan-500 to-cyan-700',
      price: 39.99,
      rating: 4.5,
      reviewCount: 203,
      tutor: {
        name: 'Sarah Martinez',
        avatar: '/tutors/sarah.jpg',
        university: 'Wharton',
        universityColor: 'bg-blue-900',
        universityInitial: 'W'
      },
      level: 'Beginner',
      duration: '6 weeks'
    },
    {
      id: 'bus-2',
      title: 'Financial Accounting Basics',
      description: 'Master the fundamentals of accounting and financial statements.',
      icon: FileSpreadsheet,
      iconBgClass: 'bg-gradient-to-br from-indigo-500 to-indigo-700',
      price: 54.99,
      rating: 4.6,
      reviewCount: 167,
      tutor: {
        name: 'James Wilson',
        avatar: '/tutors/james.jpg',
        university: 'NYU',
        universityColor: 'bg-purple-700',
        universityInitial: 'N'
      },
      level: 'Beginner',
      duration: '7 weeks'
    },
  ],
};

export default function FeaturedCourses(props: FeaturedCoursesProps) {
  const { t } = useLanguage();
  
  // Use translation keys or fallback to props/defaults
  const title = t('landing.featuredCourses.title');
  const subtitle = t('landing.featuredCourses.subtitle');
  const viewAllText = t('landing.featuredCourses.viewAll');
  const categoryLabels = {
    computerScience: t('landing.featuredCourses.category.computerScience'),
    mathematics: t('landing.featuredCourses.category.mathematics'),
    business: t('landing.featuredCourses.category.business')
  };
  const [activeCategory, setActiveCategory] = useState<string>('computer-science');

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <section id="featured-courses" className="py-20">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{title}</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {subtitle}
          </p>
        </motion.div>

        <Tabs 
          defaultValue="computer-science" 
          value={activeCategory}
          onValueChange={setActiveCategory}
          className="w-full"
        >
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex justify-center mb-8"
          >
            <TabsList className="grid grid-cols-3 w-full max-w-md">
              <TabsTrigger value="computer-science">{categoryLabels.computerScience}</TabsTrigger>
              <TabsTrigger value="mathematics">{categoryLabels.mathematics}</TabsTrigger>
              <TabsTrigger value="business">{categoryLabels.business}</TabsTrigger>
            </TabsList>
          </motion.div>

          {Object.keys(mockCourses).map((category) => (
            <TabsContent key={category} value={category} className="mt-0">
              <motion.div 
                variants={container}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {mockCourses[category as keyof CourseCategories].map((course) => (
                  <motion.div key={course.id} variants={item}>
                    <CourseCard course={course} />
                  </motion.div>
                ))}
              </motion.div>
            </TabsContent>
          ))}
        </Tabs>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center mt-12"
        >
          <Button size="lg" variant="outline" asChild>
            <Link href="/courses">
              {viewAllText}
              <ArrowRightIcon className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}

function CourseCard({ course }: CourseCardProps) {
  const { t } = useLanguage();
  const IconComponent = course.icon;
  
  return (
    <Card className="overflow-hidden h-full group">
      <div className="aspect-video relative overflow-hidden">
        {/* Gradient background with icon */}
        <div className={`absolute inset-0 ${course.iconBgClass} flex items-center justify-center`}>
          <div className="absolute inset-0 bg-black/10 backdrop-blur-sm z-10" />
          <motion.div 
            className="relative z-20"
            initial={{ scale: 0.8, opacity: 0.5 }}
            whileHover={{ scale: 1.1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <IconComponent className="h-20 w-20 text-white/90" strokeWidth={1.5} />
          </motion.div>
        </div>
        
        {/* Level badge */}
        <div className="absolute top-4 left-4 z-30">
          <Badge variant="secondary" className="bg-white/90 text-black">
            {course.level}
          </Badge>
        </div>
        
        {/* Duration badge */}
        <div className="absolute bottom-4 right-4 z-30">
          <Badge variant="secondary" className="bg-primary/90 text-white flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {course.duration}
          </Badge>
        </div>
      </div>
      
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8 ring-2 ring-primary/20">
              <AvatarImage src={course.tutor.avatar} alt={course.tutor.name} />
              <AvatarFallback>{course.tutor.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="text-sm">
              <p className="font-medium">{course.tutor.name}</p>
              <div className="flex items-center gap-1">
                <div 
                  className={`w-4 h-4 rounded-full flex items-center justify-center text-[8px] text-white font-bold ${course.tutor.universityColor}`}
                >
                  {course.tutor.universityInitial}
                </div>
                <span className="text-xs text-muted-foreground">{course.tutor.university}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center bg-amber-50 dark:bg-amber-950/30 px-2 py-1 rounded-md">
            <StarIcon className="h-4 w-4 fill-amber-400 text-amber-400" />
            <span className="text-sm font-medium ml-1">{course.rating}</span>
            <span className="text-xs text-muted-foreground ml-1">({course.reviewCount})</span>
          </div>
        </div>
        <h3 className="text-xl font-semibold mt-3 group-hover:text-primary transition-colors">{course.title}</h3>
      </CardHeader>
      
      <CardContent>
        <p className="text-muted-foreground text-sm line-clamp-2">{course.description}</p>
        <div className="flex items-center gap-2 mt-4 text-sm">
          <GraduationCap className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">{t('landing.featuredCourses.courseCard.courseBy')}</span>
          <span className="font-medium">{course.tutor.university}</span>
        </div>
      </CardContent>
      
      <CardFooter className="flex items-center justify-between pt-4 border-t">
        <div className="font-bold text-lg">
          <span className="text-sm text-muted-foreground mr-1">{t('landing.featuredCourses.courseCard.price')}</span>
          <span className="text-primary">${course.price}</span>
        </div>
        <Button size="sm" asChild>
          <Link href={`/courses/${course.id}`}>
            {t('landing.featuredCourses.courseCard.viewCourse')}
            <ArrowRightIcon className="ml-2 h-3 w-3" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
