import React, { useCallback } from "react";
import { HitType, hitTypes, hitTypeText, isHitType } from "../../model";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Checkbox from "@mui/material/Checkbox";
import ListItemText from "@mui/material/ListItemText";
import OutlinedInput from "@mui/material/OutlinedInput";

type HitTypeSelectProps = {
  types: HitType[];
  onChange: (types: HitType[]) => void;
  className?: string;
};

/**
 * Parse HitTypes
 */
function parseHitTypes(value: string): HitType[] {
  const types: HitType[] = [];
  for (const element of value.split(",")) {
    const numericElement = Number(element);
    if (isHitType(isHitType(numericElement))) {
      types.push(numericElement);
    }
  }
  return types;
}

export default function HitTypeSelect(props: HitTypeSelectProps): JSX.Element {
  const { types, onChange, className } = props;

  const handleChange = useCallback(
    (event: SelectChangeEvent<HitType[]>) => {
      const value = event.target.value;
      if (typeof value === "string") {
        onChange(parseHitTypes(value));
      } else {
        onChange(value);
      }
    },
    [types, onChange]
  );

  return (
    <div className={className}>
      <FormControl fullWidth>
        <InputLabel id="hit-type-select-label">Тип</InputLabel>
        <Select
          labelId="hit-type-select-label"
          multiple
          value={types}
          onChange={handleChange}
          input={<OutlinedInput label="Тип" />}
          renderValue={(selected: HitType[]) =>
            selected.map(hitTypeText).join(", ")
          }
        >
          {hitTypes.map((type) => (
            <MenuItem key={type} value={type}>
              <Checkbox checked={types.includes(type)} />
              <ListItemText primary={hitTypeText(type)} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}
