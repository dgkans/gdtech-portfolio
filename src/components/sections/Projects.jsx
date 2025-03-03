import { RevealOnScroll } from "../RevealOnScroll";

export const Projects = () => {
  return (
    <section
      id="projects"
      className="min-h-screen flex items-center justify-center py-20"
    >
      <RevealOnScroll>
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent text-center">
            Featured Projects
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* BloggingSphere */}
            <div className="p-6 rounded-xl border border-white/10 hover:-translate-y-1 hover:border-blue-500/30 hover:shadow-[0_2px_8px_rgba(59,130,246,0.2)] transition">
              <h3 className="text-xl font-bold mb-2">BloggingSphere</h3>
              <p className="text-gray-400 mb-4">
                A dynamic full-stack blog platform that enables seamless content creation, user engagement, and admin moderation. Features include a responsive UI, JWT-based authentication, and scalable content management.
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                {["React", "Node.js", "Express", "MongoDB", "TailwindCSS","JWT"].map((tech, key) => (
                  <span key={key} className="bg-blue-500/10 text-blue-500 py-1 px-3 rounded-full text-sm hover:bg-blue-500/20 hover:shadow-[0_2px_8px_rgba(59,130,246,0.1)] transition-all">
                    {tech}
                  </span>
                ))}
              </div>
              <div className="flex justify-between items-center">
                <a 
                  href="https://github.com/dgkans/BloggingSphere" // 🔹 Updated link
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 transition-colors my-4"
                >
                  View Project →
                </a>
              </div>
            </div>

            {/* E-Adoption Portal */}
            <div className="glass p-6 rounded-xl border border-white/10 hover:-translate-y-1 hover:border-blue-500/30 hover:shadow-[0_4px_20px_rgba(59,130,246,0.1)] transition-all">
              <h3 className="text-xl font-bold mb-2">E-Adoption Portal</h3>
              <p className="text-gray-400 mb-4">
                A secure web-based adoption system that streamlines the adoption process with role-based access for users and administrators. Features include real-time orphanage management and a transparent, structured adoption workflow.
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                {["Java", "SpringBoot", "React", "MySQL", "AWS"].map((tech, key) => (
                  <span key={key} className="bg-blue-500/10 text-blue-500 py-1 px-3 rounded-full text-sm transition hover:bg-blue-500/20 hover:-translate-y-0.5 hover:shadow-[0_2px_8px_rgba(59,130,246,0.2)]">
                    {tech}
                  </span>
                ))}
              </div>
              <div className="flex justify-between items-center">
                <a 
                  href="https://github.com/dgkans/EAdoptionPortal" // 🔹 Updated link
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 transition-colors my-4"
                >
                  View Project →
                </a>
              </div>
            </div>

            {/* Machine Learning Projects - MOVED TO 3RD POSITION */}
            <div className="glass p-6 rounded-xl border border-white/10 hover:-translate-y-1 hover:border-blue-500/30 hover:shadow-[0_4px_20px_rgba(59,130,246,0.1)] transition-all">
              <h3 className="text-xl font-bold mb-2">Machine Learning Projects</h3>
              <p className="text-gray-400 mb-4">
                A collection of machine learning projects exploring classification, regression, clustering, and deep learning techniques using neural networks. Includes hands-on experiments with real-world datasets.
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                {["Python", "Numpy","Pandas","TensorFlow", "Scikit-learn"].map((tech, key) => (
                  <span key={key} className="bg-blue-500/10 text-blue-500 py-1 px-3 rounded-full text-sm transition hover:bg-blue-500/20 hover:-translate-y-0.5 hover:shadow-[0_2px_8px_rgba(59,130,246,0.2)]">
                    {tech}
                  </span>
                ))}
              </div>
              <div className="flex justify-between items-center">
                <a 
                  href="https://github.com/dgkans/MachineLearning" // 🔹 Updated link
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 transition-colors my-4"
                >
                  View Project →
                </a>
              </div>
            </div>

            {/* Personnel Tracking Application - MOVED TO LAST POSITION */}
            <div className="glass p-6 rounded-xl border border-white/10 hover:-translate-y-1 hover:border-blue-500/30 hover:shadow-[0_4px_20px_rgba(59,130,246,0.1)] transition-all">
              <h3 className="text-xl font-bold mb-2">Personnel Tracking Application</h3>
              <p className="text-gray-400 mb-4">
                A robust C# application for comprehensive employee management, including real-time tracking, task approvals, payroll management, and secure access control. Designed with N-tier architecture for scalability.
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                {["C#", ".NET", "WinForms", "DevExpress", "MS-SQL"].map((tech) => (
                  <span key={tech} className="bg-blue-500/10 text-blue-500 py-1 px-3 rounded-full text-sm transition hover:bg-blue-500/20 hover:-translate-y-0.5 hover:shadow-[0_2px_8px_rgba(59,130,246,0.2)]">
                    {tech}
                  </span>
                ))}
              </div>
              <div className="flex justify-between items-center">
                <a 
                  href="https://github.com/dgkans/PersonnelTrackingApp" // 🔹 Updated link
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 transition-colors my-4"
                >
                  View Project →
                </a>
              </div>
            </div>

          </div>
        </div>
      </RevealOnScroll>
    </section>
  );
};
