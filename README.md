# next-auth
Esse é um componente de autenticação feito exclusivamente para isso, não está tão bonito pois não foi esse o objetivo do projeto. Eu decidi fazer esse componente de autenticação para poder masterizar minha skill nessa parte do front-end pois a maioria das vagas por ai tem essa parte de autenticação e validação como pré-requisito. Eu usei os cookies para armazenar meu token e refresh token com a lib nookies, fiz validação de permissão do usuário se ele pode ou não acessar tal pagina dependendo do tipo de permissão dada a ele, validação de autenticação ssr com next, se o usuário for para uma pagina que não tem permissão ele será redirecionado para a que ele tiver, que é o dashboard, se ele não estiver logado ele vai ser redirecionado para a tela de login, no vídeo eu mostro todas essas funções. Esse foi um projeto que me adicionou muito pois agora tenho MUITO mais conhecimento nessa parte do front.

#Como testar:
- Primeiro execute o backend com "yarn dev"
- Segundo execute "yarn" & "yarn dev" na pasta next-auth
- Terceiro abra no seu navegador http://localhost:3000/
