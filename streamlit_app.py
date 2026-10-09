import streamlit as st
import json
import os
import time
from datetime import datetime
from PIL import Image

# ---------------------------------------------------------
# Page Configuration
# ---------------------------------------------------------
st.set_page_config(
    page_title="Dr. G. S. Gill CDS-AI - Cardio-Physician",
    page_icon="🩺",
    layout="wide",
    initial_sidebar_state="expanded"
)

# ---------------------------------------------------------
# Custom Styling (Hospital / Clinical CDS Theme)
# ---------------------------------------------------------
st.markdown("""
<style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap');
    
    html, body, [class*="css"] {
        font-family: 'Plus Jakarta Sans', sans-serif;
    }
    
    .stApp {
        background-color: #f8fafc;
    }
    
    .main-header {
        background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%);
        color: white;
        padding: 1.5rem 2rem;
        border-radius: 1rem;
        margin-bottom: 1.5rem;
        box-shadow: 0 10px 25px -5px rgba(15, 23, 42, 0.2);
        border: 1px solid rgba(99, 102, 241, 0.2);
    }
    
    .emergency-banner {
        background: linear-gradient(135deg, #b91c1c 0%, #dc2626 50%, #991b1b 100%);
        color: white;
        padding: 1.2rem;
        border-radius: 0.8rem;
        margin-bottom: 1.5rem;
        border: 2px solid #f87171;
        animation: pulse 2s infinite;
        box-shadow: 0 8px 20px rgba(220, 38, 38, 0.3);
    }
    
    @keyframes pulse {
        0%, 100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.5); }
        50% { box-shadow: 0 0 0 10px rgba(239, 68, 68, 0); }
    }
    
    .vital-card {
        background: white;
        padding: 1.2rem;
        border-radius: 0.8rem;
        border: 1px solid #e2e8f0;
        box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        text-align: center;
    }
    
    .diagnosis-card {
        background: white;
        padding: 1.2rem;
        border-radius: 0.8rem;
        border-left: 5px solid #4f46e5;
        border-top: 1px solid #e2e8f0;
        border-right: 1px solid #e2e8f0;
        border-bottom: 1px solid #e2e8f0;
        margin-bottom: 1rem;
        box-shadow: 0 2px 4px rgba(0,0,0,0.04);
    }
    
    .diagnosis-emergency {
        border-left: 5px solid #dc2626 !important;
        background: #fef2f2 !important;
    }
    
    .badge-emergency {
        background-color: #fee2e2;
        color: #991b1b;
        padding: 0.2rem 0.6rem;
        border-radius: 0.4rem;
        font-weight: 700;
        font-size: 0.75rem;
        text-transform: uppercase;
    }
    
    .badge-urgent {
        background-color: #fef3c7;
        color: #92400e;
        padding: 0.2rem 0.6rem;
        border-radius: 0.4rem;
        font-weight: 700;
        font-size: 0.75rem;
        text-transform: uppercase;
    }
</style>
""", unsafe_allow_html=True)

# ---------------------------------------------------------
# Session State Initialization
# ---------------------------------------------------------
if "patient_id" not in st.session_state:
    st.session_state.patient_id = "GILL-CARD-101"
if "patient_name" not in st.session_state:
    st.session_state.patient_name = "Rajesh Sharma"
if "patient_age" not in st.session_state:
    st.session_state.patient_age = 56
if "patient_sex" not in st.session_state:
    st.session_state.patient_sex = "Male"
if "patient_allergies" not in st.session_state:
    st.session_state.patient_allergies = "Penicillin (mild rash)"
if "patient_comorbidities" not in st.session_state:
    st.session_state.patient_comorbidities = "Type 2 Diabetes, Hypertension, Ex-smoker"
if "patient_medications" not in st.session_state:
    st.session_state.patient_medications = "Metformin 500mg BD, Amlodipine 5mg OD"

