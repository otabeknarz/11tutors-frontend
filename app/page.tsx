'use client';

import React, { useEffect } from 'react';
import { useAuth } from '../lib/AuthContext';
import { useLanguage } from '../lib/LanguageContext';
import { ArrowRightIcon } from 'lucide-react';
import { motion, useAnimation, useInView } from 'framer-motion';

// Import landing page components
import Navbar from '@/components/landing/Navbar';
import HeroSection from '@/components/landing/HeroSection';
import HowItWorks from '@/components/landing/HowItWorks';
import FeaturedCourses from '@/components/landing/FeaturedCourses';
import WhyChooseUs from '@/components/landing/WhyChooseUs';
import ForTutors from '@/components/landing/ForTutors';
import Testimonials from '@/components/landing/Testimonials';
import JoinCommunity from '@/components/landing/JoinCommunity';
import CtaBanner from '@/components/landing/CtaBanner';
import Footer from '@/components/landing/Footer';

// Import UI components
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

const ScrollIndicator = () => {
  const { t } = useLanguage();
  
  return (
  <motion.div 
    className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center"
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 2, duration: 0.8 }}
  >
    <p className="text-sm text-muted-foreground mb-2">{t('landing.scrollIndicator.scrollToExplore')}</p>
    <motion.div 
      className="w-6 h-10 border-2 border-primary/50 rounded-full flex justify-center p-1"
      animate={{ y: [0, 10, 0] }}
      transition={{ repeat: Infinity, duration: 1.5 }}
    >
      <motion.div 
        className="w-1 h-2 bg-primary rounded-full"
        animate={{ y: [0, 15, 0] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
      />
    </motion.div>
  </motion.div>
  );
};

const SectionWrapper = ({ children, id }: { children: React.ReactNode, id: string }) => {
  const controls = useAnimation();
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  
  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    }
  }, [controls, isInView]);
  
  return (
    <motion.section
      id={id}
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0 }
      }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="relative overflow-hidden"
    >
      {children}
    </motion.section>
  );
};

export default function Home() {
  const { user } = useAuth();
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background relative">
      {/* Navbar - fixed at the top */}
      <Navbar />
      
      {/* Main content */}
      <ScrollArea className="h-screen">
        <main className="relative z-10">
          {/* Hero Section with scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <HeroSection />
            <ScrollIndicator />
          </motion.div>
          
          {/* How It Works */}
          <SectionWrapper id={t('landing.sections.howItWorks.id')}>
            <HowItWorks />
          </SectionWrapper>
          
          {/* Featured Courses */}
          <SectionWrapper id={t('landing.sections.courses.id')}>
            <FeaturedCourses />
          </SectionWrapper>
          
          {/* Why Choose Us */}
          <SectionWrapper id={t('landing.sections.whyChooseUs.id')}>
            <WhyChooseUs />
          </SectionWrapper>
          
          {/* For Tutors */}
          <SectionWrapper id={t('landing.sections.forTutors.id')}>
            <ForTutors />
          </SectionWrapper>
          
          {/* Testimonials */}
          <SectionWrapper id={t('landing.sections.testimonials.id')}>
            <Testimonials />
          </SectionWrapper>
          
          {/* Join Community */}
          <SectionWrapper id={t('landing.sections.joinCommunity.id')}>
            <JoinCommunity />
          </SectionWrapper>
          
          {/* CTA Banner */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <CtaBanner />
          </motion.div>
        </main>
        
        {/* Footer */}
        <Footer />
      </ScrollArea>
      
      {/* Sticky CTA Button */}
      {!user && (
        <motion.div 
          className="fixed bottom-6 right-6 z-50"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 3, type: 'spring' }}
        >
          <Button 
            size="lg" 
            onClick={() => window.location.href = '/register'}
          >
            {t('landing.ctaBanner.browseCourses')}
            <ArrowRightIcon className="h-5 w-5" />
          </Button>
        </motion.div>
      )}
    </div>
  );
}
