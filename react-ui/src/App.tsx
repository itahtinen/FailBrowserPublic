import React from "react";
import { SuiteList } from "./SuiteList/SuiteList";
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";
import "./App.css";
import { Suite } from "./Suite/Suite";
import { CaseList } from "./Case/CaseList";
import { SampleList } from "./Sample/SampleList";
import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import { NavBar } from "./NavBar";
import { Group } from "./Group/Group";
import { Logs } from "./Logs/Logs";

export const App: React.FC = () => {
  const classes = useStyles();

  return (
    <Grid container>
      <Router>
        <NavBar />
        <Grid item xs={12}>
          <div className={classes.pageContent}>
            <Switch>
              <Route path="/suites" exact component={SuiteList} />
              <Route path="/suites/:id" component={Suite} />
              <Route path="/group/:id" component={Group} />
              <Route path="/logs/:id" component={Logs} />
              <Route path="/cases/:id" component={CaseList} />
              <Route path="/Samples/:id" component={SampleList} />
            </Switch>
          </div>
        </Grid>
      </Router>
    </Grid>
  );
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {},
    pageContent: {
      paddingTop: "10%"
    }
  })
);
