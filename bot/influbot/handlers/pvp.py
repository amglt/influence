import os

from discord import Message, Embed, Client, Reaction, Member

from influbot.api.api import post, put, get, delete
from influbot.shared.models import BotError, PvpType
from influbot.shared.utils import is_valid_pvp_type, get_pvp_result_from_type, get_pvp_type_from_command, index_exists, \
    map_names_from_mentions
from enum import Enum
import arrow


class PvpGameStatus(Enum):
    Pending = 0
    Rejected = 1
    Accepted = 2


def is_perco_prism_content_valid(message: Message):
    content = message.content
    args = content.split()

    if args[0].lower() != '.p' and args[0].lower() != '.pr':
        return False
    if len(args) > 7 or len(args) < 3:
        raise BotError("Trop ou trop peu d'arguments à la demande, veuillez vérifier le manuel d'utilisation")
    if not is_valid_pvp_type(args[1]):
        raise BotError("Type du combat invalide")
    if len(message.mentions) == 0:
        raise BotError("Au moins un joueur requis")
    if len(message.attachments) == 0 or len(message.attachments) > 1 \
            or (message.attachments[0].content_type != 'image/jpeg'
                and message.attachments[0].content_type != 'image/png'):
        raise BotError("Screenshot manquant ou invalide, merci de ne lier qu'un fichier et celui-ci de type image")

    return True


def is_ava_content_valid(message: Message):
    content = message.content
    args = content.split()

    if args[0].lower() != '.a' and args[0].lower() != '.ava':
        return False
    if len(args) != 2:
        raise BotError("Trop ou trop peu d'arguments à la demande, veuillez vérifier le manuel d'utilisation")
    if args[1].lower() != 'win' and args[1].lower() != 'loose':
        raise BotError("Les résultats ava valable sont win ou loose")
    if len(message.attachments) == 0 or len(message.attachments) > 1 \
            or (message.attachments[0].content_type != 'image/jpeg'
                and message.attachments[0].content_type != 'image/png'):
        raise BotError("Screenshot manquant ou invalide, merci de ne lier qu'un fichier et celui-ci de type image")

    return True


def has_pvp_validation_role(roles):
    validation_roles_ids = os.getenv("PVP_VALIDATION_ROLES").split(",")
    has_valid_role = False
    for role_id in validation_roles_ids:
        if any(x for x in roles if str(x.id) == role_id):
            has_valid_role = True
            break
    return has_valid_role


def check_pvp_reaction_validity(reaction: Reaction, user: Member, message_id):
    return reaction.message.id == message_id and has_pvp_validation_role(user.roles)


async def generate_game(client, message, game_type, game):
    args = message.content.split()

    created_game = await post('/pvp-games', data=game)
    embed = Embed(title=f"Combat PVP {game_type.name}", description="Information concernant la partie")
    if game_type == PvpType.Perco or game_type == PvpType.Prism:
        embed.add_field(name="Participants", value=map_names_from_mentions(message.mentions), inline=False)
    embed.add_field(name=f"Type de combat {game_type.name}", value=args[1].upper(), inline=False)
    embed.add_field(name="C/C", value=f"```{message.content}```", inline=False)
    if game_type == PvpType.Perco:
        embed.set_thumbnail(url="https://i.ibb.co/mJZb8vn/devblog-perco1.png")
    elif game_type == PvpType.Prism:
        embed.set_thumbnail(url="https://i.ibb.co/Hr98Xxp/prismeankama.png")
    date = arrow.get(created_game.get('timestamp'))
    embed.set_footer(text=f"Influence - {created_game.get('id')} - {date.format('DD/MM/YYYY HH:mm:ss')}")

    sent_message: Message = await message.reply(embed=embed)
    reaction, user = await client.wait_for("reaction_add",
                                           check=lambda x, y: check_pvp_reaction_validity(x, y, sent_message.id),
                                           timeout=None)
    if reaction.emoji == '✅':
        await put(f"/pvp-games/{created_game.get('id')}",
                  data={"isBigAlliance": True, "status": PvpGameStatus.Accepted.value})
    elif reaction.emoji == '☑️':
        await put(f"/pvp-games/{created_game.get('id')}",
                  data={"isBigAlliance": False, "status": PvpGameStatus.Accepted.value})
    elif reaction.emoji == '❌':
        await put(f"/pvp-games/{created_game.get('id')}",
                  data={"status": PvpGameStatus.Rejected.value})


async def handle_remove_transaction(message: Message):
    args = message.content.split()
    game_id = args[1]
    game = await get(f"/pvp-games/{game_id}")
    if has_pvp_validation_role(message.author.roles) or str(message.author.id) in game.get('requester'):
        await delete(f"/pvp-games/{game_id}")
        embed = Embed(title=f"Retrait de partie pvp", description="Le contenu a bien été supprimé")
        await message.reply(embed=embed)
    else:
        embed = Embed(title=f"Retrait de partie pvp",
                      description="Vous n'avez pas la permission d'effectuer cette action")
        await message.reply(embed=embed)


async def handle_ava(client: Client, message: Message):
    if is_ava_content_valid(message):
        args = message.content.split()
        game_type = PvpType.AvA
        game_result = get_pvp_result_from_type(args[1])
        game = {
            "type": game_type.value,
            "result": game_result.value,
            "screenshotUrl": message.attachments[0].url,
            "player1": f"oauth|discord|{message.author.id}",
            "player2": None,
            "player3": None,
            "player4": None,
            "player5": None,
            "requester": f"oauth|discord|{message.author.id}"
        }
        await generate_game(client, message, game_type, game)


async def handle_perco_prism(client: Client, message: Message):
    if is_perco_prism_content_valid(message):
        args = message.content.split()
        game_type = get_pvp_type_from_command(args[0])
        game_result = get_pvp_result_from_type(args[1])
        game = {
            "type": game_type.value,
            "result": game_result.value,
            "screenshotUrl": message.attachments[0].url,
            "player1": f"oauth|discord|{message.mentions[0].id}",
            "player2": None,
            "player3": None,
            "player4": None,
            "player5": None,
            "requester": f"oauth|discord|{message.author.id}"
        }
        if index_exists(message.mentions, 1):
            game["player2"] = f"oauth|discord|{message.mentions[1].id}"
        if index_exists(message.mentions, 2):
            game["player3"] = f"oauth|discord|{message.mentions[2].id}"
        if index_exists(message.mentions, 3):
            game["player4"] = f"oauth|discord|{message.mentions[3].id}"
        if index_exists(message.mentions, 4):
            game["player5"] = f"oauth|discord|{message.mentions[4].id}"

        await generate_game(client, message, game_type, game)