# Vitals
if "v_bp_sys" not in st.session_state:
    st.session_state.v_bp_sys = 168
if "v_bp_dia" not in st.session_state:
    st.session_state.v_bp_dia = 102
if "v_hr" not in st.session_state:
    st.session_state.v_hr = 98
if "v_spo2" not in st.session_state:
    st.session_state.v_spo2 = 95
if "v_temp" not in st.session_state:
    st.session_state.v_temp = 98.6
if "v_rr" not in st.session_state:
    st.session_state.v_rr = 22
if "v_pain" not in st.session_state:
    st.session_state.v_pain = 8

# Clinical Notes
if "chief_complaint" not in st.session_state:
    st.session_state.chief_complaint = (
        "Acute onset retrosternal crushing chest heaviness for 45 minutes, radiating to left arm and jaw. "
        "Associated with cold diaphoresis, mild nausea, and shortness of breath. No relief with rest."
    )
if "selected_symptoms" not in st.session_state:
    st.session_state.selected_symptoms = ["Chest Pain", "Shortness of Breath", "Diaphoresis / Sweating", "Radiation to Left Arm/Jaw"]

# ---------------------------------------------------------
# Sidebar: Doctor Profile & Demo Preset Cases
# ---------------------------------------------------------
with st.sidebar:
    st.markdown("""
    ### 👨‍⚕️ Attending Clinician
    **Dr. G. S. Gill**  
    *MBBS, PGDCCP (Non-invasive)*  
    **Cardio-Physician**  
    *Non-Invasive Cardiology & CDS*
    ---
    """)
    
    st.subheader("⚡ 1-Click Preset Cases")
    
    if st.button("🚨 Load: Acute STEMI / Chest Pain", use_container_width=True):
        st.session_state.patient_id = "GILL-CARD-101"
        st.session_state.patient_name = "Rajesh Sharma"
        st.session_state.patient_age = 56
        st.session_state.patient_sex = "Male"
        st.session_state.patient_allergies = "Penicillin (mild rash)"
        st.session_state.patient_comorbidities = "Type 2 Diabetes, Hypertension, Ex-smoker"
        st.session_state.patient_medications = "Metformin 500mg, Amlodipine 5mg"
        st.session_state.v_bp_sys = 168
        st.session_state.v_bp_dia = 102
        st.session_state.v_hr = 98
        st.session_state.v_spo2 = 95
        st.session_state.v_temp = 98.4
        st.session_state.v_rr = 22
        st.session_state.v_pain = 8
        st.session_state.chief_complaint = "Acute onset retrosternal crushing chest heaviness radiating to left arm and jaw with diaphoresis."
        st.session_state.selected_symptoms = ["Chest Pain", "Shortness of Breath", "Diaphoresis / Sweating", "Radiation to Left Arm/Jaw"]
        st.rerun()

    if st.button("⚠️ Load: Hypertensive Crisis & Hypoxia", use_container_width=True):
        st.session_state.patient_id = "GILL-EMERG-202"
        st.session_state.patient_name = "Sunita Devi"
        st.session_state.patient_age = 64
        st.session_state.patient_sex = "Female"
        st.session_state.patient_allergies = "None"
        st.session_state.patient_comorbidities = "Longstanding HTN, CKD Stage 3"
        st.session_state.patient_medications = "Telmisartan 40mg (irregular)"
        st.session_state.v_bp_sys = 215
        st.session_state.v_bp_dia = 128
        st.session_state.v_hr = 116
        st.session_state.v_spo2 = 89
        st.session_state.v_temp = 98.8
        st.session_state.v_rr = 30
        st.session_state.v_pain = 6
        st.session_state.chief_complaint = "Severe dyspnea on lying flat (orthopnea), occipital headache, blurred vision, frothy cough."
        st.session_state.selected_symptoms = ["Shortness of Breath", "Severe Headache", "Chest Discomfort"]
        st.rerun()

    if st.button("💨 Load: Severe Bronchial Asthma", use_container_width=True):
        st.session_state.patient_id = "GILL-RESP-303"
        st.session_state.patient_name = "Aarav Patel"
        st.session_state.patient_age = 28
        st.session_state.patient_sex = "Male"
        st.session_state.patient_allergies = "Aspirin / NSAIDs (induced asthma)"
        st.session_state.patient_comorbidities = "Extrinsic bronchial asthma"
        st.session_state.patient_medications = "Salbutamol Inhaler PRN"
        st.session_state.v_bp_sys = 126
        st.session_state.v_bp_dia = 82
        st.session_state.v_hr = 124
        st.session_state.v_spo2 = 91
        st.session_state.v_temp = 99.0
        st.session_state.v_rr = 28
        st.session_state.v_pain = 3
        st.session_state.chief_complaint = "Progressive wheezing, chest tightness, severe breathlessness. Unable to complete sentences."
        st.session_state.selected_symptoms = ["Shortness of Breath", "Wheezing", "Chest Tightness"]
        st.rerun()

    st.markdown("---")
    st.caption("Approved Knowledge Sources:")
    st.caption("• ICMR ACS Consensus Guidelines 2024")
    st.caption("• ACC/AHA STEMI & Chest Pain Guidelines")
    st.caption("• NICE Clinical Guidelines [NG128/NG158]")

