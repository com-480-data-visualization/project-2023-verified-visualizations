import CoordinatesMinichart from "./coordinates-minichart";
import Actions from "../actions";

const React = require('react');
const PropTypes = require('prop-types');

export default class GeoJSONComponent extends React.Component {
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
    this.setState({ error: error, data: data });
  }
  //
  // /**
  //  * Set the component to visible.
  //  */
  // show() {
  //   this.setState({ display: 'flex' });
  // }
  //
  // /**
  //  * Set the component to hidden.
  //  */
  // hide() {
  //   this.setState({ display: 'none' });
  // }

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
    const rows = this.state.data.map((row, i) => {
      return row.startGeo.coordinates
    });
    const type = {
      name: this.props.fieldName,
      values: rows
    }
    const width = 1000;//this.myInput.current.offsetWidth;
    const height = width / 1.618; // = golden ratio
    if (this.state.data.length === 0)
      return (
        <div>NO DATA YET</div>
      )
    else
      return (
        <div>
          <CoordinatesMinichart
            actions={Actions}
            fieldName={this.props.fieldName}
            type={type}
            width={width}
            height={height}
          />
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

GeoJSONComponent.propTypes = {
  store: PropTypes.any.isRequired,
  fieldName: PropTypes.string
};
