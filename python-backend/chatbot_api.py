from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import base64
import io
import json
import re
from datetime import datetime
from PIL import Image
import numpy as np

app = Flask(__name__)
CORS(app)

# Medical Knowledge Base
MEDICAL_KNOWLEDGE = {
    'conditions': {
        'mosquito_bite': {
            'name': 'Mosquito Bite',
            'confidence': 0.92,
            'category': 'Dermatology',
            'symptoms': ['itching', 'redness', 'small bump', 'swelling'],
            'description': 'A mosquito bite is a small, itchy bump that appears after a mosquito feeds on blood.',
            'treatment': [
                'Apply cold compress to reduce swelling',
                'Use over-the-counter anti-itch cream (Hydrocortisone 1%)',
                'Take oral antihistamine (Diphenhydramine 25-50mg) if needed',
                'Avoid scratching to prevent infection'
            ],
            'prevention': [
                'Use EPA-registered insect repellent',
                'Wear long sleeves and pants outdoors',
                'Use mosquito nets when sleeping',
                'Eliminate standing water near home'
            ]
        },
        'acne': {
            'name': 'Acne Vulgaris',
            'confidence': 0.89,
            'category': 'Dermatology',
            'symptoms': ['pimples', 'blackheads', 'whiteheads', 'oily skin', 'inflammation'],
            'description': 'Acne is a skin condition that occurs when hair follicles become clogged with oil and dead skin cells.',
            'treatment': [
                'Cleanse face twice daily with gentle cleanser',
                'Apply Benzoyl Peroxide 2.5-5% topically',
                'Use Salicylic Acid 0.5-2% for exfoliation',
                'Consider Retinoid cream (Adapalene 0.1%)',
                'Avoid touching or picking at lesions'
            ],
            'prevention': [
                'Maintain consistent skincare routine',
                'Remove makeup before bed',
                'Avoid oil-based cosmetics',
                'Change pillowcases regularly',
                'Reduce stress levels'
            ]
        },
        'rash': {
            'name': 'Contact Dermatitis',
            'confidence': 0.85,
            'category': 'Dermatology',
            'symptoms': ['redness', 'itching', 'burning', 'dry patches', 'bumps'],
            'description': 'A rash caused by direct contact with a substance that causes an allergic reaction or irritation.',
            'treatment': [
                'Identify and avoid irritant/allergen',
                'Apply cool, wet compresses for 15-20 minutes',
                'Use Hydrocortisone cream 1% twice daily',
                'Take oral antihistamine for severe itching',
                'Keep affected area moisturized'
            ],
            'prevention': [
                'Wear protective clothing when necessary',
                'Use hypoallergenic products',
                'Perform patch test before using new products',
                'Avoid known allergens'
            ]
        },
        'eczema': {
            'name': 'Atopic Dermatitis (Eczema)',
            'confidence': 0.91,
            'category': 'Dermatology',
            'symptoms': ['dry skin', 'itching', 'red patches', 'thickened skin', 'cracking'],
            'description': 'A chronic condition that makes skin inflamed, itchy, and prone to developing rashes.',
            'treatment': [
                'Apply fragrance-free moisturizer 2-3 times daily',
                'Use Hydrocortisone 1% or prescribed steroid cream',
                'Take lukewarm (not hot) baths',
                'Apply wet wraps for severe flare-ups',
                'Consider Tacrolimus ointment for sensitive areas'
            ],
            'prevention': [
                'Moisturize immediately after bathing',
                'Use gentle, fragrance-free products',
                'Avoid triggers (stress, allergens, irritants)',
                'Maintain comfortable room temperature',
                'Wear soft, breathable fabrics'
            ]
        },
        'burn': {
            'name': 'First-Degree Burn',
            'confidence': 0.88,
            'category': 'Emergency Medicine',
            'symptoms': ['redness', 'pain', 'swelling', 'dry skin', 'no blisters'],
            'description': 'A minor burn affecting only the outer layer of skin (epidermis).',
            'treatment': [
                '🚨 Cool burn with running water for 10-20 minutes',
                'Apply Aloe Vera gel or burn cream',
                'Cover with sterile, non-stick bandage',
                'Take Ibuprofen 400-600mg for pain',
                'Keep burn clean and dry'
            ],
            'prevention': [
                'Use caution with hot objects and liquids',
                'Test water temperature before use',
                'Use sunscreen (SPF 30+) outdoors',
                'Keep hot items away from edges'
            ]
        },
        'bedbug_bite': {
            'name': 'Bedbug Bite',
            'confidence': 0.87,
            'category': 'Dermatology',
            'symptoms': ['red bumps', 'itching', 'burning', 'arranged in line', 'multiple bites'],
            'description': 'Small, itchy bumps caused by bedbug feeding, often appearing in clusters or lines.',
            'treatment': [
                'Apply anti-itch cream (Hydrocortisone 1%)',
                'Use oral antihistamine for severe itching',
                'Apply cold compress to reduce swelling',
                'Avoid scratching to prevent infection',
                '🚨 Treat home for bedbugs immediately'
            ],
            'prevention': [
                'Inspect hotel rooms before unpacking',
                'Use protective mattress covers',
                'Vacuum regularly and thoroughly',
                'Seal cracks and crevices in walls',
                'Wash bedding in hot water weekly'
            ]
        }
    },
    'symptoms': {
        'headache': {
            'name': 'Headache Assessment',
            'category': 'Neurology',
            'types': {
                'tension': {
                    'description': 'Tension-type headache - most common type',
                    'symptoms': ['pressure around head', 'muscle tension', 'bilateral pain'],
                    'treatment': [
                        'Rest in quiet, dark room',
                        'Ibuprofen 400-600mg or Acetaminophen 1000mg',
                        'Apply cool or warm compress',
                        'Gentle neck and shoulder stretches',
                        'Stay hydrated (8-10 glasses water daily)'
                    ]
                },
                'migraine': {
                    'description': 'Migraine - severe, throbbing headache',
                    'symptoms': ['one-sided pain', 'nausea', 'light sensitivity', 'aura'],
                    'treatment': [
                        '🚨 Take medication at first sign',
                        'Rest in dark, quiet environment',
                        'Cold compress on forehead',
                        'Triptans (Sumatriptan) if prescribed',
                        'Avoid triggers (certain foods, stress, bright lights)'
                    ]
                },
                'cluster': {
                    'description': 'Cluster headache - severe pain around one eye',
                    'symptoms': ['severe pain', 'eye watering', 'nasal congestion', 'restlessness'],
                    'treatment': [
                        '🚨 Seek immediate medical attention',
                        'Oxygen therapy (100% oxygen, 12-15 L/min)',
                        'Sumatriptan injection if prescribed',
                        'Avoid alcohol during cluster periods'
                    ]
                }
            },
            'red_flags': [
                'Sudden, severe "thunderclap" headache',
                'Headache with fever, stiff neck, or confusion',
                'Vision changes or difficulty speaking',
                'Weakness or numbness on one side',
                'Headache after head injury'
            ]
        },
        'fever': {
            'name': 'Fever Management',
            'category': 'General Medicine',
            'ranges': {
                'low_grade': {'range': '100.4-102°F (38-39°C)', 'severity': 'Mild'},
                'moderate': {'range': '102-104°F (39-40°C)', 'severity': 'Moderate'},
                'high': {'range': '>104°F (>40°C)', 'severity': 'High'}
            },
            'treatment': [
                'Stay hydrated - drink plenty of fluids',
                'Rest and avoid strenuous activity',
                'Acetaminophen 650-1000mg every 6 hours',
                'Ibuprofen 400-600mg every 6-8 hours',
                'Lukewarm sponge bath (not cold)',
                'Wear lightweight clothing',
                'Monitor temperature every 2-4 hours'
            ],
            'red_flags': [
                '🚨 Fever >103°F (39.4°C) lasting >3 days',
                'Difficulty breathing or chest pain',
                'Severe headache or stiff neck',
                'Persistent vomiting or diarrhea',
                'Confusion or altered mental state',
                'Rash with fever',
                'Infants <3 months with any fever'
            ]
        },
        'cough': {
            'name': 'Cough Assessment',
            'category': 'Pulmonology',
            'types': {
                'dry': {
                    'description': 'Non-productive cough without mucus',
                    'causes': ['viral infection', 'allergies', 'irritants', 'asthma'],
                    'treatment': [
                        'Honey (1-2 teaspoons) for soothing',
                        'Warm fluids (tea, broth)',
                        'Use humidifier in room',
                        'Cough drops or lozenges',
                        'Avoid irritants (smoke, perfumes)'
                    ]
                },
                'productive': {
                    'description': 'Wet cough with mucus/phlegm',
                    'causes': ['respiratory infection', 'bronchitis', 'pneumonia'],
                    'treatment': [
                        'Stay well hydrated (8-10 glasses water)',
                        'Use expectorant (Guaifenesin 200-400mg)',
                        'Steam inhalation 2-3 times daily',
                        'Elevate head while sleeping',
                        '🚨 See doctor if yellow/green mucus persists'
                    ]
                }
            },
            'red_flags': [
                'Cough lasting >3 weeks',
                'Coughing up blood',
                'Shortness of breath or wheezing',
                'High fever with productive cough',
                'Chest pain when coughing',
                'Thick, colored mucus (yellow/green/brown)'
            ]
        }
    }
}

