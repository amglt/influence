<script lang="ts">
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

  let ranksLoaded = true;
  let items: Rank[] = [];
  let sort: keyof Rank = 'id';
  let sortDirection: Lowercase<keyof typeof SortValue> = 'ascending';

  onMount(() => {
    ranksLoaded = false;
    $apiService
      .get<Rank[]>(`/management/roles`)
      .then((data) => (items = data))
      .finally(() => {
        ranksLoaded = true;
      });
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
      </Row>
    </Head>
    <Body>
      {#each items as item (item.id)}
        <Row>
          <Cell>{item.name}</Cell>
          <Cell>{item.description}</Cell>
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
