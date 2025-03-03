/*
import { useState } from "react";
import { RevealOnScroll } from "../RevealOnScroll";
import emailjs from "emailjs-com";

export const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    emailjs
      .sendForm(
        import.meta.env.VITE_SERVICE_ID,
        import.meta.env.VITE_TEMPLATE_ID,
        e.target,
        import.meta.env.VITE_PUBLIC_KEY
      )
      .then((result) => {
        alert("Message Sent!");
        setFormData({ name: "", email: "", message: "" });
      })
      .catch(() => alert("Oops! Something went wrong. Please try again."));
  };

  return (
    <section
      id="contact"
      className="min-h-screen flex items-center justify-center py-20"
    >
      <RevealOnScroll>
        <div className="px-4 w-full min-w-[300px] md:w-[500px] sm:w-2/3 p-6">
          <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent text-center">
            {" "}
            Get In Touch
          </h2>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="relative">
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                className="w-full bg-white/5 border border-white/10 rounded px-4 py-3 text-white transition focus:outline-none focus:border-blue-500 focus:bg-blue-500/5"
                placeholder="Name..."
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>

            <div className="relative">
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                className="w-full bg-white/5 border border-white/10 rounded px-4 py-3 text-white transition focus:outline-none focus:border-blue-500 focus:bg-blue-500/5"
                placeholder="example@gmail.com"
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>

            <div className="relative">
              <textarea
                id="message"
                name="message"
                required
                rows={5}
                value={formData.message}
                className="w-full bg-white/5 border border-white/10 rounded px-4 py-3 text-white transition focus:outline-none focus:border-blue-500 focus:bg-blue-500/5"
                placeholder="Your Message..."
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-3 px-6 rounded font-medium transition relative overflow-hidden hover:-translate-y-0.5 hover:shadow-[0_0_15px_rgba(59,130,246,0.4)]"
            >
              Send Message
            </button>
          </form>
        </div>
      </RevealOnScroll>
    </section>
  );
};
*/


import { useState } from "react"; // ✅ Kept original import
import { RevealOnScroll } from "../RevealOnScroll"; // ✅ Kept original import
import emailjs from "emailjs-com"; // ✅ Kept original import

// ✅ Corrected icon imports
import githubIcon from "../../../src/assets/icons8-github.svg";
import linkedinIcon from "../../../src/assets/icons8-linkedin.svg";

export const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
  
  const serviceId = "service_iuwvvea";
  const templateId = "template_bdxqdud";
  const publicKey = "bfzJz8vcwIMNb6MFl";
  emailjs.sendForm(serviceId, templateId, e.target, publicKey)
      //  import.meta.env.VITE_SERVICE_ID,
      //  import.meta.env.VITE_TEMPLATE_ID,
      //  e.target,
      //  import.meta.env.VITE_PUBLIC_KEY
  
      .then((result) => {
        alert("Message Sent!");
        setFormData({ name: "", email: "", message: "" });
      })
      .catch((error) => {
        console.error("EmailJS Error:", error); // ✅ Log the error in the console
        alert("Oops! Something went wrong. Please try again.");
      });
  };


  return (
    <section id="contact" className="min-h-screen flex items-center justify-center py-20">
      <RevealOnScroll>
        <div className="px-4 w-full min-w-[300px] md:w-[500px] sm:w-2/3 p-6">
          <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent text-center">
            Get In Touch
          </h2>

          
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="relative">
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                className="w-full bg-white/5 border border-white/10 rounded px-4 py-3 text-white transition focus:outline-none focus:border-blue-500 focus:bg-blue-500/5"
                placeholder="Name..."
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>

            <div className="relative">
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                className="w-full bg-white/5 border border-white/10 rounded px-4 py-3 text-white transition focus:outline-none focus:border-blue-500 focus:bg-blue-500/5"
                placeholder="example@gmail.com"
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>

            <div className="relative">
              <textarea
                id="message"
                name="message"
                required
                rows={5}
                value={formData.message}
                className="w-full bg-white/5 border border-white/10 rounded px-4 py-3 text-white transition focus:outline-none focus:border-blue-500 focus:bg-blue-500/5"
                placeholder="Your Message..."
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-3 px-6 rounded font-medium transition relative overflow-hidden hover:-translate-y-0.5 hover:shadow-[0_0_15px_rgba(59,130,246,0.4)]"
            >
              Send Message
            </button>
          </form>

         
          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-4 text-white">Connect with me</h3>
            <div className="flex justify-center space-x-6">
              <a
                href="https://github.com/dgkans"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center bg-white/10 border border-white/20 px-6 py-3 rounded-md text-white transition hover:bg-blue-500 hover:border-blue-600"
              >
                <img src={githubIcon} alt="GitHub" className="w-6 h-6 mr-2" />
                GitHub
              </a>

              <a
                href="https://www.linkedin.com/in/gaurav-desai-9bb562289/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center bg-white/10 border border-white/20 px-6 py-3 rounded-md text-white transition hover:bg-blue-500 hover:border-blue-600"
              >
                <img src={linkedinIcon} alt="LinkedIn" className="w-6 h-6 mr-2" />
                LinkedIn
              </a>
            </div>
          </div>

          
          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-2 text-white">Download My Resume</h3>
            <a
              href="/gdtech-portfolio/Gaurav_ResumeSWE_og.pdf"  // ✅ Directly accessible from the root URL
              download="Gaurav_ResumeSWE_og.pdf"
              className="inline-block bg-blue-500 px-6 py-3 text-white font-semibold rounded-md transition hover:bg-blue-700"
            >
              Download Resume
            </a>
          </div>
        </div>
      </RevealOnScroll>
    </section>
  );
};

