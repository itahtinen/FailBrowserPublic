import React, { useContext } from "react";
import { observer } from "mobx-react";
import { LogContext } from "../Stores/AppStore";
import { Link } from "react-router-dom";
import { Theme, createStyles, makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";

export const SuiteList: React.FC = observer(() => {
  const store = useContext(LogContext);
  const classes = useStyles();

  return (
    <Paper className={classes.root}>
      <Table className={classes.table} size="small">
        <TableHead>
          <TableRow>
            <TableCell>Group / Suite name</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {store.suiteListAll.map(suite => (
            <TableRow hover key={suite.id}>
              <TableCell
                style={
                  suite.parentid
                    ? { paddingLeft: "25px" }
                    : { fontSize: "15px" }
                }
                component="th"
                scope="suite"
              >
                  <Link
                    to={
                      suite.parentid
                        ? `/suites/${suite.id}`
                        : `/group/${suite.id}`
                    }
                  >
                    {suite.name}
                  </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
});

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: 400,
      marginTop: theme.spacing(3),
      overflowX: "auto",
      justifyContent: "center"
    },
    table: {
      minWidth: 400
    },
    isChild: {
      marginLeft: "20px"
    },
    isParent: {
      fontSize: "20px"
    }
  })
);
