<script>
  import 'svelte-material-ui/bare.css';
  import '@material/typography/dist/mdc.typography.min.css';
  import Providers from './Providers.svelte';
  import App from './App.svelte';
  import { onMount } from 'svelte';
  import auth from './services/auth.service';
  import { apiService, client, isAuthenticated, user } from './store/app';
  import ApiService from './services/api.service';
  import { mapUser } from './shared/utils';

  let loadApp = false;

  onMount(async () => {
    const auth0Client = await auth.createClient();
    apiService.set(new ApiService(process.env.API_URL, auth0Client));

    client.set(auth0Client);
    isAuthenticated.set(await auth0Client.isAuthenticated());
    const connectedUser = await auth0Client.getUser();
    if (connectedUser) user.set(mapUser(connectedUser));
  });

  $: if ($client && $apiService) {
    loadApp = true;
  }
</script>

{#if loadApp}
  <Providers>
    <App />
  </Providers>
{:else}
  <div>Application en cours de configuration</div>
{/if}
