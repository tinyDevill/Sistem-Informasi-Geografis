from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials, OAuth2PasswordRequestForm
from database import get_pool
from models import UserCreate, UserLogin
from auth import hash_password, verify_password, create_access_token
from jose import jwt, JWTError
from auth import SECRET_KEY, ALGORITHM

router = APIRouter(prefix="/api/auth", tags=["Auth"])

# REGISTER
@router.post("/register")
async def register(user: UserCreate):
    pool = await get_pool()
    async with pool.acquire() as conn:
        existing = await conn.fetchrow(
            "SELECT * FROM users WHERE username=$1",
            user.username
        )
        if existing:
            raise HTTPException(400, "Username sudah ada")

        hashed = hash_password(user.password)

        await conn.execute("""
            INSERT INTO users (username, password)
            VALUES ($1, $2)
        """, user.username, hashed)

        return {"message": "Register berhasil"}

# LOGIN
@router.post("/login")
async def login(form: OAuth2PasswordRequestForm = Depends()):
    pool = await get_pool()
    async with pool.acquire() as conn:
        db_user = await conn.fetchrow(
            "SELECT * FROM users WHERE username=$1",
            form.username
        )

        if not db_user:
            raise HTTPException(401, "User tidak ditemukan")

        if not verify_password(form.password, db_user["password"]):
            raise HTTPException(401, "Password salah")

        token = create_access_token({"sub": form.username})

        return {
            "access_token": token,
            "token_type": "bearer"
        } 

security = HTTPBearer()
def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload["sub"]
    except JWTError:
        raise HTTPException(401, "Token tidak valid")