import csv, random, io

diseases = {
    "Dengue": ["fever","joint_pain","rash","muscle_pain","headache","eye_pain","nausea","fatigue","vomiting","chills"],
    "Malaria": ["fever","chills","sweating","nausea","vomiting","headache","fatigue","muscle_pain","anemia","shivering"],
    "Typhoid": ["fever","abdominal_pain","weakness","diarrhea","constipation","headache","nausea","loss_of_appetite","rash","fatigue"],
    "COVID-19": ["fever","cough","fatigue","shortness_of_breath","loss_of_taste","loss_of_smell","sore_throat","headache","muscle_pain","chills"],
    "Influenza": ["fever","cough","runny_nose","sore_throat","body_aches","fatigue","chills","headache","sneezing","muscle_pain"],
    "Pneumonia": ["cough","fever","shortness_of_breath","chest_pain","fatigue","chills","sweating","nausea","coughing_blood","loss_of_appetite"],
    "Tuberculosis": ["cough","weight_loss","night_sweats","fatigue","fever","coughing_blood","chest_pain","loss_of_appetite","weakness","shortness_of_breath"],
    "Hepatitis B": ["fatigue","nausea","vomiting","abdominal_pain","jaundice","dark_urine","joint_pain","loss_of_appetite","fever","rash"],
    "Hepatitis C": ["fatigue","nausea","abdominal_pain","jaundice","dark_urine","muscle_pain","loss_of_appetite","fever","joint_pain","depression"],
    "Diabetes": ["frequent_urination","excessive_thirst","weight_loss","fatigue","blurred_vision","slow_healing","tingling","hunger","headache","nausea"],
    "Hypertension": ["headache","dizziness","blurred_vision","shortness_of_breath","chest_pain","nausea","nosebleed","fatigue","heart_palpitations","flushing"],
    "Migraine": ["headache","nausea","vomiting","light_sensitivity","sound_sensitivity","visual_disturbances","dizziness","fatigue","neck_pain","eye_pain"],
    "Asthma": ["shortness_of_breath","cough","wheezing","chest_tightness","fatigue","anxiety","sleep_disturbance","coughing_at_night","exercise_intolerance","mucus_production"],
    "Chickenpox": ["rash","fever","itching","fatigue","loss_of_appetite","headache","muscle_pain","blisters","scabs","sore_throat"],
    "Common Cold": ["runny_nose","sneezing","sore_throat","cough","mild_fever","congestion","fatigue","headache","mild_body_aches","watery_eyes"],
    "Gastroenteritis": ["diarrhea","vomiting","nausea","abdominal_cramps","fever","headache","muscle_pain","dehydration","loss_of_appetite","fatigue"],
    "Urinary Tract Infection": ["burning_urination","frequent_urination","cloudy_urine","pelvic_pain","fever","nausea","back_pain","blood_in_urine","fatigue","urgency"],
    "Anemia": ["fatigue","weakness","pale_skin","shortness_of_breath","dizziness","headache","cold_hands","irregular_heartbeat","chest_pain","concentration_problems"],
    "Arthritis": ["joint_pain","stiffness","swelling","redness","reduced_range_of_motion","fatigue","warmth","weakness","muscle_pain","difficulty_walking"],
    "Psoriasis": ["red_patches","scaling","dry_skin","itching","burning","soreness","thickened_nails","joint_pain","swollen_joints","cracked_skin"],
}

rows = []
max_symptoms = 17

for disease, symptom_pool in diseases.items():
    for _ in range(30):
        n = random.randint(4, min(len(symptom_pool), 10))
        selected = random.sample(symptom_pool, n)
        row = {"Disease": disease}
        for i in range(1, max_symptoms + 1):
            row[f"Symptom_{i}"] = selected[i-1] if i <= len(selected) else ""
        rows.append(row)

header = ["Disease"] + [f"Symptom_{i}" for i in range(1, max_symptoms + 1)]

with open("symptoms_dataset.csv", "w", newline="") as f:
    writer = csv.DictWriter(f, fieldnames=header)
    writer.writeheader()
    writer.writerows(rows)

print(f"Generated {len(rows)} rows.")
