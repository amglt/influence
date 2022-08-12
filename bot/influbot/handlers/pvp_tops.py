from discord import Message, Embed

from influbot.api.api import get
from influbot.shared.models import BotError


def is_pvp_tops_command_valid(args: list[str]):
    if not args[0] == '.pvp':
        return False
    if len(args) != 3:
        raise BotError("Trop ou trop peu d'arguments à la demande, veuillez vérifier le manuel d'utilisation")
    if args[1] != 'top':
        raise BotError("Commande introuvable, veuillez vérifier le manuel d'utilisation")
    if not args[2].isnumeric() and not args[2] == 'guilds':
        raise BotError("Top disponible: nombre ou guilds -> `.pvp top {chiffre}` OU `.pvp top guilds`")

    return True


async def handle_pvp_tops(message: Message):
    content = message.content
    args = content.split()

    if is_pvp_tops_command_valid(args):
        if args[2].isnumeric():
            top_number = args[2]
            top_data = await get(f"/periods/top/{top_number}")
            embed = Embed(title=f"Top {top_number} des joueurs période actuelle")
            for player_data in top_data:
                embed.add_field(name=player_data.get('nickname'), value=player_data.get('totalPoints'), inline=False)
                await message.reply(embed=embed)

        if args[2] == 'guilds':
            top_data = await get(f"/periods/top/guilds")
            embed = Embed(title=f"Top des guildes période actuelle")
            for guild_data in top_data:
                embed.add_field(name=guild_data.get('guild'), value=guild_data.get('totalPoints'), inline=False)
                await message.reply(embed=embed)
