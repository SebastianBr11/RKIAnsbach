export function parseDate(dateString) {
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
