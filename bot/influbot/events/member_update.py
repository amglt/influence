import os

from discord import Member

from influbot.api.api import put
from influbot.shared.utils import get_guild_from_roles, batch


async def member_update(before: Member, after: Member):
    if not before.bot and not after.bot:
        members_to_check = [{"id": after.id, "nickname": after.display_name,
                             "isMember": any(
                                 role for role in after.roles if role.id == int(os.getenv("MEMBER_ROLE_ID"))),
                             "name": after.name, "guild": get_guild_from_roles(after.roles).name,
                             "picture": str(after.avatar_url) if after.avatar_url
                             else str(after.default_avatar_url)}]
        batch_size = 10
        rest = len(members_to_check) % batch_size
        n = len(members_to_check) // batch_size if rest == 0 else len(members_to_check) // batch_size + 1
        for x in batch(members_to_check, n):
            await put(f"/users/check", {"members": x})
