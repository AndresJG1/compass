const React = require('react');
const app = require('hadron-app');
const ReactTooltip = require('react-tooltip');

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = { collapsed: false };
    this.sideBar = app.appRegistry.getComponent('Sidebar.Component');
    this.collectionView = app.appRegistry.getComponent('Collection.Collection');
    this.collectionsTable = app.appRegistry.getComponent('Database.CollectionsTable');
    /**
     * TODO (imlucas) Handle state when rtss permissions not available.
     */
    this.serverStatsView = app.appRegistry.getComponent('RTSS.ServerStats');
    this.CreateDatabaseDialog = app.appRegistry.getComponent('DatabaseDDL.CreateDatabaseDialog');
    this.DropDatabaseDialog = app.appRegistry.getComponent('DatabaseDDL.DropDatabaseDialog');
    this.CreateCollectionDialog = app.appRegistry.getComponent('Database.CreateCollectionDialog');
    this.DropCollectionDialog = app.appRegistry.getComponent('Database.DropCollectionDialog');
    this.InstanceHeader = app.appRegistry.getComponent('InstanceHeader.Component');
  }

  getContentClasses() {
    return 'content' +
      (this.state.collapsed ? ' content-sidebar-collapsed' : ' content-sidebar-expanded');
  }

  collapseSidebar() {
    this.setState({ collapsed: !this.state.collapsed });
  }

  renderContent() {
    let view;
    switch (this.props.mode) {
      case 'database':
        view = (<this.collectionsTable />);
        break;
      case 'collection':
        view = (<this.collectionView namespace={this.props.namespace} />);
        break;
      default:
        view = (<this.serverStatsView interval={1000}/>);
    }

    return view;
  }

  render() {
    // if server is not writable, include global tooltip component for diabled buttons
    const isNotWritableTooltip = app.dataService.isWritable() ? null : (
      <ReactTooltip
        id="is-not-writable"
        effect="solid"
        class="is-not-writable-tooltip"
        place="right"
        delayShow={200}
      />
    );

    return (
      <div className="page-container">
        <this.InstanceHeader />
        <div className="page">
          <div className={this.getContentClasses()}>
            {this.renderContent()}
          </div>
          <this.sideBar onCollapse={this.collapseSidebar.bind(this)}/>
          {isNotWritableTooltip}
          <this.CreateDatabaseDialog />
          <this.DropDatabaseDialog />
          <this.CreateCollectionDialog />
          <this.DropCollectionDialog />
        </div>
      </div>
    );
  }
}

Home.propTypes = {
  mode: React.PropTypes.oneOf(['instance', 'database', 'collection']),
  namespace: React.PropTypes.string
};

Home.displayName = 'Home';

module.exports = Home;