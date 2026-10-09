from pathlib import Path

from reportlab.lib.colors import HexColor
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.platypus import KeepTogether, PageBreak, Paragraph, SimpleDocTemplate, Spacer, Table, TableStyle


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "output" / "pdf" / "Jay_Delgado_Resume.pdf"
SITE_COPY = ROOT / "assets" / "Jay_Delgado_Resume.pdf"

INK = HexColor("#111111")
NAVY = HexColor("#1E416E")
MUTED = HexColor("#4D4D4D")
LINE = HexColor("#5A80B1")


def p(text, style):
    return Paragraph(text, style)


def section(text, styles):
    rule = Table([[p(text.upper(), styles["section"])]], colWidths=[7.05 * inch])
    rule.setStyle(TableStyle([("LINEBELOW", (0, 0), (-1, -1), .8, LINE), ("BOTTOMPADDING", (0, 0), (-1, -1), 5)]))
    return [Spacer(1, 11), rule, Spacer(1, 7)]


def project(name, summary, stack, styles, live_url=None):
    live = f" &nbsp;|&nbsp; <link href='{live_url}' color='#1E416E'>Live site ↗</link>" if live_url else ""
    return KeepTogether([
        p(f"<b>{name}</b>{live}", styles["project"]),
        p(summary, styles["body"]),
        p(f"<b>Tech:</b> {stack}", styles["tech"]),
        Spacer(1, 7),
    ])


