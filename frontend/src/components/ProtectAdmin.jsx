// ProtectAdmin.jsx
import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import Swal from "sweetalert2";
import { Shield, Lock, Crown, Sparkles, X, AlertTriangle } from "lucide-react";

const ProtectAdmin = ({ children }) => {
  const [isAllowed, setIsAllowed] = useState(null); // null = checking

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user || user.role !== "admin") {
      // Create custom alert with world-class design
      const customAlert = Swal.fire({
        title: '',
        html: `
          <div class="swal2-custom-admin-alert">
            <div class="alert-header">
              <div class="security-shield">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L3 5V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V5L12 2Z" 
                        fill="url(#shield-gradient)" stroke="url(#shield-border)" stroke-width="2"/>
                  <path d="M12 12L15 9M12 12L9 9M12 12V6" stroke="white" stroke-width="2" 
                        stroke-linecap="round" stroke-linejoin="round"/>
                  <defs>
                    <linearGradient id="shield-gradient" x1="12" y1="2" x2="12" y2="23" gradientUnits="userSpaceOnUse">
                      <stop stop-color="#FF416C"/>
                      <stop offset="1" stop-color="#FF4B2B"/>
                    </linearGradient>
                    <linearGradient id="shield-border" x1="12" y1="2" x2="12" y2="23" gradientUnits="userSpaceOnUse">
                      <stop stop-color="#FF416C"/>
                      <stop offset="1" stop-color="#FF4B2B"/>
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <div class="sparkles">
                <div class="sparkle"></div>
                <div class="sparkle"></div>
                <div class="sparkle"></div>
              </div>
            </div>
            
            <div class="alert-content">
              <h2 class="alert-title">Elevated Access Required</h2>
              <p class="alert-subtitle">Administrator Privileges Needed</p>
              
              <div class="access-card">
                <div class="card-icon">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 11H5M19 11C20.1046 11 21 11.8954 21 13V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V13C3 11.8954 3.89543 11 5 11M19 11V9C19 7.89543 18.1046 7 17 7M5 11V9C5 7.89543 5.89543 7 7 7M7 7V5C7 3.89543 7.89543 3 9 3H15C16.1046 3 17 3.89543 17 5V7M7 7H17" 
                          stroke="#FF4B2B" stroke-width="2" stroke-linecap="round"/>
                    <circle cx="12" cy="15" r="2" fill="#FF4B2B"/>
                  </svg>
                </div>
                <div class="card-content">
                  <div class="card-title">Restricted Zone</div>
                  <div class="card-desc">This area is exclusively reserved for system administrators with elevated privileges.</div>
                </div>
              </div>
              
              <div class="requirements">
                <div class="requirement">
                  <div class="check-icon">✓</div>
                  <span>Valid Administrator Credentials</span>
                </div>
                <div class="requirement">
                  <div class="check-icon">✓</div>
                  <span>Multi-factor Authentication</span>
                </div>
                <div class="requirement">
                  <div class="check-icon">✓</div>
                  <span>Security Clearance Level 3+</span>
                </div>
              </div>
              
              <div class="access-code">
                <div class="code-label">ACCESS CODE REQUIRED:</div>
                <div class="code-display">ADMIN-<span>●●●●</span>-PRIVILEGED</div>
              </div>
            </div>
            
            <div class="particles">
              <div class="particle"></div>
              <div class="particle"></div>
              <div class="particle"></div>
              <div class="particle"></div>
              <div class="particle"></div>
            </div>
          </div>
        `,
        showConfirmButton: true,
        confirmButtonText: 'Return to Dashboard',
        confirmButtonColor: '#05E2F2',
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
        backdrop: `
          rgba(0, 0, 0, 0.8)
          url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%2305e2f2' fill-opacity='0.03' fill-rule='evenodd'/%3E%3C/svg%3E")
        `,
        customClass: {
          popup: 'swal2-popup-custom',
          confirmButton: 'swal2-confirm-custom',
          container: 'swal2-container-custom'
        },
        buttonsStyling: false,
        showCloseButton: true,
        closeButtonHtml: `
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18M6 6L18 18" stroke="#94A3B8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        `,
        width: 600,
        padding: 0,
        showClass: {
          popup: 'animate__animated animate__zoomIn animate__faster'
        },
        hideClass: {
          popup: 'animate__animated animate__zoomOut animate__faster'
        },
        didOpen: () => {
          // Add floating animation to particles
          const particles = document.querySelectorAll('.particle');
          particles.forEach((particle, index) => {
            particle.style.animation = `float ${3 + index * 0.5}s ease-in-out infinite ${index * 0.2}s`;
          });

          // Add sparkle animation
          const sparkles = document.querySelectorAll('.sparkle');
          sparkles.forEach((sparkle, index) => {
            sparkle.style.animation = `sparkle ${2 + index * 0.3}s ease-in-out infinite ${index * 0.1}s`;
          });
        }
      });

      customAlert.then(() => {
        setIsAllowed(false);
      });
    } else {
      setIsAllowed(true);
    }
  }, []);

  // Add custom styles for the alert
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
      
      .swal2-popup-custom {
        font-family: 'Poppins', sans-serif !important;
        border-radius: 24px !important;
        overflow: hidden !important;
        border: 1px solid rgba(255, 255, 255, 0.1) !important;
        box-shadow: 
          0 25px 50px -12px rgba(0, 0, 0, 0.5),
          0 0 0 1px rgba(5, 226, 242, 0.1),
          inset 0 1px 0 rgba(255, 255, 255, 0.1) !important;
      }
      
      .swal2-container-custom {
        backdrop-filter: blur(10px) !important;
      }
      
      .swal2-confirm-custom {
        background: linear-gradient(135deg, #05E2F2 0%, #0368D6 100%) !important;
        border: none !important;
        padding: 16px 40px !important;
        border-radius: 50px !important;
        font-weight: 600 !important;
        font-size: 16px !important;
        letter-spacing: 0.5px !important;
        transition: all 0.3s ease !important;
        box-shadow: 0 4px 20px rgba(5, 226, 242, 0.3) !important;
        position: relative !important;
        overflow: hidden !important;
      }
      
      .swal2-confirm-custom:hover {
        transform: translateY(-2px) !important;
        box-shadow: 0 6px 25px rgba(5, 226, 242, 0.4) !important;
      }
      
      .swal2-confirm-custom:active {
        transform: translateY(0) !important;
      }
      
      .swal2-confirm-custom::after {
        content: '' !important;
        position: absolute !important;
        top: 0 !important;
        left: -100% !important;
        width: 100% !important;
        height: 100% !important;
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent) !important;
        transition: 0.5s !important;
      }
      
      .swal2-confirm-custom:hover::after {
        left: 100% !important;
      }
      
      .swal2-close {
        width: 40px !important;
        height: 40px !important;
        background: rgba(255, 255, 255, 0.05) !important;
        border-radius: 50% !important;
        border: 1px solid rgba(255, 255, 255, 0.1) !important;
        transition: all 0.3s ease !important;
      }
      
      .swal2-close:hover {
        background: rgba(255, 255, 255, 0.1) !important;
        transform: rotate(90deg) !important;
      }
      
      .swal2-custom-admin-alert {
        padding: 40px;
        position: relative;
      }
      
      .alert-header {
        text-align: center;
        margin-bottom: 40px;
        position: relative;
      }
      
      .security-shield {
        display: inline-block;
        position: relative;
        width: 120px;
        height: 120px;
        margin-bottom: 20px;
        filter: drop-shadow(0 10px 20px rgba(255, 75, 43, 0.3));
        animation: pulse 2s ease-in-out infinite;
      }
      
      @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
      }
      
      .sparkles {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        pointer-events: none;
      }
      
      .sparkle {
        position: absolute;
        width: 8px;
        height: 8px;
        background: #05E2F2;
        border-radius: 50%;
        filter: blur(1px);
      }
      
      .sparkle:nth-child(1) { top: 20%; left: 30%; }
      .sparkle:nth-child(2) { top: 40%; right: 25%; }
      .sparkle:nth-child(3) { bottom: 30%; left: 40%; }
      
      @keyframes sparkle {
        0%, 100% { opacity: 0; transform: scale(0); }
        50% { opacity: 1; transform: scale(1); }
      }
      
      .alert-content {
        text-align: center;
      }
      
      .alert-title {
        font-size: 32px;
        font-weight: 700;
        background: linear-gradient(135deg, #FF416C 0%, #FF4B2B 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        margin-bottom: 8px;
        letter-spacing: -0.5px;
      }
      
      .alert-subtitle {
        font-size: 18px;
        color: #94A3B8;
        margin-bottom: 40px;
        font-weight: 500;
      }
      
      .access-card {
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 20px;
        padding: 24px;
        display: flex;
        align-items: center;
        gap: 20px;
        margin-bottom: 30px;
        backdrop-filter: blur(10px);
        transition: all 0.3s ease;
      }
      
      .access-card:hover {
        border-color: rgba(255, 75, 43, 0.3);
        transform: translateY(-2px);
      }
      
      .card-icon {
        width: 60px;
        height: 60px;
        background: rgba(255, 75, 43, 0.1);
        border-radius: 15px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      }
      
      .card-content {
        text-align: left;
        flex: 1;
      }
      
      .card-title {
        font-size: 20px;
        font-weight: 600;
        color: white;
        margin-bottom: 8px;
      }
      
      .card-desc {
        font-size: 14px;
        color: #94A3B8;
        line-height: 1.6;
      }
      
      .requirements {
        background: rgba(255, 255, 255, 0.02);
        border-radius: 15px;
        padding: 20px;
        margin-bottom: 30px;
        border: 1px solid rgba(255, 255, 255, 0.05);
      }
      
      .requirement {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px 0;
        color: #E2E8F0;
        font-size: 15px;
        font-weight: 500;
      }
      
      .requirement:not(:last-child) {
        border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      }
      
      .check-icon {
        width: 24px;
        height: 24px;
        background: linear-gradient(135deg, #0594E2 0%, #05E2F2 100%);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        font-weight: bold;
        color: white;
      }
      
      .access-code {
        background: linear-gradient(135deg, rgba(5, 226, 242, 0.1) 0%, rgba(3, 104, 214, 0.1) 100%);
        border-radius: 15px;
        padding: 20px;
        margin-bottom: 40px;
        border: 1px solid rgba(5, 226, 242, 0.2);
      }
      
      .code-label {
        font-size: 12px;
        color: #05E2F2;
        text-transform: uppercase;
        letter-spacing: 2px;
        margin-bottom: 8px;
        font-weight: 600;
      }
      
      .code-display {
        font-family: 'Monaco', 'Courier New', monospace;
        font-size: 18px;
        color: white;
        letter-spacing: 2px;
      }
      
      .code-display span {
        color: #FF4B2B;
        letter-spacing: 8px;
      }
      
      .particles {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        overflow: hidden;
        z-index: -1;
      }
      
      .particle {
        position: absolute;
        width: 4px;
        height: 4px;
        background: rgba(5, 226, 242, 0.5);
        border-radius: 50%;
        filter: blur(1px);
      }
      
      .particle:nth-child(1) { top: 10%; left: 10%; }
      .particle:nth-child(2) { top: 20%; right: 15%; }
      .particle:nth-child(3) { bottom: 30%; left: 20%; }
      .particle:nth-child(4) { bottom: 15%; right: 25%; }
      .particle:nth-child(5) { top: 50%; left: 50%; }
      
      @keyframes float {
        0%, 100% { transform: translateY(0) translateX(0); opacity: 0.3; }
        25% { transform: translateY(-10px) translateX(5px); opacity: 0.6; }
        50% { transform: translateY(5px) translateX(-5px); opacity: 0.8; }
        75% { transform: translateY(-5px) translateX(10px); opacity: 0.6; }
      }
      
      @keyframes gradient-shift {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }
      
      /* Glow effect for important elements */
      .security-shield svg {
        filter: drop-shadow(0 0 20px rgba(255, 75, 43, 0.5));
      }
      
      /* Responsive adjustments */
      @media (max-width: 640px) {
        .swal2-popup-custom {
          width: 90% !important;
          margin: 20px !important;
        }
        
        .alert-title {
          font-size: 24px;
        }
        
        .alert-subtitle {
          font-size: 16px;
        }
        
        .access-card {
          flex-direction: column;
          text-align: center;
        }
        
        .card-content {
          text-align: center;
        }
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // While checking or showing alert, do not render children
  if (isAllowed === null) return null;

  // Not allowed → redirect
  if (!isAllowed) return <Navigate to="/" replace />;

  // Allowed → render admin page
  return children;
};

export default ProtectAdmin;