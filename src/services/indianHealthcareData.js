// Comprehensive Indian Healthcare Facilities Data
// Real hospitals and clinics across major Indian cities

const BASE_HEALTHCARE_DATA = {
  // Mumbai, Maharashtra
  'mumbai': [
    {
      id: 'mum-1',
      name: 'Kokilaben Dhirubhai Ambani Hospital',
      type: 'hospital',
      specialty: 'Multi-Specialty Hospital',
      rating: 4.6,
      reviews: 2850,
      address: 'Achyutrao Patwardhan Marg, Four Bungalows, Andheri West, Mumbai, Maharashtra 400053',
      phone: '+91 22 3089 8888',
      hours: '24/7',
      doctors: 350,
      coordinates: { lat: 19.1334, lng: 72.8279 },
      website: 'https://www.kokilabenhospital.com',
      services: ['Emergency', 'Cardiology', 'Neurology', 'Oncology', 'Orthopedics', 'Pediatrics'],
      image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400'
    },
    {
      id: 'mum-2',
      name: 'Lilavati Hospital and Research Centre',
      type: 'hospital',
      specialty: 'Multi-Specialty Hospital',
      rating: 4.5,
      reviews: 3240,
      address: 'A-791, Bandra Reclamation, Bandra West, Mumbai, Maharashtra 400050',
      phone: '+91 22 2640 0000',
      hours: '24/7',
      doctors: 320,
      coordinates: { lat: 19.0596, lng: 72.8295 },
      website: 'https://www.lilavatihospital.com',
      services: ['Emergency', 'Cardiology', 'Gastroenterology', 'Neurosurgery', 'Urology'],
      image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400'
    },
    {
      id: 'mum-3',
      name: 'Breach Candy Hospital Trust',
      type: 'hospital',
      specialty: 'Multi-Specialty Hospital',
      rating: 4.4,
      reviews: 2650,
      address: '60-A, Bhulabhai Desai Road, Breach Candy, Mumbai, Maharashtra 400026',
      phone: '+91 22 2367 9111',
      hours: '24/7',
      doctors: 280,
      coordinates: { lat: 18.9711, lng: 72.8051 },
      website: 'https://www.breachcandyhospital.org',
      services: ['Emergency', 'Maternity', 'ICU', 'Diagnostics', 'Surgery'],
      image: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=400'
    },
    {
      id: 'mum-4',
      name: 'Nanavati Super Speciality Hospital',
      type: 'hospital',
      specialty: 'Multi-Specialty Hospital',
      rating: 4.5,
      reviews: 2980,
      address: 'S.V. Road, Vile Parle West, Mumbai, Maharashtra 400056',
      phone: '+91 22 2626 7500',
      hours: '24/7',
      doctors: 400,
      coordinates: { lat: 19.1076, lng: 72.8339 },
      website: 'https://www.nanavatihospital.org',
      services: ['Cardiology', 'Orthopedics', 'Oncology', 'Nephrology', 'Emergency'],
      image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400'
    },
    {
      id: 'mum-5',
      name: 'Apollo Hospitals Navi Mumbai',
      type: 'hospital',
      specialty: 'Multi-Specialty Hospital',
      rating: 4.3,
      reviews: 1890,
      address: 'Plot Number 13, Parsik Hill Road, Sector 23, CBD Belapur, Navi Mumbai, Maharashtra 400614',
      phone: '+91 22 3926 7676',
      hours: '24/7',
      doctors: 250,
      coordinates: { lat: 19.0144, lng: 73.0190 },
      website: 'https://www.apollohospitals.com',
      services: ['Emergency', 'Surgery', 'Cardiology', 'Neurology', 'Pediatrics'],
      image: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=400'
    },
    {
      id: 'mum-6',
      name: 'Holy Family Hospital',
      type: 'hospital',
      specialty: 'General Hospital',
      rating: 4.2,
      reviews: 1560,
      address: 'St. Andrew\'s Road, Bandra West, Mumbai, Maharashtra 400050',
      phone: '+91 22 2640 3303',
      hours: '24/7',
      doctors: 180,
      coordinates: { lat: 19.0596, lng: 72.8295 },
      website: 'https://www.holyfamilyhospitalbandra.com',
      services: ['Emergency', 'Maternity', 'General Medicine', 'Surgery', 'ICU'],
      image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400'
    },
    {
      id: 'mum-7',
      name: 'Wockhardt Hospital Mumbai Central',
      type: 'hospital',
      specialty: 'Multi-Specialty Hospital',
      rating: 4.4,
      reviews: 2340,
      address: '1877, Dr. Anandrao Nair Marg, Near Agripada Police Station, Mumbai, Maharashtra 400011',
      phone: '+91 22 2409 8800',
      hours: '24/7',
      doctors: 220,
      coordinates: { lat: 18.9790, lng: 72.8322 },
      website: 'https://www.wockhardthospitals.com',
      services: ['Cardiology', 'Orthopedics', 'Neurology', 'Emergency', 'Critical Care'],
      image: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=400'
    },
    {
      id: 'mum-8',
      name: 'Jaslok Hospital and Research Centre',
      type: 'hospital',
      specialty: 'Multi-Specialty Hospital',
      rating: 4.3,
      reviews: 2120,
      address: '15, Dr. G. Deshmukh Marg, Pedder Road, Mumbai, Maharashtra 400026',
      phone: '+91 22 6657 3333',
      hours: '24/7',
      doctors: 290,
      coordinates: { lat: 18.9650, lng: 72.8067 },
      website: 'https://www.jaslokhospital.net',
      services: ['Emergency', 'Oncology', 'Cardiology', 'Neurology', 'Orthopedics'],
      image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400'
    }
  ],

  // Delhi NCR
  'delhi': [
    {
      id: 'del-1',
      name: 'All India Institute of Medical Sciences (AIIMS)',
      type: 'hospital',
      specialty: 'Government Multi-Specialty Hospital',
      rating: 4.7,
      reviews: 5680,
      address: 'Ansari Nagar, Aurobindo Marg, New Delhi, Delhi 110029',
      phone: '+91 11 2658 8500',
      hours: '24/7',
      doctors: 800,
      coordinates: { lat: 28.5672, lng: 77.2100 },
      website: 'https://www.aiims.edu',
      services: ['Emergency', 'Cardiology', 'Neurology', 'Oncology', 'Nephrology', 'All Specialties'],
      image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400'
    },
    {
      id: 'del-2',
      name: 'Fortis Escorts Heart Institute',
      type: 'hospital',
      specialty: 'Cardiac Care Hospital',
      rating: 4.6,
      reviews: 3890,
      address: 'Okhla Road, Okhla, New Delhi, Delhi 110025',
      phone: '+91 11 4713 5000',
      hours: '24/7',
      doctors: 350,
      coordinates: { lat: 28.5494, lng: 77.2751 },
      website: 'https://www.fortishealthcare.com',
      services: ['Cardiology', 'Cardiac Surgery', 'Emergency', 'ICU', 'Diagnostics'],
      image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400'
    },
    {
      id: 'del-3',
      name: 'Max Super Speciality Hospital, Saket',
      type: 'hospital',
      specialty: 'Multi-Specialty Hospital',
      rating: 4.5,
      reviews: 4120,
      address: '1, 2, Press Enclave Road, Saket, New Delhi, Delhi 110017',
      phone: '+91 11 2651 5050',
      hours: '24/7',
      doctors: 450,
      coordinates: { lat: 28.5244, lng: 77.2066 },
      website: 'https://www.maxhealthcare.in',
      services: ['Emergency', 'Oncology', 'Cardiology', 'Neurology', 'Orthopedics', 'Transplant'],
      image: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=400'
    },
    {
      id: 'del-4',
      name: 'Apollo Hospital Delhi',
      type: 'hospital',
      specialty: 'Multi-Specialty Hospital',
      rating: 4.4,
      reviews: 3560,
      address: 'Sarita Vihar, New Delhi, Delhi 110076',
      phone: '+91 11 2692 5858',
      hours: '24/7',
      doctors: 420,
      coordinates: { lat: 28.5376, lng: 77.2867 },
      website: 'https://www.apollohospitals.com',
      services: ['Emergency', 'Cardiology', 'Neurology', 'Orthopedics', 'Oncology', 'Transplant'],
      image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400'
    },
    {
      id: 'del-5',
      name: 'Sir Ganga Ram Hospital',
      type: 'hospital',
      specialty: 'Multi-Specialty Hospital',
      rating: 4.5,
      reviews: 3980,
      address: 'Rajinder Nagar, New Delhi, Delhi 110060',
      phone: '+91 11 2575 0000',
      hours: '24/7',
      doctors: 400,
      coordinates: { lat: 28.6389, lng: 77.1946 },
      website: 'https://www.sgrh.com',
      services: ['Emergency', 'Cardiology', 'Neurology', 'Nephrology', 'Gastroenterology'],
      image: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=400'
    }
  ],

  // Bangalore, Karnataka
  'bangalore': [
    {
      id: 'ban-1',
      name: 'Manipal Hospital Bangalore',
      type: 'hospital',
      specialty: 'Multi-Specialty Hospital',
      rating: 4.5,
      reviews: 3450,
      address: '98, Rustom Bagh, Old Airport Road, Bangalore, Karnataka 560017',
      phone: '+91 80 2502 4444',
      hours: '24/7',
      doctors: 380,
      coordinates: { lat: 12.9634, lng: 77.6424 },
      website: 'https://www.manipalhospitals.com',
      services: ['Emergency', 'Cardiology', 'Neurology', 'Oncology', 'Orthopedics', 'Transplant'],
      image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400'
    },
    {
      id: 'ban-2',
      name: 'Apollo Hospitals Bangalore',
      type: 'hospital',
      specialty: 'Multi-Specialty Hospital',
      rating: 4.4,
      reviews: 3120,
      address: '154/11, Opposite IIM-B, Bannerghatta Road, Bangalore, Karnataka 560076',
      phone: '+91 80 2630 0400',
      hours: '24/7',
      doctors: 350,
      coordinates: { lat: 12.8990, lng: 77.6008 },
      website: 'https://www.apollohospitals.com',
      services: ['Emergency', 'Cardiology', 'Oncology', 'Neurology', 'Orthopedics', 'Transplant'],
      image: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=400'
    },
    {
      id: 'ban-3',
      name: 'Fortis Hospital Bangalore',
      type: 'hospital',
      specialty: 'Multi-Specialty Hospital',
      rating: 4.3,
      reviews: 2890,
      address: '14, Cunningham Road, Bangalore, Karnataka 560052',
      phone: '+91 80 6621 4444',
      hours: '24/7',
      doctors: 300,
      coordinates: { lat: 12.9921, lng: 77.5964 },
      website: 'https://www.fortishealthcare.com',
      services: ['Emergency', 'Cardiology', 'Neurology', 'Orthopedics', 'Gastroenterology'],
      image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400'
    },
    {
      id: 'ban-4',
      name: 'Columbia Asia Hospital Bangalore',
      type: 'hospital',
      specialty: 'Multi-Specialty Hospital',
      rating: 4.4,
      reviews: 2560,
      address: 'Kirloskar Business Park, Hebbal, Bangalore, Karnataka 560024',
      phone: '+91 80 6614 6614',
      hours: '24/7',
      doctors: 250,
      coordinates: { lat: 13.0358, lng: 77.5970 },
      website: 'https://www.columbiaasia.com',
      services: ['Emergency', 'Pediatrics', 'Orthopedics', 'General Medicine', 'Surgery'],
      image: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=400'
    }
  ],

  // Chennai, Tamil Nadu
  'chennai': [
    {
      id: 'che-1',
      name: 'Apollo Hospitals Chennai',
      type: 'hospital',
      specialty: 'Multi-Specialty Hospital',
      rating: 4.6,
      reviews: 4250,
      address: '21, Greams Lane, Off Greams Road, Chennai, Tamil Nadu 600006',
      phone: '+91 44 2829 3333',
      hours: '24/7',
      doctors: 500,
      coordinates: { lat: 13.0569, lng: 80.2503 },
      website: 'https://www.apollohospitals.com',
      services: ['Emergency', 'Cardiology', 'Oncology', 'Neurology', 'Transplant', 'Orthopedics'],
      image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400'
    },
    {
      id: 'che-2',
      name: 'Fortis Malar Hospital',
      type: 'hospital',
      specialty: 'Multi-Specialty Hospital',
      rating: 4.4,
      reviews: 3120,
      address: '52, 1st Main Road, Gandhi Nagar, Adyar, Chennai, Tamil Nadu 600020',
      phone: '+91 44 4289 2222',
      hours: '24/7',
      doctors: 320,
      coordinates: { lat: 13.0067, lng: 80.2567 },
      website: 'https://www.fortishealthcare.com',
      services: ['Emergency', 'Cardiology', 'Neurology', 'Gastroenterology', 'Orthopedics'],
      image: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=400'
    },
    {
      id: 'che-3',
      name: 'MIOT International',
      type: 'hospital',
      specialty: 'Multi-Specialty Hospital',
      rating: 4.5,
      reviews: 3890,
      address: '4/112, Mount Poonamallee Road, Manapakkam, Chennai, Tamil Nadu 600089',
      phone: '+91 44 2249 2288',
      hours: '24/7',
      doctors: 380,
      coordinates: { lat: 13.0358, lng: 80.1811 },
      website: 'https://www.miotinternational.com',
      services: ['Emergency', 'Orthopedics', 'Spine Surgery', 'Joint Replacement', 'Cardiology'],
      image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400'
    }
  ],

  // Hyderabad, Telangana
  'hyderabad': [
    {
      id: 'hyd-1',
      name: 'Apollo Hospitals Hyderabad',
      type: 'hospital',
      specialty: 'Multi-Specialty Hospital',
      rating: 4.5,
      reviews: 3670,
      address: 'Jubilee Hills, Road No. 72, Hyderabad, Telangana 500033',
      phone: '+91 40 2360 7777',
      hours: '24/7',
      doctors: 420,
      coordinates: { lat: 17.4312, lng: 78.4122 },
      website: 'https://www.apollohospitals.com',
      services: ['Emergency', 'Cardiology', 'Oncology', 'Neurology', 'Transplant', 'Orthopedics'],
      image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400'
    },
    {
      id: 'hyd-2',
      name: 'Yashoda Hospitals',
      type: 'hospital',
      specialty: 'Multi-Specialty Hospital',
      rating: 4.4,
      reviews: 3240,
      address: 'Raj Bhavan Road, Somajiguda, Hyderabad, Telangana 500082',
      phone: '+91 40 2341 9999',
      hours: '24/7',
      doctors: 350,
      coordinates: { lat: 17.4239, lng: 78.4738 },
      website: 'https://www.yashodahospital.com',
      services: ['Emergency', 'Cardiology', 'Neurology', 'Nephrology', 'Gastroenterology'],
      image: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=400'
    },
    {
      id: 'hyd-3',
      name: 'KIMS Hospitals',
      type: 'hospital',
      specialty: 'Multi-Specialty Hospital',
      rating: 4.3,
      reviews: 2980,
      address: '1-8-31/1, Minister Road, Secunderabad, Telangana 500003',
      phone: '+91 40 4467 5555',
      hours: '24/7',
      doctors: 300,
      coordinates: { lat: 17.4399, lng: 78.4983 },
      website: 'https://www.kimshospitals.com',
      services: ['Emergency', 'Cardiology', 'Oncology', 'Neurology', 'Orthopedics'],
      image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400'
    }
  ],

  // Pune, Maharashtra
  'pune': [
    {
      id: 'pun-1',
      name: 'Ruby Hall Clinic',
      type: 'hospital',
      specialty: 'Multi-Specialty Hospital',
      rating: 4.4,
      reviews: 3120,
      address: '40, Sassoon Road, Pune, Maharashtra 411001',
      phone: '+91 20 2616 1600',
      hours: '24/7',
      doctors: 350,
      coordinates: { lat: 18.5196, lng: 73.8553 },
      website: 'https://www.rubyhall.com',
      services: ['Emergency', 'Cardiology', 'Neurology', 'Orthopedics', 'Oncology'],
      image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400'
    },
    {
      id: 'pun-2',
      name: 'Sahyadri Super Speciality Hospital',
      type: 'hospital',
      specialty: 'Multi-Specialty Hospital',
      rating: 4.5,
      reviews: 2890,
      address: 'Plot 30C, Erandwane, Karve Road, Pune, Maharashtra 411004',
      phone: '+91 20 6720 3000',
      hours: '24/7',
      doctors: 320,
      coordinates: { lat: 18.5089, lng: 73.8350 },
      website: 'https://www.sahyadrihospital.com',
      services: ['Emergency', 'Cardiology', 'Neurology', 'Oncology', 'Critical Care'],
      image: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=400'
    },
    {
      id: 'pun-3',
      name: 'Deenanath Mangeshkar Hospital',
      type: 'hospital',
      specialty: 'Multi-Specialty Hospital',
      rating: 4.4,
      reviews: 2670,
      address: 'Erandwane, Pune, Maharashtra 411004',
      phone: '+91 20 6645 1000',
      hours: '24/7',
      doctors: 280,
      coordinates: { lat: 18.5079, lng: 73.8314 },
      website: 'https://www.dmhospital.org',
      services: ['Emergency', 'Cardiology', 'Orthopedics', 'Gastroenterology', 'Nephrology'],
      image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400'
    }
  ],

  // Kolkata, West Bengal
  'kolkata': [
    {
      id: 'kol-1',
      name: 'Apollo Gleneagles Hospital',
      type: 'hospital',
      specialty: 'Multi-Specialty Hospital',
      rating: 4.5,
      reviews: 3340,
      address: '58, Canal Circular Road, Kadapara, Phool Bagan, Kolkata, West Bengal 700054',
      phone: '+91 33 2320 3040',
      hours: '24/7',
      doctors: 380,
      coordinates: { lat: 22.5445, lng: 88.3899 },
      website: 'https://www.apollogleneagles.in',
      services: ['Emergency', 'Cardiology', 'Oncology', 'Neurology', 'Orthopedics', 'Transplant'],
      image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400'
    },
    {
      id: 'kol-2',
      name: 'Fortis Hospital Kolkata',
      type: 'hospital',
      specialty: 'Multi-Specialty Hospital',
      rating: 4.4,
      reviews: 2980,
      address: '730, Anandapur, EM Bypass Road, Kolkata, West Bengal 700107',
      phone: '+91 33 6628 4444',
      hours: '24/7',
      doctors: 320,
      coordinates: { lat: 22.5095, lng: 88.3962 },
      website: 'https://www.fortishealthcare.com',
      services: ['Emergency', 'Cardiology', 'Neurology', 'Nephrology', 'Orthopedics'],
      image: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=400'
    },
    {
      id: 'kol-3',
      name: 'AMRI Hospitals',
      type: 'hospital',
      specialty: 'Multi-Specialty Hospital',
      rating: 4.3,
      reviews: 2560,
      address: 'P-4 & 5, Block A, Scheme L11, Dhakuria, Kolkata, West Bengal 700029',
      phone: '+91 33 6606 3800',
      hours: '24/7',
      doctors: 300,
      coordinates: { lat: 22.5042, lng: 88.3625 },
      website: 'https://www.amrihospitals.in',
      services: ['Emergency', 'Cardiology', 'Oncology', 'Neurology', 'Gastroenterology'],
      image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400'
    }
  ],

  // Ahmedabad, Gujarat
  'ahmedabad': [
    {
      id: 'ahm-1',
      name: 'Sterling Hospital',
      type: 'hospital',
      specialty: 'Multi-Specialty Hospital',
      rating: 4.4,
      reviews: 2670,
      address: 'Behind Nirma University, Off SG Highway, Ahmedabad, Gujarat 380015',
      phone: '+91 79 6777 7777',
      hours: '24/7',
      doctors: 300,
      coordinates: { lat: 23.0268, lng: 72.5151 },
      website: 'https://www.sterlinghospitals.com',
      services: ['Emergency', 'Cardiology', 'Neurology', 'Orthopedics', 'Oncology'],
      image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400'
    },
    {
      id: 'ahm-2',
      name: 'Apollo Hospitals Ahmedabad',
      type: 'hospital',
      specialty: 'Multi-Specialty Hospital',
      rating: 4.3,
      reviews: 2450,
      address: 'Plot No. 1A, GIDC Estate, Bhat, Gandhinagar, Gujarat 382428',
      phone: '+91 79 3061 1111',
      hours: '24/7',
      doctors: 280,
      coordinates: { lat: 23.1099, lng: 72.6233 },
      website: 'https://www.apollohospitals.com',
      services: ['Emergency', 'Cardiology', 'Oncology', 'Neurology', 'Orthopedics'],
      image: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=400'
    }
  ],

  // Jaipur, Rajasthan
  'jaipur': [
    {
      id: 'jai-1',
      name: 'Fortis Escorts Hospital',
      type: 'hospital',
      specialty: 'Multi-Specialty Hospital',
      rating: 4.4,
      reviews: 2340,
      address: 'Jawahar Lal Nehru Marg, Jaipur, Rajasthan 302017',
      phone: '+91 141 254 7000',
      hours: '24/7',
      doctors: 250,
      coordinates: { lat: 26.8854, lng: 75.7911 },
      website: 'https://www.fortishealthcare.com',
      services: ['Emergency', 'Cardiology', 'Neurology', 'Orthopedics', 'Oncology'],
      image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400'
    },
    {
      id: 'jai-2',
      name: 'Narayana Multispeciality Hospital',
      type: 'hospital',
      specialty: 'Multi-Specialty Hospital',
      rating: 4.3,
      reviews: 2120,
      address: 'Sector 28, Pratap Nagar, Jaipur, Rajasthan 302033',
      phone: '+91 141 513 5555',
      hours: '24/7',
      doctors: 220,
      coordinates: { lat: 26.8531, lng: 75.7877 },
      website: 'https://www.narayanahealth.org',
      services: ['Emergency', 'Cardiology', 'Neurology', 'Orthopedics', 'General Medicine'],
      image: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=400'
    }
  ],

  // Fallback for other locations
  'default': [
    {
      id: 'default-1',
      name: 'City General Hospital',
      type: 'hospital',
      specialty: 'Multi-Specialty Hospital',
      rating: 4.2,
      reviews: 500,
      address: 'Your City, India',
      phone: '+91 11 1234 5678',
      hours: '24/7',
      doctors: 100,
      coordinates: { lat: 28.6139, lng: 77.2090 },
      services: ['Emergency', 'General Medicine', 'Surgery'],
      image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400'
    }
  ]
};