def build():
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    SITE_COPY.parent.mkdir(parents=True, exist_ok=True)
    doc = SimpleDocTemplate(str(OUTPUT), pagesize=letter, leftMargin=.72 * inch, rightMargin=.72 * inch, topMargin=.55 * inch, bottomMargin=.55 * inch, title="Jay A. Delgado - Resume", author="Jay A. Delgado")
    base = getSampleStyleSheet()
    styles = {
        "name": ParagraphStyle("name", parent=base["Normal"], fontName="Helvetica-Bold", fontSize=22, leading=25, textColor=INK, alignment=TA_CENTER, spaceAfter=4),
        "role": ParagraphStyle("role", parent=base["Normal"], fontName="Helvetica", fontSize=11.5, leading=14, textColor=INK, alignment=TA_CENTER, spaceAfter=5),
        "contact": ParagraphStyle("contact", parent=base["Normal"], fontName="Helvetica", fontSize=9.3, leading=12.5, textColor=INK, alignment=TA_CENTER),
        "section": ParagraphStyle("section", parent=base["Normal"], fontName="Helvetica-Bold", fontSize=12.5, leading=15, textColor=NAVY),
        "body": ParagraphStyle("body", parent=base["Normal"], fontName="Helvetica", fontSize=9.5, leading=13.5, textColor=INK, spaceAfter=4),
        "skill": ParagraphStyle("skill", parent=base["Normal"], fontName="Helvetica", fontSize=9, leading=12.2, textColor=INK),
        "project": ParagraphStyle("project", parent=base["Normal"], fontName="Helvetica-Bold", fontSize=10.3, leading=13.5, textColor=INK, spaceAfter=3),
        "tech": ParagraphStyle("tech", parent=base["Normal"], fontName="Helvetica", fontSize=8.8, leading=12, textColor=MUTED),
        "job": ParagraphStyle("job", parent=base["Normal"], fontName="Helvetica-Bold", fontSize=10.3, leading=13.5, textColor=INK, spaceAfter=2),
        "meta": ParagraphStyle("meta", parent=base["Normal"], fontName="Helvetica-Bold", fontSize=9.4, leading=12.5, textColor=INK, spaceAfter=6),
    }

    story = [
        p("JAY A. DELGADO", styles["name"]),
        p("Full Stack Web Developer", styles["role"]),
        p("Union, Libertad, Antique &nbsp;|&nbsp; alvarezdelgado07@gmail.com &nbsp;|&nbsp; +63 945 362 5894", styles["contact"]),
        p("GitHub: <link href='https://github.com/Suturobery' color='#1E416E'>github.com/Suturobery</link> &nbsp;|&nbsp; Portfolio: <link href='https://suturobery.github.io/jay-delgado-portfolio/' color='#1E416E'>suturobery.github.io/jay-delgado-portfolio</link>", styles["contact"]),
    ]
    story += section("Professional Summary", styles)
    story.append(p("Full Stack Web Developer with internship and freelance experience developing responsive, secure, and user-friendly web applications. Proficient in PHP, Laravel, MySQL, JavaScript (ES6+), HTML5, CSS3, Bootstrap, and Tailwind CSS. Familiar with React.js and Node.js through personal projects and continuous learning. Experienced in RESTful API integration, authentication, database design, Git-based workflows, and AI-assisted development using ChatGPT and Claude. Also proficient in Microsoft Office (Word, PowerPoint, Excel) with working knowledge of everyday IT support tasks such as software installation and basic hardware troubleshooting.", styles["body"]))
    story += section("Technical Skills", styles)
    left = "<b>Languages & Frameworks</b><br/>PHP, Laravel, JavaScript (ES6+), React.js (basic), Node.js (basic), HTML5, CSS3<br/><br/><b>Front-end & Design</b><br/>Bootstrap, Tailwind CSS, Sass, Blade, Vite, Figma<br/><br/><b>Databases & ORM</b><br/>MySQL, MariaDB, SQLite, phpMyAdmin, Eloquent ORM<br/><br/><b>APIs & Integrations</b><br/>RESTful APIs, Google OAuth, Fetch API, Axios, PayMongo API"
    right = "<b>Security</b><br/>RBAC, email OTP verification, bcrypt password hashing, CSRF protection, secure file uploads<br/><br/><b>Tools &amp; Platforms</b><br/>Git, GitHub, VS Code, XAMPP, Composer, npm, Postman, Hostinger<br/><br/><b>Office &amp; IT Support</b><br/>Microsoft Word, PowerPoint, Excel (basic), computer literacy, software installation, basic hardware troubleshooting<br/><br/><b>Libraries</b><br/>Chart.js, DomPDF, PHPWord, Leaflet.js, Pusher<br/><br/><b>AI Development Tools</b><br/>ChatGPT, Claude"
    skills = Table([[p(left, styles["skill"]), p(right, styles["skill"])]], colWidths=[3.45 * inch, 3.45 * inch])
    skills.setStyle(TableStyle([("VALIGN", (0, 0), (-1, -1), "TOP"), ("LEFTPADDING", (0, 0), (-1, -1), 0), ("RIGHTPADDING", (0, 0), (-1, -1), 14)]))
    story.append(skills)
    story += section("Experience", styles)
    story += [p("Web Developer Intern (OJT)", styles["job"]), p("Trikee Inc. | February 2026 - May 2026", styles["meta"]), p("•&nbsp;&nbsp;Assisted in developing and maintaining web application features for the Local Government Unit (LGU) of Kalibo, Aklan.<br/>•&nbsp;&nbsp;Designed responsive, user-friendly interfaces using HTML, CSS, JavaScript, Bootstrap, and Laravel Blade.", styles["body"])]
    story.append(PageBreak())
    story += section("Projects", styles)
    story += [
        project("UALC Pre-Registration System", "Laravel-based pre-registration system with role-based access, Google OAuth, OTP verification, dashboards, and PWA support.", "Laravel 12, PHP, MySQL, Bootstrap, Tailwind CSS, Chart.js", styles, "https://ualc-prereg.site/"),
        project("Tourist Track System", "QR-code visitor monitoring system with reports and live dashboards.", "Laravel, MySQL, Pusher, DomPDF", styles, "https://touristtrack.site/"),
        project("Hydro Hub Water Refilling Station", "Multi-role delivery management platform with GPS tracking and PayMongo integration.", "PHP, MySQL, Bootstrap, Leaflet.js", styles),
        project("Pagdumara Hostel Management System", "Hostel booking and management software with dashboards and backup utilities.", "PHP, MariaDB, JavaScript", styles),
    ]
    story += section("Education", styles)
    story += [p("<b>University of Antique - Libertad Campus</b><br/>Bachelor of Science in Information Technology | 2022 - 2026", styles["body"]), p("<b>Languages:</b> English, Filipino", styles["body"])]
    doc.build(story)
    SITE_COPY.write_bytes(OUTPUT.read_bytes())


if __name__ == "__main__":
    build()
