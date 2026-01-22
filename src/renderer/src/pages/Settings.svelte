<script lang="ts">
  // MARK: Types
  // -----------------------------------------------------------------------------
  type Props = {
    firstName: string
    lastName: string
    email: string
    server: string
  }

  // MARK: Components
  // -----------------------------------------------------------------------------
  import { Button } from '@moss/comp/button'
  import { Icon } from '@moss/comp/icon'
  import { TextField } from '@moss/comp/text-field'

  // MARK: Stores
  // -----------------------------------------------------------------------------
  // MARK: Properties
  // -----------------------------------------------------------------------------
  let { firstName, lastName, email, server }: Props = $props()

  // MARK: Globals
  // -----------------------------------------------------------------------------
  // MARK: Helpers
  // -----------------------------------------------------------------------------
  // MARK: State
  // -----------------------------------------------------------------------------
  let formEle = $state<HTMLFormElement>()

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
  function onsubmit(event: SubmitEvent) {
    event.preventDefault()
    window.api.settings.update({ firstName, lastName, email, server })
    formEle.reset()
  }

  // MARK: Lifecycle
  // -----------------------------------------------------------------------------
</script>

<svelte:head>
  <title>Project Manager - Settings</title>
</svelte:head>

<h1>Settings</h1>

<form bind:this={formEle} {onsubmit}>
  <TextField label="First name" bind:value={firstName} />
  <TextField label="Last name" bind:value={lastName} />
  <TextField label="Work email" bind:value={email} />

  <Button variant="filled">
    <Icon data-slot="icon">save</Icon>
    Save
  </Button>
</form>

<!-- <style lang="scss">
</style> -->
