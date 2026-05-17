import { FileText, Leaf, MessageCircle, Monitor, Search, Sparkles, Stethoscope, Users, MapPin } from 'lucide-react';

export const BRAND = { deep: '#173f42', teal: '#2f8c85', mint: '#9fcf9a', pale: '#edf8f1' };
export const ASSETS = { logo: '/logo.png', headshot: '/headshot.jpeg' };
export const PRACTICE = { name: 'Integrative Psychiatry', doctor: 'Douglas Zelisko, MD', address: '45 South Main Street, Suite 111, West Hartford, CT 06107', phone: '860-615-3629', email: 'support@drzelisko.com', location: 'West Hartford, Connecticut' };
export const LINKS = { portal: 'https://drz.intakeq.com/portal', evaluationVirtual: 'https://link.drz.services/veval', evaluationOffice: 'https://link.drz.services/ieval', followUpOffice: 'https://link.drz.services/o', followUpVirtual: 'https://link.drz.services/v' };
export const INTAKEQ = { accountId: '6785a5e3cc5e978c253acd8d', scriptSrc: 'https://intakeq.com/js/widget.min.js?1' };
export const NAV = [
  ['/', 'Home'], ['/about', 'About'], ['/services', 'Services'], ['/resources', 'Resources & FAQ'], ['/ketamine-therapy', 'Ketamine'], ['/fees-insurance', 'Fees'], ['/new-patients', 'New Patients'], ['/current-patients', 'Current Patients'], ['/contact', 'Contact']
];
export const BOOKING_OPTIONS = [
  { key: 'evaluation-virtual', title: 'Virtual Psychiatric Evaluation Intake', subtitle: 'Start care with a comprehensive telehealth evaluation.', href: LINKS.evaluationVirtual, serviceId: '58193299-cfce-4354-b509-ce89f4aec3dc', icon: Monitor, badge: 'New patient', tone: 'from-[#9fcf9a] via-[#2f8c85] to-[#173f42]' },
  { key: 'evaluation-office', title: 'In-Office Psychiatric Evaluation Intake', subtitle: 'Begin care in a thoughtful, in-person setting in West Hartford.', href: LINKS.evaluationOffice, serviceId: 'f5586c2c-2dbd-4a55-878a-df83394ce608', icon: MapPin, badge: 'New patient', tone: 'from-[#d6e7c7] via-[#9fcf9a] to-[#2f8c85]' },
  { key: 'follow-up-office', title: 'In-Office Follow-Up', subtitle: 'Schedule an established-patient follow-up at the office.', href: LINKS.followUpOffice, serviceId: '20ee08a2-0586-4719-83fa-599c5aea1fc2', icon: Users, badge: 'Current patient', tone: 'from-[#173f42] via-[#2f8c85] to-[#9fcf9a]' },
  { key: 'follow-up-virtual', title: 'Virtual Follow-Up', subtitle: 'Continue established care by secure telehealth follow-up.', href: LINKS.followUpVirtual, serviceId: '57f67047-59ad-4edf-8ab1-db9f0c072bad', icon: Monitor, badge: 'Current patient', tone: 'from-[#24565a] via-[#2f8c85] to-[#9fcf9a]' }
];
export const SERVICES = [
  { icon: FileText, title: 'In-depth psychiatric evaluations', text: 'A full assessment of symptoms, history, lifestyle, medical context, goals, and treatment options.' },
  { icon: MessageCircle, title: 'Psychodynamic psychotherapy', text: 'A reflective approach that helps you understand patterns, emotions, relationships, and the deeper meaning behind symptoms.' },
  { icon: Stethoscope, title: 'Medication management', text: 'Thoughtful prescribing, side-effect review, and medication decisions integrated with the larger treatment plan.' },
  { icon: Leaf, title: 'Holistic treatment planning', text: 'Care may consider diet, exercise, sleep, stress physiology, supplements, medical factors, and whole-person wellness.' },
  { icon: Sparkles, title: 'Ketamine-assisted psychotherapy', text: 'A carefully screened option for selected patients, with preparation, monitoring, and integration.' },
  { icon: Search, title: 'Diagnostic clarity & second opinions', text: 'A fresh look when symptoms, diagnosis, or treatment history feel complicated or unclear.' }
];
export const TRAINING = ['Amherst College', 'St. George’s University School of Medicine', 'Psychiatry residency at UConn School of Medicine', 'Board-certified psychiatrist'];
export const METHODS = ['Psychodynamic psychotherapy', 'Medication management', 'Integrative psychiatry', 'Ketamine-assisted therapy', 'CBT-informed strategies', 'Person-centered care', 'Mindfulness-informed care', 'Trauma-focused care', 'Family / marital and interpersonal therapy', 'Psychological testing and evaluation'];
export const CONDITIONS = ['Anxiety', 'Depression and mood disorders', 'ADHD and focus concerns', 'Trauma and PTSD', 'Grief and loss', 'Relationship issues', 'Substance use and dual diagnosis', 'Eating disorders', 'Sleep concerns', 'Stress, self-esteem, and life transitions'];
export const ARTICLES = [
  { title: 'What Is Holistic Psychiatry?', category: 'Whole-person care', text: 'A practical guide to psychiatry that considers mind, body, lifestyle, medical context, values, and meaning.', body: 'Holistic psychiatry begins with the idea that mental health symptoms are real and worthy of careful treatment, while also recognizing that symptoms rarely exist in isolation. Mood, focus, anxiety, sleep, nutrition, movement, relationships, medical history, trauma, and personal meaning can all shape how someone feels and functions.', takeaways: ['Looks beyond symptoms alone', 'Combines conventional and complementary tools when appropriate', 'Emphasizes individualized treatment planning'] },
  { title: 'Beyond Medication: A Holistic View on Treating ADHD', category: 'ADHD', text: 'A whole-person view of ADHD that looks beyond the pill to sleep, nutrition, exercise, gut health, and behavioral strategies.', body: 'Adult ADHD can affect organization, motivation, emotional regulation, time management, sleep, self-esteem, and relationships. A careful evaluation also considers anxiety, trauma, depression, substance use, sleep disruption, and medical factors that can mimic or worsen attention problems.', takeaways: ['Clarify diagnosis before treating', 'Address sleep and stress alongside medication decisions', 'Create practical systems for daily life'] },
  { title: 'Feeling Anxious? 5 Integrative Approaches to Find Calm', category: 'Anxiety', text: 'Education on integrative strategies that may support calm alongside appropriate psychiatric care.', body: 'Anxiety can be a signal from the nervous system, a response to stress, a learned protective pattern, a medical issue, or a reflection of unresolved emotional conflict. Understanding what anxiety is doing is often the first step.', takeaways: ['Anxiety has context', 'Regulation skills and lifestyle changes can support treatment', 'Medication and therapy may both have a role'] }
];
export const FAQ_GROUPS = [
  {
    title: 'Holistic Care for Mental Wellness',
    items: [
      ['What is Integrative Psychiatry?', 'Integrative Psychiatry is a comprehensive, personalized approach to mental wellness that considers the whole person—mind, body, and spirit. Unlike conventional approaches that may focus solely on managing symptoms, the goal is to understand and address the underlying contributors to your concerns. Care may blend traditional, evidence-based medicine such as psychotherapy and pharmacology with complementary approaches such as lifestyle coaching, nutritional support, and functional assessment when clinically appropriate.'],
      ['What is your core philosophy?', 'The philosophy centers on achieving true, lasting healing by moving beyond symptom management and addressing the complete picture of your health. Care is collaborative, grounded in respect for patient autonomy, and designed to empower you with knowledge and options. Treatment plans are individualized around your goals, values, and life circumstances.'],
      ['How is your approach different from traditional psychiatry?', 'The approach is broader and more in-depth. While traditional psychiatry may focus on diagnosis and medication management during shorter appointments, this practice dedicates more time to understanding your complete story, including personal history, lifestyle, physical health, and belief systems. Treatment planning may include psychotherapy, medication, lifestyle changes, and other individualized supports.']
    ]
  },
  {
    title: 'Our Philosophy of Care',
    items: [
      ['Who is Dr. Douglas Zelisko (Dr. Z)?', 'Dr. Douglas Zelisko, or Dr. Z, is the board-certified psychiatrist who leads the practice. He is deeply passionate about holistic mental health care and is dedicated to treating patients as whole individuals, not just collections of symptoms. He integrates a variety of therapeutic modalities to support each person’s unique journey to wellness. Reflecting his own commitment to a balanced life, he enjoys road biking, running, and discovering mid-century modern design.'],
      ['What are Dr. Z’s qualifications?', 'Dr. Z is a highly trained medical professional. He earned his undergraduate degree from Amherst College and his MD from St. George’s University School of Medicine. He then completed his specialized Psychiatry Residency at the UConn School of Medicine.']
    ]
  },
  {
    title: 'Services & Conditions Treated',
    items: [
      ['What types of services do you offer?', 'The practice offers a wide range of services designed to support whole-person well-being, including comprehensive psychiatric evaluations, diagnostic assessments, second-opinion consultations, individual psychotherapy, couples counseling, thoughtful psychiatric medication management, ketamine-assisted psychotherapy, smoking cessation support, relapse prevention, and wellness/lifestyle-oriented care when clinically appropriate.'],
      ['What is Ketamine-Assisted Psychotherapy?', 'Ketamine-Assisted Psychotherapy is an innovative therapeutic modality that may be considered for selected individuals with certain treatment-resistant conditions, such as severe depression, anxiety, and PTSD. Under professional guidance, ketamine may help facilitate psychological exploration and open new pathways for healing that may not be accessible through traditional talk therapy alone. It requires careful evaluation, screening, preparation, monitoring, and integration.'],
      ['What conditions do you commonly treat?', 'The practice treats a broad spectrum of conditions by addressing the unique individual experiencing them. Common concerns include depression, anxiety, mood disorders, PTSD and trauma, ADD/ADHD, eating disorders, substance use disorders, sleep disorders, and related concerns. The practice also has experience with women’s and men’s health concerns such as PCOS and low libido, gut dysbiosis, and psych-oncology support.'],
      ['Do you work with couples?', 'Yes. Couples counseling is available and provides a safe, supportive space for partners to navigate challenges, improve communication, and strengthen their relationship as part of a holistic approach to mental wellness.']
    ]
  },
  {
    title: 'Getting Started & Logistics',
    items: [
      ['How can I learn more or schedule my first appointment?', 'The best first step is to book a Psychiatric Evaluation Intake Appointment using the secure online scheduling links on the New Patients page. You can choose either virtual or in-office scheduling based on your needs and availability.'],
      ['What can I expect before my first appointment?', 'Before your first full appointment, you may be asked to complete intake forms and provide relevant medical, psychiatric, medication, and treatment history. This helps the practice understand what you are looking for and prepare for a thorough, individualized evaluation.'],
      ['What should I expect during my first full appointment?', 'Your first comprehensive evaluation is an in-depth session designed to understand you as a whole person. It typically lasts longer than a standard psychiatry appointment. You may discuss personal and family history, current challenges, lifestyle factors such as diet, sleep, and exercise, prior treatment experiences, and goals for treatment. This thorough understanding becomes the foundation for your personalized care plan.'],
      ['How long are typical appointments?', 'The practice emphasizes thorough, unhurried care. Sessions are longer than the industry standard and may range from 30 minutes for some follow-up and management appointments to 2 hours for initial comprehensive evaluations or in-depth psychotherapy sessions.'],
      ['Do you accept insurance?', 'The practice may operate out-of-network and may provide documentation such as a superbill for possible out-of-network reimbursement. Insurance-based appointment options may also be available through partner platforms for eligible plans. Please verify payment and insurance details before scheduling.'],
      ['Where is Integrative Psychiatry located?', 'The office is located at 45 South Main Street, Suite 111, West Hartford, CT 06107.'],
      ['How can I contact the office?', 'You can reach the office by phone at 860-615-3629 or by email at support@drzelisko.com.']
    ]
  }
];
