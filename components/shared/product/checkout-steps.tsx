import { cn } from '@/lib/utils';
import React from 'react';

export const CheckOutSteps = ({ current = 0 }) => {
  return (
    <div className='flex-between flex-col md:flex-row space-x-2'>
      {['user login', 'Shipping address', 'Payment Method', 'Place Order'].map((step, i) => (
        <React.Fragment key={i}>
          <div className={cn('p-2 w-56 rounded-full text-center text-sm', i === current ? 'bg-secondary' : '')}>{step}</div>
          {step !== 'Place Order' && <hr className='w-16 border-t border-gray-300 mx-2' />}
        </React.Fragment>
      ))}
    </div>
  );
};
