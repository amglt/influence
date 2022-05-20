<!--suppress HtmlRequiredTitleElement -->
<script lang="ts">
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
  import { apiService } from '../../../store/app';
  import type { Rank } from '../../../models/management.models';
  import { navigateTo } from 'svelte-router-spa';

  export const currentRoute = {};
  export const params = {};

  let ranksLoaded = true;
  let isDeleting = false;
  let isDeleteModalOpen = false;
  let rankToDelete: Rank = undefined;

  let items: Rank[] = [];
  let sort: keyof Rank = 'id';
  let sortDirection: Lowercase<keyof typeof SortValue> = 'ascending';

  const fetchRoles = async () => {
    try {
      ranksLoaded = false;
      const roles = await $apiService.get<Rank[]>(`/management/roles`);
      items = [...roles];
    } catch (err) {
    } finally {
      ranksLoaded = true;
    }
  };

  const deleteRole = async () => {
    try {
      if (rankToDelete) {
        isDeleting = true;
        await $apiService.delete(`/management/roles/${rankToDelete.id}`);
        await fetchRoles();
      }
    } catch (err) {
    } finally {
      rankToDelete = undefined;
      isDeleting = false;
      isDeleteModalOpen = false;
    }
  };

  onMount(async () => {
    await fetchRoles();
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
  aria-labelledby="rank-delete-modal-title"
  aria-describedby="rank-delete-modal-content"
>
  <Title id="rank-delete-modal-title">Supprimer un rang</Title>
  <Content id="rank-delete-modal-content"
    >Es-tu sur de vouloir supprimer le rang {rankToDelete?.name} ? Attention c'est
    irréversible !!</Content
  >
  <Actions>
    <Button
      on:click={() => {
        rankToDelete = undefined;
        isDeleteModalOpen = false;
      }}
    >
      <ButtonLabel>Non</ButtonLabel>
    </Button>
    {#if isDeleting}
      <CircularProgress style="height: 32px; width: 32px;" indeterminate />
    {:else}
      <Button on:click={deleteRole}>
        <ButtonLabel>Oui</ButtonLabel>
      </Button>
    {/if}
  </Actions>
</Dialog>
<Button
  variant="raised"
  on:click={() => {
    navigateTo('/management/rangs-add');
  }}>Créer un rang</Button
>
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
        <Cell columnId="description">
          <Label>Description</Label>
          <IconButton class="material-icons">arrow_upward</IconButton>
        </Cell>
        <Cell sortable={false}>Actions</Cell>
      </Row>
    </Head>
    <Body>
      {#each items as item (item.id)}
        <Row>
          <Cell>{item.name}</Cell>
          <Cell>{item.description}</Cell>
          <Cell>
            {#if item.id !== process.env.COUNCIL_ROLE_ID}
              <span
                class="table-action"
                on:click={() => {
                  navigateTo(`/management/rangs/${item.id}`);
                }}>Modifier</span
              >
              -
              <span
                class="table-action"
                on:click={() => {
                  isDeleteModalOpen = true;
                  rankToDelete = item;
                }}>Supprimer</span
              >
            {/if}
          </Cell>
        </Row>
      {/each}
    </Body>
    <LinearProgress
      indeterminate
      bind:closed={ranksLoaded}
      aria-label="Chargement des données"
      slot="progress"
    />
  </DataTable>
</div>
