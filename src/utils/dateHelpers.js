import { format, startOfMonth, endOfMonth, subMonths, isAfter, isBefore, parseISO } from "date-fns";

export const formatDate = (date) => {
  return format(new Date(date), "MMM dd, yyyy");
};

export const formatDateShort = (date) => {
  return format(new Date(date), "MM/dd");
};

export const formatDateInput = (date) => {
  return format(new Date(date), "yyyy-MM-dd");
};

export const getCurrentMonth = () => {
  return format(new Date(), "MMMM yyyy");
};

export const getMonthRange = (date = new Date()) => {
  return {
    start: startOfMonth(date),
    end: endOfMonth(date)
  };
};

export const getPreviousMonth = (date = new Date()) => {
  return subMonths(date, 1);
};

export const isDateInRange = (date, startDate, endDate) => {
  const checkDate = typeof date === "string" ? parseISO(date) : date;
  return isAfter(checkDate, startDate) && isBefore(checkDate, endDate);
};

export const getLastSixMonths = () => {
  const months = [];
  for (let i = 5; i >= 0; i--) {
    const date = subMonths(new Date(), i);
    months.push({
      label: format(date, "MMM"),
      date: date,
      start: startOfMonth(date),
      end: endOfMonth(date)
    });
  }
  return months;
};