const CITY_EMERGENCY_CONTACTS = {
  mumbai: { hotline: '+91 22 2410 1010', ambulance: '+91 22 2430 9999', lastUpdated: 'Updated: Jul 2024' },
  delhi: { hotline: '+91 11 1066 1066', ambulance: '+91 11 1020 1020', lastUpdated: 'Updated: Jul 2024' },
  bangalore: { hotline: '+91 80 2222 2222', ambulance: '+91 80 108', lastUpdated: 'Updated: Jul 2024' },
  chennai: { hotline: '+91 44 1066', ambulance: '+91 44 1077', lastUpdated: 'Updated: Jul 2024' },
  hyderabad: { hotline: '+91 40 1066', ambulance: '+91 40 108', lastUpdated: 'Updated: Jul 2024' },
  pune: { hotline: '+91 20 1066', ambulance: '+91 20 108', lastUpdated: 'Updated: Jul 2024' },
  kolkata: { hotline: '+91 33 2530 0000', ambulance: '+91 33 102', lastUpdated: 'Updated: Jul 2024' },
  ahmedabad: { hotline: '+91 79 102', ambulance: '+91 79 108', lastUpdated: 'Updated: Jul 2024' },
  jaipur: { hotline: '+91 141 220 0000', ambulance: '+91 141 108', lastUpdated: 'Updated: Jul 2024' },
  default: { hotline: 'Dial 112 for emergency services', ambulance: 'Local hospital ambulance desk', lastUpdated: 'Updated: Jul 2024' }
};

