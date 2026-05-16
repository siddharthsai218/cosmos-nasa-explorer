import { useState } from 'react';
import SectionHeader from '../components/SectionHeader';
import './Newsletter.css';

function NewsletterPage() {
  const [formData, setFormData] = useState({
    fullName: '', email: '', password: '', age: '', phone: '',
    dob: '', gender: '', country: '', bio: '', website: '',
    receiveUpdates: false, technologies: [],
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const techOptions = ['React', 'JavaScript', 'Node.js', 'Python', 'Java', 'AI/ML'];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox' && name === 'technologies') {
      let updatedTech = [...formData.technologies];
      if (checked) updatedTech.push(value);
      else updatedTech = updatedTech.filter((tech) => tech !== value);
      setFormData({ ...formData, technologies: updatedTech });
      return;
    }
    if (type === 'checkbox') {
      setFormData({ ...formData, [name]: checked });
      return;
    }
    setFormData({ ...formData, [name]: value });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'FULL NAME IS REQUIRED';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) newErrors.email = 'EMAIL IS REQUIRED';
    else if (!emailRegex.test(formData.email)) newErrors.email = 'INVALID EMAIL FORMAT';
    if (!formData.password) newErrors.password = 'PASSWORD IS REQUIRED';
    else if (formData.password.length < 6) newErrors.password = 'SECURITY BREACH: < 6 CHARS';
    if (!formData.age) newErrors.age = 'AGE IS REQUIRED';
    else if (formData.age < 18) newErrors.age = 'CLEARANCE DENIED: MINORS NOT PERMITTED';
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(formData.phone)) newErrors.phone = 'EXACTLY 10 DIGITS REQUIRED';
    if (!formData.dob) newErrors.dob = 'DATE OF BIRTH REQUIRED';
    if (!formData.gender) newErrors.gender = 'SELECT DESIGNATION';
    if (!formData.country) newErrors.country = 'SELECT SECTOR';
    if (!formData.bio.trim()) newErrors.bio = 'MISSION LOG CANNOT BE EMPTY';
    if (formData.bio.length < 20) newErrors.bio = 'MISSION LOG MUST EXCEED 20 CHARS';
    if (formData.website && !formData.website.startsWith('http')) newErrors.website = 'INVALID PROTOCOL (HTTP/HTTPS REQUIRED)';
    if (formData.technologies.length === 0) newErrors.technologies = 'SELECT AT LEAST ONE PROTOCOL';
    if (!formData.receiveUpdates) newErrors.receiveUpdates = 'UPLINK CONSENT REQUIRED';
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <main className="page-wrap nl-page-bg">
        <div className="nl-stars-overlay" />
        <div className="container">
          <div className="success-box">
            <h1 className="success-title">TRANSMISSION SUCCESSFUL</h1>
            <p className="success-msg">// PERSONNEL FILE SECURED IN MAINFRAME //</p>
            <button className="nl-btn" onClick={() => setSubmitted(false)}>
              [ INITIATE NEW PERSONNEL UPLINK ]
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="page-wrap nl-page-bg">
      {/* Space Background Effects */}
      <div className="nl-stars-overlay" />
      <div className="nl-grid-overlay" />

      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        <SectionHeader
          moduleId="MODULE_08 // RECRUITMENT"
          title="PERSONNEL REGISTRATION"
          sourceUrl="SECURE_UPLINK"
          status="AWAITING INPUT"
        />

        <div className="newsletter-container">
          {/* Decorative HUD Elements */}
          <div className="hud-corner top-left"></div>
          <div className="hud-corner top-right"></div>
          <div className="hud-corner bottom-left"></div>
          <div className="hud-corner bottom-right"></div>
          <div className="nl-scan-line"></div>

          <form onSubmit={handleSubmit} className="nl-form">
            <div className="form-row">
              <div className="form-group">
                <label>OPERATIVE DESIGNATION (FULL NAME)</label>
                <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="e.g. John Doe" />
                {errors.fullName && <span className="error-msg">{errors.fullName}</span>}
              </div>

              <div className="form-group">
                <label>SECURE COMM-LINK (EMAIL)</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="operative@cosmos.net" />
                {errors.email && <span className="error-msg">{errors.email}</span>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>ENCRYPTION KEY (PASSWORD)</label>
                <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="••••••••" />
                {errors.password && <span className="error-msg">{errors.password}</span>}
              </div>

              <div className="form-group">
                <label>SOLAR CYCLES (AGE)</label>
                <input type="number" name="age" value={formData.age} onChange={handleChange} placeholder="18+" />
                {errors.age && <span className="error-msg">{errors.age}</span>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>COMMS FREQUENCY (PHONE)</label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="10-DIGIT IDENTIFIER" />
                {errors.phone && <span className="error-msg">{errors.phone}</span>}
              </div>

              <div className="form-group">
                <label>ORIGIN DATE (DOB)</label>
                <input type="date" name="dob" value={formData.dob} onChange={handleChange} />
                {errors.dob && <span className="error-msg">{errors.dob}</span>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>BIOLOGICAL PROFILE</label>
                <div className="radio-group">
                  {['Male', 'Female', 'Other'].map(gen => (
                    <label key={gen} className="custom-radio">
                      <input type="radio" name="gender" value={gen} onChange={handleChange} />
                      <span className="radio-mark"></span>
                      {gen.toUpperCase()}
                    </label>
                  ))}
                </div>
                {errors.gender && <span className="error-msg">{errors.gender}</span>}
              </div>

              <div className="form-group">
                <label>TERRESTRIAL SECTOR (COUNTRY)</label>
                <select name="country" value={formData.country} onChange={handleChange}>
                  <option value="">-- SELECT PROTOCOL --</option>
                  <option value="India">INDIA SECTOR</option>
                  <option value="USA">USA SECTOR</option>
                  <option value="UK">UK SECTOR</option>
                  <option value="Germany">GERMANY SECTOR</option>
                  <option value="Germany">North Korea SECTOR</option>
                </select>
                {errors.country && <span className="error-msg">{errors.country}</span>}
              </div>
            </div>

            <div className="form-group">
              <label>OPERATIVE LOG (BIO)</label>
              <textarea name="bio" rows="3" value={formData.bio} onChange={handleChange} placeholder="ENTER LOG ARCHIVE (MIN 20 CHARS)..." />
              {errors.bio && <span className="error-msg">{errors.bio}</span>}
            </div>

            <div className="form-group">
              <label>EXTERNAL DATABASE (WEBSITE)</label>
              <input type="url" name="website" value={formData.website} onChange={handleChange} placeholder="https://" />
              {errors.website && <span className="error-msg">{errors.website}</span>}
            </div>

            <div className="form-group">
              <label>SYSTEM CAPABILITIES (TECHNOLOGIES)</label>
              <div className="checkbox-group">
                {techOptions.map((tech) => (
                  <label key={tech} className="custom-checkbox">
                    <input type="checkbox" name="technologies" value={tech} onChange={handleChange} />
                    <span className="check-mark"></span>
                    {tech.toUpperCase()}
                  </label>
                ))}
              </div>
              {errors.technologies && <span className="error-msg">{errors.technologies}</span>}
            </div>

            <div className="form-group consent-group">
              <label className="custom-checkbox">
                <input type="checkbox" name="receiveUpdates" checked={formData.receiveUpdates} onChange={handleChange} />
                <span className="check-mark"></span>
                ACKNOWLEDGE MISSION DIRECTIVES & AUTOMATED COMMS
              </label>
              {errors.receiveUpdates && <span className="error-msg">{errors.receiveUpdates}</span>}
            </div>

            <button type="submit" className="nl-btn btn-submit">
              [ TRANSMIT TO MAINFRAME ]
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}

export default NewsletterPage;