import os

from discord import Role

from influbot.shared.models import PvpResult, PvpType, RuntimeEnv, AllianceGuild


def is_valid_pvp_type(pvp_type: str):
    to_check = pvp_type.lower()
    return to_check == 'aw' or to_check == 'nd' or to_check == 'al' or to_check == 'dw' \
        or to_check == 'dl' or to_check == 'na' or to_check == 'win' or to_check == 'loose'


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
        case "nd":
            return PvpResult.ND
        case _:
            return PvpResult.NA


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


def get_guild_from_roles(roles: list[Role]):
    if any(role for role in roles if role.id == 992948334396440600):
        return AllianceGuild.Influ
    elif any(role for role in roles if role.id == 992948334396440599):
        return AllianceGuild.Vegas
    elif any(role for role in roles if role.id == 992948334375489634):
        return AllianceGuild.Priapes
    elif any(role for role in roles if role.id == 1003429686744993869):
        return AllianceGuild.Pure
    elif any(role for role in roles if role.id == 1003429760573120533):
        return AllianceGuild.Reformed
    elif any(role for role in roles if role.id == 1011718059867774976):
        return AllianceGuild.PTR
    else:
        return AllianceGuild.Influ


def batch(iterable, n=1):
    total_len = len(iterable)
    for ndx in range(0, total_len, n):
        yield iterable[ndx:min(ndx + n, total_len)]
