import React from "react";
import "./About.css";

const About = () => {
  return (
    <div className="about-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1 className="fade-in-down">
            Bridging the Gap Between <span className="highlight">Abundance</span> & <span className="highlight">Need</span>
          </h1>
          <p className="tagline fade-in-up">
            ResQPlate is a movement to end hunger and eliminate food waste.
          </p>
        </div>
      </section>

      {/* Our Mission */}
      <section className="mission-section">
        <div className="content-wrapper fade-in">
          <h2>Our Mission</h2>
          <div className="mission-text-box">
            <p>
              We believe that good food belongs on plates, not in landfills. 
              In a world where millions go hungry, ResQPlate serves as the vital link 
              between restaurants, donors, and local communities. We use technology 
              to make food donation <strong>simple</strong>, <strong>fast</strong>, and <strong>dignified</strong>.
            </p>
          </div>
        </div>
      </section>

      {/* Values Grid */}
      <section className="values-section">
        <h2>What Drives Us</h2>
        <div className="values-grid">
          <div className="value-card slide-in-left">
            <div className="icon">🌱</div>
            <h3>Sustainability</h3>
            <p>Reducing carbon footprints by keeping organic waste out of landfills.</p>
          </div>
          <div className="value-card slide-in-up">
            <div className="icon">🤝</div>
            <h3>Community</h3>
            <p>Strengthening local bonds by helping neighbors support neighbors.</p>
          </div>
          <div className="value-card slide-in-right">
            <div className="icon">⚡</div>
            <h3>Technology</h3>
            <p>Leveraging the MERN stack to deliver real-time solutions for food rescue.</p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta-section">
        <div className="cta-content scale-in">
          <h2>Ready to Make an Impact?</h2>
          <p>Whether you have food to give or time to volunteer, your contribution matters.</p>
          <button className="join-btn">Join the Movement</button>
        </div>
      </section>
    </div>
  );
};

export default About;