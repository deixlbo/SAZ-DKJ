import * as XLSX from "xlsx";

export interface ExportOptions {
  filename: string;
  sheetName: string;
  columns: Array<{
    key: string;
    label: string;
    width?: number;
  }>;
}

/**
 * Export data to Excel file
 */
export function exportToExcel(
  data: any[],
  options: ExportOptions
) {
  if (!data || data.length === 0) {
    throw new Error("No data to export");
  }

  const transformedData = data.map((item) => {
    const row: any = {};
    options.columns.forEach((col) => {
      row[col.label] = item[col.key] || "";
    });
    return row;
  });

  const worksheet = XLSX.utils.json_to_sheet(transformedData);

  // Set column widths
  if (options.columns.length > 0) {
    worksheet["!cols"] = options.columns.map((col) => ({
      wch: col.width || 15,
    }));
  }

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(
    workbook,
    worksheet,
    options.sheetName
  );

  const filename = `${options.filename}-${new Date()
    .toISOString()
    .split("T")[0]}.xlsx`;
  XLSX.writeFile(workbook, filename);
}

/**
 * Generate print header for barangay documents
 */
export function getPrintHeader() {
  return {
    country: "Republic of the Philippines",
    province: "Province of Zambales",
    municipality: "Municipality of San Antonio",
    barangay: "Barangay Santiago",
    office: "Office of the Punong Barangay",
  };
}

/**
 * Format print header as HTML
 */
export function formatPrintHeader(): string {
  const header = getPrintHeader();
  return `
    <div style="text-align: center; margin-bottom: 20px; font-family: Arial, sans-serif; border-bottom: 2px solid black; padding-bottom: 10px;">
      <p style="margin: 5px 0; font-size: 12px; font-weight: bold;">${header.country}</p>
      <p style="margin: 5px 0; font-size: 12px; font-weight: bold;">${header.province}</p>
      <p style="margin: 5px 0; font-size: 12px; font-weight: bold;">${header.municipality}</p>
      <p style="margin: 5px 0; font-size: 14px; font-weight: bold;">${header.barangay}</p>
      <p style="margin: 5px 0; font-size: 12px; font-weight: bold;">${header.office}</p>
    </div>
  `;
}
