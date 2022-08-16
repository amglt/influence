import os

from discord import Member

from influbot.api.api import put
from influbot.shared.utils import get_guild_from_roles


async def member_update(before: Member, after: Member):
    if not before.bot and not after.bot:
        if any(role for role in after.roles if role.id == int(os.getenv("MEMBER_ROLE_ID")))\
                or before.display_name != after.display_name:
            members_to_check = list()
            members_to_check.append({"id": after.id, "nickname": after.display_name,
                                     "name": after.name, "guild": get_guild_from_roles(after.roles).name,
                                     "picture": str(after.avatar_url) if after.avatar_url
                                     else str(after.default_avatar_url)})
            await put(f"/users/check", {"members": members_to_check})
