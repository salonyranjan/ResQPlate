const About = () => {
  return (
    <div className="font-sans text-gray-800">

      {/* --- HERO SECTION --- */}
      <section className="relative bg-green-600 text-white py-24 px-6 text-center">
        <div className="absolute inset-0 bg-black opacity-40"></div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            About <span className="text-green-300">ResQPlate</span>
          </h1>
          <p className="text-xl md:text-2xl font-light">
            Bridging the gap between surplus food and those who need it most.
          </p>
        </div>
      </section>

      {/* --- MISSION SECTION --- */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-4 text-gray-800">
              Our Mission
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              ResQPlate is a technology-driven platform designed to reduce food
              waste and combat hunger. We connect restaurants, event organizers,
              and households with verified NGOs and volunteers in real time.
            </p>
            <p className="text-gray-600 leading-relaxed">
              By leveraging geolocation, smart matching, and secure
              authentication, we ensure that surplus food reaches the right
              people before it goes to waste.
            </p>
          </div>

          <div className="bg-green-50 p-8 rounded-2xl shadow-sm">
            <h3 className="text-xl font-bold mb-4 text-green-700">
              Why ResQPlate?
            </h3>
            <ul className="space-y-3 text-gray-700">
              <li>✔ Reduces food wastage efficiently</li>
              <li>✔ Supports NGOs & volunteers</li>
              <li>✔ Ensures safe & timely food pickup</li>
              <li>✔ Promotes sustainable communities</li>
            </ul>
          </div>
        </div>
      </section>

      {/* --- HOW IT HELPS --- */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-12 text-gray-800">
            How We Make an Impact
          </h2>

          <div className="grid md:grid-cols-3 gap-10">
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition">
              <div className="text-4xl mb-4">🍽️</div>
              <h3 className="text-xl font-bold mb-2">Food Rescue</h3>
              <p className="text-gray-600">
                Prevents edible food from being discarded by redirecting it to
                NGOs in need.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition">
              <div className="text-4xl mb-4">📍</div>
              <h3 className="text-xl font-bold mb-2">Smart Matching</h3>
              <p className="text-gray-600">
                Uses location-based algorithms to notify nearby verified
                receivers instantly.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition">
              <div className="text-4xl mb-4">🤝</div>
              <h3 className="text-xl font-bold mb-2">Community Driven</h3>
              <p className="text-gray-600">
                Encourages collaboration between donors, NGOs, and volunteers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- TECH STACK / PROJECT INFO --- */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6 text-gray-800">
            Project Overview
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
            ResQPlate is developed as a full-stack MERN application using
            MongoDB, Express.js, React.js, and Node.js. It integrates secure
            authentication, role-based access control, and real-time map
            visualization to ensure scalability and reliability.
          </p>

          <div className="grid md:grid-cols-4 gap-6 text-sm">
            <div className="bg-gray-50 p-5 rounded-xl shadow-sm">
              <strong>Frontend</strong>
              <p className="text-gray-500 mt-1">React.js</p>
            </div>
            <div className="bg-gray-50 p-5 rounded-xl shadow-sm">
              <strong>Backend</strong>
              <p className="text-gray-500 mt-1">Node & Express</p>
            </div>
            <div className="bg-gray-50 p-5 rounded-xl shadow-sm">
              <strong>Database</strong>
              <p className="text-gray-500 mt-1">MongoDB Atlas</p>
            </div>
            <div className="bg-gray-50 p-5 rounded-xl shadow-sm">
              <strong>Maps</strong>
              <p className="text-gray-500 mt-1">Leaflet + OSM</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- FOOTER CTA --- */}
      <section className="bg-gray-900 text-white py-14 text-center">
        <h2 className="text-2xl font-bold mb-4">
          Together, We Can End Food Waste
        </h2>
        <p className="text-gray-400 mb-6 max-w-lg mx-auto">
          Join ResQPlate today and be a part of the solution.
        </p>
        <p className="text-gray-600 text-sm">
          © 2025 ResQPlate — Built for Social Impact
        </p>
      </section>
    </div>
  );
};

export default About;
