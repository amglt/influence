from discord import Embed

from influbot.api.api import post, get
from influbot.shared.models import BotError


def influtons_request_message_is_valid(message):
    content = message.content
    args = content.split()

    if args[0].lower() != '.give':
        return False
    if len(args) != 3:
        raise BotError("Trop ou trop peu d'arguments à la demande, veuillez vérifier le manuel d'utilisation")
    if len(message.mentions) == 0:
        raise BotError("Le destinataire doit être renseigné")
    if len(message.mentions) > 1:
        raise BotError("Un seul joueur doit être renseigné")
    if not args[2].isnumeric():
        raise BotError("Le montant doit être une valeur numérique")
    if message.author.id == message.mentions[0].id:
        raise BotError("Vous ne pouvez pas vous envoyer des influtons à vous même")

    return True


def wallet_request_is_valid(message):
    content = message.content
    args = content.split()

    if args[0].lower() != '.money':
        return False

    return True


async def handle_influtons_request(message):
    if influtons_request_message_is_valid(message):
        args = message.content.split()
        amount = int(args[2])
        user_from_id = message.author.id
        user_to_id = message.mentions[0].id
        requester_id = message.author.id
        await post("/wallets/transaction", data={
            "amount": amount,
            "userFromId": user_from_id,
            "userToId": user_to_id,
            "requesterId": requester_id
        })
        await message.reply(content="La transaction a bien été effectuée")


async def handle_wallet_request(message):
    if wallet_request_is_valid(message):
        wallet = await get(f"/wallets/{message.author.id}")
        embed = Embed(title="Porte-monnaie", description=f"Contenu du porte-monnaie de {message.author.display_name}")
        embed.add_field(name="Montant", value=wallet.get('balance'))
        await message.reply(embed=embed)
