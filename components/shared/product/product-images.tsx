'use client';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

const ProductImages = ({ images }: { images: string[] }) => {
  const [currentImage, setCurrentImages] = useState(0);
  return (
    <div className='space-y-4'>
      <Image
        src={images[currentImage]}
        width={1000}
        height={1000}
        className='mih-h-[300px] object-cover object-center'
        alt='product image'
      />
      <div className='flex items-center gap-2'>
        {images.map((image, index) => (
          <div key={index}>
            <Image
              src={image}
              width={100}
              height={100}
              alt='product image'
              className={cn('cursor-pointer border  hover:border-orange-300', currentImage === index && 'border-orange-500')}
              onClick={() => setCurrentImages(index)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductImages;