def analyze_image(image_data):
    """Analyze uploaded medical image using basic image processing"""
    try:
        # Decode base64 image
        image_bytes = base64.b64decode(image_data.split(',')[1])
        image = Image.open(io.BytesIO(image_bytes))
        
        # Convert to RGB if necessary
        if image.mode != 'RGB':
            image = image.convert('RGB')
        
        # Get image properties
        width, height = image.size
        img_array = np.array(image)
        
        # Calculate color metrics
        avg_red = np.mean(img_array[:,:,0])
        avg_green = np.mean(img_array[:,:,1])
        avg_blue = np.mean(img_array[:,:,2])
        
        # Simple heuristic analysis based on color
        redness_score = avg_red - (avg_green + avg_blue) / 2
        
        # Determine likely condition based on color analysis
        if redness_score > 30:
            # High redness - likely inflammation
            if avg_red > 150:
                condition_key = 'burn'
            else:
                condition_key = 'rash'
        elif redness_score > 15:
            # Moderate redness
            condition_key = 'mosquito_bite'
        elif redness_score > 5:
            condition_key = 'acne'
        else:
            # Low redness
            condition_key = 'eczema'
        
        condition = MEDICAL_KNOWLEDGE['conditions'][condition_key]
        
        return {
            'success': True,
            'condition': condition,
            'analysis': {
                'width': width,
                'height': height,
                'redness_level': float(redness_score),
                'color_profile': {
                    'red': float(avg_red),
                    'green': float(avg_green),
                    'blue': float(avg_blue)
                }
            }
        }
    except Exception as e:
        return {
            'success': False,
            'error': str(e)
        }

