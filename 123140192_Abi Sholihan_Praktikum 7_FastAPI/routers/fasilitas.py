from fastapi import APIRouter, HTTPException
from database import get_pool
from models import FasilitasCreate
import json

router = APIRouter(
    prefix="/api/fasilitas",
    tags=["Fasilitas"]
)

# NEARBY (QUERY SPASIAL)
@router.get("/nearby")
async def get_nearby(lat: float, lon: float, radius: int = 1000):
    pool = await get_pool()
    async with pool.acquire() as conn:
        rows = await conn.fetch("""
            SELECT id, nama, jenis,
            ROUND(ST_Distance(
                geom::geography,
                ST_Point($1,$2)::geography
            )) as jarak_m
            FROM fasilitas
            WHERE ST_DWithin(
                geom::geography,
                ST_Point($1,$2)::geography,
                $3
            )
            ORDER BY jarak_m
        """, lon, lat, radius)

        return [dict(row) for row in rows]

# GET ALL
@router.get("/")
async def get_all_fasilitas():
    pool = await get_pool()
    async with pool.acquire() as conn:
        rows = await conn.fetch("""
            SELECT id, nama, jenis,
            ST_AsGeoJSON(geom) as geom
            FROM fasilitas
            LIMIT 100
        """)
        return [dict(row) for row in rows]

# GEOJSON
@router.get("/geojson")
async def get_geojson():
    pool = await get_pool()
    async with pool.acquire() as conn:
        rows = await conn.fetch("""
            SELECT id, nama, jenis,
            ST_AsGeoJSON(geom) as geom
            FROM fasilitas
        """)

        features = []
        for row in rows:
            features.append({
                "type": "Feature",
                "geometry": json.loads(row["geom"]),
                "properties": {
                    "id": row["id"],
                    "nama": row["nama"],
                    "jenis": row["jenis"]
                }
            })

        return {
            "type": "FeatureCollection",
            "features": features
        }

# GET BY ID
@router.get("/{id}")
async def get_fasilitas_by_id(id: int):
    pool = await get_pool()
    async with pool.acquire() as conn:
        row = await conn.fetchrow("""
            SELECT id, nama, jenis, alamat,
            ST_X(geom) as longitude,
            ST_Y(geom) as latitude
            FROM fasilitas
            WHERE id = $1
        """, id)

        if not row:
            raise HTTPException(404, "Fasilitas tidak ditemukan")

        return dict(row)

# POST (CREATE)
@router.post("/", status_code=201)
async def create_fasilitas(data: FasilitasCreate):
    pool = await get_pool()
    async with pool.acquire() as conn:
        row = await conn.fetchrow("""
            INSERT INTO fasilitas (nama, jenis, alamat, geom)
            VALUES ($1, $2, $3,
                ST_SetSRID(ST_Point($4,$5),4326)
            )
            RETURNING id, nama, jenis, alamat,
            ST_X(geom) as longitude,
            ST_Y(geom) as latitude
        """,
        data.nama, data.jenis, data.alamat,
        data.longitude, data.latitude)

        return dict(row)

# PUT
@router.put("/{id}")
async def update_fasilitas(id: int, data: FasilitasCreate):
    pool = await get_pool()
    async with pool.acquire() as conn:
        row = await conn.fetchrow("""
            UPDATE fasilitas SET
            nama=$2, jenis=$3, alamat=$4,
            geom=ST_SetSRID(ST_Point($5,$6),4326)
            WHERE id=$1
            RETURNING id, nama, jenis
        """, id, data.nama, data.jenis,
        data.alamat, data.longitude, data.latitude)

        if not row:
            raise HTTPException(404, "Not found")

        return dict(row)

# DELETE
@router.delete("/{id}", status_code=204)
async def delete_fasilitas(id: int):
    pool = await get_pool()
    async with pool.acquire() as conn:
        await conn.execute(
            "DELETE FROM fasilitas WHERE id=$1", id
        )