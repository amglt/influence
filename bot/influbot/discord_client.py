from discord import Client, Message
from events.ready import on_ready
from events.message import on_message


class DiscordClient(Client):
    async def on_ready(self):
        await on_ready(self)

    async def on_message(self, message: Message):
        await on_message(message)
