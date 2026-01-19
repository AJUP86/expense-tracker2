import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit() {
    await login(email, password);
    navigate('/');
  }

  return (
    <div className="max-w-sm mx-auto">
      <h1 className="text-xl font-semibold mb-4">Login</h1>

      <div className="space-y-3">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full border rounded px-3 py-2"
        />

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full border rounded px-3 py-2"
        />

        <button
          onClick={handleSubmit}
          className="w-full bg-black text-white py-2 rounded"
        >
          Sign in
        </button>
      </div>
    </div>
  );
}
