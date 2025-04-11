'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useActionState } from 'react';
import { signUpUser } from '@/lib/actions/user.actions';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
const SignUpForm = () => {
  const [data, action, isPending] = useActionState(signUpUser, { success: false, message: '' });

  console.log('data', data);

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
          <Label htmlFor='name'>Name</Label>
          <Input
            id='name'
            name='name'
            type='text'
            required
            autoComplete='name'
          />
        </div>

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
          <Label htmlFor='confirmPassword'>Confirm Password</Label>
          <Input
            id='confirmPassword'
            name='confirmPassword'
            type='password'
            required
            autoComplete='confirmPassword'
          />
        </div>

        <div>
          <Button
            className='w-full '
            variant='default'
            disabled={isPending}>
            {isPending ? 'Signing Up...' : 'Sign Up'}
          </Button>
        </div>

        {data && !data.success && (
          <div>
            <p className='text-center text-destructive'>{data.message}</p>
          </div>
        )}
        <div className='text-sm text-muted-foreground text-center'>
          Already have an account?{' '}
          <Link
            href='/sign-in'
            target='_self'
            className='link'>
            Sign In
          </Link>
        </div>
      </div>
    </form>
  );
};

export default SignUpForm;
