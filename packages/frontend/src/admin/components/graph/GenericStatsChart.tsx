// GenericStatsChart.tsx
import React, { useState, useRef, useLayoutEffect } from 'react';
import './GenericStatsChart.css';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  Tooltip as RechartsTooltip,
  Cell,
  LabelList,
  PieChart,
  Pie,
  CartesianGrid,
} from 'recharts';
import DataTable from '../table/table';

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import MuiTooltip from '@mui/material/Tooltip';
import { TabContext, TabList } from '@mui/lab';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { toPng } from 'html-to-image';
import { exportImageDataToPdf } from '../exportPDF'; // update path according to your project structure

const COLORS = [
  '#1976D2', '#00C49F', '#FFBB28', '#FF8042',
  '#A28FD0', '#FF6666', '#4c534cff', '#FF9933',
  '#6C5B7B', '#355C7D',
];

interface GenericStatsChartProps {
  data?: Array<Record<string, any>>;
  xKey?: string;
  barKeys?: string[];
  pieKeys?: string[];
  xLabel?: string;
  tableColumns?: { id: string; label?: string }[];
  tableRows?: Array<Record<string, any>>;
  title?: string;
  maxTabsWidth?: number;
  onTableRowClick?: (row: any) => void;
  chartRowsCount?: number;
}

interface PieDatum {
  name: string;
  value: number;
  color: string;
}

/* small SVG icons */
const IconTable = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
    <rect x="3" y="4" width="18" height="3" rx="1" fill="currentColor" />
    <rect x="3" y="10.5" width="18" height="3" rx="1" fill="currentColor" />
    <rect x="3" y="17" width="18" height="3" rx="1" fill="currentColor" />
  </svg>
);

const IconBar = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
    <rect x="4" y="10" width="3" height="10" rx="1" fill="currentColor" />
    <rect x="10.5" y="6" width="3" height="14" rx="1" fill="currentColor" />
    <rect x="17" y="2" width="3" height="18" rx="1" fill="currentColor" />
  </svg>
);

const IconPie = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
    <path d="M11 2v10H21A9 9 0 0 0 11 2z" fill="currentColor" />
    <path d="M11 12V2a10 10 0 1 0 10 10H11z" fill="rgba(255,255,255,0.12)" />
  </svg>
);