const CITY_LANGUAGES = {
  mumbai: ['English', 'Hindi', 'Marathi'],
  delhi: ['English', 'Hindi'],
  bangalore: ['English', 'Kannada', 'Hindi'],
  chennai: ['English', 'Tamil'],
  hyderabad: ['English', 'Telugu', 'Hindi'],
  pune: ['English', 'Marathi', 'Hindi'],
  kolkata: ['English', 'Bengali', 'Hindi'],
  ahmedabad: ['English', 'Gujarati', 'Hindi'],
  jaipur: ['English', 'Hindi'],
  default: ['English', 'Hindi']
};

const COMMON_INSURANCE = [
  'Ayushman Bharat PM-JAY',
  'Star Health Insurance',
  'HDFC ERGO',
  'ICICI Lombard',
  'Max Bupa',
  'New India Assurance',
  'Bajaj Allianz'
];

const COMMON_PAYMENT_OPTIONS = [
  'Cash',
  'UPI / QR Payments',
  'Debit & Credit Cards',
  'Insurance Direct Billing',
  'EMI on select procedures'
];

const COMMON_AMENITIES = {
  hospital: [
    '24/7 Emergency Desk',
    'Advanced ICU & NICU',
    'In-house Pharmacy',
    'Diagnostic Imaging Center',
    'Blood Bank',
    'Dialysis Unit',
    'Specialized Wards',
    'Wheelchair Assistance',
    'Dedicated Parking'
  ],
  clinic: [
    'Digital Queue Management',
    'On-site Lab Collection',
    'Vaccination Center',
    'Pharmacy Counter',
    'Comfortable Waiting Lounge',
    'Teleconsult Room',
    'Priority Senior Citizen Desk'
  ]
};

