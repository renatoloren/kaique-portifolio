/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  basePath: "/nome-do-seu-repositorio", // Substitua pelo nome do seu repo
  images: {
    unoptimized: true, // Necessário para GH Pages
  },
};
module.exports = nextConfig;
