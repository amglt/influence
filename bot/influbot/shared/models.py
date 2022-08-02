from enum import Enum


class BotError(Exception):
    def __init__(self, message: str, description: str = None):
        self.message = message
        self.description = description
        super(BotError, self).__init__(self.message)


class PvpResult(Enum):
    Loose = 0
    Win = 1
    NoDef = 2


class PvpType(Enum):
    Perco = 0
    Prism = 1
    AvA = 2
