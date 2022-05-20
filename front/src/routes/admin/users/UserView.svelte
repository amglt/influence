<script lang="ts">
  import { navigateTo, Route } from 'svelte-router-spa';
  import Button from '@smui/button';
  import Card from '@smui/card';
  import { Icon } from '@smui/common';
  import Autocomplete from '@smui-extra/autocomplete';
  import { onMount } from 'svelte';
  import format from 'date-fns/format';
  import type { UserWithRole } from '../../../models/users.models';
  import { apiService } from '../../../store/app';
  import CircleSpinner from '../../../components/spinner/CircleSpinner.svelte';
  import Avatar from '../../../components/avatar/Avatar.svelte';
  import UserDataRow from '../../../components/user/UserDataRow.svelte';
  import { Rank } from '../../../models/management.models';

  export let currentRoute: Route;

  let isLoadingUser = false;
  let isLoadingRoles = false;
  let isSavingUser = false;
  let roles: Rank[] = [];
  let selectedRole: Rank;
  let user: UserWithRole = {
    user_id: '',
    blocked: true,
    created_at: new Date(),
    name: '',
    identities: [],
    last_ip: '',
    last_login: new Date(),
    logins_count: 0,
    nickname: '',
    picture: '',
    updated_at: new Date(),
  };

  const fetchUser = async () => {
    try {
      isLoadingUser = true;
      user = await $apiService.get<UserWithRole>(
        `/users/${currentRoute?.namedParams?.userId}`,
      );
      selectedRole = user.role;
    } catch (err) {
    } finally {
      isLoadingUser = false;
    }
  };

  const fetchRoles = async () => {
    try {
      isLoadingRoles = true;
      const fetchedRoles = await $apiService.get<Rank[]>(`/management/roles`);
      roles = [...fetchedRoles];
    } catch (err) {
    } finally {
      isLoadingRoles = false;
    }
  };

  const saveUser = async () => {
    try {
      if (user.user_id) {
        isSavingUser = true;
        await $apiService.put(`/users/${user.user_id}`, {
          role: selectedRole,
        });
      }
    } catch (err) {
    } finally {
      isSavingUser = false;
    }
  };

  onMount(async () => {
    await fetchUser();
    await fetchRoles();
  });
</script>

<div>
  <Button on:click={() => navigateTo('/admin/users')}
    ><Icon class="material-icons">chevron_left</Icon>
    Retour</Button
  >
</div>
<div style="width: 80%; margin: auto">
  <Card padded style="width: 100%">
    {#if user.user_id}
      <div class="user-identity-wrapper">
        {#if user.picture}
          <Avatar src={user.picture} />
        {/if}
        <div class="user-identity">
          <div class="user-identity-name">
            <div class="mdc-typography--headline4">{user.name}</div>
            {#if user.nickname && user.nickname !== user.name}<div
                class="mdc-typography--subtitle1"
              >
                Surnom: {user.name}
              </div>{/if}
          </div>
          <div class="user-identity-data">
            <div class="user-identity-data-left">
              {#if user.created_at}<UserDataRow
                  prefix="Créé le:"
                  data={format(new Date(user.created_at), 'dd/MM/yyyy HH:mm')}
                />{/if}
              {#if user.updated_at}<UserDataRow
                  prefix="Dernière modif.:"
                  data={format(new Date(user.updated_at), 'dd/MM/yyyy HH:mm')}
                />{/if}
              {#if user.last_login}<UserDataRow
                  prefix="Dernière connexion:"
                  data={format(new Date(user.last_login), 'dd/MM/yyyy HH:mm')}
                />{/if}
            </div>
            <div class="user-identity-data-right">
              {#if user.last_ip}<UserDataRow
                  prefix="Dernière IP:"
                  data={user.last_ip}
                />{/if}
              {#if user.logins_count > -1}<UserDataRow
                  prefix="Nombre connexions:"
                  data={user.logins_count}
                />{/if}
              <UserDataRow
                prefix="Bloqué:"
                data={user.blocked ? 'Oui' : 'Non'}
              />
            </div>
          </div>
        </div>
      </div>
    {:else if isLoadingUser}
      <CircleSpinner />
    {:else}
      <div>Pas d'utilisateur</div>
    {/if}
  </Card>
  <Card padded style="width: 45%; margin-top: 20px">
    <div class="mdc-typography--headline5" style="margin-bottom: 10px">
      Modifier l'utilisateur
    </div>
    <Autocomplete
      options={roles}
      textfield$variant="outlined"
      textfield$style="width: 100%"
      label="Role"
      bind:value={selectedRole}
      getOptionLabel={(option) => option?.name ?? ''}
      style="margin-bottom: 10px"
      disabled={user.blocked}
    />
    {#if isSavingUser}
      <div class="centered-content">
        <CircleSpinner />
      </div>
    {:else}
      <Button variant="raised" on:click={saveUser} disabled={user.blocked}
        >Enregistrer</Button
      >
    {/if}
  </Card>
</div>

<style>
  .user-identity-wrapper {
    display: flex;
  }
  .user-identity {
    margin-left: 20px;
    width: 100%;
  }
  .user-identity-name {
    border-bottom: 1px solid lightgray;
  }
  .user-identity-data {
    display: flex;
    justify-content: center;
  }
  .user-identity-data-left,
  .user-identity-data-right {
    flex: 1;
  }
  .user-identity-name,
  .user-identity-data {
    padding: 8px;
  }
</style>
