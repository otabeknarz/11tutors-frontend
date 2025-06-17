'use client';

import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '@/lib/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, useAnimation, useInView } from 'framer-motion';
import { 
  CheckCircle2, 
  Mail, 
  ArrowRight, 
  MessageCircle,
  Youtube,
  Twitter,
  Instagram,
  Globe,
  Users
} from 'lucide-react';

export default function JoinCommunity() {
  const { t } = useLanguage();
  const [subscribed, setSubscribed] = useState(false);
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

  // Form validation schema
  const formSchema = z.object({
    email: z.string().email({ message: 'Please enter a valid email address.' }),
  });

  // Initialize form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  });

  // Handle form submission
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    // In a real app, you would send this to your API
    console.log('Subscribing email:', values.email);
    setSubscribed(true);
    form.reset();
  };

  // Social media links with Lucide icons
  const socialLinks = [
    { 
      name: 'Discord', 
      icon: MessageCircle, 
      url: 'https://discord.gg/11tutors',
      color: 'bg-indigo-500 hover:bg-indigo-600'
    },
    { 
      name: 'Instagram', 
      icon: Instagram, 
      url: 'https://instagram.com/11tutors',
      color: 'bg-pink-500 hover:bg-pink-600'
    },
    { 
      name: 'YouTube', 
      icon: Youtube, 
      url: 'https://youtube.com/11tutors',
      color: 'bg-red-500 hover:bg-red-600'
    },
    { 
      name: 'Twitter', 
      icon: Twitter, 
      url: 'https://twitter.com/11tutors',
      color: 'bg-blue-400 hover:bg-blue-500'
    },
    { 
      name: 'Community', 
      icon: Users, 
      url: 'https://community.11tutors.com',
      color: 'bg-emerald-500 hover:bg-emerald-600'
    },
  ];

  return (
    <section id="join-community" className="py-20 relative overflow-hidden">
      {/* Background gradient elements */}
      <div className="absolute -z-10 top-1/4 right-0 w-1/3 h-1/2 bg-gradient-to-br from-primary/5 to-primary/0 rounded-full blur-3xl" />
      <div className="absolute -z-10 bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-tr from-secondary/5 to-secondary/0 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4" ref={containerRef}>
        <motion.div 
          initial="hidden"
          animate={controls}
          variants={containerVariants}
          className="max-w-3xl mx-auto text-center"
        >
          <motion.h2 
            className="text-3xl md:text-4xl font-bold mb-4"
            variants={itemVariants}
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
              {t('landing.joinCommunity.title')}
            </span>
          </motion.h2>
          <motion.p 
            className="text-xl text-muted-foreground mb-8"
            variants={itemVariants}
          >
            {t('landing.joinCommunity.subtitle')}
          </motion.p>

          {/* Newsletter signup form */}
          <motion.div 
            className="mb-16"
            variants={itemVariants}
          >
            <Card className="border bg-card/50 backdrop-blur-sm shadow-lg overflow-hidden">
              <CardContent className="p-8 relative">
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-primary/5 rounded-full blur-2xl" />
                <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-secondary/5 rounded-full blur-2xl" />
                
                <div className="relative z-10">
                  <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
                    <Mail className="w-3 h-3 mr-1" /> Newsletter
                  </Badge>
                  <h3 className="text-xl font-semibold mb-6">Get updates on new courses</h3>
                  
                  {subscribed ? (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 p-6 rounded-lg flex items-center justify-center gap-3"
                    >
                      <CheckCircle2 className="text-green-600 dark:text-green-400" />
                      <p>{t('landing.joinCommunity.newsletter.success')}</p>
                    </motion.div>
                  ) : (
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col sm:flex-row gap-3">
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormControl>
                                <div className="relative">
                                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                                  <Input 
                                    placeholder={t('landing.joinCommunity.newsletter.placeholder')} 
                                    type="email" 
                                    className="h-12 pl-10" 
                                    {...field} 
                                  />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button 
                          type="submit" 
                          className="h-12 px-6 gap-2 group"
                        >
                          {t('landing.joinCommunity.newsletter.button')}
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </form>
                    </Form>
                  )}
                  
                  <p className="text-xs text-muted-foreground mt-4">
                    {t('landing.joinCommunity.newsletter.disclaimer')}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Social media links */}
          <motion.div variants={itemVariants}>
            <h3 className="text-xl font-semibold mb-6">{t('landing.joinCommunity.social.title')}</h3>
            <motion.div 
              className="flex flex-wrap justify-center gap-4"
              variants={containerVariants}
            >
              {socialLinks.map((social, index) => {
                const SocialIcon = social.icon;
                return (
                  <motion.a 
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${social.color} text-white p-4 rounded-full shadow-md transition-all`}
                    aria-label={`Follow us on ${social.name}`}
                    variants={itemVariants}
                    whileHover={{ y: -5, scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <div className="w-6 h-6 flex items-center justify-center">
                      <SocialIcon className="w-5 h-5" />
                    </div>
                  </motion.a>
                );
              })}
            </motion.div>
            <motion.p 
              className="text-sm text-muted-foreground mt-6"
              variants={itemVariants}
            >
              {t('landing.joinCommunity.social.community')}
            </motion.p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
