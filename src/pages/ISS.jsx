// ============================================================
// pages/ISS.jsx — ISS Live Tracker with 3D Globe
//
// Uses Three.js to render a real 3D Earth globe.
// A glowing marker moves on the globe every 5 seconds
// showing the ISS real-time position.
//
// Libraries used:
//   three        — 3D rendering (npm install three)
//   @react-three/fiber  — React wrapper for Three.js
//   @react-three/drei   — helpers (OrbitControls, Sphere, etc.)
//
// Install command (run in your project folder):
//   npm install three @react-three/fiber @react-three/drei
// ============================================================

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import SectionHeader from '../components/SectionHeader';
import { API } from '../utils/constants';
import './ISS.css';

// ── Converts lat/lng to a 3D XYZ point on a sphere of given radius
function latLngToVector3(lat, lng, radius) {
  const phi   = (90 - lat)  * (Math.PI / 180); // polar angle
  const theta = (lng + 180) * (Math.PI / 180); // azimuthal angle
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
     radius * Math.cos(phi),
     radius * Math.sin(phi) * Math.sin(theta)
  );
}

function ISS() {
  const mountRef  = useRef(null);  // div where Three.js canvas is mounted
  const markerRef = useRef(null);  // Three.js mesh for the ISS marker
  const sceneRef  = useRef(null);  // Three.js scene reference

  // ISS data state
  const [position, setPosition] = useState({ lat: null, lng: null });
  const [updated,  setUpdated]  = useState('');

  // ── Three.js setup — runs once on mount ──────────────────
  useEffect(() => {
    const mount  = mountRef.current;
    const width  = mount.clientWidth;
    const height = mount.clientHeight;

    // ── Scene, camera, renderer
    const scene    = new THREE.Scene();
    sceneRef.current = scene;

    const camera   = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 2.8);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0x000000, 0); // transparent background
    mount.appendChild(renderer.domElement);

    // ── Orbit controls — lets user drag to rotate globe
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping  = true;
    controls.dampingFactor  = 0.05;
    controls.enableZoom     = true;
    controls.minDistance    = 1.8;
    controls.maxDistance    = 5;
    controls.rotateSpeed    = 0.5;

    // ── Stars background — random points in a large sphere
    const starGeo  = new THREE.BufferGeometry();
    const starCount = 2000;
    const starVerts = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i++) {
      starVerts[i] = (Math.random() - 0.5) * 400;
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starVerts, 3));
    const starMat  = new THREE.PointsMaterial({ color: 0xe8eaed, size: 0.3, transparent: true, opacity: 0.6 });
    scene.add(new THREE.Points(starGeo, starMat));

    // ── Earth globe
    const earthGeo = new THREE.SphereGeometry(1, 64, 64);

    // Load Earth texture from a free public source
    const texLoader = new THREE.TextureLoader();
    const earthTex  = texLoader.load(
      'https://unpkg.com/three-globe/example/img/earth-night.jpg',
      undefined,
      undefined,
      // Fallback if texture fails — use solid colour
      () => earth.material.color.set(0x1a3a5c)
    );

    const earthMat = new THREE.MeshPhongMaterial({
      map:         earthTex,
      specularMap: texLoader.load('https://unpkg.com/three-globe/example/img/earth-water.png'),
      specular:    new THREE.Color(0x333333),
      shininess:   25,
    });
    const earth = new THREE.Mesh(earthGeo, earthMat);
    scene.add(earth);

    // ── Atmosphere glow ring
    const atmGeo = new THREE.SphereGeometry(1.02, 64, 64);
    const atmMat = new THREE.MeshPhongMaterial({
      color:       0x004488,
      transparent: true,
      opacity:     0.08,
      side:        THREE.FrontSide,
    });
    scene.add(new THREE.Mesh(atmGeo, atmMat));

    // ── Lights
    const ambient = new THREE.AmbientLight(0x333333);
    scene.add(ambient);

    const sunLight = new THREE.DirectionalLight(0xffffff, 1.2);
    sunLight.position.set(5, 3, 5);
    scene.add(sunLight);

    // ── ISS marker — glowing sphere at the ISS position
    // Start hidden (visible = false) until we get first real coordinates
    const markerGeo = new THREE.SphereGeometry(0.035, 16, 16); // bigger = easier to see
    const markerMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
    const marker    = new THREE.Mesh(markerGeo, markerMat);
    marker.visible  = false; // hidden until ISS position is fetched
    scene.add(marker);
    markerRef.current = marker;

    // Middle glow sphere
    const glowGeo = new THREE.SphereGeometry(0.06, 16, 16);
    const glowMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8, transparent: true, opacity: 0.35,
    });
    marker.add(new THREE.Mesh(glowGeo, glowMat));

    // Outer pulse sphere (larger, very transparent)
    const pulseGeo = new THREE.SphereGeometry(0.10, 16, 16);
    const pulseMat = new THREE.MeshBasicMaterial({
      color: 0x7dd3fc, transparent: true, opacity: 0.12,
    });
    marker.add(new THREE.Mesh(pulseGeo, pulseMat));

    // ── Grid lines — latitude/longitude lines on globe
    const gridMat = new THREE.LineBasicMaterial({ color: 0x1a3a5c, transparent: true, opacity: 0.3 });
    // Latitude lines (horizontal)
    for (let lat = -60; lat <= 60; lat += 30) {
      const pts = [];
      for (let lng = 0; lng <= 360; lng += 2) {
        pts.push(latLngToVector3(lat, lng - 180, 1.001));
      }
      const geo = new THREE.BufferGeometry().setFromPoints(pts);
      scene.add(new THREE.Line(geo, gridMat));
    }
    // Longitude lines (vertical)
    for (let lng = 0; lng < 360; lng += 30) {
      const pts = [];
      for (let lat = -90; lat <= 90; lat += 2) {
        pts.push(latLngToVector3(lat, lng - 180, 1.001));
      }
      const geo = new THREE.BufferGeometry().setFromPoints(pts);
      scene.add(new THREE.Line(geo, gridMat));
    }

    // ── Animation loop
    let animId;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      earth.rotation.y += 0.0005; // slow Earth rotation
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // ── Resize handler
    const handleResize = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // ── Cleanup on unmount
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      controls.dispose();
      renderer.dispose();
      mount.removeChild(renderer.domElement);
    };
  }, []);

  // ── ISS position fetch — runs every 5 seconds ───────────
  useEffect(() => {
    const fetchISS = async () => {
      try {
        const res  = await fetch(API.ISS);
        const data = await res.json(); // clean JSON now via Vite proxy
        const lat  = parseFloat(data.iss_position.latitude);
        const lng  = parseFloat(data.iss_position.longitude);

        setPosition({ lat: lat.toFixed(2), lng: lng.toFixed(2) });
        setUpdated(new Date().toLocaleTimeString());

        // Move the Three.js marker to new ISS coordinates
        if (markerRef.current) {
          const pos = latLngToVector3(lat, lng, 1.08);
          markerRef.current.position.copy(pos);
          markerRef.current.visible = true;
        }
      } catch (err) {
        console.error('ISS fetch error:', err);
      }
    };

    fetchISS();
    const id = setInterval(fetchISS, 5000);
    return () => clearInterval(id);
  }, []);

  return (
    <main className="page-wrap">
      <div className="container">
        <SectionHeader
          moduleId="MODULE_04 // ISS TRACKER"
          title="INTERNATIONAL SPACE STATION"
          sourceUrl="api.open-notify.org"
          status="LIVE — 5s UPDATE"
        />

        <div className="iss-layout">

          {/* 3D Globe panel */}
          <div className="iss-globe-panel">
            <div className="globe-mount" ref={mountRef} />
            <div className="globe-label">
              {position.lat && position.lng
                ? `ISS // LAT ${position.lat}° LNG ${position.lng}°`
                : 'ACQUIRING SIGNAL...'}
            </div>
            <div className="globe-hint">DRAG TO ROTATE · SCROLL TO ZOOM</div>
          </div>

          {/* Stats panel */}
          <div className="iss-stats-panel">
            {[
              { label: 'LATITUDE',      val: position.lat ?? '—', unit: 'DEGREES' },
              { label: 'LONGITUDE',     val: position.lng ?? '—', unit: 'DEGREES' },
              { label: 'ALTITUDE',      val: '408',               unit: 'KILOMETERS' },
              { label: 'ORBITAL SPEED', val: '27.6K',             unit: 'KM / HOUR' },
            ].map(({ label, val, unit }) => (
              <div key={label} className="iss-stat">
                <div className="iss-stat-label">// {label}</div>
                <div className="iss-stat-val">{val}</div>
                <div className="iss-stat-unit">{unit}</div>
              </div>
            ))}

            {updated && (
              <div className="iss-updated">
                LAST UPDATE: {updated}
              </div>
            )}
          </div>

        </div>
      </div>
    </main>
  );
}

export default ISS;
