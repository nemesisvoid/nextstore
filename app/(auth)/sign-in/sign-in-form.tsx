'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useActionState } from 'react';
import { signInUser } from '@/lib/actions/user.actions';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader, Loader2 } from 'lucide-react';

const SignInForm = () => {
  const [data, action, isPending] = useActionState(signInUser, { success: false, message: '' });

  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';
  return (
    <form action={action}>
      <input
        hidden
        name='callbackUrl'
        value={callbackUrl}
        readOnly={true}
      />
      <div className='space-y-6'>
        <div>
          <Label htmlFor='email'>Email</Label>
          <Input
            id='email'
            name='email'
            type='email'
            required
            autoComplete='email'
          />
        </div>
        <div>
          <Label htmlFor='password'>Password</Label>
          <Input
            id='password'
            name='password'
            type='password'
            required
            autoComplete='password'
          />
        </div>
        <div>
          <Button
            className='w-full '
            variant='default'
            disabled={isPending}>
            <div className='flex items-center gap-1'>
              {isPending && <Loader size={14} />}
              {isPending ? 'Signing In...' : 'Sign In'}
            </div>
          </Button>
        </div>

        <p className='text-2xl text-red-300'>{isPending}</p>
        {/* <Loader className='text-red  size-14 animate-spin' /> */}
        {data && !data.success && (
          <div>
            <p className='text-center text-destructive'>{data.message}</p>
          </div>
        )}
        <div className='text-sm text-muted-foreground text-center'>
          Don&apos;t have an account?{' '}
          <Link
            href='/sign-up'
            target='_self'
            className='link'>
            Sign Up
          </Link>
        </div>
      </div>
    </form>
  );
};

export default SignInForm;
