<script lang="ts">
  import Drawer, {
    AppContent,
    Content,
    Scrim,
    Header,
    Title,
    Subtitle,
  } from '@smui/drawer';
  import List, { Item, Text, Graphic, Separator } from '@smui/list';
  import { navigateTo } from 'svelte-router-spa';
  import { user } from '../../store/app';
  import { AppPermissions } from '../../models/app.models';

  export let open;
  export let setOpen: (value: boolean) => void;
  export let setActive: (value: string) => void;
  export let active = '';
</script>

<div class="drawer-container">
  <Drawer variant="modal" fixed={false} bind:open>
    <Content>
      <List>
        <Item
          href="javascript:void(0)"
          on:click={() => {
            setActive('Home');
            navigateTo('/');
          }}
          activated={active === 'Home'}
        >
          <Graphic class="material-icons" aria-hidden="true">home</Graphic>
          <Text>Home</Text>
        </Item>
        {#if $user.permissions.includes(AppPermissions.IsMember)}
          <Separator />
          <Header>
            <Subtitle>Membre</Subtitle>
          </Header>
        {/if}
        {#if $user.permissions.includes(AppPermissions.IsAdmin)}
          <Separator />
          <Header>
            <Title>Admin</Title>
            <Subtitle>Gestion réservée aux membres du staff</Subtitle>
          </Header>
          {#if $user.permissions.includes(AppPermissions.IsRecruitment)}
            <Item
              href="javascript:void(0)"
              on:click={() => {
                setActive('Utilisateurs');
                navigateTo('/admin/users');
              }}
              activated={active === 'Utilisateurs'}
            >
              <Graphic class="material-icons" aria-hidden="true">group</Graphic>
              <Text>Utilisateurs</Text>
            </Item>
          {/if}
        {/if}
        {#if $user.permissions.includes(AppPermissions.IsCouncil)}
          <Separator />
          <Header>
            <Title>Conseil</Title>
            <Subtitle>Gestion réservée aux membres du conseil</Subtitle>
          </Header>
          <Item
            href="javascript:void(0)"
            on:click={() => {
              setActive('Rangs');
              navigateTo('/management/rangs');
            }}
            activated={active === 'Rangs'}
          >
            <Graphic class="material-icons" aria-hidden="true"
              >military_tech</Graphic
            >
            <Text>Rangs</Text>
          </Item>
        {/if}
      </List>
    </Content>
  </Drawer>
  <Scrim fixed={false} on:click={setOpen} />
  <AppContent class="app-content">
    <main class="main-content">
      <slot />
    </main>
  </AppContent>
</div>

<style>
  .drawer-container {
    position: relative;
    display: flex;
    height: 100%;
    overflow: hidden;
    z-index: 0;
  }

  * :global(.app-content) {
    flex: auto;
    overflow: auto;
    position: relative;
    flex-grow: 1;
  }

  .main-content {
    overflow: auto;
    padding: 16px;
    height: 100%;
    box-sizing: border-box;
  }
</style>
