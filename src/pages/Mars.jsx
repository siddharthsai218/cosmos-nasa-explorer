// ============================================================
// pages/Mars.jsx — Mars Rover Gallery (hardcoded images)
//
// Uses real NASA Mars rover images hardcoded directly.
// No API call needed — always works, never empty.
// Images sourced from NASA's public Mars photo archive.
// ============================================================

import { useState } from 'react';
import SectionHeader from '../components/SectionHeader';
import './Mars.css';

// Real NASA Mars rover photos — hardcoded so it always works
// Grouped by rover, each with camera name, sol, and earth date
const MARS_DATA = {
  curiosity: [
    { id: 1,  img: 'https://mars.nasa.gov/msl-raw-images/proj/msl/redops/ods/surface/sol/01000/opgs/edr/fcam/FLB_486265257EDR_F0481570FHAZ00323M_.JPG', cam: 'FHAZ', sol: 1000, date: '2015-05-30' },
    { id: 2,  img: 'https://mars.nasa.gov/msl-raw-images/proj/msl/redops/ods/surface/sol/01000/opgs/edr/rcam/RLB_486265291EDR_F0481570RHAZ00323M_.JPG', cam: 'RHAZ', sol: 1000, date: '2015-05-30' },
    { id: 3,  img: 'https://mars.nasa.gov/msl-raw-images/proj/msl/redops/ods/surface/sol/01000/opgs/edr/ncam/NLB_486265256EDR_F0481570NCAM00573M_.JPG', cam: 'NAVCAM', sol: 1000, date: '2015-05-30' },
    { id: 4,  img: 'https://mars.nasa.gov/msl-raw-images/msss/01000/mcam/1000MR0044631300503690E01_DXXX.jpg', cam: 'MASTCAM', sol: 1000, date: '2015-05-30' },
    { id: 5,  img: 'https://mars.nasa.gov/msl-raw-images/msss/01000/mcam/1000ML0044631300204010E03_DXXX.jpg', cam: 'MASTCAM', sol: 1000, date: '2015-05-30' },
    { id: 6,  img: 'https://mars.nasa.gov/msl-raw-images/proj/msl/redops/ods/surface/sol/00800/opgs/edr/fcam/FLB_469576009EDR_F0450188FHAZ00323M_.JPG', cam: 'FHAZ', sol: 800, date: '2014-11-11' },
    { id: 7,  img: 'https://mars.nasa.gov/msl-raw-images/proj/msl/redops/ods/surface/sol/00800/opgs/edr/rcam/RLB_469576050EDR_F0450188RHAZ00323M_.JPG', cam: 'RHAZ', sol: 800, date: '2014-11-11' },
    { id: 8,  img: 'https://mars.nasa.gov/msl-raw-images/proj/msl/redops/ods/surface/sol/00500/opgs/edr/fcam/FLB_446475799EDR_F0310008FHAZ00323M_.JPG', cam: 'FHAZ', sol: 500, date: '2014-01-21' },
    { id: 9,  img: 'https://mars.nasa.gov/msl-raw-images/proj/msl/redops/ods/surface/sol/00500/opgs/edr/ncam/NLB_446475784EDR_F0310008NCAM00573M_.JPG', cam: 'NAVCAM', sol: 500, date: '2014-01-21' },
    { id: 10, img: 'https://mars.nasa.gov/msl-raw-images/proj/msl/redops/ods/surface/sol/00100/opgs/edr/fcam/FLB_410902870EDR_F0050000FHAZ00323M_.JPG', cam: 'FHAZ', sol: 100, date: '2012-11-16' },
    { id: 11, img: 'https://mars.nasa.gov/msl-raw-images/proj/msl/redops/ods/surface/sol/00001/opgs/edr/fcam/FLA_397502305EDR_F0020000FHAZ00305M_.JPG', cam: 'FHAZ', sol: 1, date: '2012-08-07' },
    { id: 12, img: 'https://mars.nasa.gov/msl-raw-images/proj/msl/redops/ods/surface/sol/00001/opgs/edr/rcam/RLA_397502386EDR_F0020000RHAZ00305M_.JPG', cam: 'RHAZ', sol: 1, date: '2012-08-07' },
  ],
  opportunity: [
    { id: 13, img: 'https://mars.nasa.gov/mer/gallery/all/2/f/001/2F126468064EDN0000P1001L0M1-BR.JPG', cam: 'FHAZ', sol: 1, date: '2004-01-25' },
    { id: 14, img: 'https://mars.nasa.gov/mer/gallery/all/2/r/001/2R126468327EDN0000P1001R0M1-BR.JPG', cam: 'RHAZ', sol: 1, date: '2004-01-25' },
    { id: 15, img: 'https://mars.nasa.gov/mer/gallery/all/2/n/001/2N126467216EFF0000P0531L0M1-BR.JPG', cam: 'NAVCAM', sol: 1, date: '2004-01-25' },
    { id: 16, img: 'https://mars.nasa.gov/mer/gallery/all/2/p/001/2P126467939EDN0000P2600R0M1-BR.JPG', cam: 'PANCAM', sol: 1, date: '2004-01-25' },
    { id: 17, img: 'https://mars.nasa.gov/mer/gallery/all/2/f/100/2F130308408EDN3600P1001L0M1-BR.JPG', cam: 'FHAZ', sol: 100, date: '2004-04-25' },
    { id: 18, img: 'https://mars.nasa.gov/mer/gallery/all/2/n/100/2N130308530EFF3600P0531L0M1-BR.JPG', cam: 'NAVCAM', sol: 100, date: '2004-04-25' },
    { id: 19, img: 'https://mars.nasa.gov/mer/gallery/all/2/p/100/2P130308455EFF3600P2600R0M1-BR.JPG', cam: 'PANCAM', sol: 100, date: '2004-04-25' },
    { id: 20, img: 'https://mars.nasa.gov/mer/gallery/all/2/f/500/2F148605235EDN6643P1001L0M1-BR.JPG', cam: 'FHAZ', sol: 500, date: '2005-06-09' },
    { id: 21, img: 'https://mars.nasa.gov/mer/gallery/all/2/r/500/2R148605269EDN6643P1001R0M1-BR.JPG', cam: 'RHAZ', sol: 500, date: '2005-06-09' },
    { id: 22, img: 'https://mars.nasa.gov/mer/gallery/all/2/n/500/2N148605244EFF6643P0531L0M1-BR.JPG', cam: 'NAVCAM', sol: 500, date: '2005-06-09' },
    { id: 23, img: 'https://mars.nasa.gov/mer/gallery/all/2/p/500/2P148605255EFF6643P2600R0M1-BR.JPG', cam: 'PANCAM', sol: 500, date: '2005-06-09' },
    { id: 24, img: 'https://mars.nasa.gov/mer/gallery/all/2/p/1000/2P168874068EFFAMH5P2600R0M1-BR.JPG', cam: 'PANCAM', sol: 1000, date: '2006-09-22' },
  ],
  spirit: [
    { id: 25, img: 'https://mars.nasa.gov/mer/gallery/all/1/f/001/1F126380936EDN0000P1001L0M1-BR.JPG', cam: 'FHAZ', sol: 1, date: '2004-01-04' },
    { id: 26, img: 'https://mars.nasa.gov/mer/gallery/all/1/r/001/1R126380890EDN0000P1001R0M1-BR.JPG', cam: 'RHAZ', sol: 1, date: '2004-01-04' },
    { id: 27, img: 'https://mars.nasa.gov/mer/gallery/all/1/n/001/1N126380785EFF0000P0531L0M1-BR.JPG', cam: 'NAVCAM', sol: 1, date: '2004-01-04' },
    { id: 28, img: 'https://mars.nasa.gov/mer/gallery/all/1/p/001/1P126380904EFF0000P2600R0M1-BR.JPG', cam: 'PANCAM', sol: 1, date: '2004-01-04' },
    { id: 29, img: 'https://mars.nasa.gov/mer/gallery/all/1/f/100/1F130125825EDN3507P1001L0M1-BR.JPG', cam: 'FHAZ', sol: 100, date: '2004-04-14' },
    { id: 30, img: 'https://mars.nasa.gov/mer/gallery/all/1/n/100/1N130125905EFF3507P0531L0M1-BR.JPG', cam: 'NAVCAM', sol: 100, date: '2004-04-14' },
    { id: 31, img: 'https://mars.nasa.gov/mer/gallery/all/1/p/100/1P130125853EFF3507P2600R0M1-BR.JPG', cam: 'PANCAM', sol: 100, date: '2004-04-14' },
    { id: 32, img: 'https://mars.nasa.gov/mer/gallery/all/1/f/500/1F148415149EDN6441P1001L0M1-BR.JPG', cam: 'FHAZ', sol: 500, date: '2005-05-29' },
    { id: 33, img: 'https://mars.nasa.gov/mer/gallery/all/1/r/500/1R148415190EDN6441P1001R0M1-BR.JPG', cam: 'RHAZ', sol: 500, date: '2005-05-29' },
    { id: 34, img: 'https://mars.nasa.gov/mer/gallery/all/1/n/500/1N148415152EFF6441P0531L0M1-BR.JPG', cam: 'NAVCAM', sol: 500, date: '2005-05-29' },
    { id: 35, img: 'https://mars.nasa.gov/mer/gallery/all/1/p/500/1P148415172EFF6441P2600R0M1-BR.JPG', cam: 'PANCAM', sol: 500, date: '2005-05-29' },
    { id: 36, img: 'https://mars.nasa.gov/mer/gallery/all/1/p/400/1P144841884EFF5P32P2600R0M1-BR.JPG', cam: 'PANCAM', sol: 400, date: '2005-02-17' },
  ],
};