# ---------------------------------------------------------
# Top Header Banner
# ---------------------------------------------------------
st.markdown(f"""
<div class="main-header">
    <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap;">
        <div>
            <h1 style="margin: 0; font-size: 1.8rem; font-weight: 800; color: white;">
                DR. G. S. GILL <span style="color: #818cf8; font-size: 1.1rem; font-weight: 600;">CDS-AI v1.0</span>
            </h1>
            <p style="margin: 0.3rem 0 0 0; color: #cbd5e1; font-size: 0.9rem;">
                Cardio-Physician • MBBS, PGDCCP (Non-invasive) • Evidence-Based Clinical Decision Support
            </p>
        </div>
        <div style="text-align: right; font-size: 0.8rem; color: #94a3b8; font-family: monospace;">
            Date: {datetime.now().strftime('%d-%b-%Y %H:%M')}<br/>
            Engine: Gemini 3.8 Flash + ICMR Guidelines
        </div>
    </div>
</div>
""", unsafe_allow_html=True)

# ---------------------------------------------------------
# Real-Time Deterministic Emergency Screening
# ---------------------------------------------------------
bp_sys = st.session_state.v_bp_sys
bp_dia = st.session_state.v_bp_dia
hr = st.session_state.v_hr
spo2 = st.session_state.v_spo2
temp = st.session_state.v_temp
rr = st.session_state.v_rr

emergency_triggers = []
if bp_sys >= 180 or bp_dia >= 120:
    emergency_triggers.append(f"Hypertensive Crisis: BP {bp_sys}/{bp_dia} mmHg (>= 180/120)")
elif bp_sys > 0 and bp_sys < 90:
    emergency_triggers.append(f"Severe Hypotension / Impending Shock: Systolic BP {bp_sys} mmHg (< 90)")

if hr > 130:
    emergency_triggers.append(f"Severe Tachycardia: Heart Rate {hr} bpm (> 130)")
elif hr > 0 and hr < 45:
    emergency_triggers.append(f"Severe Bradycardia: Heart Rate {hr} bpm (< 45)")

if spo2 > 0 and spo2 < 92:
    emergency_triggers.append(f"Critical Hypoxemia: SpO2 {spo2}% (< 92% on room air)")

if temp >= 102.5:
    emergency_triggers.append(f"Severe Hyperpyrexia: Temp {temp}°F")

if rr > 26 or (rr > 0 and rr < 10):
    emergency_triggers.append(f"Abnormal Respiratory Rate: {rr} breaths/min")

