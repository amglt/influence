<script lang="ts">
  import 'svelte-material-ui/bare.css';
  import { Router } from 'svelte-router-spa';
  import Home from './routes/Home.svelte';
  import Public from './components/layout/Public.svelte';
  import Login from './routes/Login.svelte';
  import { apiService, isAuthenticated, user } from './store/app';
  import Providers from './Providers.svelte';
  import CouncilLayout from './components/layout/CouncilLayout.svelte';
  import RanksList from './routes/council/ranks/RanksList.svelte';
  import RankAdd from './routes/council/ranks/RankAdd.svelte';
  import RankEdit from './routes/council/ranks/RankEdit.svelte';
  import UsersList from './routes/admin/users/UsersList.svelte';
  import RecruitmentLayout from './components/layout/admin/RecruitmentLayout.svelte';

  let fetchedPermissions = false;

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
    {
      name: 'admin',
      layout: Public,
      onlyIf: { guard: !$isAuthenticated, redirect: '/' },
      nestedRoutes: [
        {
          name: 'users',
          layout: RecruitmentLayout,
          component: UsersList,
        },
      ],
    },
    {
      name: 'management',
      layout: Public,
      onlyIf: { guard: !$isAuthenticated, redirect: '/' },
      nestedRoutes: [
        {
          name: 'rangs',
          layout: CouncilLayout,
          component: RanksList,
        },
        {
          name: 'rangs-add',
          layout: CouncilLayout,
          component: RankAdd,
        },
        {
          name: 'rangs/:roleId',
          layout: CouncilLayout,
          component: RankEdit,
        },
      ],
    },
  ];

  $: if ($user?.id && !fetchedPermissions) {
    $apiService
      .get<string[]>(`/management/users/${$user.sub}/permissions`)
      .then((data) => {
        user.update((u) => ({ ...u, permissions: data }));
      })
      .catch((e) => console.log(e))
      .finally(() => {
        fetchedPermissions = true;
      });
  }
</script>

<Providers>
  <Router {routes} />
</Providers>
