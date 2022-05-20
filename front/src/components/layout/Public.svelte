<script lang="ts">
  import TopAppBar, {
    Row,
    Section,
    Title,
    AutoAdjust,
  } from '@smui/top-app-bar';
  import Menu from '@smui/menu';
  import List, { Item, Text } from '@smui/list';
  import Button, { Label } from '@smui/button';
  import IconButton from '@smui/icon-button';
  import { Route, navigateTo } from 'svelte-router-spa';
  import { isAuthenticated, user, client } from '../../store/app';
  import { TopAppBarComponentDev } from '@smui/top-app-bar/dist';
  import type { MenuComponentDev } from '@smui/menu';
  import auth from '../../services/auth.service';
  import AppMenu from '../menu/AppMenu.svelte';
  import Avatar from '../avatar/Avatar.svelte';

  export let currentRoute;
  export let params = {};

  let topAppBar: TopAppBarComponentDev;
  let menu: MenuComponentDev;
  let isMenuOpen = false;
  let active = 'Home';

  const navigateToLogin = () => navigateTo('/login');
  const setActive = (value: string) => {
    active = value;
    isMenuOpen = false;
  };
  const setOpen = () => (isMenuOpen = !isMenuOpen);
</script>

<TopAppBar bind:this={topAppBar} variant="fixed" color="white">
  <Row>
    <Section>
      {#if $isAuthenticated}<IconButton
          class="material-icons"
          on:click={setOpen}>menu</IconButton
        >{/if}
      <img src="/logo.png" height="40" width="40" alt="influence-logo" />
      <Title>Influence</Title>
    </Section>
    <Section align="end" toolbar>
      {#if $isAuthenticated && $user}
        <div>
          <Button
            on:click={() => menu.setOpen(true)}
            style="display: flex; align-items: center;"
          >
            {#if $user.picture}<Avatar src={$user.picture} isSmall />{/if}
            <Label style="margin-left: 10px">{$user.name}</Label>
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
  <AppMenu open={isMenuOpen} {active} {setActive} {setOpen}>
    <Route {currentRoute} {params} /></AppMenu
  >
</AutoAdjust>

<style>
  :global(body),
  :global(html) {
    display: block !important;
    /*height: auto !important;
    width: auto !important;*/
    position: static !important;
  }
</style>
