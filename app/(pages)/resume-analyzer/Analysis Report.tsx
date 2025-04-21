// components/AnalysisReport.tsx
"use client";

import React from "react";
import '@/styles/AnalysisReport.css';

interface AnalysisReportProps {
  text: string;
}

const AnalysisReport: React.FC<AnalysisReportProps> = ({ text }) => {
  // Basic metrics
  const wordCount = text.split(/\s+/).filter(word => word.length > 0).length;
  const charCount = text.length;
  const lineCount = text.split('\n').length;
  
  // Section detection
  const sections = {
    contact: /(email|phone|contact|address)/i.test(text),
    summary: /(summary|profile|objective)/i.test(text),
    education: /(education|academic|degree|school|university)/i.test(text),
    experience: /(experience|work|employment|job|career)/i.test(text),
    skills: /(skills|technical|competencies|programming)/i.test(text),
    projects: /(projects|portfolio)/i.test(text),
    certifications: /(certifications|certificate)/i.test(text)
  };
  
  // Skills detection
  const technicalSkills = [
    "JavaScript", "React", "Node.js", "Python", "Java", "C\\+\\+", "C#", 
    "SQL", "Git", "AWS", "Azure", "HTML", "CSS", "TypeScript", "Docker",
    "Kubernetes", "Machine Learning", "Data Analysis", "REST API", "GraphQL"
  ];
  
  const softSkills = [
    "Leadership", "Communication", "Teamwork", "Problem Solving", 
    "Time Management", "Adaptability", "Creativity", "Critical Thinking"
  ];
  
  const detectedTechSkills = technicalSkills.filter(skill => 
    new RegExp(`\\b${skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, "i").test(text)
  );
  
  const detectedSoftSkills = softSkills.filter(skill => 
    new RegExp(`\\b${skill}\\b`, "i").test(text)
  );
  
  // Keyword analysis
  const actionVerbs = [
    "developed", "implemented", "designed", "created", "built", 
    "led", "managed", "improved", "increased", "reduced"
  ];
  
  const detectedActionVerbs = actionVerbs.filter(verb => 
    new RegExp(`\\b${verb}(ed|ing)?\\b`, "i").test(text)
  );
  
  const metricsCount = (text.match(/\d+%/g)?.length || 0);

  // Calculate score
  const calculateScore = () => {
    const sectionScore = Object.values(sections).filter(Boolean).length * 5;
    const techSkillsScore = Math.min(detectedTechSkills.length * 3, 20);
    const softSkillsScore = Math.min(detectedSoftSkills.length * 2, 10);
    const actionVerbsScore = Math.min(detectedActionVerbs.length * 2, 10);
    const metricsScore = Math.min(metricsCount * 5, 15);
    const lengthScore = wordCount > 300 && wordCount < 700 ? 10 : 5;
    
    return Math.min(100, sectionScore + techSkillsScore + softSkillsScore + actionVerbsScore + metricsScore + lengthScore);
  };

  const getRandomTip = () => {
    const tips = [
      "Use a professional email address (not nickname@email.com).",
      "Include links to your portfolio, GitHub, or LinkedIn profile.",
      "List your most recent experience first (reverse chronological order).",
      "Focus on achievements rather than just responsibilities.",
      "Use consistent formatting (same font, bullet style, etc.).",
      "Proofread carefully for spelling and grammar errors.",
      "Save your resume as a PDF to preserve formatting.",
      "Keep your resume to 1-2 pages maximum.",
      "Use keywords from the job description to pass ATS systems.",
      "Include only relevant experience (last 10-15 years)."
    ];
    return tips[Math.floor(Math.random() * tips.length)];
  };

  return (
    <div className="analysis-report">
      <h2 className="report-title">📄 COMPREHENSIVE RESUME ANALYSIS REPORT</h2>
      <div className="report-divider"></div>
      
      <h3 className="section-title">📊 BASIC METRICS:</h3>
      <ul className="metrics-list">
        <li>Word Count: <strong>{wordCount} words</strong></li>
        <li>Character Count: <strong>{charCount} characters</strong></li>
        <li>Lines: <strong>{lineCount}</strong></li>
      </ul>
      
      <h3 className="section-title">📑 SECTIONS DETECTED:</h3>
      <ul className="sections-list">
        <li className={sections.contact ? "present" : "missing"}>
          {sections.contact ? "✓" : "⚠"} Contact Information
        </li>
        <li className={sections.summary ? "present" : "missing"}>
          {sections.summary ? "✓" : "⚠"} Summary/Objective
        </li>
        <li className={sections.education ? "present" : "missing"}>
          {sections.education ? "✓" : "⚠"} Education
        </li>
        <li className={sections.experience ? "present" : "missing"}>
          {sections.experience ? "✓" : "⚠"} Work Experience
        </li>
        <li className={sections.skills ? "present" : "missing"}>
          {sections.skills ? "✓" : "⚠"} Skills Section
        </li>
        <li className={sections.projects ? "present" : "missing"}>
          {sections.projects ? "✓" : "⚠"} Projects
        </li>
        <li className={sections.certifications ? "present" : "missing"}>
          {sections.certifications ? "✓" : "⚠"} Certifications
        </li>
      </ul>
      
      <h3 className="section-title">💻 TECHNICAL SKILLS FOUND ({detectedTechSkills.length}):</h3>
      {detectedTechSkills.length > 0 ? (
        <ul className="skills-list">
          {detectedTechSkills.map((skill, index) => (
            <li key={index}>• {skill.replace(/\\/g, '')}</li>
          ))}
        </ul>
      ) : (
        <p className="missing">No technical skills detected. Consider adding relevant skills.</p>
      )}
      
      <h3 className="section-title">🤝 SOFT SKILLS FOUND ({detectedSoftSkills.length}):</h3>
      {detectedSoftSkills.length > 0 ? (
        <ul className="skills-list">
          {detectedSoftSkills.map((skill, index) => (
            <li key={index}>• {skill}</li>
          ))}
        </ul>
      ) : (
        <p className="missing">No soft skills detected. Consider adding relevant skills.</p>
      )}
      
      <h3 className="section-title">⚡ ACTION VERBS FOUND ({detectedActionVerbs.length}):</h3>
      {detectedActionVerbs.length > 0 ? (
        <ul className="skills-list">
          {detectedActionVerbs.map((verb, index) => (
            <li key={index}>• {verb}</li>
          ))}
        </ul>
      ) : (
        <p className="missing">Few action verbs detected. Consider using more to strengthen your resume.</p>
      )}
      
      <h3 className="section-title">📈 QUANTIFIED ACHIEVEMENTS:</h3>
      <p className={metricsCount > 0 ? "present" : "missing"}>
        {metricsCount > 0 
          ? `Found ${metricsCount} quantified metrics (good!)` 
          : `No quantified achievements found. Add metrics like "Increased X by 30%".`}
      </p>
      
      <h3 className="section-title">🔍 RECOMMENDATIONS:</h3>
      <ul className="recommendations-list">
        {wordCount < 200 ? (
          <li className="missing">1. Your resume is very short ({wordCount} words). Consider adding more details about your experience and skills.</li>
        ) : wordCount > 800 ? (
          <li className="missing">1. Your resume is quite long ({wordCount} words). Consider making it more concise.</li>
        ) : (
          <li className="present">1. Your resume length is good ({wordCount} words).</li>
        )}
        
        {Object.values(sections).filter(present => !present).length > 0 ? (
          <li className="missing">2. Consider adding these missing sections: {Object.entries(sections)
            .filter(([_, present]) => !present)
            .map(([section]) => section)
            .join(', ')}
          </li>
        ) : (
          <li className="present">2. All key sections are present (good structure).</li>
        )}
        
        {detectedTechSkills.length < 5 ? (
          <li className="missing">3. You have only {detectedTechSkills.length} technical skills listed. Consider adding more relevant skills.</li>
        ) : (
          <li className="present">3. Good variety of technical skills ({detectedTechSkills.length} detected).</li>
        )}
        
        {detectedSoftSkills.length < 3 ? (
          <li className="missing">4. Only {detectedSoftSkills.length} soft skills detected. Consider adding more.</li>
        ) : (
          <li className="present">4. Good soft skills coverage ({detectedSoftSkills.length} detected).</li>
        )}
        
        {detectedActionVerbs.length < 5 ? (
          <li className="missing">5. Use more action verbs to start your bullet points (only {detectedActionVerbs.length} found).</li>
        ) : (
          <li className="present">5. Good use of action verbs ({detectedActionVerbs.length} found).</li>
        )}
        
        {metricsCount < 2 ? (
          <li className="missing">6. Add more quantified achievements (only {metricsCount} found).</li>
        ) : (
          <li className="present">6. Good use of quantified achievements ({metricsCount} found).</li>
        )}
        
        <li>7. Use bullet points for better readability.</li>
        <li>8. Tailor your resume to each job application by including relevant keywords.</li>
      </ul>
      
      <div className="score-section">
        <h3 className="section-title">📊 OVERALL SCORE: {calculateScore()}/100</h3>
      </div>
      
      <div className="tip-section">
        <h3 className="section-title">💡 PROFESSIONAL TIP:</h3>
        <p className="tip-content">{getRandomTip()}</p>
      </div>
    </div>
  );
};

export default AnalysisReport;