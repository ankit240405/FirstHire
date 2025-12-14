import { Link } from "react-router-dom";
import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";
import { useState, useEffect } from "react";

function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 900);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <nav style={styles.navbar}>
      <div style={styles.logoSection}>
        <Link to="/" style={styles.logoLink}>
          <div style={styles.logoContainer}>
            <div style={styles.logoIcon}>
              <svg width="32" height="32" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="64" height="64" rx="16" fill="url(#gradient)"/>
                <path d="M32 16L16 24L32 32L48 24L32 16Z" fill="white"/>
                <path d="M16 40L32 48L48 40" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16 32L32 40L48 32" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#2563EB"/>
                    <stop offset="100%" stopColor="#1D4ED8"/>
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <div style={styles.logoText}>
              <span style={styles.companyName}>
                FIRST<span style={styles.accent}>HIRE</span>
              </span>
              <span style={styles.companyTagline}>
                AI ATS Scanner
              </span>
            </div>
          </div>
        </Link>
      </div>

      <button 
        style={{
          ...styles.mobileMenuButton,
          background: mobileMenuOpen ? 'rgba(96, 165, 250, 0.1)' : 'transparent'
        }}
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="mobile-menu-button"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          {mobileMenuOpen ? (
            <path d="M18 6L6 18M6 6L18 18" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          ) : (
            <>
              <path d="M3 12H21" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M3 6H21" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M3 18H21" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </>
          )}
        </svg>
      </button>

      <div style={styles.navLinks} className="desktop-nav">
        <SignedIn>
          <Link to="/upload" style={styles.navLink} className="nav-link">
            <div style={styles.linkContent}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={styles.linkIcon}>
                <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M17 8L12 3L7 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 3V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>Upload Resume</span>
            </div>
          </Link>
          
          <Link to="/profile" style={styles.navLink} className="nav-link">
            <div style={styles.linkContent}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={styles.linkIcon}>
                <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2"/>
                <path d="M5.337 18C6.066 15.347 8.782 13.5 12 13.5C15.218 13.5 17.934 15.347 18.663 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <span>User Profile</span>
            </div>
          </Link>
          
          <Link to="/mentor" style={styles.navLink} className="nav-link">
            <div style={styles.linkContent}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={styles.linkIcon}>
                <path d="M12 3C7.03 3 3 6.58 3 11C3 13.38 4.14 15.5 5.91 16.84L5 21L9.09 19.36C10.02 19.77 11 20 12 20C16.97 20 21 16.42 21 11C21 6.58 16.97 3 12 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>Career Mentor</span>
            </div>
          </Link>
          
          <div style={styles.userButtonContainer}>
            <div style={styles.userBadge} className="user-badge">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{marginRight: '6px'}}>
                <path d="M22 11.08V12C21.9988 14.1564 21.3005 16.2547 20.0093 17.9818C18.7182 19.709 16.9033 20.9725 14.8354 21.5839C12.7674 22.1953 10.5573 22.1219 8.53447 21.3746C6.51168 20.6273 4.78465 19.2461 3.61096 17.4371C2.43727 15.628 1.87979 13.4881 2.02168 11.3363C2.16356 9.18455 2.99721 7.13631 4.39828 5.49706C5.79935 3.85781 7.69279 2.71537 9.79619 2.24013C11.8996 1.7649 14.1003 1.98232 16.07 2.85999" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M22 4L12 14.01L9 11.01" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span style={styles.userBadgeText}>Verified User</span>
            </div>
            <div style={styles.userButtonWrapper}>
              <UserButton 
                appearance={{
                  elements: {
                    userButtonAvatarBox: {
                      width: 40,
                      height: 40
                    }
                  }
                }}
              />
            </div>
          </div>
        </SignedIn>

        <SignedOut>
          <Link to="/login" style={styles.loginLink} className="login-link">
            <div style={styles.linkContent}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={styles.linkIcon}>
                <path d="M15 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M10 17L15 12L10 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M15 12H3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>Sign In</span>
            </div>
          </Link>
        </SignedOut>
      </div>

      <div style={{
        ...styles.mobileMenu,
        display: mobileMenuOpen ? 'flex' : 'none'
      }} className="mobile-menu">
        <SignedIn>
          <Link to="/upload" style={styles.mobileNavLink} onClick={() => setMobileMenuOpen(false)}>
            <div style={styles.linkContent}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={styles.linkIcon}>
                <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M17 8L12 3L7 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 3V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>Upload Resume</span>
            </div>
          </Link>
          
          <Link to="/profile" style={styles.mobileNavLink} onClick={() => setMobileMenuOpen(false)}>
            <div style={styles.linkContent}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={styles.linkIcon}>
                <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2"/>
                <path d="M5.337 18C6.066 15.347 8.782 13.5 12 13.5C15.218 13.5 17.934 15.347 18.663 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <span>User Profile</span>
            </div>
          </Link>
          
          <Link to="/mentor" style={styles.mobileNavLink} onClick={() => setMobileMenuOpen(false)}>
            <div style={styles.linkContent}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={styles.linkIcon}>
                <path d="M12 3C7.03 3 3 6.58 3 11C3 13.38 4.14 15.5 5.91 16.84L5 21L9.09 19.36C10.02 19.77 11 20 12 20C16.97 20 21 16.42 21 11C21 6.58 16.97 3 12 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>Career Mentor</span>
            </div>
          </Link>
          
          <div style={styles.mobileUserSection}>
            <div style={styles.mobileUserBadge}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{marginRight: '8px'}}>
                <path d="M22 11.08V12C21.9988 14.1564 21.3005 16.2547 20.0093 17.9818C18.7182 19.709 16.9033 20.9725 14.8354 21.5839C12.7674 22.1953 10.5573 22.1219 8.53447 21.3746C6.51168 20.6273 4.78465 19.2461 3.61096 17.4371C2.43727 15.628 1.87979 13.4881 2.02168 11.3363C2.16356 9.18455 2.99721 7.13631 4.39828 5.49706C5.79935 3.85781 7.69279 2.71537 9.79619 2.24013C11.8996 1.7649 14.1003 1.98232 16.07 2.85999" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M22 4L12 14.01L9 11.01" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span style={styles.userBadgeText}>Verified User</span>
            </div>
            <div style={styles.mobileUserButton}>
              <UserButton 
                appearance={{
                  elements: {
                    userButtonAvatarBox: {
                      width: 44,
                      height: 44
                    }
                  }
                }}
              />
            </div>
          </div>
        </SignedIn>
        
        <SignedOut>
          <Link to="/login" style={styles.mobileLoginLink} onClick={() => setMobileMenuOpen(false)}>
            <div style={styles.linkContent}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={styles.linkIcon}>
                <path d="M15 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M10 17L15 12L10 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M15 12H3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>Sign In</span>
            </div>
          </Link>
        </SignedOut>
      </div>
    </nav>
  );
}