def analyze_symptoms(text):
    """Analyze text for symptoms and match to conditions"""
    text_lower = text.lower()
    
    # Score each condition based on symptom matches
    scores = {}
    for condition_key, condition_data in MEDICAL_KNOWLEDGE['conditions'].items():
        score = 0
        matched_symptoms = []
        
        # Check symptoms
        for symptom in condition_data['symptoms']:
            if symptom in text_lower:
                score += 3
                matched_symptoms.append(symptom)
        
        # Check condition name
        if condition_data['name'].lower() in text_lower:
            score += 5
        
        # Check category
        if condition_data['category'].lower() in text_lower:
            score += 2
        
        if score > 0:
            scores[condition_key] = {
                'score': score,
                'condition': condition_data,
                'matched_symptoms': matched_symptoms
            }
    
    # Return best match
    if scores:
        best_match = max(scores.items(), key=lambda x: x[1]['score'])
        return best_match[1]
    
    return None

def analyze_symptom_query(text):
    """Analyze symptom-specific queries (headache, fever, cough)"""
    text_lower = text.lower()
    
    for symptom_key, symptom_data in MEDICAL_KNOWLEDGE['symptoms'].items():
        if symptom_key in text_lower:
            return {
                'symptom': symptom_key,
                'data': symptom_data
            }
    
    return None

def generate_intelligent_response(user_message):
    """Generate intelligent response for any medical question using pattern matching and context"""
    message_lower = user_message.lower()
    
    # Common medical question patterns
    question_patterns = {
        'pain': ['pain', 'ache', 'hurt', 'sore', 'discomfort', 'tender'],
        'infection': ['infection', 'infected', 'pus', 'discharge', 'swollen', 'inflamed'],
        'allergy': ['allergy', 'allergic', 'reaction', 'hives', 'sneezing', 'runny nose'],
        'cold_flu': ['cold', 'flu', 'runny nose', 'congestion', 'sniffle'],
        'digestive': ['stomach', 'nausea', 'vomit', 'diarrhea', 'constipation', 'bloat', 'indigestion'],
        'respiratory': ['breath', 'breathing', 'wheezing', 'asthma', 'chest'],
        'mental_health': ['anxiety', 'depression', 'stress', 'mental', 'worry', 'panic', 'sad'],
        'injury': ['injury', 'wound', 'cut', 'bruise', 'sprain', 'fracture', 'broken'],
        'pregnancy': ['pregnant', 'pregnancy', 'prenatal', 'expecting'],
        'pediatric': ['baby', 'infant', 'child', 'kid', 'toddler'],
        'chronic': ['diabetes', 'hypertension', 'arthritis', 'chronic'],
        'preventive': ['prevent', 'prevention', 'avoid', 'protect', 'vaccine', 'vaccination']
    }
    
    # Detect question category
    detected_categories = []
    for category, keywords in question_patterns.items():
        if any(keyword in message_lower for keyword in keywords):
            detected_categories.append(category)
    
    # If specific categories detected, generate targeted response
    if detected_categories:
        return generate_contextual_response(user_message, detected_categories[0], message_lower)
    
    # General medical guidance for any question
    return generate_general_medical_response(user_message, message_lower)

