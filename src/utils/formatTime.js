import { format, getTime, formatDistanceToNow } from 'date-fns';
import * as moment from "moment";

// ----------------------------------------------------------------------

export function fDate(date, newFormat) {
  const fm = newFormat || 'dd MMM yyyy';

  // Parse the date and check if it's valid
  const parsedDate = new Date(date);
  const isValidDate = !isNaN(parsedDate.getTime());

  // Use the current date if the parsed date is invalid
  const dateToFormat = isValidDate ? parsedDate : new Date();

  return format(dateToFormat, fm);
}
export function fCurrentDate(date) {
  const fm =  'dd MMM yyyy';

  return  format(new Date(), fm);
}
export function fDateToNew(date) {
  return moment(date, 'MM-DD-YYYY').format('DD-MM-YYYY');
}

export function fDateTime(date) {
  return format(new Date(date), 'dd MMM yyyy HH:mm');
}

export function fTimestamp(date) {
  return getTime(new Date(date));
}

export function fDateTimeSuffix(date) {
  return format(new Date(date), 'dd/MM/yyyy hh:mm p');
}

export function fToNow(date) {
  return formatDistanceToNow(new Date(date), {
    addSuffix: true
  });
}
