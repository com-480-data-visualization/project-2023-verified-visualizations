import {EJSON} from "bson";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import "react-modern-calendar-datepicker/lib/DatePicker.css";
import { Calendar } from "react-modern-calendar-datepicker";

const React = require('react');
const Actions = require('../actions/index')

/**
 * POC component that updates the query
 */
export default class QueryComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = { query: "{}" , 
      startDate: new Date(2017, 0, 1), // January 1, 2017
      endDate: new Date(2017, 0, 31), // January 31, 2017};
      // selectedDateRange : []
    };
    
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    // this.unsubscribeRefresh = this.props.store.listen(this.refresh.bind(this));
  }

  componentWillUnmount() {
    // this.unsubscribeRefresh();
  }

  refresh(error, data) {
    this.setState({ query: data });
  }

  handleChange(event) {
    this.setState({ query: event.target.value });
  }

  handleDateRangeSelect = () => {
    const startDate = this.state.startDate;
    const endDate = this.state.endDate;

    // Convert the selected dates to MongoDB-compatible format
    // const formattedStartDate = 'new ISODate('+startDate.toISOString()+')';
    // const formattedEndDate = 'new ISODate('+endDate.toISOString()+')';

    // Generate the MongoDB query based on the date range
    const q = {
      $expr: {
        $and: [
          { $gte: ["$starttime", new Date(startDate.toISOString())] },
          { $lt: ["$stoptime", new Date(endDate.toISOString())] }
        ]
      }
    };

    this.setState({query: q});
    console.log("Current query state " + this.state.query);
  };

  handleStartDateChange = (date) => {
    this.setState({ startDate: date }, this.handleDateRangeSelect);
  };

  handleEndDateChange = (date) => {
    this.setState({ endDate: date}, this.handleDateRangeSelect);
  };

  handleChangeQuery(q) {
    this.setState({ query: q });
  }

  handleSubmit(event) {
    this.setState({query: {}}, this.handleDateRangeSelect);
    try {
      // console.log("On submit state " + this.state.query);
      const queryDoc = EJSON.parse(EJSON.stringify(this.state.query));
      // const queryDoc = this.state.query; 
      console.log("on submit, queryDoc=", queryDoc)
      Actions.updateQuery(queryDoc)
    } catch (e) {
      alert('Invalid query: ' + this.state.query);
    }
    event.preventDefault();
  }

  handleClear(event) {
    Actions.clearQuery()
    this.setState({ query: {} })
    event.preventDefault()
  }
  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <label> Select Period of Visualization</label>
          <h2>Date Selector</h2>
          <div>
          <DatePicker
            selected={this.state.startDate}
            onChange={this.handleStartDateChange}
            selectsStart
            startDate={this.state.startDate}
            endDate={this.state.endDate}
            placeholderText="Start Date"
          />
          <DatePicker
            selected={this.state.endDate}
            onChange={this.handleEndDateChange}
            selectsEnd
            startDate={this.state.startDate}
            endDate={this.state.endDate}
            placeholderText="End Date"
            minDate={this.state.startDate}
          />
          {/* <Calendar
            value={this.state.selectedDateRange}
            onChange={this.setSelectedDateRange}
          /> */}
          </div>
          {/* <label>
            Example add to query via textbox:
            <input type="text" value={this.state.value} onChange={this.handleChange.bind(this)} />
          </label> */}
          <input type="submit" value="Update"/>
        </form>
        <button onClick={this.handleClear.bind(this)}>Clear Query (need to manually clear map polygons)</button>
      </div>
    );
  }

}

QueryComponent.propTypes = {
  // store: PropTypes.any.isRequired
};
