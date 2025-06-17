'use client';

import { useLanguage } from '@/lib/LanguageContext';
import { BookOpenIcon, UsersIcon, ClockIcon, BanknoteIcon, ArrowRightIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function HowItWorks() {
  const { t } = useLanguage();

  const steps = [
    {
      icon: BookOpenIcon,
      title: t('landing.howItWorks.step1.title'),
      description: t('landing.howItWorks.step1.description'),
      color: 'from-blue-500 to-indigo-500'
    },
    {
      icon: UsersIcon,
      title: t('landing.howItWorks.step2.title'),
      description: t('landing.howItWorks.step2.description'),
      color: 'from-indigo-500 to-purple-500'
    },
    {
      icon: ClockIcon,
      title: t('landing.howItWorks.step3.title'),
      description: t('landing.howItWorks.step3.description'),
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: BanknoteIcon,
      title: t('landing.howItWorks.step4.title'),
      description: t('landing.howItWorks.step4.description'),
      color: 'from-pink-500 to-rose-500'
    }
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <section id="how-it-works" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('landing.howItWorks.title')}</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t('landing.howItWorks.description')}
          </p>
        </motion.div>

        <motion.div 
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div key={index} variants={item}>
                <Card className="relative overflow-hidden border-none shadow-md">
                  <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${step.color}`} />
                  <div className="absolute -top-4 -left-4 w-8 h-8 rounded-full bg-background flex items-center justify-center shadow-md z-10">
                    <span className="text-sm font-bold">{index + 1}</span>
                  </div>
                  <CardHeader>
                    <div className="mb-4 relative">
                      <div className={`absolute inset-0 bg-gradient-to-r ${step.color} rounded-full opacity-10 blur-xl`} />
                      <div className={`relative w-16 h-16 rounded-full bg-gradient-to-r ${step.color} flex items-center justify-center text-white`}>
                        <Icon className="h-8 w-8" />
                      </div>
                    </div>
                    <CardTitle>{step.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">{step.description}</CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mt-16 text-center"
        >
          <Button asChild>
            <Link href="/courses">
              {t('landing.howItWorks.startLearning')}
              <ArrowRightIcon className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