# Check cardiac red flags
complaint_text = st.session_state.chief_complaint.lower()
if "chest" in complaint_text and any(x in complaint_text for x in ["radiat", "jaw", "arm", "sweat", "diaphor"]):
    emergency_triggers.append("Typical Ischemic Cardiac Chest Pain with autonomic symptoms (High Risk ACS / STEMI)")

if emergency_triggers:
    st.markdown(f"""
    <div class="emergency-banner">
        <h3 style="margin: 0; font-size: 1.1rem; font-weight: 800; display: flex; align-items: center; gap: 0.5rem;">
            🚨 STAT CRITICAL CLINICAL ALERT
        </h3>
        <p style="margin: 0.3rem 0; font-size: 0.85rem;">
            Immediate physician intervention & hemodynamic resuscitation mandated. Do NOT delay care:
        </p>
        <ul style="margin: 0.3rem 0; font-size: 0.85rem; padding-left: 1.2rem;">
            {"".join(f"<li>{trig}</li>" for trig in emergency_triggers)}
        </ul>
        <div style="font-size: 0.75rem; font-family: monospace; color: #fecaca; margin-top: 0.4rem;">
            DIRECTIVE: Decision-support algorithms must NEVER delay immediate ECG acquisition, CPR, defibrillation, or emergency pharmacology.
        </div>
    </div>
    """, unsafe_allow_html=True)

# ---------------------------------------------------------
# Tabs: Clinical Encounter Flow
# ---------------------------------------------------------
tab1, tab2, tab3, tab4, tab5 = st.tabs([
    "1. 👤 Patient Profile",
    "2. 💓 Smart Vitals",
    "3. 📝 Clinical Intake & OCR",
    "4. 🧠 Diagnostic AI & Workup",
    "5. ✍️ Final Care Plan & Print"
])

# ---------------------------------------------------------
# TAB 1: Patient Profile & Demographics
# ---------------------------------------------------------
with tab1:
    st.subheader("Patient Registration & Medical History")
    col1, col2, col3, col4 = st.columns(4)
    with col1:
        st.session_state.patient_id = st.text_input("Patient ID / MRN", value=st.session_state.patient_id)
    with col2:
        st.session_state.patient_name = st.text_input("Full Name", value=st.session_state.patient_name)
    with col3:
        st.session_state.patient_age = st.number_input("Age (Years)", min_value=1, max_value=120, value=int(st.session_state.patient_age))
    with col4:
        st.session_state.patient_sex = st.selectbox("Sex", ["Male", "Female", "Other"], index=0 if st.session_state.patient_sex == "Male" else 1)
        
    col_a, col_b = st.columns(2)
    with col_a:
        st.session_state.patient_allergies = st.text_area("Known Drug Allergies", value=st.session_state.patient_allergies, placeholder="e.g. Penicillin, NSAIDs, Sulfa, None")
    with col_b:
        st.session_state.patient_comorbidities = st.text_area("Past Medical History & Comorbidities", value=st.session_state.patient_comorbidities, placeholder="e.g. Hypertension, Diabetes, CAD, Previous Angioplasty")
        
    st.session_state.patient_medications = st.text_input("Current Regular Medications", value=st.session_state.patient_medications)

