import {EJSON} from "bson";
import { Form, Button, Row, Col } from 'react-bootstrap';

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
      // startDate: new Date(2017, 0, 1), // January 1, 2017
      // endDate: new Date(2017, 0, 31), // January 31, 2017};
      // selectedDateRange : []
      // selectedDates: [{ year: 2017, month: 1, day: 1 }],
      selectedStartDate: { year: 2017, month: 1, day: 1 },
      selectedEndDate: { year: 2017, month: 1, day: 31 },
      startTime: "00:00",
      endTime: "23:59",
      // timeRange: { start: '00:00', end: '23:59' },
      // timeRange: [0, 23],
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
    const selectedStartDate = this.state.selectedStartDate;
    const selectedEndDate = this.state.selectedEndDate;
    const startTime = this.state.startTime;
    const endTime = this.state.endTime;
    // const timeRange = this.state.timeRange;
    // const selectedDates = this.state.selectedDates;
    // const dateList = selectedDates.map((date) => {
    //   const { year, month, day } = date;
    //   return new Date(year, month - 1, day, startTime);
    // });

    // Convert the selected dates to MongoDB-compatible format
    // const formattedStartDate = 'new ISODate('+startDate.toISOString()+')';
    // const formattedEndDate = 'new ISODate('+endDate.toISOString()+')';

    const startDate = new Date(
      selectedStartDate.year,
      selectedStartDate.month -1 ,
      selectedStartDate.day,
    );
    startDate.setHours(Number(startTime.split(":")[0]), Number(startTime.split(":")[1]));
    // startDate.setHours(timeRange[0], 0, 0);
    const endDate = new Date(
      selectedEndDate.year,
      selectedEndDate.month,
      selectedEndDate.day,
    );
    endDate.setHours(Number(endTime.split(":")[0]), Number(endTime.split(":")[1]));
    // endDate.setHours(timeRange[1], 59, 59);

    // Generate the MongoDB query based on the date range
    const q = {
      $expr: {
        $and: [
          { $gte: ["$starttime", startDate] },
          { $lt: ["$stoptime", endDate] }
        ]
      }
    };

    this.setState({query: q});
    console.log("Current query state " + EJSON.stringify(this.state));
  };

  handleStartDateChange = (date) => {
    this.setState({ selectedStartDate: date }, this.handleDateRangeSelect);
  };

  handleEndDateChange = (date) => {
    this.setState({ selectedEndDate: date}, this.handleDateRangeSelect);
  };

  // handleDateChange = (selectedDates) => {
  //   this.setState({ selectedDates }, this.handleDateRangeSelect);
  // };

  handleStartTimeChange = (e) => {
    this.setState({ startTime: e.target.value }, this.handleDateRangeSelect);
  };

  handleEndTimeChange = (e) => {
    this.setState({ endTime: e.target.value }, this.handleDateRangeSelect);
  };

  // handleTimeRangeChange(timeRange) {
  //   this.setState({ timeRange: timeRange }, this.handleDateRangeSelect);
  // }

  handleChangeQuery(q) {
    this.setState({ query: q });
  }

  handleSubmit(event) {
    // this.setState({query: {}}, this.handleDateRangeSelect);
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
    try {
      // console.log("On submit state " + this.state.query);
      const queryDoc = EJSON.parse(EJSON.stringify(this.state.query));
      // const queryDoc = this.state.query; 
      console.log("on submit, queryDoc=", queryDoc)
      Actions.updateQuery(queryDoc)
    } catch (e) {
      alert('Invalid query: ' + this.state.query);
    }
    event.preventDefault()
  }
  render() {

return (
  <div>
    <Form onSubmit={this.handleSubmit}>
      <Form.Label>Select Period of Visualization</Form.Label>
      <h2>Date Selector</h2>
      <Row>
        <Col>
          <Row className="justify-content-center">
            <Col>
              <Calendar
                value={this.state.selectedStartDate}
                onChange={this.handleStartDateChange}
                shouldHighlightWeekends
              />
              <Form.Group>
                <Form.Label>Start Time</Form.Label>
                <Form.Control
                  type="time"
                  value={this.state.startTime}
                  onChange={this.handleStartTimeChange}
                />
              </Form.Group>
            </Col>
            <Col>
              <Calendar
                value={this.state.selectedEndDate}
                onChange={this.handleEndDateChange}
                shouldHighlightWeekends
              />
              <Form.Group>
                <Form.Label>End Time</Form.Label>
                <Form.Control
                  type="time"
                  value={this.state.endTime}
                  onChange={this.handleEndTimeChange}
                />
              </Form.Group>
            </Col>
          </Row>
        </Col>
        <Col>
          <Row>
            <Col>
              <p>
                To let users explore the dynamics of bike sharing in the city, we allow them to select the day of the month as well as the exact time. We give users this level of granularity because trends and statistics in bike sharing change quite dramatically based on the season and time of day. For example, summer months have increased rates, and by looking at times of the day, we can identify how many people may be using bikes to commute. We encourage users to explore such dynamics using the date and time selector and observing the graphs.
              </p>
            </Col>
          </Row>
          <Row>
            <Col>
              <Button variant="primary" type="submit">
                Run Query
              </Button>
              <Button variant="secondary" onClick={this.handleClear.bind(this)}>
                Clear Query (need to manually clear map polygons)
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>
    </Form>
  </div>
);
    

  }
}

QueryComponent.propTypes = {
  // store: PropTypes.any.isRequired
};
