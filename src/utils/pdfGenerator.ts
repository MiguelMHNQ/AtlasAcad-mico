import jsPDF from 'jspdf';
import { getSupabaseData } from '@/lib/supabase';

const getUserData = async () => {
  try {
    const [experience, education, projects, languages, certificates, publications] = await Promise.all([
      getSupabaseData('experiences'),
      getSupabaseData('education'),
      getSupabaseData('projects'),
      getSupabaseData('languages'),
      getSupabaseData('certificates'),
      getSupabaseData('publications')
    ]);
    
    return {
      experience,
      education,
      projects,
      languages,
      certificates,
      publications
    };
  } catch (error) {
    console.error('Error fetching user data:', error);
    return {
      experience: [],
      education: [],
      projects: [],
      languages: [],
      certificates: [],
      publications: []
    };
  }
};

export const generateCurriculumPDF = async (profile: any) => {
  if (!profile) return;
  
  const userData = await getUserData();
  const pdf = new jsPDF();
  let yPosition = 25;
  
  // Gray and white colors
  const primaryColor = [108, 117, 125]; // Medium gray
  const darkGray = [52, 58, 64];
  const lightGray = [108, 117, 125];
  const noDataColor = [220, 53, 69]; // Red for no data
  
  // === HEADER SECTION ===
  pdf.setFillColor(248, 249, 250); // Light gray background
  pdf.rect(0, 0, 210, 35, 'F');
  
  // Name
  pdf.setTextColor(33, 37, 41); // Dark text on light background
  pdf.setFontSize(22);
  pdf.setFont('helvetica', 'bold');
  pdf.text(profile.nome.toUpperCase(), 20, 25);
  
  yPosition = 45;
  
  // === PERSONAL INFO SECTION ===
  pdf.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'normal');
  
  if (profile.bio) {
    const bioLines = pdf.splitTextToSize(profile.bio, 170);
    pdf.text(bioLines, 20, yPosition);
    yPosition += bioLines.length * 5 + 15;
  }
  
  // === COMPETÊNCIAS ===
  yPosition = addOfficialSection(pdf, 'COMPETÊNCIAS', yPosition, primaryColor);
  
  if (profile.badges && profile.badges.length > 0) {
    let badgeText = '';
    profile.badges.forEach((badge: string, index: number) => {
      badgeText += `• ${badge}`;
      if (index < profile.badges.length - 1) badgeText += '   ';
    });
    
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
    const badgeLines = pdf.splitTextToSize(badgeText, 170);
    pdf.text(badgeLines, 25, yPosition);
    yPosition += badgeLines.length * 5 + 15;
  } else {
    yPosition = addNoDataMessage(pdf, yPosition, noDataColor);
  }
  
  // === EXPERIÊNCIA PROFISSIONAL ===
  yPosition = addOfficialSection(pdf, 'EXPERIÊNCIA PROFISSIONAL', yPosition, primaryColor);
  
  if (userData.experience.length > 0) {
    userData.experience.forEach((exp: any) => {
      // Position title
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
      pdf.text(exp.cargo, 25, yPosition);
      
      // Company and period
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      pdf.text(exp.empresa, 25, yPosition + 6);
      
      if (exp.periodo) {
        pdf.setFont('helvetica', 'italic');
        pdf.setTextColor(lightGray[0], lightGray[1], lightGray[2]);
        pdf.text(exp.periodo, 140, yPosition + 6);
      }
      
      yPosition += 12;
      
      if (exp.descricao) {
        pdf.setFontSize(9);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
        const descLines = pdf.splitTextToSize(exp.descricao, 165);
        pdf.text(descLines, 25, yPosition);
        yPosition += descLines.length * 4 + 8;
      }
      
      yPosition += 5;
    });
  } else {
    yPosition = addNoDataMessage(pdf, yPosition, noDataColor);
  }
  
  // === FORMAÇÃO ACADÊMICA ===
  yPosition = addOfficialSection(pdf, 'FORMAÇÃO ACADÊMICA', yPosition, primaryColor);
  
  if (userData.education.length > 0) {
    userData.education.forEach((edu: any) => {
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
      pdf.text(edu.curso, 25, yPosition);
      
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      pdf.text(edu.instituicao, 25, yPosition + 6);
      
      if (edu.periodo) {
        pdf.setFont('helvetica', 'italic');
        pdf.setTextColor(lightGray[0], lightGray[1], lightGray[2]);
        pdf.text(edu.periodo, 140, yPosition + 6);
      }
      
      if (edu.grau) {
        pdf.setFontSize(9);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
        pdf.text(`Grau: ${edu.grau}`, 25, yPosition + 12);
        yPosition += 6;
      }
      
      yPosition += 20;
    });
  } else {
    yPosition = addNoDataMessage(pdf, yPosition, noDataColor);
  }
  
  // === PROJETOS ===
  yPosition = addOfficialSection(pdf, 'PROJETOS', yPosition, primaryColor);
  
  if (userData.projects.length > 0) {
    userData.projects.forEach((proj: any) => {
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
      pdf.text(proj.titulo || proj.nome, 25, yPosition);
      
      if (proj.status) {
        pdf.setFontSize(9);
        pdf.setFont('helvetica', 'italic');
        pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        pdf.text(`[${proj.status}]`, 140, yPosition);
      }
      
      yPosition += 8;
      
      if (proj.descricao) {
        pdf.setFontSize(9);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
        const descLines = pdf.splitTextToSize(proj.descricao, 165);
        pdf.text(descLines, 25, yPosition);
        yPosition += descLines.length * 4 + 3;
      }
      
      if (proj.tecnologias) {
        pdf.setFontSize(8);
        pdf.setFont('helvetica', 'italic');
        pdf.setTextColor(lightGray[0], lightGray[1], lightGray[2]);
        pdf.text(`Tecnologias: ${proj.tecnologias}`, 25, yPosition);
        yPosition += 5;
      }
      
      yPosition += 8;
    });
  } else {
    yPosition = addNoDataMessage(pdf, yPosition, noDataColor);
  }
  
  // Check if we need a new page
  if (yPosition > 250) {
    pdf.addPage();
    yPosition = 20;
  }
  
  // === TWO COLUMN LAYOUT ===
  const leftColumnX = 20;
  const rightColumnX = 110;
  let leftColumnY = yPosition;
  let rightColumnY = yPosition;
  
  // === IDIOMAS (Left Column) ===
  leftColumnY = addOfficialSectionTwoColumn(pdf, 'IDIOMAS', leftColumnY, leftColumnX, primaryColor);
  
  if (userData.languages.length > 0) {
    userData.languages.forEach((lang: any) => {
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
      pdf.text(`• ${lang.idioma}`, leftColumnX + 5, leftColumnY);
      
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      pdf.text(lang.nivel, leftColumnX + 60, leftColumnY);
      
      leftColumnY += 8;
    });
  } else {
    leftColumnY = addNoDataMessageTwoColumn(pdf, leftColumnY, leftColumnX, noDataColor);
  }
  
  // === CERTIFICADOS (Right Column) ===
  rightColumnY = addOfficialSectionTwoColumn(pdf, 'CERTIFICADOS', rightColumnY, rightColumnX, primaryColor);
  
  if (userData.certificates.length > 0) {
    userData.certificates.forEach((cert: any) => {
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
      const certLines = pdf.splitTextToSize(cert.titulo || cert.nome, 80);
      pdf.text(certLines, rightColumnX + 5, rightColumnY);
      rightColumnY += certLines.length * 4;
      
      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(lightGray[0], lightGray[1], lightGray[2]);
      pdf.text(cert.instituicao || cert.emissor, rightColumnX + 5, rightColumnY);
      
      rightColumnY += 12;
    });
  } else {
    rightColumnY = addNoDataMessageTwoColumn(pdf, rightColumnY, rightColumnX, noDataColor);
  }
  
  // === PUBLICAÇÕES ===
  yPosition = Math.max(leftColumnY, rightColumnY) + 15;
  yPosition = addOfficialSection(pdf, 'PUBLICAÇÕES', yPosition, primaryColor);
  
  if (userData.publications.length > 0) {
    userData.publications.forEach((pub: any) => {
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
      const titleLines = pdf.splitTextToSize(pub.titulo, 170);
      pdf.text(titleLines, 25, yPosition);
      yPosition += titleLines.length * 4 + 3;
      
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      pdf.text(pub.autores, 25, yPosition);
      yPosition += 5;
      
      if (pub.revista) {
        pdf.setFont('helvetica', 'italic');
        pdf.setTextColor(lightGray[0], lightGray[1], lightGray[2]);
        pdf.text(pub.revista, 25, yPosition);
        yPosition += 5;
      }
      
      yPosition += 8;
    });
  } else {
    yPosition = addNoDataMessage(pdf, yPosition, noDataColor);
  }
  
  // === FOOTER ===
  pdf.setFontSize(8);
  pdf.setFont('helvetica', 'italic');
  pdf.setTextColor(lightGray[0], lightGray[1], lightGray[2]);
  pdf.text('Currículo gerado pelo Atlas Acadêmico', 20, 285);
  pdf.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')}`, 140, 285);
  
  const fileName = profile.nome ? `${profile.nome.replace(/\s+/g, '_')}_Curriculo_Oficial.pdf` : 'Curriculo_Oficial.pdf';
  
  // Forçar download do PDF
  try {
    pdf.save(fileName);
  } catch (error) {
    // Fallback: abrir em nova aba se save() falhar
    const pdfBlob = pdf.output('blob');
    const url = URL.createObjectURL(pdfBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
};

// Helper functions
function addOfficialSection(pdf: jsPDF, title: string, yPosition: number, primaryColor: number[]) {
  yPosition += 15;
  
  // Section background
  pdf.setFillColor(248, 249, 250);
  pdf.rect(15, yPosition - 8, 180, 12, 'F');
  
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  pdf.text(title, 20, yPosition);
  
  // Professional line
  pdf.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  pdf.setLineWidth(0.5);
  pdf.line(20, yPosition + 2, 190, yPosition + 2);
  
  return yPosition + 12;
}

function addOfficialSectionTwoColumn(pdf: jsPDF, title: string, yPosition: number, xPosition: number, primaryColor: number[]) {
  yPosition += 15;
  
  // Section background
  pdf.setFillColor(248, 249, 250);
  pdf.rect(xPosition - 5, yPosition - 8, 85, 12, 'F');
  
  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  pdf.text(title, xPosition, yPosition);
  
  // Professional line
  pdf.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  pdf.setLineWidth(0.5);
  pdf.line(xPosition, yPosition + 2, xPosition + 80, yPosition + 2);
  
  return yPosition + 12;
}

function addNoDataMessage(pdf: jsPDF, yPosition: number, noDataColor: number[]) {
  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'italic');
  pdf.setTextColor(noDataColor[0], noDataColor[1], noDataColor[2]);
  pdf.text('Não há informações cadastradas', 25, yPosition);
  return yPosition + 15;
}

function addNoDataMessageTwoColumn(pdf: jsPDF, yPosition: number, xPosition: number, noDataColor: number[]) {
  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'italic');
  pdf.setTextColor(noDataColor[0], noDataColor[1], noDataColor[2]);
  pdf.text('Não há informações cadastradas', xPosition + 5, yPosition);
  return yPosition + 15;
}