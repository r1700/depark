import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Typography, Paper, Autocomplete, Checkbox, FormControlLabel, Snackbar, Alert } from '@mui/material';
export const styleModal = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  borderRadius: 2,
  p: 4,
  width: { xs: '90%', sm: 400 },
  align: 'center',
};
export type FieldConfig = {
  name: string;
  label: string;
  type?: FieldType;
  required?: boolean;
  options?: { label: string; value: any }[];
  disabled?: boolean | ((formData: any) => boolean);
};
export interface GenericFormProps {
  title: string;
  fields: FieldConfig[];
  initialState?: any;
  onSubmit: (data: any) => void | Promise<any>;
  onClose: () => void;
  entityToEdit?: Object | null;
  onChange?: (name: string, value: any) => void;
}
type FieldType = 'text' | 'number' | 'email' | 'select' | 'boolean';
export const GenericForm = ({
  title = 'Form',
  fields,
  initialState,
  onSubmit,
  onClose,
  entityToEdit = null,
  onChange,
}: GenericFormProps) => {
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({} as Partial<Record<string, string>>);
  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMessage, setSnackMessage] = useState<string>('');
  const [snackSeverity, setSnackSeverity] = useState<'success' | 'error' | 'info'>('success');
  const [lastSubmissionSuccess, setLastSubmissionSuccess] = useState<boolean | null>(null);
