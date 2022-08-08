from discord import Client

from influbot.handlers.ready_members import handle_members


async def handle_ready(client: Client):
    print('Logged on as {0}!'.format(client.user))
    await handle_members(client)
    print('Bot has started')