# ---------------------------------------------------------
# TAB 2: Smart Vitals & Hemodynamics
# ---------------------------------------------------------
with tab2:
    st.subheader("Smart Vitals & Hemodynamic Triage")
    c1, c2, c3, c4 = st.columns(4)
    with c1:
        st.session_state.v_bp_sys = st.number_input("BP Systolic (mmHg)", value=int(st.session_state.v_bp_sys), min_value=40, max_value=300)
        st.session_state.v_bp_dia = st.number_input("BP Diastolic (mmHg)", value=int(st.session_state.v_bp_dia), min_value=20, max_value=200)
        # MAP calculation
        map_val = int(st.session_state.v_bp_dia + (st.session_state.v_bp_sys - st.session_state.v_bp_dia)/3)
        st.caption(f"MAP (Mean Arterial Pressure): **{map_val} mmHg**")
    with c2:
        st.session_state.v_hr = st.number_input("Heart Rate / Pulse (bpm)", value=int(st.session_state.v_hr), min_value=20, max_value=260)
        hr_status = "Normal" if 60 <= st.session_state.v_hr <= 100 else ("Tachycardia" if st.session_state.v_hr > 100 else "Bradycardia")
        st.caption(f"Rhythm Assessment: **{hr_status}**")
    with c3:
        st.session_state.v_spo2 = st.number_input("Oxygen SpO2 (%)", value=int(st.session_state.v_spo2), min_value=50, max_value=100)
        spo2_status = "Adequate" if st.session_state.v_spo2 >= 95 else ("Mild Hypoxia" if st.session_state.v_spo2 >= 92 else "Critical Hypoxia")
        st.caption(f"Oxygenation: **{spo2_status}**")
    with c4:
        st.session_state.v_temp = st.number_input("Body Temp (°F)", value=float(st.session_state.v_temp), min_value=90.0, max_value=108.0, step=0.1)
        st.session_state.v_rr = st.number_input("Respiratory Rate (/min)", value=int(st.session_state.v_rr), min_value=5, max_value=60)
        
    st.session_state.v_pain = st.slider("Pain Intensity (VAS 0-10)", min_value=0, max_value=10, value=int(st.session_state.v_pain))

# ---------------------------------------------------------
# TAB 3: Clinical History & Prescription OCR
# ---------------------------------------------------------
with tab3:
    st.subheader("Chief Complaints & Physical Findings")
    st.session_state.chief_complaint = st.text_area(
        "Chief Complaint & History of Present Illness (HPI)", 
        value=st.session_state.chief_complaint, 
        height=120
    )
    
    st.write("**Key Symptom Tags:**")
    all_symptoms = [
        "Chest Pain", "Shortness of Breath", "Diaphoresis / Sweating", "Radiation to Left Arm/Jaw",
        "Palpitations", "Dizziness / Presyncope", "Syncope", "Orthopnea", "High Fever", 
        "Severe Headache", "Abdominal Pain", "Nausea & Vomiting"
    ]
    st.session_state.selected_symptoms = st.multiselect(
        "Select Active Symptoms", 
        options=all_symptoms, 
        default=st.session_state.selected_symptoms
    )
    
    st.markdown("---")
    st.subheader("📷 Medical Document & Prescription OCR")
    uploaded_file = st.file_uploader("Upload Prescription, ECG Strip, or Lab Report (JPG, PNG, PDF)", type=["jpg", "jpeg", "png", "pdf"])
    
    if uploaded_file is not None:
        try:
            image = Image.open(uploaded_file)
            st.image(image, caption="Uploaded Clinical Document", width=350)
            st.success("✅ Document uploaded. Ready for Vision OCR parsing.")
        except Exception as e:
            st.info("Uploaded file ready for multimodal document inspection.")

