import { useEffect, useState } from "react";

export default function Mentor() {
  const [isChatbotReady, setIsChatbotReady] = useState(false);

  useEffect(() => {
    if (document.getElementById("noupe-mentor-script")) {
      setIsChatbotReady(true);
      return;
    }

    const script = document.createElement("script");
    script.id = "noupe-mentor-script";
    script.src =
      "https://www.noupe.com/embed/019b189d5e9877e39f131321595af4711234.js";
    script.async = true;

    script.onload = () => {
      setIsChatbotReady(true);
      setTimeout(() => {
        const chatbotElement = document.querySelector('[data-noupe-chat]');
        if (chatbotElement) {
          chatbotElement.style.boxShadow = '0 10px 40px rgba(0, 0, 0, 0.2)';
          chatbotElement.style.borderRadius = '16px';
          chatbotElement.style.overflow = 'hidden';
        }
      }, 1000);
    };

    document.body.appendChild(script);

    return () => {
      script.remove();
    };
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        position: "relative",
        overflow: "hidden"
      }}
    >
      
      {}
      <div style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: "none",
        overflow: "hidden"
      }}>
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              background: `radial-gradient(circle at center, 
                rgba(37, 99, 235, ${0.02 + Math.random() * 0.02}) 0%,
                transparent 70%
              )`,
              borderRadius: "50%",
              width: `${Math.random() * 400 + 200}px`,
              height: `${Math.random() * 400 + 200}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `float ${Math.random() * 20 + 20}s infinite ease-in-out`,
              filter: "blur(50px)"
            }}
          />
        ))}
      </div>

      {}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "60px 20px",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column"
        }}
      >
        
        {}
        <header style={{
          textAlign: "center",
          marginBottom: "80px"
        }}>
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "20px",
            marginBottom: "30px",
            padding: "25px 40px",
            background: "rgba(255, 255, 255, 0.03)",
            backdropFilter: "blur(20px)",
            borderRadius: "24px",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            boxShadow: "0 20px 40px rgba(0, 0, 0, 0.2)",
            maxWidth: "100%",
            flexWrap: "wrap"
          }}>
            <div style={{
              width: "70px",
              height: "70px",
              background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
              borderRadius: "18px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "32px",
              color: "white",
              boxShadow: "0 10px 30px rgba(37, 99, 235, 0.4)",
              flexShrink: 0
            }}>
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M22 21V19C21.9993 17.475 21.4467 15.9967 20.433 14.8288C19.4192 13.6609 18.0057 12.8798 16.443 12.625" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 21V19C2 17.475 2.55268 15.9967 3.56644 14.8288C4.58021 13.6609 5.99368 12.8798 7.55641 12.625" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div style={{
              textAlign: "left",
              maxWidth: "800px"
            }}>
              <h1 style={{
                fontSize: "3.5rem",
                fontWeight: 800,
                margin: 0,
                background: "linear-gradient(135deg, #f8fafc 0%, #cbd5e1 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                letterSpacing: "-0.02em",
                lineHeight: 1.1
              }}>
                AI Career Mentor
              </h1>
              <p style={{
                margin: "15px 0 0 0",
                color: "#94a3b8",
                fontSize: "1.3rem",
                fontWeight: 500,
                lineHeight: 1.6
              }}>
                AI-powered career intelligence for strategic professional development
              </p>
            </div>
          </div>
        </header>

        {}
        <main style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: "60px",
          maxWidth: "1000px",
          margin: "0 auto",
          width: "100%"
        }}>
          
          {}
          <section style={{
            background: "linear-gradient(135deg, rgba(37, 99, 235, 0.08), rgba(37, 99, 235, 0.04))",
            backdropFilter: "blur(20px)",
            borderRadius: "24px",
            border: "2px dashed rgba(37, 99, 235, 0.3)",
            padding: "50px 40px",
            textAlign: "center",
            position: "relative",
            overflow: "hidden"
          }}>
            {}
            <div style={{
              position: "absolute",
              top: "-50px",
              left: "-50px",
              width: "200px",
              height: "200px",
              background: "radial-gradient(circle, rgba(37, 99, 235, 0.1) 0%, transparent 70%)",
              filter: "blur(40px)",
              zIndex: 0
            }} />
            
            <div style={{
              position: "absolute",
              bottom: "-50px",
              right: "-50px",
              width: "200px",
              height: "200px",
              background: "radial-gradient(circle, rgba(16, 185, 129, 0.1) 0%, transparent 70%)",
              filter: "blur(40px)",
              zIndex: 0
            }} />
            
            <div style={{ position: "relative", zIndex: 1 }}>
              <div style={{
                width: "80px",
                height: "80px",
                background: "linear-gradient(135deg, #10b981, #34d399)",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 30px",
                fontSize: "36px",
                boxShadow: "0 15px 35px rgba(16, 185, 129, 0.4)"
              }}>
                🎯
              </div>
              
              <h2 style={{
                fontSize: "2.8rem",
                fontWeight: 800,
                color: "#f8fafc",
                marginBottom: "20px",
                lineHeight: 1.2
              }}>
                Try Our AI Career Mentor
              </h2>
              
              <div style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "10px",
                padding: "15px 30px",
                background: "linear-gradient(135deg, rgba(37, 99, 235, 0.2), rgba(37, 99, 235, 0.3))",
                borderRadius: "50px",
                border: "2px solid rgba(37, 99, 235, 0.4)",
                marginBottom: "30px",
                backdropFilter: "blur(10px)",
                flexWrap: "wrap",
                justifyContent: "center"
              }}>
                <span style={{
                  color: "#f8fafc",
                  fontSize: "1.2rem",
                  fontWeight: 600,
                  textAlign: "center"
                }}>
                  🆓 Completely Free • 24/7 Available
                </span>
              </div>
              
              <p style={{
                color: "#cbd5e1",
                fontSize: "1.2rem",
                lineHeight: 1.7,
                maxWidth: "700px",
                margin: "0 auto 40px",
                fontWeight: 500
              }}>
                Click the chat icon in the bottom right corner to start your FREE conversation with our AI Career Mentor. 
                Get instant advice on resumes, interviews, career paths, and more!
              </p>
              
              {}
              <div style={{
                display: "flex",
                justifyContent: "center",
                gap: "40px",
                marginTop: "40px",
                flexWrap: "wrap"
              }}>
                {[
                  { number: "100+", label: "Career Questions Answered", color: "#3b82f6" },
                  { number: "24/7", label: "Always Available", color: "#10b981" },
                  { number: "100%", label: "Free Forever", color: "#f59e0b" }
                ].map((stat, index) => (
                  <div
                    key={index}
                    style={{
                      textAlign: "center",
                      padding: "20px",
                      background: "rgba(255, 255, 255, 0.03)",
                      borderRadius: "16px",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      minWidth: "180px",
                      flex: "1",
                      minWidth: "200px",
                      maxWidth: "250px"
                    }}
                  >
                    <div style={{
                      fontSize: "2.2rem",
                      fontWeight: 800,
                      color: stat.color,
                      marginBottom: "10px"
                    }}>
                      {stat.number}
                    </div>
                    <div style={{
                      color: "#94a3b8",
                      fontSize: "14px",
                      fontWeight: 500
                    }}>
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {}
          <section>
            <h2 style={{
              fontSize: "2.2rem",
              fontWeight: 700,
              color: "#f8fafc",
              textAlign: "center",
              marginBottom: "40px"
            }}>
              What Our AI Mentor Can Help You With
            </h2>
            
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "25px"
            }}>
              {[
                {
                  title: "Career Path Planning",
                  description: "Get personalized roadmaps based on your experience, goals, and industry trends.",
                  icon: "🎯",
                  color: "#3b82f6"
                },
                {
                  title: "Resume Optimization",
                  description: "AI-powered analysis and suggestions to make your resume ATS-friendly and impactful.",
                  icon: "📄",
                  color: "#10b981"
                },
                {
                  title: "Interview Preparation",
                  description: "Leverage our AI Career Mentor to prepare for your target roles and companies.",
                  icon: "💼",
                  color: "#8b5cf6"
                },
                {
                  title: "Skill Gap Analysis",
                  description: "Identify missing skills and receive learning recommendations to stay competitive.",
                  icon: "📊",
                  color: "#f59e0b"
                },
                {
  "title": "Career & Income Growth",
  "description": "Strategies and insights to advance your career, and grow your income through skill development and smart positioning.",
  "icon": "📈",
  "color": "#ec4899",

},
                {
                  title: "Industry Insights",
                  description: "Real-time market analysis and trend forecasting for your specific field.",
                  icon: "🚀",
                  color: "#06b6d4"
                }
              ].map((feature, index) => (
                <div
                  key={index}
                  style={{
                    background: "rgba(255, 255, 255, 0.03)",
                    backdropFilter: "blur(20px)",
                    borderRadius: "20px",
                    padding: "30px",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    transition: "all 0.3s ease",
                    cursor: "pointer",
                    height: "100%"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-8px)";
                    e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
                    e.currentTarget.style.boxShadow = `0 20px 40px rgba(0, 0, 0, 0.2), 0 0 0 1px ${feature.color}20`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.background = "rgba(255, 255, 255, 0.03)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <div style={{
                    width: "60px",
                    height: "60px",
                    background: `linear-gradient(135deg, ${feature.color}, ${feature.color}99)`,
                    borderRadius: "16px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "28px",
                    marginBottom: "25px"
                  }}>
                    {feature.icon}
                  </div>
                  
                  <h3 style={{
                    margin: "0 0 15px 0",
                    color: "#f8fafc",
                    fontSize: "20px",
                    fontWeight: 700,
                    lineHeight: 1.3
                  }}>
                    {feature.title}
                  </h3>
                  
                  <p style={{
                    margin: 0,
                    color: "#94a3b8",
                    fontSize: "15px",
                    lineHeight: 1.6
                  }}>
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {}
          <section style={{
            textAlign: "center",
            padding: "40px",
            background: "rgba(255, 255, 255, 0.02)",
            backdropFilter: "blur(10px)",
            borderRadius: "20px",
            border: "1px solid rgba(255, 255, 255, 0.05)"
          }}>
            <h3 style={{
              fontSize: "1.8rem",
              fontWeight: 600,
              color: "#f8fafc",
              marginBottom: "20px"
            }}>
              Ready to Transform Your Career?
            </h3>
            
            <p style={{
              color: "#94a3b8",
              fontSize: "16px",
              lineHeight: 1.6,
              maxWidth: "700px",
              margin: "0 auto 25px"
            }}>
              Click the AI Career Mentor button in the bottom right corner to start your FREE conversation. 
              Start chatting instantly!
            </p>
            
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
              color: "#10b981",
              fontWeight: 500,
              fontSize: "15px"
            }}>
              <div style={{
                width: "10px",
                height: "10px",
                background: "#10b981",
                borderRadius: "50%",
                animation: "pulse 2s infinite"
              }} />
              <span>AI Career Mentor is ready and waiting</span>
            </div>
          </section>
        </main>

        {}
        <footer style={{
          marginTop: "80px",
          padding: "40px 0",
          borderTop: "1px solid rgba(255, 255, 255, 0.1)",
          textAlign: "center"
        }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "15px",
            marginBottom: "25px",
            flexWrap: "wrap"
          }}>
            <div style={{
              width: "40px",
              height: "40px",
              background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "20px",
              flexShrink: 0
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 17L12 22L22 17" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 12L12 17L22 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h4 style={{
              color: "#f8fafc",
              fontSize: "18px",
              fontWeight: 600,
              margin: 0
            }}>
              FirstHire 
            </h4>
          </div>
          
          <p style={{
            color: "#64748b",
            fontSize: "14px",
            maxWidth: "600px",
            margin: "0 auto",
            lineHeight: 1.6
          }}>
            Career development powered by advanced AI. 
            All conversations are encrypted, secure, and confidential. 
            Our AI mentor continuously learns from industry patterns to provide up-to-date guidance.
          </p>
        </footer>
      </div>

      {}
      <div style={{
        position: "fixed",
        bottom: "30px",
        right: "30px",
        zIndex: 1000,
        width: "400px",
        height: "600px"
      }} id="noupe-chat-container" />

      {}
      <style jsx="true">{`
        @keyframes float {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          33% { transform: translate(15px, -10px) rotate(2deg); }
          66% { transform: translate(-10px, 8px) rotate(-2deg); }
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.05); }
        }
        
        /* Style the Noupe chatbot iframe */
        [data-noupe-chat] {
          border-radius: 16px !important;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3) !important;
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
          overflow: hidden !important;
        }
        
        /* Responsive design */
        @media (max-width: 1920px) {
          header > div {
            padding: 20px 30px !important;
          }
          
          h1 {
            font-size: 3.2rem !important;
          }
          
          h2 {
            font-size: 2.6rem !important;
          }
        }
        
        @media (max-width: 1440px) {
          main {
            max-width: 900px !important;
          }
          
          h1 {
            font-size: 2.8rem !important;
          }
          
          h2 {
            font-size: 2.4rem !important;
          }
          
          .hero-subtitle {
            font-size: 1.2rem !important;
          }
        }
        
        @media (max-width: 1200px) {
          .container {
            padding: 50px 20px !important;
          }
          
          header {
            margin-bottom: 60px !important;
          }
          
          h1 {
            font-size: 2.5rem !important;
          }
          
          h2 {
            font-size: 2.2rem !important;
          }
          
          .try-here-section {
            padding: 40px 30px !important;
          }
        }
        
        @media (max-width: 1024px) {
          h1 {
            font-size: 2.2rem !important;
          }
          
          h2 {
            font-size: 2rem !important;
          }
          
          .hero-subtitle {
            font-size: 1.1rem !important;
          }
          
          .features-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          
          #noupe-chat-container {
            width: 350px !important;
            height: 550px !important;
          }
        }
        
        @media (max-width: 900px) {
          header > div {
            flex-direction: column !important;
            text-align: center !important;
            gap: 15px !important;
            padding: 20px !important;
          }
          
          header > div > div {
            text-align: center !important;
          }
          
          h1 {
            font-size: 2.5rem !important;
          }
          
          .try-here-title {
            font-size: 2.2rem !important;
          }
          
          .free-badge span {
            font-size: 1rem !important;
          }
        }
        
        @media (max-width: 768px) {
          .container {
            padding: 40px 15px !important;
          }
          
          header {
            margin-bottom: 50px !important;
          }
          
          h1 {
            font-size: 2rem !important;
          }
          
          h2 {
            font-size: 1.8rem !important;
          }
          
          .hero-subtitle {
            font-size: 1rem !important;
          }
          
          .features-grid {
            grid-template-columns: 1fr !important;
          }
          
          .try-here-section {
            padding: 30px 20px !important;
          }
          
          .try-here-title {
            font-size: 1.8rem !important;
          }
          
          .free-badge {
            padding: 12px 20px !important;
          }
          
          .free-badge span {
            font-size: 0.9rem !important;
          }
          
          .stats-container > div {
            min-width: 150px !important;
            padding: 15px !important;
          }
          
          .stats-container > div > div:first-child {
            font-size: 1.8rem !important;
          }
          
          #noupe-chat-container {
            width: 90% !important;
            right: 5% !important;
            bottom: 20px !important;
            height: 500px !important;
            left: 5% !important;
          }
          
          main {
            gap: 40px !important;
          }
        }
        
        @media (max-width: 640px) {
          h1 {
            font-size: 1.8rem !important;
          }
          
          h2 {
            font-size: 1.6rem !important;
          }
          
          .section-title {
            font-size: 1.6rem !important;
            margin-bottom: 30px !important;
          }
          
          .try-here-section {
            padding: 25px 15px !important;
          }
          
          .try-here-title {
            font-size: 1.6rem !important;
            margin-bottom: 15px !important;
          }
          
          .try-here-description {
            font-size: 1rem !important;
            margin-bottom: 30px !important;
          }
          
          .stats-container {
            flex-direction: column !important;
            align-items: center !important;
            gap: 20px !important;
          }
          
          .stats-container > div {
            width: 100% !important;
            max-width: 250px !important;
          }
          
          .ready-section {
            padding: 30px 15px !important;
          }
          
          .ready-section h3 {
            font-size: 1.5rem !important;
          }
          
          .ready-section p {
            font-size: 0.95rem !important;
          }
          
          #noupe-chat-container {
            height: 450px !important;
          }
        }
        
        @media (max-width: 480px) {
          .container {
            padding: 30px 10px !important;
          }
          
          header {
            margin-bottom: 40px !important;
          }
          
          h1 {
            font-size: 1.6rem !important;
          }
          
          h2 {
            font-size: 1.4rem !important;
          }
          
          .hero-subtitle {
            font-size: 0.9rem !important;
          }
          
          .section-title,
          .try-here-title {
            font-size: 1.4rem !important;
          }
          
          .try-here-section {
            padding: 20px 10px !important;
            border-width: 1px !important;
          }
          
          .free-badge {
            padding: 10px 15px !important;
            border-radius: 40px !important;
          }
          
          .free-badge span {
            font-size: 0.8rem !important;
          }
          
          .try-here-description {
            font-size: 0.9rem !important;
          }
          
          .feature-card {
            padding: 20px !important;
          }
          
          .feature-card h3 {
            font-size: 18px !important;
          }
          
          .feature-card p {
            font-size: 14px !important;
          }
          
          .ready-section {
            padding: 20px 10px !important;
          }
          
          .ready-section h3 {
            font-size: 1.3rem !important;
          }
          
          .ready-section p {
            font-size: 0.9rem !important;
          }
          
          #noupe-chat-container {
            height: 400px !important;
            bottom: 10px !important;
          }
          
          footer {
            margin-top: 60px !important;
            padding: 30px 0 !important;
          }
          
          footer p {
            font-size: 13px !important;
            padding: 0 10px !important;
          }
        }
        
        @media (max-width: 360px) {
          h1 {
            font-size: 1.4rem !important;
          }
          
          h2, .section-title {
            font-size: 1.3rem !important;
          }
          
          .hero-subtitle {
            font-size: 0.85rem !important;
          }
          
          .try-here-icon {
            width: 60px !important;
            height: 60px !important;
            font-size: 28px !important;
          }
          
          .feature-icon {
            width: 50px !important;
            height: 50px !important;
            font-size: 24px !important;
            margin-bottom: 15px !important;
          }
          
          .feature-card {
            padding: 15px !important;
          }
          
          #noupe-chat-container {
            height: 380px !important;
          }
        }
        
        @media (max-width: 320px) {
          .container {
            padding: 20px 8px !important;
          }
          
          h1 {
            font-size: 1.3rem !important;
          }
          
          h2 {
            font-size: 1.2rem !important;
          }
          
          .free-badge span {
            font-size: 0.75rem !important;
          }
          
          #noupe-chat-container {
            height: 350px !important;
          }
        }
        
        /* Landscape mode optimization */
        @media (max-height: 700px) and (orientation: landscape) {
          #noupe-chat-container {
            height: 400px !important;
            bottom: 10px !important;
          }
          
          .container {
            padding: 30px 20px !important;
          }
          
          header {
            margin-bottom: 40px !important;
          }
        }
      `}</style>
    </div>
  );
}