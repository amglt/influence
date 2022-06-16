from discord import Client, Message
from events.ready import handle_ready
from events.message import handle_message

client = Client()


@client.event
async def on_ready():
    await handle_ready(client)


@client.event
async def on_message(message: Message):
    await handle_message(client, message)
