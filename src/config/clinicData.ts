import heroDentistPatientPhoto from '../assets/images/file_00000000f6608211a0664b51a35a45b4-1.webp';
import clinicReceptionPhoto from '../assets/images/clinic_reception_desk_1789224267870.webp';
import doctorTeamPhoto from '../assets/images/doctor_team_scrubs_1789224279665.webp';
import drRajeshPhoto from '../assets/images/dr_rajesh_mehta_1789224312227.webp';
import drPriyaPhoto from '../assets/images/dr_priya_sharma_1789224323068.webp';
import drAmitPhoto from '../assets/images/dr_amit_verma_1789224335721.webp';
import drNehaPhoto from '../assets/images/dr_neha_kapoor_1789224347511.webp';
import happySmilePhoto from '../assets/images/happy_healthy_smile_1789224363577.webp';
import treatmentRoomPhoto from '../assets/images/treatment_room_operatory_1789224377193.webp';
import dentalScannerPhoto from '../assets/images/dental_equipment_scanner_1789224389755.webp';
import whiteningBeforeAfterPhoto from '../assets/images/whitening_before_after_1789224401270.webp';
import whiteningCompareFixedPhoto from '../assets/images/whitening_compare_fixed_1790409874928.jpg';
import bracesBeforeAfterPhoto from '../assets/images/braces_before_after_1789224418800.webp';
import implantBeforeAfterPhoto from '../assets/images/implant_before_after_1789224431383.webp';
import implantClearComparePhoto from '../assets/images/implant_clear_compare_1790407073333.jpg';
import aiAssistantAvatar from '../assets/images/ai_assistant_ganga_1789224292530.webp';
import smileGapPhoto from '../assets/images/smile_gap_comparison_1788766122899.webp';

export {
  heroDentistPatientPhoto,
  clinicReceptionPhoto,
  doctorTeamPhoto,
  drRajeshPhoto,
  drPriyaPhoto,
  drAmitPhoto,
  drNehaPhoto,
  happySmilePhoto,
  treatmentRoomPhoto,
  dentalScannerPhoto,
  whiteningBeforeAfterPhoto,
  bracesBeforeAfterPhoto,
  implantBeforeAfterPhoto,
  implantClearComparePhoto,
  aiAssistantAvatar,
  smileGapPhoto
};

export const CLINIC_CONTACT = {
  phone: '+91 90065 13247',
  rawPhone: '9006513247',
  whatsapp: '9006513247',
  email: 'info@gangadentalclinic.com',
  address: 'B-12, Green Park, New Delhi – 110016 (near Metro Station)',
  shortAddress: 'B-12, Green Park, New Delhi – 110016',
  openingHours: 'Mon - Sat: 9:00 AM - 8:00 PM',
  sundayHours: 'Sunday: 10:00 AM - 2:00 PM (Emergency & By Appointment)',
  telLink: 'tel:+919006513247',
  emailLink: 'mailto:info@gangadentalclinic.com',
  getWhatsAppUrl(customMessage?: string) {
    const text = customMessage 
      ? encodeURIComponent(customMessage) 
      : encodeURIComponent('Hello Ganga Dental Clinic, I would like to book an appointment.');
    return `https://wa.me/919006513247?text=${text}`;
  }
};

export const CLINIC_INFO = {
  name: 'Ganga Dental Clinic',
  tagline: 'Healthy Smiles. Brighter Lives.',
  subheadline: 'Advanced dental care with a gentle touch. We provide complete dental services for a healthier, brighter and more confident smile.',
  experienceYears: '10+',
  happyPatients: '5K+',
  expertDentists: '8+',
  satisfactionRate: '100%',
  stats: [
    { value: '10+', label: 'Years of Experience' },
    { value: '5K+', label: 'Happy Patients' },
    { value: '8+', label: 'Expert Dentists' },
    { value: '100%', label: 'Patient Satisfaction' }
  ],
  trustIndicators: [
    { title: 'Experienced Doctors', desc: 'Board certified dental specialists' },
    { title: 'Modern Technology', desc: 'Digital 3D imaging & rotary systems' },
    { title: 'Safe & Sterile Environment', desc: 'Hospital-grade autoclaves & safety protocols' },
    { title: 'Personalized Care', desc: 'Customized gentle treatment journeys' },
    { title: 'Affordable Treatment Plans', desc: 'Transparent fees & flexible options' }
  ],
  whyChooseUs: [
    {
      title: 'Advanced Technology & Equipment',
      desc: 'Equipped with painless digital rotary tools, 3D intraoral scanners, and modern low-radiation digital radiography for accurate diagnosis.'
    },
    {
      title: 'Experienced & Skilled Dentists',
      desc: 'Our team comprises leading MDS specialists across Endodontics, Orthodontics, Prosthodontics, Periodontics, and Pediatric dentistry.'
    },
    {
      title: 'Personalized Treatment Plans',
      desc: 'Every patient is unique. We listen closely to your smile goals and design customized treatment plans with zero pressure.'
    },
    {
      title: 'Safe & Sterile Environment',
      desc: 'Strict multi-stage Class-B sterilization protocols ensure an aseptic, hygienic, and infection-free clinic setting for your family.'
    },
    {
      title: 'Transparent Pricing',
      desc: 'Clear, itemized treatment estimates upfront with no hidden clinic charges or surprise add-ons.'
    },
    {
      title: 'Emergency Dental Support',
      desc: 'Same-day priority emergency slots for sudden severe toothache, broken teeth, bleeding gums, or dental trauma.'
    }
  ]
};

