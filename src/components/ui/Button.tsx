import type { ComponentProps } from "react";

interface IProps {
  variant?: "primary" | "outline";
}

const variantClasses = {
  primary: "bg-primary text-white hover:bg-primary-hover",
  outline: "border border-primary text-primary hover:bg-primary/10",
};

function Button({
  variant = "primary",
  type = "button",
  className = "",
  ...props
}: ComponentProps<"button"> & IProps) {
  return (
    <button
      type={type}
      className={`h-11 cursor-pointer rounded-xl px-6 font-medium tracking-wide uppercase transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${variantClasses[variant]} ${className}`}
      {...props}
    />
  );
}

export default Button;
