import { auth } from '@/auth';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { DropdownMenuItem } from '@radix-ui/react-dropdown-menu';
import { UserIcon } from 'lucide-react';
import Link from 'next/link';
import SignOutButton from './sign-out-button';

const UserButton = async () => {
  const session = await auth();
  const firstInitial = session?.user?.name?.charAt(0).toUpperCase() ?? 'U';

  if (!session) {
    return (
      <Button asChild>
        <Link href={'/sign-in'}>
          <UserIcon />
          Sign in
        </Link>
      </Button>
    );
  }

  return (
    <div className='flex items-center gap-2'>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className='flex item-center'>
            <Button
              variant='ghost'
              className='relative w-8 h-8 rounded-full flex items-center justify-center bg-gray-200'>
              {firstInitial}
            </Button>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className='w-56'
          align='end'
          forceMount>
          <DropdownMenuLabel className='font-normal'>
            <div className='flex flex-col space-y-1'>
              <div className='text-m font-medium leading-none'>{session.user?.name}</div>
              <div className='text-m text-muted-foreground leading-none'>{session.user?.email}</div>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuItem className='p-0 mb-1'>
            <SignOutButton />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default UserButton;
