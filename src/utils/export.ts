/**
 * Utility functions for exporting data to Excel/CSV spreadsheets and printing/saving PDF documents.
 */

export const exportToCSV = (data: Record<string, any>[], filename: string) => {
  if (!data || data.length === 0) {
    alert('No data available to export.');
    return;
  }

  // Extract keys for headers
  const headers = Object.keys(data[0]);

  // Format headers row
  const csvRows: string[] = [];
  csvRows.push(headers.map(h => `"${h.replace(/"/g, '""')}"`).join(','));

  // Format data rows
  for (const row of data) {
    const values = headers.map(header => {
      const val = row[header];
      if (val === null || val === undefined) return '""';
      if (typeof val === 'object') return `"${JSON.stringify(val).replace(/"/g, '""')}"`;
      return `"${String(val).replace(/"/g, '""')}"`;
    });
    csvRows.push(values.join(','));
  }

  // Include UTF-8 BOM (\uFEFF) so Excel opens with proper character encoding and column formatting
  const csvString = '\uFEFF' + csvRows.join('\n');
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const triggerPDFPrint = (documentTitle?: string) => {
  if (documentTitle) {
    const originalTitle = document.title;
    document.title = documentTitle;
    window.print();
    setTimeout(() => {
      document.title = originalTitle;
    }, 1000);
  } else {
    window.print();
  }
};
