"use client"; // Adiciona esta linha no início do arquivo
import { Button } from "@/components/ui/button";
/* eslint-disable */
import { Input } from "@/components/ui/input";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import unifiedJasonProduct from "./utils/unifiedJson";
import processCsv from "./utils/process.Csv";
import { isCPF, isCNPJ } from "validation-br";
import splitIntoChunks from "./utils/splitIntoChunks";
import downloadJson from "./utils/downloadJson";

// Definição de tipo para o objeto JSON
interface Product {
  seq: string;
  codigo?: string;
  situacao?: string;
  cpfCnpjRaiz?: string;
}

export default function Home() {
  const [jsonFile, setJsonFile] = useState<any | null>(null);
  const [csvFile, setCsvFile] = useState<Record<string, string> | null>(null);
  const [rootCpfCnpj, setRootCpfCnpj] = useState<string>("");
  const [notification, setNotification] = useState<string>("");
  const [docValid, setDocValid] = useState(false);
  const [joinTheSame, setJoinTheSame] = useState(false);
  const [splitJsonFile, setSplitJsonFile] = useState(false);

  // Função para mostrar uma menssagem ao usuário
  const showMessage = (message: string) => alert(message);

  // Função para ler o arquivo JSON
  const handleJsonUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    mode: string
  ) => {
    const file = e.target.files?.[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = (event: ProgressEvent<FileReader>) => {
        try {
          const jsonData: Product[] = JSON.parse(
            event.target?.result as string
          );

          setJsonFile(jsonData);
        } catch (error) {
          console.error("Erro ao processar o JSON:", error);
        }
      };
      reader.readAsText(file);
    }
  };

  // Função para ler o arquivo CSV
  const handleCsvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event: ProgressEvent<FileReader>) => {
        const csvData = event.target?.result as string;
        // Chama a função para processar o CSV
        setCsvFile(processCsv(csvData));
      };
      reader.readAsText(file);
    }
  };

  // Função para inserir/atualizar o CPF/CNPJ raiz
  const handleUpdateRootCpfCnpj = (cpfCnpj: string) => {
    const validate = isCPF(cpfCnpj) || isCNPJ(cpfCnpj);

    if (!validate) {
      setNotification(`CPF/CNPJ inválido 🧐`);
      setDocValid(false);
      return;
    } else {
      setNotification("Documento válido 😎");
      setDocValid(true);
    }
    const rootCpfCnpj = isCPF(cpfCnpj) ? cpfCnpj : cpfCnpj.slice(0, 8);

    if (validate) {
      const updatedJson = jsonFile.map((item: any) => {
        if (item.seq) {
          const cpfRoot = rootCpfCnpj?.replace(/\D/g, "");
          item.cpfCnpjRaiz = cpfRoot;
        }
        return item;
      });

      setJsonFile(updatedJson);

      // Chama a função para unificar os produtos do JSON com a "descricao" ou "denominacao" e mesma NCM
      if (joinTheSame && splitJsonFile) {
        const jsonUpdateJsonUnified = unifiedJasonProduct(jsonFile);
        const chunksFiles = splitIntoChunks(jsonUpdateJsonUnified, 100);
        downloadJson(chunksFiles, "ativado", rootCpfCnpj);
      } else if (splitJsonFile) {
        const chunksFiles = splitIntoChunks(jsonFile, 100);
        // Download dos arquivos gerados
        downloadJson(chunksFiles, "ativado", rootCpfCnpj);
        return;
      } else if (joinTheSame) {
        const jsonUpdateJsonUnified = unifiedJasonProduct(jsonFile);
        // Download dos arquivos gerados
        downloadJson([jsonUpdateJsonUnified], "ativado", rootCpfCnpj);
        return;
      } else {
        // Download dos arquivos gerados
        downloadJson([jsonFile], "ativado", rootCpfCnpj);
      }
    } else {
      showMessage("Por favor, selecione os arquivos JSON corretamente.");
    }
  };

  // Função para desativar os produtos, gerar novo JSON e dividir em partes de 100 itens
  const handleDeactivateProducts = () => {
    if (jsonFile && csvFile) {
      // Atualiza os produtos com as informações do CSV e desativa
      const updatedJson = jsonFile.map((item: any) => {
        if (item.seq && csvFile[item.seq]) {
          item.codigo = csvFile[item.seq];
        }
        item.situacao = "Desativado";
        return item;
      });

      // Divide o JSON atualizado em partes de 100 itens
      const chunks = splitIntoChunks(updatedJson, 100);
      // Download dos arquivos gerados
      downloadJson(chunks, "desativado", rootCpfCnpj);
    } else {
      showMessage("Por favor, selecione os arquivos JSON e CSV corretamente.");
    }
  };
  useEffect(() => {
    if (rootCpfCnpj.length > 0) {
      setNotification("");
      return;
    }
  }, [rootCpfCnpj]);

  return (
    <div className="bg-slate-100 text-gray-800 items-center justify-items-center min-h-screen pb-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col w-full">
        <div className="py-4">
          <div>
            <h1 className="w-full text-gray-500 text-center font-bold text-2xl pb-2">
              Preparar Arquivos para PU
            </h1>
          </div>
          <div className="absolute top-14 md:top-4  right-2 px-6">
            <Button asChild className="bg-blue-900 hover:bg-amber-600">
              <Link
                href="https://portalunico.siscomex.gov.br/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Siscomex
              </Link>
            </Button>
          </div>
        </div>
        <div className="flex flex-col w-full items-center ">
          <div className="flex flex-col items-center p-2 w-full">
            <div className="w-11/12 md:w-12/12">
              <div className="">
                <label
                  className="font-bold sm:text-xl text-gray-500"
                  htmlFor="cpf-cnpj"
                >
                  Informe o CPF ou CNPJ
                </label>
              </div>
              <Input
                className="bg-green-200 hover:bg-green-300 mb-0 mt-2"
                id="cpf-cnpj"
                name="cpf-cnpj"
                type="text"
                placeholder="Ex: 12345678000101"
                maxLength={14}
                minLength={11}
                onChange={(e) => setRootCpfCnpj(e.target.value)}
              />
              {/* Parágrafo reservado para exibir erros */}
              <p
                className={`flex items-start justify-center w-full text-sm mb-4 ${
                  docValid ? "text-green-700" : "text-red-500"
                } font-medium text-lg transition-opacity duration-300 h-2 ${notification}`}
              >
                {notification}
              </p>
              {/* switch toggle unir */}
              <div className="flex flex-col gap-1">
                <label className="inline-flex justify-between cursor-pointer md:justify-end gap-2">
                  <span className="ms-0 text-sm font-medium text-gray-900 dark:text-gray-300">
                    Unir semelhantes?
                  </span>
                  <input
                    id="join"
                    type="checkbox"
                    value=""
                    checked={joinTheSame}
                    className="sr-only peer"
                    onChange={(e) => setJoinTheSame(e.target.checked)}
                  />
                  <div className="relative w-9 h-5 mb-1 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
                {/* switch toggle dividir */}
                <label className="inline-flex justify-between cursor-pointer md:justify-end gap-2">
                  <span className="ms-0 text-sm font-medium text-gray-900 dark:text-gray-300">
                    Dividir arquivo Json?
                  </span>
                  <input
                    id="split"
                    type="checkbox"
                    value=""
                    checked={splitJsonFile}
                    className="sr-only peer"
                    onChange={(e) => setSplitJsonFile(e.target.checked)}
                  />
                  <div className="relative w-9 h-5 mb-1 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-2 w-11/12 md:w-12/12">
            {/* seção para pré testes */}
            <div className="bg-gray-50 w-full rounded-lg border px-3 py-2">
              <div className="relative flex items-center justify-center">
                <p className="text-gray-500 font-bold text-xl text-center">
                  Mudar/Atualizar CPF/CNPJ
                </p>
              </div>
              <div className="w-full text-xs">
                <div className="py-3">
                  <label htmlFor="jsonUpdate">
                    Arquivo para atualizar (JSON)
                  </label>
                  <Input
                    className="bg-blue-50 hover:bg-blue-300"
                    id="jsonUpdate"
                    type="file"
                    accept=".json"
                    onChange={(e) => handleJsonUpload(e, "activate")}
                  />
                </div>
              </div>
              <div className="">
                <button
                  className="w-full bg-blue-200 hover:bg-blue-400 text-gray-800 font-bold py-2 px-4 rounded"
                  onClick={() => handleUpdateRootCpfCnpj(rootCpfCnpj)}
                >
                  ATUALIZAR
                </button>
              </div>
            </div>

            {/* seção pós testes */}
            <div className="bg-gray-50 w-full rounded-lg border px-3 py-2">
              <div>
                <p className="w-full text-gray-500 text-center font-bold text-xl">
                  Desativar de Produtos
                </p>
              </div>
              <div className="w-full text-xs">
                <div className="py-3 text-right">
                  <label className="" htmlFor="test-result">
                    Resultado do teste (CSV)
                  </label>
                  <Input
                    className="bg-orange-200 hover:bg-orange-300"
                    id="test-result"
                    type="file"
                    accept=".csv"
                    onChange={handleCsvUpload}
                  />
                </div>
              </div>
              <div className="">
                <button
                  className="w-full bg-red-300 hover:bg-red-400 text-gray-800 font-bold py-2 px-4 rounded"
                  onClick={handleDeactivateProducts}
                >
                  DESATIVAR
                </button>
              </div>
            </div>
          </div>
        </div>
        <div>
          <div className="mt-8 p-6 bg-gray-100 rounded-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Como utilizar as Funcionalidades
            </h2>

            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                1. Informe o CPF ou CNPJ
              </h3>
              <p className="text-gray-600">
                No campo no topo da página, insira o número do{" "}
                <span className="font-medium text-gray-800">CPF ou CNPJ</span>{" "}
                para realizar as operações de atualização ou desativação nos
                produtos. O campo deve seguir o formato correto de{" "}
                <span className="italic">CPF/CNPJ</span>, como mostrado no
                exemplo.
              </p>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                2. Mudar CPF/CNPJ
              </h3>
              <p className="text-gray-600">
                Esta funcionalidade permite alterar o{" "}
                <span className="font-medium text-gray-800">CPF ou CNPJ</span>{" "}
                nos produtos presentes no arquivo JSON selecionado. Para isso,
                basta:
              </p>
              <ul className="list-disc list-inside text-gray-600">
                <li>
                  Escolher o arquivo JSON que contém os produtos que deseja
                  atualizar.
                </li>
                <li>
                  <span className="font-semibold text-green-600">
                    Os produtos serão agrupados caso a "Denominação do produto"
                    ou a "Descrição do produto" seja idêntica.
                  </span>
                </li>
                <li>
                  Clicar no botão{" "}
                  <span className="font-semibold text-blue-500">ATUALIZAR</span>{" "}
                  para aplicar as mudanças.
                </li>
              </ul>
              <p className="text-red-500 mt-2">
                <strong>Observação:</strong> Esta ação irá inserir ou atualizar
                o CPF/CNPJ em todos os produtos presentes no arquivo.
              </p>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                3. Desativar Produtos
              </h3>
              <p className="text-gray-600">
                Use essa função para{" "}
                <span className="font-medium text-gray-800">
                  desativar produtos
                </span>
                , alterando o status de "Ativado" para "Desativado". Para
                realizar a operação, siga os passos abaixo:
              </p>
              <ul className="list-disc list-inside text-gray-600">
                <li>
                  Selecione o arquivo JSON atualizado com os produtos para
                  desativar.
                </li>
                <li>
                  Escolha o arquivo CSV de resultados de testes anteriores.
                </li>
                <li>
                  Clique no botão{" "}
                  <span className="font-semibold text-red-500">DESATIVAR</span>{" "}
                  para concluir a operação.
                </li>
              </ul>
              <p className="text-red-500 mt-2">
                <strong>Atenção:</strong> Essa ação irá desativar todos os
                produtos listados no arquivo e substituir o CPF/CNPJ.
              </p>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                4. Informação sobre Divisão de Arquivos
              </h3>
              <p className="text-gray-600">
                Após realizar as ações de atualização ou desativação, os
                arquivos serão automaticamente{" "}
                <span className="font-medium text-gray-800">
                  divididos em grupos de 100 produtos
                </span>
                . Eles serão salvos na pasta{" "}
                <span className="font-semibold text-blue-500">Downloads</span>{" "}
                do sistema.
              </p>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                5. Acesso ao Siscomex
              </h3>
              <p className="text-gray-600">
                Utilize o botão{" "}
                <span className="font-semibold text-blue-500">Siscomex</span> no
                canto superior direito para acessar diretamente o sistema
                Siscomex e realizar operações relacionadas.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
