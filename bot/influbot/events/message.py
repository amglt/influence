from discord import Message


async def on_message(message: Message):
    print('Message from {0.author}: {0.content}'.format(message))
