<script lang="ts">
  import { Route, navigateTo } from 'svelte-router-spa';
  import { onMount } from 'svelte';
  import { user } from '../../../store/app';
  import { AppPermissions } from '../../../models/app.models';

  export let currentRoute;
  const params = {};

  onMount(() => {
    if (!$user || !$user.permissions.includes(AppPermissions.IsRecruitment)) {
      navigateTo('/');
    }
  });
</script>

<Route {currentRoute} {params} />
