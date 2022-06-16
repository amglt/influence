from discord import Client


async def handle_ready(client: Client):
    print('Logged on as {0}!'.format(client.user))
