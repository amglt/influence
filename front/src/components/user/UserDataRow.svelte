<script lang="ts">
  export let prefix = '';
  export let data = '';
</script>

<div class="user-data-row">
  <div class="mdc-typography--subtitle1">{prefix}</div>
  <div class="mdc-typography--body2">{data}</div>
</div>

<style>
  .user-data-row {
    display: flex;
    align-items: center;
  }
  .mdc-typography--subtitle1 {
    color: var(--mdc-theme-secondary);
  }
</style>
