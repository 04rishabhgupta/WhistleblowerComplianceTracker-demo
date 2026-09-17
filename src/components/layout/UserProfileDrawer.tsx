'use client';

import { useState, useMemo } from 'react';
import { Drawer } from 'vaul';
import useMeasure from 'react-use-measure';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { X, LogOut, Users, AlertTriangle } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export const UserProfileDrawer = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [view, setView] = useState('default');
  const [elementRef, bounds] = useMeasure();
  
  const { activeUser, users, setActiveUser } = useAppStore();

  const handleLogout = () => {
    setActiveUser(null);
    setIsOpen(false);
  };

  const handleSwitchUser = (userId: string) => {
    setActiveUser(userId);
    setIsOpen(false);
    setView('default');
  };

  const content = useMemo(() => {
    switch (view) {
      case 'default':
        return (
          <div>
            <div className="flex items-center justify-between w-full">
              <h2 className="text-lg font-medium text-neutral-900 dark:text-neutral-100">
                User Profile
              </h2>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800"
                onClick={() => setIsOpen(false)}
              >
                <X className="text-neutral-600 dark:text-neutral-400" size="18" />
              </Button>
            </div>
            
            <div className="mt-4 flex flex-col items-center justify-center space-y-2 mb-6">
               <Avatar className="h-16 w-16 border-2 border-primary">
                 <AvatarFallback className="bg-primary text-primary-foreground text-xl font-bold">
                   {activeUser?.avatar || 'U'}
                 </AvatarFallback>
               </Avatar>
               <div className="text-center">
                 <p className="font-semibold text-lg">{activeUser?.name}</p>
                 <p className="text-sm text-muted-foreground">{activeUser?.role}</p>
               </div>
            </div>

            <div className="mt-2 flex flex-col items-start gap-4">
              <button
                onClick={() => setView('switch')}
                className="bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-900 dark:text-neutral-100 font-medium flex items-center gap-3 w-full rounded-2xl px-4 py-3.5 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                <Users className="w-5 h-5" />
                Switch Persona
              </button>
              <button
                onClick={() => setView('logout')}
                className="bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 font-medium flex items-center gap-3 w-full rounded-2xl px-4 py-3.5 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
              >
                <LogOut className="w-5 h-5" />
                Log out
              </button>
            </div>
          </div>
        );
      case 'logout':
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-full text-red-600 dark:text-red-400">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800"
                onClick={() => {
                  setView('default');
                }}
              >
                <X className="text-neutral-600 dark:text-neutral-400" size="18" />
              </Button>
            </div>
            <h2 className="font-medium text-xl text-neutral-900 dark:text-neutral-100">
              Log out?
            </h2>

            <p className="text-neutral-500 dark:text-neutral-400 font-light text-base">
              Are you sure you want to log out of your session? You will be redirected to the landing page.
            </p>
            <div className="flex items-center justify-start gap-4 pt-4">
              <Button
                onClick={() => setView('default')}
                className="flex-1 h-12 bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600 text-neutral-900 dark:text-neutral-100 rounded-2xl text-lg transition-colors"
              >
                Cancel
              </Button>
              <Button
                onClick={handleLogout}
                className="flex-1 h-12 bg-red-500 hover:bg-red-600 text-white rounded-2xl text-lg transition-colors"
              >
                Log out
              </Button>
            </div>
          </div>
        );
      case 'switch':
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="p-2 bg-primary/10 rounded-full text-primary">
                <Users className="w-6 h-6" />
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800"
                onClick={() => {
                  setView('default');
                }}
              >
                <X className="text-neutral-600 dark:text-neutral-400" size="18" />
              </Button>
            </div>
            <h2 className="font-medium text-xl text-neutral-900 dark:text-neutral-100">
              Switch Persona
            </h2>
            
            <div className="flex flex-col gap-2 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
              {users.map((user) => (
                <button
                  key={user.id}
                  onClick={() => handleSwitchUser(user.id)}
                  className={`flex items-center justify-between w-full px-4 py-3 rounded-2xl transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
                    activeUser?.id === user.id 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-900 dark:text-neutral-100'
                  }`}
                >
                  <span className="font-medium">{user.name}</span>
                  <span className={`text-xs ${activeUser?.id === user.id ? 'text-primary-foreground/80' : 'text-neutral-500 dark:text-neutral-400'}`}>
                    {user.role}
                  </span>
                </button>
              ))}
            </div>
            
            <div className="pt-2">
              <Button
                onClick={() => setView('default')}
                className="w-full h-12 bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600 text-neutral-900 dark:text-neutral-100 rounded-2xl text-lg transition-colors"
              >
                Back
              </Button>
            </div>
          </div>
        );
    }
  }, [view, activeUser, users]);

  return (
    <Drawer.Root open={isOpen} onOpenChange={(open) => {
      setIsOpen(open);
      if (!open) setTimeout(() => setView('default'), 300);
    }}>
      <Drawer.Trigger asChild>
        {children}
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40 z-[100]" onClick={() => setIsOpen(false)} />
        <Drawer.Content
          asChild
          className="fixed inset-x-4 bottom-4 z-[100] mx-auto max-w-[361px] overflow-hidden rounded-[36px] bg-white dark:bg-neutral-900 outline-none md:mx-auto md:w-full"
        >
          <motion.div animate={{ height: bounds.height > 0 ? bounds.height : 'auto' }}>
            <div className="p-6" ref={elementRef}>
              {content}
            </div>
          </motion.div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
};
