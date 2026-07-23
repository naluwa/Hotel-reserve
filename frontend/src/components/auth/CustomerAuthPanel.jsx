import { useState } from "react";
import { Button, Card, Input } from "../base";

export default function CustomerAuthPanel({ onLogin, onRegister }) {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nicPassport, setNicPassport] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    isLogin
      ? onLogin(email, password)
      : onRegister(name, email, password, nicPassport, phone, address);
  };

  const sideBenefits = [
    "Review reservations in one place",
    "Complete bookings with fewer steps",
    "Manage stays without extra back-and-forth",
  ];

  return (
    <div className="flex min-h-[calc(100vh-6rem)] items-center justify-center px-4 py-12 sm:px-6">
      <div className="w-full max-w-xl">
        <Card
          className="p-8 bg-heritage-900 border-cashmere-700 shadow-card"
          variant="ghost"
        >
          <div className="mb-8 text-center">
            <p className="eyebrow">Guest access</p>
            <h1 className="mt-3 font-serif text-3xl font-semibold text-white sm:text-4xl">
              {isLogin ? "Welcome back" : "Create your account"}
            </h1>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              {isLogin
                ? "Use your guest account to manage stays faster."
                : "Create an account to keep booking details in one place."}
            </p>
          </div>

          <div className="flex overflow-hidden rounded-full border border-cashmere-700 bg-heritage-900 text-xs uppercase text-slate-400">
            <Button
              type="button"
              variant={isLogin ? "primary" : "ghost"}
              className="flex-1 rounded-none rounded-l-full border-none text-sm"
              onClick={() => setIsLogin(true)}
            >
              Sign In
            </Button>
            <Button
              type="button"
              variant={!isLogin ? "primary" : "ghost"}
              className="flex-1 rounded-none rounded-r-full border-none text-sm"
              onClick={() => setIsLogin(false)}
            >
              Register
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            {!isLogin && (
              <>
                <Input
                  label="Full name"
                  placeholder="Enter your full name here"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <Input
                  label="NIC / Passport"
                  placeholder="Enter your NIC or passport number here"
                  value={nicPassport}
                  onChange={(e) => setNicPassport(e.target.value)}
                  required
                />
                <Input
                  label="Phone Number"
                  placeholder="Enter your phone number here"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
                <Input
                  label="Address"
                  placeholder="Enter your address here"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </>
            )}

            <Input
              label="Email address"
              type="email"
              placeholder="Enter your email address here"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Input
              label="Password"
              type="password"
              placeholder="Enter your password here"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <Button type="submit" fullWidth>
              {isLogin ? "Sign In" : "Register"}
            </Button>

            <p className="text-center text-sm text-slate-500">
              {isLogin ? "New guest? " : "Already registered? "}
              <button
                type="button"
                className="text-brass underline"
                onClick={() => setIsLogin(!isLogin)}
              >
                {isLogin ? "Create an account" : "Sign in"}
              </button>
            </p>
          </form>
        </Card>
      </div>
    </div>
  );
}
