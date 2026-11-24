import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
from groq import APIError, AuthenticationError, NotFoundError, RateLimitError, APITimeoutError, APIConnectionError
from pydantic import BaseModel
from dotenv import load_dotenv
from backend.ai_service import plan_ski_trip
from backend.weather import get_ski_weather
from backend.hotels import get_hotel_recommendations

load_dotenv()

app = FastAPI()

@app.exception_handler(APIError)
async def groq_error_handler(request, exc):
    status = 502
    message = "Storitev AI trenutno ni na voljo. Poskusi ponovno pozneje."
    if isinstance(exc, AuthenticationError):
        status, message = 503, "API ključ za storitev AI ni veljaven. Preveri GROQ_API_KEY na strežniku."
    elif isinstance(exc, NotFoundError):
        status, message = 503, "Izbrani model AI ni dostopen. Preveri nastavitev GROQ_MODEL na strežniku."
    elif isinstance(exc, RateLimitError):
        status, message = 429, "Dosežena je omejitev storitve AI. Poskusi ponovno pozneje."
    elif isinstance(exc, APITimeoutError):
        status, message = 504, "Storitev AI ni pravočasno odgovorila. Poskusi ponovno."
    elif isinstance(exc, APIConnectionError):
        message = "Strežnik se ne more povezati s storitvijo AI. Preveri njegovo internetno povezavo."
    return JSONResponse(status_code=status, content={"detail": message})


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class TripRequest(BaseModel):
    destination: str
    from_location: str

@app.get("/")
def root():
    return {"message": "Ski Planner API is running! 🎿"}

@app.post("/plan")
def plan_trip(request: TripRequest):
    if not os.getenv("GROQ_API_KEY"):
        raise HTTPException(status_code=503, detail="Na strežniku manjka GROQ_API_KEY.")
    ai_plan = plan_ski_trip(request.destination, request.from_location)
    return {"plan": ai_plan}

@app.get("/weather/{destination}")
def weather(destination: str):
    return get_ski_weather(destination)

@app.get("/hotels/{destination}")
def hotels(destination: str):
    if not os.getenv("GROQ_API_KEY"):
        raise HTTPException(status_code=503, detail="Na strežniku manjka GROQ_API_KEY.")
    return get_hotel_recommendations(destination)

@app.get("/app")
def serve_frontend():
    return FileResponse("frontend/index.html")
