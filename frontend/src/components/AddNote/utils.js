export function groupByDay(array) {
  const grouped = {};

  array.forEach((c) => {
    const date = c.created_at.slice(0, 10);

    if (!grouped[date]) {
      grouped[date] = [];
    }
    grouped[date].push(c);
  });

  return grouped;
}

export function groupByMonth(notes) {
  const grouped = {};

  notes.forEach((n) => {
    const month = n.created_at.slice(0, 7);

    if (!grouped[month]) grouped[month] = [];
    grouped[month].push(n);
  });

  return grouped;
}

export function groupByYear(notes) {
  const grouped = {};

  notes.forEach((n) => {
    const year = n.created_at.slice(0, 4);

    if (!grouped[year]) grouped[year] = [];
    grouped[year].push(n);
  });

  return grouped;
}
