import styled from "@emotion/styled";
import { spacing } from "@mui/system";
import {
  Alert as MuiAlert,
  Button as MuiButton,
  Divider as MuiDivider,
  Typography as MuiTypography,
  LinearProgress as MuiLinearProgress,
} from "@mui/material";

const Alert = styled(MuiAlert)(spacing);
const Divider = styled(MuiDivider)(spacing);
const Button = styled(MuiButton)(spacing);
const LinearProgress = styled(MuiLinearProgress)(spacing);
const Typography = styled(MuiTypography)(spacing);

export { Alert, Button, Divider, LinearProgress, Typography };
