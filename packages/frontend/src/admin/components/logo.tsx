import React, { useState, useEffect } from "react";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import AddIcon from '@mui/icons-material/Add';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import Chip from '@mui/material/Chip';
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import DeleteConfirmDialog from './DeleteConfirmDialog/DeleteConfirmDialog';

const SCREEN_TYPES = ["CRM", "mobile", "tablet"];
type Logo = {
  id: number;
  logoUrl: string;
  updatedAt: string;
  updatedBy: string;
  name?: string;
  url?: string;
};
const API_BASE = "http://localhost:3001";

export default function AdminLogoManagement() {
  const [isDragOver, setIsDragOver] = useState(false);
  const [logos, setLogos] = useState<Logo[]>([]);
  const [originalLogos, setOriginalLogos] = useState<Logo[]>([]);
  const [selectedLogos, setSelectedLogos] = useState<{ [key: string]: string[] }>({});
  const [prevSelectedLogos, setPrevSelectedLogos] = useState<{ [key: string]: string[] }>({});
  const [overlayMessage, setOverlayMessage] = useState<string | null>(null);
  const [overlayType, setOverlayType] = useState<'success' | 'error' | null>(null);
  const [anchorEl, setAnchorEl] = useState<{ [key: string]: HTMLElement | null }>({});
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [logoDialogOpen, setLogoDialogOpen] = useState(false);
  const [selectedScreenType, setSelectedScreenType] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  // מערך לוגואים שממתינים להעלאה
  // State for pending logos
  // Remove prevSelectedLogos update on every logos/selectedLogos change
  // Instead, update prevSelectedLogos only after successful save
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [errorVisible, setErrorVisible] = useState(false);
  const [pendingLogos, setPendingLogos] = useState<File[]>([]);
  const [pendingLogosVersion, setPendingLogosVersion] = useState(0);
  // בדיקה האם יש שינוי בלוגואים של screenType
  function isScreenTypeChanged(screenType: string) {
    const current = selectedLogos[screenType] || [];
    const prev = prevSelectedLogos[screenType] || [];
    return JSON.stringify(current) !== JSON.stringify(prev);
  }

  // עדכן prevSelectedLogos רק אחרי טעינה ראשונית של screenTypeLogos
  useEffect(() => {
    const fetchScreenTypeLogos = async () => {
      const result: { [key: string]: string[] } = {};
      for (const type of SCREEN_TYPES) {
        try {
          const res = await fetch(`${API_BASE}/api/screentypes/${type}/logos`);
          const data = await res.json();
          result[type] = (data.logoIds || []).map(String);
        } catch {
          result[type] = [];
        }
      }
      setSelectedLogos(result);
      setPrevSelectedLogos(result); // עדכון ראשוני בלבד
    };
    fetchScreenTypeLogos();
  }, []);

  useEffect(() => {
    fetch(`${API_BASE}/api/logos`)
      .then((res) => res.json())
      .then((data) => {
        setLogos(data.logos);
        if (originalLogos.length === 0) setOriginalLogos(data.logos); // שמור רק פעם אחת!
      })
      .catch(() => {
        setLogos([]);
        if (originalLogos.length === 0) setOriginalLogos([]);
      });
  }, [originalLogos.length]);

  // When selectedLogos is fetched, set prevSelectedLogos to match (only on initial fetch)
  useEffect(() => {
    // Only set if prevSelectedLogos is empty (first load)
    if (Object.keys(prevSelectedLogos).length === 0 && Object.keys(selectedLogos).length > 0) {
      setPrevSelectedLogos({ ...selectedLogos });
    }
    // No update on every change, only first load
  }, [selectedLogos, prevSelectedLogos]);

  useEffect(() => {
    const fetchScreenTypeLogos = async () => {
      const result: { [key: string]: string[] } = {};
      for (const type of SCREEN_TYPES) {
        try {
          const res = await fetch(`${API_BASE}/api/screentypes/${type}/logos`);
          const data = await res.json();
          result[type] = (data.logoIds || []).map(String);
        } catch {
          result[type] = [];
        }
      }
      setSelectedLogos(result);
    };
    fetchScreenTypeLogos();
  }, []);

  useEffect(() => {
    if (overlayMessage) {
      setOverlayVisible(true);
      const timer = setTimeout(() => {
        setOverlayVisible(false);
        setOverlayMessage(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [overlayMessage]);

  const closeLogoDialog = () => {
    setLogoDialogOpen(false);
    setSelectedScreenType(null);
  };

  // Select logo for screen type
  const handleSelectLogo = (logoId: string) => {
    if (!selectedScreenType) return;
    setSelectedLogos(prev => {
      const prevArr = prev[selectedScreenType] || [];
      if (prevArr.includes(logoId)) {
        return prev;
      }
      return { ...prev, [selectedScreenType]: [...prevArr, logoId] };
    });
    closeLogoDialog();
  };

  // Remove logo from screen type
  const handleRemoveSelectedLogo = (screenType: string, logoId: string) => {
    setSelectedLogos(prev => {
      const updated = (prev[screenType] || []).filter(id => id !== logoId);
      return { ...prev, [screenType]: updated };
    });
  };

  // Save selected logos for a screen type to the server
  const handleSaveScreenTypeLogos = async (screenType: string) => {
    if (!isScreenTypeChanged(screenType)) {
      setOverlayMessage("לא בוצע שינוי בלוגואים");
      setOverlayType('error');
      return;
    }
    const logoIds = selectedLogos[screenType] || [];
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE}/api/screentypes/${screenType}/logos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ logoIds }),
        credentials: "include",
      });
      if (response.ok) {
        setOverlayMessage(`Logos saved successfully for ${screenType}!`);
        setOverlayType('success');
        // Update prevSelectedLogos only after successful save
        setPrevSelectedLogos(prev => ({ ...prev, [screenType]: [...logoIds] }));
        // עדכן את prevSelectedLogos לערך החדש
        setPrevSelectedLogos(prev => ({
          ...prev,
          [screenType]: [...logoIds]
        }));
      } else {
        const errorData = await response.json();
        if (errorData && errorData.missingIds) {
          setOverlayMessage(`Cannot save: Some logos were deleted or do not exist (IDs: ${errorData.missingIds.join(", ")})`);
          setOverlayType('error');
        } else if (errorData && errorData.error) {
          setOverlayMessage(`Error: ${errorData.error}`);
          setOverlayType('error');
        } else {
          setOverlayMessage(`Save failed for ${screenType}`);
          setOverlayType('error');
        }
      }
    } catch (error) {
      setOverlayMessage("Error saving logos");
      setOverlayType('error');
    } finally {
      setIsLoading(false);
    }
  };

  // עדכון סטייט אחרי מחיקה דרך הדיאלוג בלבד
  const handleDeleteLogo = async (id: number) => {
    const API_BASE = "http://localhost:3001";
    try {
      // לא למחוק ישירות, רק לעדכן סטייט אחרי דיאלוג
  setOverlayMessage("Logo deleted successfully!");
  setOverlayType('success');
      // Always fetch latest logos from server after deletion
      const res = await fetch(`${API_BASE}/api/logos`);
      if (res.ok) {
        const data = await res.json();
        setLogos(data.logos);
        setOriginalLogos(data.logos); // Update originalLogos after delete
        // Update selectedLogos to remove deleted logo from all screen types
        setSelectedLogos(prev => {
          const updated = { ...prev };
          Object.keys(updated).forEach(type => {
            updated[type] = updated[type].filter(logoId => logoId !== id.toString());
          });
          return updated;
        });
      }
    } catch (err: any) {
      if (err?.response?.status === 404) {
        setOverlayMessage("Logo no longer exists.");
        setOverlayType('error');
      } else {
        setOverlayMessage("Error deleting logo.");
        setOverlayType('error');
      }
    }
  };

  // Add missing handlers:
  const handleLogoFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;
    setPendingLogos(prev => {
      const existingKeys = new Set(prev.map(f => f.name + f.lastModified));
      const newFiles = Array.from(files).filter(f => !existingKeys.has(f.name + f.lastModified));
      if (newFiles.length < files.length) {
        setOverlayMessage('Some files already exist in the list and were not added again');
        setOverlayType('error');
      }
      return [...prev, ...newFiles];
    });
  };

  const handleSavePendingLogos = async () => {
    if (pendingLogos.length === 0) return;
    setIsLoading(true);
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const updatedBy = user.username || user.email || "admin";
    const existingNames = new Set(logos.map(l => l.name?.toLowerCase()));
    const duplicateFiles = pendingLogos.filter(file => {
      const name = file.name.toLowerCase();
      return existingNames.has(name);
    });
    if (duplicateFiles.length > 0) {
      setOverlayMessage(`Cannot upload: ${duplicateFiles.map(f => f.name).join(", ")} already exist in the system!`);
      setOverlayType('error');
      setIsLoading(false);
      return;
    }
    try {
      for (const file of pendingLogos) {
        const formData = new FormData();
        formData.append("logo", file);
        formData.append("updatedBy", updatedBy);
        const response = await fetch(`${API_BASE}/api/logos/upload`, {
          method: "POST",
          body: formData,
          credentials: "include",
        });
        if (!response.ok) {
          setOverlayMessage("Error saving logos");
          setOverlayType('error');
          setIsLoading(false);
          return;
        }
      }
      setOverlayMessage("Logos saved successfully!");
      setOverlayType('success');
      fetch(`${API_BASE}/api/logos`)
        .then((res) => res.json())
        .then((data) => setLogos(data.logos));
      setPendingLogos([]);
    } catch (error) {
      setOverlayMessage("Error saving logos");
      setOverlayType('error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemovePendingLogo = (index: number) => {
    setPendingLogos(prev => {
      const updated = prev.filter((_, i) => i !== index);
      setPendingLogosVersion(v => v + 1);
      return updated;
    });
  };

  // Restore drag-and-drop for logo upload
  const handleDropFiles = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
    if (files.length > 0) {
      setPendingLogos(prev => {
        const existingKeys = new Set(prev.map(f => f.name + f.lastModified));
        const newFiles = files.filter(f => !existingKeys.has(f.name + f.lastModified));
        if (newFiles.length < files.length) {
          setOverlayMessage('Some files already exist in the list and were not added again');
          setOverlayType('error');
        }
        return [...prev, ...newFiles];
      });
    } else {
      setOverlayMessage('Please drag only image files!');
      setOverlayType('error');
    }
  };

  return (
    <Box
      sx={{ maxWidth: 900, mx: 'auto', p: 3 }}
      onDragOver={e => { e.preventDefault(); setIsDragOver(true); }}
      onDragLeave={e => { e.preventDefault(); setIsDragOver(false); }}
      onDrop={handleDropFiles}
    >
      <Typography variant="h4" sx={{ mb: 2, fontWeight: 700, color: '#1976d2', textAlign: 'center' }}>Logo Management</Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <input type="file" multiple accept="image/*" onChange={handleLogoFileSelect} style={{ display: 'none' }} id="logo-upload" />
        <button
          type="button"
          style={{ padding: '8px 16px', background: '#1976d2', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 600 }}
          onClick={() => document.getElementById('logo-upload')?.click()}
        >
          Select Logos
        </button>
        <button onClick={handleSavePendingLogos} disabled={isLoading || pendingLogos.length === 0} style={{ padding: '8px 16px', background: isLoading || pendingLogos.length === 0 ? '#ccc' : '#43a047', color: '#fff', border: 'none', borderRadius: 6, cursor: isLoading || pendingLogos.length === 0 ? 'not-allowed' : 'pointer', fontWeight: 600 }}>Save Logos</button>
        {isLoading && <CircularProgress size={24} sx={{ ml: 2 }} />}
      </Box>
      {pendingLogos.length > 0 && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle1" sx={{ color: '#1976d2', mb: 1 }}>Logos pending upload:</Typography>
          <Box sx={{ display: 'flex', gap: 2, flexDirection: 'row', overflowX: 'auto', whiteSpace: 'nowrap' }}>
            {pendingLogos.map((file, idx) => (
              <PendingLogoDeleteBox key={file.name + file.lastModified} file={file} idx={idx} onDelete={handleRemovePendingLogo} />
            ))}
          </Box>
        </Box>
      )}
      <Typography variant="h5" sx={{ mt: 2, mb: 2, color: '#1976d2' }}>All Logos</Typography>
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 4, justifyContent: 'flex-start' }}>
        {logos.length === 0 && <Typography>No logos found.</Typography>}
        {logos.map((logo) => {
          const originalLogo = originalLogos.find(l => l.id === logo.id);
          const isNewLogo = !originalLogo;
          const nameFilled = logo.name && logo.name.trim() !== "";
          const urlFilled = logo.url && logo.url.trim() !== "";
          let isChanged: boolean;
          if (isNewLogo) {
            // New logo: allow save if either name or url is filled
            const savedLogo = originalLogos.find(l => l.id === logo.id);
            if (!savedLogo) {
              isChanged = !!(nameFilled || urlFilled);
            } else {
              // If already saved, enable if either name or url is changed (not both required)
              const nameChanged = logo.name !== (savedLogo.name || "");
              const urlChanged = logo.url !== (savedLogo.url || "");
              isChanged = nameChanged || urlChanged;
            }
          } else {
            const nameChanged = logo.name !== (originalLogo.name || "");
            const urlChanged = logo.url !== (originalLogo.url || "");
            isChanged = nameChanged || urlChanged;
          }
          if (isNewLogo && !isChanged && (logo.name || logo.url)) {
            // Mark logo as "active" (i.e., no longer new)
            // This happens automatically because originalLogos updates after save
          }
          // For new logo, save button is enabled only if there is a change in name or url and both are not empty
          // For existing logo, only if there is a change
          return (
            <Box key={logo.id} sx={{ border: '2px solid #1976d2', p: 1.5, borderRadius: 3, boxShadow: 2, textAlign: 'center', minWidth: 180, bgcolor: '#f5f5f5', display: 'flex', flexDirection: 'column', alignItems: 'center', mr: 2, mb: 2, position: 'relative' }}>
              <LogoDeleteBox logo={logo} onDelete={handleDeleteLogo} />
              {logo.url ? (
                <a href={logo.url} target="_blank" rel="noopener noreferrer">
                  <img
                    src={logo.logoUrl.startsWith('http') ? logo.logoUrl : `${API_BASE}${logo.logoUrl}`}
                    alt={`Logo ${logo.id}`}
                    style={{ width: 80, height: 80, objectFit: 'contain', borderRadius: 8, marginBottom: 8, background: '#fff', cursor: 'pointer' }}
                  />
                  
                </a>
              ) : (
                <img
                  src={logo.logoUrl.startsWith('http') ? logo.logoUrl : `${API_BASE}${logo.logoUrl}`}
                  alt={`Logo ${logo.id}`}
                  style={{ width: 80, height: 80, objectFit: 'contain', borderRadius: 8, marginBottom: 8, background: '#fff' }}
                />
              )}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'center', justifyContent: 'center', width: '100%', mb: 1 }}>
                <input
                  type="text"
                  placeholder="Logo Name"
                  value={logo.name || ""}
                  style={{ width: '90%', padding: 4, borderRadius: 4, border: '1px solid #ccc', marginBottom: 4 }}
                  onChange={e => {
                    const newName = e.target.value;
                    setLogos(prev => prev.map(l => l.id === logo.id ? { ...l, name: newName } : l));
                  }}
                />
                <input
                  type="text"
                  placeholder="Website URL"
                  value={logo.url || ""}
                  style={{ width: '90%', padding: 4, borderRadius: 4, border: '1px solid #ccc', marginBottom: 4 }}
                  onChange={e => {
                    const newUrl = e.target.value;
                    setLogos(prev => prev.map(l => l.id === logo.id ? { ...l, url: newUrl } : l));
                  }}
                />
                <button
                  style={{
                    background: '#1976d2',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 4,
                    padding: '4px 12px',
                    cursor: isChanged ? 'pointer' : 'not-allowed',
                    fontSize: 13,
                    marginBottom: 4,
                    opacity: isChanged ? 1 : 0.6
                  }}
                  disabled={!isChanged}
                  onClick={async () => {
                    if (!isChanged) return;
                    try {
                      const now = new Date().toISOString();
                      const response = await fetch(`${API_BASE}/api/logos/${logo.id}`, {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ name: logo.name, url: logo.url, logoUrl: logo.logoUrl, updatedBy: logo.updatedBy, updatedAt: now }),
                        credentials: "include",
                      });
                      if (response.ok) {
                        setOverlayMessage("Name & URL saved successfully!");
                        setOverlayType('success');
                        setLogos(prev => prev.map(l => l.id === logo.id ? { ...l, updatedAt: now } : l));
                        // Update originalLogos for this logo so change detection works
                        setOriginalLogos(prev => {
                          const exists = prev.some(l => l.id === logo.id);
                          if (exists) {
                            // Always update to latest name/url after save
                            return prev.map(l => l.id === logo.id ? { ...l, name: logo.name, url: logo.url, updatedAt: now } : l);
                          } else {
                            // New logo: add to originalLogos after first save
                            return [...prev, { ...logo, name: logo.name, url: logo.url, updatedAt: now }];
                          }
                        });
                      } else {
                        setOverlayMessage("Error saving name or URL.");
                        setOverlayType('error');
                      }
                    } catch {
                      setOverlayMessage("Error saving name or URL.");
                      setOverlayType('error');
                    }
                  }}
                  >Save Name & URL</button>
              </Box>
              <Typography variant="body2" sx={{ color: '#888', fontSize: 12 }}>
                Updated: {new Date(logo.updatedAt).toLocaleString()}
              </Typography>
            </Box>
          );
        })}
      </Box>
      <Typography variant="h5" sx={{ mt: 4, mb: 2, color: '#1976d2' }}>Select Logos for Each Screen Type</Typography>
      <Box sx={{ display: 'flex', flexDirection: 'row', gap: 4, flexWrap: 'nowrap', justifyContent: 'center', alignItems: 'stretch', pb: 2 }}>
        {SCREEN_TYPES.map(type => (
          <Box key={type} sx={{ minWidth: 260, boxShadow: 1, p: 2, borderRadius: 2, bgcolor: '#fafafa', flex: '1 1 0', mb: 0 }}>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>{type} Logos</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1 }}>
              {(selectedLogos[type] || []).map((id) => {
                const logo = logos.find(l => l.id.toString() === id);
                return logo ? (
                  <Chip
                    key={id}
                    label={<img src={logo.logoUrl.startsWith('http') ? logo.logoUrl : `${API_BASE}${logo.logoUrl}`} alt="logo" style={{ width: 32, height: 32, objectFit: 'contain', borderRadius: 4 }} />}
                    onDelete={() => handleRemoveSelectedLogo(type, id)}
                  />
                ) : null;
              })}
            </Box>
            <IconButton
              aria-label="הוסף לוגו"
              size="small"
              sx={{ background: '#e3f2fd', borderRadius: 2, fontWeight: 600, mb: 1 }}
              onClick={event => {
                setAnchorEl({ ...anchorEl, [type]: event.currentTarget });
              }}
            >
              <AddIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl[type]}
              open={Boolean(anchorEl[type])}
              onClose={() => setAnchorEl({ ...anchorEl, [type]: null })}
            >
              {logos.filter(l => !(selectedLogos[type] || []).includes(l.id.toString())).map((logo) => (
                <MenuItem key={logo.id} onClick={() => {
                  setSelectedLogos(prev => {
                    const prevArr = prev[type] || [];
                    return { ...prev, [type]: [...prevArr, logo.id.toString()] };
                  });
                  setAnchorEl({ ...anchorEl, [type]: null });
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <img
                      src={logo.logoUrl.startsWith('http') ? logo.logoUrl : `${API_BASE}${logo.logoUrl}`}
                      alt={`Logo ${logo.id}`}
                      style={{ width: 32, height: 32, objectFit: 'contain', borderRadius: 4 }}
                    />
                  </Box>
                </MenuItem>
              ))}
              {logos.filter(l => !(selectedLogos[type] || []).includes(l.id.toString())).length === 0 && (
                <MenuItem disabled>No logos available for selection</MenuItem>
              )}
            </Menu>
            <button
              style={{ marginTop: 4, padding: '6px 12px', background: '#43a047', color: '#fff', border: 'none', borderRadius: 4, cursor: (JSON.stringify(selectedLogos[type] || []) === JSON.stringify((prevSelectedLogos[type] || [])) || isLoading) ? 'not-allowed' : 'pointer', fontWeight: 600, opacity: (JSON.stringify(selectedLogos[type] || []) === JSON.stringify((prevSelectedLogos[type] || [])) || isLoading) ? 0.6 : 1 }}
              onClick={() => {
                if (JSON.stringify(selectedLogos[type] || []) === JSON.stringify((prevSelectedLogos[type] || []))) return;
                handleSaveScreenTypeLogos(type);
              }}
              disabled={JSON.stringify(selectedLogos[type] || []) === JSON.stringify((prevSelectedLogos[type] || [])) || isLoading}
            >
              Save logos for {type}
            </button>
          </Box>
        ))}
      </Box>
  {/* Logo selection dialog */}
      <Dialog open={logoDialogOpen} onClose={closeLogoDialog}>
        <DialogTitle>
          Select Logo
          <IconButton
            aria-label="close"
            onClick={closeLogoDialog}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box
            onDragOver={e => { e.preventDefault(); setIsDragOver(true); }}
            onDragLeave={e => { e.preventDefault(); setIsDragOver(false); }}
            onDrop={e => {
              e.preventDefault(); setIsDragOver(false);
              const files = Array.from(e.dataTransfer.files);
              const imageFiles = files.filter(f => f.type.startsWith('image/'));
              if (imageFiles.length > 0) {
                setPendingLogos(prev => [...prev, ...imageFiles]);
                setOverlayMessage('Logos are ready to upload, click Save to upload to the server');
                setOverlayType('success');
              } else {
                setOverlayMessage('No image files selected. Please select images only!');
                setOverlayType('error');
              }
            }}
            sx={{ mt: 2, mb: 2, p: 3, border: isDragOver ? '3px solid #43a047' : '3px dashed #1976d2', borderRadius: 4, textAlign: 'center', bgcolor: isDragOver ? '#c8e6c9' : '#e3f2fd', color: '#1976d2', cursor: 'pointer', transition: 'all 0.2s', position: 'relative', outline: isDragOver ? '3px solid #43a047' : 'none' }}
          >
            <Box
              sx={{ mt: 2, mb: 2, p: 3, border: isDragOver ? '3px solid #43a047' : '3px dashed #1976d2', borderRadius: 4, textAlign: 'center', bgcolor: isDragOver ? '#c8e6c9' : '#e3f2fd', color: '#1976d2', cursor: 'pointer', transition: 'all 0.2s', position: 'relative', outline: isDragOver ? '3px solid #43a047' : 'none' }}
            >
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <img src="https://mui.com/static/images/icons/image.svg" alt="drag here" style={{ width: 64, height: 64, opacity: 0.7, marginBottom: 8 }} />
                <Typography variant="h6" sx={{ fontWeight: 700, color: isDragOver ? '#388e3c' : '#1976d2', mb: 1 }}>
                  גרור תמונה לכאן
                </Typography>
                <Typography variant="body1" sx={{ color: '#555', mb: 1 }}>
                  או לחץ על "בחר לוגואים" להעלאה ידנית
                </Typography>
                {isDragOver && (
                  <Typography variant="body2" sx={{ color: '#43a047', fontWeight: 600 }}>
                    שחרר את הקובץ להעלאה
                  </Typography>
                )}
              </Box>
            </Box>
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel id="logo-select-label">Select Logo</InputLabel>
              <Select
                labelId="logo-select-label"
                value=""
                onChange={e => {
                  handleSelectLogo(e.target.value as string);
                }}
                displayEmpty
                renderValue={() => "Select a logo from the list"}
              >
                {logos.filter(l => !selectedScreenType || !(selectedLogos[selectedScreenType] || []).includes(l.id.toString())).map((logo) => (
                  <MenuItem key={logo.id} value={logo.id.toString()}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <img
                        src={logo.logoUrl.startsWith('http') ? logo.logoUrl : `${API_BASE}${logo.logoUrl}`}
                        alt={`Logo ${logo.id}`}
                        style={{ width: 32, height: 32, objectFit: 'contain', borderRadius: 4 }}
                      />
                    </Box>
                  </MenuItem>
                ))}
                {logos.filter(l => !selectedScreenType || !(selectedLogos[selectedScreenType] || []).includes(l.id.toString())).length === 0 && (
                  <MenuItem disabled>No logos available for selection</MenuItem>
                )}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
      </Dialog>
      {overlayVisible && overlayType === 'error' && (
        <Box sx={{
          position: 'fixed',
          bottom: 32,
          right: 32,
          zIndex: 2000,
          bgcolor: '#d32f2f',
          color: '#fff',
          px: 4,
          py: 2.5,
          borderRadius: 3,
          boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
          minWidth: 280,
          maxWidth: 400,
          textAlign: 'right',
          fontSize: '1.1rem',
          fontWeight: 700,
          pointerEvents: 'all',
          animation: 'fadeIn 0.3s',
        }}>
          {overlayMessage}
          <Box sx={{ position: 'absolute', inset: 0, bgcolor: 'rgba(0,0,0,0.05)', zIndex: -1 }} />
        </Box>
      )}
      {overlayVisible && overlayType === 'success' && (
        <Box sx={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 2000,
          bgcolor: '#1976d2',
          color: '#fff',
          px: 4,
          py: 2.5,
          borderRadius: 3,
          boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
          minWidth: 280,
          maxWidth: 400,
          textAlign: 'center',
          fontSize: '1.1rem',
          fontWeight: 700,
          pointerEvents: 'all',
          animation: 'fadeIn 0.3s',
        }}>
          {overlayMessage}
          <Box sx={{ position: 'absolute', inset: 0, bgcolor: 'rgba(0,0,0,0.05)', zIndex: -1 }} />
        </Box>
      )}
      {overlayVisible && (
        <Box sx={{
          position: 'fixed',
          inset: 0,
          zIndex: 1999,
          bgcolor: 'rgba(0,0,0,0.15)',
          pointerEvents: 'all',
        }} />
      )}
    </Box>
  );
}

