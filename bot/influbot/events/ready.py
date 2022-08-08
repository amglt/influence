from discord import Client

from influbot.handlers.display_names import handle_display_names


async def handle_ready(client: Client):
    print('Logged on as {0}!'.format(client.user))
    await handle_display_names(client)
    print('Bot has started')