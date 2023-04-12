import {EJSON} from "bson";

const React = require('react');
const Actions = require('../actions/index')

/**
 * POC component that updates the query
 */
export default class QueryComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = { query: "{}" };
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

  handleSubmit(event) {
    try {
      const queryDoc = EJSON.parse(this.state.query)
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
          <label>
            Example add to query via textbox:
            <input type="text" value={this.state.value} onChange={this.handleChange.bind(this)} />
          </label>
          <input type="submit" value="Update" />
        </form>
        <button onClick={this.handleClear.bind(this)}>Clear Query (need to manually clear map polygons)</button>
      </div>
    );
  }

}

QueryComponent.propTypes = {
  // store: PropTypes.any.isRequired
};
