# Block-ManageCertificates-Chain
## Projeto Truffle
Essa parte do projeto destina-se a solucionar a emissão e gerenciamento de certificados de conclusão de curso de forma descentralizada e distribuida.

## Regra de negócio
1. Qualquer usuário é elegível a cadastrar-se como uma instituição de ensino. O KYC desse usuário não é atribuição desse contrato, portanto não há restrição quanto a isso.
2. O estudante entretanto só pode ser inserido como tal por uma escola.
3. A escola não podera cadastrar-se como estudante pois isso caracterizaria que ela pode emitir certificado pra si mesmo.
4. O usuário "escola" pode ser cadastrado como estudante, mas apenas por outra instituição.
5. A escola tem acesso à emissão de certificados para os alunos.
6. O aluno tem a possibilidade de dar acesso à usuários distintos aos seus certificados bem como revogar o acesso. A iniciativa visa atender questões de LGPD.
7. A emissão do certificado ocorre passando para o método "emiteCertificate" o estudante, a escola e o hash do diploma emitido.

## Discussões sobre o projeto
Existe toda uma questão legal envolvida nessa solução, como comprovação de que a escola é realmente uma escola e que o aluno realmente é um aluno daquela instituição. 
Essas questões podem ser resolvidas futuramente caso exista um oracle que de alguma forma associe o address à uma identidade externa ao blockchain para comprovar essa identidade, ou ainda fazer uso de alguma forma de interoperabilidade com algum contrato/blockchain especializado em identidade. 

Da mesma forma os certificados não possuem uma garantia que são de fato hashs de certificados emitidos extra blockchain, podem ser strings vazias que não representam nada, mas novamente, o controle disso dependeria de serviços externos. 

Ainda sobre os certificados, uma vez que são emitido valendo-se do IPFS, tal hash estara disponível à todos indenpendente do controle feito pelo smart contract, basta apenas ter o hash para acessar o conteúdo.
Sobre isso ainda estamos em fase de maturação.

## Como interagir com o contrato?
- Antes de mais nada instale as dependencias do projeto rodando o comando ```npm install```
- O código base dessa solução encontra-se no caminho: ../contracts/ManageCertificate.sol   
No arquivo ../truffle.js ou ../truffle-config.js existe configuração especifica para realizar o deploy do projeto em 2 redes: ganache_local (caso possua o ganache_desktop) e ropsten.  
É preciso criar um arquivo na raiz do projeto chamado .env com o mneumonico da conta que pretende usar pra fazer o deploy. Há um arquivo de exempo de qual variavel deve ser setada, chamado .env.example

- Na raiz do projeto rode o comando ```truffle ``` depois ```migrate --reset ``` Isso fara com que uma rede local seja criada com 10 contas de teste e o deploy seja feito para essa rede.  
Caso queira realizar o deploy em alguma rede especifica rode o comando ```truffle migrate --reset --network <nome-da-rede> ```  

- O address do contrato estara disponivel em dois lugares depois dos passos acima
1. No próprio log gerado pelo deploy com o nome de "contract address"
2. No arquivo ../build/contracts/ManageCertificate.json Nesse arquivo há um objeto chamado "networks" que guarda dentro de si informações dos deploys feitos em cada rede escolhida.  
Localize o número da rede na qual fez o deploy, dentro dela existe uma propriedade chamada "address" com a informação desejada.

- É possível ver os testes unitários realizados em cima do projeto disponível em ../test/ManageCertificate.test.js

- Para rodar os testes rode o comando ```truffle test ``` na raiz do projeto

## Informações sobre o contrato (Ropsten)
- endereço: [0x4bB92D8Ecb5691d9F8a26c1C5bF3b2664A57FB75](https://ropsten.etherscan.io/address/0x4bb92d8ecb5691d9f8a26c1c5bf3b2664a57fb75)
- transação: [0xb2e19aac0f487bc4adf5197009175a2aa5766bd58f6dbbe2c607465ee81fb498](https://ropsten.etherscan.io/tx/0xb2e19aac0f487bc4adf5197009175a2aa5766bd58f6dbbe2c607465ee81fb498)
- código verificado [0x4bb92d8ecb5691d9f8a26c1c5bf3b2664a57fb75](https://ropsten.etherscan.io/address/0x4bb92d8ecb5691d9f8a26c1c5bf3b2664a57fb75#code)




