import dayjs from "dayjs";

export const getBase64 = (file) =>
new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
});

export const formatNumber = (number, multiplier) => {
    let result;
    if (number === null || number === undefined) {
      result = ''
    }
    if (number === 0) {
      result = 0
    }
    try {
      result = number.toLocaleString('en-US', {
        minimumFractionDigits: multiplier ?? 0,
        maximumFractionDigits: multiplier ?? 0,
      });
    } catch (error) {
      result = ''
    }
    return result;
  }

export const capitalizeFirstLetter = (string) => {
  if (!string) {
    return '';
  }
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export const filterOption = (input, option) =>
(option?.label ?? '').toLowerCase().includes(input.toLowerCase());



export const getDaysInMonth = (month, year) => {
    const daysInMonth = dayjs(`${year}-${month}`).daysInMonth();
    const daysArray = [];
    const firstDayOfWeek = dayjs(`${year}-${month}-01`).day();
    for (let day = 1; day <= daysInMonth; day++) {
        daysArray.push(dayjs(`${year}-${month}-${day}`));
    }
    for (let i = 1; i <= firstDayOfWeek; i++) {
      daysArray.unshift(-1);
  }
    return daysArray;
};

export const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};