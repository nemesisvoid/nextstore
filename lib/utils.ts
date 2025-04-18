import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const convertToJson = <T>(value: T): T => {
  return JSON.parse(JSON.stringify(value));
};

export const formatPrice = (num: number): string => {
  const [int, decimal] = num.toString().split('.');
  return decimal ? `${int}.${decimal.padEnd(2, '0')}` : `${int}.00`;
};

//eslint-disable-next-line @typescript-eslint/no-explicit-any
export const formatError = (err: any) => {
  if (err.name === 'ZodError') {
    // handle zod errors
    const fieldErrors = Object.keys(err.errors).map(field => err.errors[field].message);

    return fieldErrors.join('. ');
  } else if (err.name === 'PrismaClientKnownRequestError' && err.code === 'P2002') {
    const field = err.meta?.target ? err.meta?.target[0] : 'Field';
    return `${field} already exists`;
    // handle unique constraint error
  } else {
    return typeof err.message === 'string' ? err.message : JSON.stringify(err.message);
  }
};

export const round2 = (value: string | number) => {
  if (typeof value === 'number') {
    return Math.round((value + Number.EPSILON) * 100) / 100;
  } else if (typeof value === 'string') {
    return Math.round((Number(value) + Number.EPSILON) * 100) / 100;
  } else {
    throw new Error('invalid value');
  }
};

const CURRENCY_FORMATTER = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 });

export const formatCurrency = (value: number | string | null) => {
  if (typeof value === 'number') {
    return CURRENCY_FORMATTER.format(value);
  } else if (typeof value === 'string') {
    return CURRENCY_FORMATTER.format(Number(value));
  } else {
    return 'NaN';
  }
};

export const formatId = (id: string) => {
  return `..${id.substring(id.length - 6)}`;
};

export const formatDateTime = (dateString: Date) => {
  const dateTimeOptions: Intl.DateTimeFormatOptions = {
    month: 'short', // abbreviated month name (e.g., 'Oct')
    year: 'numeric', // abbreviated month name (e.g., 'Oct')
    day: 'numeric', // numeric day of the month (e.g., '25')
    hour: 'numeric', // numeric hour (e.g., '8')
    minute: 'numeric', // numeric minute (e.g., '30')
    hour12: true, // use 12-hour clock (true) or 24-hour clock (false)
  };
  const dateOptions: Intl.DateTimeFormatOptions = {
    weekday: 'short', // abbreviated weekday name (e.g., 'Mon')
    month: 'short', // abbreviated month name (e.g., 'Oct')
    year: 'numeric', // numeric year (e.g., '2023')
    day: 'numeric', // numeric day of the month (e.g., '25')
  };
  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: 'numeric', // numeric hour (e.g., '8')
    minute: 'numeric', // numeric minute (e.g., '30')
    hour12: true, // use 12-hour clock (true) or 24-hour clock (false)
  };
  const formattedDateTime: string = new Date(dateString).toLocaleString('en-US', dateTimeOptions);
  const formattedDate: string = new Date(dateString).toLocaleString('en-US', dateOptions);
  const formattedTime: string = new Date(dateString).toLocaleString('en-US', timeOptions);
  return {
    dateTime: formattedDateTime,
    dateOnly: formattedDate,
    timeOnly: formattedTime,
  };
};
