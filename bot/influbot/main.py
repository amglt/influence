import os
from dotenv import load_dotenv
from discord_client import client

load_dotenv()


def start():
    bot_token = os.getenv("BOT_TOKEN")
    if bot_token is not None:
        client.run(bot_token)
    else:
        raise "Bot token is missing"


start()
