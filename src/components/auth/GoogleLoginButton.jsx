import { useAuthStore } from "@/stores/useAuthStore";

function GoogleLoginButton() {
  const { loginWithGoogle, loadingWithGoogle } = useAuthStore();

  return (
    <button
      onClick={loginWithGoogle}
      disabled={loadingWithGoogle}
      className="px-4 py-2 bg-red-500 text-white rounded"
    >
      {loadingWithGoogle ? "جارٍ الدخول..." : "تسجيل الدخول عبر Google"}
    </button>
  );
}

export default GoogleLoginButton;
