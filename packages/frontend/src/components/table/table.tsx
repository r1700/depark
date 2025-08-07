

import React, { useState, useRef } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import './table.css';
import { useNavigate } from 'react-router-dom';
import DeleteConfirmDialog, { DeleteConfirmDialogRef } from '../DeleteConfirmDialog/DeleteConfirmDialog';

const DataTable = ({ data, editPath, deletePath }: { 
  data: { columns: any[], rows: any[] };
  editPath?: string;
  deletePath?: string;
}) => {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [orderBy, setOrderBy] = useState<string>('');
  const [sortMenuOpen, setSortMenuOpen] = useState<boolean>(false);
  const [selectedColumn, setSelectedColumn] = useState<string>('');
  const [hoveredOption, setHoveredOption] = useState<'asc' | 'desc' | null>(null);
  const [currentDeleteItem, setCurrentDeleteItem] = useState<any>(null);
  const deleteDialogRef = useRef<DeleteConfirmDialogRef>(null);

  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Handle delete button click
  const handleDelete = (row: any) => {
    if (deletePath && deleteDialogRef.current) {
      setCurrentDeleteItem(row);
      deleteDialogRef.current.openDialog();
    }
  };

  const stableSort = (array: any[], comparator: any) => {
    const stabilizedArray = array.map((el, index) => [el, index]);
    stabilizedArray.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });
    return stabilizedArray.map((el) => el[0]);
  };

  const comparator = (a: any, b: any) => {
    if (a[orderBy] < b[orderBy]) {
      return order === 'asc' ? -1 : 1;
    }
    if (a[orderBy] > b[orderBy]) {
      return order === 'asc' ? 1 : -1;
    }
    return 0;
  };

  if (!data || !Array.isArray(data.columns) || !Array.isArray(data.rows) || data.rows.length === 0) return <p>No data to display.</p>;

  const columns = data.columns;
  const rows = data.rows;

  return (
    <>
      <TableContainer className="table-container">
        <Table className="table" aria-label="data table" sx={{
          '& thead th': { width: '15%' }, '& tbody>tr,thead>tr': { height: '60px' },
          '& tbody>tr:hover': { backgroundColor: '#f5f5f5', border: 'none' },
          '& th:hover': { backgroundColor: '#3d54a1ff', border: '-2' }
        }} >
          <TableHead className="table-head">
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column.id}>
                  <IconButton
                    onClick={() => {
                      setSortMenuOpen(!sortMenuOpen);
                      setSelectedColumn(column.id);
                    }}
                  >
                    <MoreVertIcon htmlColor='#c4c1d3ff' />
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
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {stableSort(rows, comparator)
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, idx) => (
                <TableRow key={idx}>
                  {columns.map((column) => (
                    <TableCell key={column.id}>
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
                  <TableCell className="actions">
                    <IconButton 
                      color="success" 
                      aria-label="edit"
                      onClick={() => {
                      if (editPath) {
                          navigate(`${editPath}/${row.id}`);
                        }
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
        rowsPerPageOptions={[ 3, 5, 10,20]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        className="table-pagination"
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        ref={deleteDialogRef}
        itemData={currentDeleteItem}
        deletePath={deletePath || ''}
      />
    </>
  );
};

export default DataTable;