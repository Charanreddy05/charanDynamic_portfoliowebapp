const strip = (url = "") => url.replace(/^https?:\/\//, "");

function classicTemplate(JsPDF, data) {
  const doc = new JsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const { profile, skills, experience, education, certificates, recognition } = data;

  const W = doc.internal.pageSize.getWidth();
  const H = doc.internal.pageSize.getHeight();
  const ML = 18, MR = 18, CW = W - ML - MR;
  let y = 22;

  const pb = (need = 20) => { if (y + need > H - 14) { doc.addPage(); y = 20; } };
  const st = (size, weight = "normal", r = 30, g = 41, b = 59) => {
    doc.setFont("helvetica", weight); doc.setFontSize(size); doc.setTextColor(r, g, b);
  };
  const hr = (color = [210, 210, 210], lw = 0.3) => {
    doc.setDrawColor(...color); doc.setLineWidth(lw); doc.line(ML, y, W - MR, y);
  };
  const heading = (title) => {
    pb(16); y += 4;
    st(8.5, "bold", 37, 99, 235);
    doc.text(title.toUpperCase(), ML, y); y += 2.5;
    hr([37, 99, 235], 0.5); y += 4;
  };

  st(22, "bold", 15, 23, 42);
  doc.text(profile.fullName || "Name", ML, y); y += 8;
  st(11.5, "normal", 71, 85, 105);
  doc.text(profile.designation || "", ML, y); y += 5.5;

  const links = [profile.github && `GitHub: ${strip(profile.github)}`, profile.linkedin && `LinkedIn: ${strip(profile.linkedin)}`].filter(Boolean);
  if (links.length) { st(8.5, "normal", 71, 85, 105); doc.text(links.join("     |     "), ML, y); y += 5; }
  y += 1; hr(); y += 5;

  if (profile.about) {
    heading("Professional Summary"); st(9.5, "normal", 51, 65, 85);
    const lines = doc.splitTextToSize(profile.about, CW);
    pb(lines.length * 4.6 + 4); doc.text(lines, ML, y); y += lines.length * 4.6 + 3;
  }

  if (skills.length) {
    heading("Technical Skills"); st(9.5, "normal", 51, 65, 85);
    const str = skills.map((s) => s.skillName || s.name).join("   •   ");
    const lines = doc.splitTextToSize(str, CW);
    pb(lines.length * 4.6 + 4); doc.text(lines, ML, y); y += lines.length * 4.8 + 3;
  }

  if (experience.length) {
    heading("Work Experience");
    experience.forEach((item, i) => {
      pb(28); st(10.5, "bold", 15, 23, 42);
      doc.text(item.companyName || "", ML, y);
      st(8.5, "normal", 100, 116, 139);
      doc.text(`${item.startDate || ""} – ${item.endDate || "Present"}`, W - MR, y, { align: "right" }); y += 4.5;
      st(9.5, "italic", 37, 99, 235);
      const role = item.location ? `${item.designation}     •     ${item.location}` : item.designation || "";
      doc.text(role, ML, y); y += 4.5;
      if (item.description) {
        st(9, "normal", 71, 85, 105);
        const dl = doc.splitTextToSize(item.description, CW - 4);
        pb(dl.length * 4.3 + 3); doc.text(dl, ML + 3, y); y += dl.length * 4.3 + 1;
      }
      if (i < experience.length - 1) y += 5;
    }); y += 2;
  }

  if (education.length) {
    heading("Education");
    education.forEach((item, i) => {
      pb(22); st(10.5, "bold", 15, 23, 42);
      doc.text(item.degree || "", ML, y);
      st(8.5, "normal", 100, 116, 139);
      doc.text(`${item.startYear || ""} – ${item.endYear || "Present"}`, W - MR, y, { align: "right" }); y += 4.5;
      st(9.5, "normal", 51, 65, 85);
      let line = item.instituteName || "";
      if (item.fieldOfStudy) line += `   |   ${item.fieldOfStudy}`;
      doc.text(line, ML, y); y += 4;
      if (item.percentage) { st(9, "normal", 100, 116, 139); doc.text(`Grade / Score:  ${item.percentage}`, ML, y); y += 4; }
      if (i < education.length - 1) y += 2;
    }); y += 2;
  }

  if (certificates.length) {
    heading("Certifications");
    certificates.forEach((item) => {
      pb(9); st(9.5, "normal", 51, 65, 85);
      let line = item.title || "";
      if (item.issuer) line += `   |   ${item.issuer}`;
      if (item.issueDate) line += `   (${item.issueDate})`;
      const lines = doc.splitTextToSize(`• ${line}`, CW - 3);
      pb(lines.length * 4.5 + 2); doc.text(lines, ML + 2, y); y += lines.length * 4.5 + 1.5;
    }); y += 2;
  }

  if (recognition.length) {
    heading("Recognition & Achievements");
    recognition.forEach((item) => {
      pb(14); st(9.5, "bold", 15, 23, 42);
      doc.text(`• ${item.title || ""}`, ML + 2, y); y += 4.5;
      if (item.description) {
        st(9, "normal", 100, 116, 139);
        const dl = doc.splitTextToSize(item.description, CW - 6);
        pb(dl.length * 4 + 3); doc.text(dl, ML + 5, y); y += dl.length * 4 + 1.5;
      }
      y += 1;
    });
  }

  const totalPages = typeof doc.getNumberOfPages === "function" ? doc.getNumberOfPages() : doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i); st(7.5, "normal", 160, 160, 160);
    doc.text(`${profile.fullName || "Resume"}   •   Page ${i} of ${totalPages}`, W / 2, H - 7, { align: "center" });
  }

  return doc;
}

