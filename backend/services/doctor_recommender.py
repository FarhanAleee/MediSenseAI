"""
Doctor recommendation service using a mock dataset.
In production: replace with a real database query or third-party API.
"""
from typing import List, Optional

MOCK_DOCTORS = [
    {"name": "Dr. Ayesha Khan", "specialization": "General Physician", "hospital": "Jinnah Hospital", "city": "Karachi", "contact": "+92-21-9920-1300", "available": True},
    {"name": "Dr. Ahmed Raza", "specialization": "Pulmonology", "hospital": "Aga Khan University Hospital", "city": "Karachi", "contact": "+92-21-3486-1000", "available": True},
    {"name": "Dr. Sara Malik", "specialization": "Infectious Disease", "hospital": "Services Hospital", "city": "Lahore", "contact": "+92-42-9921-2401", "available": True},
    {"name": "Dr. Usman Qureshi", "specialization": "Internal Medicine", "hospital": "Pakistan Institute of Medical Sciences", "city": "Islamabad", "contact": "+92-51-9261-170", "available": False},
    {"name": "Dr. Nadia Siddiqui", "specialization": "Cardiology", "hospital": "Shifa International Hospital", "city": "Islamabad", "contact": "+92-51-8464-646", "available": True},
    {"name": "Dr. Farhan Ali", "specialization": "Gastroenterology", "hospital": "Combined Military Hospital", "city": "Rawalpindi", "contact": "+92-51-9271-000", "available": True},
    {"name": "Dr. Hina Baig", "specialization": "Dermatology", "hospital": "Dow University Hospital", "city": "Karachi", "contact": "+92-21-9221-552", "available": True},
    {"name": "Dr. Tariq Mehmood", "specialization": "Neurology", "hospital": "Mayo Hospital", "city": "Lahore", "contact": "+92-42-9920-0600", "available": False},
    {"name": "Dr. Zainab Hussain", "specialization": "Endocrinology", "hospital": "Fatima Memorial Hospital", "city": "Lahore", "contact": "+92-42-3578-3990", "available": True},
    {"name": "Dr. Bilal Chaudhry", "specialization": "Hematology", "hospital": "Liaquat National Hospital", "city": "Karachi", "contact": "+92-21-3412-7001", "available": True},
    {"name": "Dr. Mehwish Anwar", "specialization": "Rheumatology", "hospital": "Ziauddin Hospital", "city": "Karachi", "contact": "+92-21-3677-9000", "available": True},
    {"name": "Dr. Imran Sheikh", "specialization": "Urology", "hospital": "Ittefaq Hospital", "city": "Lahore", "contact": "+92-42-3576-1999", "available": True},
    {"name": "Dr. Farah Naz", "specialization": "Hepatology", "hospital": "Sheikh Zayed Hospital", "city": "Lahore", "contact": "+92-42-9923-0332", "available": True},
    {"name": "Dr. Kamran Iqbal", "specialization": "General Physician", "hospital": "Civil Hospital", "city": "Hyderabad", "contact": "+92-22-9200-381", "available": True},
    {"name": "Dr. Samina Parveen", "specialization": "Pulmonology", "hospital": "Hayatabad Medical Complex", "city": "Peshawar", "contact": "+92-91-9216-065", "available": True},
]


def recommend_doctors(
    specialization: Optional[str] = None,
    city: Optional[str] = None,
    available_only: bool = True,
    limit: int = 5,
) -> List[dict]:
    results = MOCK_DOCTORS.copy()

    if available_only:
        results = [d for d in results if d["available"]]

    if specialization:
        # Exact match first, then General Physician fallback
        specialized = [d for d in results if d["specialization"].lower() == specialization.lower()]
        if len(specialized) < 3:
            fallback = [d for d in results if d["specialization"] == "General Physician"]
            results = specialized + [d for d in fallback if d not in specialized]
        else:
            results = specialized

    if city:
        city_match = [d for d in results if d["city"].lower() == city.lower()]
        if city_match:
            results = city_match

    return results[:limit]
