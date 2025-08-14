
import { useAuth } from '../auth/AuthContext';
export default function Dashboard() {
  const { logout } = useAuth();
  const { user } = useAuth();
console.log("Logged user:", user);
  return (
    <div>
      Logged in!
      <button onClick={logout}>Logout</button>
    </div>
  );
}
