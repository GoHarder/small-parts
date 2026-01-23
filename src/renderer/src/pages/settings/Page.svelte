<script lang="ts">
  import { onMount } from 'svelte'
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
  import { TextField } from '@moss/comp/text-field'

  // MARK: Properties
  // -----------------------------------------------------------------------------
  let { setPage }: Props = $props()

  // MARK: Globals
  // -----------------------------------------------------------------------------
  // MARK: Helpers
  // -----------------------------------------------------------------------------
  // MARK: State
  // -----------------------------------------------------------------------------
  let formEle = $state<HTMLFormElement>()

  let firstName = $state<string>()
  let lastName = $state<string>()
  let email = $state<string>()
  let server = $state<string>()

  // MARK: Derived
  // -----------------------------------------------------------------------------
  // MARK: Effects
  // -----------------------------------------------------------------------------
  // MARK: Contexts
  // -----------------------------------------------------------------------------
  // MARK: Subscriptions
  // -----------------------------------------------------------------------------
  // MARK: Events
  // -----------------------------------------------------------------------------
  function onUpdate(event: SubmitEvent) {
    event.preventDefault()
    window.api.settings.update({ firstName, lastName, email, server })
    formEle.reset()
    setPage('projects')
  }

  window.api.settings.listen((update) => {
    firstName = update.firstName
    lastName = update.lastName
    email = update.email
    server = update.server
  })

  // MARK: Lifecycle
  // -----------------------------------------------------------------------------
  onMount(() => {
    window.api.settings.get()
  })
</script>

<svelte:head>
  <title>Project Manager - Settings</title>
</svelte:head>

<div class="app-bar">
  <IconButton tooltip="Back" onclick={() => setPage('projects')}>
    <Icon>arrow_back</Icon>
  </IconButton>
  <h1>Settings</h1>
</div>

<form bind:this={formEle} onsubmit={onUpdate}>
  <TextField label="First name" bind:value={firstName} />
  <TextField label="Last Name" bind:value={lastName} />
  <TextField label="Work email" bind:value={email} />
  <TextField label="Server" bind:value={server} />
  <div class="actions">
    <Button variant="filled">
      <Icon data-slot="icon">save</Icon>
      Save
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
