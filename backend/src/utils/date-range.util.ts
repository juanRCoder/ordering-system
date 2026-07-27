// utils/date-range.util.ts
export type DateFilter = 'today' | 'yesterday' | 'older';

export function getDateRange(filter?: DateFilter) {
  if (!filter) return null;

  const now = new Date();

  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    0,
    0,
    0
  );
  const endOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    23,
    59,
    59,
    999
  );

  const startOfYesterday = new Date(startOfToday);

  startOfYesterday.setDate(startOfToday.getDate() - 1);
  const endOfYesterday = new Date(
    startOfYesterday.getFullYear(),
    startOfYesterday.getMonth(),
    startOfYesterday.getDate(),
    23,
    59,
    59,
    999
  );

  switch (filter) {
    case 'today':
      return { gte: startOfToday, lte: endOfToday };

    case 'yesterday':
      return { gte: startOfYesterday, lte: endOfYesterday };

    case 'older':
      return { lte: startOfYesterday };

    default:
      return null;
  }
}
