from discord import Message, Client

from influbot.handlers.pvp import handle_perco_prism


async def handle_message(client: Client, message: Message):
    if message.author == client.user:
        return

    content = message.content
    if content.startswith('.p') or content.startswith('.pr'):
        await handle_perco_prism(client, message)
