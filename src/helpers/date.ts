export function formatDateOnly(date: string | Date): string {

  const dateObj = typeof date === "string" ? new Date(date) : date;
  return dateObj.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}
