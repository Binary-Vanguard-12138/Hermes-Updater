import styled from "@emotion/styled";
import { spacing } from "@mui/system";
import {
  Alert as MuiAlert,
  Button as MuiButton,
  Collapse,
  Divider as MuiDivider,
  IconButton as MuiIconButton,
  LinearProgress as MuiLinearProgress,
  Paper as MuiPaper,
  TextField as MuiTextField,
  Typography as MuiTypography,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";

const Alert = styled(MuiAlert)(spacing);
const Button = styled(MuiButton)(spacing);
const Divider = styled(MuiDivider)(spacing);
const IconButton = styled(MuiIconButton)`
  padding: 10px;
  svg {
    width: 24px;
    height: 24px;
  }
`;
const LinearProgress = styled(MuiLinearProgress)(spacing);
const Paper = styled(MuiPaper)(spacing);
const TextField = styled(MuiTextField)(spacing);
const Typography = styled(MuiTypography)(spacing);

const CollapseAlert = (props) => {
  const { errOpen, setErrOpen, errMsg, setErr } = props;
  if (undefined === errMsg || null === errMsg) {
    return <></>;
  }
  return (
    <Collapse in={errOpen}>
      <Alert
        my={4}
        severity="error"
        variant="outlined"
        sx={{ display: "flex", alignItems: "center" }}
        action={
          <IconButton
            onClick={() => {
              setErr(null);
              setErrOpen(false);
            }}
            size="large"
          >
            <CloseIcon />
          </IconButton>
        }
      >
        {errMsg}
      </Alert>
    </Collapse>
  );
};

export {
  Alert,
  Button,
  Divider,
  IconButton,
  LinearProgress,
  Paper,
  TextField,
  Typography,
  CollapseAlert,
};
