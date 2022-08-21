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

            if len(top_data) <= 25:
                embed = Embed(title=f"Top {top_number} des joueurs période actuelle")
                for index, player_data in enumerate(top_data):
                    embed.add_field(name=f"{index+1}. {player_data.get('nickname')}",
                                    value=player_data.get('totalPoints'), inline=False)
                await message.reply(embed=embed)
            else:
                rest = len(top_data) % 25
                max_data = len(top_data) // 25 if rest == 0 else len(top_data) // 25 + 1
                for x in range(max_data):
                    embed = Embed(title=f"Top {top_number} des joueurs période actuelle")
                    actual_step = x * 25
                    next_step = (x + 1) * 25
                    for index, player_data in enumerate(top_data[actual_step:next_step]):
                        embed.add_field(name=f"{index + 1 + actual_step}. {player_data.get('nickname')}",
                                        value=player_data.get('totalPoints'), inline=False)
                    await message.reply(embed=embed)

        if args[2] == 'guilds':
            top_data = await get(f"/periods/top/guilds")
            embed = Embed(title=f"Top des guildes période actuelle")
            for index, guild_data in enumerate(top_data):
                embed.add_field(name=f"{index+1}. {guild_data.get('guild')}", value=guild_data.get('totalPoints'), inline=False)
            await message.reply(embed=embed)
