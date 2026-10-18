import type { ComponentProps } from "react";

function Input({ className = "", ...props }: ComponentProps<"input">) {
  return (
    <input
      className={`h-11 w-full rounded-lg border border-gray-300 px-3 text-base outline-none focus:border-primary aria-invalid:border-red-500 ${className}`}
      {...props}
    />
  );
}

export default Input;
