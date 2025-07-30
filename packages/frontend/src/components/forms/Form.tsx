import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Typography, Paper, MenuItem, Autocomplete, Checkbox, FormControlLabel } from '@mui/material';


export type FieldConfig<T> = {
  name: keyof T;
  label: string;
  type?: FieldType;
  required?: boolean;
  options?: string[];
};

export interface GenericFormProps<T> {
  title?: string;
  fields: FieldConfig<T>[];
  initialState: Partial<T>;
  onSubmit: (data: T) => void;
  onClose: () => void;
  entityToEdit?: Partial<T> | null;
}

type FieldType = 'text' | 'number' | 'email' | 'select' | 'boolean';

const GenericForm = <T extends { [key: string]: any }>({
  title = 'Form',
  fields,
  initialState,
  onSubmit,
  onClose,
  entityToEdit = null,
}: GenericFormProps<T>) => {
  const [formData, setFormData] = useState<Partial<T>>(initialState);
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});



  const cancel = () => {
    setFormData(initialState);
    onClose();
    setErrors({});
  };


  useEffect(() => {
    if (entityToEdit) {
      setFormData(entityToEdit);
    }
  }, [entityToEdit]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | any
  ) => {
    const { name, value, type } = e.target || e;
    if (type === 'select' || e.target?.value) {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    if (type === 'checkbox') {
      setIsChecked(!isChecked);
      setFormData((prev) => ({ ...prev, [name]: isChecked }));

    } else {
      const parsedValue = type === 'number' ? Number(value) : value;
      setFormData((prev) => ({
        ...prev,
        [name]: parsedValue,
      }));
    }

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleValidate = (): boolean => {
    const newErrors: Partial<Record<keyof T, string>> = {};
    fields.forEach((field) => {
      if (field.required && !formData[field.name]) {
        newErrors[field.name] = `${field.label} is required`;
      }

      if (field.type === 'email' && formData[field.name]) {
        const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
        if (!emailRegex.test(String(formData[field.name]).trim())) {
          newErrors[field.name] = 'Invalid email address';
        }
      }

      
      if (field.type === 'number' && formData[field.name]) {
        const numValue = Number(formData[field.name]);
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

  const handleSubmit = () => {
    if (!handleValidate()) {
      console.log('Validation failed', errors);
      return false;
    }
    onSubmit(formData as T);
    setFormData(initialState);
    onClose();
  };

  return (
    <Paper sx={{ p: 4, maxWidth: 800, mx: 'auto', mt: 4, border: '2px solid #1976d2' }}>
      <Typography variant="h6" mb={2} color="primary" textAlign="center">
        {title}
      </Typography>
      <Box
        display="grid"
        gap={2}
        gridTemplateColumns={{ xs: '1fr', sm: '1fr 1fr', md: ' 1fr 1fr' }}
      >
        {fields.map((field) => (
          (field.type === 'select' ? (
            <Box sx={{ mb: 2 }}>
              <Autocomplete
                disablePortal
                options={field.options || []}
                value={formData[field.name] ?? ''}
                onChange={(event, newValue) => {
                  handleChange({ target: { name: field.name, value: newValue } });
                }}

                renderInput={(params) => <TextField required={field.required}
                  error={!!errors[field.name]}
                  helperText={errors[field.name]}
                  key={field.label} {...params} label={field.label} onChange={handleChange} />}
                renderOption={(props, option) => (
                  <li {...props}>
                    {option}

                  </li>
                )}
                ListboxComponent={(props) => (
                  <Box
                    {...props}
                    sx={{
                      maxHeight: 200,
                      overflowY: 'auto',
                    }}
                  />
                )}
              />
            </Box>
          ) : field.type === 'boolean' ? (
            <div>
              <FormControlLabel
                control={
                  <Checkbox
                    required={field.required}
                    checked={isChecked}
                    onChange={handleChange}
                    inputProps={{ 'aria-label': 'controlled' }}
                  />
                }
                label={field.label}
                sx={{
                  '& .MuiFormControlLabel-label': {
                    color: 'text.primary',
                  }
                }}
              />
            </div>

          ) :
            (
              <TextField
                key={String(field.name)}
                label={field.label}
                name={String(field.name)}
                type={field.type || 'text'}
                value={formData[field.name] ?? ''}
                onChange={handleChange}
                required={field.required}
                error={!!errors[field.name]}
                helperText={errors[field.name]}
                InputLabelProps={{
                  style: { whiteSpace: 'normal' }
                }}
                fullWidth
              />
            )
          )))}
      </Box>










      <Box mt={4} display="flex" gap={2} justifyContent="center">

        <Button variant="contained" onClick={handleSubmit}>
          {entityToEdit ? 'Update' : 'Add'}
        </Button>
        <Button variant="outlined" onClick={cancel}>
          Cancel
        </Button>
      </Box>
    </Paper>
  );
}

export default GenericForm;