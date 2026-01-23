<script lang="ts">
  // MARK: Types
  // -----------------------------------------------------------------------------
  type Props = {
    setPage: (page: string) => void
  }

  // MARK: Components
  // -----------------------------------------------------------------------------
  import { Button } from '@moss/comp/button'
  import { Icon } from '@moss/comp/icon'
  import { IconButton } from '@moss/comp/icon-button'
  import { NumberField, TextField } from '@moss/comp/text-field'

  // MARK: Properties
  // -----------------------------------------------------------------------------
  let { setPage }: Props = $props()

  // MARK: State
  // -----------------------------------------------------------------------------
  let formEle = $state<HTMLFormElement>()

  let customerName = $state<string>()
  let contractNo = $state<string>()
  let poNo = $state<string>()
  let price = $state<number>()

  // MARK: Events
  // -----------------------------------------------------------------------------
  function onNew(event: SubmitEvent): void {
    event.preventDefault()
    window.api.projects.new({ customerName, contractNo, poNo, price })
    formEle.reset()
    setPage('projects')
  }
</script>

<svelte:head>
  <title>Project Manager - New project</title>
</svelte:head>

<div class="app-bar">
  <IconButton tooltip="Back" onclick={() => setPage('projects')}>
    <Icon>arrow_back</Icon>
  </IconButton>
  <h1>New project</h1>
</div>

<form bind:this={formEle} onsubmit={onNew}>
  <TextField label="Customer name" bind:value={customerName} />
  <TextField label="Contract number" bind:value={contractNo} />
  <TextField label="Purchase order number" bind:value={poNo} />
  <NumberField label="Price" bind:value={price} prefix-text="$" min="0" step="0.01" />
  <div class="actions">
    <Button variant="filled">
      <Icon data-slot="icon">assignment_add</Icon>
      Create
    </Button>
  </div>
</form>

<style lang="scss">
  form {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-inline: 12px;
    max-width: 400px;
  }

  .actions {
    display: flex;
    justify-content: flex-end;
  }
</style>
