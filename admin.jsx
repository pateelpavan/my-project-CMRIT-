import React, { useState, useEffect } from 'react';
import { saveAs } from 'file-saver';
import './App.css';

// Mock database using localStorage
const initializeDatabase = () => {
  if (!localStorage.getItem('registrations')) {
    localStorage.setItem('registrations', JSON.stringify([]));
  }
  if (!localStorage.getItem('adminPassword')) {
    localStorage.setItem('adminPassword', 'CMRIT@1234');
  }
};

const App = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [registrations, setRegistrations] = useState([]);
  const [adminAuth, setAdminAuth] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    year: '1st',
    mobile: '',
    branch: '',
    section: '',
    familyMembers: ''
  });
  const [securityPin, setSecurityPin] = useState('');
  const [ticketData, setTicketData] = useState(null);

  // Initialize database on component mount
  useEffect(() => {
    initializeDatabase();
    const storedRegistrations = JSON.parse(localStorage.getItem('registrations') || '[]');
    setRegistrations(storedRegistrations);
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Verify security PIN
  const verifySecurityPin = () => {
    if (securityPin === 'NSS2025') {
      setCurrentPage('registration');
    } else {
      alert('Invalid security PIN. Please try again.');
    }
  };

  // Check if mobile number is already registered
  const isMobileRegistered = (mobile) => {
    return registrations.some(reg => reg.mobile === mobile);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (isMobileRegistered(formData.mobile)) {
      alert('This mobile number is already registered. Please use a different number.');
      return;
    }

    // Generate ticket ID
    const ticketId = `NSS${Date.now()}`;
    const newRegistration = { ...formData, ticketId };
    
    // Update registrations
    const updatedRegistrations = [...registrations, newRegistration];
    setRegistrations(updatedRegistrations);
    localStorage.setItem('registrations', JSON.stringify(updatedRegistrations));
    
    // Set ticket data and show ticket page
    setTicketData(newRegistration);
    setCurrentPage('ticket');
  };

  // Download ticket as PDF
  const downloadTicket = () => {
    const ticketContent = document.getElementById('ticket-content');
    
    // In a real application, you would use a library like jsPDF or html2pdf.js
    // For this example, we'll create a simple text representation
    const ticketText = `
      CMRIT NSS ORIENTATION PROGRAMME
      ------------------------------------
      Name: ${ticketData.name}
      Year: ${ticketData.year}
      Mobile: ${ticketData.mobile}
      Branch: ${ticketData.branch}
      Section: ${ticketData.section}
      Family Members: ${ticketData.familyMembers}
      Ticket ID: ${ticketData.ticketId}
      Venue: CMR Central Auditorium
      ------------------------------------
      Thank you for registering!
    `;
    
    const blob = new Blob([ticketText], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, `NSS_Ticket_${ticketData.ticketId}.txt`);
    
    alert('In a real application, this would download a PDF with QR code and CMRIT watermark');
  };

  // Verify admin password
  const verifyAdminPassword = () => {
    if (adminPassword === 'CMRIT@1234') {
      setAdminAuth(true);
      setCurrentPage('admin');
    } else {
      alert('Invalid admin password');
    }
  };

  // Render home page
  const renderHomePage = () => (
    <div className="page home-page">
      <header>
        <h1>CMRIT NSS Orientation Programme</h1>
        <p className="subtitle">Join us for an inspiring event to kickstart your NSS journey</p>
        <div className="counter">
          <i className="fas fa-users"></i>
          <span id="registrationCount">{registrations.length}</span> Registered So Far
        </div>
        <button className="btn" onClick={() => setCurrentPage('security')}>
          Register Now <i className="fas fa-arrow-right"></i>
        </button>
      </header>
      <button className="admin-btn" onClick={() => setCurrentPage('adminLogin')}>
        Admin Login
      </button>
    </div>
  );

  // Render security PIN page
  const renderSecurityPage = () => (
    <div className="page security-page">
      <div className="security-form">
        <h2>Security Verification</h2>
        <p>Please enter the security PIN to proceed with registration</p>
        <input
          type="password"
          placeholder="Enter Security PIN"
          value={securityPin}
          onChange={(e) => setSecurityPin(e.target.value)}
        />
        <p className="hint">Hint: NSS2025</p>
        <div className="button-group">
          <button className="btn" onClick={verifySecurityPin}>
            Verify & Proceed <i className="fas fa-lock"></i>
          </button>
          <button className="btn secondary" onClick={() => setCurrentPage('home')}>
            <i className="fas fa-arrow-left"></i> Back to Home
          </button>
        </div>
      </div>
    </div>
  );

  // Render registration form
  const renderRegistrationForm = () => (
    <div className="page registration-page">
      <h2>Registration Form</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Full Name</label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Enter your full name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="year">Year</label>
          <input
            type="text"
            id="year"
            name="year"
            value="1st"
            readOnly
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="mobile">Mobile Number</label>
          <input
            type="tel"
            id="mobile"
            name="mobile"
            placeholder="Enter your mobile number"
            value={formData.mobile}
            onChange={handleInputChange}
            pattern="[0-9]{10}"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="branch">Branch</label>
          <input
            type="text"
            id="branch"
            name="branch"
            placeholder="Enter your branch"
            value={formData.branch}
            onChange={handleInputChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="section">Section</label>
          <select
            id="section"
            name="section"
            value={formData.section}
            onChange={handleInputChange}
            required
          >
            <option value="">Select Section</option>
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="C">C</option>
            <option value="D">D</option>
            <option value="E">E</option>
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="familyMembers">Family Members Attending</label>
          <input
            type="number"
            id="familyMembers"
            name="familyMembers"
            placeholder="Enter number of family members"
            value={formData.familyMembers}
            onChange={handleInputChange}
            min="0"
            required
          />
        </div>
        
        <button type="submit" className="btn">
          Submit Registration <i className="fas fa-check"></i>
        </button>
      </form>
      
      <button className="btn secondary" onClick={() => setCurrentPage('security')}>
        <i className="fas fa-arrow-left"></i> Back
      </button>
    </div>
  );

  // Render ticket page
  const renderTicketPage = () => (
    <div className="page ticket-page">
      <h2>Your Registration Ticket</h2>
      
      <div className="ticket" id="ticket-content">
        <div className="ticket-header">
          <h3>CMRIT NSS Orientation Programme</h3>
        </div>
        
        <div className="ticket-details">
          <div className="ticket-detail">
            <strong>Name:</strong> <span>{ticketData.name}</span>
          </div>
          <div className="ticket-detail">
            <strong>Year:</strong> <span>{ticketData.year}</span>
          </div>
          <div className="ticket-detail">
            <strong>Mobile:</strong> <span>{ticketData.mobile}</span>
          </div>
          <div className="ticket-detail">
            <strong>Branch:</strong> <span>{ticketData.branch}</span>
          </div>
          <div className="ticket-detail">
            <strong>Section:</strong> <span>{ticketData.section}</span>
          </div>
          <div className="ticket-detail">
            <strong>Family Members:</strong> <span>{ticketData.familyMembers}</span>
          </div>
          <div className="ticket-detail">
            <strong>Ticket ID:</strong> <span>{ticketData.ticketId}</span>
          </div>
        </div>
        
        <div className="venue">
          <strong>Venue:</strong> CMR Central Auditorium<br />
          <strong>Date:</strong> 25th August 2023<br />
          <strong>Time:</strong> 10:00 AM onwards
        </div>
        
        <div className="qr-code">
          <div className="qr-placeholder">
            <i className="fas fa-qrcode"></i>
            <p>QR Code would appear here</p>
          </div>
          <p>Scan this QR code for entry</p>
        </div>
      </div>
      
      <div className="button-group">
        <button className="btn" onClick={downloadTicket}>
          <i className="fas fa-download"></i> Download Ticket
        </button>
        <button className="btn secondary" onClick={() => setCurrentPage('home')}>
          <i className="fas fa-home"></i> Back to Home
        </button>
      </div>
    </div>
  );

  // Render admin login page
  const renderAdminLogin = () => (
    <div className="page admin-login">
      <h2>Admin Login</h2>
      <div className="admin-form">
        <input
          type="password"
          placeholder="Enter Admin Password"
          value={adminPassword}
          onChange={(e) => setAdminPassword(e.target.value)}
        />
        <div className="button-group">
          <button className="btn" onClick={verifyAdminPassword}>
            Login
          </button>
          <button className="btn secondary" onClick={() => setCurrentPage('home')}>
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );

  // Render admin panel
  const renderAdminPanel = () => (
    <div className="page admin-panel">
      <h2>Admin Panel</h2>
      <p>Total Registrations: {registrations.length}</p>
      
      <div className="registrations-list">
        <h3>All Registrations</h3>
        {registrations.length === 0 ? (
          <p>No registrations yet.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Mobile</th>
                <th>Branch</th>
                <th>Section</th>
                <th>Family Members</th>
                <th>Ticket ID</th>
              </tr>
            </thead>
            <tbody>
              {registrations.map(reg => (
                <tr key={reg.ticketId}>
                  <td>{reg.name}</td>
                  <td>{reg.mobile}</td>
                  <td>{reg.branch}</td>
                  <td>{reg.section}</td>
                  <td>{reg.familyMembers}</td>
                  <td>{reg.ticketId}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      
      <button className="btn secondary" onClick={() => {
        setAdminAuth(false);
        setCurrentPage('home');
      }}>
        Logout
      </button>
    </div>
  );

  // Render the appropriate page based on currentPage state
  return (
    <div className="App">
      {currentPage === 'home' && renderHomePage()}
      {currentPage === 'security' && renderSecurityPage()}
      {currentPage === 'registration' && renderRegistrationForm()}
      {currentPage === 'ticket' && renderTicketPage()}
      {currentPage === 'adminLogin' && renderAdminLogin()}
      {currentPage === 'admin' && renderAdminPanel()}
    </div>
  );
};

export default App;