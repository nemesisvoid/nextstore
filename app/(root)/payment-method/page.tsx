import { auth } from '@/auth';
import { getUserById } from '@/lib/actions/user.actions';
import { Metadata } from 'next';
import { PaymentMethodForm } from './payment-method-form';
import { CheckOutSteps } from '@/components/shared/product/checkout-steps';

export const metadata: Metadata = {
  title: 'Payment Method',
};
const PaymentMethodPage = async () => {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) throw new Error('user not found');

  const user = await getUserById(userId);
  return (
    <div>
      <CheckOutSteps current={2} />
      <PaymentMethodForm preferredPaymentMethod={user.paymentMethod} />
    </div>
  );
};

export default PaymentMethodPage;
