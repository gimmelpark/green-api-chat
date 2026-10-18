import Button from "@/components/ui/Button";
import Field from "@/components/ui/Field";
import { useAuthStore } from "@/store/authStore";
import { useState, type ChangeEvent, type SubmitEvent } from "react";
import { useShallow } from "zustand/shallow";

function LoginScreen() {
  const [apiUrl, setApiUrl] = useState<string>("");
  const [idInstance, setIdInstance] = useState<string>("");
  const [apiTokenInstance, setApiTokenInstance] = useState<string>("");
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const { isPendingAuthData, authError, login, resetAuthError } = useAuthStore(
    useShallow((state) => ({
      isPendingAuthData: state.isPendingAuthData,
      authError: state.authError,
      login: state.login,
      resetAuthError: state.resetAuthError,
    })),
  );

  function getError(value: string) {
    return isSubmitted && !value.trim() ? "Заполните поле" : undefined;
  }

  function handleChange(setValue: (value: string) => void) {
    return function (e: ChangeEvent<HTMLInputElement>) {
      setValue(e.target.value);
      if (authError) resetAuthError();
    };
  }

  function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    if (isPendingAuthData) return;

    setIsSubmitted(true);

    if (!apiUrl.trim() || !idInstance.trim() || !apiTokenInstance.trim()) return;

    login({
      apiUrl: apiUrl.trim().replace(/\/+$/, ""),
      idInstance: idInstance.trim(),
      apiTokenInstance: apiTokenInstance.trim(),
    });
  }

  return (
    <main className="flex min-h-dvh items-center justify-center bg-white px-4 py-10">
      <div className="w-full max-w-90 text-center">
        <h1 className="mb-2 text-[2rem] font-medium">Telegram Chat</h1>

        <p className="mb-10 text-sm text-gray-500">
          Введите данные{" "}
          <a
            href="https://console.green-api.com"
            target="_blank"
            rel="noreferrer"
            className="text-primary hover:underline"
          >
            инстанса GREEN-API
          </a>
        </p>

        <form className="flex flex-col gap-6 text-left" onSubmit={handleSubmit}>
          <Field
            label="apiUrl"
            name="apiUrl"
            type="url"
            disabled={isPendingAuthData}
            value={apiUrl}
            onChange={handleChange(setApiUrl)}
            error={getError(apiUrl)}
          />
          <Field
            label="idInstance"
            name="idInstance"
            inputMode="numeric"
            autoComplete="off"
            disabled={isPendingAuthData}
            value={idInstance}
            onChange={handleChange(setIdInstance)}
            error={getError(idInstance)}
          />
          <Field
            label="apiTokenInstance"
            name="apiTokenInstance"
            autoComplete="off"
            disabled={isPendingAuthData}
            value={apiTokenInstance}
            onChange={handleChange(setApiTokenInstance)}
            error={getError(apiTokenInstance)}
          />

          <div className="relative mt-2">
            <Button type="submit" disabled={isPendingAuthData} className="w-full">
              Войти
            </Button>

            {authError && (
              <p
                role="alert"
                className="absolute top-full right-0 left-0 mt-3 text-center text-sm text-red-500"
              >
                {authError}
              </p>
            )}
          </div>
        </form>
      </div>
    </main>
  );
}

export default LoginScreen;
