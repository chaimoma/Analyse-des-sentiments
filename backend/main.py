from fastapi import FastAPI, HTTPException, Depends, Header
from pydantic import BaseModel
from jose import jwt, JWTError
import os
import httpx
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware 


load_dotenv()

SK = os.getenv("SECRET_KEY")
ALG = "HS256"
HF_TOKEN = os.getenv("HF_TOKEN")

# ---------------- SCHEMAS ---------------- #
class LoginSchema(BaseModel):
    username: str
    password: str

class TextSchema(BaseModel):
    text: str

# ---------------- APP ---------------- #
app = FastAPI()


# Add the CORS Middleware
origins = [
    # The default port for Next.js/React development
    "http://localhost:3000", 
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"], # Allows POST, GET, OPTIONS, etc.
    allow_headers=["*"], # Allows Authorization headers
)
# -----------------
fake_user = {"username": "chaima", "password": "chaima"}

# ---------------- AUTH ---------------- #
def verify_token(Authorization: str = Header(None)):
    if Authorization is None:
        raise HTTPException(401, "Missing Authorization header")

    try:
        scheme, token = Authorization.split()
        if scheme.lower() != "bearer":
            raise HTTPException(401, "Bad token format")
    except:
        raise HTTPException(401, "Invalid Authorization header")

    try:
        payload = jwt.decode(token, SK, algorithms=[ALG])
    except JWTError:
        raise HTTPException(401, "Invalid or expired token")

    return payload

@app.post("/login")
def login(data: LoginSchema):
    if data.username != fake_user["username"] or data.password != fake_user["password"]:
        raise HTTPException(401, "Incorrect username or password")

    payload = {"user": data.username}
    token = jwt.encode(payload, SK, algorithm=ALG)

    return {"access_token": token}

# ---------------- PREDICT ---------------- #
@app.post("/predict")
async def predict(data: TextSchema, user=Depends(verify_token)):
    # Correct Hugging Face Router URL
    url = "https://router.huggingface.co/hf-inference/models/nlptown/bert-base-multilingual-uncased-sentiment"

    headers = {
        "Authorization": f"Bearer {HF_TOKEN}"
    }

    payload = {"inputs": data.text}

    # Using httpx async
    async with httpx.AsyncClient(timeout=30) as client:
        try:
            response = await client.post(url, json=payload, headers=headers)
        except httpx.RequestError as e:
            raise HTTPException(500, f"HuggingFace connection error: {e}")

    if response.status_code != 200:
        raise HTTPException(500, f"HuggingFace error: {response.text}")

    result = response.json()[0]

    # pick label with highest score
    best = max(result, key=lambda x: x["score"])
    label_number = int(best["label"].split()[0])

    if label_number in [1, 2]:
        sentiment = "negatif"
    elif label_number == 3:
        sentiment = "neutre"
    else:
        sentiment = "positif"

    return {
        "original_label": label_number,
        "sentiment": sentiment
    }
