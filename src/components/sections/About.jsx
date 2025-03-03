import { RevealOnScroll } from "../RevealOnScroll";

export const About = () => {
  const frontendSkills = [
    "React",
    "Vue",
    "TypeScript",
    "TailwindCSS",
    "Bootstrap",
    "Svelte",
    "WinForms",
    "WPF",
    "ASP.NET",
  ];

  const backendSkills = ["Python","Node.js","Java","SpringBoot","C#",".NET","C++","C","SQL","Postgres","Redis", "AWS", "MongoDB"];

  return (
    <section
      id="about"
      className="min-h-screen flex items-center justify-center py-20"
    >
      <RevealOnScroll>
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent text-center">
            {" "}
            About Me
          </h2>

          <div className="rounded-xl p-8 border-white/10 border hover:-translate-y-1 transition-all">
            <p className="text-gray-300 mb-6">
            Software Developer and Machine Learning Engineer specializing in building high-performance, scalable systems with a focus on optimizing latency, real-time data processing, and system reliability. Experienced in developing trading platforms, risk management systems, microservices, and implementing machine learning solutions for enhanced efficiency and decision-making.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="rounded-xl p-6 hover:-translate-y-1 transition-all">
                <h3 className="text-xl font-bold mb-4"> Frontend</h3>
                <div className="flex flex-wrap gap-2">
                  {frontendSkills.map((tech, key) => (
                    <span
                      key={key}
                      className="bg-blue-500/10 text-blue-500 py-1 px-3 rounded-full text-sm hover:bg-blue-500/20 
                                    hover:shadow-[0_2px_8px_rgba(59,130,246,0.2)] transition
                    "
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="rounded-xl p-6 hover:-translate-y-1 transition-all">
                <h3 className="text-xl font-bold mb-4"> Backend</h3>
                <div className="flex flex-wrap gap-2">
                  {backendSkills.map((tech, key) => (
                    <span
                      key={key}
                      className="bg-blue-500/10 text-blue-500 py-1 px-3 rounded-full text-sm hover:bg-blue-500/20 
                                    hover:shadow-[0_2px_8px_rgba(59,130,2246,0.2)] transition
                    "
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <div className="p-6 rounded-xl border-white/10 border hover:-translate-y-1 transition-all">
              <h3 className="text-xl font-bold mb-4"> 🏫 Education </h3>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>
                  <strong> M.S. in Computer Science </strong> - California State University, Fullerton
                  (2024-2026)
                </li>
                <li>
                  <strong> Post Graduate Diploma in Advance Computing </strong> - Centre for Development of Advanced Computing,India
                  (2022)
                </li>
                <li>
                  <strong> B.E. in Information Technology </strong> - University Of Mumbai
                </li>
                <li>
                  Relevant Coursework: Advanced Algorithms, Machine Learning, Software Engineering, Web Programming, Advance Blockchain....
                </li>
              </ul>
            </div>
            <div className="p-6 rounded-xl border-white/10 border hover:-translate-y-1 transition-all">
              <h3 className="text-xl font-bold mb-4"> 💼 Work Experience </h3>
              <div className="space-y-4 text-gray-300">
                <div>
                  <h4 className="font-semibold">
                    {" "}
                    Software Developer at MOFSL (2022 - June 2024){" "}
                  </h4>
                  <p>
                  Developed and optimized a high-performance trading platform integrating Kafka, Solace, Go, and Redis, reducing latency by 20%. Built critical risk management and trade execution modules, along with a trading components discovery system using TCP/IP & UDP. 
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold">
                    {" "}
                    Associate at CHCS Services Inc (2021){" "}
                  </h4>
                  <p>
                  Ensured secure and optimized database operations for US healthcare clients, maintaining data integrity and compliance. 
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </RevealOnScroll>
    </section>
  );
};
