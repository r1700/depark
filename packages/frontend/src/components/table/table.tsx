import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import './table.css';

interface DataTableProps {
  data: { columns: any[]; rows: any[] } | undefined;
  stickyColumns?: string[];
}

const DataTable: React.FC<DataTableProps> = ({ data, stickyColumns = [] }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [orderBy, setOrderBy] = useState<string>('');

  const containerRef = useRef<HTMLDivElement | null>(null);
  const tableRef = useRef<HTMLTableElement | null>(null);
  const horizRef = useRef<HTMLDivElement | null>(null);
  const externalInnerRef = useRef<HTMLDivElement | null>(null);

  const [horizPos, setHorizPos] = useState<{ left: number; width: number; bottom: number }>({
    left: 0,
    width: 0,
    bottom: 56,
  });

  const columns = data?.columns ?? [];
  const rows = data?.rows ?? [];

  useLayoutEffect(() => {
    const update = () => {
      const tableW = tableRef.current?.scrollWidth ?? 0;
      if (externalInnerRef.current) {
        externalInnerRef.current.style.width = `${tableW}px`;
      }

      const containerRect = containerRef.current?.getBoundingClientRect();
      if (containerRect) {
        const left = containerRect.left + window.scrollX;
        const width = containerRect.width;
        const bottom = 56; // נשאיר ברירת מחדל; אפשר להתאים אם צריך
        setHorizPos({ left, width, bottom });
      }
    };
    const run = () => {
      requestAnimationFrame(update);
    };
    run();

    window.addEventListener('resize', run);
    window.addEventListener('scroll', run);

    return () => {
      window.removeEventListener('resize', run);
      window.removeEventListener('scroll', run);
    };
  }, [columns, rows, page, rowsPerPage]);

  useEffect(() => {
    const container = containerRef.current;
    const horiz = horizRef.current;
    if (!container || !horiz) return;

    const onHorizScroll = () => {
      if (container.scrollLeft !== horiz.scrollLeft) {
        container.scrollLeft = horiz.scrollLeft;
      }
    };

    const onContainerScroll = () => {
      if (horiz.scrollLeft !== container.scrollLeft) {
        horiz.scrollLeft = container.scrollLeft;
      }
    };

    horiz.addEventListener('scroll', onHorizScroll);
    container.addEventListener('scroll', onContainerScroll);

    horiz.scrollLeft = container.scrollLeft;

    return () => {
      horiz.removeEventListener('scroll', onHorizScroll);
      container.removeEventListener('scroll', onContainerScroll);
    };
  }, [columns, rows]);

  if (!data || !Array.isArray(columns) || !Array.isArray(rows) || rows.length === 0) {
    return <p>No data to display.</p>;
  }

  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const stableSort = (array: any[], comparator: any) => {
    const stabilizedArray = array.map((el, index) => [el, index] as [any, number]);
    stabilizedArray.sort((a, b) => {
      const orderRes = comparator(a[0], b[0]);
      if (orderRes !== 0) return orderRes;
      return a[1] - b[1];
    });
    return stabilizedArray.map((el) => el[0]);
  };

  const comparator = (a: any, b: any) => {
    if (!orderBy) return 0;
    if (a[orderBy] < b[orderBy]) {
      return order === 'asc' ? -1 : 1;
    }
    if (a[orderBy] > b[orderBy]) {
      return order === 'asc' ? 1 : -1;
    }
    return 0;
  };

  const stickyLeftPositions = stickyColumns.reduce<number[]>((acc, _colId, idx) => {
    acc.push(idx * 150);
    return acc;
  }, []);

  const getStickyStyle = (colId: string) => {
    const idx = stickyColumns.indexOf(colId);
    if (idx === -1) return {};
    return {
      position: 'sticky',
      left: stickyLeftPositions[idx],
      backgroundColor: '#f5f5f5',
      minWidth: 150,
      whiteSpace: 'nowrap',
      boxShadow: '2px 0 5px -2px rgba(0,0,0,0.2)',
    };
  };

  const handleSort = (columnId: string, dir: 'asc' | 'desc') => {
    setOrder(dir);
    setOrderBy(columnId);
  };

  return (
    <>
      <TableContainer className="table-container" sx={{ overflowX: 'auto' }} ref={containerRef}>
        <Table
          className="table"
          aria-label="data table"
          ref={tableRef}
          sx={{
            tableLayout: 'auto',
            '& thead th': {
              position: 'sticky',
              top: 0,
              height: 60,
              backgroundColor: '#1e3687',
              color: '#fff',
              fontWeight: 'bold',
              whiteSpace: 'nowrap',
              zIndex: 20,
            },
            '& tbody > tr:hover': {
              backgroundColor: '#f5f5f5',
              border: 'none',
            },
            '& th:hover': {
              backgroundColor: '#3d54a1ff',
            },
          }}
        >
          <TableHead className="table-head">
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column.id} sx={getStickyStyle(column.id)}>
                  <span className="sort-btn" aria-hidden="false">
                    <button
                      type="button"
                      className={`triangle-btn up ${orderBy === column.id && order === 'asc' ? 'active' : ''}`}
                      onClick={() => handleSort(column.id, 'asc')}
                      aria-label={`sort ${column.id} ascending`}
                      title="Sort ascending"
                    />
                    <button
                      type="button"
                      className={`triangle-btn down ${orderBy === column.id && order === 'desc' ? 'active' : ''}`}
                      onClick={() => handleSort(column.id, 'desc')}
                      aria-label={`sort ${column.id} descending`}
                      title="Sort descending"
                    />
                  </span>

                  <span style={{ marginLeft: 8 }}>{column.label}</span>
                </TableCell>
              ))}
              <TableCell sx={getStickyStyle('actions')}>Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {stableSort(rows, comparator)
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, idx) => (
                <TableRow key={idx} hover>
                  {columns.map((column) => (
                    <TableCell key={column.id} sx={getStickyStyle(column.id)}>
                      {typeof row[column.id] === 'boolean' ? (
                        row[column.id] ? (
                          <CheckIcon color="success" />
                        ) : (
                          <CloseIcon color="error" />
                        )
                      ) : (
                        String(row[column.id])
                      )}
                    </TableCell>
                  ))}
                  <TableCell className="actions" sx={getStickyStyle('actions')}>
                    <IconButton color="success" aria-label="edit">
                      <EditIcon />
                    </IconButton>
                    <IconButton color="error" aria-label="delete">
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>

        <div style={{ height: 1, width: 0 }} />
      </TableContainer>

      <div
        ref={horizRef}
        className="external-h-scroll"
        style={{
          position: 'fixed',
          left: horizPos.left,
          width: horizPos.width,
          bottom: horizPos.bottom,
          height: 18,
          overflowX: 'auto',
          overflowY: 'hidden',
          zIndex: 9999,
          background: 'transparent',
        }}
      >
        <div ref={externalInnerRef} style={{ height: 1, width: 0 }} />
      </div>

      <TablePagination
        sx={{
          '& .MuiTablePagination-toolbar': {
            borderTop: '2px solid #c9c5dcff',
            backgroundColor: 'white',
          },
        }}
        rowsPerPageOptions={[3, 5, 10, 20]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        className="table-pagination"
      />
    </>
  );
};

export default DataTable;