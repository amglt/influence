<script lang="ts">
  export let src = '';
  export let isSmall = false;
</script>

{#if src}
  {#if isSmall}
    <img {src} alt="user-avatar" class="user-avatar" height="45" width="45" />
  {:else}
    <img {src} alt="user-avatar" class="user-avatar" height="130" width="130" />
  {/if}
{/if}

<style>
  .user-avatar {
    border: 1px solid lightgray;
    border-radius: 50%;
  }
</style>
