// Função para dividir o array em partes de tamanho 'chunkSize'
export default function splitIntoChunks(array: any[], chunkSize: number) {
  const result = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    result.push(array.slice(i, i + chunkSize));
  }
  return result;
}
