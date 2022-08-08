import os

from discord import Client

from influbot.api.api import put
from influbot.shared.utils import get_guild_from_roles


async def handle_members(client: Client):
    guild = next(guild for guild in client.guilds if guild.id == int(os.getenv("GUILD_ID")))
    members_to_check = list()
    for member in guild.members:
        if not member.bot and any(role for role in member.roles if role.id == int(os.getenv("MEMBER_ROLE_ID"))):
            members_to_check.append({"id": member.id, "nickname": member.display_name,
                                     "name": member.name, "guild": get_guild_from_roles(member.roles).name,
                                     "picture": str(member.avatar_url) if member.avatar_url
                                     else str(member.default_avatar_url)})

    await put(f"/users/check", {"members": members_to_check})
