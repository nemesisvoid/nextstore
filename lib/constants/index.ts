export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || 'Next Store';
export const APP_DESCRIPTION = process.env.NEXT_PUBLIC_APP_NAME || 'Modern Shopping Platform';
export const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000';

export const LATEST_PRODUCT_LIMIT = 4;

export const PAYMENT_METHODS = process.env.PAYMENT_METHODS ? process.env.PAYMENT_METHODS.split(',') : ['Paypal', 'Stripe', 'CashOnDelivery'];

export const DEFAULT_PAYMENT_METHOD = process.env.DEFAULT_PAYMENT_METHOD || 'CashOnDelivery';