export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  qualification: string;
  experience: string;
  rating: number;
  reviewCount: number;
  image: string;
  bio: string;
  availableDays: string;
}

export const DOCTORS: Doctor[] = [
  {
    id: 'dr-rajesh-mehta',
    name: 'Dr. Rajesh Mehta',
    specialization: 'General Dentist',
    qualification: 'BDS, Fellowship in Aesthetic Dentistry',
    experience: '12+ Years',
    rating: 5.0,
    reviewCount: 310,
    image: drRajeshPhoto,
    bio: 'Senior dental surgeon specializing in comprehensive smile checkups, restorative composites, painless extractions, and preventative family oral health.',
    availableDays: 'Mon – Sat (9:00 AM – 2:00 PM)'
  },
  {
    id: 'dr-priya-sharma',
    name: 'Dr. Priya Sharma',
    specialization: 'Orthodontist',
    qualification: 'BDS, MDS (Orthodontics & Dentofacial Orthopedics)',
    experience: '9+ Years',
    rating: 5.0,
    reviewCount: 280,
    image: drPriyaPhoto,
    bio: 'Certified Invisalign and clear aligner specialist expert in metal & ceramic braces, bite corrections, and natural smile realignment for teens and adults.',
    availableDays: 'Tue, Thu, Sat (11:00 AM – 7:00 PM)'
  },
  {
    id: 'dr-amit-verma',
    name: 'Dr. Amit Verma',
    specialization: 'Endodontist',
    qualification: 'BDS, MDS (Conservative Dentistry & Endodontics)',
    experience: '10+ Years',
    rating: 5.0,
    reviewCount: 420,
    image: drAmitPhoto,
    bio: 'Master of single-sitting, pain-free Root Canal Treatments using rotary titanium instrumentation, apex locators, and microscopic precision restorations.',
    availableDays: 'Mon – Sat (10:00 AM – 8:00 PM)'
  },
  {
    id: 'dr-neha-kapoor',
    name: 'Dr. Neha Kapoor',
    specialization: 'Pediatric Dentist',
    qualification: 'BDS, MDS (Pediatric & Preventive Dentistry)',
    experience: '8+ Years',
    rating: 5.0,
    reviewCount: 195,
    image: drNehaPhoto,
    bio: 'Specialist in compassionate child dental care, painless cavity treatments, habit breakers, pit & fissure sealants, and gentle fluoride applications.',
    availableDays: 'Mon, Wed, Fri (10:00 AM – 6:00 PM)'
  }
];

export interface DetailedService {
  id: string;
  name: string;
  category: string;
  iconName: string;
  shortDesc: string;
  fullDesc: string;
  benefits: string[];
  procedureSteps: string[];
  whoNeedsIt: string[];
  faqs: { q: string; a: string }[];
  priceRange?: string;
  duration?: string;
  featured?: boolean;
}

