from influbot.shared.models import PvpResult, PvpType


def is_valid_pvp_type(pvp_type: str):
    to_check = pvp_type.lower()
    return to_check == 'aw' or to_check == 'nd' or to_check == 'al' or to_check == 'dw' or to_check == 'dl'


def get_pvp_result_from_type(pvp_type: str):
    match pvp_type:
        case "aw" | "dw":
            return PvpResult.Win
        case "al" | "dl":
            return PvpResult.Loose
        case _:
            return PvpResult.NoDef


def get_pvp_type_from_command(command: str):
    match command:
        case ".p":
            return PvpType.Perco
        case ".pr":
            return PvpType.Prism


def index_exists(arr: list, index: int):
    return 0 <= index < len(arr)


def map_names_from_mentions(mentions: list):
    names = ""
    for mention in mentions:
        names = names + mention.name
        if mentions.index(mention) != len(mentions) - 1:
            names = names + ", "
    return names
