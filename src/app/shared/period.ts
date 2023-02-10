import { format } from 'date-fns';

export const formatPeriod = (date: Date): string => format(date, 'yyyyMM');
