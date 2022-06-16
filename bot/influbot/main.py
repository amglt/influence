import os
from dotenv import load_dotenv
from discord_client import DiscordClient

load_dotenv()


def start():
    bot_token = os.getenv("BOT")
    if bot_token is not None:
        client = DiscordClient()
        client.run(bot_token)
    else:
        raise "Bot token is missing"


start()
