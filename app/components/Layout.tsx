import { Box, GlobalStyles } from "@mui/joy";
import { Fragment, Suspense } from "react";
import { Outlet } from "react-router-dom";
import { Logo } from "./Logo";
import { Toolbar } from "./Toolbar";

/**
 * The main application layout.
 */
export function MainLayout(): JSX.Element {
  return (
    <Fragment>
      <GlobalStyles
        styles={{
          "#root": {
            display: "grid",
            gridTemplateColumns: "auto 1fr",
            gridTemplateRows: "auto 1fr",
            height: "100dvh",
          },
        }}
      />
      <Toolbar sx={{ gridArea: "1 / 2 / 2 / -1" }} />

      <Logo sx={{ gridArea: "1 / 1 / 2 / 2", zIndex: 100 }} />

      <Box sx={{ gridArea: "1 / 2 / -1 / -1", pt: "60px" }}>
        <Suspense>
          <Outlet />
        </Suspense>
      </Box>
    </Fragment>
  );
}

export function BaseLayout(): JSX.Element {
  return (
    <Fragment>
      <GlobalStyles
        styles={{
          "#root": {
            display: "grid",
            gridTemplateColumns: "1fr",
            minHeight: "100vh",
          },
        }}
      />

      <Box sx={{ gridArea: "1 / 1 / 2 / 2 " }}>
        <Logo />
      </Box>

      <Box sx={{ gridArea: "1 / 1 / -1 / -1", pt: "60px" }}>
        <Suspense>
          <Outlet />
        </Suspense>
      </Box>
    </Fragment>
  );
}