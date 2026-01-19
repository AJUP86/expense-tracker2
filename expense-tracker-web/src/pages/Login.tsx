export default function Login() {
  return (
    <div className="max-w-sm mx-auto">
      <h1 className="text-xl font-semibold mb-4">Login</h1>

      <div className="space-y-3">
        <input
          type="email"
          placeholder="Email"
          className="w-full border rounded px-3 py-2"
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border rounded px-3 py-2"
        />

        <button className="w-full bg-black text-white py-2 rounded">
          Sign in
        </button>
      </div>
    </div>
  );
}
