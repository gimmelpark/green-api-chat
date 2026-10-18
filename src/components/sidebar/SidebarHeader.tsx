import { Plus } from "lucide-react";

interface IProps {
  showAddButton: boolean;
  handleAddClick: () => void;
}

function SidebarHeader({ showAddButton, handleAddClick }: IProps) {
  return (
    <div className="flex h-12 items-center justify-between border-b border-gray-200 px-4 py-2 text-xl">
      <div>Ваши чаты</div>
      {showAddButton && (
        <button
          type="button"
          aria-label="Новый чат"
          title="Новый чат"
          className="flex size-8 cursor-pointer items-center justify-center rounded-lg bg-primary text-white transition-colors hover:bg-primary-hover"
          onClick={handleAddClick}
        >
          <Plus size={18} />
        </button>
      )}
    </div>
  );
}

export default SidebarHeader;
