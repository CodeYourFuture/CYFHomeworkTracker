import React from "react";
import { withRouter } from "react-router-dom";
import {
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  LineChart,
  Legend,
  Line,
  ResponsiveContainer,
} from "recharts";

class HomeworkGraph extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div>
        <ResponsiveContainer height={333}>
          <LineChart data={this.props.homework}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="week" />
            <YAxis type="number" domain={[0, 10]} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="result" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  }
}

export default withRouter(HomeworkGraph);
