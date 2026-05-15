-- Hostinger MySQL schema for Integrative Psychiatry website CMS and contact form
-- Import this file in Hostinger phpMyAdmin.

CREATE TABLE IF NOT EXISTS admin_users (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(190) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(190) NULL,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  last_login_at DATETIME NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS cms_content (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  content_key VARCHAR(100) NOT NULL UNIQUE,
  title VARCHAR(255) NOT NULL,
  body LONGTEXT NOT NULL,
  content_json JSON NULL,
  updated_by INT UNSIGNED NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_content_key (content_key),
  CONSTRAINT fk_cms_content_user FOREIGN KEY (updated_by) REFERENCES admin_users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS cms_articles (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  slug VARCHAR(190) NOT NULL UNIQUE,
  title VARCHAR(255) NOT NULL,
  category VARCHAR(190) NOT NULL,
  summary TEXT NOT NULL,
  body LONGTEXT NOT NULL,
  takeaways JSON NULL,
  is_published TINYINT(1) NOT NULL DEFAULT 1,
  sort_order INT NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_articles_published (is_published, sort_order),
  FULLTEXT KEY ft_articles (title, summary, body)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS cms_faqs (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  faq_group VARCHAR(190) NOT NULL,
  question VARCHAR(255) NOT NULL,
  answer TEXT NOT NULL,
  is_published TINYINT(1) NOT NULL DEFAULT 1,
  sort_order INT NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_faqs_published (is_published, sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS cms_services (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  icon VARCHAR(80) NULL,
  is_published TINYINT(1) NOT NULL DEFAULT 1,
  sort_order INT NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_services_published (is_published, sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS contact_submissions (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(180) NOT NULL,
  preferred_name VARCHAR(120) NULL,
  date_of_birth DATE NOT NULL,
  age INT NULL,
  is_minor TINYINT(1) NOT NULL DEFAULT 0,
  mobile_phone VARCHAR(50) NOT NULL,
  email VARCHAR(190) NOT NULL,
  contact_preference JSON NULL,
  voicemail_consent TINYINT(1) NOT NULL DEFAULT 0,
  visit_type VARCHAR(40) NOT NULL,
  availability JSON NULL,
  reason_for_care VARCHAR(120) NOT NULL,
  brief_context TEXT NULL,
  payment_type JSON NULL,
  insurance_provider VARCHAR(160) NULL,
  out_of_network_acknowledgment TINYINT(1) NOT NULL DEFAULT 0,
  status ENUM('new','reviewed','archived') NOT NULL DEFAULT 'new',
  staff_notes TEXT NULL,
  ip_hash CHAR(64) NULL,
  user_agent VARCHAR(500) NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_contact_status_created (status, created_at),
  INDEX idx_contact_email (email),
  INDEX idx_contact_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO cms_content (content_key, title, body, content_json)
VALUES
('homepage', 'Holistic psychiatry rooted in you.', 'Personalized mental health care that treats the whole you—mind, body, and spirit. The practice provides time for in-depth assessment, individualized treatment planning, and a collaborative relationship where you feel heard and supported.', JSON_OBJECT('heroEyebrow','Board-certified psychiatry in Connecticut','practiceTitle','A wider lens for mental health.')),
('about', 'Your partner in healing.', 'Dr. Douglas Zelisko, known warmly as Dr. Z, brings a passion for holistic mental health care and a thoughtful, patient-centered style to every interaction.', JSON_OBJECT('subtitle','Board-certified psychiatrist with a deep commitment to holistic, personalized mental health care.')),
('settings', 'Practice Settings', '', JSON_OBJECT('practiceName','Integrative Psychiatry','doctor','Douglas Zelisko, MD','phone','860-615-3629','email','support@drzelisko.com','address','45 South Main Street, Suite 111, West Hartford, CT 06107','portalUrl','https://drz.intakeq.com/portal'))
ON DUPLICATE KEY UPDATE updated_at = CURRENT_TIMESTAMP;

INSERT INTO cms_services (title, description, icon, sort_order)
VALUES
('In-depth psychiatric evaluations', 'A full assessment of symptoms, history, lifestyle, medical context, goals, and treatment options.', 'FileText', 10),
('Psychodynamic psychotherapy', 'A reflective approach that helps you understand patterns, emotions, relationships, and the deeper meaning behind symptoms.', 'MessageCircle', 20),
('Medication management', 'Thoughtful prescribing, side-effect review, and medication decisions integrated with the larger treatment plan.', 'Stethoscope', 30),
('Holistic treatment planning', 'Care may consider diet, exercise, sleep, stress physiology, supplements, medical factors, and whole-person wellness.', 'Leaf', 40),
('Ketamine-assisted psychotherapy', 'A carefully screened option for selected patients, with preparation, monitoring, and integration.', 'Sparkles', 50),
('Diagnostic clarity & second opinions', 'A fresh look when symptoms, diagnosis, or treatment history feel complicated or unclear.', 'Search', 60)
ON DUPLICATE KEY UPDATE updated_at = CURRENT_TIMESTAMP;

INSERT INTO cms_articles (slug, title, category, summary, body, takeaways, sort_order)
VALUES
('what-is-holistic-psychiatry', 'What Is Holistic Psychiatry?', 'Whole-person care', 'A practical guide to psychiatry that considers mind, body, lifestyle, medical context, values, and meaning.', 'Holistic psychiatry begins with the idea that mental health symptoms are real and worthy of careful treatment, while also recognizing that symptoms rarely exist in isolation. Mood, focus, anxiety, sleep, nutrition, movement, relationships, medical history, trauma, and personal meaning can all shape how someone feels and functions.', JSON_ARRAY('Looks beyond symptoms alone','Combines conventional and complementary tools when appropriate','Emphasizes individualized treatment planning'), 10),
('beyond-medication-adhd', 'Beyond Medication: A Holistic View on Treating ADHD', 'ADHD', 'A whole-person view of ADHD that looks beyond the pill to sleep, nutrition, exercise, gut health, and behavioral strategies.', 'Adult ADHD can affect organization, motivation, emotional regulation, time management, sleep, self-esteem, and relationships. A careful evaluation also considers anxiety, trauma, depression, substance use, sleep disruption, and medical factors that can mimic or worsen attention problems.', JSON_ARRAY('Clarify diagnosis before treating','Address sleep and stress alongside medication decisions','Create practical systems for daily life'), 20),
('integrative-approaches-anxiety', 'Feeling Anxious? 5 Integrative Approaches to Find Calm', 'Anxiety', 'Education on integrative strategies that may support calm alongside appropriate psychiatric care.', 'Anxiety can be a signal from the nervous system, a response to stress, a learned protective pattern, a medical issue, or a reflection of unresolved emotional conflict. Understanding what anxiety is doing is often the first step.', JSON_ARRAY('Anxiety has context','Regulation skills and lifestyle changes can support treatment','Medication and therapy may both have a role'), 30)
ON DUPLICATE KEY UPDATE updated_at = CURRENT_TIMESTAMP;

INSERT INTO cms_faqs (faq_group, question, answer, sort_order)
VALUES
('Holistic Care for Mental Wellness', 'What is Integrative Psychiatry?', 'Integrative Psychiatry is a comprehensive, personalized approach to mental wellness that considers the whole person—mind, body, and spirit.', 10),
('Holistic Care for Mental Wellness', 'How is your approach different from traditional psychiatry?', 'The approach is broader and more in-depth. Longer sessions allow time to understand personal history, lifestyle, physical health, belief systems, and treatment goals.', 20),
('Our Philosophy of Care', 'Who is Dr. Douglas Zelisko (Dr. Z)?', 'Dr. Douglas Zelisko, or Dr. Z, is the board-certified psychiatrist who leads the practice.', 30),
('Getting Started & Logistics', 'How can I schedule my first appointment?', 'New patients can book a Psychiatric Evaluation Intake Appointment directly online. Choose virtual or in-office scheduling from the New Patients page.', 40)
ON DUPLICATE KEY UPDATE updated_at = CURRENT_TIMESTAMP;