// Internal component for logo deletion with dialog
type PendingLogoDeleteBoxProps = {
  file: File;
  idx: number;
  onDelete: (idx: number) => void;
};
const PendingLogoDeleteBox: React.FC<PendingLogoDeleteBoxProps> = ({ file, idx, onDelete }) => (
  <Box sx={{ border: '1px solid #ccc', p: 1, borderRadius: 2, bgcolor: '#fff', display: 'flex', alignItems: 'center', gap: 1 }}>
    <span>{file.name}</span>
  <button style={{ background: '#d32f2f', color: '#fff', border: 'none', borderRadius: 4, padding: '2px 8px', cursor: 'pointer', fontWeight: 600 }} onClick={() => onDelete(idx)} aria-label="Delete logo">✖</button>
  </Box>
);

type LogoDeleteBoxProps = {
  logo: Logo;
  onDelete: (id: number) => void;
};
const LogoDeleteBox: React.FC<LogoDeleteBoxProps> = ({ logo, onDelete }) => {
  const [open, setOpen] = React.useState(false);
  const API_BASE = "http://localhost:3001";
  const [deleteLoading, setDeleteLoading] = React.useState(false);
  return (
    <>
      <IconButton
        aria-label="Delete logo"
        size="small"
        sx={{
          position: 'absolute',
          top: 8,
          right: 8,
          color: '#616161',
          bgcolor: 'rgba(255,255,255,0.95)',
          boxShadow: 2,
          zIndex: 10,
          transition: 'background 0.2s, color 0.2s',
          '&:hover': {
            bgcolor: '#e3f2fd',
            color: '#1976d2',
          },
        }}
        onClick={() => setOpen(true)}
        disabled={deleteLoading}
      >
        <DeleteIcon fontSize="small" />
      </IconButton>
      <DeleteConfirmDialog
        itemData={{ name: logo.name, id: logo.id }}
        deletePath={`${API_BASE}/api/logos`}
        open={open}
        onClose={() => setOpen(false)}
        onDeleteResult={async (result) => {
          setOpen(false);
          setDeleteLoading(false);
          if (result.success) {
            await onDelete(logo.id);
          } else {
            // Show error overlay in parent
            if (window && window.dispatchEvent) {
              window.dispatchEvent(new CustomEvent('logo-delete-error', { detail: result.error }));
            }
          }
        }}
      />
    </>
  );
};