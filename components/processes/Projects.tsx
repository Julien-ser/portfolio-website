'use client';

import { useState } from 'react';
import { projects } from '@/data/projects';

interface ProjectsProps {
  onClose?: () => void;
}

export default function Projects({ onClose }: ProjectsProps) {
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  
  const selected = selectedProject ? projects.find(p => p.id === selectedProject) : null;

  if (selected) {
    return (
      <div className="p-6 h-full overflow-y-auto">
        <button 
          onClick={() => setSelectedProject(null)}
          className="mb-4 text-green-400 hover:text-green-300 flex items-center gap-2"
        >
          ← Back to projects
        </button>
        
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-2 text-green-400">{selected.title}</h2>
          <p className="text-gray-400 mb-4">{selected.date}</p>
          
          <div className="mb-6">
            <p className="text-gray-300 mb-4">{selected.longDescription || selected.description}</p>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2 text-green-300">Technologies</h3>
            <div className="flex flex-wrap gap-2">
              {selected.technologies.map(tech => (
                <span key={tech} className="px-3 py-1 bg-green-900/30 text-green-300 rounded-full text-sm border border-green-800">
                  {tech}
                </span>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2 text-green-300">Links</h3>
            <div className="flex gap-4">
              {selected.links.github && (
                <a 
                  href={selected.links.github} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-green-400 hover:underline flex items-center gap-1"
                >
                  <span>📦</span> GitHub Repository
                </a>
              )}
              {selected.links.demo && (
                <a 
                  href={selected.links.demo} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-green-400 hover:underline flex items-center gap-1"
                >
                  <span>🌐</span> Live Demo
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 h-full overflow-y-auto">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-green-400">My Projects</h2>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {projects.map(project => (
            <div 
              key={project.id}
              onClick={() => setSelectedProject(project.id)}
              className="p-4 bg-gray-900/50 border border-green-900/30 rounded-lg cursor-pointer hover:bg-green-900/20 hover:border-green-700/50 transition-colors"
            >
              <h3 className="text-lg font-semibold mb-2 text-green-300">{project.title}</h3>
              <p className="text-gray-400 text-sm mb-3 line-clamp-2">{project.description}</p>
              
              <div className="flex flex-wrap gap-1 mb-3">
                {project.technologies.slice(0, 3).map(tech => (
                  <span key={tech} className="px-2 py-0.5 bg-green-900/30 text-green-300 rounded text-xs">
                    {tech}
                  </span>
                ))}
                {project.technologies.length > 3 && (
                  <span className="px-2 py-0.5 text-gray-500 text-xs">
                    +{project.technologies.length - 3} more
                  </span>
                )}
              </div>

              <div className="flex gap-3 text-sm">
                {project.links.github && (
                  <span className="text-green-400">GitHub</span>
                )}
                {project.links.demo && (
                  <span className="text-blue-400">Demo</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
