const DATE_FORMATS = {
  ISO: 'YYYY-MM-DD',
  DISPLAY: 'DD/MM/YYYY',
  DATETIME: 'YYYY-MM-DD HH:mm:ss',
  TIMESTAMP: 'x',
};

const formatDate = (date, format = DATE_FORMATS.ISO) => {
  if (!date) return null;
  const d = new Date(date);
  if (isNaN(d.getTime())) return null;
  
  const useUtc = format === DATE_FORMATS.ISO || format === DATE_FORMATS.DISPLAY;
  const year = useUtc ? d.getUTCFullYear() : d.getFullYear();
  const month = String((useUtc ? d.getUTCMonth() : d.getMonth()) + 1).padStart(2, '0');
  const day = String(useUtc ? d.getUTCDate() : d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const seconds = String(d.getSeconds()).padStart(2, '0');

  switch (format) {
    case DATE_FORMATS.DISPLAY:
      return `${day}/${month}/${year}`;
    case DATE_FORMATS.DATETIME:
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    case DATE_FORMATS.TIMESTAMP:
      return d.getTime();
    default:
      return `${year}-${month}-${day}`;
  }
};

const parseDate = (dateString) => {
  if (!dateString) return null;
  const parsed = new Date(dateString);
  return isNaN(parsed.getTime()) ? null : parsed;
};

const addDays = (date, days) => {
  const source = new Date(date);
  const result = new Date(
    source.getUTCFullYear(),
    source.getUTCMonth(),
    source.getUTCDate(),
    source.getUTCHours(),
    source.getUTCMinutes(),
    source.getUTCSeconds(),
    source.getUTCMilliseconds(),
  );
  result.setDate(result.getDate() + days);
  return result;
};

const isAfter = (date1, date2) => {
  return new Date(date1) > new Date(date2);
};

const isBefore = (date1, date2) => {
  return new Date(date1) < new Date(date2);
};

module.exports = {
  DATE_FORMATS,
  formatDate,
  parseDate,
  addDays,
  isAfter,
  isBefore,
};
