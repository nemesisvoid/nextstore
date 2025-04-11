'use client';
import { Button } from '@/components/ui/button';
import { signOutUser } from '@/lib/actions/user.actions';
import { useRouter } from 'next/navigation';
import React from 'react';

const SignOutButton = () => {
  const router = useRouter();

  const handleSignOut = async (e: React.FormEvent) => {
    e.preventDefault();
    await signOutUser();
    router.refresh();
  };
  return (
    <form onSubmit={handleSignOut}>
      <Button
        className='w-full py-4 px-2 justify-start'
        variant='ghost'>
        Sign Out
      </Button>
    </form>
  );
};

export default SignOutButton;
