import dayjs from "dayjs";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

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

export function getNumber(text: string): number {
  if (!text) return 0;

  const trimmed = text.trim();

  // Nếu toàn bộ là số và dài > 10 => coi là UID
  if (/^\d{11,}$/.test(trimmed)) {
    return 0;
  }

  // Tìm số ở đầu chuỗi
  const match = trimmed.match(/^(\d+)/);
  return match ? parseInt(match[1], 10) : 0;
}

export function convertToTimestamp(dateString: string): string | null {
  const trimmed = dateString.trim();

  // ✅ Nếu đã đúng định dạng YYYY-MM-DD HH:mm:ss thì return luôn
  if (dayjs(trimmed, 'YYYY-MM-DD HH:mm:ss', true).isValid()) {
    return trimmed;
  }

  if (dayjs(trimmed, 'MM/DD/YYYY HH:mm:ss', true).isValid()) {
    return dayjs(trimmed, 'MM/DD/YYYY HH:mm:ss').format('YYYY-MM-DD HH:mm:ss');
  }

  // ✅ Thử parse theo định dạng M/D/YYYY h:mm A
  const parsed = dayjs(trimmed, 'M/D/YYYY h:mm A');

  if (!parsed.isValid()) {
    return null;
  }

  return parsed.format('YYYY-MM-DD HH:mm:ss');
}

/**
 * Export danh sách UID bị bỏ qua thành file Excel
 * @param {string[]} skippedUids - Danh sách UID bị skip
 * @param {string} filename - Tên file muốn lưu (.xlsx)
 */
export function exportSkippedUidsToExcel(skippedUids: string[], filename = 'skipped_uids.xlsx') {
  if (!Array.isArray(skippedUids) || skippedUids.length === 0) {
    return;
  }

  // Tạo dữ liệu dạng mảng object
  const data = skippedUids.map((uid, index) => ({
    STT: index + 1,
    UID: uid
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'SkippedUIDs');

  const excelBuffer = XLSX.write(workbook, {
    bookType: 'xlsx',
    type: 'array'
  });

  const blob = new Blob([excelBuffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  });

  saveAs(blob, filename);
}