import React, { useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, TablePagination, IconButton,
  Backdrop,
  Box,
  Fade,
  Modal
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import './table.css';
import { useNavigate } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import GenericForm, { FieldConfig, styleModal } from '../forms/Form';
import { on } from 'events';
import './table.css';

import UserForm from '../../app/pages/user/UserForm/UserForm';
type DataTableProps = {
  data: { columns: any[]; rows: any[] };
  onRowClick?: (row: any) => void; 
  enablePagination?: boolean; 
  showActions?: boolean; 
  maxHeight?: number;
  dense?: boolean; 
  deletePath?: string; 
  title: string;
  fields?: FieldConfig[];
  initialState?: any;
  onSubmit?: (data: any) => void | Promise<any>;
  onClose?: () => void;
  entityToEdit?: Object | null;
  onChange?: (name: string, value: any) => void;
};
const DataTable: React.FC<DataTableProps> = ({
  data,
  onRowClick,
  enablePagination = false,
  showActions = true,
  maxHeight = 360,
  dense = true,
  deletePath = '',
  title = 'Form',
  fields,
  initialState,
  onSubmit,
  onClose,
  entityToEdit = null,
  onChange,
}) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [orderBy, setOrderBy] = useState<string>('');
  const [sortMenuOpen, setSortMenuOpen] = useState<boolean>(false);
  const [selectedColumn, setSelectedColumn] = useState<string>('');
  const [hoveredOption, setHoveredOption] = useState<'asc' | 'desc' | null>(null);
  const [currentDeleteItem, setCurrentDeleteItem] = useState<any>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [tableRows, setTableRows] = useState<any[]>(data.rows);
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const openModal = () => setShowModal(true);
  const closeModal = () => {
    setShowModal(false);
    setSelectedItem(null);
  };
  React.useEffect(() => {
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
  const columns = data.columns;
  const rows = tableRows;
  const sorted = stableSort(rows, comparator);
  const visibleRows = enablePagination ? sorted.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) : sorted;
  return (
    <>
      <TableContainer
        className="table-container"
        sx={
          enablePagination
            ? { maxHeight: maxHeight, overflow: 'auto' }   // אם משתמשים בעמודיות - שומרים גלגול פנימי
            : { maxHeight: 'unset', overflow: 'visible' }  // אחרת תנו לטבלה לגדול - גלגול רק בדף
        }
      >
        <Table
          className="table"
          aria-label="data table"
          sx={{
            '& thead th': { width: '15%' },
            '& tbody>tr, thead>tr': { height: dense ? '40px' : '60px' },
            '& tbody>tr:hover': { backgroundColor: '#F5F5F5', border: 'none' },
            '& th:hover': { backgroundColor: '#3d54a1ff', border: '-2' },
            '& td, & th': { padding: dense ? '6px 12px' : '12px 16px' },
          }}
        >
          <TableHead className="table-head">
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column.id}>
                  <IconButton
                    onClick={() => {
                      setSortMenuOpen(!sortMenuOpen);
                      setSelectedColumn(column.id);
                    }}
                    size="small"
                    aria-label={`sort-${column.id}`}
                  >
                    <MoreVertIcon htmlColor='#c4c1d3ff' fontSize="small" />
                  </IconButton>
                  {sortMenuOpen && selectedColumn === column.id && (
                    <div style={{ position: 'absolute', top: '50px', backgroundColor: '#fbfafeff', color: '#491fc7ff', border: '1px solid #ccc', padding: '10px', borderRadius: '4px' }}>
                      <div
                        onClick={() => {
                          setOrder('asc');
                          setOrderBy(column.id);
                          setHoveredOption(null);
                          setSortMenuOpen(false);
                        }}
                        onMouseEnter={() => setHoveredOption('asc')}
                        onMouseLeave={() => setHoveredOption(null)}
                        style={{
                          padding: '7px',
                          cursor: 'pointer',
                          backgroundColor: hoveredOption === 'asc' ? '#d4daf3ff' : 'transparent',
                          marginBottom: '2px'
                        }}
                      >
                        Ascending
                      </div>
                      <div
                        onClick={() => {
                          setOrder('desc');
                          setOrderBy(column.id);
                          setHoveredOption(null);
                          setSortMenuOpen(false);
                        }}
                        onMouseEnter={() => setHoveredOption('desc')}
                        onMouseLeave={() => setHoveredOption(null)}
                        style={{
                          padding: '7px',
                          cursor: 'pointer',
                          backgroundColor: hoveredOption === 'desc' ? '#d4daf3ff' : 'transparent',
                        }}
                      >
                        Descending
                      </div>
                    </div>
                  )}
                  {column.label}
                </TableCell>
              ))}
              {showActions && <TableCell>Actions</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {visibleRows.map((row, idx) => (
              <TableRow
                key={idx}
                hover={!!onRowClick}
                onClick={() => onRowClick && onRowClick(row)}
                sx={{ cursor: onRowClick ? 'pointer' : 'default' }}
              >
                {columns.map((column) => (
                  <TableCell key={column.id}>
                    {typeof row[column.id] === 'boolean' ? (
                      row[column.id] ? <CheckIcon color="success" fontSize="small" /> : <CloseIcon color="error" fontSize="small" />
                    ) : (
                      String(row[column.id])
                    )}
                  </TableCell>
                ))}
                {showActions && (
                  <TableCell className="actions">
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
                    <IconButton
                      color="error"
                      aria-label="delete"
                      onClick={() => handleDelete(row)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
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
      {/* Delete Confirmation Dialog */}
      {/* <DeleteConfirmDialog
        itemData={currentDeleteItem}
        deletePath={deletePath || ''}
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onDeleteResult={(result) => {
          setDeleteDialogOpen(false);
          if (result.success && currentDeleteItem) {
            const itemId = currentDeleteItem.lotId || currentDeleteItem.id || currentDeleteItem.logoId;
            setTableRows(prev => prev.filter(row => (row.lotId || row.id || row.logoId) !== itemId));
          }
          // Optionally handle error: show overlay, etc.
        }}
      /> */}
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
            sx: { backgroundColor: 'transparent' }
          },
        }}
      >
        <Fade in={showModal}>
          <Box sx={styleModal}>
            <GenericForm
              title={title}
              fields={fields ? fields : []}
              initialState={{}}
              onSubmit={onSubmit ? (d)=>onSubmit(d) : ()=>Promise.resolve()}
              onClose={closeModal}
              entityToEdit={selectedItem}
            />
          </Box>
        </Fade>
      </Modal>
    </>
  );
};
export default DataTable;