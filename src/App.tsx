import LoginScreen from "@/components/auth/LoginScreen";
import AppLayout from "@/components/layout/AppLayout";
import { useAuthStore } from "@/store/authStore";

function App() {
  const isAuthorized = useAuthStore((state) => state.isAuthorized);

  if (!isAuthorized) return <LoginScreen />;

  return <AppLayout />;
}

export default App;