const GenericStatsChart: React.FC<GenericStatsChartProps> = ({
  data = [],
  xKey = 'name',
  barKeys = [],
  pieKeys = [],
  xLabel = '',
  tableColumns,
  tableRows,
  title,
  maxTabsWidth = 900,
  chartRowsCount,
  onTableRowClick,
}) => {
  const [view, setView] = useState<'table' | 'bar' | 'pie'>('table');
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [wrapperRect, setWrapperRect] = useState<{ left: number; width: number } | null>(null);
  const [exporting, setExporting] = useState(false);

  const updateWrapperRect = () => {
    const el = wrapperRef.current;
    if (!el) {
      setWrapperRect(null);
      return;
    }
    const rect = el.getBoundingClientRect();
    setWrapperRect({ left: Math.round(rect.left), width: Math.round(rect.width) });
  };

  useLayoutEffect(() => {
    updateWrapperRect();
    window.addEventListener('resize', updateWrapperRect);
    window.addEventListener('scroll', updateWrapperRect, true);

    let ro: ResizeObserver | undefined;
    if (wrapperRef.current && typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(() => updateWrapperRect());
      ro.observe(wrapperRef.current);
    }

    return () => {
      window.removeEventListener('resize', updateWrapperRect);
      window.removeEventListener('scroll', updateWrapperRect, true);
      ro?.disconnect();
    };
  }, []);

  // Ensure numeric values for keys
  const formattedData: Array<Record<string, any>> = (data || []).map((item) => {
    const newItem: Record<string, any> = { ...item };
    [...barKeys, ...pieKeys].forEach((key) => {
      newItem[key] = Number(item?.[key]) || 0;
    });
    return newItem;
  });

  const chartData = chartRowsCount && chartRowsCount > 0
    ? formattedData.slice(-chartRowsCount)
    : formattedData;

  const colorsByEntry = chartData.map((_, idx) => COLORS[idx % COLORS.length]);

  const pieData: PieDatum[] = chartData.map((item, idx) => ({
    name: String(item[xKey]),
    value: pieKeys.reduce((sum, key) => sum + (Number(item[key]) || 0), 0),
    color: colorsByEntry[idx % colorsByEntry.length],
  }));

  // prepare table payload for DataTable
  const dataTablePayload: {
    columns: { id: string; label?: string }[];
    rows: Array<Record<string, any>>;
  } = (() => {
    if (tableColumns && tableRows) {
      const rowsWithId = tableRows.map((r, idx) => ({ id: r.id ?? idx + 1, ...r }));
      return { columns: tableColumns, rows: rowsWithId };
    }
    if (tableRows) {
      const first = tableRows[0] ?? {};
      const cols = Object.keys(first).map((k) => ({ id: k, label: k }));
      const rowsWithId = tableRows.map((r, idx) => ({ id: r.id ?? idx + 1, ...r }));
      return { columns: cols, rows: rowsWithId };
    }
    if (tableColumns) {
      const rows = formattedData.map((row, idx) => {
        const newRow: Record<string, any> = {};
        tableColumns.forEach((c) => {
          newRow[c.id] = row[c.id];
        });
        newRow.id = row.id ?? idx + 1;
        return newRow;
      });
      return { columns: tableColumns, rows };
    }
    const dedupeKeys = Array.from(new Set([xKey, ...barKeys, ...pieKeys]));
    const cols = dedupeKeys.map((k) => ({ id: k, label: k }));
    const rows = formattedData.map((row, idx) => {
      const newRow: Record<string, any> = {};
      cols.forEach((c) => {
        newRow[c.id] = row[c.id];
      });
      newRow.id = row.id ?? idx + 1;
      return newRow;
    });
    return { columns: cols, rows };
  })();

  // determine if there is any data to show (either chart or table)
  const hasData = (chartData && chartData.length > 0) ||
                  (dataTablePayload && dataTablePayload.rows && dataTablePayload.rows.length > 0);

  const boxWidth = wrapperRect ? Math.min(wrapperRect.width, maxTabsWidth) : Math.min(900, maxTabsWidth);
  const boxLeft = wrapperRect ? Math.round(wrapperRect.left + (wrapperRect.width - boxWidth) / 2) : undefined;

  const tabBoxStyle: React.CSSProperties = boxLeft !== undefined
    ? { position: 'absolute', left: `${boxLeft}px`, width: `${boxWidth}px` }
    : { margin: '0 auto', width: `${boxWidth}px` };

  // Export handler: rasterize chart to PNG and send image data + title to exportImageDataToPdf
  const handleExportPdf = async () => {
    if (!wrapperRef.current) {
      alert('No export area available');
      return;
    }
    const chartNode = wrapperRef.current.querySelector('.chart-box') as HTMLElement | null;
    if (!chartNode) {
      alert('No chart found to export (chart-box)');
      return;
    }

    setExporting(true);
    try {
      // rasterize chart node to PNG (high DPI)
      const chartPngDataUrl = await toPng(chartNode, {
        backgroundColor: '#ffffff',
        cacheBust: true,
        pixelRatio: 2,
      });

      const orientation = chartNode.getBoundingClientRect().width > chartNode.getBoundingClientRect().height
        ? 'landscape'
        : 'portrait';

      // pass title so it will be printed on first page
      await exportImageDataToPdf(chartPngDataUrl, title ?? undefined, {
        filename: 'chart.pdf',
        orientation,
        marginMm: 8,
        imageType: 'PNG',
        quality: 0.92,
        multiPage: true,
        format: 'a4',
      });
    } catch (err) {
      console.error('Export failed', err);
      alert('Error exporting PDF');
    } finally {
      setExporting(false);
    }
  };

  // compute absolute left for the export button so it won't affect centered tabs
  const buttonLeftPx = boxLeft !== undefined ? boxLeft + boxWidth + 12 : undefined;

  return (
    <>
      <div className="chart-container">
        <div className="chart-wrapper" ref={wrapperRef}>
          {title && (
            <div className="component-title" role="heading" aria-level={2}>
              {title}
            </div>
          )}

          {/* Show a centered "no data" message when there's nothing to display */}
          {!hasData ? (
            <div
              className="no-data"
              role="status"
              aria-live="polite"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: 320,
                padding: 24,
                textAlign: 'center',
                color: '#444',
                background: 'transparent',
              }}
            >
              <div>
                <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 6 }}>No data to display</div>
                <div style={{ fontSize: 14, color: '#666' }}>No records matched the criteria</div>
              </div>
            </div>
          ) : (
            <>
              {view === 'table' && (
                <div className="table-wrapper">
                  <DataTable
                    data={dataTablePayload}
                    onRowClick={onTableRowClick}
                    enablePagination={false}
                    showActions={false}
                    maxHeight={420}
                    dense={true}
                  />
                </div>
              )}

              {view === 'bar' && (
                <div className="chart-box">
                  <ResponsiveContainer width="80%" height={360}>
                    <BarChart
                      data={chartData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
                      barCategoryGap={12}
                      barGap={6}
                    >
                      <CartesianGrid vertical={false} horizontal={true} strokeDasharray="3 3" stroke="#eee" />
                      <XAxis
                        dataKey={xKey}
                        interval={0}
                        angle={0}
                        textAnchor="middle"
                        height={60}
                        tick={{ fontSize: 14, fill: '#333' }}
                        label={{
                          value: xLabel || '',
                          position: 'insideBottom',
                          offset: 0,
                          className: 'chart-x-label' as any,
                        }}
                      />
                      <RechartsTooltip cursor={{ fill: 'rgba(0,0,0,0.06)' }} />
                      {barKeys.map((key) => (
                        <Bar key={key} dataKey={key} isAnimationActive={false}>
                          {chartData.map((entry, idx) => (
                            <Cell key={`cell-bar-${idx}-${key}`} fill={colorsByEntry[idx % colorsByEntry.length]} />
                          ))}
                          <LabelList dataKey={key} position="inside" style={{ fill: '#fff', fontWeight: 700 }} />
                        </Bar>
                      ))}
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}

              {view === 'pie' && (
                <div className="chart-box chart-box--center">
                  <div className="pie-column">
                    <ResponsiveContainer width="80%" height={360}>
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`}
                          outerRadius={140}
                          dataKey="value"
                        >
                          {pieData.map((entry, idx) => (
                            <Cell key={`cell-pie-${idx}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <RechartsTooltip />
                      </PieChart>
                    </ResponsiveContainer>

                    {xLabel && <div className="pie-xlabel">{xLabel}</div>}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <AppBar
        position="fixed"
        color="transparent"
        elevation={0}
        sx={{ top: 'auto', bottom: 0, backgroundColor: 'transparent', pointerEvents: 'auto', zIndex: 1300 }}
      >
        <Toolbar sx={{ minHeight: '64px', justifyContent: 'center', position: 'relative' }}>
          {/* centered tabs box (absolute positioned so it stays centered relative to wrapperRef) */}
          <Box style={tabBoxStyle} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <TabContext value={view}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider', position: 'relative', flex: 1 }}>
                <TabList
                  onChange={(_, newValue: string) => setView(newValue as 'table' | 'bar' | 'pie')}
                  aria-label="view tabs"
                  centered
                  variant="standard"
                  TabIndicatorProps={{
                    style: {
                      top: 0,
                      bottom: 'auto',
                      height: 3,
                      backgroundColor: 'var(--primary-blue)',
                    },
                  }}
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    '& .MuiTabs-flexContainer': { gap: 1, alignItems: 'center', justifyContent: 'center' },
                  }}
                >
                  <Tab label="Table" value="table" icon={<IconTable />} iconPosition="start" />
                  <Tab label="Bar chart" value="bar" icon={<IconBar />} iconPosition="start" />
                  <Tab label="Pie chart" value="pie" icon={<IconPie />} iconPosition="start" />
                </TabList>
              </Box>
            </TabContext>
          </Box>

          {/* Export button: positioned outside the centered box so it doesn't move the TabList */}
          {(view === 'bar' || view === 'pie') && hasData && (
            <div
              style={{
                position: 'absolute',
                left: buttonLeftPx !== undefined ? `${buttonLeftPx}px` : undefined,
                right: buttonLeftPx === undefined ? '12px' : undefined,
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 1400,
              }}
            >
              <MuiTooltip title="Export chart to PDF">
                <span>
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    startIcon={<PictureAsPdfIcon />}
                    onClick={handleExportPdf}
                    disabled={exporting}
                  >
                    {exporting ? 'Exporting...' : 'Export PDF'}
                  </Button>
                </span>
              </MuiTooltip>
            </div>
          )}
        </Toolbar>
      </AppBar>
    </>
  );
};

export default GenericStatsChart;