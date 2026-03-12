'use client';

interface ContactProps {
  onClose?: () => void;
}

export default function Contact({ onClose }: ContactProps) {
  return (
    <div className="p-6 h-full overflow-y-auto">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-green-400">Get In Touch</h2>
        
        <div className="space-y-6 text-gray-300">
          <section>
            <p className="mb-4">
              I'm always open to discussing new opportunities, interesting projects, or just having a chat.
              Whether you have a question about my work, want to collaborate, or just say hi - I'd love to hear from you!
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-3 text-green-300">Contact Information</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-2xl">📧</span>
                <div>
                  <p className="text-sm text-gray-400">Email</p>
                  <a href="mailto:julien@serbanescu.dev" className="text-green-400 hover:underline">
                    julien@serbanescu.dev
                  </a>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <span className="text-2xl">💼</span>
                <div>
                  <p className="text-sm text-gray-400">LinkedIn</p>
                  <a 
                    href="https://linkedin.com/in/julien-serbanescu" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-green-400 hover:underline"
                  >
                    linkedin.com/in/julien-serbanescu
                  </a>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <span className="text-2xl">🐙</span>
                <div>
                  <p className="text-sm text-gray-400">GitHub</p>
                  <a 
                    href="https://github.com/jserbanescu" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-green-400 hover:underline"
                  >
                    github.com/jserbanescu
                  </a>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <span className="text-2xl">🐦</span>
                <div>
                  <p className="text-sm text-gray-400">Twitter/X</p>
                  <a 
                    href="https://twitter.com/jserbanescu" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-green-400 hover:underline"
                  >
                    @jserbanescu
                  </a>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-3 text-green-300">Response Time</h3>
            <p>
              I typically respond within 24-48 hours. For urgent inquiries, please mention "URGENT" in the subject line.
            </p>
          </section>

          <section className="border-t border-green-900/30 pt-4 mt-6">
            <p className="text-sm text-gray-500">
              or simply type <span className="text-green-400 font-mono">sh "your message"</span> in the terminal to start a conversation with me!
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
