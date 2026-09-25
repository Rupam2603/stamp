import { AuthView } from "@neondatabase/auth-ui";

export default function SignInPage() {
  return (
    <main style={{ minHeight: '85vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 16px' }}>
      <AuthView path="sign-in" />
    </main>
  );
}
