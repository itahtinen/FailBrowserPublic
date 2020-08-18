import React, { useContext } from "react";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import Grid from "@material-ui/core/Grid";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import SearchIcon from "@material-ui/icons/Search";
import InputBase from "@material-ui/core/InputBase";
import { fade } from "@material-ui/core/styles/colorManipulator";
import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import { withRouter } from "react-router-dom";
import { LogContext } from "./Stores/AppStore";

interface Props {
  history: any;
}

export const NavBarComponent: React.FC<Props> = ({ history }) => {
  const classes = useStyles();
  const store = useContext(LogContext);

  function handleChange(event: React.ChangeEvent<{}>, newValue: number) {
    history.push(newValue);
  }

  function handleSearchInput(event: React.ChangeEvent<HTMLInputElement>) {
    store.setFilterString(event.target.value);
  }

  return (
    <Grid item xs={12}>
      <AppBar>
        <Toolbar>
          <Grid item xs={3}>
            <div className={classes.search}>
              <div className={classes.searchIcon}>
                <SearchIcon />
              </div>
              <InputBase
                placeholder="Search…"
                classes={{
                  root: classes.inputRoot,
                  input: classes.inputInput
                }}
                inputProps={{ "aria-label": "Search" }}
                onChange={handleSearchInput}
              />
            </div>
          </Grid>
          <Grid item xs={8} style={{ paddingLeft: "55px" }}>
            <Tabs value={history.location.pathname} onChange={handleChange}>
              <Tab className={classes.tab} label="Home" value="/home" />
              <Tab className={classes.tab} label="Suite list" value="/suites" />
            </Tabs>
          </Grid>
        </Toolbar>
      </AppBar>
    </Grid>
  );
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    search: {
      position: "relative",
      borderRadius: theme.shape.borderRadius,
      backgroundColor: fade(theme.palette.common.white, 0.15),
      "&:hover": {
        backgroundColor: fade(theme.palette.common.white, 0.25)
      },
      marginLeft: 0,
      width: "100%",
      [theme.breakpoints.up("sm")]: {
        marginLeft: theme.spacing(1),
        width: "auto"
      }
    },
    searchIcon: {
      width: theme.spacing(7),
      height: "100%",
      position: "absolute",
      pointerEvents: "none",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    },
    inputRoot: {
      color: "inherit",
      width: "100%"
    },
    inputInput: {
      padding: theme.spacing(1, 1, 1, 7),
      transition: theme.transitions.create("width"),
      width: "100%",
      [theme.breakpoints.up("sm")]: {
        width: 120,
        "&:focus": {
          width: 200
        }
      }
    },
    tab: {
      width: "20%"
    }
  })
);

export const NavBar = withRouter(NavBarComponent as any);
