import React from 'react';
import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

import { getProjectById } from '@/data/projects';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const projectId = searchParams.get('project');

  let title = 'Julien Serbanescu - Portfolio';
  let description = 'Interactive terminal-style portfolio with AI chatbot';
  let techStack: string[] = [];
  let imageUrl: string | undefined;

  if (projectId) {
    const project = getProjectById(projectId);
    if (project) {
      title = `${project.title} - Julien Serbanescu`;
      description = project.description;
      techStack = project.technologies;
      imageUrl = project.images[0] || undefined;
    }
  }

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0a0a0a',
          backgroundImage: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%)',
          fontFamily: 'monospace',
          padding: '80px',
        }}
      >
        {/* Terminal window effect */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            border: '2px solid #00ff00',
            borderRadius: '8px',
            padding: '40px',
            maxWidth: '800px',
            width: '90%',
            boxShadow: '0 0 30px rgba(0, 255, 0, 0.3)',
          }}
        >
          {/* Terminal header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '30px',
              borderBottom: '1px solid #333',
              paddingBottom: '15px',
            }}
          >
            <div style={{ display: 'flex', gap: '8px' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#ff5f56' }} />
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#ffbd2e' }} />
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#27c93f' }} />
            </div>
            <div style={{ marginLeft: 'auto', color: '#00ff00', fontSize: '24px' }}>
              terminal — portfolio
            </div>
          </div>

          {/* Content */}
          <div style={{ display: 'flex', gap: '40px' }}>
            <div style={{ flex: 1 }}>
              <div
                style={{
                  color: '#00ff00',
                  fontSize: '20px',
                  marginBottom: '20px',
                  fontWeight: 'bold',
                }}
              >
                {title}
              </div>
              <div
                style={{
                  color: '#cccccc',
                  fontSize: '18px',
                  lineHeight: 1.5,
                  marginBottom: '30px',
                }}
              >
                {description}
              </div>
              {techStack.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                  {techStack.map((tech, i) => (
                    <span
                      key={i}
                      style={{
                        color: '#00ff00',
                        fontSize: '14px',
                        border: '1px solid #00ff00',
                        padding: '4px 12px',
                        borderRadius: '4px',
                      }}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Prompt */}
          <div
            style={{
              marginTop: '30px',
              display: 'flex',
              alignItems: 'center',
              color: '#00ff00',
            }}
          >
            <span style={{ marginRight: '8px' }}>$</span>
            <span style={{ color: '#00ff00' }}>./run_portfolio.sh</span>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            marginTop: '30px',
            color: '#666666',
            fontSize: '16px',
          }}
        >
          Julien Serbanescu — Full Stack Developer
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