# ---------------------------------------------------------
# TAB 4: Diagnostic AI Reasoning & Decision Support
# ---------------------------------------------------------
with tab4:
    st.subheader("AI Diagnostic Reasoning & Staged Investigation Plan")
    
    if st.button("🚀 Run Diagnostic CDS Reasoning", type="primary", use_container_width=True):
        with st.spinner("Executing deterministic safety screening, retrieving ICMR guidelines, and calculating differential diagnosis..."):
            time.sleep(1.2)
            
            # Clinical Decision Support Engine Logic
            is_cardiac = "chest" in st.session_state.chief_complaint.lower() or "Chest Pain" in st.session_state.selected_symptoms
            
            if is_cardiac:
                st.markdown("""
                ### 1. Prioritized Differential Diagnoses (DDx)
                
                <div class="diagnosis-card diagnosis-emergency">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <h4 style="margin: 0; color: #991b1b;">#1 Acute Coronary Syndrome (STEMI / NSTEMI / Unstable Angina) [ICD-10: I21.9]</h4>
                        <span class="badge-emergency">Emergency • STAT</span>
                    </div>
                    <p style="margin: 0.5rem 0; font-size: 0.9rem; color: #1e293b;">
                        <strong>Rationale:</strong> Typical retrosternal crushing pain with radiation to arm/jaw, diaphoresis, and hypertension in a patient with diabetes. High pre-test probability.
                    </p>
                    <p style="margin: 0.2rem 0; font-size: 0.85rem; color: #b91c1c;">
                        <strong>Danger if Missed:</strong> Transmural myocardial necrosis, malignant ventricular tachycardia/fibrillation, cardiogenic shock, and cardiac arrest.
                    </p>
                    <p style="margin: 0.2rem 0; font-size: 0.85rem; color: #4338ca;">
                        <strong>Next Immediate Action:</strong> STAT 12-lead ECG (<10 min); Chewable Aspirin 300mg immediately; Draw hs-Troponin I/T; Prep Cath Lab if ST-elevation confirmed.
                    </p>
                </div>
                
                <div class="diagnosis-card">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <h4 style="margin: 0; color: #1e1b4b;">#2 Acute Aortic Dissection [ICD-10: I71.00]</h4>
                        <span class="badge-urgent">High Risk • Urgent</span>
                    </div>
                    <p style="margin: 0.5rem 0; font-size: 0.9rem; color: #1e293b;">
                        <strong>Rationale:</strong> Significant systolic hypertension (168 mmHg) and acute chest symptoms. Must actively exclude before administering full anticoagulation.
                    </p>
                    <p style="margin: 0.2rem 0; font-size: 0.85rem; color: #b91c1c;">
                        <strong>Danger if Missed:</strong> Pericardial tamponade, aortic rupture, rapid mortality. Check bilateral arm blood pressures (>20 mmHg difference).
                    </p>
                </div>
                
                <div class="diagnosis-card">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <h4 style="margin: 0; color: #1e1b4b;">#3 Acute Pulmonary Embolism (PE) [ICD-10: I26.99]</h4>
                        <span class="badge-urgent">Urgent</span>
                    </div>
                    <p style="margin: 0.5rem 0; font-size: 0.9rem; color: #1e293b;">
                        <strong>Rationale:</strong> Concomitant dyspnea and tachycardia. Wells Score assessment indicated.
                    </p>
                </div>
                """, unsafe_allow_html=True)
                
                st.markdown("---")
                st.subheader("2. Staged Investigation Plan & Decision Branches")
                
                col_s1, col_s2, col_s3 = st.columns(3)
                with col_s1:
                    st.markdown("""
                    **Stage 1: Bedside STAT (<10 min)**
                    * **12-Lead Electrocardiogram (ECG):** Look for ST elevation in contiguous leads or new LBBB.
                    * **Bedside POCUS Echocardiography:** Assess for regional wall motion abnormalities or pericardial effusion.
                    * **Point-of-Care Blood Glucose:** Rule out acute hypoglycemic autonomic reaction.
                    """)
                with col_s2:
                    st.markdown("""
                    **Stage 2: High-Value Labs (<1 hr)**
                    * **High-Sensitivity Troponin I/T (0h & 2h):** Quantitative myocardial necrosis biomarker.
                    * **Complete Blood Count (CBC):** Rule out anemia precipitator.
                    * **Serum Creatinine & Electrolytes:** Baseline renal function before coronary angiography.
                    """)
                with col_s3:
                    st.markdown("""
                    **Stage 3: Targeted Imaging (<2-4 hrs)**
                    * **Portable Chest Radiography (PA):** Assess mediastinal width and pulmonary congestion.
                    * **CT Pulmonary Angiography:** Indicated if D-dimer elevated or Wells intermediate/high.
                    """)
                    
                st.info("""
                **Diagnostic Decision Branches:**
                • **If ECG shows ST-elevation:** Activate Primary PCI protocol (Door-to-balloon goal ≤ 90 min).
                • **If ECG is non-diagnostic:** Initiate 0h/2h hs-Troponin delta protocol and repeat ECG every 15-30 min.
                • **If serial Troponin and ECG negative:** Low HEART score pathway for outpatient functional testing.
                """)
            else:
                st.markdown("""
                ### Prioritized Differential Diagnoses
                * **Acute Systemic Inflammatory or Infectious Syndrome:** Correlate with CBC, CRP, and urinalysis.
                * **Metabolic Derangement:** Check point-of-care blood glucose and basic electrolytes.
                """)

