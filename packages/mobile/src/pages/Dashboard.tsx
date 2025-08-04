// import { useAuthContext } from '../auth/AuthContext';

// export default function Dashboard() {
//   const { logout } = useAuthContext();

//   return (
//     <div className="p-8 text-xl">
//       ✅ Logged in successfully. Welcome to your dashboard!
//       <br />
//       <button onClick={logout} className="mt-4 bg-red-500 text-white px-4 py-2 rounded">
//         Logout
//       </button>
//     </div>
//   );
// }

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
