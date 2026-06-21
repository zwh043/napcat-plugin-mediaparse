// vite.config.ts
import { defineConfig } from "file:///sessions/upbeat-trusting-newton/mnt/outputs/dy-src/src/webui/node_modules/vite/dist/node/index.js";
import react from "file:///sessions/upbeat-trusting-newton/mnt/outputs/dy-src/src/webui/node_modules/@vitejs/plugin-react/dist/index.js";
import { viteSingleFile } from "file:///sessions/upbeat-trusting-newton/mnt/outputs/dy-src/src/webui/node_modules/vite-plugin-singlefile/dist/esm/index.js";
import { resolve } from "path";
var __vite_injected_original_dirname = "/sessions/upbeat-trusting-newton/mnt/outputs/dy-src/src/webui";
var vite_config_default = defineConfig({
  plugins: [react(), viteSingleFile()],
  base: "./",
  build: {
    outDir: "dist",
    emptyOutDir: true,
    cssCodeSplit: false,
    assetsInlineLimit: 1e8,
    rollupOptions: {
      input: {
        main: resolve(__vite_injected_original_dirname, "index.html")
      },
      output: {
        inlineDynamicImports: true
      }
    }
  },
  server: {
    proxy: {
      "/api": "http://localhost:6099",
      "/plugin": "http://localhost:6099"
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvc2Vzc2lvbnMvdXBiZWF0LXRydXN0aW5nLW5ld3Rvbi9tbnQvb3V0cHV0cy9keS1zcmMvc3JjL3dlYnVpXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvc2Vzc2lvbnMvdXBiZWF0LXRydXN0aW5nLW5ld3Rvbi9tbnQvb3V0cHV0cy9keS1zcmMvc3JjL3dlYnVpL3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9zZXNzaW9ucy91cGJlYXQtdHJ1c3RpbmctbmV3dG9uL21udC9vdXRwdXRzL2R5LXNyYy9zcmMvd2VidWkvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJ1xuaW1wb3J0IHJlYWN0IGZyb20gJ0B2aXRlanMvcGx1Z2luLXJlYWN0J1xuaW1wb3J0IHsgdml0ZVNpbmdsZUZpbGUgfSBmcm9tICd2aXRlLXBsdWdpbi1zaW5nbGVmaWxlJ1xuaW1wb3J0IHsgcmVzb2x2ZSB9IGZyb20gJ3BhdGgnXG5cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gICAgcGx1Z2luczogW3JlYWN0KCksIHZpdGVTaW5nbGVGaWxlKCldLFxuICAgIGJhc2U6ICcuLycsXG4gICAgYnVpbGQ6IHtcbiAgICAgICAgb3V0RGlyOiAnZGlzdCcsXG4gICAgICAgIGVtcHR5T3V0RGlyOiB0cnVlLFxuICAgICAgICBjc3NDb2RlU3BsaXQ6IGZhbHNlLFxuICAgICAgICBhc3NldHNJbmxpbmVMaW1pdDogMTAwMDAwMDAwLFxuICAgICAgICByb2xsdXBPcHRpb25zOiB7XG4gICAgICAgICAgICBpbnB1dDoge1xuICAgICAgICAgICAgICAgIG1haW46IHJlc29sdmUoX19kaXJuYW1lLCAnaW5kZXguaHRtbCcpLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIG91dHB1dDoge1xuICAgICAgICAgICAgICAgIGlubGluZUR5bmFtaWNJbXBvcnRzOiB0cnVlLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICB9LFxuICAgIHNlcnZlcjoge1xuICAgICAgICBwcm94eToge1xuICAgICAgICAgICAgJy9hcGknOiAnaHR0cDovL2xvY2FsaG9zdDo2MDk5JyxcbiAgICAgICAgICAgICcvcGx1Z2luJzogJ2h0dHA6Ly9sb2NhbGhvc3Q6NjA5OScsXG4gICAgICAgIH0sXG4gICAgfSxcbn0pXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQXlXLFNBQVMsb0JBQW9CO0FBQ3RZLE9BQU8sV0FBVztBQUNsQixTQUFTLHNCQUFzQjtBQUMvQixTQUFTLGVBQWU7QUFIeEIsSUFBTSxtQ0FBbUM7QUFLekMsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDeEIsU0FBUyxDQUFDLE1BQU0sR0FBRyxlQUFlLENBQUM7QUFBQSxFQUNuQyxNQUFNO0FBQUEsRUFDTixPQUFPO0FBQUEsSUFDSCxRQUFRO0FBQUEsSUFDUixhQUFhO0FBQUEsSUFDYixjQUFjO0FBQUEsSUFDZCxtQkFBbUI7QUFBQSxJQUNuQixlQUFlO0FBQUEsTUFDWCxPQUFPO0FBQUEsUUFDSCxNQUFNLFFBQVEsa0NBQVcsWUFBWTtBQUFBLE1BQ3pDO0FBQUEsTUFDQSxRQUFRO0FBQUEsUUFDSixzQkFBc0I7QUFBQSxNQUMxQjtBQUFBLElBQ0o7QUFBQSxFQUNKO0FBQUEsRUFDQSxRQUFRO0FBQUEsSUFDSixPQUFPO0FBQUEsTUFDSCxRQUFRO0FBQUEsTUFDUixXQUFXO0FBQUEsSUFDZjtBQUFBLEVBQ0o7QUFDSixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