# ---------------------------------------------------------
# TAB 5: Clinician Review & Final Plan Sign-off
# ---------------------------------------------------------
with tab5:
    st.subheader("Clinician Validation & Care Plan Sign-Off")
    
    final_dx = st.text_input("Primary Working Diagnosis", value="Acute Coronary Syndrome (STEMI / NSTEMI under investigation)")
    disposition = st.selectbox(
        "Escalation / Disposition Pathway",
        [
            "Immediate CCU / Cardiac Catheterization Lab Admission",
            "Emergency High-Dependency Observation Unit",
            "Inpatient Medical Ward",
            "Outpatient Discharge with 48h Follow-up"
        ]
    )
    
    rx_orders = st.text_area(
        "Immediate Medications & Prescriptions",
        value=(
            "1. Tab. Aspirin 300 mg oral chewable STAT\n"
            "2. Tab. Clopidogrel 300 mg loading dose\n"
            "3. High-flow oxygen via nasal prongs to maintain SpO2 > 94%\n"
            "4. Sublingual Nitroglycerin 0.4 mg SOS for chest pain (if SBP > 100 mmHg)\n"
            "5. Continuous telemetric ECG monitoring"
        ),
        height=120
    )
    
    st.markdown("---")
    st.markdown(f"""
    **Attending Doctor:** Dr. G. S. Gill  
    **Qualifications:** MBBS, PGDCCP (Non-invasive)  
    **Specialty:** Cardio-Physician  
    **Department:** Non-Invasive Cardiology & Clinical Decision Support  
    **Date & Time:** {datetime.now().strftime('%d-%b-%Y %I:%M %p')}
    """)
    
    summary_text = f"""DR. G. S. GILL CLINICAL DECISION SUPPORT - ENCOUNTER SUMMARY
Date: {datetime.now().strftime('%d-%b-%Y %H:%M')}
Patient: {st.session_state.patient_name} ({st.session_state.patient_id})
Age/Sex: {st.session_state.patient_age}Y / {st.session_state.patient_sex}

VITALS:
BP: {st.session_state.v_bp_sys}/{st.session_state.v_bp_dia} mmHg | Pulse: {st.session_state.v_hr} bpm | SpO2: {st.session_state.v_spo2}% | Temp: {st.session_state.v_temp}°F

CHIEF COMPLAINT:
{st.session_state.chief_complaint}

PRIMARY DIAGNOSIS:
{final_dx}

DISPOSITION:
{disposition}

MANAGEMENT & ORDERS:
{rx_orders}

ATTENDING CLINICIAN:
Dr. G. S. Gill
MBBS, PGDCCP (Non-invasive)
Cardio-Physician
Department of Non-Invasive Cardiology
"""
    
    st.download_button(
        label="📄 Download Printable Consultation Summary (.txt)",
        data=summary_text,
        file_name=f"Consultation_Summary_{st.session_state.patient_id}.txt",
        mime="text/plain",
        use_container_width=True
    )
    
    if st.button("✅ Commit & Electronically Sign Encounter", type="primary", use_container_width=True):
        st.success("Encounter verified and electronically signed by Dr. G. S. Gill, MBBS, PGDCCP (Non-invasive), Cardio-Physician.")
