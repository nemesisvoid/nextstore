import { Button } from '@/components/ui/button';
import { APP_NAME } from '@/lib/constants';
import Image from 'next/image';
import Link from 'next/link';

const NotFoundPage = () => {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen'>
      <Image
        src='/images/logo.svg'
        width={50}
        height={50}
        alt={`${APP_NAME} logo`}
      />
      <div className='p-6 rounded-lg shadow-lg text-center w-1/3'>
        <h1 className='text-3xl font-bold mb-4'>Page Not Found</h1>
        <p className='text-destructive'>Could not find requested page</p>
        <Button
          className='mt-5 ml-2'
          variant='outline'
          asChild>
          <Link href='/'>Back to home</Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFoundPage;
