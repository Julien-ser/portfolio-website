'use client';

import { useEffect, useState } from 'react';

interface AboutProps {
  onClose?: () => void;
}

interface LinkedInData {
  name: string;
  headline: string;
  summary: string;
  industry: string;
  location: string;
  profilePicture: string;
  experience: string[];
  skills: string[];
}

export default function About({ onClose }: AboutProps) {
  const [linkedInData, setLinkedInData] = useState<LinkedInData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchLinkedInData() {
      try {
        const response = await fetch('/api/linkedin');
        const data = await response.json();

        if (data.success && data.formatted) {
          setLinkedInData(data.formatted);
        } else {
          setError(data.message || 'Failed to load LinkedIn profile');
        }
      } catch (err) {
        setError('Unable to connect to LinkedIn API');
      } finally {
        setLoading(false);
      }
    }

    fetchLinkedInData();
  }, []);

  // Helper function to render either LinkedIn data or fallback static content
  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-40">
          <div className="text-green-400 animate-pulse">Loading profile...</div>
        </div>
      );
    }

    if (error || !linkedInData) {
      return renderFallbackContent();
    }

    return (
      <div className="space-y-4 text-gray-300">
        <section>
          <h3 className="text-xl font-semibold mb-2 text-green-300">Who I Am</h3>
          <p>{linkedInData.summary || 'No summary available from LinkedIn.'}</p>
        </section>

        <section>
          <h3 className="text-xl font-semibold mb-2 text-green-300">What I Do</h3>
          <ul className="list-disc list-inside space-y-1 ml-4">
            {linkedInData.skills.length > 0 ? (
              linkedInData.skills.map((skill, idx) => <li key={idx}>{skill}</li>)
            ) : (
              <>
                <li>Full-stack web development with modern frameworks</li>
                <li>Machine learning and AI integration</li>
                <li>System design and architecture</li>
                <li>Open source contributions</li>
                <li>Technical writing and education</li>
              </>
            )}
          </ul>
        </section>

        <section>
          <h3 className="text-xl font-semibold mb-2 text-green-300">Experience</h3>
          <div className="space-y-3 ml-4">
            {linkedInData.experience.map((exp, idx) => (
              <div key={idx}>
                <p className="font-medium text-white">{exp}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h3 className="text-xl font-semibold mb-2 text-green-300">Connect</h3>
          <p className="mb-2">
            I'm always interested in new opportunities, collaborations, and interesting conversations.
            Feel free to reach out!
          </p>
          <div className="flex gap-4 ml-4">
            <a href="https://github.com/jserbanescu" target="_blank" rel="noopener noreferrer" 
               className="text-green-400 hover:underline">GitHub</a>
            <a href="https://linkedin.com/in/julien-serbanescu" target="_blank" rel="noopener noreferrer"
               className="text-green-400 hover:underline">LinkedIn</a>
            <a href="mailto:julien@serbanescu.dev" className="text-green-400 hover:underline">Email</a>
          </div>
        </section>
      </div>
    );
  };

  const renderFallbackContent = () => (
    <div className="space-y-4 text-gray-300">
      <section>
        <h3 className="text-xl font-semibold mb-2 text-green-300">Who I Am</h3>
        <p>
          I'm Julien Serbanescu, a passionate software engineer who loves building elegant solutions to complex problems.
          With a strong foundation in computer science and a curiosity for emerging technologies, I strive to create
          impactful software that makes a difference.
        </p>
      </section>

      <section>
        <h3 className="text-xl font-semibold mb-2 text-green-300">What I Do</h3>
        <ul className="list-disc list-inside space-y-1 ml-4">
          <li>Full-stack web development with modern frameworks</li>
          <li>Machine learning and AI integration</li>
          <li>System design and architecture</li>
          <li>Open source contributions</li>
          <li>Technical writing and education</li>
        </ul>
      </section>

      <section>
        <h3 className="text-xl font-semibold mb-2 text-green-300">Experience</h3>
        <div className="space-y-3 ml-4">
          <div>
            <p className="font-medium text-white">Senior Software Engineer</p>
            <p className="text-sm text-gray-400">Tech Innovation Lab | 2022 - Present</p>
            <p className="text-sm mt-1">Leading development of AI-powered developer tools and distributed systems.</p>
          </div>
          <div>
            <p className="font-medium text-white">Full-Stack Developer</p>
            <p className="text-sm text-gray-400">Creative Digital Agency | 2020 - 2022</p>
            <p className="text-sm mt-1">Built scalable web applications for enterprise clients.</p>
          </div>
        </div>
      </section>

      <section>
        <h3 className="text-xl font-semibold mb-2 text-green-300">Skills</h3>
        <div className="flex flex-wrap gap-2 ml-4">
          {['TypeScript', 'Python', 'React', 'Node.js', 'PostgreSQL', 'AWS', 'Docker', 
            'Kubernetes', 'TensorFlow', 'LangChain', 'GraphQL'].map(skill => (
            <span key={skill} className="px-3 py-1 bg-green-900/30 text-green-300 rounded-full text-sm border border-green-800">
              {skill}
            </span>
          ))}
        </div>
      </section>

      <section>
        <h3 className="text-xl font-semibold mb-2 text-green-300">Connect</h3>
        <p className="mb-2">
          I'm always interested in new opportunities, collaborations, and interesting conversations.
          Feel free to reach out!
        </p>
        <div className="flex gap-4 ml-4">
          <a href="https://github.com/jserbanescu" target="_blank" rel="noopener noreferrer" 
             className="text-green-400 hover:underline">GitHub</a>
          <a href="https://linkedin.com/in/julien-serbanescu" target="_blank" rel="noopener noreferrer"
             className="text-green-400 hover:underline">LinkedIn</a>
          <a href="mailto:julien@serbanescu.dev" className="text-green-400 hover:underline">Email</a>
        </div>
      </section>
    </div>
  );

  return (
    <div className="p-6 h-full overflow-y-auto">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold mb-4 text-green-400">
          {linkedInData?.name || 'About Me'}
        </h2>
        
        {linkedInData?.headline && (
          <p className="text-gray-400 italic mb-4">{linkedInData.headline}</p>
        )}

        {error && (
          <div className="mb-4 p-3 bg-yellow-900/30 border border-yellow-700 rounded text-yellow-300 text-sm">
            ⚠️ LinkedIn profile unavailable: {error}
          </div>
        )}

        {renderContent()}
      </div>
    </div>
  );
}
