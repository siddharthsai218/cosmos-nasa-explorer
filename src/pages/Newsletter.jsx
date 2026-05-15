import { useState } from 'react';
import SectionHeader from '../components/SectionHeader';
import './Newsletter.css';

function NewsletterPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    country: '',
    technologies: [],
    bio: '',
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const techOptions = ['React', 'JavaScript', 'Node.js', 'Python', 'Java', 'AI/ML'];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === 'checkbox' && name === 'technologies') {
      let updatedTech = [...formData.technologies];
      if (checked) {
        updatedTech.push(value);
      } else {
        updatedTech = updatedTech.filter((tech) => tech !== value);
      }
      setFormData({ ...formData, technologies: updatedTech });
      return;
    }

    setFormData({ ...formData, [name]: value });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.country) newErrors.country = 'Select country';
    
    if (formData.technologies.length === 0) {
      newErrors.technologies = 'Select at least one technology';
    }

    if (!formData.bio.trim() || formData.bio.length < 20) {
      newErrors.bio = 'Bio must be at least 20 characters';
    }

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setSubmitted(true);
  };

  return (
    <main className="page-wrap">
      <div className="container">
        <SectionHeader
          moduleId="MODULE_08 // ENLIST"
          title="COMMUNICATION UPLINK"
          sourceUrl="INTERNAL_RELAY"
          status={submitted ? "UPLINK COMPLETE" : "AWAITING INPUT"}
        />

        {submitted ? (
          <div className="success-box">
            <h1 className="sec-title" style={{ color: 'var(--ice)' }}>UPLINK SUCCESSFUL</h1>
            <p className="hero-subtitle">YOUR DATA HAS BEEN TRANSMITTED TO MISSION CONTROL.</p>
            <button className="btn btn-primary" style={{ marginTop: '30px' }} onClick={() => setSubmitted(false)}>
              [ NEW DISPATCH ]
            </button>
          </div>
        ) : (
          <div className="newsletter-container">
            <form onSubmit={handleSubmit} className="form-grid">
              
              <div className="form-group">
                <label>Full Name</label>
                <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="IDENTIFY..." />
                {errors.fullName && <span>{errors.fullName}</span>}
              </div>

              <div className="form-group">
                <label>Email Address</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="RELAY_ADDR@COSMOS.NET" />
                {errors.email && <span>{errors.email}</span>}
              </div>

              <div className="form-group">
                <label>Origin (Country)</label>
                <select name="country" value={formData.country} onChange={handleChange}>
                  <option value="">SELECT ORIGIN</option>
                  <option value="India">INDIA</option>
                  <option value="USA">USA</option>
                  <option value="UK">UK</option>
                  <option value="Germany">GERMANY</option>
                </select>
                {errors.country && <span>{errors.country}</span>}
              </div>

              <div className="form-group full-width">
                <label>Technologies Mastered</label>
                <div className="checkbox-group">
                  {techOptions.map((tech) => (
                    <label key={tech}>
                      <input type="checkbox" name="technologies" value={tech} onChange={handleChange} />
                      {tech}
                    </label>
                  ))}
                </div>
                {errors.technologies && <span>{errors.technologies}</span>}
              </div>

              <div className="form-group full-width">
                <label>Mission Briefing (Bio)</label>
                <textarea name="bio" rows="4" value={formData.bio} onChange={handleChange} placeholder="DESCRIBE YOUR OBJECTIVES..." />
                {errors.bio && <span>{errors.bio}</span>}
              </div>

              <div className="form-group full-width">
                <button type="submit" className="btn btn-primary">INITIALIZE UPLINK</button>
              </div>
            </form>
          </div>
        )}
      </div>
    </main>
  );
}

export default NewsletterPage;