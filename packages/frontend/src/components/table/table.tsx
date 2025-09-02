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
  Backdrop,
  Box,
  Fade,
  Modal,
  Button,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import GenericForm, { FieldConfig, styleModal } from '../forms/Form';
import './table.css';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';

type DataTableProps = {
  data: { columns: any[]; rows: any[] };
  onRowClick?: (row: any) => void;
  enablePagination?: boolean; // כברירת מחדל TRUE
  showEdit?: boolean;
  showDelete?: boolean;
  maxHeight?: number;
  dense?: boolean;
  deletePath?: string;
  title: string;
  fields?: FieldConfig[];
  initialState?: any;
  onSubmit?: (data: any) => void | Promise<void>;
  showToolbar?: boolean;
  enableHorizontalScroll?: boolean;
  stickyColumns?: string[];
};

const DataTable: React.FC<DataTableProps> = ({
  data,
  onRowClick,
  enablePagination = true, // ברירת מחדל TRUE
  showEdit = true,
  showDelete = true,
  maxHeight = 400,
  dense = false,
  deletePath,
  title,
  fields,
  initialState,
  onSubmit,
  showToolbar = true,
  enableHorizontalScroll = true,
  stickyColumns = [],
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const tableRef = useRef<HTMLTableElement | null>(null);
  const horizRef = useRef<HTMLDivElement | null>(null);
  const externalInnerRef = useRef<HTMLDivElement | null>(null);
  const [horizPos, setHorizPos] = useState<{ left: number; width: number; bottom: number }>({
    left: 0,
    width: 0,
    bottom: 56,
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [orderBy, setOrderBy] = useState<string>('');
  const [sortMenuOpen, setSortMenuOpen] = useState<string | null>(null);
  const [selectedColumn, setSelectedColumn] = useState<string>('');
  const [hoveredOption, setHoveredOption] = useState<'asc' | 'desc' | null>(null);
  const [currentDeleteItem, setCurrentDeleteItem] = useState<any>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [tableRows, setTableRows] = useState<any[]>(data.rows);
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const columns = data.columns;
  const rows = tableRows;

  const enableStickySync = !!(data as any).enableStickySync;
  const shouldEnableStickyScroll = (stickyColumns && stickyColumns.length > 0) || enableStickySync;

  useLayoutEffect(() => {
    if (!shouldEnableStickyScroll) return;
    const update = () => {
      const tableW = tableRef.current?.scrollWidth ?? 0;
      if (externalInnerRef.current) {
        externalInnerRef.current.style.width = `${tableW}px`;
      }
      const rect = containerRef.current?.getBoundingClientRect();
      if (rect) {
        const left = rect.left + window.scrollX;
        const width = rect.width;
        const bottom = 56;
        setHorizPos({ left, width, bottom });
      }
    };
    const run = () => requestAnimationFrame(update);
    run();
    window.addEventListener('resize', run);
    window.addEventListener('scroll', run);
    return () => {
      window.removeEventListener('resize', run);
      window.removeEventListener('scroll', run);
    };
  }, [columns, tableRows, shouldEnableStickyScroll]);
  useEffect(() => {
    const horiz = horizRef.current;
    if (!horiz || !containerRef.current) return;

    const sync = () => {
      horiz.scrollLeft = containerRef.current!.scrollLeft;
    };

    containerRef.current.addEventListener('scroll', sync);
    return () => containerRef.current?.removeEventListener('scroll', sync);
  }, []);
  useEffect(() => {
    if (!shouldEnableStickyScroll) return;
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
  }, [columns, tableRows, shouldEnableStickyScroll]);

  const openModal = () => setShowModal(true);
  const closeModal = () => {
    setShowModal(false);
    setSelectedItem(null);
  };

  useEffect(() => {
    setTableRows(data.rows);
  }, [data.rows]);

  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDelete = (row: any) => {
    if (deletePath) {
      setCurrentDeleteItem(row);
      setDeleteDialogOpen(true);
    }
  };

  const confirmDelete = () => {
    if (currentDeleteItem) {
      setTableRows((prev) => prev.filter((r) => r !== currentDeleteItem));
    }
    setCurrentDeleteItem(null);
    setDeleteDialogOpen(false);
  };
  const cancelDelete = () => {
    setCurrentDeleteItem(null);
    setDeleteDialogOpen(false);
  };

  const stableSort = (array: any[], comparator: any) => {
    const stabilizedArray = array.map((el, index) => [el, index] as any);
    stabilizedArray.sort((a: any, b: any) => {
      const orderRes = comparator(a[0], b[0]);
      if (orderRes !== 0) return orderRes;
      return a[1] - b[1];
    });
    return stabilizedArray.map((el: any) => el[0]);
  };

  const comparator = (a: any, b: any) => {
    if (!orderBy) return 0;
    if (a[orderBy] < b[orderBy]) return order === 'asc' ? -1 : 1;
    if (a[orderBy] > b[orderBy]) return order === 'asc' ? 1 : -1;
    return 0;
  };

  if (!data || !Array.isArray(data.columns) || !Array.isArray(data.rows) || data.rows.length === 0)
    return <p>No data to display.</p>;

  const presentIcons = (showEdit ? 1 : 0) + (showDelete ? 1 : 0);
  const defaultRowHeightPx = dense ? 40 : 60;
  const reducePerMissingIcon = 12;
  let rowHeightPx = defaultRowHeightPx;
  if (presentIcons === 1) {
    rowHeightPx = Math.max(defaultRowHeightPx - reducePerMissingIcon, dense ? 32 : 48);
  } else if (presentIcons === 0) {
    rowHeightPx = Math.max(defaultRowHeightPx - 2 * reducePerMissingIcon, dense ? 24 : 36);
  }

  const sorted = stableSort(rows, comparator);
  const visibleRows = enablePagination ? sorted.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) : sorted;

  return (
    <>
      <TableContainer
        sx={{
          maxHeight: enablePagination ? maxHeight : 'unset',
          overflowY: enablePagination ? 'auto' : 'visible',
          overflowX: 'auto', // פס גלילה על הטבלה בלבד
          position: 'relative',
        }}
        ref={containerRef}
      >
        <Table
          ref={tableRef}
          sx={{
            minWidth: 900,
            tableLayout: 'auto',
          }}
        >
          <TableHead className="table-head">
            <TableRow>
              {columns.map((column) => (

                <TableCell key={column.id} sx={{ position: 'relative', whiteSpace: 'nowrap' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
                    <span>{column.label}</span>
                    <IconButton
                      size="small"
                      sx={{
                        color: '#fff',
                        '&:hover': { color: '#c4bdbd' },
                      }}
                      onClick={() =>
                        setSortMenuOpen(sortMenuOpen === column.id ? null : column.id)
                      }
                    >
                      <MoreVertIcon fontSize="small" />
                    </IconButton>

                    {sortMenuOpen === column.id && (
                      <Box
                        sx={{
                          position: 'absolute',
                          top: '100%',
                          right: 0,
                          backgroundColor: '#fff',
                          boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                          border: '0.5px solid #173164',
                          zIndex: 1500,
                        }}
                        onMouseLeave={() => setSortMenuOpen(null)}
                      >
                        <Box
                          sx={{
                            px: 2,
                            py: 1,
                            cursor: 'pointer',
                            backgroundColor: '#1e3687',
                            color: '#fff',
                            '&:hover': { backgroundColor: '#3d54a1ff' },
                          }}
                          onClick={() => {
                            setOrder('asc');
                            setOrderBy(column.id);
                            setSortMenuOpen(null);
                          }}
                        >
                          Ascending
                        </Box>
                        <Box
                          sx={{
                            px: 2,
                            py: 1,
                            cursor: 'pointer',
                            backgroundColor: '#1e3687',
                            color: '#fff',
                            borderTop: '1px solid #c4bdbd',
                            '&:hover': { backgroundColor: '#3d54a1ff' },
                          }}
                          onClick={() => {
                            setOrder('desc');
                            setOrderBy(column.id);
                            setSortMenuOpen(null);
                          }}
                        >
                          Descending
                        </Box>
                      </Box>
                    )}

                  </Box>
                </TableCell>
              ))}
              {(showEdit || showDelete) && <TableCell>Actions</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {visibleRows.map((row, idx) => (
              <TableRow
                key={idx}
                hover={!!onRowClick}
                sx={{ cursor: 'default' }}
              >
                {columns.map((column) => (
                  <TableCell key={column.id}>
                    {typeof row[column.id] === 'boolean'
                      ? row[column.id]
                        ? <CheckIcon color="success" fontSize="small" />
                        : <CloseIcon color="error" fontSize="small" />
                      : String(row[column.id])}
                  </TableCell>
                ))}
                {(showEdit || showDelete) && (
                  <TableCell className="actions">
                    {showEdit && (
                      <IconButton
                        color="success"
                        aria-label="edit"
                        onClick={() => {
                          setSelectedItem(row);
                          openModal();
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                    )}
                    {showDelete && (
                      <IconButton
                        color="error"
                        aria-label="delete"
                        onClick={() => {
                          setSelectedItem(row);
                          setDeleteDialogOpen(true);
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    )}
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box
        sx={{
          position: 'fixed',
          left: 0,
          right: 0,
          bottom: 0,
          height: 20,
          backgroundColor: '#fff',
          borderTop: '1px solid #c4bdbd',
          zIndex: 2000,
          overflowX: 'auto',
          overflowY: 'hidden',
        }}
        onScroll={(e) => {
          if (containerRef.current) {
            containerRef.current.scrollLeft = (e.target as HTMLElement).scrollLeft;
          }
        }}
        ref={horizRef}
      >
        <Box
          sx={{ width: tableRef.current?.scrollWidth ?? '100%', height: 1 }}
        />
      </Box>

      {enablePagination && (
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
      )}

      <Modal
        open={showModal}
        onClose={closeModal}
        aria-labelledby="add-user-modal-title"
        aria-describedby="add-user-modal-description"
        closeAfterTransition
        keepMounted
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
            sx: { backgroundColor: 'transparent' },
          },
        }}
      >
        <Fade in={showModal}>
          <Box sx={styleModal}>
            <GenericForm
              title={title}
              fields={fields ? fields : []}
              initialState={{}}
              onSubmit={onSubmit ? (d) => onSubmit(d) : () => Promise.resolve()}
              onClose={closeModal}
              entityToEdit={selectedItem}
            />
          </Box>
        </Fade>
      </Modal>
      <Dialog open={deleteDialogOpen} onClose={cancelDelete}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this item?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelDelete} color="primary">Cancel</Button>
          <Button
            onClick={() => {
              handleDelete(selectedItem);
              setDeleteDialogOpen(false);
            }}
            color="error"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DataTable;
