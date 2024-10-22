import React from "react";

const Doc = () => {
  return (
    <div className="p-8 bg-gray-50 text-gray-500">
      <h2 className="text-3xl font-semibold text-center mb-6">
        Como Utilizar as Funcionalidades
      </h2>

      <div>
        <h3 className="text-xl font-semibold">Descrição:</h3>
        <p>
          Esta ferramenta basicamente faz a comparação de produtos contidos em
          um arquivo "JSON".
          <br />
          Ela verifica produtos semelhantes/idêntico baseado na "Denominação do
          produto", "Descrição do produto" e nos "Atributos", com base na
          comparação dessas três informações considera um produto
          semelhante/idêntico caso encontre outros produtos iguais, e uni os PNs
          dos produtos em um único produto dentro da chave "codigoInterno".
          <br />
          Também é possível visualizar algumas informações dos produtos na mesma
          tela, como os PNs unificados bem como a descrição e denominação dos
          mesmos.
        </p>
        <p></p>
        <p className="mb-6"></p>
      </div>
      {/* <!-- CPF/CNPJ --> */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-2">1. Informe o CPF ou CNPJ</h3>
        <p className="className">
          No campo destacado em verde no topo da página, insira o número do CPF
          ou CNPJ no formato correto (Ex: 04301504000100). O sistema validará
          automaticamente o número informado. Caso seja válido, uma mensagem
          indicará que o documento está correto, permitindo prosseguir com as
          operações.
        </p>
      </div>

      {/* <!-- Mudar/Atualizar CPF/CNPJ --> */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-2">
          2. Mudar/Atualizar CPF/CNPJ
        </h3>
        <p className="className">
          Para alterar ou atualizar o CPF ou CNPJ em produtos listados em um
          arquivo JSON, siga os passos abaixo:
        </p>
        <ul className="list-disc list-inside pl-4 className mt-2">
          <li>
            Selecione o arquivo JSON contendo os produtos clicando em{" "}
            <strong>"Escolher ficheiro"</strong>.
          </li>
          <li>
            Clique no botão <strong>"ATUALIZAR"</strong> para aplicar as
            mudanças de CPF/CNPJ aos produtos.
          </li>
          <li>
            Após validar o CPF/CNPJ e carregar o arquivo corretamente,
            aparecerão duas opções:
            <strong>"Baixar Unidos"</strong> e{" "}
            <strong>"Baixar sem Unir"</strong>.
          </li>
          <li>
            O botão <strong>"Baixar Unidos"</strong> permite baixar o arquivo
            com produtos agrupados, caso tenham denominação ou descrição
            idênticas.
          </li>
          <li>
            O botão <strong>"Baixar sem Unir"</strong> permite baixar o arquivo
            sem agrupar os produtos.
          </li>
        </ul>
      </div>

      {/*  <!-- Desativar Produtos --> */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-2">3. Desativar Produtos</h3>
        <p className="className">
          Esta funcionalidade permite desativar produtos listados em um arquivo
          JSON, alterando seu status de "Ativado" para "Desativado". Para
          realizar a operação:
        </p>
        <ul className="list-disc list-inside pl-4 className mt-2">
          <li>
            Selecione o arquivo CSV com os resultados dos testes clicando em{" "}
            <strong>"Escolher ficheiro"</strong>.
          </li>
          <li>
            Após a validação e o carregamento correto dos arquivos, o botão{" "}
            <strong>"DESATIVAR"</strong> ficará habilitado para concluir a
            operação.
          </li>
          <li>
            Depois de desativar os produtos, aparecerá a opção{" "}
            <strong>"Baixar Desativados"</strong>, que permite o download da
            lista de produtos desativados.
          </li>
        </ul>
        <p className="className mt-1 text-red-400">
          <span className="font-bold">Atenção: </span> Todos os produtos
          listados no arquivo serão desativados.
        </p>
      </div>

      {/*  <!-- Opções após validação --> */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-2">
          4. Informações Adicionais
        </h3>
        <p className="className">
          Após a validação correta do CPF/CNPJ e o carregamento dos arquivos,
          algumas informações extras aparecerão na tela:
        </p>
        <ul className="list-disc list-inside pl-4 className mt-2">
          <li>
            <strong>Total de códigos (PN):</strong> Exibe o número total de
            códigos de produtos no arquivo.
          </li>
          <li>
            <strong>Total de produtos após unir os idênticos:</strong> Mostra o
            número de produtos após a unificação, caso a opção "Baixar Unidos"
            seja usada.
          </li>
        </ul>

        <h4 className="text-lg font-semibold mt-4">Lista de Produtos</h4>
        <p className="className">
          Uma lista de produtos com suas quantidades será exibida após o
          carregamento do arquivo, permitindo verificar os detalhes antes de
          prosseguir com a atualização ou desativação.
        </p>
        <p className="mt-1 text-green-600">
          <span className="font-bold">Obs: </span>É possível expandir os itens
          da lista para ver mais detalhes.
        </p>
      </div>

      {/* <!-- Opções de Divisão de Arquivo --> */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-2">
          5. Dividir Arquivo JSON em Partes de 100
        </h3>
        <p className="className">
          Caso necessário, é possível ativar a opção{" "}
          <strong>"Dividir arquivo JSON em partes de 100"</strong> no canto
          superior direito da tela. Esta funcionalidade divide o arquivo JSON em
          múltiplos arquivos, cada um contendo até 100 produtos.
        </p>
      </div>

      {/* !-- Acesso ao Siscomex -- */}
      <div>
        <h3 className="text-xl font-semibold mb-2">6. Acesso ao Siscomex</h3>
        <p className="className">
          No canto superior direito, você pode clicar no botão{" "}
          <strong>Siscomex</strong> para acessar diretamente o sistema Siscomex
          e realizar operações relacionadas à importação e exportação de
          produtos.
        </p>
      </div>
      <div>
        <div className="flex justify-center mt-8">
          <a
            href="https://github.com/dev-pedro"
            target="_blank"
            className="px-4 py-2 text-blue-500 font-semibold font-serif"
          >
            <span className="text-gray-500 font-semibold">Develope by - </span>{" "}
            Pedro Henrique
          </a>
        </div>
      </div>
    </div>
  );
};

export default Doc;
