import { useState } from "react";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Input,
} from "../base";
import { setupAdminPassword } from "../../services/api";

export default function LoginForm({ onSubmit }) {
  const [isSetup, setIsSetup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [setupMessage, setSetupMessage] = useState({ text: "", isError: false });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSetupMessage({ text: "", isError: false });

    if (isSetup) {
      try {
        await setupAdminPassword(email, password, fullName);
        setSetupMessage({
          text: "Admin password created successfully! Please sign in now.",
          isError: false,
        });
        setIsSetup(false);
        setPassword("");
      } catch (err) {
        setSetupMessage({
          text: err.message || "Could not complete setup. Verify your eligible email.",
          isError: true,
        });
      }
    } else {
      onSubmit(e, email, password);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-6rem)] items-center justify-center px-4 py-12 sm:px-6">
      <Card className="w-full max-w-xl overflow-hidden rounded-[2rem] shadow-card bg-heritage-900 border-cashmere-700 p-8 sm:p-10">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <CardHeader className="border-none p-0 text-center">
            <p className="text-sm uppercase tracking-[0.35em] text-brass">
              Admin Portal
            </p>
            <CardTitle className="mt-3 text-3xl font-serif">
              {isSetup ? "Create Admin Password" : "Admin Sign In"}
            </CardTitle>
            <CardDescription className="mt-2 text-slate-400">
              {isSetup
                ? "Enter your assigned admin email to create your password and set up access."
                : "Sign in with your administrator email and password."}
            </CardDescription>
          </CardHeader>

          {setupMessage.text && (
            <div
              className={`rounded-xl p-3 text-xs text-center border ${
                setupMessage.isError
                  ? "bg-red-950/80 border-red-800 text-red-300"
                  : "bg-emerald-950/80 border-emerald-800 text-emerald-300"
              }`}
            >
              {setupMessage.text}
            </div>
          )}

          <CardContent className="space-y-5 p-0">
            {isSetup && (
              <Input
                label="Full Name (Optional)"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your full name here"
              />
            )}

            <Input
              label="Admin Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your admin email address here"
              autoComplete="email"
              required
            />

            <Input
              label={isSetup ? "Create New Password" : "Password"}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={isSetup ? "Enter minimum 6 characters here" : "Enter your password here"}
              autoComplete={isSetup ? "new-password" : "current-password"}
              required
            />
          </CardContent>

          <CardFooter className="border-none p-0 flex flex-col gap-4">
            <Button type="submit" fullWidth>
              {isSetup ? "Complete Admin Setup" : "Sign In"}
            </Button>

            <p className="text-center text-xs text-slate-400">
              {isSetup ? "Already setup your account? " : "Assigned as a new admin? "}
              <button
                type="button"
                className="text-brass underline font-semibold"
                onClick={() => {
                  setIsSetup(!isSetup);
                  setSetupMessage({ text: "", isError: false });
                }}
              >
                {isSetup ? "Sign in here" : "Set up your password here"}
              </button>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