export const ALL_SERVICES: DetailedService[] = [
  {
    id: 'general-dentistry',
    name: 'General Dentistry',
    category: 'Essential Care',
    iconName: 'ShieldCheck',
    shortDesc: 'Comprehensive oral examinations, diagnostic cleanings, and preventive care for lifelong oral health.',
    fullDesc: 'Our General Dentistry practice forms the bedrock of optimal oral health. Through comprehensive evaluations, digital intraoral photography, and preventive protocols, we detect issues early before they cause pain or extensive damage.',
    benefits: [
      'Early detection of hidden cavities and gum recession',
      'Painless assessment with digital intraoral cameras',
      'Custom oral hygiene roadmaps tailored to your saliva & enamel type',
      'Protects your overall systemic health from oral infections'
    ],
    procedureSteps: [
      'Complete visual and tactile examination of teeth and gums',
      'Low-dose digital X-rays to assess bone and interdental spaces',
      'Oral cancer screening and bite alignment evaluation',
      'Personalized review and transparent treatment recommendation'
    ],
    whoNeedsIt: [
      'Anyone who has not visited a dentist in the last 6 months',
      'Patients experiencing early tooth sensitivity or mild bleeding gums',
      'Families seeking continuous preventive care for adults and seniors'
    ],
    faqs: [
      { q: 'How often should I come for a general dental checkup?', a: 'We recommend visiting every 6 months for routine cleaning and checkup to keep teeth and gums in prime health.' },
      { q: 'Does a routine dental checkup hurt?', a: 'Not at all. Routine checkups are completely non-invasive and painless.' }
    ],
    duration: '30 - 45 mins',
    featured: true
  },
  {
    id: 'teeth-whitening',
    name: 'Teeth Whitening',
    category: 'Cosmetic',
    iconName: 'Sparkles',
    shortDesc: 'Advanced in-clinic laser whitening for a radiant, sparkling smile up to 8 shades brighter.',
    fullDesc: 'Revitalize your confidence with our gentle, enamel-safe professional teeth whitening. Using advanced LED-activated whitening gels with desensitizing agents, we erase years of coffee, tea, smoking, and age-related stains in just a single comfortable hour.',
    benefits: [
      'Up to 6 to 8 shades visibly whiter teeth in one session',
      'Enamel-safe formulation designed to minimize sensitivity',
      'Long-lasting brightness with included take-home touchup guidance',
      'Immediate results ready for weddings, interviews, and special events'
    ],
    procedureSteps: [
      'Pre-treatment shade matching and deep ultrasonic surface polish',
      'Application of protective gum barrier to isolate soft tissues',
      'Application of medical-grade hydrogen/carbamide whitening gel',
      'Activation under gentle cool LED light in three 15-minute cycles',
      'Post-treatment fluoride soothing gel application'
    ],
    whoNeedsIt: [
      'Individuals with yellowing, dullness, or tea/coffee/tobacco staining',
      'Brides, grooms, and professionals preparing for major life moments',
      'Anyone desiring an instant youthful boost to their appearance'
    ],
    faqs: [
      { q: 'Is professional teeth whitening safe for my enamel?', a: 'Yes, clinical whitening performed by our dentists is 100% enamel-safe and adheres to international dental safety standards.' },
      { q: 'How long do teeth whitening results last?', a: 'Results typically last 1 to 3 years depending on dietary habits and regular brushing hygiene.' }
    ],
    duration: '45 - 60 mins',
    featured: true
  },
  {
    id: 'dental-implants',
    name: 'Dental Implants',
    category: 'Restorative',
    iconName: 'Anchor',
    shortDesc: 'Permanent titanium tooth replacements that look, feel, and function exactly like natural teeth.',
    fullDesc: 'Dental implants represent the gold standard in modern tooth replacement. Made of biocompatible titanium integrated into the jawbone, they support custom ceramic crowns that restore 100% chewing power and stop facial bone collapse.',
    benefits: [
      'Permanent solution that can last a lifetime with proper care',
      'Preserves natural jawbone density and facial contour',
      'Restores full chewing power—eat all your favorite crunchy foods',
      'No need to grind down or compromise adjacent healthy teeth'
    ],
    procedureSteps: [
      '3D CBCT digital scan to analyze bone density and nerve canals',
      'Computer-guided painless placement of biocompatible implant post',
      'Healing phase (osseointegration) where bone bonds securely to implant',
      'Attachment of custom titanium abutment and hand-crafted zirconia crown'
    ],
    whoNeedsIt: [
      'Patients missing one, multiple, or all natural teeth',
      'People frustrated with loose, slipping, or uncomfortable removable dentures',
      'Individuals seeking permanent tooth restoration without bridge grinding'
    ],
    faqs: [
      { q: 'Is dental implant surgery painful?', a: 'No, the procedure is carried out under gentle local anesthesia and is surprisingly comfortable—patients often report it feels easier than a routine tooth extraction.' },
      { q: 'How long do dental implants last?', a: 'With good oral hygiene and routine checkups, dental implants have a success rate exceeding 98% and can last a lifetime.' }
    ],
    duration: '2 - 3 visits',
    featured: true
  },
  {
    id: 'braces-orthodontics',
    name: 'Braces & Orthodontics',
    category: 'Orthodontics',
    iconName: 'Smile',
    shortDesc: 'Metal, ceramic braces & invisible clear aligners to gently straighten misaligned teeth and correct bites.',
    fullDesc: 'Transform crowded teeth, gaps, overbites, and crooked alignment with our advanced orthodontic solutions. We offer high-grade metal braces, subtle tooth-colored ceramic brackets, and cutting-edge custom invisible aligners.',
    benefits: [
      'Creates a perfectly aligned, symmetrical, and harmonious smile',
      'Improves bite efficiency and resolves speech or chewing issues',
      'Makes teeth significantly easier to brush and floss, preventing decay',
      'Options for both traditional fixed brackets and removable clear aligners'
    ],
    procedureSteps: [
      'Digital 3D smile scan and cephalometric orthodontic analysis',
      'Personalized virtual treatment simulation showing before and after',
      'Precise bonding of braces brackets or delivery of custom aligner sets',
      'Periodic gentle progress check-ins every 4 to 6 weeks'
    ],
    whoNeedsIt: [
      'Children and teenagers with developing crowded or spaced teeth',
      'Adults seeking discreet alignment via clear aligners or ceramic braces',
      'Anyone suffering from jaw discomfort, deep bite, or underbite'
    ],
    faqs: [
      { q: 'Am I too old to get braces or aligners?', a: 'Never! Orthodontic treatment can be successfully performed at any age as long as your gums and bone are healthy.' },
      { q: 'Are clear aligners as effective as traditional braces?', a: 'Yes, modern clear aligners can treat mild to complex crowding and spacing with identical precision and superior aesthetics.' }
    ],
    duration: '6 - 18 months',
    featured: true
  },
  {
    id: 'root-canal-treatment',
    name: 'Root Canal Treatment',
    category: 'Endodontics',
    iconName: 'Activity',
    shortDesc: 'Painless, single-visit rotary root canal therapy to eliminate tooth pain and save your natural tooth.',
    fullDesc: 'Save your severely decayed, infected, or cracked tooth with modern painless endodontic therapy. Using digital apex locators, nickel-titanium rotary files, and warm obturation, Dr. Amit Verma eliminates infection while keeping your natural tooth intact.',
    benefits: [
      'Instant and lasting relief from severe throbbing toothaches',
      'Saves your natural tooth structure and prevents extraction',
      'Eliminates bacterial infection from spreading to the jawbone',
      'Completed comfortably in 1 or 2 visits with gentle local anesthesia'
    ],
    procedureSteps: [
      'Targeted local numbing ensures a 100% pain-free experience',
      'Micro-access to clean out inflamed pulp tissue from root canals',
      'Ultrasonic disinfection and shaping with rotary nickel-titanium files',
      'Hermetic 3D root sealing with biocompatible gutta-percha',
      'Reinforcement with a long-lasting tooth-colored dental crown'
    ],
    whoNeedsIt: [
      'Severe throbbing tooth pain when chewing or lying down',
      'Prolonged sensitivity to hot or cold drinks and food',
      'Swelling, tenderness in the gum, or a pimple-like bump near the tooth',
      'Deep dental decay that has reached the internal nerve chamber'
    ],
    faqs: [
      { q: 'Is root canal treatment painful?', a: 'Contrary to old myths, modern rotary root canal treatment is completely painless with contemporary local anesthetics and relieves your toothache immediately.' },
      { q: 'Can a root canal be completed in a single visit?', a: 'Yes, the majority of non-acute infections can be completed in a single comfortable 45-minute session.' }
    ],
    duration: '45 - 60 mins',
    featured: true
  },
  {
    id: 'pediatric-dentistry',
    name: 'Pediatric Dentistry',
    category: 'Child Care',
    iconName: 'Baby',
    shortDesc: 'Gentle, cheerful dental care for kids, infants, and teenagers in a fun, fear-free clinic environment.',
    fullDesc: 'Led by specialist Dr. Neha Kapoor, our pediatric dental wing is specially designed to make every child feel safe, joyful, and excited about oral hygiene. From baby teeth fillings to preventive sealants, we build lifelong healthy dental habits.',
    benefits: [
      'Fear-free, compassionate environment designed specifically for young children',
      'Prevents early childhood caries and preserves milk teeth spacing',
      'Fosters positive lifelong dental habits without dental anxiety',
      'Gentle fluoride varnishes that dramatically strengthen developing enamel'
    ],
    procedureSteps: [
      'Child-friendly meet-and-greet with our caring pediatric team',
      'Gentle tooth count and non-threatening dental examination',
      'Fun polishing and cavity-fighting fluoride coating application',
      'Guidance for parents on diet, brushing habits, and teething milestones'
    ],
    whoNeedsIt: [
      'Toddlers getting their first teeth (starting around age 1)',
      'Children with tooth pain, black spots, or cavities',
      'Kids needing habit counseling for thumb-sucking or tongue-thrusting'
    ],
    faqs: [
      { q: 'When should a child first visit the dentist?', a: 'The Indian Dental Association recommends a first visit when the first baby tooth appears, or by the child’s first birthday.' },
      { q: 'Why are baby teeth important if they fall out anyway?', a: 'Baby teeth guide speech development, enable proper chewing, and maintain the exact spacing required for adult permanent teeth.' }
    ],
    duration: '30 mins',
    featured: true
  },
  {
    id: 'cosmetic-dentistry',
    name: 'Cosmetic Dentistry',
    category: 'Aesthetic',
    iconName: 'HeartHandshake',
    shortDesc: 'Porcelain veneers, composite bonding, and gum contouring for a celebrity-grade smile makeover.',
    fullDesc: 'Transform chipped, discolored, uneven, or gapped teeth into a balanced work of art. Our cosmetic dentists analyze your facial symmetry, lips, and gumline to craft natural porcelain veneers and hand-sculpted aesthetic composite restorations.',
    benefits: [
      'Conceals stubborn deep stains, chips, and irregular tooth lengths',
      'Creates a breathtaking, camera-ready symmetrical smile',
      'Custom color-matched to your natural facial complexion',
      'Ultra-thin durable porcelain that resists future coffee & tea staining'
    ],
    procedureSteps: [
      'Aesthetic smile design consultation and digital photo mockups',
      'Minimal preparation preserving maximum healthy natural enamel',
      'Digital 3D impressions sent to high-precision ceramic master lab',
      'Artistic adhesive bonding of custom porcelain veneers or restorations'
    ],
    whoNeedsIt: [
      'Patients with chipped, cracked, or unevenly worn tooth edges',
      'Noticeable gaps between front teeth (diastema)',
      'Anyone desiring a comprehensive Hollywood-grade smile transformation'
    ],
    faqs: [
      { q: 'How long do porcelain veneers last?', a: 'High-grade porcelain veneers can easily last 15 to 20 years with routine flossing and standard dental checkups.' }
    ],
    duration: '2 visits',
    featured: true
  },
  {
    id: 'periodontal-treatment',
    name: 'Periodontal Treatment',
    category: 'Gum Care',
    iconName: 'ShieldAlert',
    shortDesc: 'Deep scaling, root planing, and advanced gum therapy to halt bleeding gums and save loose teeth.',
    fullDesc: 'Healthy teeth require healthy foundations. Periodontal treatment eliminates harmful bacterial calculus and biofilm beneath the gumline, halting gum recession, bad breath (halitosis), and bone loss.',
    benefits: [
      'Stops bleeding gums when brushing and eating',
      'Eliminates persistent bad breath caused by subgingival bacteria',
      'Prevents premature loosening and loss of permanent teeth',
      'Reduces systemic inflammatory risks associated with heart disease and diabetes'
    ],
    procedureSteps: [
      'Periodontal pocket depth charting and gum health mapping',
      'Painless ultrasonic scaling to dissolve hardened tartar deposits',
      'Subgingival root planing to smooth root surfaces and encourage gum reattachment',
      'Antimicrobial irrigation and laser pocket sanitization'
    ],
    whoNeedsIt: [
      'Gums that bleed when brushing or flossing',
      'Swollen, puffy, dark red, or tender gum tissues',
      'Teeth that feel loose or appear longer due to gum recession'
    ],
    faqs: [
      { q: 'Is deep cleaning different from regular dental cleaning?', a: 'Yes. Regular cleaning polishes above the gumline, whereas periodontal deep scaling cleans deep within pockets to treat active infection.' }
    ],
    duration: '45 mins',
    featured: true
  },
  {
    id: 'oral-surgery',
    name: 'Oral Surgery',
    category: 'Surgical',
    iconName: 'Scissors',
    shortDesc: 'Gentle surgical extractions, impacted wisdom tooth removals, and pre-prosthetic bone contouring.',
    fullDesc: 'Our oral surgery team specializes in gentle, atraumatic tooth extractions, complicated third molar (wisdom tooth) impaction surgery, bone grafting, and cyst enucleation with maximum patient comfort and rapid recovery protocols.',
    benefits: [
      'Safe removal of impacted wisdom teeth causing severe jaw pain or crowding',
      'Atraumatic techniques that preserve surrounding jawbone',
      'Smooth, comfortable recovery guided by detailed post-op care kits',
      'Sedation and gentle local anesthesia options for anxiety-free procedures'
    ],
    procedureSteps: [
      'Digital OPG or 3D scan to view root geometry and proximity to nerve',
      'Complete local numbing for zero intra-operative sensation',
      'Gentle sectioning and removal of tooth without bone strain',
      'Suture placement and sterile gauze compression'
    ],
    whoNeedsIt: [
      'Painful, partially erupted, or angled wisdom teeth',
      'Teeth broken below the gumline beyond restoration',
      'Severe dental trauma or orthodontic pre-extraction'
    ],
    faqs: [
      { q: 'Will I feel pain during wisdom tooth removal?', a: 'No, you will feel only slight pressure. The procedure is performed under comprehensive local anesthesia.' }
    ],
    duration: '30 - 45 mins',
    featured: true
  },
  {
    id: 'emergency-dental-care',
    name: 'Emergency Dental Care',
    category: 'Urgent',
    iconName: 'AlertCircle',
    shortDesc: 'Immediate same-day emergency appointments for excruciating toothaches, broken teeth, and dental trauma.',
    fullDesc: 'Dental emergencies happen without warning. Whether you are battling unbearable nighttime tooth pain, a knocked-out tooth from a sports injury, or a broken crown, Ganga Dental Clinic provides same-day priority emergency relief.',
    benefits: [
      'Guaranteed same-day priority evaluation and pain relief',
      'Immediate diagnosis with digital X-rays to locate the acute problem',
      'Protects damaged teeth from permanent loss or spreading infection',
      'Direct emergency WhatsApp hotline available 24/7'
    ],
    procedureSteps: [
      'Rapid clinical triage and immediate pain relief administration',
      'Focused digital radiographic diagnosis of the affected area',
      'Stabilization of damaged teeth, pulp dressing, or temporary restoration',
      'Custom prescription and definitive treatment roadmap'
    ],
    whoNeedsIt: [
      'Severe, unbearable toothache that prevents sleeping or working',
      'Avulsed (knocked out) or displaced permanent tooth',
      'Facial or gum swelling indicating an acute dental abscess',
      'Uncontrolled bleeding from oral tissues or acute trauma'
    ],
    faqs: [
      { q: 'What should I do if a tooth gets knocked out?', a: 'Find the tooth, hold it ONLY by the crown (do not touch the root), rinse gently with milk or saline, place it in a cup of cold milk, and reach our clinic within 60 minutes for best chance of re-implantation.' }
    ],
    duration: 'Immediate Priority',
    featured: true
  },
  {
    id: 'teeth-cleaning',
    name: 'Teeth Cleaning & Polishing',
    category: 'Essential Care',
    iconName: 'Sparkles',
    shortDesc: 'Painless ultrasonic scaling and stain removal for fresh breath, clean teeth, and healthy pink gums.',
    fullDesc: 'Professional dental scaling removes stubborn calculus (tartar) and dental plaque that everyday brushing cannot dislodge. Finished with diamond-paste polishing for a smooth, glossy surface.',
    benefits: ['Removes yellow plaque and hard tartar', 'Instantly freshens breath', 'Prevents gum disease'],
    procedureSteps: ['Ultrasonic scaler vibrates away calculus', 'Interdental flossing', 'Prophy-jet stain removal', 'Fluoride rinse'],
    whoNeedsIt: ['Everyone every 6 months', 'Patients with tobacco or tea stains', 'Mild gum bleeding'],
    faqs: [{ q: 'Does scaling weaken teeth or make them loose?', a: 'No! That is a common myth. Scaling only removes harmful bacteria that would otherwise eat away your supporting bone.' }],
    duration: '30 mins'
  },
  {
    id: 'dental-fillings',
    name: 'Tooth-Colored Dental Fillings',
    category: 'Restorative',
    iconName: 'CheckCircle2',
    shortDesc: 'Durable, natural-looking composite resin fillings that blend seamlessly with your natural tooth color.',
    fullDesc: 'Say goodbye to unsightly dark silver amalgam fillings. We use high-strength nano-hybrid composite materials that bond directly to your natural enamel for invisible, durable cavity repairs.',
    benefits: ['Invisible aesthetic match', 'Preserves more natural tooth structure', 'Bonds strongly with zero mercury'],
    procedureSteps: ['Gentle removal of decayed enamel', 'Acid etching & bonding adhesive application', 'Layering of shade-matched composite', 'Blue light curing & final anatomical polishing'],
    whoNeedsIt: ['Cavities and black spots', 'Minor chipped front teeth', 'Replacement of old dark silver fillings'],
    faqs: [{ q: 'How long do composite fillings last?', a: 'With good oral hygiene, modern composite restorations last 7 to 10+ years.' }],
    duration: '30 mins'
  },
  {
    id: 'crowns-bridges',
    name: 'Crowns & Bridges',
    category: 'Restorative',
    iconName: 'Award',
    shortDesc: 'Precision metal-free Zirconia and E-max ceramic crowns to strengthen weak teeth and fill missing gaps.',
    fullDesc: 'When a tooth is cracked, heavily filled, or has undergone root canal treatment, a custom ceramic crown caps the tooth to restore 100% structural strength and chewing ability.',
    benefits: ['100% metal-free biocompatible Zirconia', 'Extremely strong chewing surface', 'Custom handcrafted color match'],
    procedureSteps: ['Tooth preparation & shaping', 'Digital 3D optical scan', 'Temporary crown placement', 'Permanent cementation of CAD/CAM crown'],
    whoNeedsIt: ['Teeth treated with root canals', 'Severely broken or cracked teeth', 'Missing one or two consecutive teeth (dental bridge)'],
    faqs: [{ q: 'Will my crown look like a fake tooth?', a: 'No, modern Zirconia and E-max crowns have natural translucency matching your adjacent teeth perfectly.' }],
    duration: '2 visits'
  },
  {
    id: 'clear-aligners',
    name: 'Clear Aligners',
    category: 'Orthodontics',
    iconName: 'Layers',
    shortDesc: 'Virtually invisible removable orthodontic trays that straighten your teeth comfortably without metal wires.',
    fullDesc: 'Straighten your teeth discreetly. Clear aligners are custom-molded medical-grade clear plastic trays that you wear 22 hours a day and remove easily for eating and brushing.',
    benefits: ['Virtually invisible on video calls & in person', 'No dietary restrictions—remove to eat', 'Zero sharp metal wires or bracket poking'],
    procedureSteps: ['3D digital intraoral scan', '3D computerized treatment animation', 'Delivery of series of custom aligner sets', 'Switch trays every 10 to 14 days'],
    whoNeedsIt: ['Adults and working professionals', 'Mild to moderate crowding or spacing', 'Relapse after childhood braces'],
    faqs: [{ q: 'How many hours a day do I need to wear aligners?', a: 'For best results, wear them 20 to 22 hours daily, removing them only to eat and drink hot liquids.' }],
    duration: '6 - 14 months'
  },
  {
    id: 'dentures',
    name: 'Dentures (Full & Partial)',
    category: 'Prosthodontics',
    iconName: 'Smile',
    shortDesc: 'Custom crafted complete and flexible partial dentures to restore chewing and a natural youthful smile.',
    fullDesc: 'For patients missing multiple or all teeth, our lightweight acrylic and flexible BPS dentures provide secure suction, natural aesthetics, and comfortable speech restoration.',
    benefits: ['Restores full bite and clear speech', 'Supports facial muscles, preventing sunken cheeks', 'Affordable tooth replacement option'],
    procedureSteps: ['Accurate mouth impressions', 'Bite registration & tooth shade selection', 'Wax try-in for aesthetic approval', 'Delivery & custom fit adjustment'],
    whoNeedsIt: ['Patients missing all upper or lower teeth', 'Multiple missing teeth unsuitable for immediate implants'],
    faqs: [{ q: 'Can I eat normally with dentures?', a: 'Yes, after a short adaptation period of 1 to 2 weeks, you will enjoy comfortable chewing and confident speaking.' }],
    duration: '3 - 4 visits'
  },
  {
    id: 'smile-makeover',
    name: 'Complete Smile Makeover',
    category: 'Cosmetic',
    iconName: 'Sparkles',
    shortDesc: 'Holistic digital smile design combining whitening, veneers, and alignment for a dream smile transformation.',
    fullDesc: 'A complete smile makeover harmonizes your teeth, gums, and lips. Using digital smile design principles, our multidisciplinary team addresses gaps, color, shape, and bite in a cohesive plan.',
    benefits: ['Custom tailored to facial features', 'Combines restorative & aesthetic dentistry', 'Dramatic boost in personal and professional confidence'],
    procedureSteps: ['Facial aesthetic consultation & digital mockups', 'Pre-treatment preparatory care', 'Veneers, crowns, or whitening procedures', 'Final smile reveal and photography'],
    whoNeedsIt: ['Multiple dental cosmetic concerns simultaneously', 'Worn down, discolored, or uneven teeth'],
    faqs: [{ q: 'Can I preview my new smile before starting?', a: 'Yes! We use digital smile simulations to let you preview the exact outcome before any irreversible work begins.' }],
    duration: 'Customized'
  }
];

