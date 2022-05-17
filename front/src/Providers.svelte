<script lang="ts">
  import { QueryClient, QueryClientProvider } from '@sveltestack/svelte-query';

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        onError: (err) => {
          if (err.message) {
            console.log('From error: ' + err.message);
          }
          console.log('From error: ' + err);
        },
        retry: 1,
      },
    },
  });
</script>

<QueryClientProvider client={queryClient}>
  <slot />
</QueryClientProvider>
