<!--suppress HtmlRequiredTitleElement -->
<script lang="ts">
  import format from 'date-fns/format';
  import Textfield from '@smui/textfield';
  import Icon from '@smui/textfield/icon';
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
  import type { User } from '../../../models/users.models';
  import { AppPermissions } from '../../../models/app.models';
  import { navigateTo } from 'svelte-router-spa';
  import CircleSpinner from '../../../components/spinner/CircleSpinner.svelte';
  import type { AccountWithUser } from '../../../models/accounts.models';

  export const currentRoute = {};
  export const params = {};

  let accountsLoaded = true;
  let isDeleting = false;
  let isDeleteModalOpen = false;
  let selectedAccount: AccountWithUser = undefined;
  let search = '';

  let items: AccountWithUser[] = [];
  let filteredItems: AccountWithUser[] = [];
  let sort: keyof AccountWithUser = 'id';
  let sortDirection: Lowercase<keyof typeof SortValue> = 'ascending';

  const fetchAccounts = async () => {
    try {
      accountsLoaded = false;
      const accounts = await $apiService.get<AccountWithUser[]>(`/accounts`);
      items = [...accounts];
    } catch (err) {
    } finally {
      accountsLoaded = true;
    }
  };

  const deleteAccount = async () => {
    try {
      if (selectedAccount) {
        isDeleting = true;
        await $apiService.delete(`/accounts/${selectedAccount.id}`);
        isDeleteModalOpen = false;
        await fetchAccounts();
      }
    } catch (err) {
    } finally {
      selectedAccount = undefined;
      isDeleting = false;
      isDeleteModalOpen = false;
    }
  };

  onMount(async () => {
    await fetchAccounts();
  });

  function handleSort() {
    filteredItems = filteredItems.sort((a, b) => {
      const [aVal, bVal] = [a[sort], b[sort]][
        sortDirection === 'ascending' ? 'slice' : 'reverse'
      ]();
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return aVal.localeCompare(bVal);
      }
      return Number(aVal) - Number(bVal);
    });
  }

  $: {
    if (search)
      filteredItems = items.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase()),
      );
    else filteredItems = items;
  }
</script>

<Dialog
  bind:open={isDeleteModalOpen}
  aria-labelledby="account-delete-modal-title"
  aria-describedby="account-delete-modal-content"
>
  <Title id="account-delete-modal-title">Supprimer un compte</Title>
  <Content id="account-delete-modal-content"
    >Es-tu sur de vouloir supprimer le compte {selectedAccount?.name} ? Attention
    c'est irréversible !!</Content
  >
  <Actions>
    <Button
      on:click={() => {
        selectedAccount = undefined;
        isDeleteModalOpen = false;
      }}
    >
      <ButtonLabel>Non</ButtonLabel>
    </Button>
    {#if isDeleting}
      <CircleSpinner />
    {:else}
      <Button on:click={deleteAccount}>
        <ButtonLabel>Oui</ButtonLabel>
      </Button>
    {/if}
  </Actions>
</Dialog>
<div class="container">
  <Textfield bind:value={search} label="Rechercher un nom" style="width: 100%">
    <Icon class="material-icons" slot="trailingIcon">search</Icon>
  </Textfield>
  <DataTable
    sortable
    bind:sort
    bind:sortDirection
    on:SMUIDataTable:sorted={handleSort}
    table$aria-label="Accounts list"
    style="width: 100%;"
  >
    <Head>
      <Row>
        <Cell columnId="name">
          <Label>Nom</Label>
          <IconButton class="material-icons">arrow_upward</IconButton>
        </Cell>
        <Cell columnId="user.name">
          <Label>Utilisateur</Label>
          <IconButton class="material-icons">arrow_upward</IconButton>
        </Cell>
        <Cell sortable={false}>Actions</Cell>
      </Row>
    </Head>
    <Body>
      {#each filteredItems as item (item.id)}
        <Row>
          <Cell>{item.name}</Cell>
          <Cell>{item.user.name}</Cell>
          <Cell>
            {#if $user.permissions.includes(AppPermissions.DeleteAccount)}
              <span
                class="table-action"
                on:click={() => {
                  isDeleteModalOpen = true;
                  selectedAccount = item;
                }}>Supprimer</span
              >
            {/if}
          </Cell>
        </Row>
      {/each}
    </Body>
    <LinearProgress
      indeterminate
      bind:closed={accountsLoaded}
      aria-label="Chargement des données"
      slot="progress"
    />
  </DataTable>
</div>
