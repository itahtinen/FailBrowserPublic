import { RouteComponentProps } from "react-router";
import { observer } from "mobx-react";
import { useContext, useEffect } from "react";
import { LogContext } from "../Stores/AppStore";
import React from "react";

interface RouteParams {
  id: string;
}

interface Props extends RouteComponentProps<RouteParams> {}

export const Logs: React.FC<Props> = observer(({ match }) => {
  const store = useContext(LogContext);

  useEffect(() => {
    console.log(match.params.id);
  }, []);

  return (
    <div>
      This is log component for {match.params.id}
    </div>
  );
});