function modernTemplate(JsPDF, data) {
  const doc = new JsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const { profile, skills, experience, education, certificates, recognition } = data;

  const W = doc.internal.pageSize.getWidth();
  const H = doc.internal.pageSize.getHeight();
  const LCOL = 18, LR = 14, LCW = 62;
  const RCOL = LCOL + LCW + LR, RCW = W - RCOL - 18;
  let y = 24;
  let ry = 24;

  const pb = (need = 20) => { if (ry + need > H - 14) { doc.addPage(); ry = 24; } };
  const st = (size, weight = "normal", r, g, b) => {
    doc.setFont("helvetica", weight); doc.setFontSize(size); doc.setTextColor(r || 255, g || 255, b || 255);
  };

  doc.setFillColor(30, 41, 59); doc.rect(0, 0, 90, H, "F");

  st(16, "bold"); doc.text(profile.fullName || "Name", LCOL, y); y += 7;
  st(9, "normal", 148, 163, 184); doc.text(profile.designation || "", LCOL, y); y += 6;

  st(7.5, "bold", 148, 163, 184); doc.text("CONTACT", LCOL, y); y += 4;
  st(8, "normal", 203, 213, 225); doc.text(profile.email || "", LCOL, y); y += 4.5;
  if (profile.mobile) { doc.text(profile.mobile, LCOL, y); y += 4.5; }
  if (profile.github) { doc.text(`github: ${strip(profile.github)}`, LCOL, y); y += 4.5; }
  if (profile.linkedin) { doc.text(`linkedin: ${strip(profile.linkedin)}`, LCOL, y); y += 4.5; }
  y += 3;

  if (skills.length) {
    st(7.5, "bold", 148, 163, 184); doc.text("SKILLS", LCOL, y); y += 4;
    st(8, "normal", 203, 213, 225);
    const names = skills.map(s => s.skillName || s.name);
    const perLine = 2;
    for (let i = 0; i < names.length; i += perLine) {
      const line = names.slice(i, i + perLine).join("  ·  ");
      doc.text(line, LCOL, y); y += 4.2;
    }
    y += 2;
  }

  if (education.length) {
    st(7.5, "bold", 148, 163, 184); doc.text("EDUCATION", LCOL, y); y += 4;
    education.forEach((item) => {
      st(8.5, "bold", 255, 255, 255); doc.text(item.degree || "", LCOL, y); y += 4.2;
      st(7.5, "normal", 203, 213, 225); doc.text(item.instituteName || "", LCOL, y); y += 3.5;
      st(7, "normal", 148, 163, 184);
      doc.text(`${item.startYear || ""} – ${item.endYear || "Present"}`, LCOL, y); y += 4;
    });
  }

  st(9, "normal", 30, 41, 59);
  const sc = (size, weight = "normal", r = 30, g = 41, b = 59) => {
    doc.setFont("helvetica", weight); doc.setFontSize(size); doc.setTextColor(r, g, b);
  };
  const heading = (title) => {
    pb(16); ry += 2;
    sc(9, "bold", 37, 99, 235); doc.text(title.toUpperCase(), RCOL, ry); ry += 2.5;
    doc.setDrawColor(37, 99, 235); doc.setLineWidth(0.5); doc.line(RCOL, ry, RCOL + 30, ry); ry += 5;
  };

  if (profile.about) {
    heading("Professional Summary"); sc(9, "normal", 71, 85, 105);
    const lines = doc.splitTextToSize(profile.about, RCW);
    pb(lines.length * 4.6 + 4); doc.text(lines, RCOL, ry); ry += lines.length * 4.6 + 3;
  }

  if (experience.length) {
    heading("Experience");
    experience.forEach((item) => {
      pb(24);
      sc(10, "bold", 15, 23, 42); doc.text(item.companyName || "", RCOL, ry);
      sc(8, "normal", 100, 116, 139);
      doc.text(`${item.startDate || ""} – ${item.endDate || "Present"}`, RCOL + RCW, ry, { align: "right" }); ry += 4.5;
      sc(9, "italic", 37, 99, 235); doc.text(item.designation || "", RCOL, ry); ry += 4.5;
      if (item.description) {
        sc(8.5, "normal", 71, 85, 105);
        const dl = doc.splitTextToSize(item.description, RCW - 3);
        pb(dl.length * 4 + 3); doc.text(dl, RCOL + 2, ry); ry += dl.length * 4 + 1;
      }
      ry += 3;
    });
  }

  if (certificates.length) {
    heading("Certifications");
    certificates.forEach((item) => {
      pb(9); sc(8.5, "normal", 51, 65, 85);
      let line = item.title || "";
      if (item.issuer) line += ` — ${item.issuer}`;
      const lines = doc.splitTextToSize(`• ${line}`, RCW - 2);
      pb(lines.length * 4.2 + 2); doc.text(lines, RCOL + 1, ry); ry += lines.length * 4.2 + 1.5;
    });
  }

  if (recognition.length) {
    heading("Recognition");
    recognition.forEach((item) => {
      pb(12); sc(9, "bold", 15, 23, 42);
      doc.text(`• ${item.title || ""}`, RCOL + 1, ry); ry += 4.5;
      if (item.description) {
        sc(8.5, "normal", 100, 116, 139);
        const dl = doc.splitTextToSize(item.description, RCW - 4);
        pb(dl.length * 3.8 + 3); doc.text(dl, RCOL + 3, ry); ry += dl.length * 3.8 + 1;
      }
    });
  }

  const totalPages = typeof doc.getNumberOfPages === "function" ? doc.getNumberOfPages() : doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    sc(7, "normal", 160, 160, 160);
    doc.text(`${profile.fullName || "Resume"} • Page ${i} of ${totalPages}`, W / 2, H - 7, { align: "center" });
  }

  return doc;
}