const ROVER_INFO = {
  curiosity:   { full: 'Mars Science Laboratory Curiosity', landed: 'August 6, 2012',  status: 'ACTIVE' },
  opportunity: { full: 'Mars Exploration Rover Opportunity', landed: 'January 25, 2004', status: 'INACTIVE' },
  spirit:      { full: 'Mars Exploration Rover Spirit',      landed: 'January 4, 2004',  status: 'INACTIVE' },
};

function Mars() {
  const [rover,   setRover]   = useState('curiosity');
  const [lightbox, setLightbox] = useState(null);

  const photos = MARS_DATA[rover];
  const info   = ROVER_INFO[rover];

  return (
    <main className="page-wrap">
      <div className="container">
        <SectionHeader
          moduleId="MODULE_02 // MARS"
          title="MARS ROVER GALLERY"
          sourceUrl="NASA Mars Photo Archive"
          status="ARCHIVE DATA"
        />

        {/* Rover tabs */}
        <div className="mars-toolbar">
          {Object.keys(MARS_DATA).map(r => (
            <button
              key={r}
              className={`rover-tab ${rover === r ? 'active' : ''}`}
              onClick={() => { setRover(r); setLightbox(null); }}
            >
              {r.toUpperCase()}
            </button>
          ))}

          {/* Rover info strip */}
          <div className="rover-info-strip">
            <span className="rover-info-name">{info.full}</span>
            <span className="rover-info-sep">//</span>
            <span className="rover-info-date">LANDED: {info.landed}</span>
            <span className="rover-info-sep">//</span>
            <span className={`rover-status ${info.status === 'ACTIVE' ? 'active' : 'inactive'}`}>
              {info.status}
            </span>
          </div>
        </div>

        {/* Photo grid */}
        <div className="mars-grid">
          {photos.map(photo => (
            <div
              key={photo.id}
              className="mars-thumb"
              onClick={() => setLightbox(photo)}
            >
              <img
                src={photo.img}
                alt={`Mars Sol ${photo.sol}`}
                loading="lazy"
                className="mars-thumb-img"
                onError={e => {
                  // If image fails to load, show a placeholder
                  e.target.style.display = 'none';
                  e.target.parentElement.classList.add('img-error');
                }}
              />
              <div className="mars-thumb-hud">
                <div className="mars-thumb-cam">{photo.cam}</div>
                <div className="mars-thumb-sol">SOL {photo.sol}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div className="lightbox" onClick={e => { if (e.target === e.currentTarget) setLightbox(null); }}>
          <div className="lightbox-inner">
            <div className="lightbox-header">
              <span className="lightbox-cam">{lightbox.cam} — {ROVER_INFO[rover].full}</span>
              <button className="lightbox-close" onClick={() => setLightbox(null)}>
                [ CLOSE // ESC ]
              </button>
            </div>
            <img src={lightbox.img} alt="Mars" className="lightbox-img" />
            <div className="lightbox-meta">
              SOL {lightbox.sol} &nbsp;//&nbsp; {rover.toUpperCase()} &nbsp;//&nbsp; EARTH DATE: {lightbox.date}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default Mars;
