import os
from discord import Client, Message
from dotenv import load_dotenv
from bot.events.ready import on_ready
from bot.events.message import on_message

load_dotenv()


class DiscordClient(Client):
    async def on_ready(self):
        await on_ready(self)

    async def on_message(self, message: Message):
        await on_message(self, message)


def start():
    bot_token = os.getenv("BOT")
    if bot_token is not None:
        client = DiscordClient()
        client.run(bot_token)
