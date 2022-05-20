<script lang="ts">
  import CircularProgress from '@smui/circular-progress';
  import FormField from '@smui/form-field';
  import Checkbox from '@smui/checkbox';
  import Card from '@smui/card';
  import Textfield from '@smui/textfield';
  import LayoutGrid, { Cell } from '@smui/layout-grid';
  import { apiService } from '../../../store/app';
  import type {
    Permission,
    PermissionWithChecked,
    RoleWithPermissions,
  } from '../../../models/app.models';
  import { onMount } from 'svelte';
  import { Icon, Label } from '@smui/common';
  import Button from '@smui/button';
  import { navigateTo, Route } from 'svelte-router-spa';

  export let currentRoute: Route;
  export const params = {};

  let isLoadingRole = false;
  let loadedPermissions = true;
  let isEditingRole = false;
  let checkedPermissions: PermissionWithChecked[] = [];
  let rankName = '';
  let rankDescription = '';

  const fetchPermissions = async () => {
    try {
      loadedPermissions = false;
      const permissions = await $apiService.get<Permission[]>(
        `/management/permissions`,
      );
      checkedPermissions = [
        ...permissions.map((perm) => ({ ...perm, checked: false })),
      ];
    } catch (err) {
    } finally {
      loadedPermissions = true;
    }
  };

  const fetchRole = async () => {
    try {
      if (currentRoute?.namedParams?.roleId) {
        isLoadingRole = false;
        const role = await $apiService.get<RoleWithPermissions>(
          `/management/roles/${currentRoute?.namedParams?.roleId}`,
        );
        rankName = role.name;
        rankDescription = role.description;
        for (const perm of role.permissions) {
          const relatedPermIndex = checkedPermissions.findIndex(
            (cPerm) => cPerm.permission_name === perm.permission_name,
          );
          if (relatedPermIndex > -1) {
            checkedPermissions[relatedPermIndex].checked = true;
          }
        }
      }
    } catch (err) {
    } finally {
      loadedPermissions = true;
    }
  };

  const editRole = async () => {
    try {
      if (currentRoute?.namedParams?.roleId) {
        isEditingRole = true;
        await $apiService.patch(
          `/management/roles/${currentRoute?.namedParams?.roleId}`,
          {
            name: rankName,
            description: rankDescription,
            permissions: [
              ...checkedPermissions
                .filter((perm) => perm.checked)
                .map((perm) => ({
                  permission_name: perm.permission_name,
                  resource_server_identifier: perm.resource_server_identifier,
                })),
            ],
          },
        );
        navigateTo('/management/rangs');
      }
    } catch (err) {}
  };

  onMount(async () => {
    await fetchPermissions();
    await fetchRole();
  });
</script>

<div>
  <Button on:click={() => navigateTo('/management/rangs')}
    ><Icon class="material-icons">chevron_left</Icon>
    Retour</Button
  >
</div>
<div class="add-role-card">
  <Card padded style="width: 80%">
    <FormField style="width: 100%;">
      <Textfield
        bind:value={rankName}
        style="width: 100%;"
        label="Nom du rang"
      />
    </FormField>
    <FormField style="width: 100%;">
      <Textfield
        bind:value={rankDescription}
        style="width: 100%;"
        label="Description"
      />
    </FormField>
    <FormField style="width: 100%;">
      <Label>Permissions:</Label>
      {#if loadedPermissions}
        <LayoutGrid>
          {#each checkedPermissions as permission}
            <Cell style="display: flex; align-items: center" span={3}>
              <Checkbox bind:checked={permission.checked} />
              <Label>{permission.permission_name}</Label>
            </Cell>
          {/each}
        </LayoutGrid>
      {:else}
        <CircularProgress style="height: 32px; width: 32px;" indeterminate />
      {/if}
    </FormField>
    {#if isEditingRole}
      <div class="creation-loader">
        <CircularProgress style="height: 32px; width: 32px;" indeterminate />
      </div>
    {:else}
      <Button
        variant="raised"
        on:click={() => editRole()}
        disabled={!rankName || !rankDescription}>Modifier</Button
      >
    {/if}
  </Card>
</div>

<style>
  .add-role-card {
    display: flex;
    justify-content: center;
  }
  .creation-loader {
    display: flex;
    justify-content: center;
  }
</style>
