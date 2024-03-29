from enum import Enum


class EnabledModules(Enum):
    Influtons = "Influtons"
    Pvp = "Pvp"


class BotError(Exception):
    def __init__(self, message: str, description: str = None):
        self.message = message
        self.description = description
        super(BotError, self).__init__(self.message)


class PvpResult(Enum):
    AttackWin = 0
    AttackLoose = 1
    DefWin = 2
    DefLoose = 3
    AvaWin = 4
    AvaLoose = 5
    ND = 6
    NA = 7


class PvpType(Enum):
    Perco = 0
    Prism = 1
    AvA = 2


class RuntimeEnv(Enum):
    Influ = 0
    Alliance = 1


class AllianceGuild(Enum):
    Influ = 0
    Pure = 1
    Vegas = 2
    Priapes = 3
    Reformed = 4
    PTR = 5
    Loups = 6
    Impact = 7
    VodkaBlue = 8
    Brouilles = 9
    Spectral = 10
    PorkOufs = 11
    Equinoxe = 12
