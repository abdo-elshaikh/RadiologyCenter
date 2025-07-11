import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Button from './common/Button';

const ExportButton = ({ data, filename = 'export.csv', columns = [], onExport }) => {
  const [loading, setLoading] = useState(false);

  const exportToCSV = async () => {
    if (!data || data.length === 0) return;
    setLoading(true);
    try {
      if (onExport) {
        await onExport(data);
        return;
      }
      const headers = columns.length > 0 ? columns : Object.keys(data[0]);
      const csvContent = [
        headers.join(','),
        ...data.map(row =>
          headers.map(header => {
            const value = row[header];
            return typeof value === 'string' && (value.includes(',') || value.includes('"'))
              ? `"${value.replace(/"/g, '""')}"`
              : value;
          }).join(',')
        )
      ].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      onClick={exportToCSV}
      loading={loading}
      disabled={loading || !data || data.length === 0}
      className="btn-sm flex items-center gap-2"
      aria-label="Export CSV"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      Export CSV
    </Button>
  );
};

ExportButton.propTypes = {
  data: PropTypes.array.isRequired,
  filename: PropTypes.string,
  columns: PropTypes.array,
  onExport: PropTypes.func,
};

export default ExportButton; 