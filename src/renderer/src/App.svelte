<script lang="ts">
  import { SvelteMap } from 'svelte/reactivity'

  // MARK: Types
  // -----------------------------------------------------------------------------
  // MARK: Components
  // -----------------------------------------------------------------------------
  import NewProject from './pages/new-project/Page.svelte'
  import Projects from './pages/projects/Page.svelte'
  import Report from './pages/report/Page.svelte'
  import Settings from './pages/settings/Page.svelte'

  // MARK: Stores
  // -----------------------------------------------------------------------------
  // MARK: Properties
  // -----------------------------------------------------------------------------
  // MARK: Globals
  // -----------------------------------------------------------------------------
  const pageMap = new SvelteMap([
    ['new-project', NewProject],
    ['projects', Projects],
    ['report', Report],
    ['settings', Settings]
  ])

  // MARK: Helpers
  // -----------------------------------------------------------------------------
  // MARK: State
  // -----------------------------------------------------------------------------
  let pageName = $state<string>('projects')

  // MARK: Derived
  // -----------------------------------------------------------------------------
  let Page = $derived(pageMap.get(pageName))

  // MARK: Effects
  // -----------------------------------------------------------------------------
  // MARK: Contexts
  // -----------------------------------------------------------------------------
  // MARK: Subscriptions
  // -----------------------------------------------------------------------------
  // MARK: Events
  // -----------------------------------------------------------------------------
  function setPage(page: string) {
    pageName = page
  }

  // MARK: Lifecycle
  // -----------------------------------------------------------------------------
</script>

<Page {setPage} />