console.log(formData);
  useEffect(() => {
    if (entityToEdit) {
      setFormData(entityToEdit);
    }
  }, [entityToEdit]);
  const isFieldDisabled = (field: FieldConfig, data: any) => {
    if (typeof field.disabled === 'function') {
      try {
        return !!field.disabled(data);
      } catch {
        return false;
      }
    }
    return !!field.disabled;
  };
  useEffect(() => {
    const updates: any = {};
    let shouldUpdate = false;
    fields.forEach((field) => {
      const disabled = isFieldDisabled(field, formData);
      const name = String(field.name);
      const currentValue = (formData as any)[name];
      if (disabled && currentValue !== undefined && currentValue !== null && currentValue !== '') {
        shouldUpdate = true;
        if (field.type === 'boolean') {
          (updates as any)[name] = false;
        } else {
          (updates as any)[name] = undefined;
        }
      }
    });
    if (shouldUpdate) {
      setFormData((prev:any) => ({ ...prev, ...updates }));
    }
  }, [formData, fields]);
  const cancel = () => {
    setFormData(initialState);
    onClose();
    setErrors({});
  };
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | any
  ) => {
    const target = e?.target ?? e;
    const { name, value, type, checked } = target;
    if (type === 'checkbox') {
      const newVal = !!checked;
      setFormData((prev:any) => ({ ...prev, [name]: newVal }));
      if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
      if (onChange) onChange(String(name), newVal);
      return;
    }
    const parsedValue = type === 'number' ? Number(value) : value;
    setFormData((prev:any) => ({
      ...prev,
      [name]: parsedValue,
    }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
    if (onChange) onChange(String(name), parsedValue);
  };
  const handleValidate = (): boolean => {
    const newErrors: Partial<Record<string, string>> = {};
    fields.forEach((field) => {
      if (isFieldDisabled(field, formData)) return;
      const value = formData[field.name];
      if (field.required && (value === undefined || value === null || value === '')) {
        newErrors[field.name] = `${field.label} is required`;
        return;
      }
      if (field.type === 'email' && value) {
        const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
        if (!emailRegex.test(String(value).trim())) {
          newErrors[field.name] = 'Invalid email address';
        }
      }
      if (field.type === 'number' && (value !== undefined && value !== null && value !== '')) {
        const numValue = Number(value);
        if (isNaN(numValue)) {
          newErrors[field.name] = 'Value must be a number';
        } else if (numValue < 0) {
          newErrors[field.name] = 'Value cannot be negative';
        }
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const openSnack = (message: string, severity: 'success' | 'error' | 'info') => {
    setSnackMessage(message);
    setSnackSeverity(severity);
    setSnackOpen(true);
  };
  const handleSubmit = async () => {
    if (!handleValidate()) {
      console.log('Validation failed', errors);
      return false;
    }
    try {
      console.log('Submitting form data:', formData);
    const sanitizedData: Record<string, any> = {};
    for (const [key, value] of Object.entries(formData || {})) {
      if (value && typeof value === 'object') {
        if ('value' in value) {
          sanitizedData[key] = (value as any).value;
        } else {
          sanitizedData[key] = null;
        }
      } else {
        sanitizedData[key] = value;
      }
    }
  console.log('Sanitized data:', sanitizedData);
      const result = await Promise.resolve(onSubmit(sanitizedData || {}));
      if (result && (result as any).meta && (result as any).meta.requestStatus === 'rejected') {
        const message = (result as any).error?.message || (result as any).payload?.message || 'Operation failed';
        openSnack(message, 'error');
        setLastSubmissionSuccess(false);
        return;
      }
      if (result && typeof result === 'object' && 'success' in result && result.success === false) {
        const message = (result as any).message || 'Operation failed';
        openSnack(message, 'error');
        setLastSubmissionSuccess(false);
        return;
      }
      openSnack('Saved successfully', 'success');
      setLastSubmissionSuccess(true);
      setFormData(initialState);
      setErrors({});
    } catch (err: any) {
      const msg = err?.message || String(err) || 'Unknown error';
      openSnack(msg, 'error');
      setLastSubmissionSuccess(false);
    }
  };
  const handleSnackClose = (_: any, reason?: string) => {
    if (reason === 'clickaway') return;
    setSnackOpen(false);
    if (lastSubmissionSuccess) {
      onClose();
    }
  };
  return (
    <Paper sx={{ p: 4, maxWidth: 800, mx: 'auto', mt: 4, border: '2px solid #1976D2' }}>
      <Typography variant="h6" mb={2} color="primary" textAlign="center">
        {title}
      </Typography>
      <Box display="grid" gap={2} gridTemplateColumns={{ xs: '1fr', sm: '1fr 1fr', md: ' 1fr 1fr' }} key={String(entityToEdit || 'new')}>
        {fields.map((field) => {
          const disabled = isFieldDisabled(field, formData);
          const fieldKey = String(field.name);
          if (field.type === 'select') {
            const options = field.options || [];
            const selectedOption = options.find(opt => opt.value === (formData as any)[field.name]) || null;
            return (
              <Box sx={{ mb: 2 }} key={fieldKey}>
                <Autocomplete
                  disablePortal
                  options={options}
                  getOptionLabel={(opt) => opt?.label ?? ''}
                  value={selectedOption}
                  onChange={(event, newValue) => {
                    const val = newValue ? newValue.value : undefined;
                    handleChange({ target: { name: field.name, value: val, type: 'select' } });
                  }}
                  disabled={disabled}
                  renderInput={(params) =>
                    <TextField
                      required={field.required}
                      error={!!errors[field.name]}
                      helperText={errors[field.name]}
                      key={fieldKey}
                      {...params}
                      label={field.label}
                      disabled={disabled}
                    />
                  }
                  renderOption={(props, option) => (
                    <li {...props} key={option?.value ?? option?.label}>
                      {option?.label ?? option?.value}
                    </li>
                  )}
                  ListboxComponent={(props) => (
                    <Box key={fieldKey} {...props} sx={{ maxHeight: 200, overflowY: 'auto' }} />
                  )}
                />
              </Box>
            );
          }
          if (field.type === 'boolean') {
            return (
              <div key={fieldKey}>
                <FormControlLabel
                  control={
                    <Checkbox
                      name={String(field.name)}
                      required={field.required}
                      checked={!!(formData as any)[field.name]}
                      onChange={handleChange}
                      inputProps={{ 'aria-label': 'controlled' }}
                      disabled={disabled}
                    />
                  }
                  label={field.label}
                  sx={{ '& .MuiFormControlLabel-label': { color: 'text.primary' } }}
                />
              </div>
            );
          }
          return (
            <TextField
              key={fieldKey}
              label={field.label}
              name={String(field.name)}
              type={field.type || 'text'}
              value={(formData as any)[field.name] ?? ''}
              onChange={handleChange}
              required={field.required}
              error={!!errors[field.name]}
              helperText={errors[field.name]}
              InputLabelProps={{ style: { whiteSpace: 'normal' } }}
              fullWidth
              disabled={disabled}
            />
          );
        })}
      </Box>
      <Box mt={4} display="flex" gap={2} justifyContent="center">
        <Button variant="contained" onClick={handleSubmit}>
          {entityToEdit ? 'Update' : 'Add'}
        </Button>
        <Button variant="outlined" onClick={() => { setFormData(initialState); setErrors({}); onClose(); }}>
          Cancel
        </Button>
      </Box>
      <Snackbar open={snackOpen} autoHideDuration={3000} onClose={handleSnackClose} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert onClose={handleSnackClose} severity={snackSeverity} sx={{ width: '100%' }}>
          {snackMessage}
        </Alert>
      </Snackbar>
    </Paper>
  );
};
export default GenericForm;