export interface BeforeAfterItem {
  id: string;
  category: string;
  title: string;
  subtitle: string;
  beforeLabel: string;
  afterLabel: string;
  beforeDetail: string;
  afterDetail: string;
  image: string;
  description: string;
  treatmentDuration?: string;
  doctorSpecialist?: string;
}

export const BEFORE_AFTER_CASES: BeforeAfterItem[] = [
  {
    id: 'whitening-case',
    category: 'Teeth Whitening',
    title: 'Professional Laser Teeth Whitening',
    subtitle: '8 Shades Brighter Pearlescent Smile',
    beforeLabel: 'BEFORE',
    afterLabel: 'AFTER',
    beforeDetail: 'Heavy extrinsic yellow discoloration and stubborn coffee/tea stains across enamel.',
    afterDetail: '8 shades lighter, radiant pearlescent smile achieved without sensitivity.',
    image: whiteningCompareFixedPhoto,
    description: 'The patient presented with severe extrinsic staining from regular consumption of tea, coffee, and tobacco. An advanced 45-minute in-clinic laser whitening session safely lifted deep pigment without damaging the enamel or causing post-op sensitivity.',
    treatmentDuration: '45 Minutes (Single Sitting)',
    doctorSpecialist: 'Dr. Rajesh Mehta (Cosmetic & Aesthetic Dentistry)'
  },
  {
    id: 'braces-case',
    category: 'Braces & Aligners',
    title: 'Orthodontic Teeth Alignment & Correction',
    subtitle: 'Straight Dental Arch & Balanced Bite',
    beforeLabel: 'BEFORE',
    afterLabel: 'AFTER',
    beforeDetail: 'Severe dental crowding, overlapping anterior teeth, and irregular bite misalignment.',
    afterDetail: 'Properly aligned dental arch, balanced bite function, and symmetrical smile aesthetics.',
    image: bracesBeforeAfterPhoto,
    description: 'The patient presented with overlapping upper and lower front teeth causing aesthetic concerns and difficulty in plaque removal. Non-extraction orthodontic aligner therapy successfully corrected crowding and restored an aesthetic, functional dental arch.',
    treatmentDuration: '10 Months Active Care',
    doctorSpecialist: 'Dr. Priya Sharma (MDS Orthodontist)'
  },
  {
    id: 'implant-case',
    category: 'Dental Implants',
    title: 'Single-Tooth Dental Implant Restoration',
    subtitle: 'Permanent Titanium Implant with Zirconia Crown',
    beforeLabel: 'BEFORE',
    afterLabel: 'AFTER',
    beforeDetail: 'Missing upper premolar tooth with visible dark gap and bone resorption risk.',
    afterDetail: 'Permanent biocompatible titanium implant restored with a lifelike zirconia crown.',
    image: implantClearComparePhoto,
    description: 'The patient lost a tooth due to trauma, leaving a visible gap that compromised chewing and smile confidence. A precision titanium implant fixture was placed and restored with a custom shade-matched zirconia crown, restoring full chewing strength and natural aesthetics.',
    treatmentDuration: 'Same-Day Placement / Permanent Lifetime Solution',
    doctorSpecialist: 'Senior Implant Surgeon & Restorative Team'
  },
  {
    id: 'diastema-gap-case',
    category: 'Gap Closure & Bonding',
    title: 'Midline Diastema (Gap) Closure',
    subtitle: 'Seamless Cosmetic Composite Bonding',
    beforeLabel: 'BEFORE',
    afterLabel: 'AFTER',
    beforeDetail: 'Prominent 3mm midline gap between central incisors causing smile insecurity.',
    afterDetail: 'Natural closure achieved using multi-layer nano-hybrid aesthetic composite.',
    image: smileGapPhoto,
    description: 'The patient presented with an unsightly midline space (diastema) between upper front teeth. Using minimally invasive direct composite bonding with natural translucency, the gap was completely closed in a single appointment with zero tooth cutting.',
    treatmentDuration: '45 Minutes (Single Sitting)',
    doctorSpecialist: 'Dr. Rajesh Mehta (Aesthetic Smile Specialist)'
  }
];

