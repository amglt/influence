<script lang="ts">
  import TopAppBar, {
    Row,
    Section,
    Title,
    AutoAdjust,
  } from '@smui/top-app-bar';
  import Menu from '@smui/menu';
  import List, { Item, Separator, Text } from '@smui/list';
  import Button, { Label } from '@smui/button';
  import IconButton from '@smui/icon-button';
  import { Route, navigateTo } from 'svelte-router-spa';
  import { isAuthenticated, user, client } from '../../store/app';
  import { TopAppBarComponentDev } from '@smui/top-app-bar/dist';
  import type { MenuComponentDev } from '@smui/menu';
  import auth from '../../services/auth.service';

  export let currentRoute;
  const params = {};
  let topAppBar: TopAppBarComponentDev;
  let menu: MenuComponentDev;

  const navigateToLogin = () => navigateTo('/login');
</script>

<TopAppBar bind:this={topAppBar} variant="fixed" color="white">
  <Row>
    <Section>
      {#if $isAuthenticated}<IconButton class="material-icons">menu</IconButton
        >{/if}
      <Title>Influence</Title>
    </Section>
    <Section align="end" toolbar>
      {#if $isAuthenticated && $user}
        <div>
          <Button on:click={() => menu.setOpen(true)}>
            <Label>{$user.name}</Label>
          </Button>
          <Menu bind:this={menu}>
            <List>
              <Item on:SMUI:action={() => auth.logout($client)}>
                <Text>Se déconnecter</Text>
              </Item>
            </List>
          </Menu>
        </div>
      {:else}
        <IconButton
          class="material-icons"
          aria-label="Connexion"
          on:click={navigateToLogin}>person</IconButton
        >
      {/if}
    </Section>
  </Row>
</TopAppBar>
<AutoAdjust {topAppBar}>
  <Route {currentRoute} {params} />
</AutoAdjust>

<style>
  :global(app),
  :global(body),
  :global(html) {
    display: block !important;
    height: auto !important;
    width: auto !important;
    position: static !important;
  }
</style>
