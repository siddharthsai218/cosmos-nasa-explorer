import { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import SectionHeader from '../components/SectionHeader';
import './About.css';

const TEAM_MEMBERS = [
  {
    id: 1, name: "Siddharth", planetTheme: "planet-ice",
    img: '/team/Siddhardh.jpeg', // Using smaller resolution for card size
    links: [
      { id: 'li', type: 'linkedin', url: 'www.linkedin.com/in/byn-siddharth-sai' },
      { id: 'gh', type: 'github', url: 'https://github.com/siddharthsai218' },
      { id: 'P', type: 'website', url: 'https://siddharthsai218.github.io/portfolio/' }
    ]
  },
  {
    id: 2, name: "Surya", planetTheme: "planet-amber",
    img: '/team/Surya.jpeg',
    links: [
      { id: 'li', type: 'linkedin', url: 'https://www.linkedin.com/in/rama-sri-surya?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app' },
      { id: 'gh', type: 'github', url: 'https://github.com/dashboard' },
       { id: 'P', type: 'Portfolio', url: ' https://kramasrisurya.github.io/portfolio/' }
    ]
  },
  {
    id: 3, name: "Manjunadha", planetTheme: "planet-green",
    img: '/team/Manju.jpg',
    links: [
      { id: 'LI', type: 'LinkedIn', url: 'https://www.linkedin.com/in/mummadi-manjunadha-reddy-6209053b5/' },
      { id: 'gh', type: 'github', url: 'https://github.com/manju220208-ai' },
      { id: 'P', type: 'Portfolio', url: 'https://manju220208-ai.github.io/My-Portfolio/' }
    ]
  },
  {
    id: 4, name: "Santhosh", planetTheme: "planet-red",
    img: '/team/Santhosh.jpeg', 
    links: [
      { id: 'gh', type: 'GITHUB', url: 'https://github.com/saisantosh1116-wq' },
      { id: 'ws', type: 'website', url: 'https://saisantosh1116-wq.github.io/23CSE113-UID_Project/' }
    ]
  }
];

// ── 3D Planet Component using Three.js ──
const ThreePlanet = ({ theme }) => {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
    camera.position.set(0, 0, 3.8);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(240, 240);
    renderer.setPixelRatio(window.devicePixelRatio);
    mount.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = false;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 1.5;

    let colorHex = 0x38bdf8; 
    if (theme === 'planet-amber') colorHex = 0xfbbf24;
    if (theme === 'planet-green') colorHex = 0x4ade80;
    if (theme === 'planet-red')   colorHex = 0xf87171;

    const coreMat = new THREE.MeshStandardMaterial({ color: 0x0a0a0a, roughness: 1 });
    const core = new THREE.Mesh(new THREE.SphereGeometry(1.0, 32, 32), coreMat);
    scene.add(core);

    const shellMat = new THREE.MeshBasicMaterial({
      color: colorHex, wireframe: true, transparent: true, opacity: 0.35
    });
    const shell = new THREE.Mesh(new THREE.SphereGeometry(1.03, 24, 24), shellMat);
    scene.add(shell);

    const ambient = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambient);
    const pointLight = new THREE.PointLight(colorHex, 2, 10);
    pointLight.position.set(2, 2, 3);
    scene.add(pointLight);

    let animId;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      controls.dispose();
      renderer.dispose();
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, [theme]);

  return <div ref={mountRef} className="three-planet-mount" />;
};

function About() {
  const [activeMemberId, setActiveMemberId] = useState(null);

  const activeMember = activeMemberId 
    ? TEAM_MEMBERS.find(m => m.id === activeMemberId) 
    : null;

  return (
    <main className="page-wrap about-page-bg">
      <div className="about-stars-overlay" />

      <div className="container" style={{ position: 'relative', zIndex: 10 }}>
        <SectionHeader
          moduleId="MODULE_07 // CREW"
          title={activeMember ? "PERSONNEL FILE" : "SYSTEM ARCHITECTS"}
          sourceUrl="LOCAL_DB"
          status={activeMember ? "VIEWING SECURE DATA" : "4 MEMBERS ACTIVE"}
        />

        {!activeMember ? (
          <div className="roster-array-wrapper">
            <div className="roster-array">
              {TEAM_MEMBERS.map((member) => (
                <button
                  key={member.id}
                  className="roster-card"
                  onClick={() => setActiveMemberId(member.id)}
                >
                  {/* Image background INSIDE the card */}
                  <div 
                    className="roster-card-bg" 
                    style={{ backgroundImage: `url(${member.img})` }} 
                  />
                  
                  <div className="roster-card-inner">
                    <div className="t-label">ID: 00{member.id}</div>
                    <h2>{member.name}</h2>
                    <div className="card-scanline" />
                  </div>
                  <div className={`roster-accent bg-${member.planetTheme}`} />
                </button>
              ))}
            </div>
            <div className="roster-base-light" />
          </div>
        ) : (
          <div className="individual-view">
            <div className="hologram-nameplate">
               <h1 className="hologram-text" data-text={activeMember.name}>
                 {activeMember.name}
               </h1>
            </div>

            <div className="planetary-hub">
              <ThreePlanet theme={activeMember.planetTheme} />
              <div className="orbital-ring ring-back" />
              <div className="orbital-ring ring-front" />

              <div className="orbit-system">
                {activeMember.links.map((link, i) => (
                  <a
                    key={link.id}
                    href={link.url}
                    className="orbit-node"
                    style={{ '--index': i, '--total': activeMember.links.length }}
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