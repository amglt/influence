import os

from influbot.shared.models import PvpResult, PvpType, RuntimeEnv, AllianceGuild


def is_valid_pvp_type(pvp_type: str):
    to_check = pvp_type.lower()
    return to_check == 'aw' or to_check == 'nd' or to_check == 'al' or to_check == 'dw' \
        or to_check == 'dl' or to_check == 'win' or to_check == 'loose'


def get_pvp_result_from_type(pvp_type: str):
    match pvp_type.lower():
        case "aw":
            return PvpResult.AttackWin
        case "al":
            return PvpResult.AttackLoose
        case "dw":
            return PvpResult.DefWin
        case "dl":
            return PvpResult.DefLoose
        case "win":
            return PvpResult.AvaWin
        case "loose" | "lose":
            return PvpResult.AvaLoose
        case _:
            return PvpResult.ND


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


def get_runtime_env():
    runtime_env = os.getenv("RUNTIME_ENV")
    match runtime_env:
        case "influ":
            return RuntimeEnv.Influ
        case "alliance":
            return RuntimeEnv.Alliance
        case _:
            return RuntimeEnv.Influ


def get_guild_from_roles(roles):
    if 992948334396440600 in roles:
        return AllianceGuild.Influ
    elif 992948334396440599 in roles:
        return AllianceGuild.Vegas
    elif 992948334375489634 in roles:
        return AllianceGuild.Priapes
    elif 1003429686744993869 in roles:
        return AllianceGuild.Pure
    elif 1003429760573120533 in roles:
        return AllianceGuild.Reformed
    else:
        return AllianceGuild.Influ
