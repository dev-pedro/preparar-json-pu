import React from "react";

const Doc = () => {
  return (
    <div className="px-6 md:px-14 pt-6 text-gray-500 dark:bg-gray-900 bg-transparent">
      <h2 className="text-3xl font-semibold text-center mb-6">
        Como Utilizar as Funcionalidades
      </h2>

      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-2">1. Informe o CPF ou CNPJ</h3>
        <p className="text-gray-700">
          Na parte superior da página, insira o número do CPF ou CNPJ no campo
          destacado em verde. Esse campo segue o formato correto de CPF ou CNPJ,
          como mostrado no exemplo (Ex: 12345678000101). Esse dado é necessário
          para realizar as operações de atualização ou desativação de produtos.
        </p>
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-2">
          2. Mudar/Atualizar CPF/CNPJ
        </h3>
        <p className="text-gray-700">
          Esta funcionalidade permite alterar ou atualizar o CPF ou CNPJ nos
          produtos contidos em um arquivo JSON. Para isso, siga os passos
          abaixo:
        </p>
        <ul className="list-disc list-inside pl-4 text-gray-700 mt-2">
          <li>
            Escolha o arquivo JSON contendo os produtos que deseja atualizar
            clicando em <strong>"Escolher ficheiro"</strong>.
          </li>
          <li>
            Após selecionar o arquivo, clique no botão
            <strong className="text-blue-600">"ATUALIZAR"</strong> para aplicar
            as mudanças.
          </li>
        </ul>
        <p className="text-orange-500 mt-2">
          Observação: O CPF/CNPJ será inserido ou atualizado em todos os
          produtos presentes no arquivo.
        </p>
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-2">3. Desativar Produtos</h3>
        <p className="text-gray-700">
          Esta funcionalidade permite desativar produtos, alterando seu status
          de "Ativado" para "Desativado". <br /> Para realizar a operação:
        </p>
        <ul className="list-disc list-inside pl-4 text-gray-700 mt-2">
          <li>
            Selecione o arquivo CSV (resultado do import) que foi baixado do PU
            durante o import do catalogo com o{" "}
            <strong>resultado do teste</strong> clicando em{" "}
            <strong>"Escolher ficheiro"</strong> na seção "Desativar de
            Produtos".
          </li>
          <li>
            Após a seleção, clique no botão{" "}
            <strong className="text-red-400">"DESATIVAR"</strong> para concluir
            a operação.
          </li>
          <li>
            Será gerado e baixado para a pasta "Downloads" o(s) arquivo(s),
            volte ao PU e faça o import desse(s) arquivos para efetivar a
            desativação.
          </li>
        </ul>
        <p className="text-red-500 mt-2">
          Atenção: Todos os produtos listados no arquivo serão marcados para
          desativação.
        </p>
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-2">
          4. Opções de Unir Semelhantes e Dividir Arquivo JSON
        </h3>
        <p className="text-gray-700">
          Na parte direita da tela, há duas opções adicionais que podem ser
          ativadas:
        </p>
        <ul className="list-disc list-inside pl-4 text-gray-700 mt-2">
          <li>
            <strong>Unir semelhantes?</strong>: Marque esta opção se quiser
            agrupar produtos cujas denominações ou descrições sejam idênticas
            durante a atualização.
          </li>
          <li>
            <strong>Dividir arquivo JSON?</strong>: Ative esta opção se quiser
            dividir o arquivo JSON automaticamente contendo 100 produtos por
            arquivo de acordo com o PU.
          </li>
        </ul>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-2">5. Acesso ao Siscomex</h3>
        <p className="text-gray-700">
          No canto superior direito da página, há um botão{" "}
          <strong className="font-bold text-blue-500">Siscomex</strong> que
          permite acessar diretamente o sistema Siscomex para realizar operações
          relacionadas à importação e exportação de produtos.
        </p>
      </div>

      <div className="flex justify-center content-end text-gray-700 text-sm mt-4 mb-2">
        <p>
          Developed by:{" "}
          <a
            href="https://github.com/dev-pedro"
            className="text-blue-500 hover:underline"
          >
            Pedro Henrique
          </a>
        </p>
      </div>
    </div>
  );
};

export default Doc;
