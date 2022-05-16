<script lang="ts">
  import Button, { Label } from '@smui/button';
  import auth from '../services/auth.service';
  import { client, isAuthenticated } from '../store/app';
  import { navigateTo } from 'svelte-router-spa';

  function login() {
    auth.loginWithPopup($client);
  }

  $: if ($isAuthenticated) navigateTo('/');
</script>

<div class="container">
  <div>La connexion au site se fait via Discord</div>
  <Button on:click={login} variant="raised">
    <Label>Raised</Label>
  </Button>
</div>
