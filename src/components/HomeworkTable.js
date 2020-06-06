import React, { forwardRef } from "react";
import MaterialTable from "material-table";
import { withRouter } from "react-router-dom";
import AddBox from "@material-ui/icons/AddBox";
import ArrowUpward from "@material-ui/icons/ArrowUpward";
import Check from "@material-ui/icons/Check";
import ChevronLeft from "@material-ui/icons/ChevronLeft";
import ChevronRight from "@material-ui/icons/ChevronRight";
import Clear from "@material-ui/icons/Clear";
import DeleteOutline from "@material-ui/icons/DeleteOutline";
import Edit from "@material-ui/icons/Edit";
import FilterList from "@material-ui/icons/FilterList";
import FirstPage from "@material-ui/icons/FirstPage";
import LastPage from "@material-ui/icons/LastPage";
import Remove from "@material-ui/icons/Remove";
import SaveAlt from "@material-ui/icons/SaveAlt";
import Search from "@material-ui/icons/Search";
import ViewColumn from "@material-ui/icons/ViewColumn";

const tableIcons = {
  Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
  Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
  Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
  DetailPanel: forwardRef((props, ref) => (
    <ChevronRight {...props} ref={ref} />
  )),
  Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
  Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
  Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
  FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
  LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
  NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  PreviousPage: forwardRef((props, ref) => (
    <ChevronLeft {...props} ref={ref} />
  )),
  ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
  SortArrow: forwardRef((props, ref) => <ArrowUpward {...props} ref={ref} />),
  ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
  ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />),
};

class HomeworkTable extends React.Component {
  columns = [
    {
      defaultSortOrder: "asc",
      render: (rowData, t) => {
        let reviewed = rowData.labels.some(
          (label) => label.name === "reviewed"
        );
        let assignee = rowData.assignees[0];

        if (reviewed) {
          return <div className="btn btn-success btn-sm">Reviewed</div>;
        } else if (assignee != null) {
          return (
            <div className="btn btn-warning btn-sm">
              In Review <br />
              by {assignee.login}
            </div>
          );
        } else {
          return <div className="btn btn-success btn-sm">To Review</div>;
        }
      },
    },
    {
      render: (rowData, t) => {
        let graded = rowData.labels.some((label) => label.name === "graded");

        if (graded) {
          return <div className="btn btn-success btn-sm">Graded</div>;
        } else {
          return <div></div>;
        }
      },
    },
    { title: "Title", field: "title" },
    {
      title: "Student",
      field: "user.login",
      render: (rowData) => {
        return (
          <button className="buttonLikeLink" href="#">
            {
              this.getStudentFromName(rowData.user.login, this.props.students)
                .name
            }
          </button>
        );
      },
    },
    {
      title: "School",
      render: (rowData) => {
        return this.getStudentFromName(rowData.user.login, this.props.students)
          .school;
      },
    },
    {
      title: "Submitted",
      field: "created_at",
      defaultSort: "asc",
      render: (rowData) => {
        return this.dateToString(new Date(rowData.created_at));
      },
    },
    {
      title: "Homework Module",
      field: "base.repo.name",
      render: (rowData) => {
        return (
          <a href={rowData.base.repo.html_url}>{rowData.base.repo.name}</a>
        );
      },
    },
    {
      render: (rowData) => {
        return (
          <div
            className="btn btn-primary btn"
            role="button"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => {
              this.props.onReviewClicked(rowData);
            }}
          >
            Review Homework
          </div>
        );
      },
    },
  ];

  options = {
    search: this.props.search || true,
    pageSize: this.props.size || 20,
    defaultExpanded: true,
    headerStyle: {
      zIndex: 0,
    },
  };

  getStudentFromName(name, students) {
    for (let i in students) {
      if (students[i].githubName === name) {
        return students[i];
      }
    }

    return {};
  }

  dateToString(a) {
    var months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes();
    return (
      date +
      " " +
      month +
      " " +
      year +
      " " +
      this.formatTime(hour) +
      ":" +
      this.formatTime(min)
    );
  }

  formatTime(num) {
    return ("0" + num).slice(-2);
  }

  onViewPullRequestClicked(pullRequestId) {
    this.props.onClick(pullRequestId);
  }

  constructor(props) {
    super(props);
    this.state = {
      columns: this.columns,
      options: this.options,
    };
  }

  render() {
    return (
      <MaterialTable
        icons={tableIcons}
        columns={this.state.columns}
        data={this.props.data}
        title=""
        isLoading={this.props.isLoading}
        options={this.state.options}
        onRowClick={(event, rowData, togglePanel) =>
          this.props.onReviewClicked(rowData)
        }
      />
    );
  }
}

export default withRouter(HomeworkTable);