export interface GalleryPhoto {
  id: string;
  title: string;
  category: string;
  image: string;
  description: string;
}

export const CLINIC_GALLERY: GalleryPhoto[] = [
  {
    id: 'gallery-reception',
    title: 'Modern Clinic Reception',
    category: 'Clinic Interior',
    image: clinicReceptionPhoto,
    description: 'Welcoming, spacious patient reception desk at Ganga Dental Clinic with soothing ambiance and green plants.'
  },
  {
    id: 'gallery-operatory',
    title: 'Modern Treatment Room',
    category: 'Treatment Rooms',
    image: treatmentRoomPhoto,
    description: 'Ergonomic patient chair with overhead surgical LED lighting, digital monitors, and hospital-grade sterility.'
  },
  {
    id: 'gallery-patient-care',
    title: 'Gentle Patient Care',
    category: 'Patient Care',
    image: heroDentistPatientPhoto,
    description: 'Our compassionate dentists performing thorough diagnostics with a gentle touch and patient-first approach.'
  },
  {
    id: 'gallery-technology',
    title: '3D Intraoral Digital Scanner',
    category: 'Dental Equipment',
    image: dentalScannerPhoto,
    description: 'State-of-the-art optical 3D scanner replacing messy traditional impressions for crowns, aligners, and implants.'
  },
  {
    id: 'gallery-doctors',
    title: 'Expert Dental Team',
    category: 'Doctors',
    image: doctorTeamPhoto,
    description: 'Our certified dental specialists committed to modern techniques, continuous education, and gentle dentistry.'
  }
];

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  treatment: string;
  rating: number;
  review: string;
  date: string;
}

