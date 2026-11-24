from datetime import date

from groq import Groq
from dotenv import load_dotenv
import os

load_dotenv()

def create_groq_client():
    return Groq(api_key=os.environ["GROQ_API_KEY"], timeout=25, max_retries=0)

def is_valid_ski_destination(destination: str) -> bool:
    prompt = f"""
    Is "{destination}" a real ski resort or a place well known for skiing?
    
    Answer with ONLY "YES" or "NO". Nothing else.
    YES = it is a real place with ski slopes
    NO = it is not a ski destination or doesn't exist
    """
    response = create_groq_client().chat.completions.create(
        model=os.getenv("GROQ_MODEL", "openai/gpt-oss-20b"),
        messages=[{"role": "user", "content": prompt}]
    )
    answer = response.choices[0].message.content.strip().upper()
    return "YES" in answer


def plan_ski_trip(destination: str, from_location: str) -> str:
    if not is_valid_ski_destination(destination):
        return f"❌ Sorry, '{destination}' doesn't appear to be a ski destination. Please try a real ski resort like Zermatt, Kronplatz, Kranjska Gora, Val Gardena, etc."

    prompt = f"""
    You are an expert ski trip planner.
    Today is {date.today().isoformat()} (the server's local date).
    Use today's date and the destination's hemisphere to determine the current or upcoming ski season.
    Use the correct year range for winter seasons that span two calendar years.
    For example, November 2026 is the start of the 2026/2027 ski season in the Alps.
    Treat resort opening dates, snow conditions and lift operations as unverified unless supplied.
    The user wants to ski at: {destination}
    They are traveling from: {from_location}

    Write the answer in Slovenian. Use short sections, starting with the actual route.
    1. Pot z avtom: choose one geographically plausible route from the exact origin
       to the resort access point. Show the main waypoints in travel order with arrows.
       Include the main road or motorway numbers and any border crossing only when confident.
       Give approximate driving time and distance as rounded ranges only if you can estimate
       them reliably. State that current traffic, closures and tolls are unverified.
    2. Prihod na smučišče: explain where to leave the main road, and where to look for
       parking, a base lift or a ski bus. Use specific names only when confident.
    3. Druga možnost: give a realistic alternative only if useful, with its main trade-off.
       If public transit is viable, show likely transfer points and what to check in a current
       timetable. For overseas trips, start with a flight or rail connection as appropriate.
    4. Smučanje: briefly suggest terrain by ability and list the most useful winter gear.

    Keep the route anchored to both supplied places. If either place is ambiguous, identify
    the assumption or ask for the missing town or country. Avoid inventing precise turns,
    exit numbers, schedules, toll prices, open lifts or live road conditions.
    If essential details cannot be established, say what needs checking before departure.
    """
    response = create_groq_client().chat.completions.create(
        model=os.getenv("GROQ_MODEL", "openai/gpt-oss-20b"),
        messages=[{"role": "user", "content": prompt}]
    )
    return response.choices[0].message.content
