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
  {
    title: 'What Is Holistic Psychiatry? A Guide to Whole-Person Mental Wellness',
    category: 'Whole-person care',
    text: 'You may have heard the term “holistic” in medicine, but what does it mean when it comes to psychiatry?',
    body: `You may have heard the term “holistic” in medicine, but what does it mean when it comes to psychiatry? For many, it represents a more complete and hopeful path toward mental wellness. If you're exploring different approaches to your mental health, this guide will explain the principles of holistic psychiatry and what you can expect on your journey.

What is Holistic Psychiatry?

Holistic psychiatry is an approach to mental health care that views each person as a whole. Instead of focusing only on symptoms, a holistic psychiatrist considers the intricate web of factors that contribute to your mental and emotional state. This includes your physical health, emotional life, nutritional habits, social connections, and even your sense of purpose.

The core principle is simple yet profound: your mind and body are not separate. Your brain health is deeply connected to your overall physical health. Therefore, true and lasting wellness comes from addressing all these interconnected parts, not just one.

Key Principles of Holistic Psychiatry:

Mind-Body Connection:

This is the foundation. A holistic psychiatrist understands that issues like chronic inflammation, hormonal imbalances, gut health problems, and nutrient deficiencies can manifest as anxiety, depression, or focus issues.

Personalized Care:

There is no one-size-fits-all solution. Your treatment plan is tailored specifically to your unique biology, lifestyle, and personal history, moving beyond a trial-and-error approach to medication.

Finding the Root Cause:

While medication can be a valuable tool to manage symptoms, the goal of a holistic approach is to understand and address the underlying reasons for your struggles. The question is not just what you are feeling, but why you are feeling it.

A Collaborative Partnership:

You are an active partner in your healing. A holistic psychiatrist works with you, empowering you with the knowledge and tools to make informed decisions about your health.

Integrative Methods:

Treatment often blends the best of conventional and complementary therapies. This can include traditional psychotherapy and medication management alongside evidence-based strategies like nutritional counseling, mindfulness practices, and lifestyle adjustments.

What to Expect From a Holistic Consultation

Your first appointment with a holistic psychiatrist will likely be more comprehensive than you're used to. Be prepared to discuss:

Your Complete Health History:

A detailed review of your mental and physical health, energy levels, and sleep patterns.

Your Diet and Lifestyle:

What you eat, your exercise habits, and your daily routines.

Your Environment:

Your relationships, work life, sources of stress, and support systems.

Based on this comprehensive evaluation, a personalized treatment plan will be developed. This plan might include targeted nutritional supplements, specific dietary recommendations, stress management techniques like meditation, an exercise plan, psychotherapy, and, when appropriate, medication.

The goal isn't just to reduce your symptoms, but to build a foundation of robust health that allows you to thrive. If you're seeking a path to wellness that honors the complexity of who you are, holistic psychiatry may be the answer.`,
    takeaways: ['Holistic psychiatry views each person as a whole', 'Mind and body are deeply connected', 'Care is personalized and collaborative']
  },
  {
    title: 'Beyond Medication: A Holistic View on Treating ADHD',
    category: 'ADHD',
    text: 'A holistic approach to ADHD expands the toolkit to create a more comprehensive and sustainable path to focus and balance.',
    body: `For many, an ADHD (Attention-Deficit/Hyperactivity Disorder) diagnosis brings a mix of relief and questions. While medication is often presented as the primary treatment option, it's not the complete picture. A holistic approach to ADHD doesn't necessarily exclude medication, but it expands the toolkit to create a more comprehensive and sustainable path to focus and balance.

This approach looks "beyond the pill" to address the physiological and lifestyle factors that can profoundly impact ADHD symptoms.

Is It Just ADHD? The Importance of a Deeper Look

A key part of a holistic view is ensuring that what looks like ADHD isn't actually being caused or worsened by an underlying condition. A holistic psychiatrist will investigate potential contributors, such as:

Nutrient Deficiencies:

Low levels of iron, zinc, and magnesium can all impact dopamine pathways and executive function.

Sleep Issues:

Undiagnosed sleep apnea or poor sleep quality can lead to daytime inattention and hyperactivity.

Blood Sugar Imbalances:

The highs and lows of blood sugar can cause "brain fog," irritability, and difficulty concentrating.

Gut Health:

The gut-brain axis is a powerful connection. Inflammation in the gut can lead to inflammation in the brain, impacting neurotransmitter function.

Core Components of a Holistic ADHD Treatment Plan

A holistic plan is personalized but often incorporates the following powerful strategies:

1. Optimizing Nutrition for a Focused Brain:

The brain needs specific fuel to function well. A holistic plan often emphasizes a diet rich in protein for sustained energy and healthy fats like omega-3s to support brain cell health. It also focuses on reducing or eliminating sugar and artificial additives that can exacerbate hyperactivity in some individuals.

2. The Role of Targeted Supplementation:

Based on lab testing or clinical evaluation, specific supplements can be powerful allies. Zinc, iron, and magnesium are critical in producing the neurotransmitters targeted by stimulant medications. High-quality fish oil (omega-3s) has also been shown in numerous studies to support cognitive function.

3. Harnessing the Power of Exercise:

If there were a single non-medical therapy for ADHD, it would be exercise. Physical activity—especially complex activities like martial arts or yoga—has been shown to increase levels of dopamine and norepinephrine, improving executive function and focus. For a brain that craves stimulation, movement is medicine.

4. Mindfulness and Behavioral Strategies:

Holistic treatment also equips you with practical skills. Mindfulness training can help improve attention and reduce impulsivity. This is combined with essential behavioral strategies for organization and time management to navigate the challenges of daily life with ADHD.

Medication in a Holistic Context

A holistic approach is not an anti-medication approach. For many, medication is a necessary tool that creates the stability needed to build these other healthy habits. The difference is the goal: medication can be part of the solution, but it isn't seen as the entire solution. The aim is to build a foundation of health so that the lowest effective dose of medication is used, and in some cases, may not be needed long-term.

By looking beyond the label and treating the whole person, holistic psychiatry offers a robust, empowering, and more complete way to manage ADHD and unlock your full potential.`,
    takeaways: ['ADHD-like symptoms can be worsened by underlying factors', 'Nutrition, supplementation, exercise, and behavioral strategies can support treatment', 'Medication can be part of the solution without being the entire solution']
  },
  {
    title: 'Feeling Anxious? 5 Integrative Approaches to Find Calm in Connecticut',
    category: 'Anxiety',
    text: 'Five integrative approaches that can help you manage anxiety and reclaim your sense of well-being.',
    body: `Anxiety can feel like a constant storm, a relentless hum of worry that disrupts your peace. While it's one of the most common mental health challenges, finding lasting relief can be difficult. For many in Connecticut seeking a more comprehensive path to calm, integrative psychiatry offers powerful strategies that go beyond just managing symptoms.

An integrative approach combines the best of conventional medicine with evidence-based complementary therapies to address the root causes of anxiety. Here are five integrative approaches that can help you manage anxiety and reclaim your sense of well-being.

1. Nutritional Psychiatry: Fueling a Calmer Brain

What you eat directly impacts your mood. A diet high in processed foods, sugar, and caffeine can fuel the very brain patterns that lead to anxiety.

The Approach:

A targeted nutritional plan can help stabilize blood sugar, reduce inflammation, and provide the key nutrients your brain needs to produce calming neurotransmitters like serotonin. This often involves increasing your intake of omega-3 fatty acids (found in fatty fish), magnesium (in leafy greens and nuts), and B vitamins.

2. Targeted Supplementation and Herbal Medicine

While not a replacement for a healthy diet, specific supplements can be incredibly effective in modulating the body's stress response.

The Approach:

After a thorough evaluation, an integrative psychiatrist might recommend supplements like L-theanine (an amino acid from green tea known for promoting relaxation without drowsiness) or adaptogenic herbs like Ashwagandha. These natural compounds can help regulate the stress hormone cortisol and support your nervous system.

3. Mindfulness and Mind-Body Practices

Anxiety often traps us in a cycle of "what if" thinking. Mindfulness practices anchor you firmly in the present moment, breaking that cycle.

The Approach:

This is a structured practice of paying attention to your breath, thoughts, and bodily sensations without judgment. Guided meditation, yoga, and simple deep-breathing exercises can retrain your brain's response to anxious thoughts, giving you a powerful tool you can use anytime, anywhere—from a stressful commute on I-84 to a quiet moment at home.

4. The Power of Movement and Nature

Our bodies were designed to move. A sedentary lifestyle can worsen feelings of anxiety and restlessness.

The Approach:

Regular physical activity is one of the most effective anti-anxiety strategies available. It burns off excess adrenaline while boosting feel-good endorphins. In a state as beautiful as Connecticut, this could mean a brisk walk through a local park or a hike in one of our many state forests.

5. Optimizing Your Sleep Hygiene

Poor sleep is a major driver of anxiety, and anxiety, in turn, wreaks havoc on sleep. Breaking this vicious cycle is essential.

The Approach:

An integrative plan will focus on your "sleep hygiene." This involves creating a consistent sleep schedule, optimizing your bedroom for rest (cool, dark, and quiet), and developing a relaxing pre-sleep routine to restore a healthy sleep-wake cycle.

If you're tired of just coping with anxiety and want to build a true foundation of calm, exploring these integrative approaches with a qualified professional can be a life-changing step.`,
    takeaways: ['Nutrition can affect mood and anxiety', 'Mindfulness, movement, and sleep hygiene can support calm', 'Integrative psychiatry looks beyond symptom management']
  }
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