export const PATIENT_TESTIMONIALS: Testimonial[] = [
  {
    id: 'rev-1',
    name: 'Rohit Sharma',
    role: 'Patient',
    treatment: 'Teeth Whitening & Cleaning',
    rating: 5,
    review: 'Excellent service and very caring staff. My smile has never been better! The clinic is spotless and Dr. Rajesh made me feel completely relaxed.',
    date: '2 weeks ago'
  },
  {
    id: 'rev-2',
    name: 'Sneha Patel',
    role: 'Patient',
    treatment: 'Clear Aligners & Braces',
    rating: 5,
    review: 'Dr. Priya is amazing! She explained everything clearly and made me feel comfortable throughout my orthodontic journey. Truly the best dental experience in town.',
    date: '1 month ago'
  },
  {
    id: 'rev-3',
    name: 'Onic Verma',
    role: 'Patient',
    treatment: 'Single-Visit Root Canal',
    rating: 5,
    review: 'Nice dental clinic in the city. Highly recommend to everyone! I had a bad toothache and Dr. Amit cured it in one painless sitting.',
    date: '3 weeks ago'
  },
  {
    id: 'rev-4',
    name: 'Pooja Singh',
    role: 'Patient',
    treatment: 'Pediatric Dental Care',
    rating: 5,
    review: 'Very professional and hygienic clinic. My kids love coming here! Dr. Neha was so friendly and gentle with my 6-year-old son.',
    date: 'Just recently'
  }
];

