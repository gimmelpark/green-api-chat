interface IProps {
  avatar?: string | null;
  name?: string | null;
  className?: string;
}

function Avatar({ avatar, name, className = "" }: IProps) {
  if (avatar) {
    return (
      <img
        src={avatar}
        alt={name ?? ""}
        className={`size-10 shrink-0 rounded-full object-cover ${className}`}
      />
    );
  }

  const trimmedName = name?.trim() ?? "";

  return (
    <span
      className={`flex size-10 shrink-0 items-center justify-center rounded-full bg-red-500 font-medium text-white uppercase ${className}`}
    >
      {trimmedName[0]}
    </span>
  );
}

export default Avatar;
