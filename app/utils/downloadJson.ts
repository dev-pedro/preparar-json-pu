// Função para fazer o download dos arquivos gerados
export default function downloadJson(
  chunks: any[],
  situacao: string,
  rootCpfCnpj: string,
  text: string
) {
  const downloadName = (arr: any[], index: number) =>
    arr.length === 1
      ? `produtos_${rootCpfCnpj}_${situacao}_${text}.json`
      : `produtos_${rootCpfCnpj}_${situacao}_${text}_${index + 1}.json`;

  // Gera os arquivos de partes divididas
  chunks.forEach((chunk, index, arrayTotal) => {
    const blob = new Blob([JSON.stringify(chunk, null, 2)], {
      type: "application/json",
    });

    // Cria um nome de arquivo para cada parte, ex: 'produtos_desativados_parte_1.json'
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = downloadName(arrayTotal, index);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });
}
