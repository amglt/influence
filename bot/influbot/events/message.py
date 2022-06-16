from discord import Message, Client


async def handle_message(client: Client, message: Message):
    if message.author == client.user:
        return

    await message.reply(content="Bonjour jeune padawan")