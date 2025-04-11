import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { APP_NAME } from '@/lib/constants';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import SignUpForm from './sign-up-form';

export const metadata: Metadata = {
  title: 'Sign Up',
};
const SignUpPage = async (props: { searchParams: Promise<{ callbackUrl: string }> }) => {
  const { callbackUrl } = await props.searchParams;

  console.log('callbackUrl', callbackUrl);

  const session = await auth();
  if (session) return redirect(callbackUrl || '/');
  console.log('callbackUrl2', callbackUrl);
  return (
    <div className='w-full max-w-md mx-auto'>
      <Card>
        <CardHeader className='space-y-4'>
          <Link
            className='flex-center'
            href='/'>
            <Image
              src='/images/logo.svg'
              width={50}
              height={50}
              alt={`${APP_NAME} logo`}
            />
          </Link>
          <CardTitle className='text-center'>Create Account</CardTitle>
          <CardDescription className='text-center'>Sign up to create your account</CardDescription>
        </CardHeader>
        <CardContent>
          <SignUpForm />
        </CardContent>
      </Card>
    </div>
  );
};

export default SignUpPage;
