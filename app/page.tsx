"use client"; // Adiciona esta linha no início do arquivo
import { Button } from "@/components/ui/button";
/* eslint-disable */
import { Input } from "@/components/ui/input";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import unifiedJasonProduct from "./utils/unifiedJson";
import processCsv from "./utils/process.csv";
import { isCPF, isCNPJ } from "validation-br";
import splitIntoChunks from "./utils/splitIntoChunks";
import downloadJson from "./utils/downloadJson";
import Doc from "./utils/doc";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@radix-ui/react-accordion";

// Definição de tipo para o objeto JSON
interface Product {
  seq: string;
  codigo?: string;
  situacao?: string;
  cpfCnpjRaiz?: string;
}

export default function Home() {
  const [jsonFile, setJsonFile] = useState<any | null>(null);
  const [jsonFileUpdated, setJsonFileUpdated] = useState<any | null>(null);
  const [jsonProductUnified, setJsonProductUnified] = useState<any | null>(
    null
  );
  const [jsonFileDesativated, setJsonFileDesativated] = useState<any | null>(
    null
  );
  const [csvFile, setCsvFile] = useState<Record<string, string> | null>(null);
  const [rootCpfCnpj, setRootCpfCnpj] = useState<string>("");
  const [notification, setNotification] = useState<string>("");
  const [allowDownload, setAllowDownload] = useState(false);
  const [allowDownloadDesativate, setallowDownloadDesativate] = useState(false);
  const [docValid, setDocValid] = useState(false);
  //const [joinTheSame, setJoinTheSame] = useState(false);
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

  const cpfCnpjValidate = () => isCPF(rootCpfCnpj) || isCNPJ(rootCpfCnpj);

  // Função para inserir/atualizar o CPF/CNPJ raiz
  const updateJsonWithCpfCnpj = () => {
    const validate = cpfCnpjValidate();

    if (!validate) {
      setNotification(`CPF/CNPJ inválido 🧐`);
      setDocValid(false);
    } else {
      setNotification("Documento válido 😎");
      const rootCpfCnpjValue = isCPF(rootCpfCnpj)
        ? rootCpfCnpj
        : rootCpfCnpj.slice(0, 8);

      setDocValid(true);
    }

    if (jsonFile && validate) {
      const updatedJson = jsonFile.map((item: any) => {
        if (item.seq) {
          const cpfRoot = rootCpfCnpj?.replace(/\D/g, "");
          item.cpfCnpjRaiz = cpfRoot;
        }
        return item;
      });

      setJsonFileUpdated(updatedJson);

      const jsonUpdateJsonUnified = unifiedJasonProduct(updatedJson);
      jsonUpdateJsonUnified.produtosUnificados.sort(
        (a: any, b: any) => a.seq - b.seq
      );
      setJsonProductUnified(jsonUpdateJsonUnified);
    } else {
      showMessage(
        "Por favor, selecione o arquivo JSON corretamente e informe o CPF/CNPJ."
      );
      setAllowDownload(false);
    }
  };

  const downloadProduct = (
    product: any,
    situacao: string,
    rootCpfCnpjValue: string,
    text: string
  ) => {
    const isValidate = cpfCnpjValidate();
    if (!isValidate || !jsonFile) {
      showMessage(
        "Por favor, insira o CPF/CNPJ corretamente e selecione o arquivo JSON corretamente."
      );
      return;
    }

    if (splitJsonFile) {
      const chunksFiles = splitIntoChunks(product, 100);
      downloadJson(chunksFiles, situacao, rootCpfCnpjValue, text);
      return;
    }
    downloadJson([product], situacao, rootCpfCnpjValue, text);
  };

  // Função para desativar os produtos, gerar novo JSON e dividir em partes de 100 itens
  const handleDeactivateProducts = () => {
    if (jsonFileUpdated && csvFile) {
      // Atualiza os produtos com as informações do CSV e desativa
      const updatedJson = jsonFileUpdated.map((item: any) => {
        if (item.seq && csvFile[item.seq]) {
          item.codigo = csvFile[item.seq];
        }
        //item.situacao = "Desativado";
        return item;
      });
      setJsonFileDesativated(updatedJson);
    } else {
      showMessage("Por favor, selecione os arquivos JSON e CSV corretamente.");
      setallowDownloadDesativate(false);
    }
  };

  useEffect(() => {
    if (rootCpfCnpj.length > 0) {
      setNotification("");
      return;
    }
  }, [rootCpfCnpj]);

  useEffect(() => {
    if (jsonProductUnified) {
      setAllowDownload(true);
    }
  }, [jsonProductUnified]);

  useEffect(() => {
    if (jsonFileDesativated && csvFile) {
      setallowDownloadDesativate(true);
    }
  }, [jsonFileDesativated, csvFile]);

  useEffect(() => {
    if (!jsonFile) {
      setAllowDownload(false);
      setallowDownloadDesativate(false);
      setJsonProductUnified(null);
      setJsonFileUpdated(null);
      setJsonFileDesativated(null);
      setCsvFile(null);
      setRootCpfCnpj("");
      setDocValid(false);
      setSplitJsonFile(false);
      setNotification("");
    }
  }, [jsonFile]);

  return (
    <div className="dark:bg-gray-900 bg-slate-50 text-gray-700 items-center justify-items-center min-h-screen pb-1 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col w-full items-center">
        <div className="py-4">
          <div>
            <h1 className="w-full text-center font-bold text-2xl pb-2">
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
                <label className="font-bold sm:text-xl" htmlFor="cpf-cnpj">
                  Informe o CPF ou CNPJ
                </label>
              </div>
              <Input
                className="bg-green-300 hover:bg-green-400 mb-0 mt-2"
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
                {/* switch toggle dividir */}
                <label className="inline-flex justify-between cursor-pointer md:justify-end gap-2">
                  <span className="ms-0 text-sm font-medium">
                    Dividir arquivo Json em partes de 100 ?
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
            <div className="bg-white w-full rounded-lg border px-3 py-2">
              <div className="relative flex items-center justify-center">
                <p className="font-bold text-xl text-center">
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
                  className="w-full bg-blue-200 hover:bg-blue-400 font-bold py-2 px-4 rounded"
                  onClick={() => updateJsonWithCpfCnpj()}
                >
                  ATUALIZAR
                </button>
              </div>
              {allowDownload && (
                <div className="flex gap-2 py-2">
                  <button
                    className="w-full bg-blue-200 hover:bg-blue-400 font-bold py-2 px-4 rounded"
                    onClick={() =>
                      downloadProduct(
                        jsonProductUnified?.produtosUnificados,
                        "ativado",
                        rootCpfCnpj,
                        "unidos"
                      )
                    }
                  >
                    Baixar Unidos
                  </button>
                  <button
                    className="w-full bg-blue-200 hover:bg-blue-400 font-bold py-2 px-4 rounded"
                    onClick={() =>
                      downloadProduct(
                        jsonFileUpdated,
                        "ativado",
                        rootCpfCnpj,
                        "sem_unir"
                      )
                    }
                  >
                    Baixar sem Unir
                  </button>
                </div>
              )}
            </div>

            {/* seção pós testes */}
            <div className="bg-white w-full rounded-lg border px-3 py-2">
              <div>
                <p className="w-full text-center font-bold text-xl">
                  Desativar Produtos
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
                  className="w-full bg-red-300 hover:bg-red-400 font-bold py-2 px-4 rounded"
                  onClick={handleDeactivateProducts}
                >
                  DESATIVAR
                </button>
              </div>
              {allowDownloadDesativate && (
                <div className="flex gap-2 py-2">
                  <button
                    className="w-full bg-blue-200 hover:bg-blue-400 font-bold py-2 px-4 rounded"
                    onClick={() =>
                      downloadProduct(
                        jsonFileDesativated,
                        "Desativado",
                        rootCpfCnpj,
                        "desativado"
                      )
                    }
                  >
                    Baixar Desativados
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        {/* Show info */}
        <div className="flex flex-col gap-4 w-11/12 border mt-4 bg-white rounded-lg p-4 shadow">
          <div>
            <div className="flex justify-between">
              <h2 className="text-base font-semibold">Total de códigos (PN)</h2>
              <span className="text-base font-semibold">
                {jsonProductUnified?.totalCodigos}
              </span>
            </div>
            <div className="flex justify-between mt-1">
              <h2 className="text-base font-semibold">
                Total de produtos após unir os idênticos
              </h2>
              <span className="text-base font-semibold">
                {jsonProductUnified?.totalProdutos}
              </span>
            </div>
          </div>

          {/* Produtos Dinâmicos */}
          <div className="pt-2">
            <Accordion type="single" collapsible className="w-full">
              <h3 className="text-lg font-bold mb-2">Produtos</h3>

              {jsonProductUnified?.produtosUnificados?.map((produto: any) => (
                <AccordionItem
                  key={produto?.seq}
                  value={`item-${produto?.seq}`}
                  className="text-base font-medium"
                >
                  <AccordionTrigger className="flex items-center w-full">
                    <p className="pr-2">{produto?.seq}</p>
                    <p>{produto?.denominacao}</p>
                    <span className="ml-auto text-sm font-light">
                      Qtd. cód.: {produto?.codigosInterno.length}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="text-sm font-normal pl-6 mt-2">
                    <p>
                      Descrição:{" "}
                      {produto?.descricao
                        ? produto?.descricao
                        : "Não havia descrição do produto"}
                    </p>
                    <p className="mt-1">Códigos agrupados:</p>
                    <div className="pl-2">
                      {produto?.codigosInterno.join(", ")}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>

        {/* Documentação */}
        {<Doc />}
      </main>
    </div>
  );
}
