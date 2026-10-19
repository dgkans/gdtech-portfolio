import { useState } from "react";
import { RevealOnScroll } from "../RevealOnScroll";
import { siteConfig } from "../../data/config";
import githubIcon from "../../assets/icons8-github.svg";
import linkedinIcon from "../../assets/icons8-linkedin.svg";

const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";

export const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState({ kind: "idle", message: "" });
  const [emailCopied, setEmailCopied] = useState(false);

  const copyEmail = async () => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(siteConfig.email);
      } else {
        const ta = document.createElement("textarea");
        ta.value = siteConfig.email;
        ta.setAttribute("readonly", "");
        ta.style.position = "absolute";
        ta.style.left = "-9999px";
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      }
      setEmailCopied(true);
      window.setTimeout(() => setEmailCopied(false), 1800);
    } catch (err) {
      console.error("Clipboard copy failed:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const key = String(siteConfig.web3formsKey ?? "").trim();
    if (!key) {
      setStatus({
        kind: "error",
        message:
          "The contact form isn't configured yet. Use the email link below or one of the icons.",
      });
      return;
    }

    setStatus({ kind: "sending", message: "Sending…" });

    try {
      const res = await fetch(WEB3FORMS_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: key,
          subject: `Portfolio contact — ${formData.name || "Anonymous"}`,
          from_name: "gaurav.tech contact form",
          name: formData.name,
          email: formData.email,
          message: formData.message,
          // Honeypot — bots will fill this; real users won't see it.
          botcheck: "",
        }),
      });

      const json = await res.json();
      if (json.success) {
        setStatus({
          kind: "success",
          message: "Message sent — I'll get back to you shortly.",
        });
        setFormData({ name: "", email: "", message: "" });
      } else {
        throw new Error(json.message || "Web3Forms error");
      }
    } catch (err) {
      console.error("Contact form error:", err);
      const detail = err?.message || "";
      setStatus({
        kind: "error",
        message: detail
          ? `Couldn't send the message (${detail}). Use the email link below.`
          : "Couldn't send the message. Use the email link below — it'll open your mail app pre-filled.",
      });
    }
  };

  const sending = status.kind === "sending";

  const inputCls =
    "w-full rounded px-4 py-3 transition focus:outline-none focus:border-blue-500 focus:bg-blue-500/5 " +
    "border border-black/10 dark:border-white/10 " +
    "bg-black/[0.03] dark:bg-white/[0.03] " +
    "text-gray-900 dark:text-white " +
    "placeholder-gray-500 dark:placeholder-gray-400";

  const linkCardCls =
    "flex items-center px-6 py-3 rounded-md transition " +
    "border border-black/10 dark:border-white/20 " +
    "bg-black/[0.03] dark:bg-white/10 " +
    "text-gray-900 dark:text-white " +
    "hover:bg-blue-500 hover:text-white hover:border-blue-600";

  return (
    <section
      id="contact"
      className="py-12 md:py-16 flex items-center justify-center"
    >
      <RevealOnScroll>
        <div className="px-4 w-full min-w-[300px] md:w-[500px] sm:w-2/3 p-6">
          <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent text-center">
            Get In Touch
          </h2>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Honeypot — visually hidden but present for bots. */}
            <input
              type="checkbox"
              name="botcheck"
              tabIndex={-1}
              autoComplete="off"
              className="hidden"
              aria-hidden="true"
            />

            <input
              type="text"
              id="name"
              name="name"
              required
              value={formData.name}
              className={inputCls}
              placeholder="Your name"
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />

            <input
              type="email"
              id="email"
              name="email"
              required
              value={formData.email}
              className={inputCls}
              placeholder="you@example.com"
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />

            <textarea
              id="message"
              name="message"
              required
              rows={5}
              value={formData.message}
              className={inputCls}
              placeholder="What would you like to talk about?"
              onChange={(e) =>
                setFormData({ ...formData, message: e.target.value })
              }
            />

            <button
              type="submit"
              disabled={sending}
              className="w-full bg-blue-500 text-white py-3 px-6 rounded font-medium transition relative overflow-hidden hover:-translate-y-0.5 hover:shadow-[0_0_15px_rgba(59,130,246,0.4)] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
            >
              {sending ? "Sending…" : "Send Message"}
            </button>

            {status.kind !== "idle" && status.kind !== "sending" && (
              <p
                className={`text-sm text-center ${
                  status.kind === "success"
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-amber-600 dark:text-amber-400"
                }`}
              >
                {status.message}
              </p>
            )}

            <p className="text-xs text-center text-gray-500 dark:text-gray-400 pt-1">
              Form not loading?{" "}
              <button
                type="button"
                onClick={copyEmail}
                className="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
              >
                {emailCopied
                  ? "✓ Email address copied"
                  : "Copy my email address"}
              </button>
              .
            </p>
          </form>

          <div className="mt-10">
            <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white text-center">
              Connect with me
            </h3>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href={`https://github.com/${siteConfig.github}`}
                target="_blank"
                rel="noopener noreferrer"
                className={linkCardCls}
              >
                <img src={githubIcon} alt="" className="w-6 h-6 mr-2" />
                GitHub
              </a>

              <a
                href={siteConfig.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className={linkCardCls}
              >
                <img src={linkedinIcon} alt="" className="w-6 h-6 mr-2" />
                LinkedIn
              </a>

              <button
                type="button"
                onClick={copyEmail}
                title={`Copy ${siteConfig.email} to clipboard`}
                aria-label={`Copy email address ${siteConfig.email} to clipboard`}
                className={`${linkCardCls} cursor-pointer`}
              >
                <span className="mr-2 text-xl leading-none">✉</span>
                {emailCopied ? "✓ Copied to clipboard" : "Copy email address"}
              </button>
            </div>
          </div>
        </div>
      </RevealOnScroll>
    </section>
  );
};
