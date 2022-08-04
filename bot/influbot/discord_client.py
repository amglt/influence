from discord import Client, Message
from influbot.events.ready import handle_ready
from influbot.events.message import handle_message
from influbot.api.api import ApiError
from influbot.shared.models import BotError

client = Client()


@client.event
async def on_ready():
    await handle_ready(client)


@client.event
async def on_message(message: Message):
    try:
        await handle_message(client, message)
    except (BotError, ApiError) as e:
        await message.reply(e.message)
