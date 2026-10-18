import { logout } from "@/common/logout";
import { useAuthStore } from "@/store/authStore";
import { useShallow } from "zustand/shallow";
import Avatar from "@/components/ui/Avatar";

function Header() {
  const { userName, userAvatar } = useAuthStore(
    useShallow((state) => ({
      userName: state.userName,
      userAvatar: state.userAvatar,
    })),
  );

  return (
    <div className="flex items-center justify-between border-b border-gray-200 py-2 pr-6 pl-4">
      <div className="flex min-w-0 items-center gap-3">
        <Avatar avatar={userAvatar} name={userName} />
        <span className="truncate font-medium">{userName}</span>
      </div>

      <button
        type="button"
        onClick={logout}
        className="shrink-0 cursor-pointer font-medium text-red-500 hover:underline"
      >
        Выйти
      </button>
    </div>
  );
}

export default Header;
