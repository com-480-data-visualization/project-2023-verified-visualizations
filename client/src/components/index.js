import React from "react";

import DocumentsComponent from './DocumentsComponent'
import SampledDataStore from '../stores/sampled-data-store'
import QueryComponent from "./QueryComponent";
import GeoJSONComponent from "./GeoJSONComponent";
import ExampleAggChartComponent from './ExampleAggChartComponent'
import PropTypes from "prop-types";
import AggregatedDataStore from "../stores/aggregated-data-store";

export default class TopComponent extends React.Component {

  constructor(props) {
    super(props);
    this.state = { query: {} };
  }

  componentDidMount() {
    this.unsubscribeRefresh = this.props.store.listen(this.refresh.bind(this));
  }

  componentWillUnmount() {
    this.unsubscribeRefresh();
  }

  refresh(state) {
    this.setState({ query: state.query });
  }
  render() {
    return (
      <div>
        <div style={{margin: 20}}>
          <h1>{`Current Query: ${JSON.stringify(this.state.query)}`}</h1>
          <QueryComponent/>
          <GeoJSONComponent store={SampledDataStore} fieldName="startGeo"/>
          <ExampleAggChartComponent store={AggregatedDataStore} fieldName="birth_year"/>
          <DocumentsComponent store={SampledDataStore}/>
        </div>
      </div>
    );
  }
}
DocumentsComponent.propTypes = {
  store: PropTypes.any.isRequired
};

