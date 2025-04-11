import { getCart } from '@/lib/actions/cart.actions';
import { CartTable } from './cart-table';

export const metadata = {
  title: 'Cart',
};

const CartPage = async () => {
  const cart = await getCart();
  return (
    <div>
      <CartTable cart={cart} />
    </div>
  );
};

export default CartPage;
