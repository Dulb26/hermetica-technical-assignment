import { Box, BoxProps } from "@mui/joy";
import { Fragment, Suspense } from "react";
import { ColorSchemeButton } from "./ColorSchemeButton";

export function Toolbar(props: ToolbarProps): JSX.Element {
  const { sx, ...other } = props;

  return (
    <Box
      sx={{
        alignItems: "center",
        borderBottom: "1px solid",
        borderColor: "divider",
        display: "flex",
        gap: 1,
        px: 2,
        ...sx,
      }}
      component="header"
      {...other}
    >
      <Box sx={{ flexGrow: 1 }} component="span" />

      <Suspense>
        <ActionButtons />
      </Suspense>
    </Box>
  );
}

function ActionButtons(): JSX.Element {
  // const user = useCurrentUser();

  return (
    <Fragment>
      <ColorSchemeButton variant="soft" size="sm" />
    </Fragment>
  );
}

type ToolbarProps = Omit<BoxProps<"header">, "children">;
