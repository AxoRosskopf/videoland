from fastapi import FastAPI

app = FastAPI()

@app.get("/get_suggestions/")
async def get_suggestions():
    return {}
