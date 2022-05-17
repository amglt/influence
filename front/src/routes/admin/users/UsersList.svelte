<script lang="ts">
  import { format } from 'date-fns';
  import CircularProgress from '@smui/circular-progress';
  import Dialog, { Title, Content, Actions } from '@smui/dialog';
  import Button, { Label as ButtonLabel } from '@smui/button';
  import LinearProgress from '@smui/linear-progress';
  import DataTable, {
    Head,
    Body,
    Row,
    Cell,
    Label,
    SortValue,
  } from '@smui/data-table';
  import IconButton from '@smui/icon-button';
  import { onMount } from 'svelte';
  import { apiService, user } from '../../../store/app';
  import type { Rank } from '../../../models/management.models';
  import { navigateTo } from 'svelte-router-spa';
  import type { User } from '../../../models/users.models';
  import { AppPermissions } from '../../../models/app.models';

  let usersLoaded = true;
  let isDeleting = false;
  let isDeleteModalOpen = false;
  let isBanModalOpen = false;
  let selectedUser: User = undefined;

  let items: User[] = [];
  let sort: keyof User = 'user_id';
  let sortDirection: Lowercase<keyof typeof SortValue> = 'ascending';

  const fetchUsers = async () => {
    try {
      usersLoaded = false;
      const users = await $apiService.get<User[]>(`/users`);
      items = [...users];
    } catch (err) {
    } finally {
      usersLoaded = true;
    }
  };

  const deleteUser = async () => {
    try {
      if (selectedUser) {
        isDeleting = true;
        await $apiService.delete(`/users/${selectedUser.id}`);
        await fetchUsers();
      }
    } catch (err) {
    } finally {
      selectedUser = undefined;
      isDeleting = false;
      isDeleteModalOpen = false;
    }
  };

  const banUser = async () => {
    try {
      if (selectedUser) {
        isDeleting = true;
        await $apiService.patch(`/users/${selectedUser.id}`);
        await fetchUsers();
      }
    } catch (err) {
    } finally {
      selectedUser = undefined;
      isDeleting = false;
      isDeleteModalOpen = false;
    }
  };

  onMount(async () => {
    await fetchUsers();
  });

  function handleSort() {
    items.sort((a, b) => {
      const [aVal, bVal] = [a[sort], b[sort]][
        sortDirection === 'ascending' ? 'slice' : 'reverse'
      ]();
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return aVal.localeCompare(bVal);
      }
      return Number(aVal) - Number(bVal);
    });
    items = items;
  }
</script>

<Dialog
  bind:open={isDeleteModalOpen}
  aria-labelledby="user-delete-modal-title"
  aria-describedby="user-delete-modal-content"
>
  <Title id="user-delete-modal-title">Supprimer un utilisateur</Title>
  <Content id="user-delete-modal-content"
    >Es-tu sur de vouloir supprimer l'utilisateur {selectedUser?.name} ? Attention
    c'est irréversible !!</Content
  >
  <Actions>
    <Button
      on:click={() => {
        selectedUser = undefined;
        isDeleteModalOpen = false;
      }}
    >
      <ButtonLabel>Non</ButtonLabel>
    </Button>
    {#if isDeleting}
      <CircularProgress style="height: 32px; width: 32px;" indeterminate />
    {:else}
      <Button on:click={deleteUser}>
        <ButtonLabel>Oui</ButtonLabel>
      </Button>
    {/if}
  </Actions>
</Dialog>
<Dialog
  bind:open={isBanModalOpen}
  aria-labelledby="user-ban-modal-title"
  aria-describedby="user-ban-modal-content"
>
  <Title id="user-ban-modal-title">Bannir un utilisateur</Title>
  <Content id="user-ban-modal-content"
    >Es-tu sur de vouloir {#if !selectedUser?.blocked}bannir{:else}unban{/if}
    l'utilisateur {selectedUser?.name} ?</Content
  >
  <Actions>
    <Button
      on:click={() => {
        selectedUser = undefined;
        isBanModalOpen = false;
      }}
    >
      <ButtonLabel>Non</ButtonLabel>
    </Button>
    {#if isDeleting}
      <CircularProgress style="height: 32px; width: 32px;" indeterminate />
    {:else}
      <Button on:click={banUser}>
        <ButtonLabel>Oui</ButtonLabel>
      </Button>
    {/if}
  </Actions>
</Dialog>
<div class="container">
  <DataTable
    sortable
    bind:sort
    bind:sortDirection
    on:SMUIDataTable:sorted={handleSort}
    table$aria-label="User list"
    style="width: 100%;"
  >
    <Head>
      <Row>
        <Cell columnId="name">
          <Label>Nom</Label>
          <IconButton class="material-icons">arrow_upward</IconButton>
        </Cell>
        <Cell columnId="updated_at">
          <Label>Dernière modif.</Label>
          <IconButton class="material-icons">arrow_upward</IconButton>
        </Cell>
        <Cell columnId="last_login">
          <Label>Dernière connexion</Label>
          <IconButton class="material-icons">arrow_upward</IconButton>
        </Cell>
        <Cell columnId="logins_count" numeric>
          <Label>Nbre connexions</Label>
          <IconButton class="material-icons">arrow_upward</IconButton>
        </Cell>
        <Cell sortable={false}>Actions</Cell>
      </Row>
    </Head>
    <Body>
      {#each items as item (item.id)}
        <Row>
          <Cell>{item.name}</Cell>
          <Cell>{format(new Date(item.updated_at), 'dd/MM/yyyy hh:mm')}</Cell>
          <Cell>{format(new Date(item.last_login), 'dd/MM/yyyy hh:mm')}</Cell>
          <Cell numeric>{item.logins_count}</Cell>
          <Cell>
            {#if $user.permissions.includes(AppPermissions.DeleteUser)}
              <span
                class="table-action"
                on:click={() => {
                  isDeleteModalOpen = true;
                  selectedUser = item;
                }}>Supprimer</span
              >
              -
            {/if}{#if $user.permissions.includes(AppPermissions.BanUser)}
              <span
                class="table-action"
                on:click={() => {
                  isBanModalOpen = true;
                  selectedUser = item;
                }}
              >
                {#if !item.blocked}
                  Bannir
                {:else}
                  Unban
                {/if}</span
              >
            {/if}
          </Cell>
        </Row>
      {/each}
    </Body>
    <LinearProgress
      indeterminate
      bind:closed={usersLoaded}
      aria-label="Chargement des données"
      slot="progress"
    />
  </DataTable>
</div>
