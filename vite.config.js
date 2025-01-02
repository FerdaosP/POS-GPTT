export default defineConfig({
plugins: [react()],
define: {
    "process.env": {},
},
  base: "./",
resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
 },
server: {
     host: true,
     port: 5173,
     proxy: {
        '/api': {
          target: 'http://localhost:8000',
           changeOrigin: true,
          secure: false,
        },
      },
  },
});