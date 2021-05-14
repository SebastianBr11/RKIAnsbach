import AsyncStorage from '@react-native-async-storage/async-storage';

export function parseDate(dateString: string) {
  const parts = dateString.split(',');
  const dateParts = parts[0].split('.');
  const timeParts = parts[1].replace('Uhr', '').split(':');
  return new Date(
    parseInt(dateParts[2]),
    parseInt(dateParts[1]) - 1,
    parseInt(dateParts[0]),
    parseInt(timeParts[0]),
    parseInt(timeParts[1]),
  );
}

export function getDateBefore(days: number): string {
  let offsetDate = new Date();
  offsetDate.setHours(0, 0, 0, 0);
  offsetDate.setDate(new Date().getDate() - days);
  console.log('date before days', offsetDate.toISOString().split('T').shift());
  return offsetDate.toISOString().split('T').shift() || '';
}

export function areDatesSameDay(d1: Date, d2: Date): boolean {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

export function getDateYesterday(): Date {
  const date = new Date();
  date.setDate(date.getDate() - 1);
  return date;
}

export function getDateTomorrowFromDate(d: Date): Date {
  const newDate = new Date(d);
  newDate.setDate(newDate.getDate() + 1);
  return newDate;
}

export function getDayDifference(date1: Date, date2: Date): number {
  const diffTime = date1.getTime() - date2.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export function addDaysToDate(date: Date, days: number): Date {
  return new Date(date.getTime() + days * 1000 * 60 * 60 * 24);
}

export const useLocalStorage = (storageKey: string) => {
  const getItem = async () => {
    let data;

    try {
      data = await AsyncStorage.getItem(storageKey);
    } catch (e) {}

    return data || null;
  };

  const setItem = async (newValue: string) => {
    await AsyncStorage.setItem(storageKey, newValue);
  };

  return { getItem, setItem };
};