function minimalTemplate(JsPDF, data) {
  const doc = new JsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const { profile, skills, experience, education, certificates, recognition } = data;

  const W = doc.internal.pageSize.getWidth();
  const H = doc.internal.pageSize.getHeight();
  const ML = 24, MR = 24, CW = W - ML - MR;
  let y = 28;

  const pb = (need = 20) => { if (y + need > H - 14) { doc.addPage(); y = 30; } };
  const st = (size, weight = "normal", r = 0, g = 0, b = 0) => {
    doc.setFont("helvetica", weight); doc.setFontSize(size); doc.setTextColor(r, g, b);
  };
  const hr = () => { doc.setDrawColor(230, 230, 230); doc.setLineWidth(0.3); doc.line(ML, y, W - MR, y); };
  const heading = (title) => {
    pb(18); y += 6;
    st(10, "bold", 0, 0, 0); doc.text(title, ML, y); y += 2.5;
    hr(); y += 5;
  };

  st(24, "bold", 0, 0, 0); doc.text(profile.fullName || "Name", ML, y); y += 9;
  st(11, "normal", 100, 100, 100); doc.text(profile.designation || "", ML, y); y += 7;

  const parts = [profile.email, profile.mobile, profile.github && strip(profile.github), profile.linkedin && strip(profile.linkedin)].filter(Boolean);
  if (parts.length) { st(8.5, "normal", 150, 150, 150); doc.text(parts.join("   |   "), ML, y); y += 6; }
  y += 2; hr(); y += 6;

  if (profile.about) {
    heading("About"); st(9.5, "normal", 80, 80, 80);
    const lines = doc.splitTextToSize(profile.about, CW);
    pb(lines.length * 4.8 + 4); doc.text(lines, ML, y); y += lines.length * 4.8 + 4;
  }

  if (skills.length) {
    heading("Skills"); st(9.5, "normal", 80, 80, 80);
    const str = skills.map((s) => s.skillName || s.name).join("    •    ");
    const lines = doc.splitTextToSize(str, CW);
    pb(lines.length * 4.8 + 4); doc.text(lines, ML, y); y += lines.length * 5 + 4;
  }

  if (experience.length) {
    heading("Experience");
    experience.forEach((item, i) => {
      pb(24); st(11, "bold", 0, 0, 0); doc.text(item.companyName || "", ML, y);
      st(8.5, "normal", 150, 150, 150);
      doc.text(`${item.startDate || ""} – ${item.endDate || "Present"}`, W - MR, y, { align: "right" }); y += 5;
      st(9.5, "normal", 100, 100, 100); doc.text(item.designation || "", ML, y); y += 5;
      if (item.description) {
        st(9, "normal", 120, 120, 120);
        const dl = doc.splitTextToSize(item.description, CW);
        pb(dl.length * 4.5 + 3); doc.text(dl, ML, y); y += dl.length * 4.5 + 2;
      }
      if (i < experience.length - 1) { y += 2; hr(); y += 4; }
    }); y += 2;
  }

  if (education.length) {
    heading("Education");
    education.forEach((item, i) => {
      pb(20); st(10.5, "bold", 0, 0, 0); doc.text(item.degree || "", ML, y);
      st(8.5, "normal", 150, 150, 150);
      doc.text(`${item.startYear || ""} – ${item.endYear || "Present"}`, W - MR, y, { align: "right" }); y += 4.5;
      st(9.5, "normal", 100, 100, 100);
      let line = item.instituteName || "";
      if (item.fieldOfStudy) line += `  |  ${item.fieldOfStudy}`;
      doc.text(line, ML, y); y += 4;
      if (item.percentage) { st(9, "normal", 150, 150, 150); doc.text(`Score: ${item.percentage}`, ML, y); y += 4; }
      if (i < education.length - 1) { y += 2; hr(); y += 4; }
    }); y += 2;
  }

  if (certificates.length) {
    heading("Certificates");
    certificates.forEach((item) => {
      pb(9); st(9, "normal", 80, 80, 80);
      let line = item.title || "";
      if (item.issuer) line += `  —  ${item.issuer}`;
      if (item.issueDate) line += `  (${item.issueDate})`;
      const lines = doc.splitTextToSize(`•  ${line}`, CW - 2);
      pb(lines.length * 4.5 + 2); doc.text(lines, ML + 2, y); y += lines.length * 4.5 + 2;
    });
  }

  if (recognition.length) {
    heading("Recognition");
    recognition.forEach((item) => {
      pb(12); st(9.5, "bold", 0, 0, 0); doc.text(`•  ${item.title || ""}`, ML + 2, y); y += 4.5;
      if (item.description) {
        st(9, "normal", 120, 120, 120);
        const dl = doc.splitTextToSize(item.description, CW - 4);
        pb(dl.length * 4.2 + 3); doc.text(dl, ML + 4, y); y += dl.length * 4.2 + 2;
      }
    });
  }

  const totalPages = typeof doc.getNumberOfPages === "function" ? doc.getNumberOfPages() : doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i); st(7, "normal", 200, 200, 200);
    doc.text(`${profile.fullName || "Resume"}  |  Page ${i} of ${totalPages}`, W / 2, H - 8, { align: "center" });
  }

  return doc;
}

const TEMPLATES = {
  classic: { name: "Classic", fn: classicTemplate, desc: "Clean professional layout with section lines" },
  modern: { name: "Modern", fn: modernTemplate, desc: "Two-column design with dark sidebar" },
  minimal: { name: "Minimal", fn: minimalTemplate, desc: "Simple elegant design with ample whitespace" },
};

export { classicTemplate, modernTemplate, minimalTemplate, TEMPLATES };
