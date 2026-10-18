import Avatar from "@/components/ui/Avatar";
import Button from "@/components/ui/Button";
import Field from "@/components/ui/Field";
import type { IChatPreview } from "@/models/chat";
import { useChatStore } from "@/store/chatStore";
import { useEffect, useState, type SubmitEvent } from "react";
import { useShallow } from "zustand/shallow";

interface IProps {
  handleCancelClick: () => void;
  handleAddClick: (chat: IChatPreview) => void;
}

function AddChatForm({ handleCancelClick, handleAddClick }: IProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const [nameError, setNameError] = useState<string | undefined>();
  const [phoneError, setPhoneError] = useState<string | undefined>();

  const [searchResult, setSearchResult] = useState<IChatPreview | undefined>();

  const { accountSearch, isPendingAccountSearch, accountSearchError, resetAccountSearchError } =
    useChatStore(
      useShallow((state) => ({
        accountSearch: state.accountSearch,
        isPendingAccountSearch: state.isPendingAccountSearch,
        accountSearchError: state.accountSearchError,
        resetAccountSearchError: state.resetAccountSearchError,
      })),
    );

  useEffect(() => {
    resetAccountSearchError();
  }, [resetAccountSearchError]);

  function resetErrors() {
    setNameError(undefined);
    setPhoneError(undefined);
    resetAccountSearchError();
  }

  function validate() {
    if (!name && !phone) {
      setNameError("Заполните хотя бы одно поле");
      setPhoneError("Заполните хотя бы одно поле");
      return false;
    }

    if (name && name.length < 5) {
      setNameError("Имя пользователя слишком короткое");
      return false;
    }

    if (phone && phone.length < 8) {
      setPhoneError("Номер телефона слишком короткий");
      return false;
    }

    return true;
  }

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!validate()) return;

    const result = await accountSearch({ phone: +phone, name: name.trim() });

    if (result) {
      setSearchResult(result);
    }
  }

  function handleNameChange(value: string) {
    resetErrors();

    const allowedSymbols = value.replace(/[^a-zA-Z0-9_]/g, "").slice(0, 32);

    setName(allowedSymbols || value.startsWith("@") ? `@${allowedSymbols}` : "");
  }

  function handlePhoneChange(value: string) {
    resetErrors();

    const digits = value.replace(/\D/g, "").slice(0, 15);

    setPhone(digits || value.startsWith("+") ? `+${digits}` : "");
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col items-center justify-center-safe overflow-y-auto px-6">
      <form className="flex h-47 w-full flex-col justify-end gap-7" onSubmit={handleSubmit}>
        {searchResult ? (
          <div className="flex min-w-0 flex-col gap-3">
            <p className="text-gray-500">Найден пользователь:</p>
            <div className="flex min-w-0 items-center gap-3">
              <Avatar avatar={searchResult.avatar} name={searchResult.title} className="size-6" />
              <span className="truncate font-medium">{searchResult.title}</span>
            </div>
          </div>
        ) : (
          <>
            <Field
              type="text"
              name="name"
              autoComplete="off"
              placeholder="@username"
              value={name}
              disabled={!!phone.length || isPendingAccountSearch}
              error={nameError}
              onChange={(e) => handleNameChange(e.target.value)}
            />

            <Field
              type="tel"
              name="phone"
              autoComplete="off"
              placeholder="+79001234567"
              value={phone}
              disabled={!!name.length || isPendingAccountSearch}
              error={phoneError}
              onChange={(e) => handlePhoneChange(e.target.value)}
            />
          </>
        )}

        <div className="relative flex gap-3">
          {searchResult ? (
            <Button className="flex-1" onClick={() => handleAddClick(searchResult)}>
              Добавить
            </Button>
          ) : (
            <Button type="submit" className="flex-1" disabled={isPendingAccountSearch}>
              Поиск
            </Button>
          )}

          <Button
            variant="outline"
            className="flex-1"
            disabled={isPendingAccountSearch}
            onClick={handleCancelClick}
          >
            Отмена
          </Button>

          {accountSearchError && (
            <p role="alert" className="absolute top-full left-0 mt-1 text-sm text-red-500">
              {accountSearchError}
            </p>
          )}
        </div>
      </form>
    </div>
  );
}

export default AddChatForm;
