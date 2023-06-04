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
    this.topRef = React.createRef();
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

          <h1 style={{textAlign: "center"}}> Welcome to City Bike Explorer </h1>
          <h3 style={{textAlign: "center"}}>
            The perfect place for cycling and data enthusiasts
          </h3>

          <div style={{textAlign: "center"}}>
            Bike usage patterns and trends change based on the time of the year or day, the region and even the age of the cyclists!
            Whether you're a commuter looking to optimize your bike route, a city planner interested in improving bike infrastructure,
            or a data analyst curious about bike sharing, our platform is here to empower you with the knowledge you seek.
            Use the interactive map, to select an area you wish to explore. The plots will be automatically updated to provide insights for the selected area!

          </div>

          <div className="body flex-grow-1 px-1">
            <div className="container-fluid">
              <div className="card mb-4">
                <div className="card-body">
                  <div className="d-flex justify-content-between">
                    <div className="center">
                      <h4 className="card-title mb-0">Interactive Map</h4>
                      <div className="h5 text-medium-emphasis mb-2">Select a poligon or a circular area using the corresponding tool</div>
                      <div className="center">
                        <GeoJSONComponent store={SampledDataStore} fieldName="startGeo"/>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className = "col-4" id="chart-1">
              <div className="body flex-grow-1 px-1">
                <div className="container-fluid">
                  <div className="card mb-4">
                    <div className="card-body">
                      <div className="d-flex justify-content-between">
                        <div>
                          <h4 className="card-title mb-0">Rides per hour</h4>
                          <ExampleAggChartComponent store={AggregatedDataStore} fieldName="ridesHour" width={500} height={300} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className = "col-4" id="chart-2">
              <div className="body flex-grow-1 px-1">
                <div className="container-fluid">
                  <div className="card mb-4">
                    <div className="card-body">
                      <div className="d-flex justify-content-between">
                        <div>
                          <h4 className="card-title mb-0">Popular Starting Stations</h4>
                          <ExampleAggChartComponent store={AggregatedDataStore} fieldName="topStartStations" width={500} height={300}/>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className = "col-4" id="chart-3">
              <div className="body flex-grow-1 px-1">
                <div className="container-fluid">
                  <div className="card mb-4">
                    <div className="card-body">
                      <div className="d-flex justify-content-between">
                        <div>
                          <h4 className="card-title mb-0">Popular Ending Stations</h4>
                          <ExampleAggChartComponent store={AggregatedDataStore} fieldName="topEndStations" width={500} height={300}/>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* <div className = "col-4">
              <div className="body flex-grow-1 px-1">
                <div className="container-fluid">
                  <div className="card mb-4">
                    <div className="card-body">
                      <div className="d-flex justify-content-between">
                        <div>
                          <h4 className="card-title mb-0">Rider demographics</h4>
                          <ExampleAggChartComponent store={AggregatedDataStore} fieldName="birth_year"/>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div> */}
          </div>

          <div className="body flex-grow-1 px-1" id="chart-4">
            <div className="container-fluid">
              <div className="card mb-4">
                <div className="card-body">
                  <div className="d-flex justify-content-between">
                    <div className="center">
                    <h4 className="card-title mb-0">Rider demographics</h4>
                          <ExampleAggChartComponent store={AggregatedDataStore} fieldName="birth_year" width={900} height={300}/>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="body flex-grow-1 px-4">
            <div className="container-fluid">
              <div className="card mb-4">
                <div className="card-body">
                  <div className="d-flex justify-content-between">
                    <div>
                      {/* <h4 className="card-title mb-0">To be removed</h4> */}
                      {/* <div className="small text-medium-emphasis">once we finish the implementation </div> */}
                      <h1>{`Current Query: ${JSON.stringify(this.state.query)}`}</h1>
                      <QueryComponent/>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* <div className="body flex-grow-1 px-4">
            <div className="container-fluid">
              <div className="card mb-4">
                <div className="card-body">
                  <div className="d-flex justify-content-between">
                    <div>
                      <h4 className="card-title mb-0">To be removed</h4>
                      <div className="small text-medium-emphasis">once we finish the implementation </div>
                      <DocumentsComponent store={SampledDataStore}/>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div> */}

        </div>
      </div>
    );
  }
}
DocumentsComponent.propTypes = {
  store: PropTypes.any.isRequired
};

