<script lang="ts">
  // MARK: Types
  // -----------------------------------------------------------------------------
  type Props = {
    project: Project
    onComplete?: () => void
    onDelete?: () => void
  }

  type Project = {
    _id: string
    customerName: string
    contractNo: string
    poNo: string
    user: string
    price: number
    created: Date | string
    completed: string | null
    released: string | null
    bookmarked: boolean
  }

  // MARK: Components
  // -----------------------------------------------------------------------------
  import { Divider } from '@moss/comp/divider'
  import { Icon } from '@moss/comp/icon'
  import { IconButton } from '@moss/comp/icon-button'
  import { ListItem } from '@moss/comp/list'
  import { Menu, MenuItem, SubMenu } from '@moss/comp/menu'

  // MARK: Properties
  // -----------------------------------------------------------------------------
  let { onComplete, onDelete, project }: Props = $props()

  // MARK: State
  // -----------------------------------------------------------------------------
  let menuOpen = $state(false)

  // MARK: Derived
  // -----------------------------------------------------------------------------
  let folderName = $derived(`${project.contractNo} ${project.customerName}`)

  // MARK: Events
  // -----------------------------------------------------------------------------
  function copyContract() {
    navigator.clipboard.writeText(project.contractNo)
  }

  function copyDrawingTitle() {
    navigator.clipboard.writeText(`${project.customerName} - ${project.contractNo} QTY: 0`)
  }

  function copyEmailSubject() {
    navigator.clipboard.writeText(
      `${project.customerName} PO ${project.poNo} - HW ${project.contractNo}`
    )
  }

  function openFolder() {
    window.api.folders.open(folderName)
  }

  function toggleMenu() {
    menuOpen = !menuOpen
  }
</script>

<ListItem>
  <Icon data-slot="start">folder</Icon>
  <div data-slot="headline">{project.contractNo} {project.customerName}</div>
  <span data-slot="end" style="position: relative">
    <IconButton id="button-{project.contractNo}" tooltip="Menu" onclick={toggleMenu}>
      <Icon>more_vert</Icon>
    </IconButton>

    <Menu
      anchor="button-{project.contractNo}"
      bind:open={menuOpen}
      anchor-corner="start-end"
      menu-corner="end-end"
    >
      <MenuItem onclick={openFolder}>
        <div data-slot="headline">Open</div>
        <Icon data-slot="start">folder_open</Icon>
      </MenuItem>
      <!-- Copy -->
      <SubMenu>
        <MenuItem data-slot="item">
          <div data-slot="headline">Copy</div>
          <Icon data-slot="start">arrow_left</Icon>
        </MenuItem>
        <Menu data-slot="menu">
          <MenuItem onclick={copyDrawingTitle}>
            <div data-slot="headline">Drawing title</div>
            <Icon data-slot="start">text_snippet</Icon>
          </MenuItem>
          <MenuItem onclick={copyEmailSubject}>
            <div data-slot="headline">Email subject</div>
            <Icon data-slot="start">text_snippet</Icon>
          </MenuItem>
          <MenuItem onclick={copyContract}>
            <div data-slot="headline">Contract number</div>
            <Icon data-slot="start">text_snippet</Icon>
          </MenuItem>
        </Menu>
      </SubMenu>
      <!-- Copy -->
      {#if onComplete}
        <MenuItem onclick={onComplete}>
          <div data-slot="headline">Complete</div>
          <Icon data-slot="start">assignment_turned_in</Icon>
        </MenuItem>
      {/if}
      {#if onDelete}
        <Divider role="separator" tabindex="-1" />

        <MenuItem onclick={onDelete}>
          <div data-slot="headline">Delete</div>
          <Icon data-slot="start">delete</Icon>
        </MenuItem>
      {/if}
    </Menu>
  </span>
</ListItem>
