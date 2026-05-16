import { useState } from 'react';
import SectionHeader from '../components/SectionHeader';
import './Mars.css';

const MARS_DATA = {

  


  curiosity: [
    { id: 1,  img: 'https://mars.nasa.gov/msl-raw-images/proj/msl/redops/ods/surface/sol/01000/opgs/edr/fcam/FLB_486265257EDR_F0481570FHAZ00323M_.JPG', cam: 'FHAZ', sol: 1000, date: '2015-05-30' },
    { id: 2,  img: 'https://mars.nasa.gov/msl-raw-images/proj/msl/redops/ods/surface/sol/01000/opgs/edr/rcam/RLB_486265291EDR_F0481570RHAZ00323M_.JPG', cam: 'RHAZ', sol: 1000, date: '2015-05-30' },
    
    { id: 4,  img: 'https://mars.nasa.gov/msl-raw-images/msss/01000/mcam/1000MR0044631300503690E01_DXXX.jpg', cam: 'MASTCAM', sol: 1000, date: '2015-05-30' },
    
  ],
  opportunity: [
    { id: 13, img: '/mars-photos/photo-1.jpeg', cam: 'FHAZ', sol: 1, date: '2004-01-25' },
   
   
  ],
  spirit: [
    { id: 14, img: '/mars-photos/Unknown.jpg', cam: 'FHAZ', sol: 1, date: '2004-01-25' },
    { id: 15, img: '/mars-photos/Unknown-3.jpeg', cam: 'FHAZ', sol: 1, date: '2004-01-25' },
    
  ],
};

const ROVER_INFO = {
  curiosity:   { full: 'MSL Curiosity', landed: 'AUG 06, 2012',  status: 'ACTIVE' },
  opportunity: { full: 'MER Opportunity', landed: 'JAN 25, 2004', status: 'INACTIVE' },
  spirit:      { full: 'MER Spirit',      landed: 'JAN 04, 2004',  status: 'INACTIVE' },
};

function Mars() {
  const [rover, setRover] = useState('curiosity');
  const [lightbox, setLightbox] = useState(null);

  const photos = MARS_DATA[rover];
  const info   = ROVER_INFO[rover];

  return (
    <main className="page-wrap mars-page-bg">
      {/* Background FX */}
      <div className="mars-stars-overlay" />
      <div className="mars-scanline-bg" />

      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        <SectionHeader
          moduleId="MODULE_02 // MARS"
          title="SURFACE TELEMETRY"
          sourceUrl="NASA ARCHIVE"
          status="UPLINK ESTABLISHED"
        />

        {/* Futuristic Control Deck */}
        <div className="hud-control-deck">
          <div className="hud-corner top-left" />
          <div className="hud-corner top-right" />
          <div className="hud-corner bottom-left" />
          <div className="hud-corner bottom-right" />

          <div className="rover-tabs">
            {Object.keys(MARS_DATA).map(r => (
              <button
                key={r}
                className={`hud-tab ${rover === r ? 'active' : ''}`}
                onClick={() => { setRover(r); setLightbox(null); }}
              >
                {r.toUpperCase()}
              </button>
            ))}
          </div>

          <div className="hud-telemetry">
            <div className="tel-block">
              <span className="tel-label">DESIGNATION</span>
              <span className="tel-val">{info.full}</span>
            </div>
            <div className="tel-block">
              <span className="tel-label">DEPLOYED</span>
              <span className="tel-val">{info.landed}</span>
            </div>
            <div className="tel-block">
              <span className="tel-label">UPLINK STATUS</span>
              <span className={`tel-val ${info.status === 'ACTIVE' ? 'txt-green' : 'txt-red'}`}>
                {info.status}
              </span>
            </div>
          </div>
        </div>

        {/* Targeting Grid Gallery */}
        <div className="hud-gallery">
          {photos.map(photo => (
            <div
              key={photo.id}
              className="hud-photo-card"
              onClick={() => setLightbox(photo)}
            >
              {/* Corner targeting brackets */}
              <div className="bracket tl" />
              <div className="bracket tr" />
              <div className="bracket bl" />
              <div className="bracket br" />

              <div className="img-wrapper">
                <img
                  src={photo.img}
                  alt={`Sol ${photo.sol}`}
                  loading="lazy"
                  className="hud-photo-img"
                  onError={e => {
                    e.target.style.display = 'none';
                    e.target.parentElement.classList.add('img-error');
                  }}
                />
                <div className="hud-target-overlay">
                  <div className="crosshair-h" />
                  <div className="crosshair-v" />
                  <div className="target-circle" />
                </div>
              </div>

              <div className="hud-photo-data">
                <span>CAM: {photo.cam}</span>
                <span>SOL: {photo.sol}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cyberpunk Analysis Modal */}
      {lightbox && (
        <div className="analysis-modal-overlay" onClick={e => { if (e.target === e.currentTarget) setLightbox(null); }}>
          <div className="analysis-modal">
            <div className="hud-corner top-left" />
            <div className="hud-corner top-right" />
            <div className="hud-corner bottom-left" />
            <div className="hud-corner bottom-right" />

            <div className="modal-header">
              <div className="modal-title">
                <span className="blink-dot" /> TARGET ANALYSIS // {lightbox.cam}
              </div>
              <button className="modal-close" onClick={() => setLightbox(null)}>
                [ ABORT ]
              </button>
            </div>

            <div className="modal-viewport">
              <div className="viewport-scanline" />
              <img src={lightbox.img} alt="Mars Target" className="modal-img" />
              <div className="viewport-hud-overlay">
                <div className="vh-corner tl" />
                <div className="vh-corner br" />
                <div className="center-reticle" />
              </div>
            </div>

            <div className="modal-footer">
              <div className="footer-stat"><span>UNIT:</span> {rover.toUpperCase()}</div>
              <div className="footer-stat"><span>SOL:</span> {lightbox.sol}</div>
              <div className="footer-stat"><span>EARTH DATE:</span> {lightbox.date}</div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default Mars;