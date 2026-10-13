import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Sparkles } from "lucide-react";
import { toast } from "react-toastify";
import "./TextArea.css";

export default function TextArea() {
  const [prompt, setPrompt] = useState("");
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!prompt.trim()) {
      toast.error("Please describe your website first");
      return;
    }
    // logged-out visitors sign in first, the prompt travels with them
    navigate(user ? "/dashboard" : "/login", { state: { prompt } });
  };

  return (
    <section className="section prompt-section" id="prompt">
      <div className="shell">
        <form className="prompt-box" onSubmit={handleSubmit}>
          <textarea
            className="prompt-input"
            placeholder="Describe your website in details"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={4}
            aria-label="Describe your website"
          />
          <div className="prompt-actions">
            <button type="submit" className="btn-ai btn-primary-ai">
              <Sparkles size={16} strokeWidth={2.2} />
              Create with AI
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
