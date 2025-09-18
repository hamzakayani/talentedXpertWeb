import React from 'react';
import { TextField, MenuItem, TextFieldProps } from '@mui/material';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';

type Option = {
  id: string | number;
  name: string;
};

type InputFieldProps<T extends FieldValues> = Omit<TextFieldProps, 'name'> & {
  name: Path<T>;
  control: Control<T>;
  options?: Option[];
};

const InputField = <T extends FieldValues>({
  name,
  control,
  options,
  select,
  children,
  ...props
}: InputFieldProps<T>) => {
  const { onChange: customOnChange, ...restProps } = props;

  const commonSx = {
    transform: props.type !== 'date' ? 'rotate(0.09deg)' : 'none',
    "& .MuiOutlinedInput-root": {
      height: '48px',
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
      backgroundColor: "#1A1A1A",
      ...(select && { color: "#FFFFFF" }),
    },
    "& .MuiInputLabel-shrink": {
      backgroundColor: "#181818",
      padding: "0 5px",
    },
    ...(props.type === 'date' && {
      "& .MuiInputBase-input": {
        colorScheme: "dark",
      },
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

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
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
            field.onChange(e);
            if (customOnChange) {
              (customOnChange as any)(e);
            }
          }}
          SelectProps={select ? {
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
          } : undefined}
        >
          {select ? (
            options?.map((option) => (
              <MenuItem value={String(option.id)} key={option.id}>
                {option.name}
              </MenuItem>
            ))
          ) : (
            children
          )}
        </TextField>
      )}
    />
  );
};

export default InputField;
