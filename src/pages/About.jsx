import { useState } from 'react';
import SectionHeader from '../components/SectionHeader';
import './About.css';

const TEAM_MEMBERS = [
  {
    id: 1, name: "PERSON 1", planetTheme: "planet-ice",
    links: [
      { id: 'li', type: 'linkedin', url: '#' },
      { id: 'gh', type: 'github', url: '#' },
      { id: 'ws', type: 'website', url: '#' }
    ]
  },
  {
    id: 2, name: "PERSON 2", planetTheme: "planet-amber",
    links: [
      { id: 'li', type: 'linkedin', url: '#' },
      { id: 'gh', type: 'github', url: '#' }
    ]
  },
  {
    id: 3, name: "PERSON 3", planetTheme: "planet-green",
    links: [
      { id: 'ws', type: 'website', url: '#' },
      { id: 'gh', type: 'github', url: '#' },
      { id: 'cb', type: 'codebase', url: '#' }
    ]
  },
  {
    id: 4, name: "PERSON 4", planetTheme: "planet-red",
    links: [
      { id: 'li', type: 'linkedin', url: '#' },
      { id: 'ws', type: 'website', url: '#' }
    ]
  }
];

function About() {
  const [activeMemberId, setActiveMemberId] = useState(null);

  const activeMember = activeMemberId 
    ? TEAM_MEMBERS.find(m => m.id === activeMemberId) 
    : null;

  return (
    <main className="page-wrap about-page-bg">
      <div className="about-stars-overlay" />

      <div className="container">
        <SectionHeader
          moduleId="MODULE_07 // CREW"
          title={activeMember ? "PERSONNEL FILE" : "SYSTEM ARCHITECTS"}
          sourceUrl="LOCAL_DB"
          status={activeMember ? "VIEWING SECURE DATA" : "4 MEMBERS ACTIVE"}
        />

        {!activeMember ? (
          <div className="about-grid-wrapper">
            <div className="about-grid">
              {TEAM_MEMBERS.map((member, index) => (
                <button
                  key={member.id}
                  className={`person-card grid-pos-${index + 1}`}
                  onClick={() => setActiveMemberId(member.id)}
                >
                  <div className="person-card-inner">
                    <div className="t-label">ID: 00{member.id}</div>
                    <h2>{member.name}</h2>
                    <div className="card-scanline" />
                  </div>
                </button>
              ))}
              
              <div className="about-center-hub">
                <span>ABOUT</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="individual-view">
            
            <div className="hologram-nameplate">
               <h1 className="hologram-text" data-text={activeMember.name}>
                 {activeMember.name}
               </h1>
            </div>

            <div className="planetary-hub">
              
              <div className={`planet-core ${activeMember.planetTheme}`} />

              <div className="orbital-ring ring-back" />
              <div className="orbital-ring ring-front" />

              <div className="orbit-system">
                {activeMember.links.map((link, i) => (
                  <a
                    key={link.id}
                    href={link.url}
                    className="orbit-node"
                    style={{
                      '--index': i,
                      '--total': activeMember.links.length
                    }}
                  >
                    <div className="orbit-icon">
                      {link.type.substring(0, 2).toUpperCase()}
                    </div>
                    <span className="orbit-label">{link.type}</span>
                  </a>
                ))}
              </div>
            </div>

            <button 
              className="btn btn-ghost" 
              onClick={() => setActiveMemberId(null)}
              style={{ marginTop: '48px' }}
            >
              [ RETURN TO ROSTER ]
            </button>
          </div>
        )}
      </div>
    </main>
  );
}

export default About;