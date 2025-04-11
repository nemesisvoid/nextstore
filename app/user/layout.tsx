import { APP_NAME } from '@/lib/constants';
import Image from 'next/image';
import Link from 'next/link';

export default function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <div className='flex flex-col'>
        <div className='border-b container mx-auto'>
          <div className='flex items-center h-16 px-4'>
            <Link
              href='/'
              className='w-22'>
              <Image
                src='/images/logo.svg'
                width={48}
                height={48}
                alt={APP_NAME + ' logo'}
              />
            </Link>

            {/*main nav*/}

            <div className='ml-auto flex items-center space-x-4'>
              <div className='flex-1 space-y-4 p-8 pt-6 container mx-auto'>{children}</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
