<script lang="ts">
  // MARK: Types
  // -----------------------------------------------------------------------------
  type Project = {
    contractNo: string
    poNo: string
    price: number
    customerName: string
    created: Date | string
    released: string | null
  }

  type Props = {
    project: Project
    onRelease: () => void
    onDelete: () => void
  }

  // MARK: Components
  // -----------------------------------------------------------------------------
  import { Divider } from '@moss/comp/divider'
  import { ListItem } from '@moss/comp/list'
  import { Icon } from '@moss/comp/icon'
  import { Menu, MenuItem, SubMenu } from '@moss/comp/menu'

  // MARK: Stores
  // -----------------------------------------------------------------------------
  // MARK: Properties
  // -----------------------------------------------------------------------------
  let { project, onDelete, onRelease }: Props = $props()

  // MARK: Globals
  // -----------------------------------------------------------------------------
  // MARK: Helpers
  // -----------------------------------------------------------------------------
  // MARK: State
  // -----------------------------------------------------------------------------
  let open = $state(false)

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
  function toggleMenu() {
    open = !open
  }

  function clipDwgTitle() {
    navigator.clipboard.writeText(`${project.customerName} - ${project.contractNo} QTY: 0`)
  }

  function clipEmailSubject() {
    navigator.clipboard.writeText(
      `${project.customerName} PO ${project.poNo} - HW ${project.contractNo}`
    )
  }

  function clipContract() {
    navigator.clipboard.writeText(project.contractNo)
  }

  function openFolder() {
    window.api.folders.open(`${project.contractNo} ${project.customerName}`)
    // window.api.openFolder(`${project.contractNo} ${project.customerName}`)
  }

  // MARK: Lifecycle
  // -----------------------------------------------------------------------------
</script>

<span style="position: relative">
  <ListItem type="button" id="project-row-{project.contractNo}" onclick={toggleMenu}>
    <div data-slot="headline">{project.contractNo} {project.customerName}</div>
    <div data-slot="supporting-text">PO: {project.poNo}</div>
    <Icon data-slot="end">more_vert</Icon>
  </ListItem>

  <Menu
    anchor="project-row-{project.contractNo}"
    bind:open
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
        <MenuItem onclick={clipDwgTitle}>
          <div data-slot="headline">Drawing title</div>
          <Icon data-slot="start">text_snippet</Icon>
        </MenuItem>
        <MenuItem onclick={clipEmailSubject}>
          <div data-slot="headline">Email subject</div>
          <Icon data-slot="start">text_snippet</Icon>
        </MenuItem>
        <MenuItem onclick={clipContract}>
          <div data-slot="headline">Contract number</div>
          <Icon data-slot="start">text_snippet</Icon>
        </MenuItem>
      </Menu>
    </SubMenu>
    <!-- Copy -->
    <MenuItem onclick={onRelease}>
      <div data-slot="headline">Release</div>
      <Icon data-slot="start">assignment_turned_in</Icon>
    </MenuItem>
    <Divider role="separator" tabindex="-1" />
    <MenuItem onclick={onDelete}>
      <div data-slot="headline">Delete</div>
      <Icon data-slot="start">delete</Icon>
    </MenuItem>
  </Menu>
</span>
