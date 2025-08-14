import React from 'react';
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Typography,
  Autocomplete,
  Chip,
} from '@mui/material';

export type FieldConfigGeneric<T> = {
  name: Extract<keyof T, string>;
  label?: string;
  placeholder?: string;
  type: 'free' | 'select' | 'multiSelect' | 'date' | 'dateRange' | 'number';
  options?: string[];
  valueAsArray?: boolean;
  fromKey?: Extract<keyof T, string>;
  toKey?: Extract<keyof T, string>;
};

interface FilterPanelProps<T extends Record<string, any>> {
  fields: FieldConfigGeneric<T>[];
  filters: Partial<T>;
  onChange: (filters: Partial<T>) => void;
  onClear: () => void;
}

const FilterPanel = <T extends Record<string, any>>({
  fields,
  filters,
  onChange,
  onClear,
}: FilterPanelProps<T>) => {
  const update = (key: string, value: any) => {
    onChange({ ...(filters as Record<string, any>), [key]: value } as Partial<T>);
  };

  const formatISODate = (val: any) => {
    if (!val) return '';
    const d = new Date(val);
    if (isNaN(d.getTime())) return '';
    return d.toISOString().slice(0, 10); 
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {fields.map((field) => {
        const name = field.name;
        const label = field.label ?? name;

        switch (field.type) {
          case 'free':
            return (
              <TextField
                key={name}
                label={label}
                value={(filters as Record<string, any>)[name] ?? ''}
                onChange={(e) => update(name, e.target.value)}
                size="small"
                placeholder={field.placeholder}
              />
            );

          case 'select': {
            const valueAsArray = !!field.valueAsArray;
            const raw = (filters as Record<string, any>)[name];
            const currentValue = valueAsArray
              ? (Array.isArray(raw) ? raw[0] ?? '' : '')
              : (raw ?? '');
            return (
              <FormControl size="small" key={name}>
                <InputLabel>{label}</InputLabel>
                <Select
                  label={label}
                  value={currentValue}
                  onChange={(e) => {
                    const val = e.target.value as string;
                    if (valueAsArray) {
                      update(name, val ? [val] : []);
                    } else {
                      update(name, val || undefined);
                    }
                  }}
                >
                  <MenuItem value="">None</MenuItem>
                  {(field.options ?? []).map((opt) => (
                    <MenuItem key={opt} value={opt}>
                      {opt}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            );
          }

          case 'multiSelect': {
            const current = ((filters as Record<string, any>)[name] ?? []) as string[];
            return (
              <Autocomplete
                key={name}
                multiple
                options={field.options ?? []}
                getOptionLabel={(opt) => opt}
                value={current}
                onChange={(_, newValue) => {
                  update(name, newValue && newValue.length ? [...newValue] : undefined);
                }}
                renderTags={(value: readonly string[], getTagProps) =>
                  value.map((option, index) => <Chip label={option} {...getTagProps({ index })} />)
                }
                renderInput={(params) => (
                  <TextField {...params} label={label} placeholder={field.placeholder} size="small" />
                )}
              />
            );
          }

          case 'date': {
            return (
              <TextField
                key={name}
                label={label}
                type="date"
                size="small"
                value={formatISODate((filters as Record<string, any>)[name])}
                onChange={(e) => update(name, e.target.value || undefined)}
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  inputProps: {
                    lang: 'en-US',
                    title: '',
                  },
                }}
              />
            );
          }

          case 'dateRange': {
            const fromKey = field.fromKey ?? `${name}From`;
            const toKey = field.toKey ?? `${name}To`;
            return (
              <Box key={name} sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography variant="body2">{label}</Typography>
                <TextField
                  label="From"
                  type="date"
                  size="small"
                  value={formatISODate((filters as Record<string, any>)[fromKey])}
                  onChange={(e) => update(fromKey, e.target.value || undefined)}
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    inputProps: {
                      lang: 'en-US',
                      title: '',
                    },
                  }}
                />
                <TextField
                  label="To"
                  type="date"
                  size="small"
                  value={formatISODate((filters as Record<string, any>)[toKey])}
                  onChange={(e) => update(toKey, e.target.value || undefined)}
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    inputProps: {
                      lang: 'en-US',
                      title: '',
                    },
                  }}
                />
              </Box>
            );
          }

          case 'number':
            return (
              <TextField
                key={name}
                label={label}
                type="number"
                value={(filters as Record<string, any>)[name] ?? ''}
                onChange={(e) =>
                  update(name, e.target.value ? Number(e.target.value) : undefined)
                }
                size="small"
                placeholder={field.placeholder}
              />
            );

          default:
            return null;
        }
      })}

      <Button variant="outlined" onClick={onClear}>
        Clear Filters
      </Button>
    </Box>
  );
};

export default FilterPanel;