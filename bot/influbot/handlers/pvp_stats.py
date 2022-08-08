from discord import Embed

from influbot.api.api import get
from influbot.shared.models import BotError


def my_stats_is_valid(message):
    args = message.content.split()

    if args[0] != ".mystats" and args[0] != ".ms":
        return False
    if len(args) > 1:
        raise BotError("Trop d'arguments à la requête, veuillez vérifier le manuel d'utilisation")

    return True


async def handle_my_stats(message):
    if my_stats_is_valid(message):
        stats = await get(f"/pvp-games/{message.author.id}/stats")
        if stats.get('totalGames') > 0:
            total_games = stats.get('totalGames')
            embed = Embed(title="Mes stats",
                          description=f"Stats de {message.author.display_name} pour la session actuelle")
            embed.add_field(name="Total de parties", value=f"{total_games}", inline=False)
            embed.add_field(name="Parties gagnées",
                            value=f"{stats.get('gamesStats').get('wonGames')}/{total_games} - "
                                  f"{stats.get('gamesStats').get('wonGames') / total_games * 100:.2f}%")
            embed.add_field(name="Parties perdues",
                            value=f"{stats.get('gamesStats').get('lostGames')}/{total_games} - "
                                  f"{stats.get('gamesStats').get('lostGames') / total_games * 100:.2f}%")
            embed.add_field(name="Parties no def",
                            value=f"{stats.get('gamesStats').get('noDefGames')}/{total_games} - "
                                  f"{stats.get('gamesStats').get('noDefGames') / total_games * 100:.2f}%")
            perco_games = stats.get('gamesStats').get('percoGames')
            if perco_games > 0:
                embed.add_field(name="Parties Perco",
                                value=f"{perco_games}/{total_games} - "
                                      f"{perco_games / total_games * 100:.2f}%", inline=False)
                embed.add_field(name="Perco atq win",
                                value=f"{stats.get('gamesStats').get('percoAttackWon')}/{perco_games} - "
                                      f"{stats.get('gamesStats').get('percoAttackWon') / perco_games * 100:.2f}%")
                embed.add_field(name="Perco atq lose",
                                value=f"{stats.get('gamesStats').get('percoAttackLost')}/{perco_games} - "
                                      f"{stats.get('gamesStats').get('percoAttackLost') / perco_games * 100:.2f}%")
                embed.add_field(name="Perco no def",
                                value=f"{stats.get('gamesStats').get('percoNoDef')}/{perco_games} - "
                                      f"{stats.get('gamesStats').get('percoNoDef') / perco_games * 100:.2f}%")
                embed.add_field(name="Perco def win",
                                value=f"{stats.get('gamesStats').get('percoDefWon')}/{perco_games} - "
                                      f"{stats.get('gamesStats').get('percoDefWon') / perco_games * 100:.2f}%")
                embed.add_field(name="Perco def lose",
                                value=f"{stats.get('gamesStats').get('percoDefLost')}/{perco_games} - "
                                      f"{stats.get('gamesStats').get('percoDefLost') / perco_games * 100:.2f}%")
            prism_games = stats.get('gamesStats').get('prismGames')
            if prism_games > 0:
                embed.add_field(name="Parties Prisme",
                                value=f"{prism_games}/{total_games} - "
                                      f"{prism_games / total_games * 100:.2f}%", inline=False)
                embed.add_field(name="Prisme atq win",
                                value=f"{stats.get('gamesStats').get('prismAttackWon')}/{prism_games} - "
                                      f"{stats.get('gamesStats').get('prismAttackWon') / prism_games * 100:.2f}%")
                embed.add_field(name="Prisme atq lose",
                                value=f"{stats.get('gamesStats').get('prismAttackLost')}/{prism_games} - "
                                      f"{stats.get('gamesStats').get('prismAttackLost') / prism_games * 100:.2f}%")
                embed.add_field(name="Prisme no def",
                                value=f"{stats.get('gamesStats').get('prismNoDef')}/{prism_games} - "
                                      f"{stats.get('gamesStats').get('prismNoDef') / prism_games * 100:.2f}%")
                embed.add_field(name="Prisme def win",
                                value=f"{stats.get('gamesStats').get('prismDefWon')}/{prism_games} - "
                                      f"{stats.get('gamesStats').get('prismDefWon') / prism_games * 100:.2f}%")
                embed.add_field(name="Prisme def lose",
                                value=f"{stats.get('gamesStats').get('prismDefLost')}/{prism_games} - "
                                      f"{stats.get('gamesStats').get('prismDefLost') / prism_games * 100:.2f}%")
            ava_games = stats.get('gamesStats').get('avaGames')
            if ava_games > 0:
                embed.add_field(name="Parties AvA",
                                value=f"{ava_games}/{total_games} - "
                                      f"{ava_games / total_games * 100:.2f}%", inline=False)
                embed.add_field(name="AvA win",
                                value=f"{stats.get('gamesStats').get('avaWon')}/{ava_games} - "
                                      f"{stats.get('gamesStats').get('avaWon') / ava_games * 100:.2f}%")
                embed.add_field(name="Ava lose",
                                value=f"{stats.get('gamesStats').get('avaLost')}/{ava_games} - "
                                      f"{stats.get('gamesStats').get('avaLost') / ava_games * 100:.2f}%")

            await message.author.send(embed=embed)
            await message.reply(content="Je t'ai envoyé tes stats par message privé")
        else:
            await message.author.send("Aucune partie validée n'a été trouvée à ton nom")
