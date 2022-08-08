import os

from discord import Client

from influbot.api.api import put


async def handle_display_names(client: Client):
    guild = next(guild for guild in client.guilds if guild.id == int(os.getenv("GUILD_ID")))
    for member in guild.members:
        if not member.bot:
            await put(f"/users/oauth2|discord|{member.id}/nickname", {"nickname": member.display_name})
