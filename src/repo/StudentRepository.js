import moduleConfig from "../config/ModuleConfig";

class StudentRepository {
  constructor(firebase) {
    this.firebase = firebase;
  }

  postStudentNote(githubName, note) {
    return this.getStudentDetailsByName(githubName).then((snapshot) => {
      return snapshot.ref
        .collection("notes")
        .doc()
        .set({ created: Date.now(), note: note });
    });
  }

  addEducationBuddy(githubName, name, email) {
    return this.getStudentDetailsByName(githubName).then((snapshot) => {
      return snapshot.ref
        .collection("education")
        .doc()
        .set({ created: Date.now(), name: name, email: email });
    });
  }

  addPersonalDevelopmentBuddy(githubName, name, email) {
    return this.getStudentDetailsByName(githubName).then((snapshot) => {
      return snapshot.ref
        .collection("pd")
        .doc()
        .set({ created: Date.now(), name: name, email: email });
    });
  }

  postStudentHomework(githubName, note, grade, week) {
    let noteFull = `This student's homework for <b>${week}</b> has been graded. They received a grade of <b>${grade}/10</b>.`;

    if (note !== undefined && note.length !== 0) {
      noteFull =
        noteFull +
        `<br/><br/>The reviewer said<br /><div class="code">${note}</div>`;
    }

    return this.getStudentDetailsByName(githubName)
      .then((snapshot) => {
        snapshot.ref
          .collection("notes")
          .doc()
          .set({ created: Date.now(), note: noteFull });
      })
      .then(() => {
        return this.getStudentDetailsByName(githubName).then((snapshot) => {
          snapshot.ref
            .collection("homework")
            .doc(week)
            .set({
              created: Date.now(),
              note: noteFull,
              week: week,
              result: parseFloat(grade),
            });
        });
      });
  }

  getStudentsFromSchool(schoolName) {
    return this.firebase.getStudentsInSchool(schoolName).get();
  }

  getNotesForStudent(login, onNotesRetrieved) {
    this.getStudentDetailsByName(login).then((student) => {
      student.ref
        .collection("notes")
        .orderBy("created", "desc")
        .onSnapshot((query) => {
          let data = query.docs.map((doc) => {
            return doc.data();
          });

          onNotesRetrieved({
            studentInfo: student.data(),
            studentNotes: data,
          });
        });
    });
  }

  getEducationBuddiesForStudent(login, onNotesRetrieved) {
    this.getStudentDetailsByName(login).then((student) => {
      student.ref.collection("education").onSnapshot((query) => {
        let data = query.docs.map((doc) => {
          return doc.data();
        });

        onNotesRetrieved({
          studentInfo: student.data(),
          educationBuddies: data,
        });
      });
    });
  }

  getAllHomework(schoolName) {
    return this.getStudentRefsInSchool(schoolName)
      .then((students) => {
        let homeworkPromises = students.map((doc) => {
          return doc.ref.collection("homework").get();
        });

        return Promise.all(homeworkPromises);
      })
      .then((results) => {
        let allHomework = [];

        results.forEach((i) => {
          i.docs.forEach((y) => {
            allHomework.push(y.data());
          });
        });

        return allHomework;
      });
  }

  postAttendanceForWeek(githubName, note, attended, week) {
    return this.getStudentDetailsByName(githubName)
      .then((snapshot) => {
        if (attended === "No") {
          let noteFull = `This student's did not attend class on <b>${week}</b>.`;

          if (note !== undefined && note.length !== 0) {
            noteFull =
              noteFull +
              `<br/><br/>The reviewer said<br /><div class="code">${note}</div>`;
          }

          snapshot.ref
            .collection("notes")
            .doc()
            .set({ created: Date.now(), note: noteFull });
        }
      })
      .then(() => {
        return this.getStudentDetailsByName(githubName).then((snapshot) => {
          snapshot.ref.collection("attendence").doc(week).set({
            created: Date.now(),
            note: note,
            week: week,
            result: attended,
          });
        });
      });
  }

  getStudentsInSchool(schoolName) {
    return this.firebase
      .getStudentsInSchool(schoolName)
      .get()
      .then((querySnapshot) => {
        return querySnapshot.docs.map((doc) => {
          return doc.data();
        });
      });
  }

  getStudentRefsInSchool(schoolName) {
    return this.firebase
      .getStudentsInSchool(schoolName)
      .get()
      .then((querySnapshot) => {
        return querySnapshot.docs.map((doc) => {
          return doc;
        });
      });
  }

  getAttendanceByWeek(school) {
    return this.firebase
      .getStudentsInSchool(school.name)
      .get()
      .then((querySnapshot) => {
        let attendancePromises = querySnapshot.docs.map((doc) => {
          return doc.ref.collection("attendence").get();
        });

        return Promise.all(attendancePromises);
      })
      .then((results) => {
        let attendedData = [];
        let lateAttendedData = [];
        let notAttendedData = [];

        results.forEach((i) => {
          i.docs.forEach((y) => {
            let week = y.data()["week"];
            let attended =
              y.data()["result"] === "Yes" || y.data()["result"] === "Late";
            let lateAttended = y.data()["result"] === "Late";
            let notAttended = y.data()["result"] === "No";

            if (attended) {
              if (attendedData[week] === undefined) {
                attendedData[week] = 1;
              } else {
                attendedData[week] += 1;
              }
            }

            if (lateAttended) {
              if (lateAttendedData[week] === undefined) {
                lateAttendedData[week] = 1;
              } else {
                lateAttendedData[week] += 1;
              }
            }

            if (notAttended) {
              if (notAttendedData[week] === undefined) {
                notAttendedData[week] = 1;
              } else {
                notAttendedData[week] += 1;
              }
            }
          });
        });

        let ordered = [];

        moduleConfig.forEach((week, i) => {
          if (attendedData[week] !== undefined) {
            ordered[i] = {
              name: week,
              students: attendedData[week],
              lateStudents: lateAttendedData[week],
              notAttended: notAttendedData[week],
            };
          }
        });
        return ordered;
      });
  }

  getAttendanceForStudentByName(githubName) {
    return this.getDetailsForStudentByName(githubName, "attendence");
  }

  getHomeworkForStudentByName(githubName) {
    return this.getDetailsForStudentByName(githubName, "homework");
  }

  getDetailsForStudentByName(githubName, type) {
    return this.getStudentDetailsByName(githubName)
      .then(function (doc) {
        return doc.ref.collection(type).get();
      })
      .then(function (querySnapshot) {
        return querySnapshot.docs.map(function (doc) {
          return doc.data();
        });
      })
      .catch(function (error) {
        console.log("Error getting documents: ", error);
      });
  }

  getStudentDetailsByName(githubName) {
    return this.firebase
      .getStudentByName(githubName)
      .get()
      .then(function (querySnapshot) {
        return querySnapshot.docs[0];
      });
  }

  getStudentDataByName(githubName) {
    return this.firebase
      .getStudentByName(githubName)
      .get()
      .then(function (querySnapshot) {
        return querySnapshot.docs[0].data();
      });
  }
}

export default StudentRepository;
