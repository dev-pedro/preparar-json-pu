// Função para processar o CSV
export default function processCsv(csvData: string) {
  const lines = csvData.split("\n");
  const codigoDict: Record<string, string> = {};

  lines.slice(1).forEach((line) => {
    // Divide a linha em 'sequencial' e 'codigo', remove espaços em branco, aspas extras e caracteres como '\r'
    let [sequencial, codigo] = line.split(";").map((value) => value.trim());

    // Remove aspas extras de cada valor
    sequencial = sequencial.replace(/"/g, "");
    codigo = codigo.replace(/"/g, "");
    //console.log(codigo); // Verificação para visualizar o código sem o \r e aspas

    if (sequencial && codigo) {
      codigoDict[sequencial] = codigo;
    }
  });

  return codigoDict;
}