export const FAQS = [
  {
    q: 'Is dental cleaning painful?',
    a: 'Not at all. Modern ultrasonic dental cleanings use gentle water vibrations to safely dislodge plaque and tartar. You may feel slight tickling or vibration, but the procedure is completely painless and safe for enamel.'
  },
  {
    q: 'How often should I visit a dentist?',
    a: 'We recommend routine dental examinations and professional cleanings every 6 months. This allows our dentists to catch micro-cavities and gum inflammation early before they develop into painful conditions.'
  },
  {
    q: 'Is teeth whitening safe for teeth and enamel?',
    a: 'Yes, absolutely. Our in-clinic teeth whitening uses clinically tested, enamel-safe formulations under direct dentist supervision. It brightens your smile up to 8 shades without harming your enamel structure.'
  },
  {
    q: 'How does modern root canal treatment work?',
    a: 'Root canal treatment removes infected pulp tissue from within the tooth canals, disinfects the inner chamber, and seals it permanently with biocompatible gutta-percha. With modern rotary tools and local numbing, it is as routine and painless as getting a filling.'
  },
  {
    q: 'How long do dental implants take?',
    a: 'The implant placement is typically completed in one comfortable 45-minute visit. Following a healing period of 8 to 12 weeks for the implant post to fuse with your jawbone, a customized permanent ceramic crown is secured.'
  },
  {
    q: 'Are braces painful?',
    a: 'Getting braces placed on your teeth is completely painless. You may experience mild soreness or pressure for 2 to 3 days after adjustments as your teeth start gently shifting, which is easily managed with soft foods and mild over-the-counter relief.'
  },
  {
    q: 'Do children need regular dental checkups?',
    a: 'Yes! Baby teeth serve as crucial space holders for permanent adult teeth and support speech and nutrition. Routine checkups starting around age 1 prevent early childhood cavities and foster positive lifelong dental habits.'
  },
  {
    q: 'What should I do for sudden severe tooth pain?',
    a: 'Rinse your mouth with warm salt water, gently floss to dislodge trapped food, apply a cold compress to the outside of your cheek, and never place aspirin directly on the gums. Contact Ganga Dental Clinic immediately at +91 90065 13247 for a same-day priority emergency slot.'
  },
  {
    q: 'How can I book an appointment?',
    a: 'You can book directly via our website booking form, chat with our Ganga AI Assistant 24/7, click the WhatsApp button, or call our clinic directly at +91 90065 13247.'
  },
  {
    q: 'What should I bring to my appointment?',
    a: 'Please bring any previous dental records or X-rays if available, a list of current medications or allergies, and your identification. Arriving 5 to 10 minutes prior helps ensure a relaxed check-in.'
  }
];

