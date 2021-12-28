import React, { useCallback, useState } from "react";
import { styled } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Typography from "@mui/material/Typography";
import Section from "./Section";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import DatePicker from "@mui/lab/DatePicker";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import ruLocale from "date-fns/locale/ru";
import { Tooltip } from "@mui/material";

/**
 * War period.
 */
const Period = {
  from: new Date(1941, 5, 21),
  to: new Date(1945, 4, 9),
};

const SidebarBody = styled("div")(({ theme }) => ({
  padding: theme.spacing(2),
  width: "min(70vw, 300px)",
}));

const SidebarHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  width: "100%",
}));

const Title = styled(Typography)(({ theme }) => ({
  marginLeft: theme.spacing(1),
}));

const SidebarSection = styled(Section)(({ theme }) => ({
  marginTop: theme.spacing(4),
}));

const Field = styled("div")(({ theme }) => ({
  display: "block",
  width: "100%",
  marginBottom: theme.spacing(2),
}));

enum AddressType {
  MODERN,
  HISTORIC,
}

type SidebarProps = {
  onBack: () => void;
  className?: string;
};

function Sidebar(props: SidebarProps): JSX.Element {
  const { onBack, className } = props;
  const [addressType, setAddressType] = useState(AddressType.MODERN);
  const handleAddrType = useCallback(
    (event: SelectChangeEvent<AddressType>) =>
      setAddressType(event.target.value as AddressType),
    []
  );

  const [minDate, setMinDate] = useState<Date | null>(null);
  const [maxDate, setMaxDate] = useState<Date | null>(null);

  return (
    <SidebarBody className={className}>
      <SidebarHeader>
        <Tooltip title="Назад">
          <IconButton onClick={onBack}>
            <ArrowBackIcon />
          </IconButton>
        </Tooltip>
        <Title variant="h5">Поиск</Title>
      </SidebarHeader>
      <SidebarSection title="Адрес">
        <Field>
          <FormControl fullWidth>
            <InputLabel>Искать</InputLabel>
            <Select
              value={addressType}
              label="Искать"
              onChange={handleAddrType}
            >
              <MenuItem value={AddressType.MODERN}>Современный адрес</MenuItem>
              <MenuItem value={AddressType.HISTORIC}>
                Исторический адрес
              </MenuItem>
            </Select>
          </FormControl>
        </Field>
        <Field>
          <TextField label="Улица" variant="outlined" fullWidth />
        </Field>
        <Field>
          <TextField label="Дом" variant="outlined" type="number" fullWidth />
        </Field>
      </SidebarSection>
      <SidebarSection title="Дата">
        <LocalizationProvider dateAdapter={AdapterDateFns} locale={ruLocale}>
          <Field>
            <DatePicker
              views={["day"]}
              label="От"
              value={minDate}
              onChange={setMinDate}
              renderInput={(params) => (
                <TextField {...params} helperText={null} fullWidth />
              )}
              minDate={Period.from}
              maxDate={maxDate || Period.to}
              defaultCalendarMonth={Period.from}
              mask="__.__.____"
            />
          </Field>
          <Field>
            <DatePicker
              views={["day"]}
              label="До"
              value={maxDate}
              onChange={setMaxDate}
              renderInput={(params) => (
                <TextField {...params} helperText={null} fullWidth />
              )}
              minDate={minDate || Period.from}
              maxDate={Period.to}
              defaultCalendarMonth={Period.to}
              mask="__.__.____"
            />
          </Field>
        </LocalizationProvider>
      </SidebarSection>
    </SidebarBody>
  );
}

export default Sidebar;
