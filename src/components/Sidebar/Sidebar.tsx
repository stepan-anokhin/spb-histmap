import React from "react";
import { styled } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

const SidebarBody = styled("div")(({ theme }) => ({
  padding: theme.spacing(2),
  width: 300,
}));

const SidebarHeader = styled("div")(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  width: "100%",
  marginBottom: theme.spacing(2),
}));

const SidebarTextField = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  display: "block",
}));

type SidebarProps = {
  className?: string;
};

function Sidebar(props: SidebarProps): JSX.Element {
  const { className } = props;
  return (
    <SidebarBody className={className}>
      <SidebarHeader>
        <Typography variant="h6">Поиск</Typography>
      </SidebarHeader>
      <SidebarTextField label="Улица" variant="outlined" fullWidth />
      <SidebarTextField
        label="Дом"
        variant="outlined"
        type="number"
        fullWidth
      />
    </SidebarBody>
  );
}

export default Sidebar;