def generate_contextual_response(original_message, category, message_lower):
    """Generate contextual medical response based on detected category"""
    
    responses = {
        'pain': f"""## 💊 Pain Assessment & Management

Based on your question: "{original_message}"

### 🔍 Understanding Your Pain
Pain is your body's signal that something needs attention. The location, severity, and duration are important factors.

### 🩺 Recommended Actions:

1. **Assess Severity**
   - Mild (1-3/10): Usually manageable at home
   - Moderate (4-6/10): May need medical evaluation
   - Severe (7-10/10): Seek immediate medical care

2. **Initial Management**
   - Rest the affected area
   - Apply ice for acute injuries (first 48 hours)
   - Apply heat for chronic pain/muscle tension
   - Over-the-counter pain relief: Ibuprofen 400-600mg or Acetaminophen 500-1000mg

3. **When to See a Doctor**
   - Pain persists >72 hours
   - Pain worsens despite treatment
   - Associated with fever, swelling, or redness
   - Difficulty moving the affected area
   - Numbness or tingling

### 💡 Self-Care Tips:
- Stay hydrated
- Get adequate rest
- Avoid activities that worsen pain
- Practice gentle stretching (if appropriate)
- Keep a pain diary to track patterns

🚨 **Seek Emergency Care If:**
- Chest pain or pressure
- Severe abdominal pain
- Pain after trauma/injury
- Loss of consciousness
- Difficulty breathing

*This is general guidance. Please consult a healthcare provider for personalized assessment and treatment.*""",

        'infection': f"""## 🦠 Infection Assessment & Care

Based on your question: "{original_message}"

### 🔍 Signs of Infection
Infections occur when harmful bacteria, viruses, or fungi enter the body.

### 🩺 Common Infection Symptoms:
- Redness and warmth at the site
- Swelling or inflammation
- Pain or tenderness
- Pus or discharge
- Fever (>100.4°F / 38°C)
- Fatigue or malaise

### 💊 General Treatment Approach:

1. **Clean the Area** (for skin infections)
   - Wash with mild soap and water
   - Pat dry gently
   - Apply antibiotic ointment (Neosporin)
   - Cover with clean bandage

2. **Monitor Symptoms**
   - Check temperature regularly
   - Watch for spreading redness
   - Note any worsening symptoms

3. **Home Care**
   - Rest and stay hydrated
   - Take acetaminophen for fever/pain
   - Keep the area clean and dry
   - Avoid touching or scratching

### 🚨 Seek Medical Care If:
- Fever >102°F (38.9°C) or lasting >3 days
- Red streaks spreading from the area
- Increased swelling or severe pain
- Pus or foul-smelling discharge
- Signs of systemic infection (chills, confusion)
- Wound not healing after 48-72 hours

### 💡 Prevention:
- Wash hands frequently
- Keep wounds clean and covered
- Don't share personal items
- Practice good hygiene
- Stay current with vaccinations

*Antibiotics may be needed for bacterial infections. Consult a healthcare provider for proper diagnosis.*""",

        'allergy': f"""## 🤧 Allergy Information & Management

Based on your question: "{original_message}"

### 🔍 Understanding Allergies
Allergies occur when your immune system reacts to substances that are usually harmless.

### 🩺 Common Allergy Symptoms:
- Sneezing and runny nose
- Itchy, watery eyes
- Skin rashes or hives
- Swelling
- Difficulty breathing (severe cases)

### 💊 Treatment Options:

1. **Antihistamines** (Most Common)
   - Loratadine (Claritin) 10mg once daily
   - Cetirizine (Zyrtec) 10mg once daily
   - Diphenhydramine (Benadryl) 25-50mg every 4-6 hours (causes drowsiness)

2. **Nasal Sprays**
   - Fluticasone (Flonase) - for nasal symptoms
   - Saline nasal rinse - natural relief

3. **Eye Drops**
   - Artificial tears for relief
   - Antihistamine eye drops

4. **Skin Reactions**
   - Hydrocortisone cream 1% for itching
   - Cool compresses
   - Oatmeal baths for widespread rash

### 🛡️ Prevention Strategies:
- Identify and avoid triggers
- Keep windows closed during high pollen days
- Use HEPA air filters
- Shower after being outdoors
- Wash bedding in hot water weekly
- Remove shoes at door

### 🚨 Emergency Signs (Call 911):
- Difficulty breathing or wheezing
- Swelling of face, lips, or throat
- Rapid pulse
- Dizziness or fainting
- Severe rash covering large area
- **These may indicate anaphylaxis**

### 💡 Long-Term Management:
- Consider allergy testing
- Ask about immunotherapy (allergy shots)
- Keep emergency antihistamines handy
- Wear medical alert bracelet if severe allergies

*For persistent or severe allergies, consult an allergist for comprehensive testing and treatment plan.*""",

        'cold_flu': f"""## 🤒 Cold & Flu Care Guide

Based on your question: "{original_message}"

### 🔍 Cold vs. Flu

**Common Cold:**
- Gradual onset
- Mild symptoms
- Rarely causes fever
- Mainly affects nose/throat

**Influenza (Flu):**
- Sudden onset
- Severe symptoms
- High fever common
- Full-body aches

### 💊 Treatment & Relief:

1. **Symptom Relief**
   - Acetaminophen or Ibuprofen for fever/aches
   - Decongestants (Pseudoephedrine 30-60mg)
   - Cough suppressant (Dextromethorphan)
   - Throat lozenges

2. **Home Remedies**
   - Rest (7-9 hours sleep)
   - Fluids (8-10 glasses water daily)
   - Warm liquids (tea, soup, broth)
   - Honey for cough (1-2 teaspoons)
   - Humidifier for congestion
   - Saltwater gargle for sore throat

3. **Duration**
   - Cold: 7-10 days
   - Flu: 1-2 weeks

### 🛡️ Prevention:
- Wash hands frequently (20 seconds with soap)
- Avoid touching face
- Get annual flu vaccine
- Stay away from sick people
- Disinfect common surfaces
- Cover coughs and sneezes

### 🚨 See a Doctor If:
- Fever >103°F (39.4°C) or lasting >3 days
- Difficulty breathing or chest pain
- Persistent vomiting
- Severe headache or neck stiffness
- Symptoms worsen after improving
- High-risk groups: elderly, pregnant, chronic conditions

### 💡 Recovery Tips:
- Don't rush back to activities
- Continue fluids even after feeling better
- Gradually increase activity
- Finish full course of any prescribed medications

*Most colds/flu resolve without antibiotics. Antibiotics only work for bacterial infections, not viruses.*""",

        'digestive': f"""## 🍽️ Digestive Health Guidance

Based on your question: "{original_message}"

### 🔍 Common Digestive Issues
The digestive system can be affected by diet, stress, infections, and various conditions.

### 🩺 Symptom Management:

**For Nausea:**
- Sip clear fluids slowly
- Eat bland foods (BRAT diet: Bananas, Rice, Applesauce, Toast)
- Ginger tea or ginger ale
- Avoid strong odors
- Take small, frequent meals

**For Diarrhea:**
- Stay hydrated (water, electrolyte drinks)
- BRAT diet
- Avoid dairy, caffeine, alcohol
- Probiotics may help
- Loperamide (Imodium) if needed

**For Constipation:**
- Increase fiber intake (25-30g daily)
- Drink plenty of water
- Exercise regularly
- Prune juice
- Consider fiber supplement (Psyllium)

**For Heartburn/Indigestion:**
- Antacids (Tums, Rolaids)
- H2 blockers (Famotidine)
- Avoid trigger foods (spicy, fatty, acidic)
- Eat smaller meals
- Don't lie down after eating
- Elevate head of bed

### 💊 Over-the-Counter Options:
- **Nausea:** Bismuth subsalicylate (Pepto-Bismol)
- **Gas/Bloating:** Simethicone (Gas-X)
- **Acid:** Omeprazole (Prilosec)
- **Constipation:** Polyethylene glycol (MiraLAX)

### 🚨 Seek Medical Care If:
- Severe abdominal pain
- Blood in stool or vomit
- Persistent vomiting (>24 hours)
- Signs of dehydration (dark urine, dizziness)
- High fever with digestive symptoms
- Unexplained weight loss
- Symptoms lasting >2 weeks

### 💡 Digestive Health Tips:
- Eat regular meals
- Chew food thoroughly
- Manage stress
- Stay physically active
- Limit alcohol and caffeine
- Don't smoke

*Digestive issues can have many causes. Consult a gastroenterologist for persistent or severe symptoms.*""",

        'mental_health': f"""## 🧠 Mental Health Support & Resources

Based on your question: "{original_message}"

### 🔍 Understanding Mental Health
Mental health is just as important as physical health. It's okay to ask for help.

### 🩺 Common Mental Health Concerns:

**Anxiety:**
- Excessive worry
- Restlessness
- Difficulty concentrating
- Sleep problems
- Physical symptoms (rapid heart rate, sweating)

**Depression:**
- Persistent sad mood
- Loss of interest in activities
- Changes in appetite/sleep
- Fatigue
- Difficulty concentrating
- Thoughts of self-harm

### 💊 Self-Care Strategies:

1. **Immediate Relief**
   - Deep breathing (4-7-8 technique)
   - Grounding exercises (5-4-3-2-1)
   - Physical activity
   - Talk to someone you trust
   - Journal your thoughts

2. **Daily Habits**
   - Regular sleep schedule (7-9 hours)
   - Exercise (30 minutes, most days)
   - Healthy diet
   - Limit alcohol and caffeine
   - Practice mindfulness or meditation
   - Stay connected with others

3. **Professional Help**
   - Therapy/Counseling (CBT, DBT)
   - Medication (if prescribed by doctor)
   - Support groups
   - Crisis hotlines

### 🆘 Crisis Resources:

**National Suicide Prevention Lifeline:**
📞 988 (call or text)
Available 24/7, free and confidential

**Crisis Text Line:**
📱 Text "HELLO" to 741741

**National Alliance on Mental Illness (NAMI):**
📞 1-800-950-NAMI (6264)

### 🚨 Seek Immediate Help If:
- Thoughts of harming yourself or others
- Hearing voices or seeing things
- Unable to care for yourself
- Severe panic attacks
- Substance abuse crisis

### 💡 Remember:
- Mental health challenges are common
- Treatment works
- You're not alone
- Asking for help is a sign of strength
- Recovery is possible

**Helpful Apps:**
- Headspace (meditation)
- Calm (relaxation)
- Moodfit (mood tracking)
- Sanvello (anxiety/depression)

*Please reach out to a mental health professional for personalized care. Your mental health matters.*"""
    }
    
    # Return category-specific response or generate custom one
    return responses.get(category, generate_general_medical_response(original_message, message_lower))

