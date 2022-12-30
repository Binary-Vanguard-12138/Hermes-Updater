import styled from "@emotion/styled";
import { spacing } from "@mui/system";
import {
  Alert as MuiAlert,
  Button as MuiButton,
  Divider as MuiDivider,
  LinearProgress as MuiLinearProgress,
  TextField as MuiTextField,
  Typography as MuiTypography,
} from "@mui/material";

const Alert = styled(MuiAlert)(spacing);
const Button = styled(MuiButton)(spacing);
const Divider = styled(MuiDivider)(spacing);
const LinearProgress = styled(MuiLinearProgress)(spacing);
const TextField = styled(MuiTextField)(spacing);
const Typography = styled(MuiTypography)(spacing);

export { Alert, Button, Divider, LinearProgress, TextField, Typography };
