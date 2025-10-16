import React from 'react';
import { TextField, MenuItem, TextFieldProps } from '@mui/material';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';

type Option = {
  id: string | number;
  name: string;
};

type InputFieldProps<T extends FieldValues> = Omit<TextFieldProps, 'name'> & {
  name: Path<T>;
  control?: Control<T>;
  options?: Option[];
  rows?: number;
};

const InputField = <T extends FieldValues>({
  name,
  control,
  options,
  select,
  rows,
  children,
  ...props
}: InputFieldProps<T>) => {
  const { onChange: customOnChange, ...restProps } = props;

  const commonSx = {
    transform: props.type !== 'date' ? 'rotate(0.09deg)' : 'none',
    "& .MuiOutlinedInput-root": {
      // height: '48px',
      ...(props.type === 'textarea' ? {height: `auto`, padding: '2px', borderRadius: '8px',} : {height: '48px'}),
      borderRadius: '8px',
      position: 'relative',
      "& fieldset": {
        borderColor: "#404040",
        borderRadius: '8px',
      },
      "&:hover fieldset": {
        borderColor: "#404040",
      },
      "&.Mui-focused fieldset": {
        borderColor: 'transparent',
      },
      '&.Mui-focused:after': {
        content: '""',
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(136deg, #39f 0%, #00D4AA 100%)',
        padding: '1px',
        borderRadius: '8px',
        '-webkit-mask': 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
        '-webkit-mask-composite': 'xor',
        maskComposite: 'exclude',
        pointerEvents: 'none',
      },
      ...(rows ? null : {backgroundColor: "#1A1A1A"}),
      ...(select && { color: "#FFFFFF" }),
    },
    "& .MuiInputLabel-shrink": {
      backgroundColor: "#181818",
      padding: "0 5px",
    },
    ...(props.type === 'textarea' && {
      "& .MuiInputBase-root": {
        padding: '0px',  // Reduce from default ~16px
        border: 'none',
        backgroundColor: "transparent",
      },
      "& .MuiInputBase-input": {        
        padding: '10px',  // Padding inside the input field
        backgroundColor: "#1A1A1A",  // Dark background color
        border: 'none',
        boxShadow: 'none',  // Remove shadow
        borderRadius: '8px',  // Ensure the border-radius aligns properly
        // minHeight: `${(rows || 3) * 25}px`,  // Uncomment if you want explicit min-height
      },
      "& .MuiOutlinedInput-notchedOutline": {
        border: 'none', 
      },
      // Hide the second (hidden) textarea element
      "& .MuiInputBase-hiddenInput": {
        display: 'none', // Hide the extra hidden textarea element
      },
    }),
    ...(props.type === 'date' && {
      "& .MuiInputBase-input": {
        colorScheme: "dark",
      },
      "& input[type='date']::-webkit-calendar-picker-indicator": {
        cursor: "pointer",
        opacity: 1,
        display: "block",
      }
    }),
    ...(select && {
      "& .MuiSvgIcon-root": {
        color: "#FFFFFF",
      },
    }),
  };

  const commonInputLabelProps = {
    style: { color: "#999" },
    ...(props.type === 'date' && { shrink: true }),
  };

  const commonInputProps = {
    style: { color: "#FFFFFF" },
    ...(props.type === 'date' && { min: new Date().toISOString().split("T")[0] }),
  };

  const renderTextField = (field?: any, error?: any) => (
    <TextField
      {...field}
      {...restProps}
      select={select}
      fullWidth
      error={!!error}
      helperText={error?.message}
      InputLabelProps={{ ...commonInputLabelProps, ...props.InputLabelProps }}
      inputProps={{ ...commonInputProps, ...props.inputProps }}
      sx={{ ...commonSx, ...props.sx }}
      onChange={(e) => {
        field?.onChange?.(e);
        if (customOnChange) (customOnChange as any)(e);
      }}
      SelectProps={
        select
          ? {
              MenuProps: {
                PaperProps: {
                  sx: {
                    backgroundColor: '#1B1B1B',
                    borderRadius: '8px',
                    maxHeight: 263,
                    color: '#FFFFFF',
                  },
                },
              },
            }
          : undefined
      }
      {...(rows && rows > 1
        ? { multiline: true, rows } 
        : { multiline: false, rows: 1 })} 
    >
      {select
        ? options?.map((option) => (
            <MenuItem value={String(option.id)} key={option.id}>
              {option.name}
            </MenuItem>
          ))
        : children}
    </TextField>
  );

  return control && name ? (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => renderTextField(field, error)}
    />
  ) : (
    renderTextField()
  );
};

export default InputField;
