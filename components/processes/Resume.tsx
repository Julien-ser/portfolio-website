'use client';

interface ResumeProps {
  onClose?: () => void;
}

export default function Resume({ onClose }: ResumeProps) {
  return (
    <div className="p-6 h-full overflow-y-auto">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-green-400">Resume / CV</h2>
        
        <div className="space-y-6 text-gray-300">
          <section>
            <h1 className="text-3xl font-bold text-white mb-2">Julien Serbanescu</h1>
            <p className="text-green-300 mb-4">Senior Software Engineer</p>
            <div className="flex flex-wrap gap-3 text-sm text-gray-400">
              <span>julien@serbanescu.dev</span>
              <span>•</span>
              <a href="https://github.com/jserbanescu" target="_blank" rel="noopener noreferrer" className="text-green-400 hover:underline">GitHub</a>
              <span>•</span>
              <a href="https://linkedin.com/in/julien-serbanescu" target="_blank" rel="noopener noreferrer" className="text-green-400 hover:underline">LinkedIn</a>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-3 text-green-300 border-b border-green-900/50 pb-1">Summary</h3>
            <p>
              Results-driven Senior Software Engineer with 4+ years of experience in full-stack development, 
              distributed systems, and AI integration. Passionate about clean architecture, developer experience, 
              and building scalable solutions that solve real-world problems. Proven track record of leading 
              engineering teams and delivering high-impact projects.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-3 text-green-300 border-b border-green-900/50 pb-1">Technical Skills</h3>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="font-medium text-green-400">Languages:</p>
                <p className="text-sm">TypeScript, Python, JavaScript, Go, Rust</p>
              </div>
              <div>
                <p className="font-medium text-green-400">Frameworks:</p>
                <p className="text-sm">React, Next.js, Node.js, FastAPI, Django</p>
              </div>
              <div>
                <p className="font-medium text-green-400">Infrastructure:</p>
                <p className="text-sm">AWS, Docker, Kubernetes, Terraform, Redis</p>
              </div>
              <div>
                <p className="font-medium text-green-400">Data & AI:</p>
                <p className="text-sm">PostgreSQL, MongoDB, TensorFlow, PyTorch, LangChain</p>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-3 text-green-300 border-b border-green-900/50 pb-1">Experience</h3>
            
            <div className="mb-5">
              <div className="flex justify-between items-start mb-1">
                <h4 className="font-semibold text-white">Senior Software Engineer</h4>
                <span className="text-sm text-gray-400">2022 - Present</span>
              </div>
              <p className="text-green-400 text-sm mb-2">Tech Innovation Lab</p>
              <ul className="list-disc list-inside text-sm space-y-1 ml-2">
                <li>Lead architect for AI-powered developer tools serving 10k+ users</li>
                <li>Designed and implemented real-time collaboration features using WebSockets and CRDTs</li>
                <li>Mentored junior engineers and established code review best practices</li>
                <li>Reduced infrastructure costs by 40% through optimization and scaling strategies</li>
              </ul>
            </div>

            <div className="mb-5">
              <div className="flex justify-between items-start mb-1">
                <h4 className="font-semibold text-white">Full-Stack Developer</h4>
                <span className="text-sm text-gray-400">2020 - 2022</span>
              </div>
              <p className="text-green-400 text-sm mb-2">Creative Digital Agency</p>
              <ul className="list-disc list-inside text-sm space-y-1 ml-2">
                <li>Built e-commerce platforms handling $5M+ in annual transactions</li>
                <li>Implemented microservices architecture improving system reliability to 99.9% uptime</li>
                <li>Developed real-time analytics dashboards using React and WebSocket connections</li>
              </ul>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-3 text-green-300 border-b border-green-900/50 pb-1">Education</h3>
            <div className="mb-2">
              <div className="flex justify-between items-start">
                <h4 className="font-semibold text-white">B.S. Computer Science</h4>
                <span className="text-sm text-gray-400">2016 - 2020</span>
              </div>
              <p className="text-sm text-gray-400">University of Technology</p>
              <p className="text-sm">Specialization: Artificial Intelligence and Distributed Systems</p>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-3 text-green-300 border-b border-green-900/50 pb-1">Achievements</h3>
            <ul className="list-disc list-inside text-sm space-y-1 ml-2">
              <li>Winner of TechCrunch Disrupt 2023 Hackathon - AI Track</li>
              <li>Authored 15+ technical blog posts with 100k+ views</li>
              <li>Maintainer of popular open-source libraries with 2k+ GitHub stars</li>
              <li>Speaker at 5+ tech conferences on distributed systems and AI</li>
            </ul>
          </section>
        </div>

        <div className="mt-8 pt-4 border-t border-green-900/30 text-center">
          <p className="text-sm text-gray-400">
            Full resume available for download. Contact me for a complete copy.
          </p>
        </div>
      </div>
    </div>
  );
}