export const EMERGENCY_INFO = {
  title: 'Tooth Pain? Dental Emergency?',
  subtitle: 'We provide immediate same-day emergency relief for severe toothaches, broken teeth, and dental trauma.',
  scenarios: [
    { title: 'Severe Toothache', desc: 'Unbearable throbbing pain keeping you awake at night' },
    { title: 'Broken or Chipped Tooth', desc: 'Accidental fracture or sharp tooth edge causing cuts' },
    { title: 'Knocked-Out (Avulsed) Tooth', desc: 'Tooth knocked out from sports or trauma (keep in cold milk)' },
    { title: 'Bleeding or Swelling', desc: 'Gum infection, abscess, or facial swelling requiring urgent drainage' },
    { title: 'Lost Filling or Crown', desc: 'Exposed nerve or sensitivity from a dislodged crown or restoration' },
    { title: 'Jaw or Facial Trauma', desc: 'Bite injury, sports accident, or soft tissue laceration' }
  ]
};

export const INSURANCE_PAYMENT_INFO = {
  title: 'Insurance & Flexible Payment Options',
  subtitle: 'Transparent pricing with no surprises. High-quality dental health made accessible for your entire family.',
  highlights: [
    {
      title: 'Insurance Claim Support',
      desc: 'We assist with detailed medical documentation, diagnostic X-rays, and itemized billing for easy reimbursement through major health and dental insurance providers.'
    },
    {
      title: 'Transparent Written Estimates',
      desc: 'Before beginning any procedure, you will receive an itemized treatment estimate with zero hidden clinic charges or unexpected add-ons.'
    },
    {
      title: 'Multiple Payment Methods',
      desc: 'We accept UPI (Google Pay, PhonePe, Paytm), all major credit & debit cards, net banking, and cash.'
    },
    {
      title: '0% Interest EMI Plans',
      desc: 'Flexible monthly installment plans available for major treatments such as dental implants, full mouth rehabilitations, and orthodontic aligners.'
    }
  ]
};
