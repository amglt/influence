from discord import Message, Client

from influbot.handlers.pvp import handle_perco_prism, handle_remove_transaction, handle_ava


async def handle_message(client: Client, message: Message):
    if message.author == client.user:
        return

    content = message.content
    if content.startswith('.p') or content.startswith('.pr'):
        await handle_perco_prism(client, message)

    if content.startswith('.rt'):
        await handle_remove_transaction(message)

    if content.startswith('.a') or content.startswith('.ava'):
        await handle_ava(client, message)
