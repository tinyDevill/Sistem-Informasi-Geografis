from pydantic import BaseModel, Field
from typing import Optional

class FasilitasBase(BaseModel):
    nama: str = Field(..., min_length=3)
    jenis: str
    alamat: Optional[str] = None
    longitude: float = Field(..., ge=-180, le=180)
    latitude: float = Field(..., ge=-90, le=90)


class FasilitasCreate(FasilitasBase):
    pass


class FasilitasUpdate(FasilitasBase):
    pass


class FasilitasResponse(FasilitasBase):
    id: int

    class Config:
        from_attributes = True

class UserCreate(BaseModel):
    username: str
    password: str

class UserLogin(BaseModel):
    username: str
    password: str