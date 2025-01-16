'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
} from '@/components/ui/dropdown-menu';
import { MoonIcon, SunIcon, SunMoonIcon } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

const ModeToggle = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className='focus-visible:ring-0 focus-visible:ring-offset-0'
          variant='ghost'>
          {theme === 'system' ? <SunMoonIcon /> : theme === 'dark' ? <MoonIcon /> : <SunIcon />}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Appearance</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem
          checked={theme === 'dark'}
          onCheckedChange={() => setTheme('dark')}>
          Dark
        </DropdownMenuCheckboxItem>

        <DropdownMenuCheckboxItem
          checked={theme === 'light'}
          onCheckedChange={() => setTheme('light')}>
          Light
        </DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ModeToggle;
