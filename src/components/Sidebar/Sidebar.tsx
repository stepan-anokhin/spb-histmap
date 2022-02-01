import React, { useCallback } from "react";
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
import produce from "immer";
import { Checkbox, FormControlLabel, Tooltip } from "@mui/material";
import { AddressType, AppOptions, HitType } from "../../model";
import HitTypeSelect from "./HitTypeSelect";

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

const SidebarHeader = styled("div")({
  display: "flex",
  alignItems: "center",
  width: "100%",
});

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

type SidebarProps = {
  onBack: () => void;
  options: AppOptions;
  onChange: (options: AppOptions) => void;
  className?: string;
};

function Sidebar(props: SidebarProps): JSX.Element {
  const { options, onChange, onBack, className } = props;

  const handleAddrType = useCallback(
    (event: SelectChangeEvent<AddressType>) =>
      onChange(
        produce(options, (updated) => {
          updated.hit.addrType = event.target.value as AddressType;
        })
      ),
    [options, onChange]
  );

  const handleStreet = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) =>
      onChange(
        produce(options, (updated) => {
          updated.hit.street = event.target.value;
        })
      ),
    [options, onChange]
  );

  const handleHouseNum = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) =>
      onChange(
        produce(options, (updated) => {
          const houseNum = Number(event.target.value);
          if (!isNaN(houseNum) && houseNum >= 1) {
            updated.hit.houseNumber = Math.floor(houseNum);
          } else {
            updated.hit.houseNumber = null;
          }
        })
      ),
    [options, onChange]
  );

  const handleMinDate = useCallback(
    (minDate: Date | null) =>
      onChange(
        produce(options, (updated) => {
          updated.hit.minDate = minDate;
        })
      ),
    [options, onChange]
  );

  const handleMaxDate = useCallback(
    (maxDate: Date | null) =>
      onChange(
        produce(options, (updated) => {
          updated.hit.maxDate = maxDate;
        })
      ),
    [options, onChange]
  );

  const handleShowFrontLine = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) =>
      onChange(
        produce(options, (updated) => {
          updated.frontLine.show = event.target.checked;
          if (!event.target.checked) {
            updated.frontLine.date = null;
          }
        })
      ),
    [options, onChange]
  );

  const handleTypes = useCallback(
    (newTypes: HitType[]) =>
      onChange(
        produce(options, (updated) => {
          updated.hit.types = newTypes;
        })
      ),
    [options, onChange]
  );

  const handleFrontDate = useCallback(
    (date: Date | null) =>
      onChange(
        produce(options, (updated) => {
          updated.frontLine.date = date;
        })
      ),
    [options, onChange]
  );

  return (
    <SidebarBody className={className}>
      <LocalizationProvider dateAdapter={AdapterDateFns} locale={ruLocale}>
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
                value={options.hit.addrType}
                label="Искать"
                onChange={handleAddrType}
              >
                <MenuItem value={AddressType.MODERN}>
                  Современный адрес
                </MenuItem>
                <MenuItem value={AddressType.HISTORIC}>
                  Исторический адрес
                </MenuItem>
              </Select>
            </FormControl>
          </Field>
          <Field>
            <TextField
              label="Улица"
              variant="outlined"
              fullWidth
              value={options.hit.street || ""}
              onChange={handleStreet}
            />
          </Field>
          <Field>
            <TextField
              label="Дом"
              variant="outlined"
              type="number"
              fullWidth
              value={options.hit.houseNumber || ""}
              onChange={handleHouseNum}
            />
          </Field>
        </SidebarSection>
        <SidebarSection title="Дата">
          <Field>
            <DatePicker
              views={["day"]}
              label="От"
              value={options.hit.minDate}
              onChange={handleMinDate}
              renderInput={(params) => (
                <TextField {...params} helperText={null} fullWidth />
              )}
              minDate={Period.from}
              maxDate={options.hit.maxDate || Period.to}
              defaultCalendarMonth={Period.from}
              mask="__.__.____"
            />
          </Field>
          <Field>
            <DatePicker
              views={["day"]}
              label="До"
              value={options.hit.maxDate}
              onChange={handleMaxDate}
              renderInput={(params) => (
                <TextField {...params} helperText={null} fullWidth />
              )}
              minDate={options.hit.minDate || Period.from}
              maxDate={Period.to}
              defaultCalendarMonth={Period.to}
              mask="__.__.____"
            />
          </Field>
        </SidebarSection>
        <SidebarSection title="Тип Попадания">
          <Field>
            <HitTypeSelect
              types={options.hit.types || []}
              onChange={handleTypes}
            />
          </Field>
        </SidebarSection>
        <SidebarSection title="Линия Фронта">
          <Field>
            <FormControlLabel
              control={
                <Checkbox
                  checked={options.frontLine.show}
                  onChange={handleShowFrontLine}
                />
              }
              label="Показать линию фронта"
            />
          </Field>
          <Field>
            <DatePicker
              views={["day"]}
              label="На момент"
              value={options.frontLine.date}
              onChange={handleFrontDate}
              renderInput={(params) => (
                <TextField {...params} helperText={null} fullWidth />
              )}
              minDate={Period.from}
              maxDate={Period.to}
              defaultCalendarMonth={Period.from}
              mask="__.__.____"
            />
          </Field>
        </SidebarSection>
      </LocalizationProvider>
    </SidebarBody>
  );
}

export default Sidebar;