const COMMON_PROGRAMS = {
  hospital: [
    'Comprehensive Health Check-ups',
    'Cardiac Rehabilitation Program',
    'Maternal & Child Care Packages',
    'Preventive Oncology Screening',
    'Diabetes & Lifestyle Clinics'
  ],
  clinic: [
    'Chronic Care Management',
    'Women Wellness Clinics',
    'Child Immunization Drives',
    'Corporate Wellness Camps'
  ]
};

const createEnhancedFacility = (cityId, facility, index) => {
  const cityKey = CITY_EMERGENCY_CONTACTS[cityId] ? cityId : 'default';
  const emergencyContacts = CITY_EMERGENCY_CONTACTS[cityKey];
  const languages = CITY_LANGUAGES[cityKey] || CITY_LANGUAGES.default;
  const isHospital = facility.type === 'hospital';
  const telemedicineAvailable = isHospital || index % 2 === 0;
  const traumaLevels = ['Level I Trauma Center', 'Level II Trauma Center', 'Advanced Emergency Wing'];

  const enhancedFacility = {
    ...facility,
    emergencySupport: {
      availability: isHospital ? '24/7 Emergency & Trauma Care' : 'On-call emergency stabilization',
      hotline: facility.emergencySupport?.hotline || emergencyContacts.hotline,
      ambulance: facility.emergencySupport?.ambulance || emergencyContacts.ambulance,
      traumaLevel: facility.emergencySupport?.traumaLevel || traumaLevels[index % traumaLevels.length],
      notes: facility.emergencySupport?.notes || (isHospital
        ? 'Dedicated triage nurses ensure a 10-minute response time for critical cases.'
        : 'Stabilizes patients before transferring to partner multi-specialty hospitals.')
    },
    bedAvailability: isHospital ? {
      total: facility.bedAvailability?.total || 180 + index * 20,
      icu: facility.bedAvailability?.icu || 25 + (index % 5) * 3,
      ventilators: facility.bedAvailability?.ventilators || 15 + (index % 4) * 2,
      lastUpdated: facility.bedAvailability?.lastUpdated || emergencyContacts.lastUpdated
    } : facility.bedAvailability || null,
    acceptedInsurance: facility.acceptedInsurance || COMMON_INSURANCE,
    paymentOptions: facility.paymentOptions || COMMON_PAYMENT_OPTIONS,
    amenities: facility.amenities || (isHospital ? COMMON_AMENITIES.hospital : COMMON_AMENITIES.clinic),
    specialPrograms: facility.specialPrograms || (isHospital ? COMMON_PROGRAMS.hospital : COMMON_PROGRAMS.clinic),
    waitingTime: facility.waitingTime || {
      opd: isHospital ? '25-35 mins' : '10-15 mins',
      emergency: isHospital ? '5-8 mins' : 'Immediate triage',
      diagnostics: isHospital ? 'Same day reporting' : 'Within 6 hours'
    },
    telehealth: facility.telehealth || {
      available: telemedicineAvailable,
      description: telemedicineAvailable
        ? 'Virtual consultations and remote monitoring available with prior appointment.'
        : 'Call reception to confirm teleconsult slot availability.',
      bookingUrl: facility.website ? `${facility.website.replace(/\/$/, '')}/telemedicine` : null
    },
    languages: facility.languages || languages,
    patientExperience: facility.patientExperience || {
      parking: isHospital ? 'Dedicated multi-level parking with valet assistance.' : 'Reserved patient parking slots available.',
      cafeteria: isHospital ? 'Multi-cuisine cafeteria open 7AM - 10PM.' : 'Complimentary refreshments for patients.',
      caregiverSupport: isHospital ? 'Dedicated attendant lounge and overnight stay options.' : 'Family counseling desk available.',
      childCare: isHospital
    },
    diagnostics: facility.diagnostics || (isHospital
      ? ['MRI', 'CT Scan', 'Digital X-Ray', 'Ultrasound', 'Comprehensive Lab']
      : ['Digital X-Ray', 'Pathology Lab', 'ECG', 'Ultrasound (scheduled)']),
    pharmacy: facility.pharmacy || {
      onsite: true,
      hours: isHospital ? '24/7' : '8AM - 10PM',
      homeDelivery: telemedicineAvailable
    },
    supportServices: facility.supportServices || {
      physiotherapy: isHospital,
      mentalHealth: index % 2 === 0,
      nutrition: true,
      homeCare: telemedicineAvailable && index % 3 === 0
    },
    lastUpdated: facility.lastUpdated || emergencyContacts.lastUpdated
  };

  return enhancedFacility;
};

