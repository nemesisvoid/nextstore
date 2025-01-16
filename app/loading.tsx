import Image from 'next/image';
import loader from '@/assets/loader.gif';
const Loading = () => {
  return (
    <div className='flex justify-center items-center h-screen w-full'>
      <Image
        src={loader}
        alt='loader'
        width={50}
        height={50}
      />
    </div>
  );
};

export default Loading;
