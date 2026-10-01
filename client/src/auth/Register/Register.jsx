import React, { useState } from "react";
import "./Register.css";

export default function Register() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  });

  const [showPassword, setShowPassword] = useState(false);

  // Simple password strength check
  const getPasswordStrength = () => {
    const { password } = formData;
    if (!password) return { label: "", strength: 0 };
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 1) return { label: "Weak", strength: 25, color: "#ff5f57" };
    if (score === 2 || score === 3)
      return { label: "Medium", strength: 65, color: "#febc2e" };
    return { label: "Strong", strength: 100, color: "#28c840" };
  };

  const strengthInfo = getPasswordStrength();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    // Handle registration logic here
  };

  return (
    <div className="register-wrapper">
      {/* Ambient background glows using root tokens */}
      <div className="glow glow-violet register-glow-1" />
      <div className="glow glow-blue register-glow-2" />
      <div className="grid-bg" />

      <div className="shell register-shell">
        <div className="card-ai register-card">
          {/* Top Brand Tag */}
          <div className="register-header">
            <div className="badge-pill">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
              <span>AI Builder</span>
            </div>
            <h1 className="h-section register-title">
              Create an <span className="grad-text">account</span>
            </h1>
            <p className="lead">
              Start building intelligence into your apps today.
            </p>
          </div>

          {/* Social Register Option */}
          <button type="button" className="btn-ai btn-ghost-ai btn-social">
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            Sign up with Google
          </button>

          <div className="register-divider">
            <span className="eyebrow">OR</span>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="register-form">
            <div className="form-group">
              <label className="eyebrow" htmlFor="fullName">
                Full Name
              </label>
              <input
                id="fullName"
                type="text"
                name="fullName"
                required
                placeholder="Alex Morgan"
                value={formData.fullName}
                onChange={handleChange}
                className="input-ai"
              />
            </div>

            <div className="form-group">
              <label className="eyebrow" htmlFor="email">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                name="email"
                required
                placeholder="alex@company.com"
                value={formData.email}
                onChange={handleChange}
                className="input-ai"
              />
            </div>

            <div className="form-group">
              <label className="eyebrow" htmlFor="password">
                Password
              </label>
              <div className="input-relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  placeholder="At least 8 characters"
                  value={formData.password}
                  onChange={handleChange}
                  className="input-ai"
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>

              {/* Password Strength Indicator */}
              {formData.password && (
                <div className="strength-meter">
                  <div className="strength-bar-bg">
                    <div
                      className="strength-bar-fill"
                      style={{
                        width: `${strengthInfo.strength}%`,
                        backgroundColor: strengthInfo.color,
                      }}
                    />
                  </div>
                  <span
                    className="strength-text"
                    style={{ color: strengthInfo.color }}
                  >
                    {strengthInfo.label}
                  </span>
                </div>
              )}
            </div>

            <div className="form-group">
              <label className="eyebrow" htmlFor="confirmPassword">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                name="confirmPassword"
                required
                placeholder="Re-enter password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="input-ai"
              />
            </div>

            {/* Checkbox terms */}
            <div className="terms-checkbox">
              <label className="checkbox-container">
                <input
                  type="checkbox"
                  name="agreeToTerms"
                  required
                  checked={formData.agreeToTerms}
                  onChange={handleChange}
                />
                <span className="checkmark" />
                <span className="terms-text muted">
                  I agree to the{" "}
                  <a href="#terms" className="link-hover">
                    Terms of Service
                  </a>{" "}
                  &{" "}
                  <a href="#privacy" className="link-hover">
                    Privacy Policy
                  </a>
                </span>
              </label>
            </div>

            <button type="submit" className="btn-ai btn-primary-ai btn-submit">
              Get Started Free
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </button>
          </form>

          {/* Footer inside card */}
          <p className="register-footer muted">
            Already have an account?{" "}
            <a href="#login" className="grad-text link-bold">
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
