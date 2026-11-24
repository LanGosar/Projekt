from dotenv import load_dotenv
import os
from backend.ai_service import create_groq_client

load_dotenv()

def get_hotel_recommendations(destination: str) -> str:
    client = create_groq_client()
    validation_prompt = f"""
    Is "{destination}" a real ski resort or a place well known for skiing?
    Answer with ONLY "YES" or "NO". Nothing else.
    """
    val_response = client.chat.completions.create(
        model=os.getenv("GROQ_MODEL", "openai/gpt-oss-20b"),
        messages=[{"role": "user", "content": validation_prompt}]
    )
    answer = val_response.choices[0].message.content.strip().upper()

    if "YES" not in answer:
        return f"❌ '{destination}' is not a ski destination so there are no ski hotels to show. Please enter a real ski resort."

    prompt = f"""
    List the top 5 hotels or accommodations that are within 5 kilometers (as the crow flies) from the {destination} ski resort slopes.

    STRICT RULES:
    - ONLY include hotels within 5km of the ski slopes — no exceptions
    - If a hotel is further than 5km away, do NOT include it
    - Prefer ski-in/ski-out hotels or hotels with direct slope access
    - Do NOT include hotels in nearby towns or cities unless they are within 5km of the slopes

    For each hotel provide:
    - Hotel name
    - Exact distance to slopes (in km)
    - Price range per night (in EUR)
    - Top 3 benefits
    - Star rating

    Format as a clean numbered list. Be specific and accurate with distances!
    """
    response = client.chat.completions.create(
        model=os.getenv("GROQ_MODEL", "openai/gpt-oss-20b"),
        messages=[{"role": "user", "content": prompt}]
    )
    return response.choices[0].message.content
