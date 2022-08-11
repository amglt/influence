import os

from discord import Message, Client

from influbot.handlers.influtons import handle_influtons_request, handle_wallet_request
from influbot.handlers.pvp import handle_perco_prism, handle_remove_transaction, handle_ava
from influbot.handlers.pvp_stats import handle_my_stats


async def handle_message(client: Client, message: Message):
    if message.author == client.user:
        return

    content = message.content

    # PVP
    if message.channel.id == int(os.getenv("PVP_SCREENS_CHANNEL_ID")):
        if content.startswith('.p') or content.startswith('.pr'):
            await handle_perco_prism(client, message)
        if content.startswith('.rt'):
            await handle_remove_transaction(message)
        if content.startswith('.a') or content.startswith('.ava'):
            await handle_ava(client, message)
    if message.channel.id == int(os.getenv("PVP_INFO_CHANNEL_ID")):
        if content.startswith('.ms') or content.startswith('.mystats'):
            await handle_my_stats(message)

    # Influtons
    if message.channel.id == int(os.getenv("INFLUTONS_CHANNEL_ID")):
        if content.startswith('.give'):
            await handle_influtons_request(message)
        if content.startswith('.money'):
            await handle_wallet_request(message)
