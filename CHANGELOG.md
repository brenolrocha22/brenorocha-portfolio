# Changelog

Mudanças publicadas em https://brenorocha.vercel.app. Datas no formato AAAA-MM-DD.

## [0.4.0] — 2026-11-05

### Visual
- Redesign "cinemático": nova paleta azul-marinho profundo com azul-claro no lugar de grafite e âmbar (contraste AA em todos os textos).
- Header vira uma barra flutuante azul-clara, com recuo das bordas, o nome "Breno Rocha" em serif à esquerda e os links à direita.
- Home: hero ocupa a primeira tela, com a foto tratada em tons de azul (duotone) e bordas que se fundem ao fundo, o nome "Breno Rocha" gigante em serif em 2 linhas e as áreas "Dados", "IA generativa" e "Python" empilhadas no canto da foto.
- Home: o slogan vira texto de apoio (com "reais" em itálico), seguido da linha de apresentação e dos botões "Ver projetos" e "Falar comigo".
- Status em estilo de metadado técnico ("DISPONÍVEL // RECIFE_PE") e faixa de provas numerada (01)(02)(03).
- Seções com rótulos numerados, como "(02) Projetos em destaque", e títulos grandes em serif; o mesmo padrão nas páginas internas.
- Projetos em lista numerada 01–05 (número grande, título em serif, número-prova e seta), separada por linhas finas, na Home e em /projetos.
- Bloco final de contato com o título "Conecte-se com Breno Rocha".
- Imagens de compartilhamento (Open Graph) com a nova paleta.
- Foco do teclado continua visível, inclusive na barra azul-clara.

### Conteúdo
- A foto real do Breno entrou no site: hero da Home, /sobre e imagem de compartilhamento.
- O nome "Breno Rocha" passa a ser o título principal da Home; o slogan continua logo abaixo.

## [0.3.0] — 2026-11-05

### Visual
- Visual mais limpo e direto, com a mesma paleta e as mesmas fontes.
- Home: hero mais curto, com status "Disponível · Recife/PE", nome e área, slogan, uma linha de apoio e dois botões.
- Home: faixa com 3 provas abaixo dos botões (985 vendas do RAG-DIO, 5+ anos em vendas, inglês fluente).
- Grade técnica de linhas finas no hero e no bloco de contato, no lugar dos pontos.
- Foto do Breno no hero, em /sobre e na imagem de compartilhamento (Open Graph), com moldura e cantos âmbar. A foto entra assim que o arquivo `public/images/breno.jpg` for adicionado; até lá, aparece o monograma "BR".
- Com mouse, a foto fica em cinza e ganha cor ao passar o cursor; em telas de toque, fica sempre colorida.
- Cards de projeto: número-prova em destaque (ex.: "985 vendas"), resumo em 2 linhas e seta no canto.
- Diferencial sem caixas, separado por linhas finas.
- Botões com cantos mais retos e brilho âmbar discreto no hover; header com fundo mais translúcido.
- Animações mais curtas (até 200 ms) e desligadas com "reduzir movimento".

### Conteúdo
- Home: os 3 parágrafos de apresentação viraram uma linha: "Mais de 5 anos em vendas orientadas a metas, agora construindo projetos de dados e IA com testes e números conferíveis."
- Home: links de GitHub e LinkedIn saem do hero (seguem no rodapé e em /contato).
- Home: seção de projetos com o título "Problema real, números conferidos" e a contagem de destaques.

## [0.2.0] — 2026-11-04

### Conteúdo
- Conteúdo atualizado pelo currículo oficial de 2026.
- Sobre: experiência com empresa, cargo e período (My Cleaning Angel, remoto para os EUA em inglês; Estante Mágica; Jokerman, com a base de 240 para 800 contatos e o prêmio de melhor equipe do Brasil; EngeSol, com propostas de ROI e payback).
- Home: ficha com inglês fluente, mais de 5 anos em vendas orientadas a metas, KPIs e CRM, e as 985 vendas do RAG-DIO.
- Tecnologias reorganizadas por grupo (Dados e BI, Python, IA generativa, Web e ferramentas, Negócio).
  - SQL, JavaScript, React, TypeScript, MCP, GitHub Actions, LlamaIndex, ChromaDB e Chainlit passam a "uso em projetos", com link para o projeto que comprova.
- Certificações com instituição e período:
  - Profissão Programador e HTML e CSS: Paulo Borges.
  - Power BI Expert na Prática: Viscari Cursos.
  - Novos: Santander RAG e IA Generativa (em andamento) e Accenture Python para Análise e Automação de Dados.
- Projetos:
  - RAG-DIO: base real de 985 vendas, com nomes anonimizados.
  - Control: 24 testes, MCP com Plaid Sandbox e demo no Lovable.
  - Porsche: tratamento da base crua de 100 vendas.

## [0.1.0] — 2026-11-04

### Lançamento
- Primeira versão do portfólio, com 8 páginas: Home, Sobre, Projetos, Projeto (detalhe), Soluções, Tecnologias, Certificações e Contato.
- 5 estudos de caso com números conferidos no código: RAG-DIO, Detecção de fraude, Control, Casa em Dia e Porsche Sales Dashboard.
- Formulário de contato com validação, proteção contra spam e alternativa por e-mail e LinkedIn.
- Selos do GitHub (última atualização, linguagens, estrelas, licença), atualizados a cada 24 h.
- SEO: sitemap, robots, Open Graph com imagem gerada, JSON-LD (Person, SoftwareSourceCode, BreadcrumbList).
- Segurança: CSP e headers de segurança; nenhum segredo no repositório.