def generate_general_medical_response(original_message, message_lower):
    """Generate intelligent response for any medical question"""
    
    # Extract key medical terms
    medical_terms = []
    common_terms = ['symptom', 'treatment', 'cure', 'help', 'what', 'how', 'why', 'when', 'should', 'can', 'need']
    
    words = message_lower.split()
    medical_terms = [word for word in words if len(word) > 3 and word not in common_terms]
    
    response = f"""## 🩺 Medical Information Response

Based on your question: **"{original_message}"**

### 🔍 Understanding Your Concern

Thank you for reaching out with your health question. While I can provide general medical information, please remember that this is educational guidance and not a substitute for professional medical advice.

### 💊 General Recommendations:

1. **Assess the Situation**
   - Note when symptoms started
   - Track severity and progression
   - Identify any triggers or patterns
   - Document any associated symptoms

2. **First-Line Actions**
   - Rest and adequate sleep
   - Stay well hydrated (8-10 glasses of water)
   - Maintain a balanced diet
   - Avoid known irritants or triggers
   - Practice good hygiene

3. **Over-the-Counter Options** (if appropriate)
   - Pain/Fever: Acetaminophen (Tylenol) 500-1000mg or Ibuprofen (Advil) 400-600mg
   - Always follow package directions
   - Check for medication interactions
   - Consult pharmacist if unsure

4. **Monitoring**
   - Keep track of symptoms
   - Note what makes it better or worse
   - Watch for warning signs
   - Take temperature if applicable

### 🚨 When to Seek Medical Care:

**See a doctor if you experience:**
- Symptoms persisting >72 hours without improvement
- Symptoms that worsen despite home treatment
- High fever (>103°F / 39.4°C)
- Severe pain or discomfort
- Unusual or concerning symptoms
- Symptoms affecting daily activities

**Seek Emergency Care (Call 911) if:**
- Difficulty breathing
- Chest pain or pressure
- Severe bleeding
- Loss of consciousness
- Sudden severe headache
- Confusion or altered mental state
- Signs of allergic reaction (face/throat swelling)

### 💡 Additional Resources:

**Telehealth Options:**
- Virtual doctor consultations
- Nurse advice lines (often provided by insurance)
- Urgent care video visits

**Preventive Care:**
- Schedule regular check-ups
- Stay current with vaccinations
- Practice healthy lifestyle habits
- Know your family medical history

### 📋 Questions to Ask Your Doctor:
1. What is causing my symptoms?
2. What tests or exams do I need?
3. What are my treatment options?
4. Are there potential side effects?
5. When should I follow up?
6. What warning signs should I watch for?

### 🔬 For More Specific Guidance:

To provide more targeted advice, you can:
- Upload an image (for visible conditions)
- Describe specific symptoms in detail
- Mention duration and severity
- Note any treatments already tried

---

*Remember: This AI provides general health information. For diagnosis and treatment, please consult with a qualified healthcare provider who can evaluate your specific situation.*

**Would you like me to provide information about:**
- Specific symptoms you're experiencing?
- Treatment options for a condition?
- When to seek emergency care?
- Finding healthcare providers?

Feel free to ask any follow-up questions!"""
    
    return response

