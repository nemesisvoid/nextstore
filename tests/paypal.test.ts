import { generateAccessToken, paypal } from '../lib/paypal';

// test to generate

test('generates a token from paypal', async () => {
  const tokenResponse = await generateAccessToken();
  console.log(tokenResponse);
  expect(typeof tokenResponse).toBe('string');
  expect(tokenResponse.length).toBeGreaterThan(0);
});

test('create paypal order', async () => {
  const token = await generateAccessToken();
  const price = 10.0;
  const orderResponse = await paypal.createOrder(price);
  console.log(orderResponse);

  expect(orderResponse).toHaveProperty('id');
  expect(orderResponse).toHaveProperty('status');
  expect(orderResponse.status).toBe('CREATED');
  return orderResponse;
});

test('simulate capturing paypal order', async () => {
  const orderId = '1234567890';

  const mockCapturePayment = jest.spyOn(paypal, 'capturePayment').mockResolvedValue({ status: 'COMPLETED' });

  const captureResponse = await paypal.capturePayment(orderId);

  console.log(captureResponse);

  expect(captureResponse).toHaveProperty('status', 'COMPLETED');

  mockCapturePayment.mockRestore();
});
