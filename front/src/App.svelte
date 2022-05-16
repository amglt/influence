<script lang="ts">
  import 'svelte-material-ui/bare.css';
  import { Router } from 'svelte-router-spa';
  import Home from './routes/Home.svelte';
  import Public from './components/layout/Public.svelte';
  import Login from './routes/Login.svelte';
  import { onMount } from 'svelte';
  import auth from './services/auth.service';
  import { client, isAuthenticated, user } from './store/app';

  onMount(async () => {
    const auth0Client = await auth.createClient();

    client.set(auth0Client);
    isAuthenticated.set(await auth0Client.isAuthenticated());
    user.set(await auth0Client.getUser());
  });

  $: console.log($user);

  const routes = [
    {
      name: '/',
      component: Home,
      layout: Public,
    },
    {
      name: 'login',
      component: Login,
      layout: Public,
      onlyIf: { guard: !$isAuthenticated, redirect: '/' },
    },
  ];
</script>

<Router {routes} />
