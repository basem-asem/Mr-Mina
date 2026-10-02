import { useRef, useState } from "react";
import Box from "@mui/material/Box";
import { IconButton, InputAdornment, TextField } from "@mui/material";
import { Close, Magnify } from "mdi-material-ui";

export default function SearchField({ value = "", onChange, placeholder = "Search", sx = {}, expandedWidth = 260, fullWidth = false, size = "small" }) {
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const inputRef = useRef(null);
  const expanded = hovered || focused || Boolean(value);
  const expandedRootWidth = fullWidth ? "100%" : { xs: "100%", sm: expandedWidth };

  return <Box
    onMouseEnter={() => setHovered(true)}
    onMouseLeave={() => setHovered(false)}
    onFocusCapture={() => setFocused(true)}
    onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false); }}
    sx={{
      flexShrink: 0,
      width: expanded ? expandedRootWidth : 48,
      transition: "width 260ms cubic-bezier(.2,.8,.2,1)",
      ...sx,
    }}
  >
    <TextField
      inputRef={inputRef}
      size={size}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={expanded ? placeholder : ""}
      fullWidth
      type="text"
      autoComplete="off"
      inputProps={{ "aria-label": placeholder, tabIndex: expanded ? 0 : -1 }}
      sx={{
        width: "100%",
        "& .MuiOutlinedInput-root": {
          borderRadius: 999,
          backgroundColor: "background.paper",
          transition: "box-shadow 150ms ease, border-color 150ms ease",
          "&:hover": { boxShadow: "0 3px 12px rgba(33, 45, 110, 0.08)" },
          "&.Mui-focused": { boxShadow: "0 3px 14px rgba(33, 45, 110, 0.14)" },
        },
        "& .MuiInputBase-input": {
          minWidth: 0,
          width: expanded ? "100%" : 0,
          paddingLeft: expanded ? undefined : 0,
          paddingRight: expanded ? undefined : 0,
          opacity: expanded ? 1 : 0,
          transition: "width 260ms cubic-bezier(.2,.8,.2,1), opacity 160ms ease",
        },
        "& .MuiInputAdornment-positionStart": { marginRight: expanded ? 1 : 0 },
      }}
      InputProps={{
        startAdornment: <InputAdornment position="start"><IconButton size="small" aria-label={expanded ? placeholder : `Open ${placeholder.toLowerCase()}`} onClick={() => inputRef.current?.focus()} edge="start"><Magnify fontSize="small" color="action" /></IconButton></InputAdornment>,
        endAdornment: value && expanded ? <InputAdornment position="end"><IconButton size="small" aria-label="Clear search" onClick={() => { onChange(""); inputRef.current?.focus(); }} edge="end"><Close fontSize="small" /></IconButton></InputAdornment> : null,
      }}
    />
  </Box>;
}
