// Função para unificar os produtos do JSON com a "descricao" ou "denominacao" e mesma NCM
export default function unifiedJsonProduct(jsonProduct: any[]) {
  // Usar reduce para agrupar os produtos por "descricao" , "denominacao" ou atributos idênticos
  const unificados = jsonProduct.reduce((acc: any, produto: any) => {
    // Função para remover ".", "," ou ";" do final do texto, se houver
    const removePontuacaoFinal = (texto: string) => {
      return texto
        .trim()
        .replace(/[.,;]$/, "")
        .trim();
    };

    // Determinar a chave de agrupamento com "descricao" ou "denominacao" + NCM
    const chave = `${removePontuacaoFinal(
      produto.descricao
    )}_${removePontuacaoFinal(
      produto.denominacao
    )}_${produto.ncm.trim()}_${JSON.stringify(produto.atributos).trim()}`;

    // Remover pontuações no final de "denominacao" e "descricao"
    produto.denominacao = removePontuacaoFinal(produto.denominacao);
    produto.descricao = removePontuacaoFinal(produto.descricao);

    // Verifica se já existe um produto com a mesma chave (descricao/denominacao + NCM)
    if (!acc[chave]) {
      // Se não existir, cria um novo agrupamento com os atributos do produto
      acc[chave] = {
        ...produto,
        codigosInterno: [...produto.codigosInterno], // Copia os codigosInterno
      };
    } else {
      // Se já existir, mescla os "codigosInterno" dos produtos duplicados
      acc[chave].codigosInterno = [
        ...Array.from(
          new Set([...acc[chave].codigosInterno, ...produto.codigosInterno])
        ),
      ];
    }

    return acc;
  }, {});

  // Converter o objeto de agrupamento para um array de produtos unificados
  const produtosUnificados = Object.values(unificados);

  // Calcular o total de produtos após unir os idênticos
  const totalProdutos = produtosUnificados.length;

  // Calcular o total de códigos após unir os idênticos
  const totalCodigos = produtosUnificados.reduce(
    (acc: number, produto: any) => acc + produto.codigosInterno.length,
    0
  );

  // Retornar o total de produtos, total de códigos e os produtos unificados
  return {
    totalProdutos,
    totalCodigos,
    produtosUnificados,
  };
}
