const React = require('react');
const PropTypes = require('prop-types');

/**
 * Example component to render data, right now just print raw first 10 documents.
 */
export default class DocumentsComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null, data: [] };
  }

  componentDidMount() {
    this.unsubscribeRefresh = this.props.store.listen(this.refresh.bind(this));
  }

  componentWillUnmount() {
    this.unsubscribeRefresh();
  }

  refresh(error, data) {
    this.setState({ error: error, data: data.length > 10 ? data.slice(0, 10) : data });
  }

  /**
   * Fire the show operation detail action with the row data.
   *
   * @param {Object} data - The row data.
   */
  renderError() {
    return (
      <div className="rt-lists">
        <header className="rt-lists__header">
          <h2 className="rt-lists__headerlabel">Data</h2>
        </header>
        <div className="rt-lists__empty-error">&#9888; DATA UNAVAILABLE</div>
      </div>
    );
  }

  /**
   * Render the table in the component.
   *
   * @returns {React.Component} The table.
   */
  renderGraph() {
    const rows = this.state.data.map(function(row, i) {
      return (
        <li className="rt-lists__item rt-lists__item--slow"  key={`list-item-${i}`}>
          <div className="rt-lists__op">{JSON.stringify(row)}</div>
        </li>
      );
    });
    return (
      <div className="rt-lists" >
        <header className="rt-lists__header">
          <h2 className="rt-lists__headerlabel">First 10 Documents:</h2>
        </header>
        <div className="rt-lists__listdiv" id="div-scroll">
          <ul className="rt-lists__list">
            {rows}
          </ul>
        </div>
      </div>
    );
  }

  /**
   * Renders the component.
   *
   * @returns {React.Component} The component.
   */
  render() {
    if (this.state.error) {
      return this.renderError();
    }

    return this.renderGraph();
  }
}

DocumentsComponent.propTypes = {
  store: PropTypes.any.isRequired
};