const styles = {
  navbar: {
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    padding: "12px 40px",
    background: "rgba(15, 23, 42, 0.95)",
    backdropFilter: "blur(20px)",
    color: "white",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
    boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
    flexWrap: 'wrap'
  },

  mobileMenuButton: {
    display: 'none',
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    padding: '8px',
    borderRadius: '8px',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s ease'
  },

  mobileMenu: {
    flexDirection: 'column',
    position: 'fixed',
    top: '70px',
    left: 0,
    right: 0,
    background: "rgba(15, 23, 42, 0.98)",
    backdropFilter: "blur(30px)",
    padding: '20px',
    borderTop: "1px solid rgba(255, 255, 255, 0.1)",
    borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
    boxShadow: "0 20px 50px rgba(0, 0, 0, 0.3)",
    zIndex: 999
  },

  mobileNavLink: {
    color: "#cbd5e1",
    textDecoration: "none",
    padding: "16px 20px",
    borderRadius: "12px",
    transition: "all 0.3s ease",
    fontSize: "1rem",
    fontWeight: "500",
    display: "flex",
    alignItems: "center",
    marginBottom: '8px',
    borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
    background: 'rgba(255, 255, 255, 0.03)'
  },

  mobileLoginLink: {
    background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
    color: "white",
    textDecoration: "none",
    padding: "16px 24px",
    borderRadius: "12px",
    fontSize: "1rem",
    fontWeight: "600",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 15px rgba(37, 99, 235, 0.3)",
    justifyContent: 'center',
    marginTop: '8px'
  },

  mobileUserSection: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "16px",
    marginTop: "20px",
    paddingTop: "20px",
    borderTop: "1px solid rgba(255, 255, 255, 0.1)"
  },

  mobileUserBadge: {
    display: "flex",
    alignItems: "center",
    background: "rgba(16, 185, 129, 0.1)",
    padding: "10px 16px",
    borderRadius: "20px",
    border: "1px solid rgba(16, 185, 129, 0.3)",
    width: '100%',
    justifyContent: 'center'
  },

  mobileUserButton: {
    display: 'flex',
    justifyContent: 'center',
    width: '100%'
  },

  logoSection: {
    display: "flex",
    alignItems: "center",
    flexShrink: 0
  },

  logoLink: {
    textDecoration: "none",
    color: "inherit",
    display: "flex",
    alignItems: "center"
  },

  logoContainer: {
    display: "flex",
    alignItems: "center",
    gap: "12px"
  },

  logoIcon: {
    width: "32px",
    height: "32px",
    flexShrink: 0
  },

  logoText: {
    display: "flex",
    flexDirection: "column"
  },

  companyName: {
    fontSize: "1.4rem",
    fontWeight: "900",
    letterSpacing: "-0.5px",
    background: "linear-gradient(135deg, #f8fafc 0%, #cbd5e1 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    lineHeight: 1.2,
    whiteSpace: 'nowrap'
  },

  accent: {
    color: "#60a5fa",
    background: "linear-gradient(90deg, #60a5fa, #93c5fd)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text"
  },

  companyTagline: {
    fontSize: "0.7rem",
    color: "#94a3b8",
    fontWeight: "500",
    letterSpacing: "0.3px",
    whiteSpace: 'nowrap'
  },

  navLinks: {
    display: "flex",
    gap: "20px",
    alignItems: "center",
    flexWrap: 'wrap'
  },

  navLink: {
    color: "#cbd5e1",
    textDecoration: "none",
    padding: "8px 16px",
    borderRadius: "10px",
    transition: "all 0.3s ease",
    fontSize: "0.95rem",
    fontWeight: "500",
    display: "flex",
    alignItems: "center",
    whiteSpace: 'nowrap'
  },

  linkContent: {
    display: "flex",
    alignItems: "center",
    gap: "8px"
  },

  linkIcon: {
    color: "#60a5fa",
    flexShrink: 0
  },

  userButtonContainer: {
    display: "flex",
    alignItems: "center",
    gap: "15px"
  },

  userBadge: {
    display: "flex",
    alignItems: "center",
    background: "rgba(16, 185, 129, 0.1)",
    padding: "6px 12px",
    borderRadius: "20px",
    border: "1px solid rgba(16, 185, 129, 0.3)",
    whiteSpace: 'nowrap'
  },

  userBadgeText: {
    fontSize: "0.75rem",
    fontWeight: "600",
    color: "#10B981"
  },

  userButtonWrapper: {
    marginLeft: "5px"
  },

  loginLink: {
    background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
    color: "white",
    textDecoration: "none",
    padding: "10px 24px",
    borderRadius: "10px",
    fontSize: "0.95rem",
    fontWeight: "600",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    transition: "all 0.3s ease",
    boxShadow: "0 2px 10px rgba(37, 99, 235, 0.3)",
    whiteSpace: 'nowrap'
  }
};

