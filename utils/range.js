// "2026-09" -> [start, end) in UTC
exports.monthRange = (month) => {
  const m = /^(\d{4})-(0[1-9]|1[0-2])$/.exec(month || '');
  if (!m) {
    const err = new Error('month must be YYYY-MM');
    err.status = 400;
    throw err;
  }
  const y = +m[1], mo = +m[2] - 1;
  return { start: new Date(Date.UTC(y, mo, 1)), end: new Date(Date.UTC(y, mo + 1, 1)) };
};