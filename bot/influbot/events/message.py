import os

from discord import Message, Client

from influbot.handlers.influtons import handle_influtons_request, handle_wallet_request
from influbot.handlers.pvp import handle_perco_prism, handle_remove_transaction, handle_ava
from influbot.handlers.pvp_stats import handle_my_stats
from influbot.handlers.pvp_tops import handle_pvp_tops
from influbot.shared.models import EnabledModules


async def handle_message(client: Client, message: Message):
    if message.author == client.user:
        return

    content = message.content
    enabled_modules = os.getenv("ENABLED_MODULES").split(",")

    # PVP
    if EnabledModules.Pvp.value in enabled_modules:
        pvp_screens_channels = [int(x) for x in os.getenv("PVP_SCREENS_CHANNEL_ID").split(',')]
        if message.channel.id in pvp_screens_channels:
            if content.startswith('.p') or content.startswith('.pr'):
                await handle_perco_prism(client, message)
            if content.startswith('.rt'):
                await handle_remove_transaction(message)
            if content.startswith('.a') or content.startswith('.ava'):
                await handle_ava(client, message)

        pvp_info_channels = [int(x) for x in os.getenv("PVP_INFO_CHANNEL_ID").split(',')]
        if message.channel.id in pvp_info_channels:
            if content.startswith('.ms') or content.startswith('.mystats'):
                await handle_my_stats(message)
            if content.startswith('.pvp'):
                await handle_pvp_tops(message)

    # Influtons
    if EnabledModules.Influtons.value in enabled_modules:
        influtons_channels = [int(x) for x in os.getenv("INFLUTONS_CHANNEL_ID").split(',')]
        if message.channel.id in influtons_channels:
            if content.startswith('.give'):
                await handle_influtons_request(message)
            if content.startswith('.money'):
                await handle_wallet_request(message)