const styleSheet = document.createElement('style');
styleSheet.textContent = `
  .nav-link:hover {
    background: rgba(96, 165, 250, 0.1);
    color: #f8fafc;
    transform: translateY(-1px);
  }

  .login-link:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(37, 99, 235, 0.4);
  }

  .user-badge:hover {
    background: rgba(16, 185, 129, 0.15);
  }

  .mobile-menu-button:hover {
    background: rgba(96, 165, 250, 0.1) !important;
  }

  .mobile-nav-link:hover {
    background: rgba(96, 165, 250, 0.15);
    color: #f8fafc;
    transform: translateX(5px);
  }

  .mobile-login-link:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(37, 99, 235, 0.4);
  }

  @media (max-width: 1100px) {
    .user-badge {
      display: none !important;
    }
  }

  @media (max-width: 1024px) {
    .navbar {
      padding: 12px 30px !important;
    }
    
    .nav-link {
      padding: 8px 12px !important;
      font-size: 0.9rem !important;
    }
    
    .login-link {
      padding: 10px 16px !important;
      font-size: 0.9rem !important;
    }
  }

  @media (max-width: 900px) {
    .desktop-nav {
      display: none !important;
    }
    
    .mobile-menu-button {
      display: flex !important;
    }
  }

  @media (max-width: 768px) {
    .navbar {
      padding: 12px 20px !important;
    }
    
    .company-name {
      font-size: 1.2rem !important;
    }
    
    .company-tagline {
      display: none !important;
    }
    
    .mobile-menu {
      padding: 16px !important;
      top: 65px !important;
    }
    
    .mobile-nav-link {
      padding: 14px 18px !important;
      font-size: 0.95rem !important;
      margin-bottom: 6px !important;
    }
    
    .mobile-login-link {
      padding: 14px 20px !important;
      font-size: 0.95rem !important;
      margin-top: 10px !important;
    }
  }

  @media (max-width: 640px) {
    .mobile-menu {
      padding: 14px !important;
      top: 60px !important;
    }
    
    .mobile-nav-link {
      padding: 12px 16px !important;
      font-size: 0.9rem !important;
    }
    
    .mobile-login-link {
      padding: 12px 18px !important;
      font-size: 0.9rem !important;
    }
  }

  @media (max-width: 480px) {
    .navbar {
      padding: 10px 15px !important;
    }
    
    .logo-text {
      display: none !important;
    }
    
    .mobile-menu {
      padding: 12px !important;
      top: 58px !important;
    }
    
    .mobile-nav-link {
      padding: 10px 14px !important;
      font-size: 0.85rem !important;
    }
    
    .mobile-login-link {
      padding: 10px 16px !important;
      font-size: 0.85rem !important;
    }
    
    .mobile-user-section {
      margin-top: 15px !important;
      padding-top: 15px !important;
    }
  }

  @media (max-width: 360px) {
    .navbar {
      padding: 8px 12px !important;
    }
    
    .logo-icon svg {
      width: 28px !important;
      height: 28px !important;
    }
    
    .mobile-menu {
      padding: 10px !important;
      top: 55px !important;
    }
    
    .mobile-nav-link {
      padding: 8px 12px !important;
      font-size: 0.8rem !important;
    }
    
    .mobile-login-link {
      padding: 8px 14px !important;
      font-size: 0.8rem !important;
    }
  }

  @media (min-width: 901px) {
    .mobile-menu {
      display: none !important;
    }
    
    .mobile-menu-button {
      display: none !important;
    }
    
    .desktop-nav {
      display: flex !important;
    }
  }

  @media (max-width: 600px) and (orientation: landscape) {
    .mobile-menu {
      position: fixed;
      top: 60px;
      bottom: 0;
      overflow-y: auto;
      max-height: 70vh;
      padding: 12px !important;
    }
    
    .mobile-nav-link {
      padding: 10px 12px !important;
      margin-bottom: 4px !important;
      font-size: 0.85rem !important;
    }
    
    .mobile-login-link {
      padding: 10px 14px !important;
      font-size: 0.85rem !important;
    }
  }

  @media (min-width: 1200px) {
    .navbar {
      padding: 12px 60px !important;
    }
    
    .nav-links {
      gap: 25px !important;
    }
    
    .nav-link {
      font-size: 1rem !important;
      padding: 10px 20px !important;
    }
    
    .login-link {
      font-size: 1rem !important;
      padding: 12px 28px !important;
    }
  }

  @media (min-width: 1440px) {
    .navbar {
      padding: 14px 80px !important;
    }
    
    .company-name {
      font-size: 1.6rem !important;
    }
    
    .company-tagline {
      font-size: 0.8rem !important;
    }
  }

  @media (min-width: 1920px) {
    .navbar {
      padding: 16px 100px !important;
    }
    
    .logo-icon {
      width: 40px !important;
      height: 40px !important;
    }
    
    .company-name {
      font-size: 1.8rem !important;
    }
    
    .nav-link {
      font-size: 1.1rem !important;
      padding: 12px 24px !important;
    }
    
    .login-link {
      font-size: 1.1rem !important;
      padding: 14px 32px !important;
    }
  }
`;
document.head.appendChild(styleSheet);

export default Navbar;