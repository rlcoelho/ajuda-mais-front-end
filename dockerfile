# Use uma imagem oficial do Nginx como base
FROM nginx:stable

# Crie um diretório dentro da imagem para os arquivos do seu projeto
WORKDIR /usr/share/nginx/html/css/
WORKDIR /usr/share/nginx/html/js/
WORKDIR /usr/share/nginx/html/img/

# Copie os arquivos HTML, CSS e JS para a imagem
COPY index.html /usr/share/nginx/html/
COPY /js/bootstrap.bundle.min.js /usr/share/nginx/html/js/
COPY /js/scripts.js /usr/share/nginx/html/js/
COPY /css/bootstrap.min.css /usr/share/nginx/html/css/
COPY /css/styles.css /usr/share/nginx/html/css/
COPY /img/heart_plus.png /usr/share/nginx/html/img/
COPY /img/user.png /usr/share/nginx/html/img/

# Exponha a porta 80 (a porta padrão do Nginx)
EXPOSE 80

# Comando para iniciar o servidor Nginx
CMD ["nginx", "-g", "daemon off;"]