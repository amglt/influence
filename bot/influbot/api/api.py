import os
from collections.abc import Mapping
from json import dumps, loads

import aiohttp


class ApiError(Exception):
    def __init__(self, message: str, description: str = None):
        self.message = message
        self.description = description


class TokenInfo:
    def __init__(self, access_token: str, token_type: str):
        self.access_token = access_token
        self.token_type = token_type


async def get_token():
    headers = {"content-type": "application/json"}
    payload = {
        "client_id": os.getenv("CLIENT_ID"),
        "client_secret": os.getenv("CLIENT_SECRET"),
        "audience": os.getenv("AUDIENCE"),
        "grant_type": "client_credentials"
    }
    async with aiohttp.ClientSession(headers=headers) as session:
        url = f"https://{os.getenv('DOMAIN')}/oauth/token"
        async with session.post(url, data=dumps(payload)) as res:
            data = await res.read()
            decoded_data = loads(data.decode("utf-8"))
            return TokenInfo(decoded_data["access_token"], decoded_data["token_type"])


async def get(endpoint: str):
    token_info = await get_token()
    headers = {
        "content-type": "application/json",
        "authorization": f"Bearer {token_info.access_token}"
    }
    async with aiohttp.ClientSession(headers=headers) as session:
        async with session.get(f"{os.getenv('API_URL')}{endpoint}") as res:
            if res.status < 500:
                json = await res.json()
                if res.ok:
                    return json
                else:
                    raise ApiError(json.get('message'), json.get('description', None))
            else:
                raise ApiError(res.status.__str__())


async def delete(endpoint: str):
    token_info = await get_token()
    headers = {
        "content-type": "application/json",
        "authorization": f"Bearer {token_info.access_token}"
    }
    async with aiohttp.ClientSession(headers=headers) as session:
        async with session.delete(f"{os.getenv('API_URL')}{endpoint}") as res:
            if res.status < 500:
                json = await res.json()
                if res.ok:
                    return json
                else:
                    raise ApiError(json.get('message'), json.get('description', None))
            else:
                raise ApiError(res.status.__str__())


async def post(endpoint: str, data: Mapping[str, any] = None):
    token_info = await get_token()
    headers = {
        "content-type": "application/json",
        "authorization": f"Bearer {token_info.access_token}"
    }
    async with aiohttp.ClientSession(headers=headers) as session:
        async with session.post(f"{os.getenv('API_URL')}{endpoint}", data=dumps(data)) as res:
            if res.status < 500:
                json = await res.json()
                if res.ok:
                    return json
                else:
                    raise ApiError(json.get('message'), json.get('description', None))
            else:
                raise ApiError(res.status.__str__())


async def put(endpoint: str, data: Mapping[str, any] = None):
    token_info = await get_token()
    headers = {
        "content-type": "application/json",
        "authorization": f"Bearer {token_info.access_token}"
    }
    async with aiohttp.ClientSession(headers=headers) as session:
        async with session.put(f"{os.getenv('API_URL')}{endpoint}", data=dumps(data)) as res:
            if res.status < 500:
                json = await res.json()
                if res.ok:
                    return json
                else:
                    raise ApiError(json.get('message'), json.get('description', None))
            else:
                raise ApiError(res.status.__str__())