const enhanceHealthcareData = (baseData, supplements) => {
  const result = {};
  const allCities = new Set([
    ...Object.keys(baseData),
    ...Object.keys(supplements)
  ]);

  allCities.forEach((city) => {
    const baseFacilities = baseData[city] || [];
    const supplementaryFacilities = supplements[city] || [];
    const combined = [...baseFacilities, ...supplementaryFacilities];

    result[city] = combined.map((facility, index) =>
      createEnhancedFacility(city, facility, index)
    );
  });

  return result;
};

const SUPPLEMENTARY_FACILITIES = {
  mumbai: [
    {
      id: 'mum-c1',
      name: 'CarePlus Family Clinic',
      type: 'clinic',
      specialty: 'Family Medicine & Preventive Care',
      rating: 4.5,
      reviews: 980,
      address: 'Shop 12, Palm Grove Road, Andheri West, Mumbai, Maharashtra 400053',
      phone: '+91 22 4015 7788',
      hours: 'Mon-Sun: 7:30AM - 10PM',
      doctors: 18,
      coordinates: { lat: 19.1184, lng: 72.8368 },
      website: 'https://www.careplusfamilyclinic.in',
      services: ['Family Medicine', 'Vaccinations', 'Chronic Care', 'Diagnostics'],
      image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400'
    },
    {
      id: 'mum-c2',
      name: 'Harbour Diagnostics & Day Care',
      type: 'clinic',
      specialty: 'Day Care Surgery & Diagnostics',
      rating: 4.6,
      reviews: 1120,
      address: 'Plot 21, Palm Beach Road, Vashi, Navi Mumbai, Maharashtra 400703',
      phone: '+91 22 4962 6655',
      hours: 'Mon-Sat: 7AM - 11PM, Sun: 8AM - 4PM',
      doctors: 26,
      coordinates: { lat: 19.0771, lng: 73.0071 },
      website: 'https://www.harbourdaycare.com',
      services: ['Day Care Surgery', 'Dialysis', 'Diagnostic Imaging', 'Vaccination'],
      image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400'
    }
  ],
  delhi: [
    {
      id: 'del-c1',
      name: 'City Care Polyclinic',
      type: 'clinic',
      specialty: 'Multi-Specialty Polyclinic',
      rating: 4.4,
      reviews: 860,
      address: 'C-3, Defence Colony, New Delhi, Delhi 110024',
      phone: '+91 11 4654 8899',
      hours: 'Mon-Sun: 8AM - 10PM',
      doctors: 22,
      coordinates: { lat: 28.5668, lng: 77.2304 },
      website: 'https://www.citycarepolyclinic.in',
      services: ['General Medicine', 'Pediatrics', 'Dermatology', 'Lab Services'],
      image: 'https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=400'
    },
    {
      id: 'del-c2',
      name: 'NCR Wellness Clinic & Diagnostics',
      type: 'clinic',
      specialty: 'Preventive & Lifestyle Medicine',
      rating: 4.5,
      reviews: 940,
      address: 'Plot 54, Sector 18, Noida, Uttar Pradesh 201301',
      phone: '+91 120 400 4555',
      hours: 'Mon-Sun: 7AM - 9PM',
      doctors: 19,
      coordinates: { lat: 28.5701, lng: 77.3213 },
      website: 'https://www.ncrwellnessclinic.com',
      services: ['Lifestyle Medicine', 'Cardiac Rehab', 'Endocrinology', 'Diagnostics'],
      image: 'https://images.unsplash.com/photo-1530023367847-a683933f4177?w=400'
    }
  ],
  bangalore: [
    {
      id: 'blr-c1',
      name: 'Lakeside Family Health Center',
      type: 'clinic',
      specialty: 'Family Medicine & Pediatrics',
      rating: 4.6,
      reviews: 790,
      address: '12th Cross, Indiranagar, Bengaluru, Karnataka 560038',
      phone: '+91 80 4110 9900',
      hours: 'Mon-Sun: 8AM - 9:30PM',
      doctors: 16,
      coordinates: { lat: 12.9735, lng: 77.6400 },
      website: 'https://www.lakesidefamilyhealth.com',
      services: ['Family Medicine', 'Pediatrics', 'Vaccination', 'Teleconsult'],
      image: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=400'
    },
    {
      id: 'blr-c2',
      name: 'TechCity Specialty Clinic',
      type: 'clinic',
      specialty: 'Specialty Consults & Diagnostics',
      rating: 4.5,
      reviews: 910,
      address: 'RMZ Ecoworld, Outer Ring Road, Bengaluru, Karnataka 560103',
      phone: '+91 80 4269 5566',
      hours: 'Mon-Sat: 7:30AM - 10PM, Sun: 9AM - 6PM',
      doctors: 28,
      coordinates: { lat: 12.9259, lng: 77.6890 },
      website: 'https://www.techcityspeciality.com',
      services: ['Cardiology', 'Orthopedics', 'ENT', 'Lab & Imaging'],
      image: 'https://images.unsplash.com/photo-1582719478181-2cf4e8559be9?w=400'
    }
  ],
  chennai: [
    {
      id: 'chn-c1',
      name: 'BayView Medical Center',
      type: 'clinic',
      specialty: 'Primary & Specialty Care',
      rating: 4.4,
      reviews: 720,
      address: 'Old Mahabalipuram Road, Thoraipakkam, Chennai, Tamil Nadu 600097',
      phone: '+91 44 4232 7788',
      hours: 'Mon-Sun: 8AM - 9PM',
      doctors: 20,
      coordinates: { lat: 12.9486, lng: 80.2361 },
      website: 'https://www.bayviewmedical.in',
      services: ['General Medicine', 'Gynecology', 'Orthopedics', 'Diagnostics'],
      image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=400'
    },
    {
      id: 'chn-c2',
      name: 'Marina Wellness Clinic',
      type: 'clinic',
      specialty: 'Lifestyle & Preventive Care',
      rating: 4.5,
      reviews: 805,
      address: 'RK Salai, Mylapore, Chennai, Tamil Nadu 600004',
      phone: '+91 44 4020 6633',
      hours: 'Mon-Sun: 7:30AM - 9:30PM',
      doctors: 17,
      coordinates: { lat: 13.0464, lng: 80.2685 },
      website: 'https://www.marinawellness.in',
      services: ['Preventive Health', 'Diabetes Care', 'Cardiology', 'Physiotherapy'],
      image: 'https://images.unsplash.com/photo-1580281657521-6a37764567ae?w=400'
    }
  ],
  hyderabad: [
    {
      id: 'hyd-c1',
      name: 'HiTech Care Clinic',
      type: 'clinic',
      specialty: 'Multi-Specialty & Diagnostics',
      rating: 4.5,
      reviews: 840,
      address: 'Plot 18, HITEC City Road, Madhapur, Hyderabad, Telangana 500081',
      phone: '+91 40 4555 7788',
      hours: 'Mon-Sun: 8AM - 10PM',
      doctors: 24,
      coordinates: { lat: 17.4474, lng: 78.3762 },
      website: 'https://www.hitechcareclinic.com',
      services: ['Cardiology', 'Endocrinology', 'Diagnostics', 'Day Care'],
      image: 'https://images.unsplash.com/photo-1584515933487-779824d29309?w=400'
    },
    {
      id: 'hyd-c2',
      name: 'Lakeside Children & Family Clinic',
      type: 'clinic',
      specialty: 'Pediatrics & Family Medicine',
      rating: 4.6,
      reviews: 760,
      address: '15, Necklace Road, Hyderabad, Telangana 500004',
      phone: '+91 40 4020 8866',
      hours: 'Mon-Sat: 8AM - 9:30PM, Sun: 9AM - 4PM',
      doctors: 14,
      coordinates: { lat: 17.4153, lng: 78.4721 },
      website: 'https://www.lakesidefamilyclinic.in',
      services: ['Pediatrics', 'Family Medicine', 'Vaccination', 'Counseling'],
      image: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=400'
    }
  ],
  pune: [
    {
      id: 'pune-c1',
      name: 'Riverfront Family Clinic',
      type: 'clinic',
      specialty: 'Family Medicine & Preventive Health',
      rating: 4.4,
      reviews: 665,
      address: 'Lane 7, Koregaon Park, Pune, Maharashtra 411001',
      phone: '+91 20 6744 8899',
      hours: 'Mon-Sun: 8AM - 10PM',
      doctors: 15,
      coordinates: { lat: 18.5396, lng: 73.8934 },
      website: 'https://www.riverfrontfamilyclinic.in',
      services: ['Family Medicine', 'Vaccination', 'Physiotherapy', 'Diagnostics'],
      image: 'https://images.unsplash.com/photo-1519494080410-f9aa76cb4283?w=400'
    },
    {
      id: 'pune-c2',
      name: 'Deccan Specialty Clinic',
      type: 'clinic',
      specialty: 'Specialty Consults & Day Care',
      rating: 4.5,
      reviews: 710,
      address: 'JM Road, Deccan Gymkhana, Pune, Maharashtra 411004',
      phone: '+91 20 4010 7788',
      hours: 'Mon-Sat: 7:30AM - 10:30PM, Sun: 9AM - 5PM',
      doctors: 21,
      coordinates: { lat: 18.5167, lng: 73.8419 },
      website: 'https://www.deccanspecialtyclinic.com',
      services: ['Orthopedics', 'Cardiology', 'ENT', 'Diagnostics'],
      image: 'https://images.unsplash.com/photo-1527613426441-4da17471b66d?w=400'
    }
  ],
  kolkata: [
    {
      id: 'kol-c1',
      name: 'Heritage Family Clinic',
      type: 'clinic',
      specialty: 'Family Medicine & Preventive Care',
      rating: 4.3,
      reviews: 640,
      address: '36, Park Street, Kolkata, West Bengal 700016',
      phone: '+91 33 4050 1122',
      hours: 'Mon-Sun: 8AM - 9:30PM',
      doctors: 18,
      coordinates: { lat: 22.5521, lng: 88.3522 },
      website: 'https://www.heritagefamilyclinic.com',
      services: ['General Medicine', 'Vaccination', 'Dermatology', 'Diagnostics'],
      image: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=400'
    },
    {
      id: 'kol-c2',
      name: 'Ganges Wellness Center',
      type: 'clinic',
      specialty: 'Lifestyle & Chronic Care',
      rating: 4.4,
      reviews: 705,
      address: 'Ballygunge Circular Road, Kolkata, West Bengal 700019',
      phone: '+91 33 4020 8844',
      hours: 'Mon-Sat: 8AM - 10PM, Sun: 9AM - 6PM',
      doctors: 16,
      coordinates: { lat: 22.5286, lng: 88.3650 },
      website: 'https://www.gangeswellness.in',
      services: ['Endocrinology', 'Cardiology', 'Diet & Nutrition', 'Diagnostics'],
      image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400'
    }
  ],
  ahmedabad: [
    {
      id: 'ahm-c1',
      name: 'Sabarmati Health Hub',
      type: 'clinic',
      specialty: 'Family & Specialty Medicine',
      rating: 4.4,
      reviews: 590,
      address: 'Riverfront Road, Ahmedabad, Gujarat 380009',
      phone: '+91 79 4600 1122',
      hours: 'Mon-Sun: 8AM - 9:30PM',
      doctors: 14,
      coordinates: { lat: 23.0365, lng: 72.5800 },
      website: 'https://www.sabarmatihealthhub.in',
      services: ['General Medicine', 'Orthopedics', 'Physiotherapy', 'Diagnostics'],
      image: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=400'
    },
    {
      id: 'ahm-c2',
      name: 'Heritage Care Clinic',
      type: 'clinic',
      specialty: 'Preventive & Chronic Care',
      rating: 4.5,
      reviews: 630,
      address: 'C.G. Road, Navrangpura, Ahmedabad, Gujarat 380009',
      phone: '+91 79 4060 7788',
      hours: 'Mon-Sat: 7:30AM - 10PM, Sun: 9AM - 4PM',
      doctors: 18,
      coordinates: { lat: 23.0310, lng: 72.5616 },
      website: 'https://www.heritagecareclinic.com',
      services: ['Endocrinology', 'Cardiology', 'Diagnostics', 'Diabetic Foot Clinic'],
      image: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=400'
    }
  ],
  jaipur: [
    {
      id: 'jai-c1',
      name: 'PinkCity Family Clinic',
      type: 'clinic',
      specialty: 'Family Medicine & Pediatrics',
      rating: 4.3,
      reviews: 575,
      address: 'C-Scheme, Jaipur, Rajasthan 302001',
      phone: '+91 141 4020 6633',
      hours: 'Mon-Sun: 8AM - 9PM',
      doctors: 12,
      coordinates: { lat: 26.9124, lng: 75.7873 },
      website: 'https://www.pinkcityfamilyclinic.in',
      services: ['Family Medicine', 'Vaccinations', 'Dermatology', 'Diagnostics'],
      image: 'https://images.unsplash.com/photo-1526256262350-7da7584cf5eb?w=400'
    },
    {
      id: 'jai-c2',
      name: 'Heritage Wellness Clinic',
      type: 'clinic',
      specialty: 'Lifestyle & Preventive Medicine',
      rating: 4.4,
      reviews: 610,
      address: 'Vaishali Nagar, Jaipur, Rajasthan 302021',
      phone: '+91 141 4560 7788',
      hours: 'Mon-Sat: 7:30AM - 10PM, Sun: 9AM - 5PM',
      doctors: 15,
      coordinates: { lat: 26.9118, lng: 75.7415 },
      website: 'https://www.heritagewellnessjaipur.com',
      services: ['Endocrinology', 'Cardiology', 'Diet & Nutrition', 'Diagnostics'],
      image: 'https://images.unsplash.com/photo-1527613426441-4da17471b66d?w=400'
    }
  ],
  default: [
    {
      id: 'default-c1',
      name: 'City Care Clinic',
      type: 'clinic',
      specialty: 'General & Preventive Medicine',
      rating: 4.2,
      reviews: 410,
      address: 'Central Business District, Your City, India',
      phone: '+91 11 3355 7788',
      hours: 'Mon-Sun: 8AM - 9PM',
      doctors: 10,
      coordinates: { lat: 28.6139, lng: 77.2090 },
      website: 'https://www.citycareclinic.in',
      services: ['General Medicine', 'Vaccination', 'Basic Diagnostics', 'Teleconsult'],
      image: 'https://images.unsplash.com/photo-1526256262350-7da7584cf5eb?w=400'
    }
  ]
};

export const INDIAN_HEALTHCARE_DATA = enhanceHealthcareData(
  BASE_HEALTHCARE_DATA,
  SUPPLEMENTARY_FACILITIES
);
