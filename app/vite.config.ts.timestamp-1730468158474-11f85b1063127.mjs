// vite.config.ts
import react from "file:///C:/Users/gusta/Dev/hermetica-technical-assignment/.yarn/__virtual__/@vitejs-plugin-react-virtual-d834ac7983/3/AppData/Local/Yarn/Berry/cache/@vitejs-plugin-react-npm-4.2.1-8b9705c544-10.zip/node_modules/@vitejs/plugin-react/dist/index.mjs";
import { URL, fileURLToPath } from "node:url";
import { loadEnv } from "file:///C:/Users/gusta/Dev/hermetica-technical-assignment/.yarn/__virtual__/vite-virtual-797bff1acb/3/AppData/Local/Yarn/Berry/cache/vite-npm-5.1.2-b48a600f22-10.zip/node_modules/vite/dist/node/index.js";
import { defineProject } from "file:///C:/Users/gusta/Dev/hermetica-technical-assignment/.yarn/__virtual__/vitest-virtual-39d6d54b19/3/AppData/Local/Yarn/Berry/cache/vitest-npm-1.2.2-fe6dae0383-10.zip/node_modules/vitest/dist/config.js";
var __vite_injected_original_import_meta_url = "file:///C:/Users/gusta/Dev/hermetica-technical-assignment/app/vite.config.ts";
var publicEnvVars = [
  "APP_NAME",
  "GOOGLE_CLOUD_PROJECT",
  "FIREBASE_APP_ID",
  "FIREBASE_API_KEY",
  "FIREBASE_AUTH_DOMAIN",
  "GA_MEASUREMENT_ID"
];
var vite_config_default = defineProject(async ({ mode }) => {
  const envDir = fileURLToPath(new URL("..", __vite_injected_original_import_meta_url));
  const env = loadEnv(mode, envDir, "");
  publicEnvVars.forEach((key) => {
    if (!env[key])
      throw new Error(`Missing environment variable: ${key}`);
    process.env[`VITE_${key}`] = env[key];
  });
  return {
    cacheDir: fileURLToPath(new URL("../.cache/vite-app", __vite_injected_original_import_meta_url)),
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            firebase: ["firebase/analytics", "firebase/app", "firebase/auth"],
            react: ["react", "react-dom", "react-router-dom"]
          }
        }
      }
    },
    plugins: [
      // The default Vite plugin for React projects
      // https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md
      react({
        jsxImportSource: "@emotion/react",
        babel: {
          plugins: ["@emotion/babel-plugin"]
        }
      })
    ],
    server: {
      proxy: {
        "/api": {
          target: process.env.LOCAL_API_ORIGIN ?? process.env.API_ORIGIN,
          changeOrigin: true
        }
      }
    },
    test: {
      ...{ cache: { dir: "../.cache/vitest" } },
      environment: "happy-dom"
    }
  };
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxndXN0YVxcXFxEZXZcXFxcaGVybWV0aWNhLXRlY2huaWNhbC1hc3NpZ25tZW50XFxcXGFwcFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcZ3VzdGFcXFxcRGV2XFxcXGhlcm1ldGljYS10ZWNobmljYWwtYXNzaWdubWVudFxcXFxhcHBcXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL2d1c3RhL0Rldi9oZXJtZXRpY2EtdGVjaG5pY2FsLWFzc2lnbm1lbnQvYXBwL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHJlYWN0IGZyb20gXCJAdml0ZWpzL3BsdWdpbi1yZWFjdFwiO1xuaW1wb3J0IHsgVVJMLCBmaWxlVVJMVG9QYXRoIH0gZnJvbSBcIm5vZGU6dXJsXCI7XG5pbXBvcnQgeyBsb2FkRW52IH0gZnJvbSBcInZpdGVcIjtcbmltcG9ydCB7IGRlZmluZVByb2plY3QgfSBmcm9tIFwidml0ZXN0L2NvbmZpZ1wiO1xuXG5jb25zdCBwdWJsaWNFbnZWYXJzID0gW1xuICBcIkFQUF9OQU1FXCIsXG4gIFwiR09PR0xFX0NMT1VEX1BST0pFQ1RcIixcbiAgXCJGSVJFQkFTRV9BUFBfSURcIixcbiAgXCJGSVJFQkFTRV9BUElfS0VZXCIsXG4gIFwiRklSRUJBU0VfQVVUSF9ET01BSU5cIixcbiAgXCJHQV9NRUFTVVJFTUVOVF9JRFwiLFxuXTtcblxuLyoqXG4gKiBWaXRlIGNvbmZpZ3VyYXRpb24uXG4gKiBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xuICovXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVQcm9qZWN0KGFzeW5jICh7IG1vZGUgfSkgPT4ge1xuICBjb25zdCBlbnZEaXIgPSBmaWxlVVJMVG9QYXRoKG5ldyBVUkwoXCIuLlwiLCBpbXBvcnQubWV0YS51cmwpKTtcbiAgY29uc3QgZW52ID0gbG9hZEVudihtb2RlLCBlbnZEaXIsIFwiXCIpO1xuXG4gIHB1YmxpY0VudlZhcnMuZm9yRWFjaCgoa2V5KSA9PiB7XG4gICAgaWYgKCFlbnZba2V5XSkgdGhyb3cgbmV3IEVycm9yKGBNaXNzaW5nIGVudmlyb25tZW50IHZhcmlhYmxlOiAke2tleX1gKTtcbiAgICBwcm9jZXNzLmVudltgVklURV8ke2tleX1gXSA9IGVudltrZXldO1xuICB9KTtcblxuICByZXR1cm4ge1xuICAgIGNhY2hlRGlyOiBmaWxlVVJMVG9QYXRoKG5ldyBVUkwoXCIuLi8uY2FjaGUvdml0ZS1hcHBcIiwgaW1wb3J0Lm1ldGEudXJsKSksXG5cbiAgICBidWlsZDoge1xuICAgICAgcm9sbHVwT3B0aW9uczoge1xuICAgICAgICBvdXRwdXQ6IHtcbiAgICAgICAgICBtYW51YWxDaHVua3M6IHtcbiAgICAgICAgICAgIGZpcmViYXNlOiBbXCJmaXJlYmFzZS9hbmFseXRpY3NcIiwgXCJmaXJlYmFzZS9hcHBcIiwgXCJmaXJlYmFzZS9hdXRoXCJdLFxuICAgICAgICAgICAgcmVhY3Q6IFtcInJlYWN0XCIsIFwicmVhY3QtZG9tXCIsIFwicmVhY3Qtcm91dGVyLWRvbVwiXSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9LFxuXG4gICAgcGx1Z2luczogW1xuICAgICAgLy8gVGhlIGRlZmF1bHQgVml0ZSBwbHVnaW4gZm9yIFJlYWN0IHByb2plY3RzXG4gICAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vdml0ZWpzL3ZpdGUtcGx1Z2luLXJlYWN0L2Jsb2IvbWFpbi9wYWNrYWdlcy9wbHVnaW4tcmVhY3QvUkVBRE1FLm1kXG4gICAgICByZWFjdCh7XG4gICAgICAgIGpzeEltcG9ydFNvdXJjZTogXCJAZW1vdGlvbi9yZWFjdFwiLFxuICAgICAgICBiYWJlbDoge1xuICAgICAgICAgIHBsdWdpbnM6IFtcIkBlbW90aW9uL2JhYmVsLXBsdWdpblwiXSxcbiAgICAgICAgfSxcbiAgICAgIH0pLFxuICAgIF0sXG5cbiAgICBzZXJ2ZXI6IHtcbiAgICAgIHByb3h5OiB7XG4gICAgICAgIFwiL2FwaVwiOiB7XG4gICAgICAgICAgdGFyZ2V0OiBwcm9jZXNzLmVudi5MT0NBTF9BUElfT1JJR0lOID8/IHByb2Nlc3MuZW52LkFQSV9PUklHSU4sXG4gICAgICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9LFxuXG4gICAgdGVzdDoge1xuICAgICAgLi4ueyBjYWNoZTogeyBkaXI6IFwiLi4vLmNhY2hlL3ZpdGVzdFwiIH0gfSxcbiAgICAgIGVudmlyb25tZW50OiBcImhhcHB5LWRvbVwiLFxuICAgIH0sXG4gIH07XG59KTtcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBNlYsT0FBTyxXQUFXO0FBQy9XLFNBQVMsS0FBSyxxQkFBcUI7QUFDbkMsU0FBUyxlQUFlO0FBQ3hCLFNBQVMscUJBQXFCO0FBSCtMLElBQU0sMkNBQTJDO0FBSzlRLElBQU0sZ0JBQWdCO0FBQUEsRUFDcEI7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUNGO0FBTUEsSUFBTyxzQkFBUSxjQUFjLE9BQU8sRUFBRSxLQUFLLE1BQU07QUFDL0MsUUFBTSxTQUFTLGNBQWMsSUFBSSxJQUFJLE1BQU0sd0NBQWUsQ0FBQztBQUMzRCxRQUFNLE1BQU0sUUFBUSxNQUFNLFFBQVEsRUFBRTtBQUVwQyxnQkFBYyxRQUFRLENBQUMsUUFBUTtBQUM3QixRQUFJLENBQUMsSUFBSSxHQUFHO0FBQUcsWUFBTSxJQUFJLE1BQU0saUNBQWlDLEdBQUcsRUFBRTtBQUNyRSxZQUFRLElBQUksUUFBUSxHQUFHLEVBQUUsSUFBSSxJQUFJLEdBQUc7QUFBQSxFQUN0QyxDQUFDO0FBRUQsU0FBTztBQUFBLElBQ0wsVUFBVSxjQUFjLElBQUksSUFBSSxzQkFBc0Isd0NBQWUsQ0FBQztBQUFBLElBRXRFLE9BQU87QUFBQSxNQUNMLGVBQWU7QUFBQSxRQUNiLFFBQVE7QUFBQSxVQUNOLGNBQWM7QUFBQSxZQUNaLFVBQVUsQ0FBQyxzQkFBc0IsZ0JBQWdCLGVBQWU7QUFBQSxZQUNoRSxPQUFPLENBQUMsU0FBUyxhQUFhLGtCQUFrQjtBQUFBLFVBQ2xEO0FBQUEsUUFDRjtBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUEsSUFFQSxTQUFTO0FBQUE7QUFBQTtBQUFBLE1BR1AsTUFBTTtBQUFBLFFBQ0osaUJBQWlCO0FBQUEsUUFDakIsT0FBTztBQUFBLFVBQ0wsU0FBUyxDQUFDLHVCQUF1QjtBQUFBLFFBQ25DO0FBQUEsTUFDRixDQUFDO0FBQUEsSUFDSDtBQUFBLElBRUEsUUFBUTtBQUFBLE1BQ04sT0FBTztBQUFBLFFBQ0wsUUFBUTtBQUFBLFVBQ04sUUFBUSxRQUFRLElBQUksb0JBQW9CLFFBQVEsSUFBSTtBQUFBLFVBQ3BELGNBQWM7QUFBQSxRQUNoQjtBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUEsSUFFQSxNQUFNO0FBQUEsTUFDSixHQUFHLEVBQUUsT0FBTyxFQUFFLEtBQUssbUJBQW1CLEVBQUU7QUFBQSxNQUN4QyxhQUFhO0FBQUEsSUFDZjtBQUFBLEVBQ0Y7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
