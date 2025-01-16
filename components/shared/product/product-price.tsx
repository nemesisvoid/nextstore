import { cn } from '@/lib/utils';

const ProductPrice = ({ value, className }: { value: number; className?: string }) => {
  const stringValue = value.toFixed(2);
  const [int, floatValue] = stringValue.split('.');
  return (
    <p className={cn('text-2xl', className)}>
      <span className='text-xs align-super'>$</span>
      {int}
      <span className='text-xs align-super'>.{floatValue}</span>
    </p>
  );
};

export default ProductPrice;
