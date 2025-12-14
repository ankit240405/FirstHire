import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";

export default function Upload() {
  const { getToken } = useAuth();
  const navigate = useNavigate();

  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [showErrorPopup, setShowErrorPopup] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth <= 768;
  const isTablet = windowWidth > 768 && windowWidth <= 1024;
  const isDesktop = windowWidth > 1024;

  function handleDragOver(e) {
    e.preventDefault();
    setIsDragging(true);
  }

  function handleDragLeave(e) {
    e.preventDefault();
    setIsDragging(false);
  }

  function handleDrop(e) {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type.includes("pdf") || 
          droppedFile.name.match(/\.(doc|docx)$/i)) {
        setFile(droppedFile);
        setError("");
      } else {
        setError("Please upload only PDF or Word documents");
      }
    }
  }

  async function handleUpload(e) {
    e.preventDefault();
    setError("");

    if (!file) {
      setError("Please upload a valid resume file");
      setShowErrorPopup(true);
      return;
    }

    setLoading(true);

    try {
      const token = await getToken();

      const fd = new FormData();
      fd.append("resume", file);

      const res = await fetch("/api/analyze",
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: fd,
        }
      );

      if (!res.ok) throw new Error("Resume analysis failed");

      const json = await res.json();

      navigate("/result", { state: { result: json } });
    } catch (err) {
      console.error(err);
      setError("Could not analyze resume. Please try again.");
      setShowErrorPopup(true);
    }

    setLoading(false);
  }

  return (
    <div style={styles.page}>
      <div style={styles.backgroundElements}>
        {[...Array(isMobile ? 3 : 6)].map((_, i) => (
          <div 
            key={i} 
            style={{
              position: 'absolute',
              background: `linear-gradient(45deg, 
                rgba(37, 99, 235, ${0.03 + i * 0.01}), 
                rgba(59, 130, 246, ${0.02 + i * 0.01})
              )`,
              borderRadius: i % 2 === 0 ? '50%' : '20px',
              width: isMobile ? `${40 + i * 15}px` : `${80 + i * 25}px`,
              height: isMobile ? `${40 + i * 15}px` : `${80 + i * 25}px`,
              top: `${(i * (isMobile ? 30 : 20)) % 100}%`,
              left: `${(i * (isMobile ? 25 : 15)) % 100}%`,
              animation: `float ${20 + i * 5}s infinite ease-in-out`,
              filter: isMobile ? 'blur(20px)' : 'blur(30px)',
              opacity: isMobile ? 0.3 : 0.5
            }}
          />
        ))}
      </div>

      {showErrorPopup && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.85)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px',
          animation: 'fadeIn 0.3s ease-out'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.95) 100%)',
            borderRadius: '24px',
            padding: isMobile ? '25px' : '32px',
            maxWidth: isMobile ? '90%' : '440px',
            width: '100%',
            border: '1px solid rgba(96, 165, 250, 0.2)',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(96, 165, 250, 0.1)',
            transform: 'translateY(0)',
            animation: 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              marginBottom: '24px'
            }}>
              <div style={{
                width: isMobile ? '60px' : '72px',
                height: isMobile ? '60px' : '72px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(220, 38, 38, 0.1) 100%)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative'
              }}>
                <div style={{
                  position: 'absolute',
                  top: '-8px',
                  left: '-8px',
                  right: '-8px',
                  bottom: '-8px',
                  borderRadius: '50%',
                  border: '2px solid rgba(239, 68, 68, 0.2)',
                  animation: 'pulse 2s infinite'
                }}></div>
                
                <svg 
                  width={isMobile ? "32" : "36"} 
                  height={isMobile ? "32" : "36"} 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                  style={{
                    color: '#f87171'
                  }}
                >
                  <path d="M12 9V12M12 15H12.01M5.07183 19H18.9282C20.4678 19 21.4301 17.3333 20.6603 16L13.7321 4C12.9623 2.66667 11.0377 2.66667 10.2679 4L3.33975 16C2.56995 17.3333 3.53223 19 5.07183 19Z" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>

            <h3 style={{
              fontSize: isMobile ? '1.25rem' : '1.5rem',
              fontWeight: '700',
              color: '#f8fafc',
              textAlign: 'center',
              marginBottom: '12px',
              lineHeight: '1.3'
            }}>
              Please upload a valid Resume
            </h3>

            <p style={{
              fontSize: isMobile ? '0.95rem' : '1rem',
              color: '#cbd5e1',
              textAlign: 'center',
              lineHeight: '1.6',
              marginBottom: '28px',
              padding: isMobile ? '0 5px' : '0 10px'
            }}>
              {error}
            </p>

            <div style={{
              background: 'rgba(255, 255, 255, 0.04)',
              borderRadius: '14px',
              padding: '18px',
              marginBottom: '28px',
              border: '1px solid rgba(255, 255, 255, 0.08)'
            }}>
              <h4 style={{
                fontSize: '0.9rem',
                fontWeight: '600',
                color: '#f1f5f9',
                marginBottom: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ color: '#60a5fa' }}>
                  <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" 
                        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                File Requirements
              </h4>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <div style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: 'rgba(96, 165, 250, 0.8)'
                  }}></div>
                  <span style={{
                    fontSize: '0.85rem',
                    color: '#94a3b8'
                  }}>Resume Formatted PDF or Word (.doc, .docx) format</span>
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <div style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: 'rgba(96, 165, 250, 0.8)'
                  }}></div>
                  <span style={{
                    fontSize: '0.85rem',
                    color: '#94a3b8'
                  }}>Maximum file size: 10MB</span>
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <div style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: 'rgba(96, 165, 250, 0.8)'
                  }}></div>
                  <span style={{
                    fontSize: '0.85rem',
                    color: '#94a3b8'
                  }}>No password-protected files</span>
                </div>
              </div>
            </div>

            <div style={{
              display: 'flex',
              gap: '12px',
              justifyContent: 'center'
            }}>
              <button
                onClick={() => {
                  setShowErrorPopup(false);
                  setError("");
                }}
                style={{
                  flex: 1,
                  padding: isMobile ? '14px 20px' : '16px 24px',
                  background: 'rgba(96, 165, 250, 0.1)',
                  border: '1px solid rgba(96, 165, 250, 0.3)',
                  borderRadius: '12px',
                  color: '#60a5fa',
                  fontSize: isMobile ? '0.95rem' : '1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(96, 165, 250, 0.2)';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(96, 165, 250, 0.1)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 12H5M12 19L5 12L12 5" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"/>
                </svg>
                Go Back
              </button>
              
              <button
                onClick={() => {
                  setShowErrorPopup(false);
                  document.getElementById('file-upload')?.click();
                }}
                style={{
                  flex: 1,
                  padding: isMobile ? '14px 20px' : '16px 24px',
                  background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                  border: 'none',
                  borderRadius: '12px',
                  color: 'white',
                  fontSize: isMobile ? '0.95rem' : '1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.3)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = '0 6px 12px -1px rgba(37, 99, 235, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(37, 99, 235, 0.3)';
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"/>
                  <path d="M17 8L12 3L7 8" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"/>
                  <path d="M12 3V15" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"/>
                </svg>
                Try Again
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={{
        ...styles.container,
        ...(isMobile && styles.containerMobile),
        ...(isTablet && styles.containerTablet),
      }}>
        {(isDesktop || isTablet || !isMobile) && (
          <div style={{
            ...styles.leftPanel,
            ...(isMobile && styles.leftPanelMobile),
            ...(isTablet && styles.leftPanelTablet),
          }}>
            <div style={styles.leftContent}>
              <div style={styles.heroSection}>
                <div style={styles.heroBadge}>
                  <span style={styles.badgeIcon}>🚀</span>
                  <span style={styles.badgeText}>AI-Powered Analysis</span>
                </div>
                <h1 style={{
                  ...styles.heroTitle,
                  ...(isMobile && { fontSize: '1.8rem', lineHeight: '1.3' }),
                  ...(isTablet && { fontSize: '2.2rem' }),
                }}>
                  Upload Your Resume for
                  <span style={styles.heroHighlight}> Professional ATS Analysis</span>
                </h1>
                <p style={{
                  ...styles.heroDescription,
                  ...(isMobile && { fontSize: '0.95rem' }),
                  ...(isTablet && { fontSize: '1.1rem' }),
                }}>
                  Get instant compatibility scores, keyword optimization, and expert feedback 
                  to maximize your resume's performance with applicant tracking systems.
                </p>
              </div>

              {isMobile ? (
                <div style={styles.mobileProgress}>
                  <div style={styles.mobileStep}>
                    <div style={styles.mobileStepNumber}>1</div>
                    <div style={styles.mobileStepContent}>
                      <h4 style={styles.mobileStepTitle}>Upload Resume</h4>
                      <p style={styles.mobileStepDesc}>PDF or Word document</p>
                    </div>
                  </div>
                  <div style={styles.mobileStep}>
                    <div style={styles.mobileStepNumber}>2</div>
                    <div style={styles.mobileStepContent}>
                      <h4 style={styles.mobileStepTitle}>AI Analysis</h4>
                      <p style={styles.mobileStepDesc}>Instant ATS scanning</p>
                    </div>
                  </div>
                  <div style={styles.mobileStep}>
                    <div style={{...styles.mobileStepNumber, ...styles.mobileStepNumberInactive}}>3</div>
                    <div style={styles.mobileStepContent}>
                      <h4 style={styles.mobileStepTitle}>Get Results</h4>
                      <p style={styles.mobileStepDesc}>Detailed insights & tips</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div style={styles.progressSteps}>
                  <div style={styles.step}>
                    <div style={styles.stepNumber}>1</div>
                    <div style={styles.stepContent}>
                      <h3 style={styles.stepTitle}>Upload Resume</h3>
                      <p style={styles.stepDesc}>PDF or Word document</p>
                    </div>
                  </div>
                  <div style={styles.stepDivider}></div>
                  <div style={styles.step}>
                    <div style={styles.stepNumber}>2</div>
                    <div style={styles.stepContent}>
                      <h3 style={styles.stepTitle}>AI Analysis</h3>
                      <p style={styles.stepDesc}>Instant ATS scanning</p>
                    </div>
                  </div>
                  <div style={styles.stepDivider}></div>
                  <div style={styles.step}>
                    <div style={{...styles.stepNumber, ...styles.stepNumberInactive}}>3</div>
                    <div style={styles.stepContent}>
                      <h3 style={styles.stepTitle}>Get Results</h3>
                      <p style={styles.stepDesc}>Detailed insights & tips</p>
                    </div>
                  </div>
                </div>
              )}

              <div style={{
                ...styles.featuresGrid,
                ...(isMobile && { 
                  gridTemplateColumns: '1fr',
                  gap: '12px',
                  marginBottom: '25px'
                }),
                ...(isTablet && { 
                  gridTemplateColumns: '1fr 1fr',
                  gap: '15px'
                }),
              }}>
                <div style={styles.featureCard}>
                  <div style={styles.featureIcon}>📊</div>
                  <div style={styles.featureContent}>
                    <h3 style={{
                      ...styles.featureTitle,
                      ...(isMobile && { fontSize: '1rem' }),
                    }}>ATS Score</h3>
                    <p style={{
                      ...styles.featureDesc,
                      ...(isMobile && { fontSize: '0.8rem' }),
                    }}>Compatibility rating</p>
                  </div>
                </div>
                <div style={styles.featureCard}>
                  <div style={styles.featureIcon}>🔍</div>
                  <div style={styles.featureContent}>
                    <h3 style={{
                      ...styles.featureTitle,
                      ...(isMobile && { fontSize: '1rem' }),
                    }}>Keyword Analysis</h3>
                    <p style={{
                      ...styles.featureDesc,
                      ...(isMobile && { fontSize: '0.8rem' }),
                    }}>Missing keywords</p>
                  </div>
                </div>
                <div style={styles.featureCard}>
                  <div style={styles.featureIcon}>📝</div>
                  <div style={styles.featureContent}>
                    <h3 style={{
                      ...styles.featureTitle,
                      ...(isMobile && { fontSize: '1rem' }),
                    }}>Format Check</h3>
                    <p style={{
                      ...styles.featureDesc,
                      ...(isMobile && { fontSize: '0.8rem' }),
                    }}>Structure analysis</p>
                  </div>
                </div>
                <div style={styles.featureCard}>
                  <div style={styles.featureIcon}>🎯</div>
                  <div style={styles.featureContent}>
                    <h3 style={{
                      ...styles.featureTitle,
                      ...(isMobile && { fontSize: '1rem' }),
                    }}>Optimization Tips</h3>
                    <p style={{
                      ...styles.featureDesc,
                      ...(isMobile && { fontSize: '0.8rem' }),
                    }}>Actionable advice</p>
                  </div>
                </div>
              </div>

              <div style={{
                ...styles.statsSection,
                ...(isMobile && { 
                  flexDirection: 'column',
                  gap: '20px',
                  alignItems: 'center'
                }),
              }}>
                <div style={styles.statItem}>
                  <div style={{
                    ...styles.statNumber,
                    ...(isMobile && { fontSize: '1.5rem' }),
                    ...(isTablet && { fontSize: '1.8rem' }),
                  }}>High</div>
                  <div style={styles.statLabel}>Accuracy Rate</div>
                </div>
                <div style={styles.statItem}>
                  <div style={{
                    ...styles.statNumber,
                    ...(isMobile && { fontSize: '1.5rem' }),
                    ...(isTablet && { fontSize: '1.8rem' }),
                  }}>Efficient</div>
                  <div style={styles.statLabel}>ATS System</div>
                </div>
                <div style={styles.statItem}>
                  <div style={{
                    ...styles.statNumber,
                    ...(isMobile && { fontSize: '1.5rem' }),
                    ...(isTablet && { fontSize: '1.8rem' }),
                  }}>Fast</div>
                  <div style={styles.statLabel}>Response Time</div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div style={{
          ...styles.rightPanel,
          ...(isMobile && styles.rightPanelMobile),
          ...(isTablet && styles.rightPanelTablet),
        }}>
          <div style={styles.rightContent}>
            <div style={{
              ...styles.uploadCard,
              ...(isMobile && styles.uploadCardMobile),
              ...(isTablet && styles.uploadCardTablet),
            }}>
              <div style={styles.cardHeader}>
                <h2 style={{
                  ...styles.uploadTitle,
                  ...(isMobile && { fontSize: '1.5rem' }),
                  ...(isTablet && { fontSize: '1.8rem' }),
                }}>
                  Upload Your Resume
                </h2>
                <p style={{
                  ...styles.uploadSubtitle,
                  ...(isMobile && { fontSize: '0.9rem' }),
                  ...(isTablet && { fontSize: '1rem' }),
                }}>
                  Drop your PDF or Word document to begin analysis
                </p>
              </div>

              <div 
                style={{
                  ...styles.dropzone,
                  ...(isMobile && styles.dropzoneMobile),
                  ...(isTablet && styles.dropzoneTablet),
                  borderColor: isDragging ? "#2563eb" : error ? "#ef4444" : "rgba(255, 255, 255, 0.1)",
                  backgroundColor: isDragging ? "rgba(37, 99, 235, 0.05)" : "rgba(255, 255, 255, 0.03)"
                }}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => document.getElementById('file-upload')?.click()}
              >
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  style={{ display: "none" }}
                  id="file-upload"
                  onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                />
                
                <div style={{
                  ...styles.dropzoneContent,
                  ...(isMobile && { padding: '30px 20px' }),
                  ...(isTablet && { padding: '40px 25px' }),
                }}>
                  <div style={styles.uploadIcon}>
                    {file ? (
                      <div style={{
                        ...styles.fileIcon,
                        ...(isMobile && { width: '50px', height: '50px' }),
                        ...(isTablet && { width: '60px', height: '60px' }),
                      }}>
                        <svg width={isMobile ? "40" : isTablet ? "50" : "64"} 
                             height={isMobile ? "40" : isTablet ? "50" : "64"} 
                             viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M14 2V8H20" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M16 13H8" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M16 17H8" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M10 9H9H8" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    ) : (
                      <div style={{
                        ...styles.uploadIconCircle,
                        ...(isMobile && { width: '50px', height: '50px' }),
                        ...(isTablet && { width: '60px', height: '60px' }),
                      }}>
                        <svg width={isMobile ? "30" : isTablet ? "40" : "64"} 
                             height={isMobile ? "30" : isTablet ? "40" : "64"} 
                             viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M17 8L12 3L7 8" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M12 3V15" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    )}
                  </div>
                  
                  <div style={styles.uploadText}>
                    {file ? (
                      <>
                        <div style={{
                          ...styles.fileName,
                          ...(isMobile && { fontSize: '1rem' }),
                          ...(isTablet && { fontSize: '1.1rem' }),
                        }}>{file.name}</div>
                        <div style={{
                          ...styles.fileSize,
                          ...(isMobile && { fontSize: '0.85rem' }),
                        }}>
                          {(file.size / 1024 / 1024).toFixed(2)} MB • Ready to Analyze
                        </div>
                        <div style={{
                          ...styles.fileChange,
                          ...(isMobile && { fontSize: '0.75rem' }),
                        }}>
                          Click to change file
                        </div>
                      </>
                    ) : (
                      <>
                        <div style={{
                          ...styles.dropzoneTitle,
                          ...(isMobile && { fontSize: '1.1rem' }),
                          ...(isTablet && { fontSize: '1.2rem' }),
                        }}>
                          {isDragging ? "Drop your file here" : "Drag & drop your resume"}
                        </div>
                        <div style={{
                          ...styles.dropzoneSubtitle,
                          ...(isMobile && { fontSize: '0.85rem' }),
                          ...(isTablet && { fontSize: '0.9rem' }),
                        }}>
                          or click to browse files
                        </div>
                        <div style={{
                          ...styles.fileTypes,
                          ...(isMobile && { fontSize: '0.7rem', padding: '4px 12px' }),
                        }}>
                          Supported: PDF, DOC, DOCX • Max 10MB
                        </div>
                      </>
                    )}
                  </div>
                  
                  {file && (
                    <button 
                      style={{
                        ...styles.removeButton,
                        ...(isMobile && { width: '30px', height: '30px', top: '10px', right: '10px' }),
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setFile(null);
                      }}
                    >
                      <svg width={isMobile ? "16" : "20"} height={isMobile ? "16" : "20"} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  )}
                </div>
              </div>

              {error && !showErrorPopup && (
                <div style={{
                  ...styles.errorBox,
                  ...(isMobile && { padding: '12px', gap: '8px' }),
                }}>
                  <div style={styles.errorIcon}>
                    <svg width={isMobile ? "16" : "20"} height={isMobile ? "16" : "20"} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 9V12M12 15H12.01M5.07183 19H18.9282C20.4678 19 21.4301 17.3333 20.6603 16L13.7321 4C12.9623 2.66667 11.0377 2.66667 10.2679 4L3.33975 16C2.56995 17.3333 3.53223 19 5.07183 19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div style={{
                    ...styles.errorText,
                    ...(isMobile && { fontSize: '0.85rem' }),
                  }}>{error}</div>
                </div>
              )}

              <button
                style={{
                  ...styles.analyzeBtn,
                  ...(isMobile && { 
                    padding: '16px 20px',
                    fontSize: '1rem',
                    gap: '8px'
                  }),
                  ...(isTablet && { 
                    padding: '18px 22px',
                  }),
                  opacity: loading || !file ? 0.7 : 1,
                  cursor: loading || !file ? "not-allowed" : "pointer"
                }}
                onClick={handleUpload}
                disabled={loading || !file}
              >
                {loading ? (
                  <div style={styles.loadingState}>
                    <div style={styles.spinner}></div>
                    <span>Analyzing Resume...</span>
                  </div>
                ) : (
                  <>
                    <svg style={{
                      ...styles.btnIcon,
                      ...(isMobile && { width: '16px', height: '16px' }),
                    }} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M13 10V3L4 14H11V21L20 10H13Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span>Start ATS Analysis</span>
                  </>
                )}
              </button>

              <div style={{
                ...styles.securityNote,
                ...(isMobile && { padding: '12px', gap: '8px' }),
              }}>
                <div style={styles.securityIcon}>
                  <svg width={isMobile ? "14" : "16"} height={isMobile ? "14" : "16"} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 22C12 22 20 18 20 12V5L12 2L4 5V12C4 18 12 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <p style={{
                  ...styles.securityText,
                  ...(isMobile && { fontSize: '0.8rem' }),
                  ...(isTablet && { fontSize: '0.85rem' }),
                }}>
                  Your resume is processed securely and never stored on our servers
                </p>
              </div>

              <div style={{
                ...styles.trustBadges,
                ...(isMobile && { gap: '8px' }),
              }}>
                <div style={{
                  ...styles.trustBadge,
                  ...(isMobile && { fontSize: '0.7rem', padding: '4px 10px' }),
                }}>🔒 Encrypted scanning</div>
                <div style={{
                  ...styles.trustBadge,
                  ...(isMobile && { fontSize: '0.7rem', padding: '4px 10px' }),
                }}>🛡️ Highly Secure</div>
                <div style={{
                  ...styles.trustBadge,
                  ...(isMobile && { fontSize: '0.7rem', padding: '4px 10px' }),
                }}>⚡ Instant Results</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx="true">{`
        @keyframes float {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          25% { transform: translate(30px, -20px) rotate(5deg); }
          50% { transform: translate(-20px, 15px) rotate(-5deg); }
          75% { transform: translate(15px, 20px) rotate(3deg); }
        }
        
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes pulse {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.05);
            opacity: 0.7;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
        
        .hover-lift:hover {
          transform: translateY(-2px);
          transition: transform 0.3s ease;
        }
        
        .hover-glow:hover {
          box-shadow: 0 6px 12px rgba(37, 99, 235, 0.4);
        }
        
        @media (max-width: 320px) {
          .xs-hidden { display: none !important; }
          .xs-text-xs { font-size: 0.75rem !important; }
          .xs-p-2 { padding: 8px !important; }
          .xs-min-h-auto { min-height: auto !important; }
        }
        
        @media (min-width: 321px) and (max-width: 375px) {
          .sm-hidden { display: none !important; }
          .sm-text-sm { font-size: 0.8rem !important; }
          .sm-p-3 { padding: 12px !important; }
        }
        
        @media (min-width: 376px) and (max-width: 480px) {
          .md-text-base { font-size: 0.875rem !important; }
          .md-p-4 { padding: 16px !important; }
        }
        
        @media (min-width: 481px) and (max-width: 600px) {
          .lg-text-lg { font-size: 0.95rem !important; }
          .lg-p-5 { padding: 20px !important; }
        }
        
        @media (max-width: 576px) {
          .mobile-hidden { display: none !important; }
          .mobile-touch-target { min-height: 44px !important; min-width: 44px !important; }
        }
        
        @media (min-width: 577px) and (max-width: 768px) {
          .tablet-optimized { font-size: 0.9rem !important; }
          .tablet-touch-target { min-height: 40px !important; min-width: 40px !important; }
        }
        
        @media (min-width: 769px) and (max-width: 900px) {
          .small-tablet { font-size: 0.92rem !important; }
          .small-tablet-flex-col { flex-direction: column !important; }
        }
        
        @media (min-width: 901px) and (max-width: 1024px) {
          .medium-tablet { font-size: 0.94rem !important; }
        }
        
        @media (min-width: 1025px) and (max-width: 1200px) {
          .large-tablet { font-size: 0.96rem !important; }
        }
        
        @media (min-width: 1201px) and (max-width: 1400px) {
          .small-desktop { font-size: 1rem !important; }
        }
        
        @media (min-width: 1401px) and (max-width: 1920px) {
          .medium-desktop { font-size: 1.05rem !important; }
          .medium-desktop-max-w { max-width: 1600px !important; }
        }
        
        @media (min-width: 1921px) {
          .large-desktop { font-size: 1.1rem !important; }
          .large-desktop-max-w { max-width: 1800px !important; }
          .large-desktop-p-8 { padding: 32px !important; }
        }
        
        @media (orientation: landscape) and (max-height: 500px) {
          .landscape-short { padding: 10px !important; min-height: auto !important; }
          .landscape-flex-row { flex-direction: row !important; }
          .landscape-h-auto { height: auto !important; }
        }
        
        @media (orientation: landscape) and (max-height: 600px) {
          .landscape-medium { padding: 12px !important; }
        }
        
        @media (orientation: portrait) and (max-height: 700px) {
          .portrait-short { padding: 10px !important; }
          .portrait-min-h-auto { min-height: auto !important; }
        }
        
        @media (max-height: 400px) {
          .very-short-screen { padding: 5px !important; }
          .very-short-screen-hidden { display: none !important; }
        }
        
        @media (hover: none) and (pointer: coarse) {
          .touch-device { cursor: default !important; }
          .touch-device button { min-height: 44px !important; min-width: 44px !important; }
          .touch-device input { font-size: 16px !important; }
        }
        
        @media (hover: hover) {
          .mouse-device { cursor: pointer !important; }
        }
        
        @media (prefers-reduced-motion: reduce) {
          * { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; transition-duration: 0.01ms !important; }
          .no-motion { animation: none !important; transition: none !important; }
        }
        
        @media (prefers-color-scheme: dark) {
          .dark-mode-optimized { background-color: #0f172a !important; color: #f8fafc !important; }
        }
        
        @media (prefers-color-scheme: light) {
          .light-mode-optimized { background-color: #f8fafc !important; color: #0f172a !important; }
        }
        
        @media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
          .retina-optimized { backdrop-filter: blur(40px) !important; }
          .retina-sharp { image-rendering: -webkit-optimize-contrast; image-rendering: crisp-edges; }
        }
        
        @media (max-width: 768px) and (orientation: landscape) {
          .mobile-landscape-grid { display: grid !important; grid-template-columns: 1fr 1fr !important; gap: 15px !important; }
          .mobile-landscape-flex { flex-direction: row !important; }
        }
        
        @supports (height: 100dvh) {
          .dynamic-viewport { height: 100dvh; min-height: 100dvh; }
        }
        
        @supports (backdrop-filter: blur(10px)) {
          .backdrop-blur { backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); }
        }
        
        @supports not (backdrop-filter: blur(10px)) {
          .backdrop-fallback { background: rgba(15, 23, 42, 0.95) !important; }
        }
        
        @media (max-width: 768px) {
          .mobile-tap-target * { touch-action: manipulation; }
          .mobile-prevent-zoom { touch-action: pan-y pinch-zoom; }
          .mobile-font-size-base { font-size: 16px !important; }
        }
        
        @media print {
          .print-hidden { display: none !important; }
          .print-black-white { filter: grayscale(100%) !important; color: black !important; background: white !important; }
        }
      `}</style>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
    position: 'relative',
    overflow: 'auto',
    color: '#f8fafc',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    width: '100%',
  },
  
  backgroundElements: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
    overflow: 'hidden',
    pointerEvents: 'none',
  },
  
  container: {
    width: '100%',
    maxWidth: '1400px',
    margin: '0 auto',
    display: 'flex',
    gap: '40px',
    alignItems: 'stretch',
    position: 'relative',
    zIndex: 1,
  },
  
  containerMobile: {
    flexDirection: 'column',
    gap: '25px',
    padding: '0',
  },
  
  containerTablet: {
    gap: '30px',
    padding: '0 15px',
  },
  
  leftPanel: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  
  leftPanelMobile: {
    width: '100%',
    marginBottom: '0',
  },
  
  leftPanelTablet: {
    flex: 1,
  },
  
  leftContent: {
    background: 'rgba(255, 255, 255, 0.03)',
    borderRadius: '20px',
    padding: '30px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    WebkitBackdropFilter: 'blur(10px)',
  },
  
  heroSection: {
    marginBottom: '30px',
  },
  
  heroBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '10px',
    background: 'rgba(96, 165, 250, 0.1)',
    padding: '8px 16px',
    borderRadius: '50px',
    marginBottom: '20px',
    border: '1px solid rgba(96, 165, 250, 0.3)',
  },
  
  badgeIcon: {
    fontSize: '16px',
  },
  
  badgeText: {
    fontSize: '0.85rem',
    fontWeight: '600',
    color: '#f8fafc',
  },
  
  heroTitle: {
    fontSize: '2.5rem',
    fontWeight: '800',
    lineHeight: '1.2',
    margin: '0 0 15px 0',
    color: '#f8fafc',
  },
  
  heroHighlight: {
    color: '#60a5fa',
    background: 'linear-gradient(90deg, #60a5fa, #93c5fd)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  
  heroDescription: {
    fontSize: '1.1rem',
    color: '#cbd5e1',
    lineHeight: '1.6',
    margin: '0',
  },
  
  progressSteps: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '30px',
    background: 'rgba(255, 255, 255, 0.05)',
    padding: '20px',
    borderRadius: '16px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
  },
  
  mobileProgress: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
    marginBottom: '25px',
  },
  
  mobileStep: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  
  mobileStepNumber: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontWeight: '700',
    fontSize: '0.9rem',
    flexShrink: 0,
  },
  
  mobileStepNumberInactive: {
    background: 'rgba(255, 255, 255, 0.1)',
    color: '#94a3b8',
  },
  
  mobileStepContent: {
    flex: 1,
  },
  
  mobileStepTitle: {
    fontSize: '0.95rem',
    fontWeight: '700',
    margin: '0 0 3px 0',
    color: '#f8fafc',
  },
  
  mobileStepDesc: {
    fontSize: '0.8rem',
    color: '#94a3b8',
    margin: '0',
  },
  
  step: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    flex: 1,
  },
  
  stepNumber: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontWeight: '700',
    fontSize: '1rem',
  },
  
  stepNumberInactive: {
    background: 'rgba(255, 255, 255, 0.1)',
    color: '#94a3b8',
  },
  
  stepContent: {
    flex: 1,
  },
  
  stepTitle: {
    fontSize: '1rem',
    fontWeight: '700',
    margin: '0 0 4px 0',
    color: '#f8fafc',
  },
  
  stepDesc: {
    fontSize: '0.85rem',
    color: '#94a3b8',
    margin: '0',
  },
  
  stepDivider: {
    width: '30px',
    height: '2px',
    background: 'rgba(255, 255, 255, 0.2)',
    margin: '0 8px',
  },
  
  featuresGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '15px',
    marginBottom: '30px',
  },
  
  featureCard: {
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '12px',
    padding: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    transition: 'all 0.3s ease',
  },
  
  featureIcon: {
    fontSize: '20px',
    width: '40px',
    height: '40px',
    background: 'rgba(96, 165, 250, 0.1)',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  
  featureContent: {
    flex: 1,
  },
  
  featureTitle: {
    fontSize: '0.95rem',
    fontWeight: '700',
    margin: '0 0 4px 0',
    color: '#f8fafc',
  },
  
  featureDesc: {
    fontSize: '0.8rem',
    color: '#94a3b8',
    margin: '0',
    lineHeight: '1.4',
  },
  
  statsSection: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingTop: '25px',
    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
    marginTop: 'auto',
  },
  
  statItem: {
    textAlign: 'center',
    flex: 1,
  },
  
  statNumber: {
    fontSize: '1.8rem',
    fontWeight: '800',
    color: '#60a5fa',
    marginBottom: '4px',
  },
  
  statLabel: {
    fontSize: '0.8rem',
    color: '#94a3b8',
    letterSpacing: '0.5px',
  },
  
  rightPanel: {
    flex: 1,
  },
  
  rightPanelMobile: {
    width: '100%',
  },
  
  rightPanelTablet: {
    flex: 1,
  },
  
  rightContent: {
    height: '100%',
  },
  
  uploadCard: {
    background: 'rgba(255, 255, 255, 0.03)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    borderRadius: '20px',
    padding: '30px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  
  uploadCardMobile: {
    padding: '25px 20px',
    borderRadius: '16px',
  },
  
  uploadCardTablet: {
    padding: '30px 25px',
  },
  
  cardHeader: {
    marginBottom: '25px',
  },
  
  uploadTitle: {
    fontSize: '1.8rem',
    fontWeight: '800',
    color: '#f8fafc',
    margin: '0 0 10px 0',
  },
  
  uploadSubtitle: {
    fontSize: '1rem',
    color: '#94a3b8',
    margin: '0',
    lineHeight: '1.5',
  },
  
  dropzone: {
    flex: 1,
    borderRadius: '14px',
    border: '2px dashed rgba(255, 255, 255, 0.1)',
    background: 'rgba(255, 255, 255, 0.03)',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    marginBottom: '25px',
    position: 'relative',
    overflow: 'hidden',
    minHeight: '250px',
  },
  
  dropzoneMobile: {
    minHeight: '200px',
    borderRadius: '12px',
  },
  
  dropzoneTablet: {
    minHeight: '220px',
  },
  
  dropzoneContent: {
    padding: '40px 25px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    position: 'relative',
  },
  
  uploadIcon: {
    marginBottom: '20px',
  },
  
  uploadIconCircle: {
    width: '70px',
    height: '70px',
    borderRadius: '50%',
    background: 'rgba(96, 165, 250, 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#60a5fa',
    border: '2px solid rgba(96, 165, 250, 0.3)',
    transition: 'all 0.3s ease',
  },
  
  fileIcon: {
    width: '70px',
    height: '70px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#60a5fa',
  },
  
  uploadText: {
    textAlign: 'center',
    width: '100%',
  },
  
  dropzoneTitle: {
    fontSize: '1.2rem',
    fontWeight: '600',
    color: '#f8fafc',
    marginBottom: '6px',
    wordBreak: 'break-word',
  },
  
  dropzoneSubtitle: {
    fontSize: '0.95rem',
    color: '#94a3b8',
    marginBottom: '10px',
  },
  
  fileTypes: {
    fontSize: '0.8rem',
    color: '#64748b',
    background: 'rgba(255, 255, 255, 0.05)',
    padding: '5px 14px',
    borderRadius: '20px',
    display: 'inline-block',
    wordBreak: 'break-word',
  },
  
  fileName: {
    fontSize: '1.1rem',
    fontWeight: '600',
    color: '#f8fafc',
    marginBottom: '5px',
    wordBreak: 'break-word',
    textAlign: 'center',
  },
  
  fileSize: {
    fontSize: '0.9rem',
    color: '#94a3b8',
    marginBottom: '6px',
  },
  
  fileChange: {
    fontSize: '0.8rem',
    color: '#60a5fa',
    textDecoration: 'underline',
    cursor: 'pointer',
  },
  
  removeButton: {
    position: 'absolute',
    top: '15px',
    right: '15px',
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    background: 'rgba(239, 68, 68, 0.1)',
    border: '1px solid rgba(239, 68, 68, 0.3)',
    color: '#ef4444',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    border: 'none',
  },
  
  errorBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    background: 'rgba(239, 68, 68, 0.1)',
    padding: '14px',
    borderRadius: '10px',
    marginBottom: '20px',
    border: '1px solid rgba(239, 68, 68, 0.2)',
  },
  
  errorIcon: {
    color: '#ef4444',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  
  errorText: {
    color: '#fca5a5',
    fontSize: '0.9rem',
    flex: 1,
  },
  
  analyzeBtn: {
    width: '100%',
    padding: '18px 24px',
    background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontSize: '1.05rem',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.3)',
    marginBottom: '20px',
  },
  
  btnIcon: {
    width: '18px',
    height: '18px',
  },
  
  loadingState: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  
  spinner: {
    width: '18px',
    height: '18px',
    border: '2px solid rgba(255, 255, 255, 0.3)',
    borderTopColor: 'white',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  
  securityNote: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '14px',
    background: 'rgba(96, 165, 250, 0.1)',
    borderRadius: '10px',
    border: '1px solid rgba(96, 165, 250, 0.2)',
    marginBottom: '20px',
  },
  
  securityIcon: {
    color: '#60a5fa',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  
  securityText: {
    fontSize: '0.85rem',
    color: '#93c5fd',
    margin: '0',
    lineHeight: '1.4',
  },
  
  trustBadges: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    justifyContent: 'center',
    paddingTop: '20px',
    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
  },
  
  trustBadge: {
    fontSize: '0.75rem',
    color: '#94a3b8',
    background: 'rgba(255, 255, 255, 0.05)',
    padding: '5px 12px',
    borderRadius: '20px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    whiteSpace: 'nowrap',
  },
};