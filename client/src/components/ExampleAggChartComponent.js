import { BarChart } from "./d3/D3Chart";
import ReactDOM from "react-dom";

const React = require('react');
const PropTypes = require('prop-types');

/**
 * Example component to render aggregated data.
 */
export default class ExampleAggChartComponent extends React.Component {
  constructor(props) {
    super(props);
    this.chartRef = React.createRef();;
    this.state = { error: null, data: [], chartWidth: 0, chartHeight: 0};
  }

  componentDidMount() {
    const cRef = this.chartRef.current;
    this.setState({chartWidth: cRef.clientWidth, chartHeight: cRef.clientHeight});
    const parentElement = ReactDOM.findDOMNode(this).parentNode;
    const parentWidth = parentElement.offsetWidth;
    const parentHeight = parentElement.offsetHeight;

    console.log("parent components width " + parentWidth);
    console.log("parent components height " + parentHeight);
    this.unsubscribeRefresh = this.props.store.listen(this.refresh.bind(this));
  }

  componentWillUnmount() {
    this.unsubscribeRefresh();
  }

  refresh(error, data) {
    console.log("raw data on refresh=", data);
    this.setState({ error: error, data: data[this.props.fieldName]});
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
      <div className="container" ref={this.chartRef}>
        <section>
          <BarChart data={this.state.data} chartWidth={this.state.chartWidth} chartHeight={this.state.chartHeight}/>
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
