import { BarChart } from "./d3/ExampleD3";

const React = require('react');
const PropTypes = require('prop-types');

/**
 * Example component to render aggregated data.
 */
export default class ExampleAggChartComponent extends React.Component {
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
    console.log("raw data on refresh=", data)
    this.setState({ error: error, data: data[this.props.fieldName] });
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
    console.log("state data=", this.state.data)
    return (
      <div className="container">
        <h1>
          <span>{`D3 Example Chart, for ${this.props.fieldName}`}</span>
        </h1>
        <section>
          <h2>Bar chart</h2>
          <BarChart data={this.state.data} />
        </section>
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

ExampleAggChartComponent.propTypes = {
  store: PropTypes.any.isRequired
};
