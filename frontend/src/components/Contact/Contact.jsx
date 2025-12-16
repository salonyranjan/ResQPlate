import React, { useState } from 'react';
import './Contact.css';
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaTwitter, FaInstagram, FaLinkedin, FaPaperPlane } from 'react-icons/fa';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'General Inquiry',
    message: ''
  });

  // State for 3D Tilt Effect
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form Submitted:', formData);
    alert("Message Sent! We'll be in touch.");
  };

  // 3D Tilt Logic
  const handleMouseMove = (e) => {
    const { offsetWidth: width, offsetHeight: height } = e.currentTarget;
    const { nativeEvent: { offsetX, offsetY } } = e;

    // Calculate rotation between -15 and 15 degrees
    const rotateX = ((offsetY / height) - 0.5) * -20; 
    const rotateY = ((offsetX / width) - 0.5) * 20;

    setTilt({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 }); // Reset position when mouse leaves
  };

  return (
    <div className="contact-container">
      {/* 3D Wrapper */}
      <div 
        className="contact-card-3d"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`
        }}
      >
        
        {/* Left Side: Info (Floating Layer 1) */}
        <div className="contact-info">
          <div className="info-content-3d">
            <h2>Let's Talk</h2>
            <p>We'd love to hear about your food rescue journey.</p>
            
            <div className="info-item">
              <FaPhoneAlt className="icon" />
              <span>+91 98765 43210</span>
            </div>
            <div className="info-item">
              <FaEnvelope className="icon" />
              <span>support@resqplate.com</span>
            </div>
            <div className="info-item">
              <FaMapMarkerAlt className="icon" />
              <span>123 Tech City, India</span>
            </div>

            <div className="social-media">
              <p>Connect with us:</p>
              <div className="social-icons">
                <a href="#"><FaTwitter /></a>
                <a href="#"><FaInstagram /></a>
                <a href="#"><FaLinkedin /></a>
              </div>
            </div>
          </div>
          
          {/* Decorative Circle for visual depth */}
          <div className="circle-1"></div>
          <div className="circle-2"></div>
        </div>

        {/* Right Side: Form (Floating Layer 2) */}
        <div className="contact-form-wrapper">
          <form onSubmit={handleSubmit}>
            <h3 className="form-title">Send a Message</h3>
            
            <div className="input-box">
              <input 
                type="text" name="name" required="required"
                value={formData.name} onChange={handleChange} 
              />
              <span>Full Name</span>
            </div>

            <div className="input-box">
              <input 
                type="email" name="email" required="required"
                value={formData.email} onChange={handleChange} 
              />
              <span>Email Address</span>
            </div>

            <div className="input-box">
              <select name="subject" value={formData.subject} onChange={handleChange}>
                <option value="General Inquiry">General Inquiry</option>
                <option value="Partnering">Partnering</option>
                <option value="Volunteering">Volunteering</option>
              </select>
            </div>

            <div className="input-box">
              <textarea 
                name="message" required="required"
                value={formData.message} onChange={handleChange} 
              ></textarea>
              <span>Type your message...</span>
            </div>

            <button type="submit" className="submit-btn-3d">
              <span>Send Message</span> <FaPaperPlane />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;