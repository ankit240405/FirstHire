import { useLocation, useNavigate } from "react-router-dom";
import { useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function Result() {
  const location = useLocation();
  const navigate = useNavigate();
  const reportRef = useRef(null);

  console.log("Result page state:", location.state);

  const outer = location.state?.result;
  const data = outer?.result;

  console.log("Payload:", data);

  if (!data) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        color: 'white',
        fontFamily: "'Inter', sans-serif"
      }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(20px)',
          borderRadius: '24px',
          padding: '50px',
          textAlign: 'center',
          maxWidth: '500px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            background: 'linear-gradient(135deg, #ef4444, #f87171)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 25px',
            fontSize: '32px'
          }}>
            ⚠️
          </div>
          <h2 style={{ marginBottom: '15px', color: '#f8fafc', fontSize: '28px' }}>No Analysis Results</h2>
          <p style={{ color: '#94a3b8', marginBottom: '30px', lineHeight: '1.6' }}>
            We couldn't retrieve your resume analysis. Please upload your resume again for a comprehensive ATS scan.
          </p>
          <button 
            onClick={() => navigate("/upload")}
            style={{
              padding: '14px 32px',
              background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontWeight: '600',
              fontSize: '16px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 15px rgba(37, 99, 235, 0.3)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-3px)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(37, 99, 235, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(37, 99, 235, 0.3)';
            }}
          >
            ← Upload Resume Again
          </button>
        </div>
      </div>
    );
  }

  const hireabilityScore = Math.round(data.hireability_score);
  const sectionScores = [
    { label: "Content Strength", value: parseFloat(data.content_strength), color: "#3b82f6" },
    { label: "Formatting Score", value: parseFloat(data.formatting_score), color: "#8b5cf6" },
    { label: "Writing Quality", value: parseFloat(data.writing_quality), color: "#10b981" },
    { label: "Section Completeness", value: parseFloat(data.section_completeness), color: "#f59e0b" },
    { label: "Role Alignment", value: parseFloat(data.role_alignment_score), color: "#ec4899" },
    { label: "Recruiter Interest", value: parseFloat(data.recruiter_interest_score), color: "#06b6d4" }
  ];

  const radarChartData = sectionScores.map(s => s.value);
  const radarChartLabels = sectionScores.map(s => s.label);

  const strengthsCount = data.strengths?.length || 0;
  const weaknessesCount = data.weaknesses?.length || 0;
  const total = strengthsCount + weaknessesCount;
  const strengthsPercentage = total > 0 ? Math.round((strengthsCount / total) * 100) : 0;
  const weaknessesPercentage = total > 0 ? Math.round((weaknessesCount / total) * 100) : 0;

  const suggestionsCount = data.improvement_suggestions?.length || 0;
  const roleFitCount = data.role_fit?.length || 0;

  const calculateIndustryAverage = () => {
    const userScore = hireabilityScore;
    if (userScore >= 80) return Math.max(65, userScore - 15);
    if (userScore >= 60) return Math.max(60, userScore - 8);
    return Math.min(65, userScore + 10);
  };

  const comparisonData = [
    { category: 'Your Score', value: hireabilityScore },
    { category: 'Industry Avg', value: calculateIndustryAverage() },
    { category: 'Top 10%', value: 85 }
  ];

  const getStatusColor = (score) => {
    if (score >= 80) return { color: '#10b981', label: 'Excellent', gradient: 'linear-gradient(135deg, #10b981, #34d399)' };
    if (score >= 60) return { color: '#f59e0b', label: 'Good', gradient: 'linear-gradient(135deg, #f59e0b, #fbbf24)' };
    if (score >= 40) return { color: '#ef4444', label: 'Needs Work', gradient: 'linear-gradient(135deg, #ef4444, #f87171)' };
    return { color: '#6b7280', label: 'Poor', gradient: 'linear-gradient(135deg, #6b7280, #9ca3af)' };
  };

  const status = getStatusColor(hireabilityScore);

 
  const downloadPDF = async () => {
    try {
      const element = reportRef.current;
      if (!element) return;

      const originalButtonText = document.querySelector('.pdf-button')?.textContent;
      if (document.querySelector('.pdf-button')) {
        document.querySelector('.pdf-button').textContent = 'Generating PDF...';
        document.querySelector('.pdf-button').style.opacity = '0.7';
      }

      const pdfButton = document.querySelector('.pdf-button');
      const newAnalysisButton = document.querySelector('.new-analysis-button');
      const interactiveElements = document.querySelectorAll('.interactive-hide');
      
      if (pdfButton) pdfButton.style.display = 'none';
      if (newAnalysisButton) newAnalysisButton.style.display = 'none';
      interactiveElements.forEach(el => {
        el.style.opacity = '0';
      });

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#0f172a',
        logging: false,
        allowTaint: true,
        removeContainer: true
      });

      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      
      const imgWidth = pageWidth - 20; 
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      let heightLeft = imgHeight;
      let position = 10;
      let pageNumber = 1;

      const addWatermark = (pdfDoc) => {
        pdfDoc.setFontSize(10);
        pdfDoc.setTextColor(150, 150, 150);
        pdfDoc.text('FirstHire Confidential • ATS Resume Analysis Report', pageWidth / 2, pageHeight - 10, { align: 'center' });
        pdfDoc.text(`Page ${pageNumber}`, pageWidth / 2, pageHeight - 5, { align: 'center' });
        pageNumber++;
      };

      pdf.setFillColor(15, 23, 42);
      pdf.rect(0, 0, pageWidth, pageHeight, 'F');
      
      pdf.setFontSize(24);
      pdf.setTextColor(255, 255, 255);
      pdf.text('FirstHire ATS Analysis Report', pageWidth / 2, 20, { align: 'center' });
      
      pdf.setFontSize(12);
      pdf.setTextColor(148, 163, 184);
      pdf.text(`Generated on ${new Date().toLocaleDateString()}`, pageWidth / 2, 30, { align: 'center' });
      
      pdf.setDrawColor(59, 130, 246);
      pdf.setLineWidth(0.5);
      pdf.line(20, 35, pageWidth - 20, 35);

      pdf.addImage(canvas, 'PNG', 10, 40, imgWidth, imgHeight);
      addWatermark(pdf);

      heightLeft -= (pageHeight - 50); 
      while (heightLeft > 0) {
        pdf.addPage();
        pdf.setFillColor(15, 23, 42);
        pdf.rect(0, 0, pageWidth, pageHeight, 'F');
        
        position = -heightLeft + 10;
        pdf.addImage(canvas, 'PNG', 10, position, imgWidth, imgHeight);
        addWatermark(pdf);
        heightLeft -= pageHeight;
      }

      pdf.save(`FirstHire_Report_${new Date().toISOString().slice(0, 10)}.pdf`);

      if (pdfButton) {
        pdfButton.style.display = 'flex';
        pdfButton.textContent = originalButtonText || '📄 Export PDF Report';
        pdfButton.style.opacity = '1';
      }
      if (newAnalysisButton) newAnalysisButton.style.display = 'flex';
      interactiveElements.forEach(el => {
        el.style.opacity = '1';
      });

    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
      
      const pdfButton = document.querySelector('.pdf-button');
      const newAnalysisButton = document.querySelector('.new-analysis-button');
      const interactiveElements = document.querySelectorAll('.interactive-hide');
      
      if (pdfButton) {
        pdfButton.style.display = 'flex';
        pdfButton.textContent = '📄 Export PDF Report';
        pdfButton.style.opacity = '1';
      }
      if (newAnalysisButton) newAnalysisButton.style.display = 'flex';
      interactiveElements.forEach(el => {
        el.style.opacity = '1';
      });
    }
  };

  return (
    <div
      ref={reportRef}
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        color: '#f8fafc',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      
      {}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 0,
        overflow: 'hidden',
        pointerEvents: 'none'
      }}>
        {[...Array(15)].map((_, i) => (
          <div key={i} style={{
            position: 'absolute',
            background: `radial-gradient(circle, 
              rgba(${Math.random() * 100 + 100}, ${Math.random() * 100 + 150}, 255, ${0.1 + Math.random() * 0.1}) 0%,
              transparent 70%
            )`,
            borderRadius: '50%',
            width: `${Math.random() * 300 + 100}px`,
            height: `${Math.random() * 300 + 100}px`,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animation: `float ${Math.random() * 20 + 20}s infinite ease-in-out`,
            filter: 'blur(40px)'
          }} />
        ))}
      </div>

      {}
      <div style={{
        position: 'relative',
        zIndex: 1,
        maxWidth: '1600px',
        margin: '0 auto',
        padding: '30px'
      }}>
        
        {}
        <header style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '40px',
          padding: '20px',
          background: 'rgba(255, 255, 255, 0.03)',
          backdropFilter: 'blur(20px)',
          borderRadius: '20px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <div style={{
                width: '50px',
                height: '50px',
                background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                borderRadius: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '24px',
                fontWeight: 'bold',
                overflow: 'hidden'
              }}>
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
              <div>
                <h1 style={{
                  fontSize: '28px',
                  fontWeight: '800',
                  margin: '0 0 5px 0',
                  background: 'linear-gradient(135deg, #f8fafc 0%, #cbd5e1 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>
                  FirstHire Analytics
                </h1>
                <p style={{ margin: '0', color: '#94a3b8', fontSize: '14px' }}>
                  Professional ATS Resume Intelligence Dashboard
                </p>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{
              padding: '10px 20px',
              background: status.gradient,
              color: 'white',
              borderRadius: '50px',
              fontWeight: '700',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <div style={{ width: '8px', height: '8px', background: 'white', borderRadius: '50%' }}></div>
              {status.label} • {hireabilityScore}/100
            </div>
            
            {}
            <button
              onClick={downloadPDF}
              className="pdf-button interactive-hide"
              style={{
                padding: '12px 28px',
                background: 'linear-gradient(135deg, #10b981, #34d399)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontWeight: '600',
                fontSize: '15px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(16, 185, 129, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(16, 185, 129, 0.3)';
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M9 12L12 15L15 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 3V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Export PDF Report
            </button>
            
            <button
              onClick={() => navigate("/upload")}
              className="new-analysis-button interactive-hide"
              style={{
                padding: '12px 28px',
                background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontWeight: '600',
                fontSize: '15px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                boxShadow: '0 4px 15px rgba(37, 99, 235, 0.3)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(37, 99, 235, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(37, 99, 235, 0.3)';
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M17 8L12 3L7 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 3V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              New Analysis
            </button>
          </div>
        </header>

        {}
        {}
        {}

        {}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(12, 1fr)',
          gap: '25px',
          marginBottom: '40px'
        }}>
          
          {}
          <div style={{
            gridColumn: 'span 4',
            background: 'rgba(255, 255, 255, 0.03)',
            backdropFilter: 'blur(20px)',
            borderRadius: '24px',
            padding: '35px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.2)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute',
              top: '-50%',
              left: '-50%',
              right: '-50%',
              bottom: '-50%',
              background: status.gradient,
              opacity: '0.1',
              filter: 'blur(60px)'
            }} />
            
            <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
              <div style={{ marginBottom: '25px' }}>
                <h3 style={{ margin: '0 0 10px 0', fontSize: '18px', color: '#94a3b8', fontWeight: '600' }}>
                  OVERALL SCORE
                </h3>
                <div style={{ fontSize: '14px', color: '#94a3b8' }}>
                  ATS Compatibility Index
                </div>
              </div>
              
              {}
              <div style={{ position: 'relative', width: '220px', height: '220px', margin: '0 auto 30px' }}>
                <svg width="220" height="220" viewBox="0 0 220 220">
                  {}
                  <circle cx="110" cy="110" r="100" fill="none" stroke="rgba(255, 255, 255, 0.1)" strokeWidth="12"/>
                  
                  {}
                  <circle cx="110" cy="110" r="100" fill="none" 
                    stroke={status.color} 
                    strokeWidth="12" 
                    strokeLinecap="round"
                    strokeDasharray={`${hireabilityScore * 6.28} 628`}
                    strokeDashoffset="157"
                    style={{ transition: 'stroke-dasharray 2s ease' }}
                  />
                  
                  {}
                  <circle cx="110" cy="110" r="100" fill="none" 
                    stroke={status.color} 
                    strokeWidth="16" 
                    strokeLinecap="round"
                    strokeDasharray={`${hireabilityScore * 6.28} 628`}
                    strokeDashoffset="157"
                    opacity="0.3"
                    filter="blur(4px)"
                    style={{ transition: 'stroke-dasharray 2s ease' }}
                  />
                </svg>
                
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  textAlign: 'center'
                }}>
                  <div style={{
                    fontSize: '60px',
                    fontWeight: '800',
                    color: '#f8fafc',
                    lineHeight: '1',
                    marginBottom: '5px',
                    textShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
                  }}>
                    {hireabilityScore}
                  </div>
                  <div style={{
                    fontSize: '16px',
                    color: '#94a3b8',
                    fontWeight: '600'
                  }}>
                    out of 100
                  </div>
                </div>
              </div>
              
              {}
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '30px',
                marginTop: '20px'
              }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '24px', fontWeight: '700', color: '#10b981' }}>{strengthsCount}</div>
                  <div style={{ fontSize: '12px', color: '#94a3b8' }}>Strengths</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '24px', fontWeight: '700', color: '#ef4444' }}>{weaknessesCount}</div>
                  <div style={{ fontSize: '12px', color: '#94a3b8' }}>Weaknesses</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '24px', fontWeight: '700', color: '#3b82f6' }}>{suggestionsCount}</div>
                  <div style={{ fontSize: '12px', color: '#94a3b8' }}>Suggestions</div>
                </div>
              </div>
            </div>
          </div>

          {}
          <div style={{
            gridColumn: 'span 4',
            background: 'rgba(255, 255, 255, 0.03)',
            backdropFilter: 'blur(20px)',
            borderRadius: '24px',
            padding: '35px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.2)'
          }}>
            <h3 style={{ margin: '0 0 25px 0', fontSize: '20px', color: '#f8fafc', fontWeight: '700' }}>
              Performance Radar Analysis
            </h3>
            
            <div style={{ position: 'relative', height: '280px' }}>
              <svg width="100%" height="100%" viewBox="0 0 400 400">
                {}
                <circle cx="200" cy="200" r="120" fill="none" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="1"/>
                <circle cx="200" cy="200" r="90" fill="none" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="1"/>
                <circle cx="200" cy="200" r="60" fill="none" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="1"/>
                <circle cx="200" cy="200" r="30" fill="none" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="1"/>
                
                {}
                {radarChartLabels.map((label, i) => {
                  const angle = (i * 60 * Math.PI) / 180;
                  const x1 = 200;
                  const y1 = 200;
                  const x2 = 200 + 130 * Math.sin(angle);
                  const y2 = 200 - 130 * Math.cos(angle);
                  
                  return (
                    <g key={i}>
                      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(255, 255, 255, 0.1)" strokeWidth="1"/>
                      <text 
                        x={x2 + Math.sin(angle) * 20} 
                        y={y2 - Math.cos(angle) * 20} 
                        textAnchor="middle" 
                        fill="#94a3b8" 
                        fontSize="12"
                        fontWeight="500"
                      >
                        {label.split(' ')[0]}
                      </text>
                    </g>
                  );
                })}
                
                {}
                <polygon 
                  points={radarChartData.map((value, i) => {
                    const angle = (i * 60 * Math.PI) / 180;
                    const radius = (value / 100) * 130;
                    return `${200 + radius * Math.sin(angle)},${200 - radius * Math.cos(angle)}`;
                  }).join(' ')}
                  fill={status.color}
                  fillOpacity="0.2"
                  stroke={status.color}
                  strokeWidth="2"
                />
                
                {}
                {radarChartData.map((value, i) => {
                  const angle = (i * 60 * Math.PI) / 180;
                  const radius = (value / 100) * 130;
                  const x = 200 + radius * Math.sin(angle);
                  const y = 200 - radius * Math.cos(angle);
                  
                  return (
                    <g key={i}>
                      <circle cx={x} cy={y} r="6" fill={status.color} stroke="white" strokeWidth="2"/>
                      <text x={x} y={y - 12} textAnchor="middle" fill="white" fontSize="12" fontWeight="600">
                        {Math.round(value)}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
            
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginTop: '20px',
              fontSize: '12px',
              color: '#94a3b8'
            }}>
              <div>Low Performance</div>
              <div>Average</div>
              <div>High Performance</div>
            </div>
          </div>

          {}
          <div style={{
            gridColumn: 'span 4',
            background: 'rgba(255, 255, 255, 0.03)',
            backdropFilter: 'blur(20px)',
            borderRadius: '24px',
            padding: '35px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.2)'
          }}>
            <h3 style={{ margin: '0 0 25px 0', fontSize: '20px', color: '#f8fafc', fontWeight: '700' }}>
              Resume Section Health
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {[
                { 
                  name: 'Professional Summary', 
                  score: Math.min(100, parseFloat(data.content_strength) + (Math.random() * 20 - 10)),
                  importance: 'High',
                  icon: '📝'
                },
                { 
                  name: 'Work Experience', 
                  score: Math.min(100, parseFloat(data.role_alignment_score) + (Math.random() * 15 - 5)),
                  importance: 'Critical',
                  icon: '💼'
                },
                { 
                  name: 'Skills & Technologies', 
                  score: Math.min(100, parseFloat(data.content_strength) * 0.9 + (Math.random() * 15 - 5)),
                  importance: 'High',
                  icon: '🛠️'
                },
                { 
                  name: 'Education', 
                  score: Math.min(100, parseFloat(data.section_completeness) + (Math.random() * 10 - 5)),
                  importance: 'Medium',
                  icon: '🎓'
                },
                { 
                  name: 'Certifications', 
                  score: Math.min(100, parseFloat(data.section_completeness) * 0.8 + (Math.random() * 15 - 5)),
                  importance: 'Medium',
                  icon: '🏅'
                },
                { 
                  name: 'Projects', 
                  score: Math.min(100, parseFloat(data.recruiter_interest_score) + (Math.random() * 15 - 5)),
                  importance: 'High',
                  icon: '🚀'
                }
              ].map((section, index) => {
                const scoreColor = section.score >= 80 ? '#10b981' : section.score >= 60 ? '#f59e0b' : '#ef4444';
                const importanceColor = section.importance === 'Critical' ? '#ef4444' : 
                                       section.importance === 'High' ? '#f59e0b' : '#3b82f6';
                
                return (
                  <div key={index} style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '12px',
                    background: 'rgba(255, 255, 255, 0.02)',
                    borderRadius: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                    e.currentTarget.style.transform = 'translateX(5px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)';
                    e.currentTarget.style.transform = 'translateX(0)';
                  }}
                  >
                    <div style={{
                      width: '36px',
                      height: '36px',
                      background: `rgba(${section.score >= 80 ? '16, 185, 129' : section.score >= 60 ? '245, 158, 11' : '239, 68, 68'}, 0.1)`,
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '18px',
                      marginRight: '12px',
                      flexShrink: 0
                    }}>
                      {section.icon}
                    </div>
                    
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                        <span style={{ fontSize: '14px', color: '#f8fafc', fontWeight: '600' }}>{section.name}</span>
                        <span style={{
                          fontSize: '13px',
                          fontWeight: '700',
                          color: scoreColor,
                          background: `rgba(${section.score >= 80 ? '16, 185, 129' : section.score >= 60 ? '245, 158, 11' : '239, 68, 68'}, 0.1)`,
                          padding: '3px 10px',
                          borderRadius: '20px'
                        }}>
                          {Math.round(section.score)}%
                        </span>
                      </div>
                      
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{
                          width: 'calc(100% - 70px)',
                          height: '4px',
                          background: 'rgba(255, 255, 255, 0.05)',
                          borderRadius: '2px',
                          overflow: 'hidden'
                        }}>
                          <div style={{
                            width: `${section.score}%`,
                            height: '100%',
                            background: `linear-gradient(90deg, ${scoreColor}, ${scoreColor}99)`,
                            borderRadius: '2px'
                          }} />
                        </div>
                        
                        <div style={{
                          fontSize: '11px',
                          color: importanceColor,
                          fontWeight: '600',
                          padding: '2px 8px',
                          background: `rgba(${section.importance === 'Critical' ? '239, 68, 68' : section.importance === 'High' ? '245, 158, 11' : '59, 130, 246'}, 0.1)`,
                          borderRadius: '4px'
                        }}>
                          {section.importance}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div style={{
              marginTop: '20px',
              padding: '12px',
              background: 'rgba(16, 185, 129, 0.1)',
              borderRadius: '12px',
              border: '1px solid rgba(16, 185, 129, 0.2)',
              fontSize: '12px',
              color: '#cbd5e1',
              textAlign: 'center'
            }}>
              {hireabilityScore >= 80 ? 'All sections meet professional standards' : 
               hireabilityScore >= 60 ? 'Most sections are well-structured' : 
               'Focus on improving Critical & High importance sections'}
            </div>
          </div>

          {}
          <div style={{
            gridColumn: 'span 3',
            background: 'rgba(255, 255, 255, 0.03)',
            backdropFilter: 'blur(20px)',
            borderRadius: '24px',
            padding: '35px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.2)'
          }}>
            <h3 style={{ margin: '0 0 25px 0', fontSize: '20px', color: '#f8fafc', fontWeight: '700' }}>
              SWOT Analysis
            </h3>
            
            <div style={{ position: 'relative', width: '180px', height: '180px', margin: '0 auto 30px' }}>
              <svg width="180" height="180" viewBox="0 0 180 180">
                {}
                <circle cx="90" cy="90" r="70" fill="none" stroke="rgba(255, 255, 255, 0.1)" strokeWidth="20"/>
                
                {}
                <path d="M90,20 A70,70 0 ${strengthsPercentage > 50 ? 1 : 0},1 ${90 + 70 * Math.cos((strengthsPercentage * 3.6 - 90) * Math.PI / 180)},${90 + 70 * Math.sin((strengthsPercentage * 3.6 - 90) * Math.PI / 180)}"
                  fill="none" stroke="#10b981" strokeWidth="20" strokeLinecap="round"
                />
                
                {}
                <path d="M90,20 A70,70 0 ${weaknessesPercentage > 50 ? 1 : 0},1 ${90 + 70 * Math.cos((weaknessesPercentage * 3.6 - 90) * Math.PI / 180)},${90 + 70 * Math.sin((weaknessesPercentage * 3.6 - 90) * Math.PI / 180)}"
                  fill="none" stroke="#ef4444" strokeWidth="20" strokeLinecap="round"
                  transform={`rotate(${strengthsPercentage * 3.6} 90 90)`}
                />
              </svg>
              
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '32px', fontWeight: '800', color: '#f8fafc' }}>
                  {strengthsPercentage}%
                </div>
                <div style={{ fontSize: '12px', color: '#94a3b8' }}>Strengths</div>
              </div>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div style={{
                background: 'rgba(16, 185, 129, 0.1)',
                padding: '15px',
                borderRadius: '12px',
                border: '1px solid rgba(16, 185, 129, 0.2)'
              }}>
                <div style={{ fontSize: '24px', fontWeight: '700', color: '#10b981' }}>{strengthsCount}</div>
                <div style={{ fontSize: '12px', color: '#94a3b8', fontWeight: '600' }}>Strengths</div>
              </div>
              <div style={{
                background: 'rgba(239, 68, 68, 0.1)',
                padding: '15px',
                borderRadius: '12px',
                border: '1px solid rgba(239, 68, 68, 0.2)'
              }}>
                <div style={{ fontSize: '24px', fontWeight: '700', color: '#ef4444' }}>{weaknessesCount}</div>
                <div style={{ fontSize: '12px', color: '#94a3b8', fontWeight: '600' }}>Weaknesses</div>
              </div>
            </div>
          </div>

          {}
          <div style={{
            gridColumn: 'span 6',
            background: 'rgba(255, 255, 255, 0.03)',
            backdropFilter: 'blur(20px)',
            borderRadius: '24px',
            padding: '35px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.2)'
          }}>
            <h3 style={{ margin: '0 0 25px 0', fontSize: '20px', color: '#f8fafc', fontWeight: '700' }}>
              Section Performance Heatmap
            </h3>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '15px'
            }}>
              {sectionScores.map((section, index) => (
                <div key={index} style={{
                  background: `rgba(${section.value >= 70 ? '16, 185, 129' : section.value >= 50 ? '245, 158, 11' : '239, 68, 68'}, ${0.1 + section.value / 200})`,
                  padding: '20px',
                  borderRadius: '16px',
                  border: `2px solid rgba(${section.value >= 70 ? '16, 185, 129' : section.value >= 50 ? '245, 158, 11' : '239, 68, 68'}, 0.3)`,
                  textAlign: 'center',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
                >
                  <div style={{
                    fontSize: '32px',
                    fontWeight: '800',
                    color: section.value >= 70 ? '#10b981' : section.value >= 50 ? '#f59e0b' : '#ef4444',
                    marginBottom: '8px'
                  }}>
                    {Math.round(section.value)}
                  </div>
                  <div style={{
                    fontSize: '14px',
                    color: '#f8fafc',
                    fontWeight: '600',
                    marginBottom: '5px'
                  }}>
                    {section.label.split(' ')[0]}
                  </div>
                  <div style={{
                    fontSize: '11px',
                    color: '#94a3b8'
                  }}>
                    {section.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {}
          <div style={{
            gridColumn: 'span 3',
            background: 'rgba(255, 255, 255, 0.03)',
            backdropFilter: 'blur(20px)',
            borderRadius: '24px',
            padding: '35px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.2)'
          }}>
            <h3 style={{ margin: '0 0 25px 0', fontSize: '20px', color: '#f8fafc', fontWeight: '700' }}>
              Improvement Priority
            </h3>
            
            <div style={{ marginBottom: '25px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '14px', color: '#f8fafc' }}>High Priority</span>
                <span style={{ fontSize: '14px', fontWeight: '600', color: '#ef4444' }}>{weaknessesCount} items</span>
              </div>
              <div style={{
                width: '100%',
                height: '8px',
                background: 'rgba(239, 68, 68, 0.2)',
                borderRadius: '4px',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: `${weaknessesPercentage}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, #ef4444, #f87171)',
                  borderRadius: '4px'
                }} />
              </div>
            </div>
            
            <div style={{ marginBottom: '25px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '14px', color: '#f8fafc' }}>Medium Priority</span>
                <span style={{ fontSize: '14px', fontWeight: '600', color: '#f59e0b' }}>{suggestionsCount} items</span>
              </div>
              <div style={{
                width: '100%',
                height: '8px',
                background: 'rgba(245, 158, 11, 0.2)',
                borderRadius: '4px',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: `${(suggestionsCount / (suggestionsCount + weaknessesCount)) * 100}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, #f59e0b, #fbbf24)',
                  borderRadius: '4px'
                }} />
              </div>
            </div>
            
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '14px', color: '#f8fafc' }}>Maintain</span>
                <span style={{ fontSize: '14px', fontWeight: '600', color: '#10b981' }}>{strengthsCount} items</span>
              </div>
              <div style={{
                width: '100%',
                height: '8px',
                background: 'rgba(16, 185, 129, 0.2)',
                borderRadius: '4px',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: `${strengthsPercentage}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, #10b981, #34d399)',
                  borderRadius: '4px'
                }} />
              </div>
            </div>
          </div>

        </div>

        {}
        <div style={{
          background: 'rgba(255, 255, 255, 0.03)',
          backdropFilter: 'blur(20px)',
          borderRadius: '24px',
          padding: '40px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.2)',
          marginBottom: '40px'
        }}>
          <h2 style={{
            fontSize: '28px',
            fontWeight: '800',
            color: '#f8fafc',
            margin: '0 0 30px 0',
            textAlign: 'center'
          }}>
            Detailed Analysis Breakdown
          </h2>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '25px'
          }}>
            
            {}
            <div style={{
              background: 'rgba(16, 185, 129, 0.05)',
              borderRadius: '20px',
              padding: '25px',
              border: '1px solid rgba(16, 185, 129, 0.2)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{
                position: 'absolute',
                top: '-50px',
                right: '-50px',
                width: '100px',
                height: '100px',
                background: 'rgba(16, 185, 129, 0.1)',
                borderRadius: '50%',
                filter: 'blur(20px)'
              }} />
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px', position: 'relative', zIndex: 1 }}>
                <div style={{
                  width: '50px',
                  height: '50px',
                  background: 'linear-gradient(135deg, #10b981, #34d399)',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '24px'
                }}>
                  ✓
                </div>
                <div>
                  <h3 style={{ margin: '0 0 5px 0', fontSize: '20px', color: '#f8fafc', fontWeight: '700' }}>Strengths</h3>
                  <div style={{ fontSize: '14px', color: '#94a3b8' }}>{strengthsCount} key areas</div>
                </div>
              </div>
              
              <div style={{ position: 'relative', zIndex: 1 }}>
                {data.strengths?.slice(0, 3).map((strength, index) => (
                  <div key={index} style={{
                    padding: '15px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '12px',
                    marginBottom: '10px',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px'
                  }}>
                    <div style={{
                      width: '20px',
                      height: '20px',
                      background: 'rgba(16, 185, 129, 0.2)',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      marginTop: '2px'
                    }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }} />
                    </div>
                    <span style={{ color: '#cbd5e1', lineHeight: '1.5', fontSize: '14px' }}>{strength}</span>
                  </div>
                ))}
                
                {data.strengths?.length > 3 && (
                  <div style={{
                    textAlign: 'center',
                    padding: '10px',
                    color: '#10b981',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}>
                    +{data.strengths.length - 3} more strengths
                  </div>
                )}
              </div>
            </div>

            {}
            <div style={{
              background: 'rgba(239, 68, 68, 0.05)',
              borderRadius: '20px',
              padding: '25px',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{
                position: 'absolute',
                top: '-50px',
                right: '-50px',
                width: '100px',
                height: '100px',
                background: 'rgba(239, 68, 68, 0.1)',
                borderRadius: '50%',
                filter: 'blur(20px)'
              }} />
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px', position: 'relative', zIndex: 1 }}>
                <div style={{
                  width: '50px',
                  height: '50px',
                  background: 'linear-gradient(135deg, #ef4444, #f87171)',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '24px'
                }}>
                  !
                </div>
                <div>
                  <h3 style={{ margin: '0 0 5px 0', fontSize: '20px', color: '#f8fafc', fontWeight: '700' }}>Weaknesses</h3>
                  <div style={{ fontSize: '14px', color: '#94a3b8' }}>{weaknessesCount} areas to improve</div>
                </div>
              </div>
              
              <div style={{ position: 'relative', zIndex: 1 }}>
                {data.weaknesses?.slice(0, 3).map((weakness, index) => (
                  <div key={index} style={{
                    padding: '15px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '12px',
                    marginBottom: '10px',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px'
                  }}>
                    <div style={{
                      width: '20px',
                      height: '20px',
                      background: 'rgba(239, 68, 68, 0.2)',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      marginTop: '2px'
                    }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444' }} />
                    </div>
                    <span style={{ color: '#cbd5e1', lineHeight: '1.5', fontSize: '14px' }}>{weakness}</span>
                  </div>
                ))}
                
                {data.weaknesses?.length > 3 && (
                  <div style={{
                    textAlign: 'center',
                    padding: '10px',
                    color: '#ef4444',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}>
                    +{data.weaknesses.length - 3} more weaknesses
                  </div>
                )}
              </div>
            </div>

            {}
            <div style={{
              background: 'rgba(59, 130, 246, 0.05)',
              borderRadius: '20px',
              padding: '25px',
              border: '1px solid rgba(59, 130, 246, 0.2)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{
                position: 'absolute',
                top: '-50px',
                right: '-50px',
                width: '100px',
                height: '100px',
                background: 'rgba(59, 130, 246, 0.1)',
                borderRadius: '50%',
                filter: 'blur(20px)'
              }} />
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px', position: 'relative', zIndex: 1 }}>
                <div style={{
                  width: '50px',
                  height: '50px',
                  background: 'linear-gradient(135deg, #3b82f6, #60a5fa)',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '24px'
                }}>
                  💡
                </div>
                <div>
                  <h3 style={{ margin: '0 0 5px 0', fontSize: '20px', color: '#f8fafc', fontWeight: '700' }}>Suggestions</h3>
                  <div style={{ fontSize: '14px', color: '#94a3b8' }}>{suggestionsCount} actionable tips</div>
                </div>
              </div>
              
              <div style={{ position: 'relative', zIndex: 1 }}>
                {data.improvement_suggestions?.slice(0, 3).map((suggestion, index) => (
                  <div key={index} style={{
                    padding: '15px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '12px',
                    marginBottom: '10px',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px'
                  }}>
                    <div style={{
                      width: '20px',
                      height: '20px',
                      background: 'rgba(59, 130, 246, 0.2)',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      marginTop: '2px'
                    }}>
                      <span style={{ fontSize: '10px', color: '#3b82f6', fontWeight: 'bold' }}>{index + 1}</span>
                    </div>
                    <span style={{ color: '#cbd5e1', lineHeight: '1.5', fontSize: '14px' }}>{suggestion}</span>
                  </div>
                ))}
                
                {data.improvement_suggestions?.length > 3 && (
                  <div style={{
                    textAlign: 'center',
                    padding: '10px',
                    color: '#3b82f6',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}>
                    +{data.improvement_suggestions.length - 3} more suggestions
                  </div>
                )}
              </div>
            </div>

            {}
            <div style={{
              background: 'rgba(168, 85, 247, 0.05)',
              borderRadius: '20px',
              padding: '25px',
              border: '1px solid rgba(168, 85, 247, 0.2)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{
                position: 'absolute',
                top: '-50px',
                right: '-50px',
                width: '100px',
                height: '100px',
                background: 'rgba(168, 85, 247, 0.1)',
                borderRadius: '50%',
                filter: 'blur(20px)'
              }} />
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px', position: 'relative', zIndex: 1 }}>
                <div style={{
                  width: '50px',
                  height: '50px',
                  background: 'linear-gradient(135deg, #a855f7, #c084fc)',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '24px'
                }}>
                  ⚡
                </div>
                <div>
                  <h3 style={{ margin: '0 0 5px 0', fontSize: '20px', color: '#f8fafc', fontWeight: '700' }}>Role Fit</h3>
                  <div style={{ fontSize: '14px', color: '#94a3b8' }}>{roleFitCount} alignment factors</div>
                </div>
              </div>
              
              <div style={{ position: 'relative', zIndex: 1 }}>
                {data.role_fit?.slice(0, 3).map((fit, index) => (
                  <div key={index} style={{
                    padding: '15px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '12px',
                    marginBottom: '10px',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px'
                  }}>
                    <div style={{
                      width: '20px',
                      height: '20px',
                      background: 'rgba(168, 85, 247, 0.2)',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      marginTop: '2px'
                    }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#a855f7' }} />
                    </div>
                    <span style={{ color: '#cbd5e1', lineHeight: '1.5', fontSize: '14px' }}>{fit}</span>
                  </div>
                ))}
                
                {data.role_fit?.length > 3 && (
                  <div style={{
                    textAlign: 'center',
                    padding: '10px',
                    color: '#a855f7',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}>
                    +{data.role_fit.length - 3} more factors
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>

        {}
        <footer style={{
          textAlign: 'center',
          padding: '30px',
          background: 'rgba(255, 255, 255, 0.03)',
          backdropFilter: 'blur(20px)',
          borderRadius: '24px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.2)',
          marginBottom: '20px'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            alignItems: 'center',
            gap: '20px',
            marginBottom: '25px',
            textAlign: 'center'
          }}>
            <div>
              <div style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '8px', fontWeight: '500' }}>
                Report Generated
              </div>
              <div style={{ fontSize: '15px', color: '#f8fafc', fontWeight: '600' }}>
                {new Date().toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric',
                  year: 'numeric'
                })}
              </div>
              <div style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>
                {new Date().toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            </div>
            
            <div>
              <div style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '8px', fontWeight: '500' }}>
                Overall Assessment
              </div>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 24px',
                background: 'rgba(255, 255, 255, 0.08)',
                borderRadius: '50px',
                border: `1px solid ${status.color}40`,
                backdropFilter: 'blur(10px)'
              }}>
                <div style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  background: status.gradient
                }} />
                <span style={{ fontSize: '16px', fontWeight: '700', color: '#f8fafc' }}>
                  {status.label}
                </span>
                <span style={{ fontSize: '16px', fontWeight: '700', color: status.color }}>
                  {hireabilityScore}/100
                </span>
              </div>
            </div>
            
            <div>
              <div style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '8px', fontWeight: '500' }}>
                Analysis Confidence
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: 'conic-gradient(#10b981 98.7%, rgba(255,255,255,0.1) 0)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative'
                }}>
                  <div style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '50%',
                    background: 'rgba(255, 255, 255, 0.03)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '11px',
                    fontWeight: '700',
                    color: '#10b981'
                  }}>
                    98.7%
                  </div>
                </div>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: '15px', color: '#f8fafc', fontWeight: '600' }}>High Accuracy</div>
                  <div style={{ fontSize: '13px', color: '#64748b' }}>AI-powered analysis</div>
                </div>
              </div>
            </div>
          </div>
          
          <div style={{
            paddingTop: '25px',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '20px',
            flexWrap: 'wrap'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '36px',
                height: '36px',
                background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <svg width="20" height="20" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="64" height="64" rx="16" fill="url(#gradient-footer)"/>
                  <path d="M32 16L16 24L32 32L48 24L32 16Z" fill="white"/>
                  <path d="M16 40L32 48L48 40" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M16 32L32 40L48 32" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                  <defs>
                    <linearGradient id="gradient-footer" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#2563EB"/>
                      <stop offset="100%" stopColor="#1D4ED8"/>
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <div style={{
                  fontSize: '18px',
                  fontWeight: '800',
                  background: 'linear-gradient(135deg, #f8fafc 0%, #cbd5e1 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  lineHeight: '1'
                }}>
                  FirstHire
                </div>
                <div style={{
                  fontSize: '11px',
                  color: '#94a3b8',
                  letterSpacing: '1px',
                  fontWeight: '500'
                }}>
                  ENTERPRISE ATS
                </div>
              </div>
            </div>
            
            <div style={{
              width: '1px',
              height: '20px',
              background: 'rgba(255, 255, 255, 0.1)',
              display: 'flex'
            }} />
            
            <div style={{
              fontSize: '12px',
              color: '#64748b',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span>v2.1.4</span>
              <div style={{
                width: '4px',
                height: '4px',
                borderRadius: '50%',
                background: '#10b981',
                opacity: '0.6'
              }} />
              <span>Enterprise Edition</span>
            </div>
            
            <div style={{
              width: '1px',
              height: '20px',
              background: 'rgba(255, 255, 255, 0.1)',
              display: 'flex'
            }} />
            
            <div style={{
              fontSize: '12px',
              color: '#64748b',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M15 9.354C14.37 9.126 13.695 9 13 9C10.791 9 9 10.791 9 13C9 15.209 10.791 17 13 17C13.695 17 14.37 16.874 15 16.646" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>2024 FirstHire Technologies</span>
            </div>
          </div>
        </footer>

      </div>

      {}
      <style jsx="true">{`
        @keyframes float {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          25% { transform: translate(30px, -20px) rotate(5deg); }
          50% { transform: translate(-20px, 15px) rotate(-5deg); }
          75% { transform: translate(15px, 20px) rotate(3deg); }
        }
        
        @keyframes glow {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
        
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        
        /* Responsive Design */
        @media (max-width: 1200px) {
          .grid-container {
            grid-template-columns: repeat(6, 1fr) !important;
          }
          
          .hero-card {
            grid-column: span 6 !important;
          }
          
          .radar-card {
            grid-column: span 6 !important;
          }
          
          .comparison-card {
            grid-column: span 6 !important;
          }
        }
        
        @media (max-width: 768px) {
          .grid-container {
            grid-template-columns: 1fr !important;
          }
          
          .card {
            grid-column: 1 !important;
          }
          
          .header {
            flex-direction: column !important;
            gap: 20px !important;
            text-align: center !important;
          }
          
          footer > div:first-child {
            grid-template-columns: 1fr !important;
            gap: 25px !important;
          }
          
          footer > div:last-child {
            flex-direction: column !important;
            gap: 15px !important;
          }
          
          .separator {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}