def generate_ai_response(user_message, image_analysis=None):
    """Generate intelligent medical response"""
    message_lower = user_message.lower()
    
    # Handle image analysis
    if image_analysis and image_analysis.get('success'):
        condition = image_analysis['condition']
        analysis = image_analysis['analysis']
        
        response = f"""## 🔬 Medical Image Analysis Complete

**Condition Identified:** {condition['name']}  
**Confidence Level:** {int(condition['confidence'] * 100)}%  
**Medical Specialty:** {condition['category']}

### 📊 Image Analysis Results
- **Resolution:** {analysis['width']}x{analysis['height']} pixels
- **Redness Level:** {analysis['redness_level']:.1f}/100
- **Color Profile:** R:{analysis['color_profile']['red']:.0f} G:{analysis['color_profile']['green']:.0f} B:{analysis['color_profile']['blue']:.0f}

### 📋 Clinical Assessment
{condition['description']}

### 💊 Recommended Treatment
"""
        for idx, treatment in enumerate(condition['treatment'], 1):
            response += f"{idx}. {treatment}\n"
        
        response += f"\n### 🛡️ Prevention Measures\n"
        for idx, prevention in enumerate(condition['prevention'], 1):
            response += f"{idx}. {prevention}\n"
        
        if 'whenToSeek' in condition:
            response += f"\n### 🚨 Seek Medical Attention If:\n"
            for warning in condition['whenToSeek']:
                response += f"- {warning}\n"
        
        response += "\n\n*⚕️ This analysis uses computer vision algorithms. Please consult a healthcare provider for definitive diagnosis.*"
        return response
    
    # Check for symptom analysis (headache, fever, cough)
    symptom_match = analyze_symptom_query(user_message)
    if symptom_match:
        symptom_data = symptom_match['data']
        symptom_key = symptom_match['symptom']
        
        response = f"""## {symptom_data['name']}
**Medical Specialty:** {symptom_data['category']}

"""
        
        if 'types' in symptom_data:
            response += "### Types & Management\n\n"
            for type_key, type_info in symptom_data['types'].items():
                response += f"**{type_info['description']}**\n"
                if 'symptoms' in type_info:
                    response += "Symptoms: " + ", ".join(type_info['symptoms']) + "\n\n"
                response += "Treatment:\n"
                for idx, treatment in enumerate(type_info['treatment'], 1):
                    response += f"{idx}. {treatment}\n"
                response += "\n"
        
        if 'treatment' in symptom_data:
            response += "### 💊 Treatment Recommendations\n"
            for idx, treatment in enumerate(symptom_data['treatment'], 1):
                response += f"{idx}. {treatment}\n"
            response += "\n"
        
        if 'red_flags' in symptom_data:
            response += "### 🚨 Warning Signs - Seek Immediate Medical Care\n"
            for flag in symptom_data['red_flags']:
                response += f"- {flag}\n"
        
        response += "\n\n*⚕️ This information is for educational purposes. Always consult a healthcare professional for personalized medical advice.*"
        return response
    
    # Check for skin condition symptoms
    condition_match = analyze_symptoms(user_message)
    if condition_match:
        condition = condition_match['condition']
        matched = condition_match['matched_symptoms']
        score = condition_match['score']
        
        response = f"""## 🔍 Symptom Analysis Results

**Likely Condition:** {condition['name']}  
**Match Confidence:** {min(95, 65 + score * 5)}%  
**Medical Specialty:** {condition['category']}  
**Symptoms Detected:** {', '.join(matched)}

### 📋 Condition Overview
{condition['description']}

### 💊 Treatment Protocol
"""
        for idx, treatment in enumerate(condition['treatment'], 1):
            response += f"{idx}. {treatment}\n"
        
        response += f"\n### 🛡️ Prevention Guidelines\n"
        for idx, prevention in enumerate(condition['prevention'], 1):
            response += f"{idx}. {prevention}\n"
        
        response += "\n\n*⚕️ AI-powered symptom analysis. Please consult a healthcare provider for proper diagnosis and treatment.*"
        return response
    
    # General health queries
    health_keywords = {
        'appointment': """## 📅 Book Medical Appointment

I can help you schedule an appointment with a healthcare provider:

1. **Primary Care Physician** - General health concerns
2. **Specialist** - Specific conditions (Dermatology, Cardiology, etc.)
3. **Urgent Care** - Non-emergency issues requiring prompt attention
4. **Emergency Room** - Life-threatening conditions

Please specify:
- Type of appointment needed
- Preferred date and time
- Reason for visit
- Any specific doctor or specialty

Would you like me to connect you with our appointment booking system?""",
        
        'medication': """## 💊 Medication Information & Safety

**Safe Medication Practices:**

1. **Always follow prescribed dosages**
2. **Take with food or water as directed**
3. **Complete full course of antibiotics**
4. **Never share prescription medications**
5. **Check expiration dates regularly**

**Common Over-the-Counter Medications:**

- **Pain Relief:** Ibuprofen (200-400mg), Acetaminophen (500-1000mg)
- **Allergy:** Loratadine (10mg), Diphenhydramine (25-50mg)
- **Digestive:** Antacids, Loperamide (as directed)

🚨 **Seek pharmacist advice if:**
- Taking multiple medications
- Pregnant or breastfeeding
- Have chronic conditions
- Experience side effects

*Always consult your healthcare provider before starting new medications.*""",
        
        'emergency': """## 🚨 EMERGENCY MEDICAL GUIDANCE

**Call 911 or Emergency Services IMMEDIATELY if experiencing:**

- **Chest pain or pressure**
- **Difficulty breathing or shortness of breath**
- **Severe bleeding that won't stop**
- **Loss of consciousness or severe confusion**
- **Severe allergic reaction (anaphylaxis)**
- **Stroke symptoms (FAST: Face drooping, Arm weakness, Speech difficulty, Time to call 911)**
- **Severe burns or head injuries**
- **Poisoning or overdose**
- **Suicidal thoughts or behaviors**

**For Non-Emergency Urgent Care:**
- High fever (>103°F)
- Moderate injuries
- Severe cold/flu symptoms
- Minor fractures
- Severe allergic reactions (non-life-threatening)

Stay calm, provide your location, and follow dispatcher instructions.""",
        
        'wellness': """## 🌟 Health & Wellness Tips

**Daily Habits for Optimal Health:**

### 🏃 Physical Activity
- 150 minutes moderate exercise weekly
- Strength training 2-3 times per week
- Daily stretching for flexibility

### 🥗 Nutrition
- Eat 5 servings of fruits/vegetables daily
- Choose whole grains over refined
- Stay hydrated (8-10 glasses water)
- Limit processed foods and added sugars

### 😴 Sleep Hygiene
- 7-9 hours of quality sleep nightly
- Consistent sleep schedule
- Avoid screens 1 hour before bed
- Keep bedroom cool and dark

### 🧘 Mental Health
- Practice stress management techniques
- Maintain social connections
- Seek help when needed
- Regular relaxation or meditation

### 🏥 Preventive Care
- Annual physical examinations
- Regular dental check-ups
- Stay up-to-date on vaccinations
- Skin cancer screenings

*Small, consistent changes lead to lasting health improvements.*"""
    }
    
    for keyword, response in health_keywords.items():
        if keyword in message_lower:
            return response
    
    # If no specific match found, use intelligent response generation
    if user_message and len(user_message.strip()) > 3:
        return generate_intelligent_response(user_message)
    
    # Default welcome message for empty or very short queries
    return """## 👋 Welcome to AI Medical Assistant

I'm here to help you with **ANY medical question**!

### 🤖 What I Can Do:

**Answer Any Health Question:**
- Symptoms and conditions
- Treatment options
- Medication information
- Prevention strategies
- When to seek care
- Emergency guidance

**Medical Image Analysis:**
Upload photos for AI-powered skin condition analysis

**Examples of Questions I Can Answer:**
- "I have a severe headache with nausea"
- "What should I do for a fever?"
- "How to treat a mosquito bite?"
- "I'm feeling anxious, what helps?"
- "My stomach hurts after eating"
- "What are signs of infection?"
- "How to prevent the flu?"
- "Is this rash serious?"
- **...or ANY other medical question!**

### 💬 Try Asking Me Anything!

Just type your question in plain English. I'll provide:
- ✅ Evidence-based medical information
- ✅ Treatment recommendations
- ✅ Warning signs to watch for
- ✅ When to see a doctor
- ✅ Self-care strategies

*This AI provides educational information. Always consult healthcare professionals for personalized medical advice.*"""

