import type { ComponentProps } from "react";
import Input from "./Input";

interface IProps {
  label?: string;
  error?: string;
}

function Field({ label, error, id, name, ...inputProps }: ComponentProps<"input"> & IProps) {
  const inputId = id ?? name;

  return (
    <div className="relative flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="font-medium text-gray-700">
          {label}
        </label>
      )}
      <Input id={inputId} name={name} aria-invalid={error ? true : undefined} {...inputProps} />
      {error && <p className="absolute top-full left-0 mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}

export default Field;