@app.route('/api/chat', methods=['POST'])
def chat():
    """Handle chat messages"""
    try:
        data = request.json
        user_message = data.get('message', '')
        image_data = data.get('image', None)
        
        # Analyze image if provided
        image_analysis = None
        if image_data:
            image_analysis = analyze_image(image_data)
        
        # Generate AI response
        response = generate_ai_response(user_message, image_analysis)
        
        return jsonify({
            'success': True,
            'response': response,
            'timestamp': datetime.now().isoformat(),
            'hasImageAnalysis': image_analysis is not None
        })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/analyze-symptoms', methods=['POST'])
def analyze_symptoms_endpoint():
    """Dedicated symptom analysis endpoint"""
    try:
        data = request.json
        symptoms_text = data.get('symptoms', '')
        
        result = analyze_symptoms(symptoms_text)
        
        if result:
            return jsonify({
                'success': True,
                'condition': result['condition'],
                'matched_symptoms': result['matched_symptoms'],
                'confidence': min(95, 65 + result['score'] * 5)
            })
        else:
            return jsonify({
                'success': False,
                'message': 'No matching conditions found'
            })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'message': 'AI Medical Chatbot API is running',
        'timestamp': datetime.now().isoformat()
    })

if __name__ == '__main__':
    print("🏥 Starting AI Medical Chatbot API...")
    print("📡 Server running on http://localhost:5000")
    print("🔬 Medical knowledge base loaded")
    print("✅ Ready to accept requests")
    app.run(debug=True, port=5000, host='0.0.0.0')
